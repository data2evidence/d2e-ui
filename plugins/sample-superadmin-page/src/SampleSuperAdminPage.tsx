import React, { FC, useCallback, useState } from 'react'
import { PageProps, SuperAdminPageMetadata } from '@portal/plugin'
import './SampleSuperAdminPage.scss'

interface SampleSuperAdminPageProps extends PageProps<SuperAdminPageMetadata> {}

export const SampleSuperAdminPage: FC<SampleSuperAdminPageProps> = ({ metadata }: SampleSuperAdminPageProps) => {
  const [token, setToken] = useState<string>()

  const handleClick = useCallback(async () => {
    if (metadata) {
      setToken(await metadata.getToken())
    }
  }, [])

  return (
    <div className="sa-plugin">
      <h1>Super admin plugin page</h1>
      <header>
        <div className="sa-plugin__subtitle">Sub header</div>
        <div className="sa-plugin__description">Hello {metadata?.userId || 'there!'}</div>
      </header>
      <nav>Side navigation</nav>
      <section>
        <button onClick={handleClick}>Get JWT token</button>
        <div>{token}</div>
      </section>
    </div>
  )
}
