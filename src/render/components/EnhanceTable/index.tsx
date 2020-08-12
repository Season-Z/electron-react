/**
 * index.tsx 是基础版本
 * 非必要功能不建议大改动
 * scroll.tsx 是 YPSHOP 定制版；改动可以在 scroll.tsx 中实施
 */
import React, { useEffect, useState, useContext, useRef, useImperativeHandle } from 'react'
import { Alert, Input, Select } from 'antd'
import Table, { TableProps, TablePaginationConfig, ColumnType, ColumnsType } from 'antd/es/table'
import { SorterResult, TableCurrentDataSource } from 'antd/es/table/interface'
import Form, { FormInstance, FormItemProps } from 'antd/es/form'
import ypRequest, { ResponstResult } from '@utils/ypRequest'
import { useUpDownForInput } from './hooks'
import styles from './index.less'

export interface OptionsItem {
  label: string
  value: string | number
}

export interface CellChangeArgs<RecordType = any> {
  value: string | number
  form: FormInstance
  dataIndex: string
  record: RecordType
  rowIndex: number
  keyCode: number | undefined
  type: EDIT_TYPE
}

export type EDIT_TYPE = 'INPUT' | 'SELECT'

export interface ColumnProps<RecordType = any> extends ColumnType<RecordType> {
  editable?: boolean | ((txt: any, record: RecordType, index: number) => boolean)
  type?: EDIT_TYPE
  options?:
  | Array<OptionsItem>
  | ((txt: any, record: RecordType, index: number) => Array<OptionsItem>)
  show?: boolean
  onCellChange?: (arg0: CellChangeArgs<RecordType>) => void
  disabled?: boolean | ((txt: any, record: RecordType, index: number) => boolean)
  /** 目前提供 Form.Item 的支持 API: getValueFromEvent */
  FormItem?: {
    getValueFromEvent?: (arg0: React.SyntheticEvent & { external: CellChangeArgs }) => any
  }
}

export interface RefType<RecordType = any> {
  dataSource: Array<RecordType> | undefined
  pagination: TablePaginationConfig
  reload: (pagination?: TablePaginationConfig) => void
}

export interface EnhanceTableProps<RecordType = any> extends TableProps<RecordType> {
  /** 扩展可编辑配置 */
  columns: Array<ColumnProps<RecordType>>
  /** 请求信息 */
  query?: {
    /** 请求地址 */
    url: string
    /** 请求参数 */
    params?: any
    /** 是否自动请求 */
    auto?: boolean
  }
  /** 表格顶行信息 */
  alertMsg?: React.ReactElement | null
  /** 请求之前干点儿啥，返回值会当作请求参数，返回 false 取消请求 */
  beforeLoad?: (arg0: {
    url: string
    params: { [key: string]: any }
    changArgs: [
      TablePaginationConfig,
      Record<string, React.Key[] | null>,
      SorterResult<RecordType> | SorterResult<RecordType>[],
      TableCurrentDataSource<RecordType>
    ]
  }) => { [key: string]: any } | false
  /** 请求之后干点儿啥 */
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  afterLoad?: <T = any>(arg0: ResponstResult<T>) => ResponstResult<T> | void
  /** 表格数据刷新之后干点儿啥 */
  onDataSourceChange?: <RecordType = any>(dataSource: Array<RecordType> | undefined) => void
}

const EditableContext = React.createContext<any>(null)

// 覆写 tr
const EditableRow = ({ index, ...props }: any) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

