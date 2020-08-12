import ypRider from '@utils/ypRequest'

// @useless
export function getStorageMapping(params: any) {
  return ypRider('ylp.mst.SysEnumService.queryByKeyList', params)
}

/**
 * 采购中心枚举集合
 * @param params
 */
export function getMapping(params: any) {
  return ypRider('purchase.basis.mapping', params)
}
