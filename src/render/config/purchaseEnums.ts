/**
 * 采购本地枚举
 */

export const enumGlobalPurchase = {
  /** 好坏货标记 */
  isDamage: [
    {
      value: 1,
      label: '好货'
    },
    {
      value: 2,
      label: '坏货'
    }
  ],
  /** 退货原因 */
  returnReason: [
    {
      value: 1,
      label: '高库存'
    },
    {
      value: 2,
      label: '供应商撤场'
    },
    {
      value: 3,
      label: '销售差'
    },
    {
      value: 4,
      label: '其他'
    }
  ]
}
