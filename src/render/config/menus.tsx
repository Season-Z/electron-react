/**
 * 左侧菜单配置
 */
import React from 'react'
import { AreaChartOutlined } from '@ant-design/icons'

export interface IMenu {
  title: string
  path: string
  fullPath?: string
  icon?: React.ReactNode
  subs?: Array<IMenu>
  electron?: boolean
}

export default [
  {
    title: '预约单',
    path: '/Reservation',
    icon: <AreaChartOutlined />,
    subs: [
      {
        title: 'Foo',
        path: '/Search',
        fullPath: '/Reservation/Search'
      }
    ]
  }
] as Array<IMenu>
