import { FC, useMemo } from 'react'
import { Button, Dropdown, DropdownProps, MenuProps } from 'antd'
import { IEventModel } from '~/types/omop'
import { PlusCircleIcon } from '../Icons'

export interface EventDropdownProps extends DropdownProps {
  data: IEventModel[]
}

export const EventDropdown: FC<EventDropdownProps> = ({ data, ...dropdownProps }) => {
  const items: MenuProps['items'] = useMemo(
    () =>
      data.map((event: IEventModel) => ({
        key: event.id,
        label: event.name,
      })),
    [data]
  )

  return (
    <Dropdown trigger={['click']} {...dropdownProps} menu={{ items }}>
      <Button type="text" size="large" icon={<PlusCircleIcon width={32} height={32} />}>
        Add event
      </Button>
    </Dropdown>
  )
}
