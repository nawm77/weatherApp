<script setup>
import {Builds} from '@/components/Build'
</script>
<script>
import {useBranchStore} from '@/stores/branch'

export default {
  data() {
    const storeBranch = useBranchStore()
    const error = storeBranch.error
    if (error && error.code != "0") this.$flashMessage.show({
      type: 'error',
      title: error.name + ': ' + error.code,
      text: error.message
    })

    const branch = storeBranch.findBranch(this.$route.params.branch_id);
    console.log(this.$route.params.branch_id);
    return {
      branch: branch
    }
  },
}
</script>

<template>
  <div>
    <div>
      <h1>{{ branch.solution + " " + branch.version }}</h1>
      <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
      <router-link to="/branch">&nbsp;Back to branch list</router-link>
    </div>
    <hr>
    <builds :branch_id="branch.id"></builds>
  </div>
</template>