<script setup lang="ts"></script>

<template>
  <div class="router">
    <RouterView />
  </div>
</template>

<style scoped>
.router {
  @apply bg-gray-800 h-[calc(100vh-72px)];
}
</style>
