/**
 * 放在子进程中
 * https://zhuanlan.zhihu.com/p/36678971
 * C++ node.js 插件
 */
const path = require('path')

// 非 electron 环境，不能用 electron-is-dev
const isDev = process.env.NODE_ENV === 'development'

let polyfill_sdk = {
  runTask: (config, cb) => {
    isDev && console.log('表折腾啦，这是个 polyfill :)')
    cb instanceof Function && cb({ code: 405, error: polyfill_sdk.error })
  },
  error: '',
}

try {
  if (process.platform === 'win32') {
    polyfill_sdk = process.arch === 'ia32' // x64
      ? require('./aclas_sdk-ia32.node')
      : require('./aclas_sdk-x64.node')
  }
} catch (error) {
  // console.warn(error)
  polyfill_sdk.error = error
}

// 下发电子称
function dispatchDZC(config, callback) {
  const { type, host, filename, dll_path } = config // type: 0x0000 PLU、0x0011 条码
  isDev && console.log('----', filename, '----')
  polyfill_sdk.runTask(config, function (json) {
    callback(Object.assign(json, { host }))
  })
}

process.on('message', ev => {
  const { cmd, data } = ev
  if (cmd === 'exit') {
    process.exit(ev)
  } else if (cmd === 'dispatch') {
    dispatchDZC(data, function (json) {
      process.send({ cmd: 'dispatch', data: json })
    })
  }
})
