import { getPortalAPI } from '@/utils/portalApi'
import request from './request'
import { Study, DatasetQueryRole } from '@/types/study'

export class SystemPortal {
  public async getDatasets() {
    const { baseUrl } = getPortalAPI()
    const params = new URLSearchParams()
    params.set('role', DatasetQueryRole.systemAdmin)

    const path = 'system-portal/dataset/list'

    return request({
      baseURL: baseUrl,
      url: path,
      method: 'GET',
      params
    })
  }
}
