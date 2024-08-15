import { PrefectConfig } from '@prefecthq/prefect-ui-library'

export type UseWorkspaceApiConfig = {
  config: PrefectConfig
}
export async function useApiConfig(): Promise<UseWorkspaceApiConfig> {
  const baseUrl = 'https://localhost:41100/prefect/api'
  const config: PrefectConfig = {
    baseUrl,
    token: ''
  }

  //   if (baseUrl.startsWith('/') && MODE() === 'development') {
  //     config.baseUrl = `http://127.0.0.1:4200${baseUrl}`
  //   }

  return { config }
}
