<script>

import {useBranchStore} from '@/stores/branch'
import Defig from "@/index/App.vue";

export default {
  components: {Defig},
  setup() {
    const storeBranch = useBranchStore()
    return {storeBranch}
  },
  created() {
    this.loading = true
  },
  data() {
    const error = this.storeBranch?.error
    if (error && error.code != "0") this.$flashMessage.show({
      type: 'error',
      title: error.name + ': ' + error.code,
      text: error.message
    })

    const branch = this.storeBranch.findBranch(this.$route.params.branch_id)
    return {
      branch: branch,
      totalReport: {},
      loading: true,
      onlyDeployed: false
    }
  },
  mounted() {
    this.storeBranch.totalReport(this.$route.params.branch_id, this.onlyDeployed)
        .then((response) => {
          this.totalReport = response.data
          this.loading = false
        })
  },
  watch: {
    onlyDeployed(newFlag, oldFlag) {
      if (newFlag !== oldFlag) {
        this.loadReport();
      }
    },
  },
  methods: {
    formatDate: function (date) {
      return (date != 'MISSING') ? new Date(date).toLocaleDateString() : "MISSING"
    },
    formatTime: function (time) {
      return time === undefined || time === null ? "12:00:00" : time
    },
    paintStatus: function (statusDeploy, statusImport) {

      var style = {background: "lightgrey"}
      if ((statusDeploy === 'SUCCESS' || statusDeploy === 'UNSTABLE') && (statusImport === 'SUCCESS' || statusImport === 'UNSTABLE')) {
        style = {
          background: "green",
          color: "white"
        }
      } else if ((statusDeploy === 'SUCCESS' || statusDeploy === 'UNSTABLE') && (statusImport === 'MISSING' || statusImport === 'FAILURE')) {
        style = {background: "lightgreen"}
      } else if ((statusDeploy === 'FAILURE' || statusDeploy === 'MISSING') && (statusImport === 'SUCCESS' || statusImport === 'UNSTABLE')) {
        style = {background: "orange"}
      } else if ((statusDeploy === 'FAILURE') && (statusImport === 'FAILURE' || statusImport === 'MISSING')) {
        style = {
          background: "red",
          color: "white"
        }
      } else if ((statusDeploy === 'MISSING') && (statusImport === 'MISSING')) {
        style = {
          background: "grey",
          color: "white"
        }
      }
      return style
    },
    loadReport() {
      this.loading = true;
      this.storeBranch.totalReport(this.$route.params.branch_id, this.onlyDeployed)
          .then((response) => {
            this.totalReport = response.data;
            this.loading = false;
          })
          .catch((error) => {
            console.error("Error loading report", error);
            this.loading = false;
          });
    },
  }
}
</script>

