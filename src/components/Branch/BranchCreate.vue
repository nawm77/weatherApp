<script>
import {useBranchStore} from '@/stores/branch'
import {useExtensionStore} from "@/stores/extension";

export default {
  components: {},

  setup() {
    const storeBranch = useBranchStore()
    const storeExts = useExtensionStore()
    return {storeBranch, storeExts}
  },
  created() {
    this.getExensions()
  },
  data() {
    const error = this.storeBranch?.error
    if (error && error.code != "0") this.$flashMessage.show({
      type: 'error',
      title: error.name + ': ' + error.code,
      text: error.message
    })

    return {
      branch: {},
      extensions: this.storeExts.items,
      checkedExtensions: []
    }
  },
  methods: {
    createBranch() {
      this.storeBranch.createBranch(this.branch, this.checkedExtensions)
      this.$router.push({name: 'branches'})
    },
    getExensions() {
      this.storeExts.fetchExtensions()
    }
  },
}
</script>

<template>
  <div>
    <h1>Add new branch</h1>
    <hr>
    <form @submit="createBranch">
      <div class="container">
        <div class="row">
          <div class="col-sm-8">
            <div class="form-group">
              <label for="add-solution">Solution</label>
              <input class="form-control" id="add-solution" v-model="branch.solution" required/>
            </div>
            <div class="form-group">
              <label for="add-version">Version</label>
              <input class="form-control" id="add-version" v-model="branch.version" required/>
            </div>
            <div class="form-group">
              <label for="add-link">Link</label>
              <textarea class="form-control" id="add-link" rows="10" v-model="branch.link"></textarea>
            </div>
            <div class="form-group">
              <label for="add-comments">Comments</label>
              <textarea class="form-control" id="add-comments" rows="10" v-model="branch.comments"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
            <router-link class="btn btn-outline-primary" role="button" to="/branch">Cancel</router-link>
          </div>
          <div class="col-sm-4">
            <p>Extensions</p>
            <div>
              <div v-for="extension in extensions">
                <input class="form-check-input" type="checkbox" :value="extension.name" :id="extension.id" v-model="checkedExtensions">
                <label class="form-check-label" :for="extension.id">
                  {{ extension.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>