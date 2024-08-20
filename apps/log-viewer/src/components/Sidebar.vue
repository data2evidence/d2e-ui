<template>
  <p-context-sidebar class="sidebar">
    <p-context-nav-item title="Data Quality Analysis" to="/analysis" />
    <p-context-nav-item title="Upload" to="/upload" />
    <p-context-nav-item title="Jobs" to="/flows" />
    <p-context-nav-item title="Flow Runs" to="/flow-runs" />

    <template #footer>
      <p-context-nav-item title="Settings" to="/settings" />
    </template>
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