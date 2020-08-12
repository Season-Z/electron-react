import axios from 'axios'
import { message, notification } from 'antd'
import { Params, AnyKey, OptionConfig, ResponstResult, Result } from '../types'
import { guid } from './nonce'
import ypEvent from '../utils/event'
import { isHefeiGateway, hefei2hangzhouReq, hefei2hangzhouRes } from './utils'
import ypStore from '@utils/ypStore'
import { SHOP_CURRENT } from '@config/constant'

function getBaseUrl(apiName?: string): string {
  const env = ypStore.get('env') || 'prod' // electron的本地store需要electron-store,其他方式不适用
  if (apiName && apiName.includes('/mock/api')) {
    return window.location.origin + apiName
  }
  // console.log('API->env', ypStore.get('env'))
  let baseURL = 'https://apigw.ypshengxian.com/request'
  if (env && env !== 'prod') {
    baseURL = `https://apigw-${env}.ypshengxian.com/request`
  }
  return baseURL
}
let axiosObejct = axios.create({
  timeout: 6000,
  responseType: 'json',
  withCredentials: false,
  validateStatus: function(status) {
    return status >= 100 && status < 600
  }
})
axiosObejct.interceptors.request.use(config => {
  config.headers = Object.assign(config.headers ? config.headers : {}, {
    'app-id': 'ypshop',
    'app-platform': 'web'
  })
  return config
})
axiosObejct.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error) // reject这个错误信息 让下流catch到 /
  }
)
function createParams(params: OptionConfig): OptionConfig {
  let requestParams = {
    api: params.apiUrl,
    version: params.version || '1.0',
    timestamp: new Date().getTime(),
    token: ypStore.get('token') || '',
    nonce: guid(),
    params: { ...params.data, shopId: (ypStore.get(SHOP_CURRENT) || {}).id },
    ...params.restData
  }
  return requestParams
}
async function omsRequest<T = Result>(
  apiName: Params | string,
  data: object = {},
  restData: object = {}
): Promise<ResponstResult<T>> {
  let apiUrl = ''
  const isMockModule = apiName && apiName.includes('/mock/api')
  if (typeof apiName === 'string') {
    apiUrl = apiName
  } else {
    apiUrl = apiName.gateway as string
  }
  if (isHefeiGateway(apiName)) {
    data = hefei2hangzhouReq(data)
  }
  const objParams: OptionConfig = { apiUrl, data: { ...data }, restData }
  const env = ypStore.get('env') || process.env.YPSHOP_ENV // electron的本地store需要electron-store,其他方式不适用
  const params = createParams(objParams) // 封装接口请求参数
  let result: AnyKey = {}
  try {
    // reject
    let res: AnyKey = await new Promise(resolve => {
      axiosObejct({
        // method: 'POST',
        method: isMockModule ? 'GET' : 'POST',
        url: getBaseUrl(apiName as string) + `?api=${apiName}`,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
          ...params
        }
      })
        .then(res => {
          let { data } = res
          if (isHefeiGateway(data)) {
            data = hefei2hangzhouRes(data)
          }

          if (data.success) {
            // 网关
            // console.log('data.result.success', data.result)
            if (data.result.success || data.result.isSuccess) {
              // 业务
              if (data.result.hasOwnProperty('result')) {
                resolve({
                  success: true,
                  result: data.result.result,
                  code: 200,
                  message: '请求成功'
                })
              } else {
                resolve({
                  success: true,
                  result: { ...data.result },
                  code: 200,
                  message: '请求成功'
                })
              }
            } else {
              resolve({
                success: false,
                result: {},
                code: data.result?.code,
                message: data.result?.message || data.result?.error?.message
              })
            }
          } else {
            resolve({
              success: false,
              code: data.error.code || data.code,
              message: data.error.message || data.message,
              result: {}
            })
          }
        })
        .catch(error => {
          console.log('error', error)
          let message = '系统异常'
          let code = -1000
          if (error.message.includes('timeout')) {
            message = '接口请求超时'
            code = -9999
          }
          result = { success: false, code, message, result: {} }
          resolve(result)
        })
    })
    result = res
  } catch (error) {
    result = { success: false, result: {}, code: -1001, message: '系统异常' }
  }
  if (!result.success) {
    if (result.code === -32001 || result.code === -32002 || result.code === -32003) {
      ypEvent.emit('auth_error', '登录失效')
    }
    // message.error(result.message || '')
    notification.error({
      message: '错误',
      description: result.message
    })
  }
  return result
}

export default omsRequest
