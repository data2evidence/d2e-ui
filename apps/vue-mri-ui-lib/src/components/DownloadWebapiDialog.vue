<template>
  <messageBox @close="cancel">
    <template v-slot:header>{{ getText('MRI_PA_FILTER_SUMMARY_DOWNLOAD_WEBAPI') }}</template>
    <template v-slot:body>
      <div>
        <div style="padding: 24px">{{ getText('MRI_PA_FILTER_SUMMARY_DOWNLOAD_WEBAPI_WARNING') }}</div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex-spacer"></div>
      <appButton
        :click="onClickDownloadWebapi"
        :text="getText('MRI_PA_FILTER_SUMMARY_DOWNLOAD_WEBAPI_DOWNLOAD')"
        v-focus
      ></appButton>
      <appButton :click="cancel" :text="getText('MRI_PA_BUTTON_CANCEL')"></appButton>
    </template>
  </messageBox>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex'
import appButton from '../lib/ui/app-button.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import messageBox from './MessageBox.vue'

export default {
  compatConfig: {
    MODE: 3,
  },
  name: 'download-webapi-dialog',
  props: ['closeEv'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['getText', 'getWebapiResponse', 'getActiveBookmark']),
  },
  watch: {},
  methods: {
    ...mapActions(['setFireDownloadZIP', 'cancelWebapiQuery', 'fireWebapiQuery']),
    cancel() {
      if (this.busy) {
        this.cancelWebapiQuery()
      }
      this.$emit('closeEv')
    },
    onClickDownloadWebapi() {
      const callback = () => {
        const content = this.getWebapiResponse()?.data || ''
        const blob = new Blob([JSON.stringify(content, null, 4)])
        const link = document.createElement('a')
        link.download = `${this.getActiveBookmark?.bookmarkname || 'Untitled'}.json`
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$emit('closeEv')
      }
      this.fireWebapiQuery().then(callback)
    },
  },
  components: {
    messageBox,
    LoadingAnimation,
    appButton,
  },
}
</script>
