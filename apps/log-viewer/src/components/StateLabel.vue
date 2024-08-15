<script setup lang="ts">
import { TaskRun, FlowRun } from '@/types/types'
import { stateTypeColors } from '@/const'
import { StateType } from '@prefecthq/graphs'

defineProps<{ run: TaskRun | FlowRun }>()
</script>

<template>
  <div>
    <div
      :style="`display: inline; padding: 0px 10px; background-color: ${stateTypeColors[run.stateType as StateType]}; color: white; border-radius: 10px`"
    >
      {{ run.stateName }}
    </div>
  </div>
</template>
