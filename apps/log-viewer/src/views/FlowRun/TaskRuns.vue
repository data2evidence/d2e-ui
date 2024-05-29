<script setup lang="ts">
import { FlowRun } from '@/types'
import { format } from 'date-fns'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{ taskRuns: FlowRun[] }>()

const onClickTaskRunId = (taskRunId: string) => {
  router.push(`/taskrun/${taskRunId}`)
}
</script>

<template>
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
          <div style="color: white">
            {{ format(taskRun.startTime, 'yyyy/MM/dd h:mm:ss a') }}
          </div>
        </div>
      </div></template
    >
  </template>
  <template v-else><div style="padding: 20px; color: white">No task flows</div></template>
</template>

<style scoped>
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
</style>
