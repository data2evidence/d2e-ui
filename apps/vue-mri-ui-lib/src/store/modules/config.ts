// tslint:disable:no-shadowed-variable
import ChartConfigService from '../../lib/ChartConfigService'
import MriFrontEndConfig from '../../lib/MriFrontEndConfig'
import * as types from '../mutation-types'
import { getPortalAPI } from '../../utils/PortalUtils'

let chartConfigServiceInstance
// let mriFrontendConfigInstance;
const analyticsEndpoint = '/analytics-svc/pa/services/analytics.xsjs'

// initial state
const state = {
  mriFrontendConfigInstance: null,
  chartConfigServiceInstance: null,
  mriconfig: {
    meta: {
      configId: '',
      configName: '',
    },
  },
  assignments: [],
  configSelection: {
    show: false,
  },
  hasAssignedConfig: false,
  userStudies: [],
  datasetVersions: [],
  selectedStudy: {},
  selectedDatasetVersion: {},
}

// default release version
const defaultRelease = {
  id: 0,
  name: 'Select Release',
  releaseDate: '',
}

// getters
const getters = {
  getMriConfig: state => state.mriconfig,
  getConfigSelectionDialogState: state => state.configSelection,
  getMriFrontendConfig: state => state.mriFrontendConfigInstance,
  getChartConfigService: state => state.chartConfigServiceInstance,
  getConfigs: state => state.assignments,
  getHasAssignedConfig: state => state.hasAssignedConfig,
  getSelectedPAConfigId: state => state.mriconfig.meta.configId,
  getUserStudies: state => state.userStudies,
  getSelectedUserStudy: state => state.selectedStudy,
  getDatasetVersions: state => state.datasetVersions,
  getSelectedDatasetVersion: state => state.selectedDatasetVersion,
}

