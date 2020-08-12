// 加法函数
export const Add = (arg1: number | string, arg2: number | string) => {
  let r1
  let r2
  let m
  let c
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }

  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))

  if (c > 0) {
    let cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

// 减法函数
export const Subtract = (arg1: number | string, arg2: number | string) => {
  let r1 = 0
  let r2 = 0
  let m

  try {
    r1 = String(arg1).split('.')[1].length
  } catch (e) {}

  try {
    r2 = String(arg2).split('.')[1].length
  } catch (e) {}

  m = Math.pow(10, Math.max(r1, r2))
  arg1 = Number(arg1) * m
  arg2 = Number(arg2) * m

  return (arg1 - arg2) / m
}

// 乘法函数
export const Multiply = (arg1: any, arg2: number) => {
  let m = 0
  let s1 = String(arg1)
  let s2 = String(arg2)

  try {
    m += s1.split('.')[1].length
  } catch (e) {}

  try {
    m += s2.split('.')[1].length
  } catch (e) {}

  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

// 除法函数
export const Divide = (num1: any, num2: number) => {
  let baseNum1 = 0
  let baseNum2 = 0
  let baseNum3
  let baseNum4
  try {
    baseNum1 = num1.toString().split('.')[1].length
  } catch (e) {
    baseNum1 = 0
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length
  } catch (e) {
    baseNum2 = 0
  }
  baseNum3 = Number(String(num1).replace('.', ''))
  baseNum4 = Number(String(num2).replace('.', ''))
  return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1)
}

/**
 * 判断小数点后几位
 * @param {判断的数值} number
 */
export const decimalFixed = (number: number) => {
  if (!number) return
  let num = Number(number)
  let str = String(number)
  if (num === 0) return 0
  if (str.indexOf('.') === -1) return 0
  return str.split('.')[1].length
}
/**
 * 限制小数点后两位输入
 * @param {*} value
 */
export const limitDecimals = (value: any, len: number) => {
  const reg = /^(\-)*(\d+)\.(\d\d).*$/
  if (typeof value === 'string') {
    if (String(value).length > len) {
      return value.replace(reg, '$1$2.$3').slice(0, len)
    } else {
      return !isNaN(Number(value)) ? value.slice(0, len).replace(reg, '$1$2.$3') : ''
    }
  } else if (typeof value === 'number') {
    if (String(value).length > len) {
      return Number(
        String(value)
          .replace(reg, '$1$2.$3')
          .slice(0, len)
      )
    } else {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
    }
  } else {
    return ''
  }
}

/**
 * 限制小数2位 大小
 * @param value
 * @param len
 */
export const limitDecimalsNum = (value: any, num: any) => {
  const reg = /^(\-)*(\d+)\.(\d\d).*$/
  if (typeof value === 'string') {
    if (!isNaN(Number(value))) {
      return Number(value) > num ? num : value.replace(reg, '$1$2.$3')
    } else {
      return !isNaN(parseFloat(value)) ? String(parseFloat(value)).replace(reg, '$1$2.$3') : ''
    }
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  } else {
    return ''
  }
}
/**
 * 限制小数点后三位输入
 * @param {*} value
 */
export const limitDecimalsThree = (value: any, num: number) => {
  const reg = /^(\-)*(\d+)\.(\d\d\d).*$/
  if (typeof value === 'string') {
    return Number(value) > num ? String(num) : value.replace(reg, '$1$2.$3')
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  } else {
    return ''
  }
}
/**
 * 限制正数 长度
 * @param value
 * @param len
 */
export const limitDecimalsLength = (value: string | number, len: number) => {
  const reg = /^(\-)*(\d+)\.(\d\d).*$/
  if (typeof value === 'string') {
    if (!isNaN(Number(value))) {
      return String(value).length > len
        ? String(parseFloat(value))
            .slice(0, len)
            .replace(reg, '$1$2.$3')
        : value.replace(reg, '$1$2.$3')
    } else {
      return !isNaN(parseFloat(value)) ? String(parseFloat(value)).replace(reg, '$1$2.$3') : ''
    }
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  } else {
    return ''
  }
}
/**
 * 限制正整数 长度:
 * @param {*} value
 */
export const limitLength = (value: string | number, len: number) => {
  const reg = /[^\-?\d]/g
  if (typeof value === 'string') {
    if (!isNaN(Number(value))) {
      return String(value).length > len
        ? String(parseFloat(value))
            .slice(0, len)
            .replace(reg, '')
        : value.replace(reg, '')
    } else {
      return !isNaN(parseFloat(value)) ? String(parseFloat(value)).replace(reg, '') : ''
    }
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '') : ''
  } else {
    return ''
  }
}

/**
 * 限制整数
 * @param {*} value
 */
export const limitNum = (value: string | number) => {
  const reg = /[^\-?\d]/g
  if (typeof value === 'string') {
    if (!isNaN(Number(value))) {
      return value.replace(reg, '')
    } else {
      return !isNaN(parseFloat(value)) ? String(parseFloat(value)).replace(reg, '') : ''
    }
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '') : ''
  } else {
    return ''
  }
}
