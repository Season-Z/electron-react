/**
 * 通用 可编辑 表格
 */
import React, { forwardRef } from 'react'
import { EditableTableProps } from './interface'
// import SimpleEditableTable from './SimpleEditableTable'
import PageEditableTable from './PageEditableTable'

const EditableTable = (props: EditableTableProps, ref: any) => {
  // if (props.type && props.type === 'simple') {
  //   return <SimpleEditableTable {...props} />
  // }

  return <PageEditableTable ref={ref} {...props} />
}
export default forwardRef(EditableTable)
