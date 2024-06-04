<script setup lang="ts">
import { FlowRun } from '@/types'
import { PCodeHighlight } from '@prefecthq/prefect-design'

defineProps<{ flowRun?: FlowRun }>()
</script>

<template>
  <div class="parameters-container">
    <p-code-highlight
      style="overflow-x: auto"
      lang="json"
      :text="JSON.stringify(flowRun?.parameters || {}, null, 2)"
    />
  </div>
</template>

<style scoped>
.parameters-container {
  background-color: #181818;
  color: white;
  padding: 20px;
  margin: 0px 20px 10px 20px;
  border-radius: 10px;
}
</style>
