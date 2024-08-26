<template>
  <p-context-sidebar class="sidebar">
    <p-context-nav-item title="Data Quality Analysis" to="/" />
    <p-context-nav-item title="Upload Flow" to="/upload" />
    <p-context-nav-item title="Jobs" to="/flows" />
    <p-context-nav-item title="Job Runs" to="/flow-runs" />
  </p-context-sidebar>

</template>
  
  <script lang="ts" setup>
import { PContextSidebar, PContextNavItem } from '@prefecthq/prefect-design'
</script>

<style scoped>
.p-context-sidebar {
  height: auto;
}
</style>