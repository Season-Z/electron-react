import { ColumnProps } from 'antd/lib/table'

type StructureType = 'useNormal' | 'useHefei'

interface ResponseData {
  success?: boolean
  list: Array<any>
  page?: number
  size?: number
  total?: number
  isEnd?: boolean
}

export interface TableRefProps {
  reflashTable: (arg: any) => void
}

export interface ScrollTableProps {
  columns: ColumnProps<any>[] // 列表的表头项
  queryDataUrl: string // 请求的url
  rowSelectCallback?: (arg0: any[], arg1: any[]) => void | undefined // 列表选择的回调
  searchParams?: any // 表格搜索的参数
  tableOptions?: any // antd的table组件原生配置项
  reqStructure?: StructureType // 请求的数据结构类型
  returnData?: (arg0: any[], arg1: { total: number; current: number; pageSize: number }) => void // 每次table数据更新都会返回当前table的数据
  cancelRequest?: boolean // 页面加载时，是否发送请求获取列表数据
  formatResult?: (arg: any) => ResponseData // 格式化返回数据
  dataSource?: any[] // 外部传入的数据，替换当前页数据，主要用于查询
  changeTable?: (...arg: any) => void
  pageSize?: number // 页
}
