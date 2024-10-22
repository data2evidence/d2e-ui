import React, { FC, useCallback, useState } from 'react'
import { Button, Card, Popover, Select, Space } from 'antd'
import { DistinctOption, DistinctOptionNames, OccurrenceType, OccurrenceTypeNames } from '~/common/constants'
import { DeleteIcon, MenuIcon } from '../Icons'
import styles from './CriterionCard.scss?inline'

export interface CriterionCardProps {
  children?: React.ReactNode
}

const OCCURRENCE_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50, 100]

interface FormData {
  occurrenceType: OccurrenceType
  occurrenceCount: number
  isDistinct: boolean
  distinctOption?: DistinctOption
}

const EMPTY_FORM_DATA: FormData = {
  occurrenceType: OccurrenceType.AT_LEAST,
  occurrenceCount: 1,
  isDistinct: false,
}

export const CriterionCard: FC<CriterionCardProps> = (props) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA)

  const handleFormDataChange = useCallback((updates: Partial<FormData>) => {
    setFormData((formData) => ({ ...formData, ...updates }))
  }, [])

  return (
    <Card className="criterion-card">
      <style>{styles}</style>
      <Space className="criterion-card__actions">
        <Button type="text" icon={<MenuIcon width={16} height={16} />} size="small" />
        <Button type="text" icon={<DeleteIcon width={16} height={16} />} size="small" />
      </Space>
      <Popover
        trigger="click"
        content={
          <div className="criterion-card__occurrence-popover">
            <Space>
              <Select
                value={formData.occurrenceType}
                onChange={(value: OccurrenceType) => handleFormDataChange({ occurrenceType: value })}
                style={{ width: 100 }}
              >
                {Object.entries(OccurrenceTypeNames).map(([key, value]) => (
                  <Select.Option value={key}>{value}</Select.Option>
                ))}
              </Select>
              <Select
                value={formData.occurrenceCount}
                onChange={(value: number) => handleFormDataChange({ occurrenceCount: value })}
                style={{ width: 70 }}
              >
                {OCCURRENCE_COUNTS.map((i) => (
                  <Select.Option value={i}>{i}</Select.Option>
                ))}
              </Select>
              <Button
                onClick={() =>
                  handleFormDataChange({
                    isDistinct: !formData.isDistinct,
                    distinctOption: !formData.isDistinct ? DistinctOption.STANDARD_CONCEPT : undefined,
                  })
                }
              >
                {formData.isDistinct ? 'using distinct' : 'using all'}
              </Button>
              {formData.isDistinct ? (
                <Select
                  value={formData.distinctOption}
                  onChange={(value: DistinctOption) => handleFormDataChange({ distinctOption: value })}
                  style={{ width: 170 }}
                >
                  {Object.entries(DistinctOptionNames).map(([key, value]) => (
                    <Select.Option value={key}>{value}</Select.Option>
                  ))}
                </Select>
              ) : (
                'occurrences of:'
              )}
            </Space>
          </div>
        }
      >
        <div className="criterion-card__occurrence">
          {OccurrenceTypeNames[formData.occurrenceType]} {formData.occurrenceCount}
        </div>
      </Popover>
      <div className="criterion-card__content">{props.children}</div>
    </Card>
  )
}
