<script setup lang="ts"></script>

<template>
  <div class="router">
    <RouterView />
  </div>
</template>

<style scoped>
.router {
  @apply h-[calc(100vh-80px)];
  background-color: var(--color-neutral-lightest);
}
</style>
