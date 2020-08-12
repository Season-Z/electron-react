/**
 * 数据全是外部传入的 可编辑表格
 */
import React, { useState, useMemo, useEffect } from 'react'
import { Table, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import _ from 'lodash'
import EditableCell from './components/EditableCell'
import EditableRow from './components/EditableRow'
import { tableOptionsCol } from './utils/constance'
import { SimpleEditableTableProps, HandleType } from './interface'
import './index.less'

const EditableTable = (props: SimpleEditableTableProps) => {
  const [dataSource, setDataSource]: any = useState(props.dataSource)

  const addRowData = useMemo(() => {
    return props.columns.reduce((prev: any, next: any) => {
      prev[next.dataIndex] = undefined
      return prev
    }, {})
  }, [])

  // 新增行
  const handleAddRow = async () => {
    try {
      // 每个新增的数据都设置一个键为「editableTableKey」的随机值
      const rowData = { ...addRowData, editableTableKey: _.uniqueId('edittable_') }

      const list = [rowData, ...dataSource]
      // if (props.addRow) {
      //   await props.addRow()
      // }
      // if (props.addRow) {
      //   props.addRow(addRowData, list)
      // }
      if (props.onChange) {
        props.onChange(addRowData, list)
      }
      setDataSource(list)
    } catch (error) {
      console.log('add row failed：', error)
    }
  }
  /**
   * 保存表格行数据
   * @param data 当前修改保存的表格行所有数据
   * @param other 其他参数
   */
  const handleSaveRow = async (data: any, other: any) => {
    try {
      // hasEdited，数据是否变化
      const { hasEdited, currentCell } = other

      if (!hasEdited) {
        return
      }

      // 赋值更新 列表数据
      const list = dataSource.map((v: any) => (v.editableTableKey === data.editableTableKey ? data : v))
      // 更新选中的数据
      // const selectedKeys = selectedRowKeys.map((v: any) => (v.editableTableKey === data.editableTableKey ? data : v))
      if (props.onChange) {
        /**
         * currentCell：当前编辑的单元格数据，{字段名：值}
         * currentRow：当前编辑的行数据
         * dataSource：表格所有数据
         */
        const dataParams = { currentCell, currentRow: data, dataSource: list, type: 'EDIT' as HandleType }
        // props.onChange(dataParams, [])
      }

      // if (props.saveRow) {
      //   await props.saveRow(data, list)
      // } else {
      setDataSource(list)
      // }

      if (props.onChange) {
        props.onChange(data, list)
      }
    } catch (error) {
      console.log('save row failed：', error)
    }
  }

  // 删除行
  const handleDeleteRow = async (i: any) => {
    try {
      // const obj: any =
      //   dataSource.find((v: any) => v.editableTableKey === i) || {};
      const list = dataSource.filter((v: any) => v.editableTableKey !== i)

      // 如果删除的是已经选中的行数据，过滤了
      // const selectedRows = !!selectedRowKeys.length ? selectedRowKeys.filter((vi: any) => vi.editableTableKey !== i) : []
      // setSelectedRowKeys(selectedRows)

      if (props.onChange) {
        /**
         * currentCell：当前编辑的单元格数据，{字段名：值}
         * currentRow：当前编辑的行数据
         * dataSource：表格所有数据
         */
        const dataParams = {
          currentCell: {},
          currentRow: {},
          dataSource: list,
          type: 'DELETE' as HandleType
        }
        // 如果存在 onChange 则将删除后的结果数据返回
        props.onChange(dataParams, list)
      }

      // if (props.deleteRow) {
      //   await props.deleteRow(obj, list)
      //   table.current.reflashTable()
      // } else {
      // 将之前新增时模拟删除的一项数据加回来
      // setTableParams((v: any) => ({ ...v, dataSource: [...list, ...removedRows] }))
      // }
      // if (props.onChange) {
      //   props.onChange(data, list)
      // }

      setDataSource(list)
    } catch (error) {
      console.log('delete row failed：', error)
    }
  }

  useEffect(() => {
    setDataSource(props.dataSource)
  }, [props.dataSource])

  // 如果没有设置「hideDeleteBtn」，给「columns」拼接操作表头，并补上删除功能
  const renderCol = useMemo(() => {
    if (props.hideDeleteBtn) {
      return props.columns
    }
    return props.columns.every(v => v.title !== '操作') ? [...props.columns, tableOptionsCol] : props.columns
  }, [props.columns])

  const columns = useMemo(() => {
    return renderCol.map((col: any) => {
      // 如果当前column不存在 editable 字段、表头文案不是操作以及没有 type 值，表示当前单元格展示的是文案而不是表单组件
      if (!col.editable && col.title !== '操作' && !col.type && !col.render) {
        return col
      }
      return {
        ...col,
        onCell: (record: any, rowIndex: any) => {
          return {
            ...col,
            rowIndex,
            record,
            handleSaveRow,
            handleDeleteRow,
            hidedeletebtn: props.hideDeleteBtn
          }
        }
      }
    })
  }, [renderCol, handleSaveRow, handleDeleteRow, props.hideDeleteBtn])

  // const selection = {
  //   selectedRowKeys: selectedRowKeys,
  //   onChange: (keys: any[] | any) => {
  //     setSelectedRowKeys(keys)

  //     if (props.onChange) {
  //       const dataParams = {
  //         currentCell: {},
  //         currentRow: {},
  //         dataSource: dataSource,
  //         type: 'SELECTED' as HandleType
  //       }
  //       props.onChange(dataParams, keys)
  //     }
  //   }
  // }

  return (
    <>
      <Table
        components={{
          body: { row: EditableRow, cell: EditableCell }
        }}
        rowClassName={() => 'editableTable'}
        // rowSelection={props.canSelected ? selection : undefined}
        dataSource={dataSource}
        columns={columns}
        rowKey={(k, re: any) => (re.id ? re.id : k)}
        pagination={false}
        size='small'
        {...props.tableOptions}
      />
      {!props.hideBtn && (
        <Button type='dashed' onClick={handleAddRow} className='mTop16' style={{ width: '100%' }}>
          <PlusOutlined /> {props.buttonTitle || '添加'}
        </Button>
      )}
    </>
  )
}

export default EditableTable
