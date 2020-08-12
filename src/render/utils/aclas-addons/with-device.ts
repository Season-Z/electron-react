import { message } from 'antd'
import ypRequest from '@utils/ypRequest'
import ypStore from '@utils/ypStore'
import { SHOP_CURRENT, ACLAS_TEST_HOST } from '@config/constant'
import { dispatchBalance } from './index'
import { PluItem, CallbackArgsExtend } from './index.d'
import { DeviceInfo, RecordInfo } from './with-device.d'

// 菜单配置(如果需要)
// ...(isDev
//   ? [
//       {
//         title: '测试下发',
//         path: '/TestDispatch',F
//         icon: <BarcodeOutlined />
//       }
//     ]
//   : []),

/**
 * 上报电子称最后在线时间
 */
export function updateDeviceLastOnlineTime(records: Array<RecordInfo>) {
  if (ypStore.get(ACLAS_TEST_HOST)) {
    return // 测试 ip
  }

  const succs = records.filter(item => !item.error)
  if (succs.length) {
    const url2 = 'merchant.device.batchUpdateDeviceLastOnlineTime'
    const params2 = {
      ids: succs.map(record => record.device.id),
      lastOnlineTime: Date.now(), // 到毫秒
    }
    ypRequest(url2, params2).then(res => {
      // console.log('上报电子称最后在线时间', res)
    })
  }
}

/**
 * 获取设备列表
 * https://wiki.ypsx-internal.com/pages/viewpage.action?pageId=30312954#15
 * 
 */
export async function getDeviceList(shopId: number = (ypStore.get(SHOP_CURRENT) || {}).id): Promise<Array<DeviceInfo>> {
  let res: Array<DeviceInfo> = []
  const url = 'ypsx.merchant.queryDeviceList'
  const params = {
    deviceType: 2, // 2 代表电子称
    status: 1, // 1 代表有效设备
    relationId: shopId, // 门店 id
    size: 50, // 20-06-15 一期写死
  }
  const { success, result } = await ypRequest<{ list: Array<DeviceInfo>, page: number, size: number, total: number }>(url, params)
  if (success) {
    res = result.list
  }
  return res
}

export interface DispatchWithDeviceArg2 {
  callback?: (arg0: CallbackArgsExtend) => void
  onloadDevice?: (deviceList: Array<DeviceInfo>) => void
  host?: string
}
let _processing = false
let _record: Array<RecordInfo> = []
/**
 * 先获取设备列表，下发电子称
 */
export function dispatchBalanceWithDevice(
  data: Array<PluItem>,
  arg2: DispatchWithDeviceArg2 = {} as any
): Promise<Array<RecordInfo>> {
  return new Promise(async resolve => {
    if (_processing) {
      return
    }
    _processing = true
    _record = []

    let list = await getDeviceList()
    if (!list.length) {
      message.error('获取设备列表失败')
      _processing = false
      return
    }
    console.log('设备列表', list)

    if (arg2.onloadDevice instanceof Function) {
      arg2.onloadDevice(JSON.parse(JSON.stringify(list)))
    }

    const arr: Array<DeviceInfo> = JSON.parse(JSON.stringify(list))
    const exec_down = () => {
      const item = arr.shift()
      if (item) {
        if (arg2.callback instanceof Function) {
          arg2.callback({ code: -1 as any, total: -1, index: -1, host: item.ip, done: false, error: '连接中...' })
        }
        dispatchBalance({
          type: 'plu',
          // ?? 和 || 还是有些区别的，?? 只识别 null 和 undefined；|| 还包括 ''，0，false
          // host: (/**走测试 IP*/arg2.host) ?? item.ip,
          host: (/**走测试 IP*/arg2.host) || item.ip,
          data,
          callback(json) {
            const { code, index, total, done, error, host } = json
            if (done) {
              _record.push({
                host,
                error,
                error_code: code,
                device: item,
              })
              setTimeout(exec_down, 900)
            }
            if (arg2.callback instanceof Function) {
              arg2.callback(json)
            }
          }
        })
      } else {
        _processing = false
        updateDeviceLastOnlineTime(_record) // 上报电子称最后在线时间
        resolve(_record)
      }
    }
    exec_down()
  })
}
