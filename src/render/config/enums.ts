export const purchaseMapEnums: any = new Map([
  [1, '需求申请单类型'],
  [2, '需求申请单状态'],
  [3, '当前用户权限的地点(到家权限门店)'],
  [4, '仅一级品类'],
  [5, '仅二级品类'],
  [6, '需求汇总单状态'],
  [7, '物流模式'],
  [8, '需求申请单集单标记'],
  [9, '采购单状态'],
  [10, '采购单类型'],
  [11, '采购单退货好坏货标记'],
  [12, '退货原因'],
  [13, '经营方式'],
  [14, '采购分配单需求类型'],
  [15, '采购分配单状态'],
  [16, '采购分配单订单类型'],
  [17, '集单方式'],
  [18, '当前用户权限的商家'],
  [19, '当前用户权限的供货DC'],
  [20, '集单失败类型'],
  [21, '调拨单类型'],
  [22, '加价规则的加价类型'],
  [23, '加价规则的基数类型'],
  [24, '补救单状态'],
  [25, '补救单类型'],
  [26, '批发销售单状态'],
  [27, '批发销售的客户分类'],
  [28, '批发销售的结算账期'],
  [29, '批发客户联系人类型'],
  [30, '批发销售单订单来源'],
  [31, '批发销售单送货方式'],
  [32, '批发销售单订单类型'],
  [33, '批发销售单支付方式'],
  [34, '退货集单的退货方式'],
  [35, '调拨单状态'],
  [36, '调拨分配单需求类型'],
  [37, '租户'],
  [38, '预约单的预约类型'],
  [39, '预约单状态'],
  [40, '当前用户权限的且在指定商家下的地点'],
  [41, '品类一级二级合集'],
  [42, '批量销售客户状态'],
  [43, '采购单是否直通'],
  [44, '需求申请单来源'],
  [46, '当前商家下的所有类目'],
  [53, '当前用户权限下的生鲜门店']
])

export const purchaseBizType = new Map([
  [1, '采购预处理'],
  [2, '调拨预处理'],
  [3, '采购订单'],
  [4, '调拨订单'],
  [5, '采购预约单'],
  [6, '补救单']
])

const storageEnums = [
  {
    enum_code: 'placeType',
    enum_desc: '仓库类型'
  },
  {
    enum_code: 'businessModel',
    enum_desc: '仓库类型'
  },
  {
    enum_code: 'companyType',
    enum_desc: '货主类型'
  },
  {
    enum_code: 'zoneType',
    enum_desc: '库区类型'
  },
  {
    enum_code: 'storeCondition',
    enum_desc: '存储条件'
  },
  {
    enum_code: 'locationType',
    enum_desc: '储位类型'
  },
  {
    enum_code: 'locationClass',
    enum_desc: '储位类别'
  },
  {
    enum_code: 'dockType',
    enum_desc: '月台类型'
  },
  {
    enum_code: 'printNode',
    enum_desc: '打印节点'
  },
  {
    enum_code: 'ibdReceiptType',
    enum_desc: '收货单据类型'
  },
  {
    enum_code: 'ibdReceiptWay',
    enum_desc: '收货方式'
  },
  {
    enum_code: 'ibdLocationType',
    enum_desc: '收货储位类型'
  },
  {
    enum_code: 'warehouseIbdReceiptType',
    enum_desc: '仓库收货单据类型'
  },
  {
    enum_code: 'shopIbdReceiptType',
    enum_desc: '门店收货单据类型'
  },
  {
    enum_code: 'reportLoss',
    enum_desc: '报损原因'
  },
  {
    enum_code: 'adjustType',
    enum_desc: '调整单类型'
  },
  {
    enum_code: 'adjustStatus',
    enum_desc: '调整单状态'
  },
  {
    enum_code: 'receiveType',
    enum_desc: '领用类型'
  },
  {
    enum_code: 'sourceType',
    enum_desc: '单据类型'
  },
  {
    enum_code: 'outOrderStatus',
    enum_desc: '出库单状态'
  },
  {
    enum_code: 'outWarehouseOrderType',
    enum_desc: '仓库出库单据类型'
  },
  {
    enum_code: 'outShopOrderType',
    enum_desc: '门店出库单据类型'
  },
  {
    enum_code: 'transformFinishedLocationType',
    enum_desc: '加工成品库存储位类型'
  },
  {
    enum_code: 'bomProcessMode',
    enum_desc: '加工模式'
  },
  {
    enum_code: 'bomProcessType',
    enum_desc: '加工类型'
  },
  {
    enum_code: 'transformSupportIbdReceiptType',
    enum_desc: '加工支持的入库单据类型'
  },
  {
    enum_code: 'transformMaterialLocationType',
    enum_desc: '加工原料库存储位类型'
  },
  {
    enum_code: 'receiptOrderStatus',
    enum_desc: '收货单的状态'
  },
  {
    enum_code: 'outOrderStatus',
    enum_desc: '出库单状态'
  },
  {
    enum_code: 'outShopOrderType',
    enum_desc: '门店出库单据类型'
  }
]

export default storageEnums

// 采购 - 下载模板类型
export enum enumPurchaseDownloadType {
  'NULL',
  '采购预处理导入模板',
  '调拨预处理（仓店配送&店仓返配）',
  '调拨预处理（仓间&店间调拨）',
  '批发销售单导入模板',
  '采购单商品导入模板',
  '采购分配单导入模板',
  '调拨分配单导入模板',
  '需求申请补货单导入模板',
  '需求申请退货单导入模板',
  '商品去损率导入模板',
  '加价规则导入模板'
}

// 采购 - 补退货类型
export enum replenishType {
  'NULL',
  '补货申请',
  '退货申请'
}

// 采购 -
export enum replenishStatus {
  'NULL',
  '草稿',
  '待审核',
  '生效',
  '作废'
}

/** 单据类型 */
export enum enumBillTYPE {
  采购订货 = 1,
  采购退货 = 2,
  仓间调拨 = 3,
  店间调拨 = 4,
  仓店配送 = 5,
  补货集单 = 6,
  退货集单 = 7
}

// 采购 枚举 字段名对应的映射
// https://wiki.ypsx-internal.com/pages/viewpage.action?pageId=31411559
export const purchaseConfigObj: any = {
  billState: 9,
  categoryCode: 4,
  placeCode: 3,
  orderType: 10,
  isStraight: 43,
  categoryCodeAll: 46,
  firstCategoryId: 4, // 一级类目
  secondCategoryId: 5, // 一级类目
  placeId: 3, // 地点
  merchantId: 40, // 商家/机构
  logisticMode: 7, // 物流模式
  transferType: 21, // 调拨单类型
  baseType: 23, // 基数类型
  addPriceType: 22, // 加价类型
  deliveryDc: 19, // 当前用户权限的供货DC
  poolingType: 17 // 集单方式
}

export const purchaseEnumConfig: any = {
  billState: 9,
  categoryCode: 4,
  placeId: 3, // 到家权限门店
  placeCode: 3,
  authPlaceId: 53, // 当前用户权限下的生鲜门店
  orderType: 10,
  isStraight: 43,
  categoryCodeAll: 46,
  firstCategoryId: 4, // 一级类目
  secondCategoryId: 5, // 一级类目
  merchantId: 40, // 商家/机构
  logisticMode: 7, // 物流模式
  transferType: 21, // 调拨单类型
  baseType: 23, // 基数类型
  addPriceType: 22, // 加价类型
  deliveryDc: 19, // 当前用户权限的供货DC
  poolingType: 17, // 集单方式
  requireSource: 44,
  status: 2,
  flag: 8
}