<template>
  <div>
    <div>
      <h1>{{ branch.solution + " " + branch.version }}</h1>
      <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>&nbsp;
      <router-link to="/branch">&nbsp;Back to branch list</router-link>
      <hr>
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
                   :to="{name: 'scenario-view', params: {branch_id: branch.id}}">Scenario
      </router-link>
      <router-link class="btn btn-outline-primary btn-sm" role="button"
                   :to="{name: 'branch-build-compare', params: {branch_id: branch.id}}">Compare
      </router-link>
      <router-link class="btn btn-outline-primary btn-sm" role="button"
                   :to="{name: 'branch-configuration', params: {branch_id: branch.id}}">Configuration
      </router-link>
      <router-link class="btn btn-outline-primary btn-sm" role="button"
                   :to="{name: 'branch-build-statuses', params: {branch_id: branch.id}}">Statuses
      </router-link>
      <router-link class="btn btn-outline-primary btn-sm" role="button"
                   :to="{name: 'master', params: {branch_id: branch.id}}">Master Repack
      </router-link>
      <hr>
      <b>Link: </b>
      <div>{{ branch.link }}</div>
      <br/>
    </div>
    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" id="onlyDeployed" v-model="onlyDeployed">
      <label class="form-check-label" for="onlyDeployed">Show only deployed builds</label>
    </div>
    <div v-if="this.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="!this.loading">
      <div v-if="Object.keys(totalReport?.data).length > 0">
        <hr>
        <h3>Branch report</h3>
        <table class="table table-striped" style="width: 100%;">
          <thead>
          <tr>
            <th style="width: 10%;">Code</th>
            <template v-for="e in totalReport?.builds.sort((a,b) => a.id - b.id)">
              <th style="width: 18%">Build<br/>
                <a>
                  <router-link :to="{name: 'build-view', params: {build_id: e?.buildId}}">
                    {{ e.name }}
                  </router-link>
                </a>
                <br/>
                <small>{{ e.date ? formatDate(e.date) + ' ' + formatTime(e.time) : "MISSING" }}</small>
                <br>
                <small v-if="e.number!==undefined && e.number !== null">{{ 'Deploy number: ' + e.number + ' (Job: ' + e.deployNumber + ')' }}</small>
              </th>
            </template>
          </tr>
          </thead>
          <tbody>
          <template
              v-for="(item,key) in Object.fromEntries(Object.entries(totalReport.data).sort(([,a],[,b]) => b.deployed - a.deployed))">
            <tr>
              <td>
                <b style="word-wrap: anywhere;">
                  {{ key }}
                </b>
              </td>
              <template v-for="build in totalReport?.builds.sort((a,b) => a.id - b.id)">
                <td :style="paintStatus(item[build.buildName]?.deployerStatus?.toUpperCase(), item[build.buildName]?.importDeployerStatus?.toUpperCase())">
                  <b style="word-wrap: anywhere;">{{ item[build.buildName]?.version?.toUpperCase() }}</b><br/>
                  <p>
                    <small>
                      {{ formatDate(item[build.buildName]?.packerDate) + ' ' + formatTime(item[build.buildName]?.packerTime) }}
                    </small>
                  </p>
                  <small>
                    <b>
                      Deploy:
                    </b>
                    {{ item[build.buildName]?.deployerStatus?.toUpperCase() }}
                    <br/>
                    <b>
                      Import:
                    </b>
                    {{ item[build.buildName]?.importDeployerStatus?.toUpperCase() }}
                  </small>
                </td>
              </template>
            </tr>
          </template>
          </tbody>
          <tfoot>
          <tr>
            <th style="width: 10%;">Summary</th>
            <template v-for="e in totalReport?.builds.sort((a,b) => a.id - b.id)">
              <th style="width: 18%">
                <p>
                  Deploy (success/failure): {{
                    totalReport.summary[e.buildName].deploy.success
                  }}/{{ totalReport.summary[e.buildName].deploy.failure }}<br/>
                  Import (success/failure): {{
                    totalReport.summary[e.buildName].import.success
                  }}/{{ totalReport.summary[e.buildName].import.failure }}
                </p>
              </th>
            </template>
          </tr>
          </tfoot>
        </table>
        <hr>
        <div>
          <label>Legends:</label>
          <table style="width: 100%">
            <tr>
              <td style="width: 15%;" :style=" paintStatus('SUCCESS', 'SUCCESS')"><b>Deploy:</b> SUCCESS or
                UNSTABLE<br/><b>Import:</b> SUCCESS or UNSTABLE
              </td>
              <td style="width: 15%;" :style="paintStatus('SUCCESS', 'MISSING')"><b>Deploy:</b> SUCCESS or
                UNSTABLE<br/><b>Import:</b>
                FAILURE or MISSING
              </td>
              <td style="width: 15%;" :style="paintStatus('MISSING', 'SUCCESS')"><b>Deploy:</b> FAILURE or
                MISSING<br/><b>Import:</b>
                SUCCESS or UNSTABLE
              </td>
              <td style="width: 15%;" :style="paintStatus('FAILURE', 'FAILURE')"><b>Deploy:</b>
                FAILURE<br/><b>Import:</b>
                FAILURE or MISSING
              </td>
              <td style="width: 15%;" :style="paintStatus('MISSING', 'MISSING')"><b>Deploy:</b>
                MISSING<br/><b>Import:</b>
                MISSING
              </td>
              <td style="width: 15%;" :style="paintStatus('NA', 'NA')"><b>Deploy:</b> NA<br/><b>Import:</b> NA</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div v-if="branch?.branchConfiguration?.componentConfigurations.length > 0">
      <hr>
      <h3>Artifacts configurations</h3>
      <table class="table table-striped">
        <thead>
        <tr>
          <th>Code</th>
          <th>Repository</th>
          <th>Enabled</th>
          <th colspan="2">Group</th>
          <th>Artifact</th>
          <th>Version Mask</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="component in branch.branchConfiguration.componentConfigurations">
          <tr v-if="component.enabled">
            <td><b>{{ component.code }}</b></td>
            <td><b>{{ component.type }}</b></td>
            <td>{{ component.enabled }}</td>
            <td>{{ component.repository }}</td>
            <td>{{ component.group }}</td>
            <td>{{ component.artifact }}</td>
            <td><b>{{ component.versionMask }}</b></td>
          </tr>
        </template>
        </tbody>
      </table>
      <hr>
    </div>
  </div>
</template>