import { ReactNode } from 'react'
import { FormInstance, FormProps } from 'antd/lib/form/Form'

export type FormFieldsType =
  | 'SELECT'
  | 'INPUT'
  | 'RANGE_PICKER'
  | 'DATE_PICKER'
  | 'TEXTAREA'
  | 'INPUT_NUMBER'
  | 'RADIO'
  | 'CHECKBOX_GROUP'
  | 'RANGE_PICKER_SHORT'

export type ColumnsType = 1 | 2 | 3 | 4

export interface FieldOpsProps {
  [x: string]: any
  label: any
}

export interface FormRefProps extends FormInstance {}

export interface EleProps {
  name: string // 控件的字段名
  label?: string // 控件名
  initialValue?: any // 控件的初始值
  rules?: any[] // 控件的校验规则
  required?: boolean // 控件是否必填
  tooltip?: string // 控件是否需要tooltip提示
  widget?: ReactNode // 控件
  formItemProps?: any // formItem的属性
  formItemLayout?: any // 控件单独的样式，自定义
  isButton?: boolean // 控件是否为按钮  无视参数
  type?: FormFieldsType // 组件类型
  dataList?: {
    value: number | string | undefined
    label: string | undefined
  }[] // 下拉框的枚举值
  fieldOptions?: any // 组件的一些配置
  hide?: boolean // 隐藏该表单项
  reset?: boolean // 可否被重置
}

export interface FormBuilderProps {
  columns?: ColumnsType // 一行展示的表单项的数量
  elements: EleProps[]
  gutter?: number // 多个 columns 时，gutter 为行之间的间距
  colon?: boolean // 标签前是否显示冒号
  leftElement?: ReactNode | string // 表单操作按钮左侧的内容
  callbackHandler?: (arg0: string, arg1: any) => void // 点击查询获取所有表单项值的回调
  formOptions?: FormProps // 原生Form表单的配置信息
  notSearchForm?: boolean // 设置表单是否为查询表单，类型（查询表单|新增编辑等录入表单）
  defaultValues?: any // 外部默认值
  onChange?: (arg0: any, arg1: any) => void // 改变表单项时触发事件
  number?: number // 用于展开收起功能，表示收起时展示多少个表单项
  responsed?: boolean // 是否为响应式表单
  onReset?: (arg: any) => void // 表单重置的回调
  openAll?: boolean // 是否展示所有表单查询项
  [propsName: string]: any
}
