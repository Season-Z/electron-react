/* eslint-disable radix */

import { message } from 'antd'
import { history } from 'umi'

/**
 * 通用方法
 */

/**
 * 动态调整Field
 * "key":"SupplierCategory",
  "configMap":{
      "1":"采购供应商",
      "2":"农户供应商"
  }
  =>
  [
    { value: '1', label: '采购供应商' },
    { value: '2', label: '农户供应商' },
  ],
  * @param config 后端返回配置
  * @param fields 表单字段配置
*/
export const utilResetField = (config: any, fields: any) => {
  if (fields && config && config.length) {
    fields.forEach((f: any) => {
      const configObj = config.filter(
        (c: any) => c.key === f.name.replace(/^\S/, (s: any) => s.toUpperCase())
      )
      if (configObj && configObj.length) {
        const configArr = configObj[0]
        f.dataList = []
        Object.keys(configArr.configMap).forEach(o => {
          f.dataList.push({
            value: parseInt(o),
            label: configArr.configMap[parseInt(o)]
          })
        })
      }
    })
    return fields
  }
}

/**
 * 字典匹配
 * @param data 需要匹配的值，如： 1：是  2: 否
 * @param field 字段
 * @param dictionary 字典
 * @param type 处理类型 list: 列表 detail: 详情
 * @returns value 对应的枚举值
 */

export const dictionaryMatch = (data: any, field: string, dictionary: any, type: string) => {
  let value = type === 'list' ? '' : data
  const obj = dictionary.filter((e: any) => e.key === field.replace(/^\S/, s => s.toUpperCase()))
  if (obj && obj.length) {
    for (let key in obj[0].configMap) {
      if (!isNaN(data) && data.toString() == key.toString()) {
        value = typeof obj[0].configMap[parseInt(key)] === 'string' ? obj[0].configMap[key] : ''
      }
    }
  }
  return value
}

// 表单项切换时，给枚举映射的表单项赋值
export const handleChangeFields = (fieldEnums: any, callback: (arg0: {}) => void) => {
  const fieldEnumsKeys = Object.keys(fieldEnums)

  return (field: { [x: string]: string | number | undefined }) => {
    const nameArr = Object.keys(field)
    let params: any = {}

    nameArr.forEach((v: any) => {
      if (fieldEnumsKeys.includes(v)) {
        // 获取到枚举映射的表单项字段名
        const fieldName = fieldEnums[v]
        // 获取当前编辑的表单项的值
        const value = field[v]
        params[fieldName] = value
      }
    })
    console.log({ ...field, ...params })
    // 给枚举映射的表单项设置当前编辑的表单项的值
    callback({ ...field, ...params })
  }
}

let err_t: any = null
/**
 * Error to Login
 */
export function errorToLogin(msg: string) {
  message.warn(msg ?? '请重新登陆')
  console.warn(msg)
  if (err_t) {
    clearTimeout(err_t)
  }
  err_t = setTimeout(() => {
    err_t = null
    history.replace('/User/login')
  }, 400)
}

export function formatResponseName(res: any, format: any): any {
  let obj = { ...res }

  if (format instanceof Map) {
    for (let [left, value] of Object.entries(res)) {
      let right = left
      right = format.get(left)
      if (right) {
        obj[right] = value
      }
    }
  } else {
    for (let [left, value] of Object.entries(res)) {
      let right = left
      right = format[left]
      if (right) {
        obj[right] = value
      }
    }
  }

  return obj
}

// 转成整数
export function exchageToNum1(value: any) {
  if (value.indexOf('.') !== -1) {
    const arr = value.split('.')
    if (arr.length) {
      return arr[0]
    }
  }
  return value.replace(/\D/g, '')
}

// 转成保留三位小数
export function exchageToNum3(value: any) {
  if (isNaN(value)) {
    return // 解析出错，默认0
  }

  const arr = value.split('.')
  if (arr.length === 1) {
    return value
  } else {
    return arr[1].length > 3 ? Number(value).toFixed(3) : arr[0] + '.' + arr[1]
  }
}
