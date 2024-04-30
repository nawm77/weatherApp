<script>

import {useBranchStore} from '@/stores/branch'

export default {
  setup() {
    const storeBranch = useBranchStore()
    return {storeBranch}
  },
  data() {
    const storeBranch = useBranchStore()
    const error = this.storeBranch?.error
    const branch = this.storeBranch.findBranch(this.$route.params.branch_id);

    if (error && error.code != "0") this.$flashMessage.show({
      type: 'error',
      title: error.name + ': ' + error.code,
      text: error.message
    })

    return {
      branch: branch,
      statuses: this.storeBranch.statuses,
      searchKey: ''
    }
  },
  computed: {
    filteredStatuses: function () {
      return this.statuses.filter((status) => {
        return (status.status.indexOf(this.searchKey) > -1 ||
            status.buildNumber.indexOf(this.searchKey) > -1 ||
            status.id.indexOf(this.searchKey) > -1)
      })
    }
  },
  mounted() {
    this.storeBranch.fetchStatuses(this.branch.id)

  }
}

</script>


<template>
  <div>
    <div class="filters row">
      <div class="form-group col-sm-3">
        <input placeholder="Search" v-model="searchKey" class="form-control" id="search-element" requred/>
      </div>
    </div>
    <table class="table table-striped">
      <thead>
      <tr>
        <th>Id</th>
        <th>Build Number</th>
        <th>Status</th>
        <th>Action</th>
        <th class="col-sm-2">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="status in filteredStatuses">
        <td>{{status.id}}</td>
        <td>{{status.buildNumber}}</td>
        <td>{{status.status}}</td>
        <td>{{ status.action }}</td>
        <td>
          <div v-if="status.status=='IN PROGRESS'">
          <router-link class="btn btn-outline-primary btn-sm" role="button"
                       :to="{name: 'branch-build-status-stop', params: {branch_id: branch.id, status_id: status.id}}">Stop
          </router-link>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>