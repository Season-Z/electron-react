/**
 * 判断是否是合肥的网关格式
 * 兼容根据 url 或 response 判断
 */
export function isHefeiGateway(arg0: any): boolean {
  let isHefei = false

  if (typeof arg0 === 'string') {
    isHefei = arg0.startsWith('ylp')
  } else {
    isHefei = arg0.result?.codeInfo
  }

  return isHefei
}

/**
 * 格式化合肥网关请求参数
 */
export function hefei2hangzhouReq(arg0: any) {
  const { page, size, ...omited } = arg0
  if (page !== undefined || size !== undefined) {
    return {
      pageReq: {
        pageNum: page,
        pageSize: size
      },
      ...omited
    }
  } else {
    return arg0
  }
}

export interface IHefeiResult {
  codeInfo: {
    code: number // 0
    msg: string
  }
  pageResp?: {
    pageNum: number
    pageSize: number
    pages: number
    total: string
  }
  data?: object | Array<any>
}

export interface IHefeiError {
  error: {
    code: number // -32602
    message: string // "Invalid params [DEBUG] InvalidProtocolBufferException: Not an int32 value: []"
  }
}

export interface IHefeiResponse extends IHefeiError {
  success: boolean
  result: IHefeiResult
  traceId: string
}

/**
 * 格式化合肥网关响应数据
 */
export function hefei2hangzhouRes(arg0: IHefeiResponse) {
  let final_data: any = arg0
  const { result, error, ...omited1 } = arg0 // ommited1 === traceId
  if (error) {
    final_data = {
      result: error,
      ...omited1
    }
  } else {
    let { codeInfo, pageResp, data, ...omited2 } = result
    const success = codeInfo.code === 0
    if (success) {
      final_data = {
        success,
        message: codeInfo.msg,
        result: {
          success: success,
          // list: data, // 扩展字段，杭州用的 list
          data,
          ...omited2
        },
        ...omited1
      }
      // 没有 pageResp
      // {"success":true,"result":{"codeInfo":{"code":0,"msg":"成功"}},"traceId":"8e4b7b6c8a498b5a"}
      // if (!pageResp) {
      //   // 20-06-21 暂时做下兼容处理 - 20-06-24 移除
      //   // 仓店盘点的接口返回 pageInfo
      //   pageResp = (result as any).pageInfo
      // }
      if (pageResp) {
        const { pageNum, pageSize, total, ...omited3 } = pageResp
        final_data.result = {
          ...final_data.result,
          page: pageNum,
          size: pageSize,
          total: Number(total),
          isEnd: pageNum >= pageResp.pages, // 扩展字段
          ...omited3
        }
      }
    } else {
      final_data = {
        success,
        error: {
          code: codeInfo.code,
          message: codeInfo.msg
        }
      }
    }
  }

  return final_data
}

/* 杭州网关 {
  "success": true,
  "result": {
    "success": true,
    "errorCode": 0,
    "message": "",
    "result": {
      "list": [],
      "page": 1,
      "size": 10000,
      "total": 20
    }
  },
  "traceId": "209ba9e4939e8f05"
}
*/

/* 合肥网关 {
  "success": true,
  "result": {
    "codeInfo": {
      "code": 0,
      "msg": "成功"
    },
    "pageResp": {
      "pageNum": 1,
      "pageSize": 10,
      "pages": 0,
      "total": "0"
    },
    "data": []
  },
  "traceId": "3d57fb5ce4c24b7"
}
------------------------------
{
  "success": true,
  "result": {
    "codeInfo": {
      "code": 1004000,
      "msg": "地点不能为空"
    },
    "data": []
  },
  "traceId": "6a82d750070999cc"
}
------------------------------
{
  "success": false,
  "error": {
    "code": -32602,
    "message": "Invalid params [DEBUG] InvalidProtocolBufferException: Not an int32 value: []"
  },
  "traceId": "9459f14b48774a34"
} */
