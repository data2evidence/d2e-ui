<template>
  <div class="side-bar">
    <p-context-nav-item title="Data Quality Analysis" to="/" />
    <p-context-nav-item title="Upload Job" to="/upload" />
    <p-context-nav-item title="Jobs" to="/deployments" />
    <p-context-nav-item title="Job Runs" to="/flow-runs" />
  </div>
</template>
  
  <script lang="ts" setup>
import { PContextNavItem } from '@prefecthq/prefect-design'
</script>

<style scoped>
.side-bar {
  margin-top: 5px;
  padding: 0 400px 0 400px;
  display: flex;
  height: 40px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.p-context-nav-item {
  justify-content: center;
}
</style>