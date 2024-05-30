<script setup lang="ts">
import { TaskRun, FlowRun } from '@/types'

defineProps<{ run: TaskRun | FlowRun }>()
</script>

<template>
  <div>
    <div
      :style="`display: inline; padding: 0px 10px; background-color: ${run.stateType === 'COMPLETED' ? 'green' : 'red'}; color: white; border-radius: 10px`"
    >
      {{ run.stateName }}
    </div>
  </div>
</template>
