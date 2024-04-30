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

    return {
      branches: this.storeBranch.items,
      searchKey: ''
    }
  },
  computed: {
    filteredBranchs: function () {
      return this.branches.filter((branch) => {
        return branch.solution.indexOf(this.searchKey) > -1
            || branch.version.indexOf(this.searchKey) > -1
            || (branch.link && branch.link.indexOf(this.searchKey) > -1)
      })
    }
  },
  mounted() {
    this.storeBranch.fetchBranches()
  },
  methods:{
    isAutoMode(branch) {
      if (branch.branchConfiguration !== null) {
        return branch.branchConfiguration.buildMode === 'AUTO'
      }
    }
  }
}

</script>


<template>
  <div>
    <div class="actions">
      <router-link class="btn btn-outline-primary" role="button" :to="{path: '/branchcreate'}">
        <span class="glyphicon glyphicon-plus"></span>
        Add branch
      </router-link>
    </div>
    <div class="filters row">
      <div class="form-group col-sm-3">
        <input placeholder="Search" v-model="searchKey" class="form-control" id="search-element" requred/>
      </div>
    </div>
    <table class="table table-striped">
      <thead>
      <tr>
        <th>Name</th>
        <th>Link</th>
        <th class="col-sm-2">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="branch in filteredBranchs">
        <td>
          <router-link :to="{name: 'branch-view', params: {branch_id: branch.id}}">
            {{ branch.solution + " " + branch.version }}
          </router-link>
          <i class="bi bi-robot" style="padding-left: 20px; color: #116bf4" v-if="isAutoMode(branch)"></i>
        </td>
        <td>{{ branch.link }}</td>
        <td>
          <router-link class="btn btn-outline-primary btn-sm" role="button"
                       :to="{name: 'branch-edit', params: {branch_id: branch.id}}">Edit
          </router-link>
          <router-link class="btn btn-outline-primary btn-sm" role="button"
                       :to="{name: 'branch-delete', params: {branch_id: branch.id}}">Delete
          </router-link>
          <router-link class="btn btn-outline-primary btn-sm" role="button"
                       :to="{name: 'branch-builds', params: {branch_id: branch.id}}">Builds
          </router-link>
          <router-link class="btn btn-outline-primary btn-sm" role="button"
                       :to="{name: 'branch-configuration', params: {branch_id: branch.id}}">Configuration
          </router-link>
          <router-link class="btn btn-outline-primary btn-sm" role="button"
                       :to="{name: 'branch-clone', params: {branch_id: branch.id}}">Clone
          </router-link>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>