import { FC } from 'react'
import { Select, SelectProps } from 'antd'
import styles from './SelectConcept.scss?inline'

export interface SelectConceptProps extends SelectProps {}

export const SelectConcept: FC<SelectConceptProps> = (props) => {
  return (
    <>
      <style>{styles}</style>
      <Select
        mode="multiple"
        className="select-concept"
        allowClear={false}
        placeholder="Please select"
        defaultValue={['apple', 'orange']}
        {...props}
      >
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="orange">Orange</Select.Option>
        <Select.Option value="pear">Pear</Select.Option>
        <Select.Option value="kiwi">Kiwi</Select.Option>
        <Select.Option value="durian">Durian</Select.Option>
      </Select>
    </>
  )
}
