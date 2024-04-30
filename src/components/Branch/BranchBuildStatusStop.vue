<script>

import {useBranchStore} from '@/stores/branch'
import {useStatusBuildStore} from '@/stores/status-build'

export default {
  setup() {
    const storeBranch = useBranchStore()
    const storeStatusBuild = useStatusBuildStore()
    return {storeBranch, storeStatusBuild}
  },
  data() {
    const error = this.storeBranch?.error
    const branch = this.storeBranch.findBranch(this.$route.params.branch_id);
    const status = this.storeStatusBuild.findStatus(this.$route.params.status_id);

    if (error && error.code != "0") this.$flashMessage.show({
      type: 'error',
      title: error.name + ': ' + error.code,
      text: error.message
    })

    return {
      branch: branch,
      status: status
    }
  },
  methods: {
    abortStatus: function () {
      this.storeStatusBuild.abortStatus(this.status.id)
      this.$router.push({
        name: 'branch-build-statuses',
        params: {branch_id: this.branch.id}
      })
    }
  }
}

</script>

<template>
  <div>
    <h1>Stop Status build {{ status.id }}</h1>
    <hr>
    <form @submit="abortStatus">
      <p>The action cannot be undone.</p>
      <button type="submit" class="btn btn-danger">Stop</button>
      <router-link class="btn btn-outline-primary" role="button"
                   :to="{name: 'branch-build-statuses', params: {branch_id: branch.id}}">Cancel
      </router-link>
    </form>
  </div>
</template>