import request from './request'
import { getPortalAPI } from '@/utils/portalApi'

export class Dataflow {
  public async addFlowFromGitUrlDeployment(url: string) {
    const { baseUrl } = getPortalAPI()

    const path = 'dataflow-mgmt/prefect/flow/git-deployment'

    return request({
      baseURL: baseUrl,
      url: path,
      method: 'POST',
      data: { url },
      timeout: 600000
    })
  }

  public async addFlowFromFileDeployment(file?: File) {
    const { baseUrl } = getPortalAPI()

    const path = 'dataflow-mgmt/prefect/flow/file-deployment'

    return request({
      baseURL: baseUrl,
      url: path,
      method: 'POST',
      data: { file },
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000
    })
  }
}
