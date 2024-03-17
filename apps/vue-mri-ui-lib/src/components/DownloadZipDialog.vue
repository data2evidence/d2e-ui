<template>
  <messageBox @close="cancel" :busy="busy">
    <template v-slot:header>{{ getText('MRI_PA_PATIENT_LIST_DOWNLOAD_AS_ZIP') }}</template>
    <template v-slot:body>
      <div>
        <div style="padding: 24px">{{ getText('MRI_PA_PATIENT_LIST_DOWNLOAD_AS_ZIP_FULL') }}</div>
        <div class="dialog-warning-delay" v-if="getIsLargePatientData">
          {{ getText('MRI_PA_PATIENT_LIST_DOWNLOAD_WARNING') }}
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex-spacer"></div>
      <appButton :click="download" :text="getText('MRI_PA_BUTTON_DOWNLOAD')" :disabled="busy" v-focus></appButton>
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
  name: 'download-zip-dialog',
  props: ['closeEv'],
  data() {
    return {
      busy: false,
    }
  },
  computed: {
    ...mapGetters(['getText', 'getZIPDownloadCompleted', 'getIsLargePatientData']),
  },
  watch: {
    getZIPDownloadCompleted(val) {
      if (val) {
        this.$emit('closeEv')
      }
    },
  },
  methods: {
    ...mapActions(['setFireDownloadZIP', 'cancelDownloadZIP']),
    download() {
      this.busy = true
      this.setFireDownloadZIP()
    },
    cancel() {
      if (this.busy) {
        this.cancelDownloadZIP()
      }
      this.$emit('closeEv')
    },
  },
  components: {
    messageBox,
    LoadingAnimation,
    appButton,
  },
}
</script>
