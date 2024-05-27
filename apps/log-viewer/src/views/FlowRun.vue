<script setup lang="ts">
import {
  RunGraph,
  RunGraphData,
  RunGraphConfig,
  RunGraphNode,
  GraphItemSelection
} from '@prefecthq/graphs'
import { FlowRun, FlowRunTabName, GetRunsForFlowRunResponse, LogInfo } from '@/types'
import {
  getLogsByFlowRunId,
  getParametersByFlowRunId,
  getRunsForFlowRun,
  getTaskRunsByFlowRunId
} from '@/api'
import { computed, ref, watchEffect } from 'vue'
import LogScroller from '../components/LogScroller.vue'
import { format } from 'date-fns'
import { PCodeHighlight } from '@prefecthq/prefect-design'
import { getPortalAPI } from '../utils/portalApi'
import { useRoute, useRouter } from 'vue-router'
import { RunGraphStateEvent } from '@prefecthq/graphs/dist/types/src/models/states'

const { backToJobs } = getPortalAPI()
const route = useRoute()
const router = useRouter()
const logs = ref<LogInfo[]>([])
const selectedTab = ref<FlowRunTabName>('LOGS')
const flowRun = ref<FlowRun>()
const taskRuns = ref<FlowRun[]>([])
const selectedNode = ref<GraphItemSelection | null>(null)

const processRunData = (runData: GetRunsForFlowRunResponse): RunGraphData => {
  const data = {
    start_time: new Date(runData.start_time),
    end_time: new Date(runData.end_time),
    root_node_ids: runData.root_node_ids,
    nodes: new Map(
      runData.nodes.map(([id, node]) => {
        return [
          id,
          { ...node, start_time: new Date(node.start_time), end_time: new Date(node.end_time) }
        ]
      })
    )
  }
  return data
}

const onClickTab = (tabName: FlowRunTabName) => {
  selectedTab.value = tabName
}

const onClickTaskRunId = (taskRunId: string) => {
  router.push(`/taskrun/${taskRunId}`)
}

const onClickBackToJobs = () => {
  router.push(`/`)
  backToJobs()
}

watchEffect(() => {
  const flowRunId = route.params.flowRunId as string
  if (flowRunId) {
    const asyncFn = async () => {
      const data = await getLogsByFlowRunId(flowRunId)
      logs.value = data
      const detailsData = await getParametersByFlowRunId(flowRunId)
      flowRun.value = detailsData
      const taskRunsData = await getTaskRunsByFlowRunId(flowRunId)
      taskRuns.value = taskRunsData
    }
    asyncFn()
  }
})

const stateTypeColors = {
  COMPLETED: '#219D4B',
  RUNNING: '#09439B',
  SCHEDULED: '#E08504',
  PENDING: '#554B58',
  FAILED: '#DE0529',
  CANCELLED: '#333333',
  CANCELLING: '#333333',
  CRASHED: '#EA580C',
  PAUSED: '#554B58'
} as const

function getColorToken(cssVariable: string): string {
  return 'white'
}
const config = computed<RunGraphConfig>(() => ({
  runId: flowRun?.value?.id || '',
  fetch: async (flowRunId: string) => {
    const data = await getRunsForFlowRun(flowRunId)
    return processRunData(data)
  },
  fetchEvents: '',
  styles: {
    colorMode: 'dark',
    textDefault: getColorToken('--p-color-text-default'),
    textInverse: getColorToken('--p-color-text-inverse'),
    nodeToggleBorderColor: getColorToken('--p-color-button-default-border'),
    selectedBorderColor: getColorToken('--p-color-flow-run-graph-node-selected-border'),
    edgeColor: getColorToken('--p-color-flow-run-graph-edge'),
    guideLineColor: getColorToken('--p-color-divider'),
    guideTextColor: getColorToken('--p-color-text-subdued'),
    node: (node: RunGraphNode) => ({
      background: stateTypeColors[node.state_type]
    }),
    state: (state: RunGraphStateEvent) => ({
      background: stateTypeColors[state.type]
    })
  }
}))
</script>

