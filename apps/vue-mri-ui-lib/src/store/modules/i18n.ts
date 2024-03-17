import * as types from '../mutation-types'
import { i18n } from '../../lib/i18n'

// initial state
const state = {
  locales: {
    ...i18n,
  },
  currentLocale: 'en',
}

// getters
const getters = {
  getText: (modulestate, modulegetters) => (key, param) => {
    let text = modulegetters.getTextFromLocale(key, modulestate.currentLocale)
    if (text === '') {
      // if key is not in "en_US", use "en" or "DEFAULT" as locale
      const fallbackLocale =
        modulestate.currentLocale.split('_').length === 2 ? modulestate.currentLocale.split('_')[0] : 'DEFAULT'
      text = modulegetters.getTextFromLocale(key, fallbackLocale)

      if (text === '') {
        text = modulegetters.getTextFromLocale(key, 'DEFAULT')
      }
      if (text === '') {
        text = key
      }
    }

    if (param) {
      if (Array.isArray(param)) {
        for (let i = 0; i < param.length; i += 1) {
          text = text.replace(`{${i}}`, param[i])
        }
      } else {
        text = text.replace('{0}', param)
      }
    }
    return text
  },
  getTextFromLocale: modulestate => (key, locale) => {
    const dictionary = modulestate.locales[locale]
    if (dictionary && key in dictionary) {
      return dictionary[key]
    }
    return ''
  },
}

// actions
const actions = {
  addLocale({ commit }, { locale }) {
    Object.keys(locale).forEach(lang => {
      commit(types.I18N_ADD_LOCALE, { lang, texts: locale[lang] })
    })
  },
}

// mutations
const mutations = {
  [types.I18N_SET_CURRENT_LOCALE](modulestate, locale) {
    modulestate.currentLocale = locale
  },
  [types.I18N_ADD_LOCALE](modulestate, { lang, texts }) {
    modulestate.locales[lang] = { ...modulestate.locales[lang], ...texts }
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
