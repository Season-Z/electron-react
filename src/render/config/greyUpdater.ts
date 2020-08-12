// 灰度发布控制数据 (目前写死控制), 本地调试可写测试接口
// 后期通过中台控制不同门店 需要更新的版本(接口获取)
export const greyUpdateMsg = {
  currentShopId: 10000003,
  versionIds: ["0.2.1", "0.1.2"],
  shopIds: [10000001, 10000002]
}


export const greyUpdateMsg1 = {
  currentShopId: 10000003,
  updateItems: [
    {
      shopId: 10000001,
      version: '0.2.1'
    }
  ]
}


  // versionIds: ["0.2.1", "0.1.2"],
  // shopIds: [10000001, 10000002]
