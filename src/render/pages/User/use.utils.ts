import ypRequest from '@utils/ypRequest'

/** 门店 */
export interface Shop {
  id: string // "820"
  merchantStatus: number // 1
  name: string // "杭州谊品生鲜北辰之光店"
  ids: any
  [propsName: string]: any
}
/**
 * 获取门店列表
 * @param subjectId 主体 ID
 */
const queryChildrenMerchants = async (merchantIds: any) => {
  try {
    const apiUrl = 'merchant.merchant.queryChildrenMerchantsByMerchantIds'
    const dataVal = { merchantIds, subMerchantType: 3 }
    const res: any = await ypRequest(apiUrl, dataVal)
    if (res.success) {
      if (res.result.isSuccess) {
        return res.result.merchant
      } else {
        return []
      }
    } else {
      return []
    }
  } catch (error) {}
}
export const getShopList = async (
  subjectId: string
): Promise<[boolean, Shop?, Array<Shop>?, Array<string>?]> => {
  // 获取所有全下 merchant
  const { success, result, message: msg } = await ypRequest<{ merchant: Array<{ id: string }> }>(
    'auth.subject.listSubjectMerchants',
    { subjectId, tenantId: 1 }
  )

  if (success) {
    const { merchant } = result // [{id: "2132334610"}]
    if (merchant.length > 0) {
      const ids = merchant.map((item: any) => item.id)
      const listChildrenMerchants = await queryChildrenMerchants(ids)
      const operateAry = listChildrenMerchants.map((item: any) => item.id)
      const newList = new Set([...ids, ...operateAry])
      // console.log('newList<<>>>>>', newList)
      const { success: succ, result: res } = await ypRequest(
        'merchant.merchant.queryMerchantIdNames',
        {
          ids: [...newList],
          subMerchantType: 3, // 3 代表有权限的店铺
          size: 50 // 暂时假定最多 50，后面超过 50 需要分页 20-06-02
        }
      )

      if (succ) {
        const shop = (res.list ?? [])[0] || null
        return [shop !== null, shop, res.list ?? [], ids]
      }
    }
  }
  return [false]
}
