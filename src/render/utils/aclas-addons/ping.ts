import cp from 'child_process'
import iconv from 'iconv-lite'

export enum PING_CODE {
  /** ping 超时 */
  timeout = 403,
  /** ping 不通 */
  not_found = 404,
  /** ping 正常 */
  alive = 0,
}

let _ping_timer: any
let _proc: cp.ChildProcessWithoutNullStreams | null = null
/**
 * a ping wrapper for nodejs
 */
export function ping(host = '', timeout = 4900): Promise<{ code: PING_CODE, host: string }> {
  return new Promise(resolve => {
    if (!host) {
      // ping 不通
      resolve({ host, code: PING_CODE.not_found })
      return
    }
    if (_ping_timer) {
      clearTimeout(_ping_timer)
      _ping_timer = null
    }
    if (_proc && !_proc.killed) {
      _proc.kill()
    }
    const lines: Array<string> = []
    _proc = cp.spawn('ping', ['-n', '2', host])
    _ping_timer = setTimeout(() => {
      _ping_timer = null
      _proc?.kill()
      // ping 超时
      resolve({ host, code: PING_CODE.timeout })
    }, timeout)

    _proc.stdout.on('end', () => {
      // console.log(lines.join('\n')) // 这里不打印还特么不行 = =，runTask 不给响应
      clearTimeout(_ping_timer)
      _ping_timer = null
      _proc?.kill()
      if (lines.find(l => l.includes('TTL'))) {
        resolve({ host, code: PING_CODE.alive })
      } else {
        // ping 不通
        resolve({ host, code: PING_CODE.not_found })
      }
    })

    _proc.stdout.on('data', chunk => {
      const line = iconv.decode(chunk, 'GB2312')
      // console.log(line)
      lines.push(line)
    })

  })
}

// --------- ping 包源码 ---------
/**
 * Process ipv4 output's body
 * @param {string} line - A line from system ping
 */
// WinParser.prototype._processIPV4Body = function (line) {
//   var tokens = line.split(' ');
//   var byteTimeTTLFields = __.filter(tokens, function (token) {
//       var isDataField = token.indexOf('=') >= 0 || token.indexOf('<') >= 0;
//       return isDataField;
//   });

//   var expectDataFieldInReplyLine = 3;
//   var isReplyLine = byteTimeTTLFields.length >= expectDataFieldInReplyLine;
//   if (isReplyLine) {
//       var packetSize = this._pingConfig.packetSize;
//       var byteField = __.find(byteTimeTTLFields, function (dataField) {
//           var packetSizeToken = util.format('=%d', packetSize);
//           var isByteField = dataField.indexOf(packetSizeToken) >= 0;
//           return isByteField;
//       });

//       // XXX: Assume time field will always be next of byte field
//       var byteFieldIndex = byteTimeTTLFields.indexOf(byteField);
//       var timeFieldIndex = byteFieldIndex + 1;
//       var timeKVP = byteTimeTTLFields[timeFieldIndex];

//       var regExp = /([0-9.]+)/;
//       var match = regExp.exec(timeKVP);

//       this._times.push(parseFloat(match[1], 10));
//   }
// };

/** 下发电子称 ping 包 */
/* function dispatchBalanceWith_ping(arg0: DispatchParams) {
  // 20-06-24
  // ping命令报错:10.0.62.93
  // Error: ping.probe: there was an error while executing the ping program. . Check the path or permissions...
  //   at ChildProcess.eval (ping-promise.js:61)
  //   at Object.onceWrapper (events.js:300)
  //   at ChildProcess.emit (events.js:210)
  //   at Process.ChildProcess._handle.onexit (internal/child_process.js:270)
  //   at onErrorNT (internal/child_process.js:456)
  //   at processTicksAndRejections (internal/process/task_queues.js:80)

  ping.promise.probe(arg0.host).then(res => {
    if (res.alive) {
      runTask(arg0)
    } else {
      console.log('失败主机 host:', arg0.host)
      // ping 不通，直接返回
      arg0.callback({ code: 403, index: -1, total: -1, done: true, error: code_dict['403'] })
    }
  }).catch(error => {
    console.warn(`ping命令报错:${arg0.host}\n`, error)
    arg0.callback({ code: 403, index: -1, total: -1, done: true, error })
  })
} */

// --------- 未剥离 ping.ts ---------
// let _ping_timer: any
// const _PINT_SET_TIMEOUT = 1000 * 4.9 // 4.9 秒超时
/** 下发电子称 */
// export function dispatchBalance(arg0: DispatchParams) {
//   new Promise<{ bool: boolean, arg1: CallbackArgsExtend | DispatchParams }>(resolve => {
//     const lines: Array<string> = []
//     const proce = cp.spawn('ping', ['-n', '2', arg0.host])

//     if (_ping_timer) {
//       proce.kill()
//       clearTimeout(_ping_timer)
//       _ping_timer = null
//     }
//     _ping_timer = setTimeout(() => {
//       proce.kill()
//       _ping_timer = null
//       // ping 超时
//       console.warn(`ping 超时:`, arg0.host)
//       resolve({ bool: false, arg1: { code: 501, index: -1, total: -1, done: true, error: code_dict['501'], host: arg0.host } })
//     }, _PINT_SET_TIMEOUT)

//     proce.stdout.on('end', function () {
//       proce.kill()
//       clearTimeout(_ping_timer)
//       _ping_timer = null
//       if (lines.find(l => l.includes('TTL'))) {
//         resolve({ bool: true, arg1: arg0 })
//       } else {
//         console.warn(`ping 不通:`, arg0.host)
//         // ping 不通
//         resolve({ bool: false, arg1: { code: 502, index: -1, total: -1, done: true, error: code_dict['502'], host: arg0.host } })
//       }
//     })

//     proce.stdout.on('data', function (chunk: any) {
//       clearTimeout(_ping_timer)
//       const line = iconv.decode(chunk, 'GB2312')
//       console.log(line)
//       lines.push(line)
//     })
//   }).then(({ bool, arg1 }) => {
//     if (bool) {
//       runTask(arg1 as DispatchParams)
//     } else {
//       arg0.callback(arg1 as CallbackArgsExtend)
//     }
//   })
// }
