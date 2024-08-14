<template>
  <div class="app-router-view">
    <router-view name="sidebar"></router-view>
    <router-view class="app-router-view__view">
      <template #default="{ Component }">
        <transition name="app-router-view-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </template>
    </router-view>
  </div>
</template>
  
  <script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
</script>
  
<style scoped>
.app-router-view {
  display: flex;
  height: inherit;
}

.app-router-view__view {
  /* The 1px flex-basis is important because it allows us to use height: 100% without additional flexing */
  flex: 1 0 1px;
}

.app-router-view-fade-enter-active,
.app-router-view-fade-leave-active {
  transition: opacity 0.25s ease;
}

.app-router-view-fade-enter-from,
.app-router-view-fade-leave-to {
  opacity: 0;
}

.app-router-view__sidebar {
  @apply top-[54px]
  lg:bg-transparent
  lg:top-0;
}
</style>