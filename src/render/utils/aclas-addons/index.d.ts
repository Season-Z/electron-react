import { CallbackArgs } from './sdk'
// import ping from 'ping'

/** 重量单位，7(500g)，4(kg)，10(PCS/kg) */
export enum UnitID_type {
  '500g' = 7,
  kg = 4,
  PCS = 10,
}

/** 单品资料 */
export interface PluItem {
  /** 生鲜码：自增列 */
  ID: number | string
  /** 货号 */
  ItemCode: number | string
  /** 条码起始码，写 24 */
  DepartmentID: number | string
  /** 类别编号 */
  GroupID?: number | string
  /** 名称1 */
  Name1: string
  /** 名称2 */
  Name2?: string
  /** 名称3 */
  Name3?: string
  /** 单价 */
  Price: number | string
  /** 重量单位，7(500g)，4(kg)，10(PCS/kg) */
  UnitID: UnitID_type
  /** 条码类型1(没用)，和 BarcodeType2 一样，不然打码规则有问题 */
  BarcodeType1: number | string
  /** 条码类型2(有用)，一期写死7(13位重量码:20-06-16) */
  BarcodeType2: number | string
  /** 生产日期 */
  ProducedDate: string
}

export interface CallbackArgsExtend extends CallbackArgs {
  /** 是否完已停止任务，完成 or 报错 */
  done: boolean
  /** 是否有报错 */
  error: string
  /** host */
  host: string
}

export interface DispatchParams {
  /** 电子称 IP 地址 */
  host: string
  /** plu码、条码 */
  type: 'plu' | 'code'
  /** AclasSDK.dll 绝对路径 */
  dll_path?: string
  /** 下发文件绝对路径 */
  file_path?: string
  /** 下发数据 */
  data: Array<PluItem>,
  callback: (arg0: CallbackArgsExtend) => void
}
