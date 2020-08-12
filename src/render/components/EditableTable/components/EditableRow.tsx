import React from 'react'
import cls from 'classnames'
import styles from '../index.less'

const EditableRow: React.FC<any> = (props: any) => {
  // 获取表格行的「editableTableAdd」，存在则表示当前行为新增行。同时为该行设置背景色
  const { editableTableAdd }: any = props.record ?? {}
  return (
    <tr
      {...props}
      className={cls(styles.editableTableRow, {
        newRow: !!editableTableAdd
      })}
    />
  )
}

export default EditableRow