// actions
const actions = {
  requestMriConfig({ dispatch, commit, rootGetters }) {
    const processData = aData => {
      if (aData.length === 0) {
        // there is no config assigned
        // show error message in ui
        dispatch('setFatalMessage', {
          message: rootGetters.getText('MRI_PA_NO_CONFIG_ASSIGNED'),
        })
        commit(types.CONFIG_SET_HAS_ASSIGNED, false)
      } else if (aData.length > 1) {
        // there are more than 1 config assigned. Ask the user what to load
        commit(types.CONFIG_SET_LIST, aData)
        commit(types.CONFIG_SET_CONFIG_SELECTION, { show: true })
        commit(types.CONFIG_SET_HAS_ASSIGNED, false)
      } else if (aData.length === 1) {
        // there is exactly 1 config assigned. load that config
        aData[0].selected = true
        dispatch('setupFrontendConfig', aData[0])
        dispatch('resetChartProperties')
        commit(types.CONFIG_SET, aData[0])
        commit(types.CONFIG_SET_HAS_ASSIGNED, true)
      }
    }
    // uncomment for testing
    // setTimeout(() => {
    //   processData([...config]);
    // }, 1000);

    dispatch('requestUserStudies').then((selectedStudyId?: string) => {
      // load the complete config to our state
      dispatch('ajaxAuth', {
        method: 'get',
        url: `${analyticsEndpoint}?action=getMyConfig${selectedStudyId ? `&selectedStudyId=${selectedStudyId}` : ''}`,
      }).then(response => {
        const aData = response.data
        processData(aData)
        dispatch('requestDatasetVersions')
      })
    })
  },
  requestUserStudies({ dispatch, commit, rootGetters }) {
    return new Promise((resolve, reject) => {
      const portalAPI = getPortalAPI()
      dispatch('ajaxAuth', {
        method: 'get',
        url: '/analytics-svc/api/services/userStudies',
      }).then(response => {
        if (response) {
          commit(types.SET_USER_STUDIES, response.data)

          // Portal defines the selected study instead of PA
          if (response.data && portalAPI && portalAPI.studyId) {
            commit(
              types.SET_SELECTED_STUDY,
              response.data.find(dataset => dataset.id == portalAPI.studyId)
            )
          } else {
            commit(types.SET_SELECTED_STUDY, response.data[0])
          }
        }
        resolve(response?.data?.[0]?.id)
      })
    })
  },
  requestDatasetVersions({ dispatch, commit, getters }) {
    return new Promise((resolve, reject) => {
      dispatch('ajaxAuth', {
        method: 'get',
        url: '/system-portal/dataset/' + getters.getSelectedUserStudy.id + '/release/list',
      }).then(response => {
        if (response) {
          commit(types.SET_DATASET_VERSIONS, [...response.data, defaultRelease])
          if (response?.data?.[0]) {
            commit(types.SET_SELECTED_DATASET_VERSION, defaultRelease)
          } else {
            commit(types.SET_SELECTED_DATASET_VERSION, {})
          }
        }
        resolve(response?.data?.[0]?.id)
      })
    })
  },
  setupFrontendConfig({ dispatch, commit }, config) {
    MriFrontEndConfig.createFrontendConfig(config)
    const mriFrontendConfigInstance = MriFrontEndConfig.getFrontendConfig()
    chartConfigServiceInstance = new ChartConfigService(MriFrontEndConfig.getFrontendConfig())
    commit(types.CONFIG_SET_ALL, {
      mriFrontendConfigInstance,
      chartConfigServiceInstance,
    })
  },
  requestConfigList({ dispatch, commit }, selectedStudyId) {
    return dispatch('ajaxAuth', {
      method: 'get',
      url: `${analyticsEndpoint}?action=getMyConfigList${selectedStudyId ? `&selectedStudyId=${selectedStudyId}` : ''}`,
    }).then(response => {
      commit(types.CONFIG_SET_LIST, response.data)
    })
  },
  requestFrontendConfig({ dispatch, commit }, { configId, configVersion }) {
    commit(types.CONFIG_SET_HAS_ASSIGNED, false)
    return dispatch('ajaxAuth', {
      url: analyticsEndpoint,
      params: {
        configId,
        configVersion,
        action: 'getFrontendConfig',
      },
    }).then(response => {
      dispatch('queryReset')
      dispatch('setupFrontendConfig', response.data)
      dispatch('resetChartProperties')
      commit(types.CONFIG_SET, response.data)
      commit(types.CONFIG_SET_HAS_ASSIGNED, true)
    })
  },
  toggleConfigSelectionDialog({ state, commit }) {
    commit(types.CONFIG_SET_CONFIG_SELECTION, {
      show: !state.configSelection.show,
    })
  },
  clearDefault({ dispatch }) {
    return dispatch('ajaxAuth', {
      url: analyticsEndpoint,
      params: {
        action: 'clearDefault',
      },
    })
  },
  setDefault({ dispatch, commit }, { configId, configVersion }) {
    return dispatch('ajaxAuth', {
      url: analyticsEndpoint,
      params: {
        configId,
        configVersion,
        action: 'setDefault',
      },
    })
  },
  setDataset({ commit }, dataset) {
    commit(types.SET_SELECTED_STUDY, dataset)
  },
  setDatasetVersion({ commit }, datasetVersion) {
    commit(types.SET_SELECTED_DATASET_VERSION, datasetVersion)
  },
}

// mutations
const mutations = {
  [types.CONFIG_SET](moduleState, mriconfig) {
    moduleState.mriconfig = mriconfig
  },
  [types.CONFIG_SET_CONFIG_SELECTION](moduleState, configSelection) {
    moduleState.configSelection = {
      ...moduleState.configSelection,
      ...configSelection,
    }
  },
  [types.CONFIG_SET_LIST](moduleState, list) {
    moduleState.assignments = list
  },
  [types.CONFIG_SET_HAS_ASSIGNED](moduleState, hasAssignedConfig) {
    moduleState.hasAssignedConfig = hasAssignedConfig
  },
  [types.SET_USER_STUDIES](moduleState, userStudies) {
    moduleState.userStudies = userStudies
  },
  [types.SET_SELECTED_STUDY](moduleState, dataset) {
    moduleState.selectedStudy = dataset
  },
  [types.SET_DATASET_VERSIONS](moduleState, datasetVersions) {
    moduleState.datasetVersions = datasetVersions
  },
  [types.SET_SELECTED_DATASET_VERSION](moduleState, selectedDatasetVersion) {
    moduleState.selectedDatasetVersion = selectedDatasetVersion
  },
  [types.CONFIG_SET_ALL](moduleState, { mriFrontendConfigInstance, chartConfigServiceInstance }) {
    moduleState.mriFrontendConfigInstance = mriFrontendConfigInstance
    moduleState.chartConfigServiceInstance = chartConfigServiceInstance
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
