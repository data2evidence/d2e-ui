import { ComponentType } from 'react'
import { BasePlugin } from './BasePlugin'
import { PageProps } from './types'

export interface SuperAdminPageMetadata {
  userId: string
  getToken: () => Promise<string>
}

export class SuperAdminPagePlugin extends BasePlugin {
  page: ComponentType<PageProps<SuperAdminPageMetadata>> | null

  constructor(page: ComponentType<PageProps<SuperAdminPageMetadata>> | null) {
    super()
    this.page = page
  }
}
