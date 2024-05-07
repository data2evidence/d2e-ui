<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import FlowRun from './views/FlowRun.vue'
import TaskRun from './views/TaskRun.vue'
import { Mode } from './types'
import { useParamsStore } from './stores'

const paramsStore = useParamsStore()

const mode = computed(() => paramsStore.mode)

const getParamsFromUrl = () => {
  const flowRunId = new URLSearchParams(window.location.search).get('flowRunId') ?? undefined
  const taskRunId = new URLSearchParams(window.location.search).get('taskRunId') ?? undefined
  const rawMode = new URLSearchParams(window.location.search).get('mode')
  const mode: Mode = rawMode === 'flowRun' || rawMode === 'taskRun' ? rawMode : 'flowRun'
  return { flowRunId, taskRunId, mode }
}

const {
  flowRunId: initialFlowRunId,
  taskRunId: initialTaskRunId,
  mode: initialMode
} = getParamsFromUrl()

paramsStore.updateParams(
  {
    mode: initialMode,
    flowRunId: initialFlowRunId,
    taskRunId: initialTaskRunId
  },
  false
)
</script>

<template>
  <FlowRun v-if="mode === 'flowRun'" />
  <TaskRun v-if="mode === 'taskRun'" />
</template>

<style scoped></style>
