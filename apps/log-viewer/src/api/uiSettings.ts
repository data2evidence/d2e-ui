import axios from 'axios'
import { mapper } from '@/utils/mapper'
import { SettingsResponse } from '@/types/settingsResponse'
import { MODE, BASE_URL } from '@/env'
import { FeatureFlag } from '@/utils/permissions'

export type Settings = {
  apiUrl: string
  csrfEnabled: boolean
  flags: FeatureFlag[]
}

export class UiSettings {
  public static settings: Settings | null = null

  private static promise: Promise<Settings> | null = null
  //   private static readonly baseUrl = MODE() === 'development' ? 'http://127.0.0.1:4200' : BASE_URL()
  private static readonly baseUrl = 'https://localhost:41100/prefect'

  public static async load(): Promise<Settings> {
    if (this.settings !== null) {
      return this.settings
    }

    if (this.promise !== null) {
      return this.promise
    }

    const token = ''

    this.promise = new Promise((resolve) => {
      return axios
        .get<SettingsResponse>('/ui-settings', {
          baseURL: this.baseUrl,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => mapper.map('SettingsResponse', data, 'Settings'))
        .then(resolve)
    })

    const settings = await this.promise
    console.log('here: ', settings)
    return (this.settings = settings)
  }

  public static async get<T extends keyof Settings>(
    setting: T,
    defaultValue?: Settings[T]
  ): Promise<Settings[T]> {
    await this.load()

    const value = this.settings?.[setting]
    console.log('here:', value)

    if (value === undefined) {
      if (defaultValue) {
        return defaultValue
      }

      throw `UI setting "${setting}" does not exist and no default was provided.`
    }

    return value
  }
}

export const uiSettings: {
  getApiUrl: () => Promise<string>
  getFeatureFlags: () => Promise<FeatureFlag[]>
} = {
  getApiUrl: () => {
    return UiSettings.get('apiUrl')
  },
  getFeatureFlags: () => {
    return UiSettings.get('flags')
  }
}
