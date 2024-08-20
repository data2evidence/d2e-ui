import axios from 'axios'
import { getPortalAPI } from '@/utils/portalApi'
import { Study, DatasetQueryRole } from '@/types/study'

export class SystemPortal {
  public async getDatasets() {
    const { baseUrl, getAuthToken } = getPortalAPI()
    const token = await getAuthToken()
    if (!token) {
      throw new Error('No auth token present')
    }
    const params = new URLSearchParams()
    params.set('role', DatasetQueryRole.systemAdmin)
    const path = 'system-portal/dataset/list'

    const { data } = await axios.get<Study[]>(path, {
      baseURL: baseUrl,
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    return data
  }
}