// 覆写 td
const EditableCell = (props: any) => {
  const { column = {}, children, record, rowIndex, ...ommited } = props
  // 只有 editable 才会有 column，把所有东西放 column 里面维护清晰
  const { editable, dataIndex, options, type, onCellChange, disabled, FormItem } = column
  const form = useContext(EditableContext)
  if (editable) {
    try {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] }) // 初始化数据同步到 Form 中
    } catch (error) {
      console.warn(error)
    }
  }

  const save = async (e: any) => {
    const value: any = form.getFieldsValue()[dataIndex]
    // 保留一份原始数据，做判断用
    if ((record as any)[`${dataIndex}_old`] === undefined) {
      ; (record as any)[`${dataIndex}_old`] = (record as any)[dataIndex]
    }
    // 数据同步到编辑行
    ; (record as any)[dataIndex] = value
    if (onCellChange instanceof Function) {
      try {
        onCellChange({
          value,
          form,
          dataIndex,
          record,
          rowIndex,
          keyCode: e?.keyCode,
          type: type ?? 'INPUT' // 默认 Input
        })
      } catch (error) {
        console.warn(error)
      }
    }
  }

  let childNode = children
  let _editable = editable

  if (editable instanceof Function) {
    try {
      _editable = editable(record[dataIndex], record, rowIndex)
    } catch (error) {
      _editable = false
      console.warn('editable 调用报错:\n', error)
    }
  }

  if (_editable) {
    let _options = options
    let _type = type ?? 'INPUT' // 默认 Input
    if (options instanceof Function) {
      try {
        _options = options(record[dataIndex], record, rowIndex)
      } catch (error) {
        _options = []
        console.warn('options 调用报错:\n', error)
      }
    }
    let _disabled = disabled
    if (disabled instanceof Function) {
      try {
        _disabled = disabled(record[dataIndex], record, rowIndex)
      } catch (error) {
        _disabled = false
        console.warn('disabled 调用报错:\n', error)
      }
    }
    if (!type) {
      if (Array.isArray(_options)) _type = 'SELECT' // 有 options，没 type 认为是 Select
    }
    childNode = (
      <>
        {_type === 'INPUT' ? (
          <Form.Item
            name={dataIndex}
            initialValue={record[dataIndex]}
            getValueFromEvent={arg0 => {
              if (FormItem && (FormItem as FormItemProps).getValueFromEvent instanceof Function) {
                // 扩展属性
                arg0.external = { form, value: arg0.target.value, record, dataIndex, rowIndex }
                return FormItem.getValueFromEvent(arg0)
              }
              return arg0.target.value
            }}
          >
            <Input
              disabled={_disabled}
              onPressEnter={save}
              onBlur={save}
              autoComplete='off'
              className={`input-${dataIndex}-row${rowIndex}`}
            />
          </Form.Item>
        ) : null}
        {_type === 'SELECT' ? (
          <Form.Item name={dataIndex} initialValue={record[dataIndex]}>
            <Select
              allowClear
              disabled={_disabled}
              onChange={save}
              className={`select-${dataIndex}-row${rowIndex}`}
            >
              {_options.map(({ label, value }: OptionsItem) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ) : null}
      </>
    )
  }

  return <td {...ommited}>{childNode}</td>
}

/**
 * 自定义表格
 * @param props 基于表格属性扩展了一增强
 */
function EnhanceTable<RecordType = any>(
  props: EnhanceTableProps<RecordType>,
  // ref: React.MutableRefObject<RefType<RecordType>>
  ref: any // 20-06-20
) {
  const {
    className,
    style,
    columns,
    pagination,
    dataSource: data,
    alertMsg,
    query,
    beforeLoad,
    afterLoad,
    onDataSourceChange,
    ...ommited
  } = props

  const ref_tableWrap = useRef<any>()
  const ref_auto = useRef<boolean | undefined>(query?.auto ?? true)
  const ref_isDidMount = useRef(false) // 是否是 componentDidMount
  const ref_page = useRef({ current: 1, pageSize: 10 })
  const ref_timer = useRef<any>()

  const [dataSource, setDataSource] = useState<Array<RecordType> | undefined>(data)
  const [dataTotal, setDataTotal] = useState<number>(0)
  const [_pagination, set_pagination] = useState<TablePaginationConfig | false | undefined>(
    pagination === false ? false : { ...ref_page.current, ...pagination }
  )
  const [loading, setLoading] = useState(false)
  const [changArgs, setChangArgs] = useState<
    [
      TablePaginationConfig,
      Record<string, React.Key[] | null>,
      SorterResult<RecordType> | SorterResult<RecordType>[],
      TableCurrentDataSource<RecordType>
    ]
  >([] as any)
  const [setInputEventContainer] = useUpDownForInput()

  const tableProps: TableProps<RecordType> = {
    size: 'small',
    columns: columns
      ?.filter(col => (col.show === undefined ? true : col.show))
      ?.map(col =>
        !col.editable
          ? {
            ellipsis: {
              showTitle: true
            },
            ...col
          }
          : {
            ...col,
            onCell: (record, rowIndex) => ({
              record,
              rowIndex,
              column: col
            })
          }
      ) as ColumnsType<RecordType>,
    // dataSource 扩展 className
    onRow: (record, index) => ({ record, index, className: (record as any).className }),
    components: {
      body: {
        row: EditableRow,
        cell: EditableCell
      }
    },
    pagination:
      _pagination === false
        ? false
        : {
          size: 'small',
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '30', '50', '100'],
          showTotal: (total: number) => `共计${total}条数据`,
          ..._pagination,
          total: dataTotal
        },
    onChange(pagination, filters, sorter, extra) {
      setChangArgs([pagination, filters, sorter, extra])
      set_pagination(pagination as TablePaginationConfig)
    },
    loading,
    dataSource,
    rowKey: (_, i) => String(i),
    locale: {
      emptyText: '暂无数据'
    },
    ...ommited
  }

  // 加载前干点啥
  const _beforeLoad = (url: string, params: any) => {
    let _params = params
    if (beforeLoad instanceof Function) {
      _params = beforeLoad({ url, params, changArgs })
    }
    if (_params) {
      setLoading(true)
    }
    return [_params] // 考虑到后面可能多返回值
  }
  // 加载后干点啥
  const _afterLoad = (res: ResponstResult) => {
    let _res = res
    setLoading(false)

    if (afterLoad instanceof Function) {
      try {
        // 交给调用处格式化数据
        _res = (afterLoad(res) as ResponstResult) ?? res
      } catch (error) {
        console.warn('调用处格式化数据 formatResult\n', error)
      }
    }
    return [_res] // 考虑到后面可能多返回值
  }

  const queryHandle = async (
    pagination: TablePaginationConfig = _pagination as TablePaginationConfig
  ) => {
    const { current, pageSize, total } = pagination
    const { url, params } = query ?? {}

    if (url) {
      const [params2] = _beforeLoad(url, params)
      // console.log(params2)
      if (params2 === false) {
        // console.log('主动取消请求', url)
        return
      }
      const res = await ypRequest(url, { page: current, size: pageSize, ...params2 })
      const [res2] = _afterLoad(res)
      const { success, result } = res2

      if (success) {
        const { isEnd, total = 0, list: l, data: d } = result
        const list: any = d ?? l ?? []
        if (Array.isArray(list)) {
          setDataSource(list)
          setDataTotal(+total)
        }
      }
    }
  }

  useImperativeHandle(ref, () => ({
    dataSource,
    pagination: _pagination as TablePaginationConfig,
    reload: queryHandle
  }), [dataSource, _pagination])

  useEffect(() => {
    if (ref_auto.current) set_pagination({ ..._pagination, current: ref_page.current.current })
  }, [query?.params])

  useEffect(() => {
    if (ref_isDidMount.current) {
      if (ref_timer.current) clearTimeout(ref_timer.current)
      ref_timer.current = setTimeout(() => {
        queryHandle()
      }, 200)
    }
  }, [_pagination])

  // 外部回填 dataSource
  useEffect(() => {
    if (ref_isDidMount.current) setDataSource(data)
  }, [data])

  // 外部回填 pagination
  // useEffect(() => {
  //   if (ref_isDidMount.current) set_pagination(pagination === false ? false : { ..._pagination, ...pagination })
  // }, [pagination])

  // dataSource 刷新事件
  useEffect(() => {
    if (onDataSourceChange instanceof Function) onDataSourceChange(dataSource)
  }, [dataSource])

  // 这个当 componentDidMount 用，放在最后面
  useEffect(() => {
    ref_isDidMount.current = true
    ref_auto.current = true // 第一次运行后，将请求开放
    setInputEventContainer(ref_tableWrap.current)
  }, [])

  return (
    <div className={[className, styles.tableWrap].join(' ')} style={style} ref={ref_tableWrap}>
      <Table {...(tableProps as any)} />
    </div>
  )
}

export default React.forwardRef(EnhanceTable)
