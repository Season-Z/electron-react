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
  useRef,
  useMemo
} from 'react'
import { Table, Alert, Spin } from 'antd'
import _ from 'lodash'
import ypRider from '@utils/ypRequest'
import * as queryStructure from './utils/queryStructure'
import useCompareEffect from '@/hooks/useCompareEffect'
import { CommonTableProps, TableRefProps } from './interface'
import './index.less'

const CommonTable: RefForwardingComponent<TableRefProps, CommonTableProps> = (props, ref) => {
  const { showAlert = true, formatResult, reqStructure = 'useNormal', tableOptions } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number | string>>([])
  const [loading, setLoading] = useState(false)
  const ref_timer = useRef<any>()
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
  const sendRequest = async (current = 1, pageSize = props.pageSize ?? 30) => {
    setLoading(true)

    // const { current, pageSize } = tableParams
    const { searchParams = {} } = props
    let sParams = JSON.parse(JSON.stringify(searchParams))
    // if (!props.outControlSize) {
    //   // 外部可控size
    //   delete sParams.size
    // }
    // console.log(11, queryStructure[reqStructure](current, pageSize));
    // console.log(22, sParams);
    const params = {
      // ...reqParams,
      ...sParams,
      ...queryStructure[reqStructure](current, pageSize)
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

      setTableParams((v: any) => {
        // 如果为最后一页且页码大于一且本页无数据
        if (currentNoData && current > 1) {
          return { ...v, current: v.current - 1 }
        }
        return { ...v, dataSource: data, total, current, pageSize }
      })

      // 清空表格多选选中的行
      setSelectedRowKeys([])
      if (props.returnData) {
        props.returnData(data, { ...tableParams, dataSource: data, total, current, pageSize })
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 表格事件操作
  const changeTable = (pagination: any, filters: any, sorters: any, extra: any, action: any) => {
    const { current, pageSize } = pagination
    const { column } = sorters
    // 防止没有排序的列发生请求
    if (sorters.column && !column.sorter) {
      return
    }

    const { current: pageNo, pageSize: size } = tableParams
    // 如果是页码和页面条数变化时，请求
    if (pageNo !== current || size !== pageSize) {
      sendRequest(current, pageSize)
    }

    // 排序的回调
    if (props.sortCallback) {
      props.sortCallback(filters, sorters)
    }
    // 页面切换后，清空选中项
    setSelectedRowKeys([])
    if (props.rowSelectCallback) {
      props.rowSelectCallback([], [])
    }
    setTableParams((v: any) => ({ ...v, current, pageSize, filters, sorters }))
  }

  /**
   * 通过该 hook 定义父组件 ref 拿到子组件的实例的内容
   * 父组件使用 reflashTable 来调用子组件 sendRequest 这个方法
   */
  useImperativeHandle(
    ref,
    () => ({
      reflashTable: (params: any) => sendRequest(params),
      getTableData: () => tableParams
    }),
    [tableParams]
  )

  /**
   * 初始化加载时
   */
  useEffect(() => {
    if (!props.cancelRequest) {
      // 没有设置 cancelRequest 时发送请求

      if (ref_timer.current) clearTimeout(ref_timer.current)
      ref_timer.current = setTimeout(() => {
        sendRequest()
      }, 200)
    }
  }, [props.searchParams, props.cancelRequest])

  // 替换当前页的数据
  useEffect(() => {
    setTableParams((v: any) => ({ ...v, dataSource: props.dataSource }))
  }, [props.dataSource])

  /**
   * 覆盖组件表格的参数；
   * 用于表格的自定义操作
   */
  useCompareEffect(() => {
    if (!props.tableParams) {
      return
    }

    setTableParams(props.tableParams)
  }, [props.tableParams])

  /**
   * 默认的多选配置
   */
  const selection = {
    ...tableOptions?.rowSelection,
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
  const getRowSelection = useMemo(() => {
    // 如果没有自定义配置「rowSelection」以及没有「rowSelectCallback」表示不需要列表多选
    if (!tableOptions?.rowSelection && !props.rowSelectCallback) {
      return undefined
    }
    // // 自定义多选
    // if (tableOptions && tableOptions.rowSelection) {
    //   return {
    //     ...tableOptions.rowSelection,
    //     ...selection
    //   }
    // }
    // // 默认的多选
    // if (props.rowSelectCallback) {
    return selection
    // }
  }, [props.rowSelectCallback, selection, tableOptions?.rowSelection])

  const onRowClick = (ev: any, record: any, index: number) => {
    if (!getRowSelection) return
    // 获取键对应的值
    const tableRowVal: number | string = tableOptions?.rowKey
      ? record[tableOptions?.rowKey]
      : record.id
      ? record.id
      : ''
    const isSingle = selection.type ? selection.type === 'radio' : false
    const exited = selectedRowKeys.includes(tableRowVal)

    const selectedKeys = exited
      ? selectedRowKeys.filter((v: number | string) => v !== tableRowVal)
      : isSingle
      ? [tableRowVal]
      : selectedRowKeys.concat(tableRowVal)

    const selectedRows = tableParams.dataSource.filter((v: any, k: number) => {
      const key = tableOptions?.rowKey || 'id'
      return selectedKeys.includes(v[key])
    })

    setSelectedRowKeys(selectedKeys)
    if (props.rowSelectCallback) {
      props.rowSelectCallback(selectedKeys, selectedRows)
    }
  }

  const tableRowOption = (record: any, index: number) => {
    return {
      onClick: (ev: Event) => onRowClick(ev, record, index),
      ...tableOptions?.onRow
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
        return (
          <>
            <span className='paginationElement'>{props.paginationElement(total, range)}</span>
            &emsp;&emsp;
            <span>共{total}条</span>
          </>
        )
      }
      return <div>共{total}条</div>
    }
  }
  const calculateFunc = () => {
    const { scrollYSize = 0 } = props
    if (scrollYSize) {
      return scrollYSize
    }
    const clientHeight = document.body.clientHeight
    const ele = document.getElementById('tablePart')
    if (ele) {
      const top = ele.getBoundingClientRect().top
      const scrollY = clientHeight - top - 50 - 70
      // console.log('top', top)
      // console.log('scrollY', scrollY)
      return scrollY
    }
  }
  const scrollProps = {
    ...tableOptions?.scroll,
    y: calculateFunc()
  }

  return (
    <div id='tablePart'>
      {/* {showAlert && (
        <div className='table-alert'>
          <Alert message={`共有${tableParams.total}条数据`} type='warning' showIcon key='alert' />
        </div>
      )} */}
      <Table
        columns={props.columns}
        dataSource={tableParams.dataSource}
        rowKey={(r: any, key: number) => (r.id ? r.id : key)}
        onChange={changeTable}
        loading={loading}
        key='table'
        onRow={tableRowOption}
        size='small'
        {...tableOptions}
        scroll={scrollProps}
        rowSelection={getRowSelection}
        pagination={props.hidePagination ? false : getPagination}
      />
    </div>
  )
}

export default memo(forwardRef(CommonTable))
