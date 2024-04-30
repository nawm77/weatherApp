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

    const branch = this.storeBranch.findBranch(this.$route.params.branch_id);
    return {
      branch: branch
    }
  },
  methods: {
    deleteBranch() {
      this.storeBranch.deleteBranch(this.$route.params.branch_id)
      this.$router.push({name: 'branches'})
    }
  }

}
</script>

<template>
  <div>
    <h1>Delete branch {{ branch.name }}</h1>
    <hr>
    <form @submit="deleteBranch">
      <p>The action cannot be undone.</p>
      <button type="submit" class="btn btn-danger">Delete</button>
      <router-link class="btn btn-outline-primary" role="button" to="/branch">Cancel</router-link>
    </form>
  </div>
</template>