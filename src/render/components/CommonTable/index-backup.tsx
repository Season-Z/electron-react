/**
 * 通用列表
 */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  memo,
  RefForwardingComponent,
  useMemo
} from 'react'
import { Table, Alert, Spin } from 'antd'
import _ from 'lodash'
import ypRider from '@utils/ypRequest'
import * as queryStructure from './utils/queryStructure'
import { CommonTableProps, TableRefProps } from './interface'
import './index.less'

const CommonTable: RefForwardingComponent<TableRefProps, CommonTableProps> = (props, ref) => {
  const { showAlert = true, formatResult, reqStructure = 'useNormal', tableOptions } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState(
    props.tableParams ?? {
      dataSource: [],
      total: 0,
      current: 1,
      pageSize: props.pageSize ?? 10,
      order: {},
      filters: {},
      sorters: {}
    }
  )

  /**
   * values 外部查询调用传参
   * pageParams 分页等查询参数
   */
  const sendRequest = async (reqParams: any) => {
    setLoading(true)

    const { current, pageSize } = tableParams
    const params = {
      ...queryStructure[reqStructure](current, pageSize),
      ...reqParams,
      ...props.searchParams
    }

    try {
      if (!props.queryDataUrl) {
        return
      }
      const result: any = await ypRider(props.queryDataUrl, params)
      if (formatResult instanceof Function) {
        // 交给调用处格式化数据
        result.result = formatResult(result.result)
      }

      const { isEnd, total = 0, list: l, data: d } = result.result
      const data: any = d ?? l ?? []

      if (!data || !Array.isArray(data)) {
        throw '接口返回的数据结构错误'
      }

      // 对「total」进行数据转化
      const totalCount = +total
      if (isNaN(totalCount)) {
        throw '「total」字段类型错误'
      }

      const currentNoData = isEnd && !data.length
      // console.log(data)
      setTableParams((v: any) => {
        // 如果为最后一页且页码大于一且本页无数据
        if (currentNoData && current > 1) {
          return { ...v, current: v.current - 1 }
        }
        return { ...v, dataSource: data, total }
      })

      // 清空表格多选选中的行
      setSelectedRowKeys([])
      if (props.returnData) {
        console.log(1234)
        props.returnData(data, { ...tableParams, dataSource: data, total })
      }
    } catch (error) {
      console.log('request error ==>', error)
    } finally {
      setLoading(false)
    }
  }

  // 表格事件操作
  const changeTable = (pagination: any, filters: any, sorters: any) => {
    const { current, pageSize } = pagination
    const { column } = sorters
    // 防止没有排序的列发生请求
    if (sorters.column && !column.sorter) {
      return
    }

    setTableParams((v: any) => ({ ...v, current, pageSize, filters, sorters }))
    // 排序的回调
    if (props.sortCallback) {
      props.sortCallback(filters, sorters)
    }
    // 页面切换后，清空选中项
    setSelectedRowKeys([])
    if (props.rowSelectCallback) {
      props.rowSelectCallback([], [])
    }
  }

  /**
   * 通过该 hook 定义父组件 ref 拿到子组件的实例的内容
   * 父组件使用 reflashTable 来调用子组件 sendRequest 这个方法
   */
  useImperativeHandle(ref, () => ({
    reflashTable: (params: any) => sendRequest(params),
    getTableData: () => tableParams
  }))

  /**
   * 覆盖组件表格的参数；
   * 用于表格的自定义操作
   */
  useEffect(() => {
    if (!props.tableParams) {
      return
    }

    setTableParams(props.tableParams)
  }, [props.tableParams])

  /**
   * 初始化加载时
   */
  useEffect(() => {
    // 如果 cancelRequest ，则不发生请求
    if (!props.cancelRequest) {
      sendRequest({})
    }
  }, [tableParams.current, tableParams.pageSize, props.cancelRequest])

  useEffect(() => {
    sendRequest({ ...props.searchParams, ...queryStructure[reqStructure](1, tableParams.pageSize) })
  }, [props.searchParams, tableParams.pageSize])

  // 替换当前页的数据
  useEffect(() => {
    setTableParams((v: any) => ({ ...v, dataSource: props.dataSource }))
  }, [props.dataSource])

  /**
   * 默认的多选配置
   */
  const selection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (keys: any[] | any, selectedRows: any[]) => {
      setSelectedRowKeys(keys)

      if (props.rowSelectCallback) {
        props.rowSelectCallback(keys, selectedRows)
      }
    }
  }

  /**
   * 获取CommonTable的selection配置
   */
  const getRowSelection = () => {
    // 如果没有自定义配置「rowSelection」以及没有「rowSelectCallback」表示不需要列表多选
    if (!tableOptions?.rowSelection && !props.rowSelectCallback) {
      return undefined
    }
    // 自定义多选
    if (tableOptions && tableOptions.rowSelection) {
      return {
        ...tableOptions.rowSelection,
        ...selection
      }
    }
    // 默认的多选
    if (props.rowSelectCallback) {
      return selection
    }
  }

  const getPagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '30', '50', '100'],
    pageSize: tableParams.pageSize,
    ...tableOptions?.pagination,
    total: tableParams.total,
    current: tableParams.current,
    showTotal: (total: any, range: any) => {
      if (props.paginationElement) {
        return <div className='paginationElement'>{props.paginationElement(total, range)}</div>
      }
      return null
    }
  }

  return (
    <Spin spinning={loading} wrapperClassName='commonTable'>
      {showAlert && (
        <div className='table-alert'>
          <Alert message={`共有${tableParams.total}条数据`} type='warning' showIcon key='alert' />
        </div>
      )}
      <Table
        columns={props.columns}
        dataSource={tableParams.dataSource}
        rowKey={(key, record: any) => (record.id ? record.id : key)}
        onChange={changeTable}
        key='table'
        size='small'
        {...tableOptions}
        rowSelection={getRowSelection()}
        pagination={props.hidePagination ? false : getPagination}
      />
    </Spin>
  )
}

export default memo(forwardRef(CommonTable))
