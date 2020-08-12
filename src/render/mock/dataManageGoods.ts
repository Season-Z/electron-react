// // 使用 Mock

// import { GOODS_MOCK_LIST  , GOODS_MOCK_DETAIL } from '../pages/DataManage/Goods/Api'
// const Mock = require('mockjs')

// const barData = Mock.mock({
//   // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
//   'list|1-10': [
//     {
//       // 属性 id 是一个自增数，起始值为 1，每次增 1
//       'id|+1': 1
//     }
//   ]
// })

// module.exports = {
//   'GET /mock/api/goods/list1': barData,

//   'GET /mock/api/data/goods/list': {
//     success: true, // 网关层数据返回
//     traceId: 'xxxxxxx',
//     result: {
//       success: true,
//       result: {
//         list: GOODS_MOCK_LIST,
//         page: '1',
//         size: '10',
//         total: '3107',
//         isEnd: false
//       }
//     }
//   },

//   'GET /mock/api/data/goods/detail': {
//     success: true, // 网关层数据返回
//     traceId: 'xxxxxxx',
//     result: {
//       success: true,
//       result: GOODS_MOCK_DETAIL
//     },
//   }
// }
