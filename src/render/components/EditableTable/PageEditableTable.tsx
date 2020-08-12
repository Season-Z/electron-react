/**
 * 通用 可编辑 表格
 */
import React, {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  RefForwardingComponent,
  memo,
  useEffect
} from 'react'
import { Button } from 'antd'
import CommonTable from '@components/CommonTable'
import EditableCell from './components/EditableCell'
import EditableRow from './components/EditableRow'
import { PlusOutlined } from '@ant-design/icons'
import useCompareEffect from '@hooks/useCompareEffect'
import { tableOptionsCol } from './utils/constance'
import { EditableTableProps, HandleType, EditTableRefProps } from './interface'
import { getEditableTableKey, compareAndChangeData, isEmpty } from './utils/utils'
import './index.less'

const EditableTable: RefForwardingComponent<EditTableRefProps, EditableTableProps> = (
  props,
  ref
) => {
  const { onTableParamsChange, returnData, onChange, saveRow, deleteRow, rowSelectCallback } = props

  const table: any = useRef(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [tableParams, setTableParams] = useState({
    dataSource: [],
    loading: false,
    total: 0,
    current: 1,
    pageSize: props.pageSize ?? 10,
    order: {},
    filters: {},
    sorters: {}
  })

  // 获取有效的columns
  const usefulColumns = useMemo(() => props.columns.filter(Boolean), [props.columns])

  const addRowData = useMemo(
    () => () => {
      return usefulColumns.reduce((prev: any, next: any) => {
        prev[next.dataIndex] = undefined
        // 每个新增的数据都设置一个键为「editableTableKey」的随机值
        prev['editableTableKey'] = getEditableTableKey()
        // 标记，表示当前行是未保存的新增状态
        prev['editableTableAdd'] = true
        return prev
      }, {})
    },
    [usefulColumns]
  )

  // 新增行
  const handleAddRow = async () => {
    try {
      const newRows = addRowData()
      // 数据拼接
      const list = [newRows, ...tableParams.dataSource]
      if (tableParams.dataSource.length >= tableParams.pageSize) {
        // 删除最后一项
        list.pop()
      }

      if (props.onChange) {
        /**
         * currentCell：当前编辑的单元格数据，{字段名：值}
         * currentRow：当前编辑的行数据
         * dataSource：表格所有数据
         */
        const dataParams = {
          currentCell: {},
          currentRow: newRows,
          dataSource: list,
          type: 'ADD' as HandleType
        }
        props.onChange(dataParams, selectedRowKeys)
      }

      // 如果存在异步函数
      if (props.addRow) {
        await props.addRow(addRowData, list)
      } else {
        setTableParams((v: any) => ({ ...v, dataSource: list }))
      }
    } catch (error) {
      console.error('add row failed：', error)
    }
  }

  /**
   * 保存表格行数据
   * @param data 当前修改保存的表格行所有数据
   * @param other 其他参数
   */
  const handleSaveRow = useCallback(
    async (data: any, other: any) => {
      try {
        // 「hasEdited」数据是否变化
        const { hasEdited, currentCell } = other

        if (!hasEdited) return

        // 赋值更新 列表数据
        const list = compareAndChangeData(tableParams.dataSource, data)
        // 更新选中的数据
        const selectedKeys = compareAndChangeData(selectedRowKeys, data)
        if (onChange) {
          /**
           * currentCell：当前编辑的单元格数据，{字段名：值}
           * currentRow：当前编辑的行数据
           * dataSource：表格所有数据
           */
          const dataParams = {
            currentCell,
            currentRow: data,
            dataSource: list,
            type: 'EDIT' as HandleType
          }
          onChange(dataParams, selectedKeys)
        }

        // 如果存在异步保存函数
        if (saveRow) {
          saveRow(data, list)
        } else {
          setTableParams((v: any) => ({ ...v, dataSource: list }))

          setSelectedRowKeys(selectedKeys)
        }
      } catch (error) {
        console.error('save row failed：', error)
      }
    },
    [selectedRowKeys, tableParams.dataSource, onChange, saveRow]
  )

  /**
   * 删除行
   * @param i 删除行对应的 editableTableKey 值
   */
  const handleDeleteRow = useCallback(
    async (i: any) => {
      try {
        const obj: any = tableParams.dataSource.find((v: any) => v.editableTableKey === i) || {}
        const list = tableParams.dataSource.filter((v: any) => v.editableTableKey !== i)

        // 删除回调
        const deleteCallBack = () => {
          // 如果删除的是已经选中的行数据，过滤了
          const selectedRows = selectedRowKeys.length
            ? selectedRowKeys.filter((vi: any) => vi.editableTableKey !== i)
            : []
          setSelectedRowKeys(selectedRows)

          if (onChange) {
            /**
             * currentCell：当前编辑的单元格数据，{字段名：值}
             * currentRow：当前编辑的行数据
             * dataSource：表格所有数据
             */
            const dataParams = {
              currentCell: {},
              currentRow: obj,
              dataSource: list,
              type: 'DELETE' as HandleType
            }
            // 如果存在 onChange 则将删除后的结果数据返回
            onChange(dataParams, selectedRows)
          }

          setTableParams((v: any) => ({
            ...v,
            dataSource: list
          }))
        }
        // 删除
        if (deleteRow) {
          // 删除返回值
          const result: boolean | undefined = await deleteRow(obj, list)
          // 删除成功
          if (result) {
            deleteCallBack()
          }
        } else {
          deleteCallBack()
        }
      } catch (error) {
        console.error('delete row failed：', error)
      }
    },
    [deleteRow, onChange, selectedRowKeys, tableParams.dataSource]
  )

  /**
   * 表格的页面切换、展示页数量调整等回调操作
   * @param data tableParams的回调数据
   */
  const handleTableChange = useCallback(
    (data: any[], params: any) => {
      setTableParams(params)
      setSelectedRowKeys([])
      if (returnData) {
        returnData(data, params)
      }
    },
    [returnData]
  )

  /**
   * 表格选择行事件
   */
  // const handleSelect = rowSelectCallback
  //   ? useCallback(
  //       (keys: any[], rows: any[]) => {
  //         if (rowSelectCallback) {
  //           rowSelectCallback(keys, rows)
  //         }

  //         if (onChange) {
  //           const dataParams = {
  //             currentCell: {},
  //             currentRow: {},
  //             dataSource: tableParams.dataSource,
  //             type: 'SELECTED' as HandleType
  //           }
  //           onChange(dataParams, keys)
  //         }
  //       },
  //       [onChange, rowSelectCallback, tableParams.dataSource]
  //     )
  //   : undefined

  const selection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (keys: any[] | any) => {
      setSelectedRowKeys(keys)

      if (props.onChange) {
        const dataParams = {
          currentCell: {},
          currentRow: {},
          dataSource: tableParams.dataSource,
          type: 'SELECTED' as HandleType
        }
        props.onChange(dataParams, keys)
      }
    }
  }

  /**
   * 暴露给父组件使用的方法
   */
  useImperativeHandle(
    ref,
    () => ({
      reflashTable: () => table.current.reflashTable(),
      getTableData: () => tableParams
    }),
    [tableParams]
  )

  /**
   * 表格参数变化时的回调
   */
  useEffect(() => {
    if (onTableParamsChange) {
      onTableParamsChange(tableParams)
    }
  }, [tableParams, onTableParamsChange])

  /**
   * 更新某一行获取多行的数据
   */
  useCompareEffect(() => {
    const { updateDataSource } = props
    if (!updateDataSource || isEmpty(updateDataSource)) {
      return
    }

    const { dataSource, pageSize } = tableParams
    let list: any[] = dataSource
    if (Array.isArray(updateDataSource)) {
      // 生成对象：{editableTableKey: data}
      const rows: any = updateDataSource.reduce(
        (pre: any, next: any) => {
          const key = next.editableTableKey
          // 存在 editableTableKey，表示该项为修改；不存在表示该项为新增
          if (key) {
            pre[key] = next
            // 记录「editRowLength」，表示要编辑的行数
            pre.editRowLength = ++pre.editRowLength
          } else {
            // 新增
            const obj = { ...next, editableTableAdd: true }
            pre.add = pre.add.concat(obj)
          }
          return pre
        },
        { add: [], editRowLength: 0 }
      )

      // 存在要编辑的表格行
      if (rows.editRowLength > 0) {
        // 将编辑的数据更新到 dataSource
        list = dataSource.map((v: any) => rows[v.editableTableKey] ?? v)
      }

      // 添加数据
      if (rows.add.length > 0) {
        list = rows.add.concat(list)

        if (list.length > +pageSize) {
          // 选取出列表单页的限额数据量，将其加入列表数据
          list = list.slice(0, +pageSize)
        }
      }
    } else {
      list = compareAndChangeData(dataSource, updateDataSource)
    }

    setTableParams((v: any) => ({ ...v, dataSource: list }))
    if (props.onChange) {
      const dataParams = {
        currentCell: {},
        currentRow: {},
        dataSource: list,
        type: 'UPDATE' as HandleType
      }
      // 如果存在 onChange 则将删除后的结果数据返回
      props.onChange(dataParams, selectedRowKeys)
    }
  }, [props.updateDataSource, selectedRowKeys])

  // 如果没有设置「hideDeleteBtn」，给「columns」拼接操作表头，并补上删除功能
  const renderCol = useMemo(() => {
    if (props.hideDeleteBtn) {
      return usefulColumns
    }
    return usefulColumns.every(v => v.title !== '操作')
      ? [...usefulColumns, tableOptionsCol]
      : usefulColumns
  }, [usefulColumns, props.hideDeleteBtn])

  const columns = useMemo(() => {
    return renderCol.map((col: any) => {
      // 如果当前column不存在「editable」字段、表头文案不是「操作」以及没有「type」值，表示当前单元格展示的是文案而不是表单组件
      if (!col.editable && !col.type && !col.render && col.title !== '操作') {
        return col
      }

      return {
        ...col,
        onCell: (record: any, rowIndex: number) => {
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
  }, [handleDeleteRow, handleSaveRow, props.hideDeleteBtn, renderCol])

  return (
    <>
      <CommonTable
        ref={table}
        {...props}
        columns={columns}
        queryDataUrl={props.queryDataUrl || ''}
        tableParams={tableParams}
        returnData={handleTableChange}
        // rowSelectCallback={handleSelect}
        // tableOptions={{
        //   ...props.tableOptions,
        //   components: {
        //     body: { row: EditableRow, cell: EditableCell }
        //   },
        //   onRow: (record: any, index: any) => ({ record, index }) // 这里返回的值可以在「EditableRow」接收到
        // }}
        tableOptions={{
          ...props.tableOptions,
          rowSelection: props.canSelected ? selection : undefined,
          components: {
            body: { row: EditableRow, cell: EditableCell }
          },
          onRow: (record: any, index: any) => ({ record, index })
        }}
      />
      {!props.hideBtn && (
        <Button
          type='dashed'
          onClick={handleAddRow}
          disabled={props.disableAddBtn}
          className='mTop16'
          style={{ width: '100%' }}
        >
          <PlusOutlined /> {props.buttonTitle || '添加'}
        </Button>
      )}
    </>
  )
}

export default memo(forwardRef(EditableTable))

export { EditableTableProps }
