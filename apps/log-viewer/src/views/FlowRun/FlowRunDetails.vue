<script setup lang="ts">
import { format } from 'date-fns'
import { FlowRun } from '@/types'

const props = defineProps<{ flowRun?: FlowRun }>()
</script>
<template>
  <div class="details-container">
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
</template>

<style scoped>
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
</style>
