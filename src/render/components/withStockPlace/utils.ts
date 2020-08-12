import ypRequest from '@utils/ypRequest'

export interface IPlace {
  /** 即 placeId */
  id: string // "61"
  placeCode: string // "A01998"
  placeName: string // "去ERP测试门店2"
  placeType: number // 2
  businessModel: number // 1
  volume: string // ""
  area: string // ""
  address: string // "蓝光"
  contact: string // ""
  phone: string // ""
  locException: string // "0"
  locFrozen: string // "0"
  locReceipt: string // "0"
  locCross: string // "0"
  locDock: string // "0"
  locBack: string // "0"
  locProcess: string // "0"
  autoGenLpnCode: number // 1
  collectNewSku: number // 1
  checkAllocLocation: number // 1
  defaultDate: number // 2
  qgpAlarm: number // 1
  autoBackToLoc: number // 1
  deliveryStatMaterial: number // 1
  stockTakeAutoPost: number // 1
  placeAgeAlarm: number // 1
  enableNegativeInventory: number // 1
  ext: string // string // "{"merchantId":2132335023}"
  remark: string // ""
  createTime: string // "2020-06-09 15:52:18"
  creator: string // "system"
  modifyTime: string // "2020-06-10 13:32:20"
  modifier: string // "system"
  deleted: string // "0"
  outPlaceId: string // "2132335023"
}

/**
 * 根据 shop.id 获取仓店 placeId
 * 接口：https://wiki.ypsx-internal.com/pages/viewpage.action?pageId=33285077
 *     4. 查询仓库 ylp.mst.PlaceService.queryPlaceOne
 *
 * 名词解释：siteId == shopId == outPlaceId
 * 入参：outPlaceId 必传，其他可选
 */
export async function getPlaceIdByShopId({
  id,
  placeCode,
  placeName,
  outPlaceId
}: {
  id?: number
  placeCode?: string
  placeName?: string
  outPlaceId: number
}): Promise<IPlace | null> {
  let place: IPlace | null = null
  if (!outPlaceId) {
    console.warn('获取 placeId 入参错误 outPlaceId 必传')
    return place
  }
  const { success, result } = await ypRequest<{
    success: boolean
    data: IPlace
  }>('ylp.mst.PlaceService.queryPlaceOne', {
    id,
    placeCode,
    placeName,
    outPlaceId
  })
  if (success && result.success) {
    place = result.data
  }
  return place
}
