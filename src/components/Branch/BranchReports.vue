<script>
import {useBranchStore} from '@/stores/branch'
import {Guid} from 'js-guid'

export default {
  setup() {
    const storeBranch = useBranchStore()
    const handleFileUpload = async () => {
    }
    return {storeBranch, handleFileUpload}
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
      branch: branch,
      files: []
    }
  },
  computed: {
    uploadFiles: function () {
      return this.files
    },
    uploadedReports: function () {
      const guid = Guid.newGuid().StringGuid
      return [{distrib: "distrib", id: guid}]
    }
  },
  methods: {
    addFile() {
      const guid = Guid.newGuid().StringGuid
      this.files.push({filePath: "Выбрать файл", id: guid})
    },
    deleteFile(id) {
      const i = this.files.find((it) => it.id === id);
      this.files.splice(i, 1)
    },
    selectFile(event) {
      const ufile = this.files.find((it) => it.id === event.target.id)
      ufile.fileData = event.target.files[0]
      // console.log("selected", this.$refs.fileInput.files)
      console.log("event", event.target.files)
      console.log("selected file", this.$refs.fileInput.files)
    },
    uploadBuildReports() {
      this.storeBranch.buildReport(this.branch.id, this.files)
          .then((response) => {
            this.$router.push({
              name: 'branch-builds',
              params: {branch_id: this.branch.id}
            })
          })
    }

  }

}

</script>

<template>
  <div>
    <h1>Upload reports for {{ branch.solution + " " + branch.version }}</h1>
    <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>&nbsp;
    <router-link :to="{name: 'branch-builds', params: {branch_id:branch.id}}">Back to branch</router-link>
    <hr>
    <div>
      <a class="btn btn-outline-primary" role="button" @click="addFile">
        Add File
      </a>
    </div>
    <form @submit="uploadReports">
      <table class="table">
        <thead>
        <tr>
          <th width="70%">File</th>
          <th width="30%">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ufile in uploadFiles">
          <td>
            <input type="file" :id="ufile.id" ref="fileInput" @change="selectFile">
          </td>
          <td>
            <a class="btn btn-outline-primary btn-sm" @click="deleteFile(ufile.id)">
              <a>Delete</a>
            </a>
          </td>
        </tr>
        </tbody>
      </table>
      <div>
        <a class="btn btn-outline-primary" @click="uploadBuildReports">
          Upload
        </a>
      </div>
    </form>
  </div>
</template>