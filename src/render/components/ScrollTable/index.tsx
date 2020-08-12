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
import { Table } from 'antd'
import _ from 'lodash'
import ypRider from '@utils/ypRequest'
import * as queryStructure2 from './utils/queryStructure'
import { ScrollTableProps, TableRefProps } from './interface'
import { useScrollLoad } from './hooks'
import useDependencyEffect from '@/hooks/useDependencyEffect'
import './index.less'

const queryStructure: any = queryStructure2

const ScrollTable: RefForwardingComponent<TableRefProps, ScrollTableProps> = (props, ref) => {
  const { formatResult, reqStructure = 'useNormal', tableOptions } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number | string>>([])
  const [loading, setLoading] = useState(false)
  const ref_timer = useRef<any>()
  const ref_tableWrap = useRef<any>()

  // 是否是最后的数据
  const isEndOfData = useRef(false)
  // 当前请求是否是滚动请求数据
  const isScrollRequest = useRef<boolean>(false)

  const pageCount = useRef<number>(1)
  const dataSource = useRef<any[]>([])
  // const [pageCount, setPageCount] = useState(1)
  // const [dataSource, setDataSource] = useState<any[]>([])

  const [setScrollEventContainer] = useScrollLoad((isEnd: boolean) => {
    if (isEnd) {
      if (!isEnd || loading) return
      isScrollRequest.current = true
      pageCount.current = pageCount.current + 1

      sendRequest(pageCount.current)
    }
  })

  /**
   * values 外部查询调用传参
   * pageParams 分页等查询参数
   */
  const sendRequest = async (current = 1, pageSize = props.pageSize ?? 10) => {
    if (isEndOfData.current === true && isScrollRequest.current) return
    setLoading(true)

    const { searchParams = {} } = props
    const pageNo = current || searchParams.current
    const size = pageSize || searchParams.pageSize

    const params = {
      ...searchParams,
      ...queryStructure[reqStructure](pageNo, size)
    }

    try {
      const result: any = await ypRider(props.queryDataUrl, params)
      if (formatResult instanceof Function) {
        // 交给调用处格式化数据
        result.result = formatResult(result.result)
      }

      const { isEnd, total = 0, list: l, data: d } = result.result
      const data: any = d ?? l ?? []

      if (!result.success) {
        return
      }

      if (!data || !Array.isArray(data)) {
        throw '接口返回的数据结构错误'
      }

      // 对「total」进行数据转化
      const totalCount = +total
      if (isNaN(totalCount)) {
        throw '「total」字段类型错误'
      }

      // 判断是否是最终页
      const isEndData = totalCount / size <= pageNo

      // 将是否为最后数据赋值
      isEndOfData.current = isEndData

      dataSource.current = pageNo === 1 ? data : dataSource.current.concat(data)

      if (pageNo === 1) {
        setSelectedRowKeys([])
      }
      if (props.returnData) {
        props.returnData(data, { total, current, pageSize })
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 通过该 hook 定义父组件 ref 拿到子组件的实例的内容
   * 父组件使用 reflashTable 来调用子组件 sendRequest 这个方法
   */
  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     reflashTable: (params: any) => {
  //       isScrollRequest.current = false
  //       sendRequest(params)
  //     }
  //   }),
  //   []
  // )

  /**
   * 初始化加载时
   */
  useEffect(() => {
    if (!props.cancelRequest) {
      // 没有设置 cancelRequest 时发送请求
      if (ref_timer.current) clearTimeout(ref_timer.current)
      isScrollRequest.current = false
      pageCount.current = 1
      ref_timer.current = setTimeout(() => {
        sendRequest(pageCount.current)
      }, 200)
    }
  }, [props.searchParams, props.cancelRequest])

  // 替换当前页的数据
  // useEffect(() => {
  //   if (props.dataSource) {
  //     setDataSource(props.dataSource)
  //   }
  // }, [props.dataSource])

  useEffect(() => {
    setScrollEventContainer(ref_tableWrap.current)
  }, [])

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

    return selection
  }, [props.rowSelectCallback, selection, tableOptions?.rowSelection])

  const onRowClick = (ev: any, record: any, index: number) => {
    if (!getRowSelection) return
    const tableRowVal: number | string = tableOptions?.rowKey
      ? record[tableOptions?.rowKey]
      : record.id
      ? record.id
      : ''
    // 没有有效的键值，取序号
    const useRowVal: number | string = tableRowVal || index
    const isSingle = selection.type ? selection.type === 'radio' : false
    const exited = selectedRowKeys.includes(useRowVal)

    const selectedKeys = exited
      ? selectedRowKeys.filter((v: number | string, k: number) =>
          tableRowVal ? v !== tableRowVal : k !== useRowVal
        )
      : isSingle
      ? [useRowVal]
      : selectedRowKeys.concat(useRowVal)

    const selectedRows = dataSource.current.filter((v: any, k: number) => {
      if (tableRowVal) {
        const key = tableOptions?.rowKey || 'id'
        return selectedKeys.includes(v[key])
      } else {
        return selectedKeys.includes(k)
      }
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

  return (
    <div ref={ref_tableWrap} className='CommonWrap-list'>
      <Table
        columns={props.columns}
        dataSource={dataSource.current}
        rowKey={(r: any, key: number) => (r.id ? r.id : key)}
        onChange={props.changeTable}
        onRow={tableRowOption}
        size='small'
        {...tableOptions}
        loading={loading}
        scroll={{ y: 510, ...tableOptions?.scroll }}
        rowSelection={getRowSelection}
        pagination={false}
      />
    </div>
  )
}

export default memo(forwardRef(ScrollTable))
