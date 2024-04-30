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
    return {
      branch: branch
    }
  },
  methods: {
    cloneBranch() {
      this.storeBranch.cloneBranch(this.$route.params.branch_id, this.branch.version)
      this.$router.push({name: 'branches'})
    }
  }
}
</script>


<template id="branch-clone">
  <div>
    <h1>Clone branch</h1>
    <hr>
    <form @submit="cloneBranch" v-if="branch">
      <div className="form-group">
        <label htmlFor="edit-version">Version</label>
        <input className="form-control" id="edit-version" v-model="branch.version" required/>
      </div>
      <button type="submit" class="btn btn-primary">Clone</button>
      <router-link class="btn btn-outline-primary" role="button" to="/branch">Cancel</router-link>
    </form>
  </div>
</template>
