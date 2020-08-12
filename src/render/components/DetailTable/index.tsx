import React from 'react'
import { Table } from 'antd'
import style from './Style.less'
const DetailTable = (props: any) => {
  const { columns, data, pagination } = props
  return (
    <div className={style.detailTable}>
      <Table columns={columns} dataSource={data} bordered pagination={pagination} />
    </div>
  )
}

export default DetailTable
