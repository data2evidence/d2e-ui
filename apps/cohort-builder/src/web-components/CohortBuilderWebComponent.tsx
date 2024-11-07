import ReactDOM from 'react-dom/client'
import { CohortBuilderProps, CohortBuilder } from '../CohortBuilder'

export const normalizeAttribute = (attribute: string) => {
  return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

export class CohortBuilderWebComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    const props = this.getPropsFromAttributes<CohortBuilderProps>()
    const mountPoint = this.shadowRoot as ShadowRoot
    const root = ReactDOM.createRoot(mountPoint)

    const handleChange = (data: any) => {
      const event = new CustomEvent('change', {
        detail: { data },
      })
      this.dispatchEvent(event)
    }

    root.render(<CohortBuilder {...props} onChange={handleChange} container={mountPoint} />)
  }

  private getPropsFromAttributes<T>(): T {
    const props: Record<string, string> = {}

    for (let index = 0; index < this.attributes.length; index++) {
      const attribute = this.attributes[index]
      props[normalizeAttribute(attribute.name)] = attribute.value
    }

    return props as T
  }
}
