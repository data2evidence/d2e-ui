import { FC } from 'react'
import { Button, ConfigProvider, Form, Space } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import { CriterionCard, EventDropdown, SelectConcept } from './components'
import styles from './CohortBuilder.scss?inline'

// Mock data
import events from './mock/events.json'

export interface CohortBuilderProps {}

export const CohortBuilder: FC<CohortBuilderProps> = () => {
  return (
    <>
      <StyleProvider>
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 10,
            },
          }}
        >
          <style>{styles}</style>
          <div className="cohort-builder">
            <Space direction="vertical">
              <EventDropdown data={events} />
              <CriterionCard>
                <Form layout="vertical">
                  <Form.Item label="Condition concept set">
                    <SelectConcept allowClear />
                  </Form.Item>
                </Form>
              </CriterionCard>
              <Button>Generate JSON</Button>
            </Space>
          </div>
        </ConfigProvider>
      </StyleProvider>
    </>
  )
}
