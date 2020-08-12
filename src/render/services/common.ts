import ypRider from '@utils/ypRequest'

export function getOrderIdByBizType(params: any) {
  return ypRider('purchase.order.getOrderIdByBizType', params)
}

export function fuzzyQueryBrandByName(params: any) {
  return ypRider('pms.brandManageService.fuzzyQueryBrandByName', params)
}
