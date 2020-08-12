// import cookies from 'js-cookie'
import ypStore from '@utils/ypStore'

let env = null
let baseURL = ''
let uploadUrlNew = ''
const API_ENV = ypStore.get('env') || process.env.YPSHOP_ENV || 'sit'
const apiHead = 'https://apigw'
if (API_ENV === 'prod' || API_ENV === 'production') {
  env = 'prod'
  baseURL = 'https://apigw.ypshengxian.com'
  uploadUrlNew = 'https://api-resource.ypshengxian.com/resource/upload'
} else {
  if (API_ENV === 'dev') {
    env = 'dev'
    baseURL = 'https://apigw-dev.ypshengxian.com'
    uploadUrlNew = 'http://172.16.6.60:8070/resource/upload'
  } else if (API_ENV === 'test') {
    env = 'test'
    baseURL = 'https://apigw-test.ypshengxian.com'
    uploadUrlNew = 'https://test-api-resource.ypshengxian.com/resource/upload'
  } else if (API_ENV === 'pre') {
    env = 'pre'
    baseURL = 'https://apigw-pre.ypshengxian.com'
    uploadUrlNew = 'https://pre-api-resource.ypshengxian.com/resource/upload'
  } else if (API_ENV === 'sit') {
    env = 'sit'
    baseURL = 'https://apigw-sit.ypshengxian.com'
    uploadUrlNew = 'https://sit-api-resource.ypshengxian.com/resource/upload'
  } else if (API_ENV === 'testdev') {
    env = 'test'
    baseURL = 'https://apigw-dev.ypshengxian.com'
    uploadUrlNew = 'https://test-api-resource.ypshengxian.com/resource/upload'
  }
}
export default {
  env,
  uploadUrlNew,
  imgUrl: 'https://h5.ypshengxian.com/treaty/static/images/defaultimg.png',
  appVersionName: '1.0.0',
  appVersion: '1.0.0',
  baseURL,
  baseUrl: apiHead + '.ypshengxian.com/',
  urlFetch: apiHead + '.ypshengxian.com/request',
  baseUrlCheck: 'https://release.ypshengxian.com',
  appId: 'ypsypush',
  appPlatform: 'web'
}
// export default config
