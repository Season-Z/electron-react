import { ReactNode } from 'react'
import { ColumnProps } from 'antd/lib/table/Column'
import { CommonTableProps } from '../CommonTable/interface'

export type FieldsType = 'SELECT' | 'INPUT' | 'RANGE_PICKER' | 'DATE_PICKER' | 'INPUT_NUMBER'
export type StructureType = 'useNormal' | 'useHefei'
export type HandleType = 'ADD' | 'EDIT' | 'DELETE' | 'SELECTED' | 'UPDATE'

export interface FieldsProps {
  fieldChange: (arg: any) => void
  editing?: boolean
  fieldValue: string | number | string[] | undefined | null
  dataList: DataListType[]
  fieldOptions: any
}

export interface RenderComponentProps {
  fieldType?: FieldsType
  fieldOptions?: any
  dataList?: DataListType[]
  value?: string | number | undefined | null | string[]
}

interface ChangeTableFirstProps {
  currentCell: any // 当前修改的单元格 {字段名:值}
  currentRow: any // 当前修改的单元格对应的行数据，对象的格式
  dataSource: any[] // 表格所有的数据
  type: HandleType // 当前操作的类型
}

export interface DataListType {
  value: string | number
  label: any
}

export interface EdtiableColumnsProps {
  title: string | ReactNode
  key: string | number
  dataIndex: string
  width?: string | number
  type?: FieldsType
  dataList?: DataListType[] | ((arg: any) => DataListType[])
  fieldOptions?: any
  editable?: boolean
  render?: any
}

export interface EditableCellProps extends EdtiableColumnsProps {
  children: React.ReactNode
  record: any
  rowIndex: number
  render: any
  handleDeleteRow: (arg: any) => void
  handleSaveRow: (arg0: any, arg1: any) => void
  hidedeletebtn: boolean
}

/**
 * 可编辑表格的一些事件回调
 */
interface EditableCommonProps {
  addRow?: (arg0: any, arg1: any) => void // 添加行之前的操作
  saveRow?: (arg0: any, arg1: any) => void // 保存行之前的操作
  deleteRow?: (arg0: any, arg1: any) => boolean | Promise<boolean | undefined> // 删除行之前的操作
  onChange?: (arg0: ChangeTableFirstProps, arg1: any) => void // 录入数据时的回调
  buttonTitle?: string | ReactNode // 新增按钮的文案
  hideBtn?: boolean // 是否隐藏新增按钮
  hideDeleteBtn?: boolean // 是否取消删除按钮
  canSelected?: boolean // 是否可以选择
  disableAddBtn?: boolean // 无法点击新增按钮
  onTableParamsChange?: (arg: any) => void
}

export interface EditTableRefProps {
  reflashTable: (arg: any) => void
  getTableData: () => void
}

/**
 * 分页可编辑表格组件参数定义
 */
export interface PageEditableTableProps extends CommonTableProps, EditableCommonProps {
  updateDataSource?: any[] | any // 要更新替换的表格数据
  dataSource?: any[] // 外部传入数据，与列表数据合并
}

export interface SimpleEditableTableProps extends EditableCommonProps {
  dataSource: any[] // 表格数据
  columns: ColumnProps<EdtiableColumnsProps>[] // 列表的表头项
  tableOptions?: any // antd的table组件原生配置项
  onChange?: (arg0: ChangeTableFirstProps, arg1: any) => void // 回调
}

// 可编辑表格的 interface
export interface EditableTableProps extends PageEditableTableProps {
  // dataSource?: any[] // 表格数据
}
