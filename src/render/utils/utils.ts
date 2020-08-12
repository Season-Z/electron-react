/**
 * url参数查询
 * @param {string} [url=location.search] - url地址
 * @param {string} [query] - 查询参数
 * @param {boolean} [decode=true] - 返回的查询值是否需要解码
 * @returns {object|string}
 */
export const getParams = ({
  url = window.location.search,
  query,
  decode = true
}: { url?: string; query?: string; decode?: boolean } = {}) => {
  const paramStr = url.split('?')[1]
  const paramArr = (paramStr && paramStr.split('&')) || []
  const params: any = {}
  paramArr.forEach((param, i) => {
    const paramData = param.split('=')
    params[paramData[0]] = decode ? decodeURIComponent(paramData[1]) : paramData[1]
  })
  return query ? params[query] : params
}

/**
 * url添加参数
 * @param {string} url - 需要添加参数的url
 * @param {object} params - 添加的参数，参数是'key:value'形式
 * @param {boolean} [encode=false] - 返回的url是否需要编码
 * @returns {string}
 */
export function addParams({
  url = '',
  params = {},
  encode = false
}: {
  url?: string
  params: object
  encode?: boolean
}) {
  if (!Object.keys(params).length) {
    return url
  }
  url = decodeURIComponent(url)
  const [hostStr, searchStr] = url.split('?')
  if (url.includes('?')) {
    const oldParams = {}
    searchStr.split('&').forEach(val => {
      const newVal = val.split('=')
      oldParams[newVal[0]] = newVal[1]
    })
    // 合并、去重参数
    params = { ...oldParams, ...params }
  }
  let [paramsStr, i] = ['', 1]
  for (const [key, val] of Object.entries(params)) {
    paramsStr += i > 1 ? `&${key}=${val}` : `${key}=${val}`
    i++
  }
  const baseUrl = `${hostStr}?${paramsStr}`
  return encode ? encodeURIComponent(baseUrl) : baseUrl
}

/**
 * 只能输入整数 [最小, 最大]
 * @param limit
 */
export const limitNumber = (limit: [number, number]) => (
  $num: number | string
): number | string => {
  if (!$num) return $num
  let num: number | string = String($num).replace(/[^\d+]/g, '')
  if (Array.isArray(limit)) {
    if (limit[0] && +num < limit[0]) num = limit[0]
    if (limit[1] && +num > limit[1]) num = limit[1]
  }
  return isNaN(+num) ? $num : num
}
/**
 * 小数点位数限制
 * @param param0
 */
export const limitFloat = ({ limit, len = 2 }: { limit: [number, number]; len?: number }) => (
  $num: number | string
): number | string => {
  if (!$num) return $num
  let num: number | string = String($num).replace(/^(\.|。)/, '') // 去开头的点
  num = num.replace(/(\.|。)/, '$#$') // 第一个碰到的 . 保存成 $#$
  num = num.replace(/[^\d+($#$)]/g, '') // 只保留数字
  num = num.replace('$#$', '.') // 还原第一个 .
  const tmp = num.split('.')
  if (tmp[1]) {
    num = `${tmp[0]}.${tmp[1].substr(0, len)}`
  }
  if (Array.isArray(limit)) {
    if (limit[0] && +num < limit[0]) num = limit[0]
    if (limit[1] && +num > limit[1]) num = limit[1]
  }
  return isNaN(+num) ? $num : num
}

/**
 * 商品价格转换
 */

export const goodsPriceExchange = (price: number | string) => {
  return isNaN(Number(price)) ? '' : (Number(price) * 100 / 10000).toFixed(2)
}
