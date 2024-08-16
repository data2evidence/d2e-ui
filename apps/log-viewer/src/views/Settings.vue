<template>
  <p-layout-default class="settings">
    <!-- <template #header>
      <PageHeading :crumbs="crumbs">
        <template #actions>
          <p-key-value class="settings__version" label="Version" :value="version" alternate />
        </template>
      </PageHeading>
    </template> -->

    <p-label label="Theme">
      <p-theme-toggle />
    </p-label>

  </p-layout-default>
</template>
  
  <script lang="ts" setup>
import { PageHeading } from '@prefecthq/prefect-ui-library'
import { usePageTitle } from '@/compositions/usePageTitle'

const crumbs = [{ text: 'Settings' }]

usePageTitle('Settings')
</script>
  
  <style>
.settings__version {
  @apply w-auto;
}

.settings__color-mode {
  @apply w-96
    max-w-full;
}

.settings__code-block {
  @apply max-w-full
    overflow-x-auto;
}
</style>