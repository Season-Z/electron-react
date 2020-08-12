
/** 设备信息 */
export interface DeviceInfo {
  id: number // 设备ID
  name: string // 设备名称
  deviceType: number // DeviceType 设备类型
  code: string // 设备编码
  macAddress: string // Mac 地址
  brand: string // 品牌
  model: string // 设备型号
  snNu: string // 设备sn号码
  ip: string // ip
  port: number // port
  ruleType: number // 条形码打称规则
  relationId: string // 关联ID
  relationName: string // 关联名称
  status: number // 设备状态
  metadata: string // metadata配置信息
  lastOnlineTime: number // Timestamp 最后在线时间
  approveTime: number // Timestamp 审核提交时间
  approveStatus: number // 审核状态  1 通过 2 拒绝 0 未处理 - 1 无需处理    
}

/** 下发信息记录 */
export interface RecordInfo {
  host: string
  error: string
  error_code: number
  device: DeviceInfo
}
