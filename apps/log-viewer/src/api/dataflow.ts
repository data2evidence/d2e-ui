import request from './request'
import { getPortalAPI } from '@/utils/portalApi'
import { CreateFlowRunByMetadata } from '@/types/runs'

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
      timeout: 600000
    })
  }

  public async createFlowRunByMetadata(metadata: CreateFlowRunByMetadata) {
    const { baseUrl } = getPortalAPI()

    const path = 'dataflow-mgmt/prefect/flow-run/metadata'

    return request({
      baseURL: baseUrl,
      url: path,
      data: metadata
    })
  }
}
