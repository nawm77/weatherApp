<script>

import {useBuildStore} from "@/stores/build";
import {useBranchStore} from '@/stores/branch'

export default {
  setup() {
    const storeBranch = useBranchStore()
    const storeBuild = useBuildStore()
    const settings = storeBranch.settings
    return {storeBuild, storeBranch, settings}
  },
  props: {
    branch_id: String
  },
  data() {
    const error = this.storeBranch?.error || this.storeBuild.error
    if (error && error.code != "0") this.$flashMessage.show({
      type: 'error',
      title: error.name + ': ' + error.code,
      text: error.message
    })

    const branch = this.storeBranch.findBranch(this.$route.params.branch_id);
    return {
      branch: branch,
      branch_id: this.branch_id,
      builds: this.storeBuild.items,
      searchKey: ''
    }
  },
  computed: {
    filteredBuilds: function () {
      this.$alert("Hello Vue Simple Alert.");

      return this.builds.filter((build) => {
        return build.buildNumber.indexOf(this.searchKey) > -1
            || build.composition.indexOf(this.searchKey) > -1
            || build.docComposition?.indexOf(this.searchKey) > -1
      })
    }
  },
  mounted() {
    this.storeBuild.fetchBuilds(this.branch_id)
  }
}
</script>

<template>
  <div>
    <div>
      <h1>{{ branch.solution + " " + branch.version }} Compare builds</h1>
      <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
      <router-link to="/branch">&nbsp;Back to branch list</router-link>
    </div>
    <hr>
    <div>
      <div class="row align-items-center">
        <div class="col">
          <select class="form-select" aria-label="Default select example">
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
        <div class="col">
          <select class="form-select" aria-label="Default select example">
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
      </div>
      <div class="row align-items-center">
        <textarea>sd</textarea>
      </div>
    </div>
  </div>
</template>