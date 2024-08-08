<template>
  <messageBox v-if="showAddCohortDialog" dim="true" :busy="cohortBusy" messageType="custom" @close="closeWindow">
    <template v-slot:header
      >{{
        getText('MRI_PA_COLL_ADD_PATIENTS_TO_COLLECTION') +
        ` (${this.isSaveAsBookmark ? this.getUniqueName : this.bookmarkName})`
      }}
    </template>
    <template v-slot:body>
      <div class="cohort-dialog">
        <appMessageStrip
          :messageType="messageStrip.messageType"
          :text="messageStrip.message"
          v-if="messageStrip.show"
          @closeEv="resetMessageStrip"
        />

        <div class="form-group">
          <div class="row">
            <div class="col-sm-4 form-check col-form-label">
              <label class="form-check-label" for="cohort-radio-newcollection">{{
                getText('MRI_PA_COLL_COHORT_NAME')
              }}</label>
            </div>
            <div class="col-sm-8">
              <input
                class="form-control"
                :placeholder="getText('MRI_PA_COLL_ENTER_NAME')"
                v-model="cohortName"
                tabindex="0"
                v-focus
              />
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4 form-check col-form-label">
              <label class="form-check-label" for="cohort-radio-newcollection">{{
                getText('MRI_PA_COLL_COHORT_DESCRIPTION')
              }}</label>
            </div>
            <div class="col-sm-8">
              <input
                class="form-control"
                :placeholder="getText('MRI_PA_COLL_ENTER_DESCRIPTION')"
                v-model="cohortDescription"
                tabindex="1"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex-spacer"></div>
      <appButton :disabled="cohortBusy" :click="onOkButtonPress" :text="getText('MRI_PA_COLL_BUT_OK')"></appButton>
      <appButton :disabled="cohortBusy" :click="closeWindow" :text="getText('MRI_PA_COLL_BUT_CANCEL')"></appButton>
    </template>
  </messageBox>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapMutations } from 'vuex'
import appButton from '../lib/ui/app-button.vue'
import appLabel from '../lib/ui/app-label.vue'
import appMessageStrip from '../lib/ui/app-message-strip.vue'
import appSkinnyDropdown from '../lib/ui/app-skinny-dropdown.vue'
import * as types from '../store/mutation-types'
import { getPortalAPI } from '../utils/PortalUtils'
import messageBox from './MessageBox.vue'
import { generateUniqueName } from '../utils/BookmarkUtils'

