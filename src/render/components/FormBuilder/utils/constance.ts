import { oneColLayout, twoColLayout, threeColLayout, normalColLayout } from './layouts'

// 占据两个栅格的表单项类型
export const twoColsMap: any = {
  RANGE_PICKER: 'RANGE_PICKER'
  // TEXTAREA: 'RANGE_PICKER'
}

// 要去除前后空格的组件
export const trimWhitespaceFields = ['INPUT', 'INPUT_NUMBER', 'TEXT_AREA']
// 失去焦点才获取值的控件
export const getValueInBlur = ['INPUT', 'INPUT_NUMBER', 'TEXT_AREA']

export const currentLayoutType: any = {
  1: oneColLayout,
  2: twoColLayout,
  3: threeColLayout,
  4: normalColLayout,
  default: normalColLayout
}
