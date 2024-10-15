import axios from 'axios'
import * as types from '../mutation-types'
import StringToBinary from '@/utils/StringToBinary'

let cancel

const state = {
  response: {},
}

const getters = {
  getCohortDefinitionResponse: modulestate => () => modulestate.response,
}

const actions = {
  clearResponse({ commit }) {
    commit(types.COHORT_DEFINITION_RESPONSE_SET, { response: {} })
  },
  cancelCohortDefinitionQuery({ commit, dispatch, getters, rootGetters }) {
    if (cancel) {
      cancel('cancel')
    }
  },
  fireCohortDefinitionQuery({ commit, dispatch, getters, rootGetters }) {
    if (cancel) {
      cancel('cancel')
    }
    const cancelToken = new axios.CancelToken(c => {
      cancel = c
    })

    const params = {
      datasetId: rootGetters.getSelectedDataset.id,
      mriquery: StringToBinary(JSON.stringify(rootGetters.getPLRequest({ bmkId: this.bookmarkId }))),
    }
    return dispatch('ajaxAuth', {
      url: '/analytics-svc/api/services/generate-cohort-definition',
      params,
      cancelToken,
    })
      .then(response => {
        if (response.data.noDataReason) {
          response.data.noDataReason = getters.getText(response.data.noDataReason)
        }
        commit(types.COHORT_DEFINITION_RESPONSE_SET, { response: { data: response.data } })
        return response.data
      })
      .catch(error => {
        commit(types.COHORT_DEFINITION_RESPONSE_SET, {
          response: {
            data: 'An error occured',
          },
        })
        throw error
      })
  },
}

const mutations = {
  [types.COHORT_DEFINITION_RESPONSE_SET](modulestate, { response }) {
    modulestate.response = { ...modulestate.response, ...response }
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
