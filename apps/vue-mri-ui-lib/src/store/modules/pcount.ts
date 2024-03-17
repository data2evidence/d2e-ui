import * as types from '@/store/mutation-types'

// initial state
const state = {
  displayTotalGuardedPatientCount: false,
}

// getters
const getters = {
  getDisplayTotalGuardedPatientCount: (modulestate, rootGetters) => {
    // Always return guarded total patient count for patient list
    if (rootGetters.getActiveChart === 'list' || rootGetters.getActiveChart === 'custom') {
      return true
    } else if (rootGetters.getActiveChart === 'vb') {
      // VB should be able to display guarded and unguarded count. A flag has to
      // to  be explicitly set
      return modulestate.displayTotalGuardedPatientCount
    }

    // for all other charts, display unguarded count
    return false
  },
}

// actions
const actions = {}

// mutations
const mutations = {
  [types.PCOUNT_SET_DISPLAYTOTALGUARDEDPATIENTCOUNT](modulestate, { isDisplay }) {
    modulestate.displayTotalGuardedPatientCount = isDisplay
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
