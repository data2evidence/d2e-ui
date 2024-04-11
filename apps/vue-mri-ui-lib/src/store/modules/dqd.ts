import axios from 'axios'
const CancelToken = axios.CancelToken
let cancel

const dataflow_mgmt_url = '/dataflow-mgmt/'

const actions = {
  // TODO: check if this endpoint is deprecated
  async fetchDataQualityFlowRun({ commit, dispatch, rootGetters }, { cohortDefinitionId }) {
    let url = `${dataflow_mgmt_url}dqd/data-quality/dataset/${rootGetters.getSelectedUserStudy.id}/cohort/${cohortDefinitionId}/flow-run/latest`
    return dispatch('ajaxAuth', { url, method: 'GET' })
      .then(response => {
        return response.data
      })
      .catch(error => {
        throw 'Failed to fetch data:,'
      })
  },
  async generateDataQualityFlowRun({ commit, dispatch, rootGetters }, { GenerateDataQualityFlowRunParams }) {
    if (cancel) {
      cancel()
    }
    const cancelToken = new CancelToken(c => {
      cancel = c
    })

    let url = `${dataflow_mgmt_url}prefect/flow-run/metadata`
    return dispatch('ajaxAuth', { url, method: 'POST', params: GenerateDataQualityFlowRunParams, cancelToken })
      .then(response => {
        return response.data
      })
      .catch(error => {
        throw 'Failed to run Data Quality Check'
      })
  },
}

export default {
  actions,
}
