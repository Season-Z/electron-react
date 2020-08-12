import $fetch from '@utils/ypRequest'
import { message } from 'antd'

export const DEFAULT_PARAM = {
  /** 仓库ID */
  placeId: 1 // 2:YPSHOP，1:测试仓库
}

/**
 * 获取货主列表
 */
export async function getShipper(params: any = {}) {
  if (!params.placeId) {
    return ['入参木有placeId', []]
  }
  const { success, result, message: msg } = await $fetch(
    'ylp.mst.CompanyPlaceService.query',
    params
  )
  // console.log(err, data)
  if (!success) {
    console.warn(result)
    return [msg, result]
  } else {
    const arr = result.data?.map((item: any) => ({
      value: item.companyId,
      label: item.companyName,
      $origin: item
    }))
    // console.log(data, arr)
    return [null, arr ?? []]
  }
}

/**
 * 获取储位
 */
export async function getLocation(params: any = {}) {
  if (!params.placeId) {
    return ['入参木有placeId', []]
  }
  const { success, result, message: msg } = await $fetch(
    'ylp.mst.LocationService.queryLocations',
    params
  )
  if (!success) {
    console.warn(result)
    return [msg, result]
  }
  const arr = result.data?.map((item: any) => ({
    value: item.id,
    label: item.locationCode,
    $origin: item
  }))
  return [null, arr ?? []]
}

/**
 * 供应商
 */
export function querySuppliersFuzzyByCode(params: any) {
  return $fetch('ylp.mst.SupplierService.querySuppliersFuzzyByCode', params)
}

/**
 * 获取地点-来源地点
 */
export function queryPlaces(params: any) {
  return $fetch('ylp.mst.PlaceService.queryPlaces', params)
}

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
  const { success, result } = await $fetch<{
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

// 获取供应商
export function querySupplierBaseInfoPage(params: any) {
  return $fetch('supplier.basicdata.querySupplierBaseInfoPage', params)
}