export default {
  name: 'addCohort',
  props: ['bookmarkId', 'bookmarkName', 'openAddDialog'],
  data() {
    return {
      showAddCohortDialog: false,
      cohortName: '',
      cohortDescription: '',
      cohortBusy: false,
      messageStrip: {
        show: false,
        message: '',
        messageType: '',
      },
    }
  },
  watch: {
    openAddDialog(val) {
      if (val) {
        this.openAddCohortDialog()
      }
    },
    selectedCollection(newVal, oldVal) {
      if (newVal === 'oldCollection') {
        this.loadOldCollections()
      }
    },
  },
  computed: {
    ...mapGetters([
      'getText',
      'getSelectedCohort',
      'getSelectedCollection',
      'getHasExistingCollections',
      'getServiceURL',
      'getAddCohortDialogState',
      'getPLRequest',
      'getSelectedDataset',
      'getJwtTokenValue',
      'getCurrentPatientCount',
      'getActiveBookmark',
      'getCurrentBookmarkHasChanges',
      'getBookmarks',
      'getBookmarksData',
      'getBookmarkByNameAndUsername',
    ]),
    getUniqueName() {
      return generateUniqueName(this.getBookmarks)
    },
    isNewBookmark() {
      return this.getActiveBookmark.isNew || this.isSaveAsBookmark
    },
    isNotUserSharedBookmark() {
      return this.getActiveBookmark.shared && this.username !== this.getActiveBookmark.user_id
    },
    isSaveAsBookmark() {
      return this.isNotUserSharedBookmark && this.getCurrentBookmarkHasChanges
    },
    username() {
      return getPortalAPI().username
    },
    patientCount() {
      return this.getCurrentPatientCount
    },
    selectedCohort: {
      get() {
        return this.getSelectedCohort
      },
      set(value) {
        this[types.SET_COHORT_TYPE](value)
      },
    },
    selectedCollection: {
      get() {
        return this.getSelectedCollection
      },
      set(value) {
        this[types.SET_COLLECTION_TYPE](value)
      },
    },
    hasExistingCollection: {
      get() {
        return this.getHasExistingCollections
      },
      set(value) {
        this[types.COLLECTIONS_SET_HASEXISTINGCOLLECTION](value)
      },
    },
    serviceURL: {
      get() {
        return this.getServiceURL
      },
    },
    oldCollection: {
      get() {
        return this.onLoadAddCohortMessageBox()
      },
    },
  },
  methods: {
    ...mapActions([
      'onAddCohortOkButtonPress',
      'loadOldCollections',
      'fireQuery',
      'getPLRequest',
      'saveNewBookmark',
      'updateBookmark',
      'setActiveBookmark',
      'loadAllBookmarks',
      'loadbookmarkToState',
    ]),
    ...mapMutations([types.SET_COHORT_TYPE, types.SET_COLLECTION_TYPE, types.COLLECTIONS_SET_HASEXISTINGCOLLECTION]),
    openAddCohortDialog() {
      this.showAddCohortDialog = true
    },
    async onOkButtonPress() {
      await this.checkBookmark()

      const syntax = JSON.stringify({
        datasetId: this.getSelectedDataset.id,
        bookmarkId: this.getActiveBookmark.bmkId,
      })
      const params = {
        studyId: this.getSelectedDataset.id,
        mriquery: JSON.stringify(this.getPLRequest({ bmkId: this.bookmarkId })),
        name: this.cohortName,
        description: this.cohortDescription,
        owner: this.username,
        syntax: syntax,
      }

      this.resetMessageStrip()
      this.cohortBusy = true
      this.onAddCohortOkButtonPress({
        params,
        url: '/analytics-svc/api/services/cohort',
      })
        .then(() => {
          setTimeout(() => this.closeWindow(), 1500)
          this.cohortBusy = false
          this.messageStrip = {
            show: true,
            message: this.getText('MRI_PA_COLL_SUCCESS_ADD_PATIENT'),
            messageType: 'success',
          }
        })
        .catch(err => {
          this.cohortBusy = false
          this.messageStrip = {
            show: true,
            message: err,
            messageType: 'error',
          }
          return err
        })
    },
    async setNewActiveBookmark(bookmarkName) {
      await this.loadAllBookmarks()
      const savedBookmark = this.getBookmarkByNameAndUsername(bookmarkName, this.username)
      this.setActiveBookmark(savedBookmark)
      this.loadbookmarkToState({ bmkId: this.getActiveBookmark.bmkId, chartType: this.getActiveBookmark.chartType })
    },
    async checkBookmark() {
      if (this.isNewBookmark) {
        if (this.isNotUserSharedBookmark) {
          await this.saveNewBookmark({
            cmd: 'insert',
            bookmarkname: this.getUniqueName,
            bookmark: JSON.stringify(this.getBookmarksData),
            shareBookmark: false,
          })
          return await this.setNewActiveBookmark(this.getUniqueName)
        } else {
          await this.saveNewBookmark({
            cmd: 'insert',
            bookmarkname: this.bookmarkName,
            bookmark: JSON.stringify(this.getBookmarksData),
            shareBookmark: false,
          })
          return await this.setNewActiveBookmark(this.bookmarkName)
        }
      } else if (this.getCurrentBookmarkHasChanges) {
        await this.updateBookmark({
          cmd: 'update',
          bookmark: JSON.stringify(this.getBookmarksData),
          shareBookmark: this.getActiveBookmark.shared,
        })
        return await this.setNewActiveBookmark(this.bookmarkName)
      }
    },
    closeWindow() {
      this.resetMessageStrip()
      this.cohortBusy = false
      this[types.SET_COHORT_TYPE]('subset')
      this[types.SET_COLLECTION_TYPE]('newCollection')
      this.cohortName = ''
      this.cohortDescription = ''
      this.showAddCohortDialog = false
      this.$emit('closeEv')
    },
    resetMessageStrip() {
      this.messageStrip = {
        show: false,
        message: '',
        messageType: '',
      }
    },
    onLoadAddCohortMessageBox() {
      this.loadOldCollections({
        params: {},
        url: '/analytics-svc/api/services/collections',
      })
    },
    disableOKButton() {
      if (this.selectedCohort === 'subset' && !this.cohortName) {
        return true
      }
      return false
    },
  },
  components: {
    messageBox,
    appLabel,
    appButton,
    appSkinnyDropdown,
    appMessageStrip,
  },
}
</script>
<style></style>