<template>
  <div
    style="
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px;
    "
  >
    <div style="color: white; cursor: pointer" @click="onClickBackToJobs">
      &#60; back to Jobs list
    </div>

    <div style="font-size: small">
      <div style="color: white">Flow Run ID: {{ flowRun?.id }}</div>
    </div>
  </div>

  <template v-if="!!flowRun?.id">
    <div class="flow-run-graph">
      <RunGraph
        class="flow-run-graph__graph p-background run-graph"
        :config="config"
        :selected="null"
        :fullscreen="false"
        @update:selected="
          (selected) => {
            selectedNode = selected
          }
        "
      />
    </div>
  </template>
  <div
    style="
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px;
    "
  >
    <div class="tabs">
      <div @click="onClickTab('LOGS')" :class="`tab ${selectedTab === 'LOGS' ? 'selected' : ''}`">
        <div>Logs</div>
      </div>
      <div
        @click="onClickTab('TASK_RUNS')"
        :class="`tab ${selectedTab === 'TASK_RUNS' ? 'selected' : ''}`"
      >
        <div>Task Runs</div>
      </div>
      <div
        @click="onClickTab('DETAILS')"
        :class="`tab ${selectedTab === 'DETAILS' ? 'selected' : ''}`"
      >
        <div>Details</div>
      </div>
      <div
        @click="onClickTab('PARAMETERS')"
        :class="`tab ${selectedTab === 'PARAMETERS' ? 'selected' : ''}`"
      >
        <div>Parameters</div>
      </div>
    </div>
  </div>
  <LogScroller v-if="selectedTab === 'LOGS'" :logs="logs" />
  <div v-if="selectedTab === 'TASK_RUNS'">
    <template v-if="taskRuns.length">
      <template v-for="taskRun in taskRuns" :key="taskRun.id">
        <div class="task-run-container" @click="onClickTaskRunId(taskRun.id)">
          <div class="task-run-name">
            <div>
              {{ taskRun.name }}
            </div>
          </div>
          <div class="task-run-details">
            <div
              :style="`padding: 0px 10px; background-color: ${taskRun.stateType === 'COMPLETED' ? 'green' : 'red'}; color: white; border-radius: 10px`"
            >
              {{ taskRun.stateName }}
            </div>
            <div style="margin: 0px 20px; color: white">{{ Math.ceil(taskRun.totalRunTime) }}s</div>
            <div style="color: white">{{ format(taskRun.startTime, 'yyyy/MM/dd h:mm:ss a') }}</div>
          </div>
        </div></template
      >
    </template>
    <template v-else><div style="padding: 20px; color: white">No task flows</div></template>
  </div>
  <div v-if="selectedTab === 'DETAILS'" class="details-container">
    <div class="details-attribute">
      <div>Run Count:</div>
      <div>{{ flowRun?.runCount }}</div>
    </div>
    <div class="details-attribute">
      <div>Created</div>
      <div>{{ flowRun?.created && format(flowRun?.created, 'yyyy/MM/dd h:mm:ss a') }}</div>
    </div>
    <div class="details-attribute">
      <div>Last Updated</div>
      <div>{{ flowRun?.updated && format(flowRun?.updated, 'yyyy/MM/dd h:mm:ss a') }}</div>
    </div>
    <div class="details-attribute">
      <div>Tags</div>
      <div>{{ flowRun?.tags.length ? flowRun.tags.join(', ') : 'None' }}</div>
    </div>
    <div class="details-attribute">
      <div>Flow Run ID</div>
      <div>{{ flowRun?.id }}</div>
    </div>
    <div class="details-attribute">
      <div>State Message</div>
      <div>{{ flowRun?.state?.message || 'None' }}</div>
    </div>
    <div class="details-attribute">
      <div>Flow Version</div>
      <div>{{ flowRun?.flowVersion }}</div>
    </div>
    <div class="details-attribute">
      <div>Retries</div>
      <div>{{ flowRun?.empiricalPolicy?.retries }}</div>
    </div>
    <div class="details-attribute">
      <div>Retry Delay</div>
      <div>{{ flowRun?.empiricalPolicy?.retryDelaySeconds }}s</div>
    </div>
  </div>
  <div class="parameters-container" v-if="selectedTab === 'PARAMETERS'">
    <p-code-highlight
      style="overflow-x: auto"
      lang="json"
      :text="JSON.stringify(flowRun?.parameters || {}, null, 2)"
    />
  </div>
</template>

<style scoped>
.run-graph {
  height: 300px;
  width: 100%;
}

.tabs {
  height: 50px;
  width: auto;
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}
.tab {
  height: 100%;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  @apply text-gray-400;
}

.tab:hover {
  color: white;
}
.selected {
  color: white;
  border-bottom: solid grey 5px;
}
.task-run-container {
  background-color: #181818;
  margin: 0px 20px 10px 20px;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  font-size: small;
  cursor: pointer;
}
.task-run-container:hover {
  background-color: #111;
}
.task-run-name {
  @apply text-blue-400 pb-1;
  font-size: large;
}
.task-run-details {
  display: flex;
}
.details-container {
  background-color: #181818;
  color: white;
  padding: 20px;
  margin: 0px 20px 10px 20px;
  border-radius: 10px;
}
.details-attribute {
  margin-bottom: 20px;
}
.parameters-container {
  background-color: #181818;
  color: white;
  padding: 20px;
  margin: 0px 20px 10px 20px;
  border-radius: 10px;
}
</style>
