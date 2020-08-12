import { ipcRenderer } from 'electron'
import path from 'path'
import fs from 'fs'
import os from 'os'
import iconv from 'iconv-lite'
import { sdk, code_dict, CallbackArgs } from './sdk'
import { dispatchBalanceWithDevice } from './with-device'
import { DeviceInfo, RecordInfo } from './with-device.d'
import { PluItem, DispatchParams, CallbackArgsExtend, UnitID_type } from './index.d'
import { ping, PING_CODE } from './ping'
import moment from 'moment'

export {
  dispatchBalanceWithDevice,
  code_dict,
  // CallbackArgsExtend, // webpack 会给警告
  DeviceInfo, RecordInfo
}

export default sdk

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

declare global {
  interface Window {
    _already_on_dispatchDZC: boolean
  }
}

let _processing = false // 下发状态记录
let _arg0: DispatchParams
let _time: any // 节流
if (!window._already_on_dispatchDZC) {
  ipcRenderer.on('dispatch-dzc', (event, json: CallbackArgs) => {
    // console.log(json)
    if (_arg0) {
      const { code } = json
      _arg0.callback({ ...json, done: code !== 1, error: code > 2 ? code_dict[code] : '', host: _arg0.host })
      if (code !== 1) {
        _processing = false
        _arg0 = undefined as any
      }
    }
  })
  window._already_on_dispatchDZC = true
}

function runTask(arg0: DispatchParams) {
  let {
    type,
    dll_path,
    file_path,
    host,
    data,
    callback,
  } = arg0

  _arg0 = arg0

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

  console.log('---- start ----')

  // 放到 main 进程中去执行
  ipcRenderer.send('dispatch-dzc', { type, host, file_path, dll_path })
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
