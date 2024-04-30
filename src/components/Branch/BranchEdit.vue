<script>
import {useBranchStore} from '@/stores/branch'

export default {
  setup() {
    const storeBranch = useBranchStore()
    return {storeBranch}
  },
  data() {
    const error = this.storeBranch?.error
    if (error && error.code != "0" ) this.$flashMessage.show({type: 'error', title: error.name +': '+ error.code, text: error.message })

    console.log(this.$route.params.branch_id);
    const branch = this.storeBranch.findBranch(this.$route.params.branch_id);
    return {
      branch: branch
    }
  },
  methods: {
    editBranch() {
      this.storeBranch.editBranch(this.$route.params.branch_id, this.branch)
      this.$router.push({name: 'branches'})
    }
  }
}
</script>


<template id="branch-edit">
  <div>
    <h1>Edit branch</h1>
    <hr>
    <form @submit="editBranch" v-if="branch">
      <div class="form-group">
        <label for="edit-solution">Solution</label>
        <input class="form-control" id="edit-solution" v-model="branch.solution" required/>
      </div>
      <div class="form-group">
        <label for="edit-version">Version</label>
        <input class="form-control" id="edit-version" v-model="branch.version" required/>
      </div>
      <div class="form-group">
        <label for="edit-link">Link</label>
        <textarea class="form-control" id="edit-link" rows="3" v-model="branch.link"></textarea>
      </div>
      <div class="form-group">
        <label for="edit-link">Emails</label>
        <textarea class="form-control" id="edit-emails" rows="3" v-model="branch.emails"></textarea>
      </div>
      <div class="form-group">
        <label for="edit-link">Deploy report emails</label>
        <textarea class="form-control" id="edit-deploy-emails" rows="3" v-model="branch.deployReportEmails"></textarea>
      </div>
      <div class="form-group">
        <label for="edit-comments">Comments</label>
        <textarea class="form-control" id="edit-comments" rows="10" v-model="branch.comments"></textarea>
      </div>
      <hr>
      <button type="submit" class="btn btn-primary">Save</button>
      <router-link class="btn btn-outline-primary" role="button" to="/branch">Cancel</router-link>
    </form>
  </div>
</template>
