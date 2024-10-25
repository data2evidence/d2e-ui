import { FC, useCallback } from 'react'
import { Button, ConfigProvider, Form, Space } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import { CriterionCard, EventDropdown, SelectConcept } from './components'
import styles from './CohortBuilder.scss?inline'

// Mock data
import events from './mock/events.json'

export interface CohortBuilderProps {
  container: Element | ShadowRoot | undefined
  colorPrimary?: string
  onChange?: (data: any) => void
}

export const CohortBuilder: FC<CohortBuilderProps> = ({ container, colorPrimary = '#1677ff', onChange }) => {
  const getPopupContainer = useCallback(() => {
    return container as HTMLElement
  }, [container])

  return (
    <>
      <StyleProvider container={container}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary,
              borderRadius: 10,
            },
          }}
          getPopupContainer={getPopupContainer}
        >
          <style>{styles}</style>
          <div className="cohort-builder">
            <Space direction="vertical">
              <EventDropdown data={events} />
              <CriterionCard>
                <Form layout="vertical">
                  <Form.Item label="Condition concept set">
                    <SelectConcept />
                  </Form.Item>
                </Form>
              </CriterionCard>
              <Button onClick={() => typeof onChange === 'function' && onChange({ ok: true })}>
                Raise change event
              </Button>
            </Space>
          </div>
        </ConfigProvider>
      </StyleProvider>
    </>
  )
}
