/**
 * render 进程用 aclas_sdk.node 有“巨抗”
 * c 代码中的线程停不下来！！！！
 */
import path from 'path'
import fs from 'fs'
import os from 'os'
import iconv from 'iconv-lite'
// import { sdk, code_dict } from './sdk'
import { ErrorCode, CallbackArgs } from './sdk.d'
import { dispatchBalanceWithDevice } from './with-device'
import { DeviceInfo, RecordInfo } from './with-device.d'
import { PluItem, DispatchParams, CallbackArgsExtend, UnitID_type } from './index.d'
import { ping, PING_CODE } from './ping'
import moment from 'moment'

let code_dict: ErrorCode

export {
  dispatchBalanceWithDevice,
  code_dict,
  // CallbackArgsExtend, // webpack 会给警告
  DeviceInfo, RecordInfo
}

/** 桌面路径 */
// function getDesktopPath(p: string = process.env.HOME as string) { // process.env.HOME 会被 webpack 编译掉
function getDesktopPath(p: string = os.homedir()) {
  if (process.platform === 'win32') {
    return path.join(p, 'Desktop')
  } else if (process.platform === 'darwin') { // mac os
    return p
  } else {
    return p
  }
}

/** 生成 txt 文件的目录 */
export function getGenTxtDir() {
  const GEN_TXT_DIR = 'ypshop'
  const dir = path.join(
    // getDesktopPath(),
    os.tmpdir(),
    GEN_TXT_DIR)
  isDirectory(dir, true)
  return dir
}

/** 生成 xxx.txt */
export function generatePlu(file_path: string, plu_arr: Array<PluItem>): string {
  let message = ''
  try {
    const data = `ID\tItemCode\tDepartmentID\tName1\tPrice\tUnitID\tBarcodeType1\tBarcodeType2\tProducedDate
${plu_arr.map(item => `${
      item.ID
      }\t${
      item.ItemCode
      }\t${
      item.DepartmentID
      }\t${
      item.Name1
      }\t${
      item.Price
      }\t${
      item.UnitID
      }\t${
      item.BarcodeType1
      }\t${
      item.BarcodeType2
      }\t${
      item.ProducedDate
      }`).join('\n')}`
    fs.writeFileSync(file_path, iconv.encode(data, 'GBK'))
  } catch (e) {
    message = e
  }
  return message
}
/** 必要的数据 */
generatePlu.NECESSARY = function () {
  return {
    DepartmentID: 24,
    UnitID: UnitID_type.kg,
    BarcodeType1: 7,
    BarcodeType2: 7,
    ProducedDate: moment().format('YYYY/M/DD HH:mm:ss'),
  }
}


/** 是否为文件夹，如果不在可以直接生成 */
function isDirectory(dirPath: string, makeDir = false) {
  let isDir = false
  try {
    const exist = fs.existsSync(dirPath)
    if (exist) {
      const state = fs.statSync(dirPath)
      isDir = state.isDirectory()
    }
  } catch (e) { }
  if (!makeDir) {
    return isDir
  } else {
    try {
      fs.mkdirSync(dirPath, { recursive: true }) // 返回值 undefined
      return true
    } catch (error) {
      return false
    }
  }
}


let _processing = false // 下发状态记录
let code0 = -1

function runTask(arg0: DispatchParams) {
  delete require.cache[require.resolve('./sdk')]
  const { code_dict: dict, sdk } = require('./sdk')
  code_dict = dict

  let {
    type,
    dll_path,
    file_path,
    host,
    data,
    callback,
  } = arg0

  // 控制重复调用
  if (_processing) return
  _processing = true

  if (!host) {
    console.warn('host 不能为空')
    return
  }
  if (!dll_path) {
    if (process.env.NODE_ENV === 'development') {
      // D:\ypsx\ypshop-desktop-app-electron\node_modules\electron\dist\resources\electron.asar\renderer
      dll_path = path.join(__dirname.split('node_modules')[0], 'src/render/utils/aclas-addons/addons/AclasSDK.dll')
    } else {
      dll_path = path.join(__dirname, 'addons/AclasSDK.dll')
    }
  }
  if (!file_path) {
    file_path = path.join(getGenTxtDir(), 'plu.txt')
  }

  // 在指定目录生成 plu.txt
  const error = generatePlu(file_path, data)
  if (error) {
    console.warn(error)
    return
  }

  console.info('---- start ----')
  code0 = -1
  sdk.runTask({
    type: type === 'plu' ? 0x0000 : 0x0011, // PLU、条码
    filename: file_path,
    dll_path,
    host,
    timeout: 24, // 24 秒超时
  }, function (json: CallbackArgs) {
    let error = ''
    code0++
    const { code, index, total } = json
    if (code > 2) {
      error = code_dict[code]
      // console.info(error)
    } else if (code === 0) {
      // console.info('sucessed!')
    } else if (code === 1) {
      // console.info(`${index}/${total}`)
    } else {
      // 很少的情况会到这里
      error = '未知错误'
      console.info('callback ->', json)
    }

    // const done = (code0 === json.total) || code > 2
    console.info(json, code0)
    // if (done) {
    //   console.info('finished', json)
    // }
    // callback({ ...json, done, error, host })

    callback({ ...json, done: code !== 1, error, host })

    if (code !== 1) _processing = false
  })
}

/** 下发电子称 */
export function dispatchBalance(arg0: DispatchParams) {
  ping(arg0.host).then(({ code, host }) => {
    if (PING_CODE.timeout === code) {
      // ping 超时
      const arg1: CallbackArgsExtend = { code: 501, index: -1, total: -1, done: true, error: code_dict['501'], host }
      arg0.callback(arg1)
    } else if (PING_CODE.not_found === code) {
      // ping 不通
      const arg1: CallbackArgsExtend = { code: 502, index: -1, total: -1, done: true, error: code_dict['502'], host }
      arg0.callback(arg1)
    } else if (code === PING_CODE.alive) {
      runTask(arg0)
    }
  })
}
