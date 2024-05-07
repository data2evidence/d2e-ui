<script setup lang="ts">
import AppRouter from './AppRouter.vue'
</script>

<template>
  <div class="router">
    <AppRouter />
  </div>
</template>

<style scoped>
.router {
  @apply bg-gray-800 h-[calc(100vh-72px)];
}
</style>
