<script>
import {useBranchStore} from '@/stores/branch'
import {useBuildStore} from '@/stores/build'

export default {
  setup() {
    const storeBranch = useBranchStore()
    const storeBuild = useBuildStore()
    return {storeBranch, storeBuild}
  },
  data() {
    const error = this.storeBranch?.error
    if (error && error.code != "0" ) this.$flashMessage.show({type: 'error', title: error.name +': '+ error.code, text: error.message })

    const branch = this.storeBranch.findBranch(this.$route.params.branch_id);
    return {
      branch: branch,
      config: false
    }
  },
  methods: {
    prepareBuild: function () {
      this.storeBuild.prepareBuild(this.branch.id, this.config)
      this.$router.push({
        name: 'branch-builds',
        params: {branch_id: this.branch.id}
      })
    }
  }
}
</script>

<template>
  <div>
    <h1>Prepare build branch {{ branch?.solution + " " + branch?.version }}</h1>
    <form @submit="prepareBuild">
      <p>The action cannot be undone.</p>
      <div class="mb-3">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="config" v-model="config">
          <label class="form-check-label" for="config">Prepare by component config</label>
        </div>
      </div>
      <hr>
      <button type="submit" class="btn btn-danger">Prepare</button>
      <router-link class="btn btn-outline-primary" role="button" :to="{name: 'branch-builds', params: {branch_id: branch?.id}}">Cancel</router-link>
    </form>
  </div>
</template>