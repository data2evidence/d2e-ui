<template>
  <messageBox
    class="compareContainer"
    dim="true"
    messageType="custom"
    v-if="showCohortCompareDialog"
    @close="closeMessageBox"
  >
    <template v-slot:header>{{ getText('MRI_COMP_COHORT_TITLE_DIALOG') }}</template>
    <template v-slot:body>
      <div class="body">
        <!-- Chart Toolbar -->
        <div class="chartToolbarContainer">
          <template v-for="chart in chartConfig" :key="chart.name">
            <chartButton
              :name="chart.name"
              :icon="chart.icon"
              :iconGroup="chart.iconGroup"
              :title="getText(chart.tooltip)"
              @clickEv="onSelectChart(chart)"
            ></chartButton>
            <label class="separator"></label>
          </template>
        </div>

        <!-- replace with stackbar , boxplot, KM that uses the cohortCompareContainer-->
        <cohortComparisonContainer :activeChart="selectedChart" :bookmarkIds="bookmarkList">
        </cohortComparisonContainer>
      </div>
    </template>
    <template v-slot:footer>
      <appButton :click="closeMessageBox" :text="getText('MRI_PA_CLOSE_BUTTON')"></appButton>
    </template>
  </messageBox>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex'
// import axios from "axios";
import messageBox from './MessageBox.vue'
import appButton from '../lib/ui/app-button.vue'
import ChartButton from './ChartButton.vue'
import Constants from '../utils/Constants'
import CohortComparisonContainer from './CohortComparisonContainer.vue'

// const CancelToken = axios.CancelToken;
// let cancel;

export default {
  name: 'cohortComparison',
  props: ['bookmarkList', 'disableCohortCompare', 'openCompareDialog'],
  data() {
    return {
      showCohortCompareDialog: false,
      showWarningMessage: false,
      bookmarkName: '',
      chartConfig: [],
      selectedChart: '',
      chartData: {},
    }
  },
  watch: {
    openCompareDialog(val) {
      if (val) {
        this.openCohortCompareDialog()
      }
    },
    getHasAssignedConfig(val) {
      if (val) {
        this.initChartConfig()
      }
    }
  },
  mounted() {
    this.initChartConfig()
  },
  computed: {
    ...mapGetters(['getText', 'getAllChartConfigs', 'getHasAssignedConfig']),
  },
  methods: {
    ...mapActions(['setAlertMessage']),
    openCohortCompareDialog() {
      if (this.bookmarkList.length <= 10) {
        this.showCohortCompareDialog = true
        this.setFirstChart(this.chartConfig)
      } else {
        this.setAlertMessage({
          message: this.getText('MRI_COMP_COHORT_WARN_MESSAGE'),
        })
      }
    },
    closeMessageBox() {
      if (this.showCohortCompareDialog) {
        this.showCohortCompareDialog = false
      }
      if (this.selectedChart) {
        this.selectedChart = '' // reset the selected Chart
      }
      this.$emit('closeEv')
    },
    onSelectChart(chart) {
      this.selectedChart = chart.name
    },
    setFirstChart(chartTypeData) {
      if (chartTypeData.length !== 0) {
        const firstChart = chartTypeData.at(0)
        this.selectedChart = firstChart.name
      }
    },
    initChartConfig() {
      const chartConfigs = this.getAllChartConfigs
      const chartTypeData = []
      const supportedChart = ['stacked', 'boxplot', 'km']
      // retrieves the icon of each chart button
      Object.keys(Constants.chartInfo).forEach(key => {
        if (chartConfigs[key] && chartConfigs[key].visible) {
          const chartInfo = Constants.chartInfo[key]
          Object.keys(chartConfigs[key]).forEach(key2 => {
            chartInfo[key2] = chartConfigs[key][key2]
          })
          // check if stack, boxplot or km
          if (supportedChart.indexOf(key) > -1) {
            chartTypeData.push(chartInfo)
          }
        }
      })

      this.chartConfig = chartTypeData
    },
  },
  components: {
    appButton,
    messageBox,
    ChartButton,
    CohortComparisonContainer,
  },
}
</script>
