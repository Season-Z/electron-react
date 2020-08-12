/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, SFC } from 'react'
import { Popconfirm } from 'antd'
import * as Field2 from './Field'
import { EditableCellProps, FieldsType, RenderComponentProps } from '../interface'
import { getEditableTableKey } from '../utils/utils'
import useCellValue from '../hooks/useCellValue'
import '../index.less'

const Field: any = Field2

const EditableCell: React.FC<EditableCellProps> = props => {
  const {
    title,
    editable,
    children,
    dataIndex,
    type,
    record,
    rowIndex,
    render,
    dataList: getDataList = [],
    fieldOptions,
    handleSaveRow,
    handleDeleteRow,
    hidedeletebtn,
    ...restProps
  } = props
  // 拼接操作
  if (render && title === '操作') {
    // 给新增的行添加背景颜色
    return (
      <td {...restProps}>
        {!hidedeletebtn && (
          <Popconfirm
            title='确认删除这条数据吗？'
            onConfirm={() => handleDeleteRow(record.editableTableKey)}
            okText='确认'
            cancelText='取消'
          >
            <a style={{ marginRight: '8px' }}>删除</a>
          </Popconfirm>
        )}
        {render(record[dataIndex], record, rowIndex)}
      </td>
    )
  }

  const [editing, setEditing] = useState<boolean>(false)

  // 格式化单元格文本内容和下拉数据
  const [childContent, dataList] = useCellValue({
    children,
    dataList: getDataList
  })

  // 每条数据添加「editableTableKey」属性，相当于主键ID
  useEffect(() => {
    // 防止重复生成ID，预防后续操作的数据无法追溯
    if (record && !record.editableTableKey) {
      record.editableTableKey = getEditableTableKey()
    }
  }, [record])

  // 如果没有传「type」时设置默认是「INPUT」
  // 传了「type」 可以不传 「editable」
  const fieldType: FieldsType | undefined = !type && editable ? 'INPUT' : type

  // 更改单元格的编辑状态
  const toggleEdit = () => {
    setEditing(!editing)
  }

  // 控件发生变化时
  const fieldChange = (val: any) => {
    try {
      // 切换编辑状态
      toggleEdit()

      // 更新后的本行数据
      const params = {
        ...record,
        [dataIndex]: val
      }

      // 如果自定义了回调
      if (fieldOptions?.onChange) {
        fieldOptions.onChange(params)
      }

      // 单元格字段名对于的数据
      const currentCell = { [dataIndex]: val }
      // 是否修改过数据
      const hasEdited = record[dataIndex] !== val

      handleSaveRow(params, { hasEdited, currentCell })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  // 设置组件回显的值
  const defaultVal = record ? record[dataIndex] : undefined
  let childNode = childContent

  const fieldVal = ['string', 'number'].includes(typeof defaultVal) ? defaultVal : undefined

  /**
   * 如果存在自定义渲染的情况，给「render」函数的第四项添加参数
   */
  if (render) {
    const getFieldComponent: SFC<RenderComponentProps> = renderParams => {
      if (editing && renderParams.fieldType) {
        const { fieldType, fieldOptions, dataList: fnList, value } = renderParams
        const FieldComponent = Field[fieldType]

        return (
          <FieldComponent
            fieldOptions={fieldOptions}
            dataList={fnList ?? dataList}
            fieldChange={fieldChange}
            fieldValue={value ?? fieldVal}
            editing={editing}
          />
        )
      }

      return (
        <div className='editableCellValueWrap' onClick={toggleEdit}>
          {childNode}
        </div>
      )
    }

    return <td {...restProps}>{render(record[dataIndex], record, rowIndex, getFieldComponent)}</td>
  }

  if (fieldType) {
    const FieldComponent = Field[fieldType]
    childNode = editing ? (
      <FieldComponent
        {...props}
        dataList={dataList}
        fieldChange={fieldChange}
        fieldValue={fieldVal}
        editing={editing}
      />
    ) : (
      <div className='editableCellValueWrap' onClick={toggleEdit}>
        {childContent}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export default EditableCell
