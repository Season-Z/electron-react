/**
 * 采购通用
 */
import ypRider from '@utils/ypRequest'

// 通用下载
export function downloadGoodsTemplate(params: any) {
  return ypRider('purchase.downlaod.getTemplate', params)
}

// 根据编码查询条码
export function queryBarcodeByProductId(params: any) {
  return ypRider('purchase.product.queryBarcodeByProductId', params)
}

// 根据商家+地点+条码查询商品信息(地点维度)
export function queryInsertPlaceProduct(params: any) {
  return ypRider('purchase.product.queryInsertPlaceProduct', params)
}

// 获取采购单的参考采购价
export function queryPurchaseReferencePrice(params: any) {
  return ypRider('purchase.purchase.queryPurchaseReferencePrice', params)
}

// 获取调拨单的参考配送价
export function queryTransferReferencePrice(params: any) {
  return ypRider('purchase.transfer.queryTransferReferencePrice', params)
}

// 获取集单里商品的参考采购价、配送价
export function queryDemandPoolingReferencePrice(params: any) {
  return ypRider('purchase.demandPooling.queryDemandPoolingReferencePrice', params)
}

// 获取批发销售参考价
export function queryWholesaleReferencePrice(params: any) {
  return ypRider('purchase.product.queryWholesaleReferencePrice', params)
}

// 获取供应商
export function querySupplierBaseInfoPage(params: any) {
  return ypRider('supplier.basicdata.querySupplierBaseInfoPage', params)
}

// 能否改价
export function allowChangePrice(params: any) {
  return ypRider('purchase.product.allowChangePrice', params)
}

// 商品扩展信息
export function queryProductExtInfo(params: any) {
  return ypRider('purchase.product.queryProductExtInfo', params)
}
