<script>

import {useBranchStore} from '@/stores/branch'

export default {
  setup() {
    const storeBranch = useBranchStore()
    return {storeBranch}
  },
  data() {
    const error = this.storeBranch?.error
    if (error && error.code != "0") this.$flashMessage.show({
      type: 'error',
      title: error.name + ': ' + error.code,
      text: error.message
    })

    const branch = this.storeBranch.findBranch(this.$route.params.branch_id);
    console.log(branch)
    const defaultBranchConfiguration = {
      extensions:"",
      sidecars: "",
      id: NaN,
      comments: "",
      buildMode: "AUTO",
      excludedComponents: []
    }

    const branchConfiguration = branch.branchConfiguration
        ? branch.branchConfiguration
        : defaultBranchConfiguration;
    return {
      excludeInput: "",
      branch: branch,
      branchConfiguration: branchConfiguration,
      excludes: {
        showModal: false,
        components: null,
        isLoading: true
      },
      buildModes: [
          "AUTO",
          "MANUAL"
      ]
    }
  },
  methods: {
    editConfiguration() {
      //todo: remove unused updateComponentConfig
      this.storeBranch.updateBranchConfiguration(this.branch.id, this.branchConfiguration)
      this.$router.push({name: 'branches'})
    },
    removeExclude(exclude) {
      const index = this.branchConfiguration.excludedComponents.indexOf(exclude);
      if (index > -1) { // only splice array when item is found
        this.branchConfiguration.excludedComponents.splice(index, 1); // 2nd parameter means remove one item only
      }
    },
    addExclude() {
      if (this.excludeInput && this.branchConfiguration.excludedComponents.indexOf(this.excludeInput) < 0) {
        this.branchConfiguration.excludedComponents.push(this.excludeInput);
        this.excludeInput = "";
      }
    },
    getComponents() {
      this.excludes.isLoading = true;
      this.storeBranch.fetchComponents(this.branch.id).then((data) => {
        this.excludes.isLoading = false;
        this.excludes.components = []
        for (let item of data) {
          console.log(item)
          this.excludes.components.push({
            config: item.configuration,
            items: item.components.map((cp) => ({ buildr: this.getBuildr(cp), selected: false }))
          })
        }
        this.resetExcludesModel();
      })
    },
    resetExcludesModel() {
      this.excludes.components.forEach((cp) => {
        cp.items.forEach((item) => {
          item.selected = false;
          if (this.branchConfiguration.excludedComponents.indexOf(item.buildr) > -1)
            item.selected = true;
        });
      });
    },
    showExcludeModal() {
      this.excludes.showModal = true;
      if (!this.excludes.components) {
        this.getComponents();
      } else {
        this.resetExcludesModel();
      }
    },
    applyExcludes() {
      this.excludes.showModal = false;
      this.branchConfiguration.excludedComponents = [];
      this.excludes.components.forEach((cp) => {
        cp.items.forEach((item) => {
          if (item.selected)
            this.branchConfiguration.excludedComponents.push(item.buildr);
        });
      });
    },
    cancelExcludes() {
      this.excludes.showModal = false;
    },
    getConfigBuildr(config) {
      return config.repository + ":" + config.group + ":" + config.artifact + ":" + config.versionMask;
    },
    getBuildr(component) {
      return component.groupId + ":" + component.artifactId + ":" + component.extension + ":" + component.classifier + ":" + component.version;
    }
  }
}
</script>

<template>
  <div>
    <h1>Configuration {{ branch.solution + " " + branch.version }}</h1>
    <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>&nbsp;
    <router-link to="/branch">&nbsp;Back to branch list</router-link>
    <hr>
    <div>
      <form @submit="editConfiguration" v-if="branchConfiguration">
        <div class="row g-3">

          <div class="col-12">
            <label for="edit-buildmode" class="form-label">Build mode</label>
            <select class="form-select" id="edit-buildmode" aria-label="Build mode" v-model="branchConfiguration.buildMode">
              <option disabled value="">Please select one</option>
              <template v-for="buildMode in buildModes">
                <option :value="buildMode">{{buildMode}}</option>
              </template>
            </select>
          </div>
          <div class="col-12">
            <div class="form-floating">
              <textarea style="height:100px;" class="form-control" id="edit-extensions" v-model="branchConfiguration.extensions"></textarea>
              <label for="edit-extensions">Extensions</label>
            </div>
          </div>
          <div class="col-12">
            <div class="form-floating">
              <textarea style="height:100px;" class="form-control" id="edit-sidecars" v-model="branchConfiguration.sidecars"></textarea>
              <label for="edit-sidecars">Sidecars</label>
            </div>
          </div>
          <div class="col-12">
            <div class="form-floating">
              <textarea style="height:100px;" class="form-control" id="edit-sidecars" v-model="branchConfiguration.options"></textarea>
              <label for="edit-sidecars">Options</label>
            </div>
          </div>
          <div class="col-12">
            <div class="form-floating">
              <textarea style="height:100px;" class="form-control" id="edit-comments" v-model="branchConfiguration.comments"></textarea>
              <label for="edit-comments">Comments</label>
            </div>
          </div>
          <div class="col-12">
            <label for="button-addExclude" class="form-label">Excluded components</label>
            <ul class="list-group mb-3">
              <li class="list-group-item d-flex justify-content-between" v-for="(exclude, index) in branchConfiguration.excludedComponents" :index="index">
                {{ exclude }}
                <button type="button" @click="removeExclude(exclude)" class="btn btn-warning btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Remove component from excluded">
                  <i class="bi bi-trash"></i>
                </button>
              </li>
            </ul>
            <div class="input-group mb-3">
              <button class="btn btn-primary" type="button" id="button-addExclude" @click="showExcludeModal">
                <i class="bi bi-node-plus"></i>
                Modify excludes
              </button>
            </div>
            <BModal
                @ok="applyExcludes"
                @cancel="cancelExcludes"
                v-model="excludes.showModal"
                okTitle="Apply"
                cancelTitle="Cancel"
                size="lg"
                title="Exclude components"
            >
              <BOverlay :show="excludes.isLoading" rounded="sm" >
                <BTableSimple v-if="excludes.components" hover small caption-top responsive>
                  <BThead head-variant="dark">
                  </BThead>
                  <BTbody>
                    <template v-for="component in excludes.components">
                      <BTr variant="secondary">
                        <BTd>{{component.config.code}}</BTd>
                        <BTd>{{getConfigBuildr(component.config)}}</BTd>
                      </BTr>
                      <BTr v-for="item in component.items">
                        <BTd>
                          <BFormCheckbox v-model="item.selected" switch></BFormCheckbox>
                        </BTd>
                        <BTd>
                            {{item.buildr}}
                        </BTd>
                      </BTr>
                    </template>
                  </BTbody>
                </BTableSimple>
              </BOverlay>
            </BModal>
          </div>
          <hr>
          <div class="col-12">
            <button type="submit" class="btn btn-primary">Save</button>
            <router-link class="btn btn-outline-primary" role="button" to="/branch">Cancel</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>