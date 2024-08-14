<template>
  <p-context-sidebar class="sidebar">
    <p-context-nav-item title="Dashboard" to="/" />
    <p-context-nav-item title="Jobs" to="/Jobs" />
    <p-context-nav-item title="Flow Runs" to="/" />
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