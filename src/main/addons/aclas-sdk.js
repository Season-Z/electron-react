const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const os = require('os')
const electronDev = require('electron-is-dev')
const Store = require('electron-store')
const { log } = require('../utils/log')

const store = new Store()
const ACLAS_ADDONS = '@Aclas/addons'
const ADDONS_TYPE = { cpp: 'C++', csharp: 'C#' }

/** 错误状态码 */
exports.code_dict = {
  256: '已初始化',
  257: '未初始化',
  258: '设备不存在',
  259: '不支持的协议类型',
  260: '该数据类型不支持此操作',
  261: '该数据类型不支持',
  264: '无法打开输入文件',
  265: '字段数与内容数不匹配',
  266: '通讯数据异常',
  267: '解析数据异常',
  268: 'CodePage错误',
  269: '无法创建输出文件',

  0: 'sucessed',
  1: 'processing',

  403: '[链接超时][默认40秒]',
  404: '[LoadLibrary][未加载到AclasSDK.dll]',
  405: 'polyfill addons.',
  406: '报错 子进程拉起多次失败',
  407: '报错 AclasFor_node.exe 子进程',
  408: '报错 AclasFor_node.exe 正在运行',
  409: '报错 trycatch 未知异常',
  501: 'ping 超时',
  502: 'ping 不通',
}

let _recall_num_cpp
function runTask_cpp(config, callback) {
  // const p = electronDev
  //   ? path.join(__dirname, './addons/with-cpp')
  //   : /*webpack 打包后的相对路径*/'./addons/with-cpp' // 有问题 20-07-16 (win7)
  const forked = cp.fork(path.join(__dirname, './addons/with-cpp'))
  forked.on('message', ev => {
    const { cmd, data } = ev
    if (cmd === 'dispatch') { // 下发
      if (data.code === 0) { // 完成
        _recall_num_cpp = 0
        forked.send({ cmd: 'exit', data: 0 }) // 退出子进程
        setTimeout(() => callback(data), 90) // 给子进程退出留点时间
      } else { // 进行中
        callback(data)
      }
      try {
        log({ data: JSON.stringify(data), filename: 'with-cpp.log', append: false })
      } catch (error) { }
    }
  })
  forked.on('exit', code => {
    // cp.fork('./with-cpp') 路径错误子进程也会创建
    // 所以 trycatch 是木有意义的
    if (code) { // 有报错
      setTimeout(() => {
        _recall_num_cpp++
        if (_recall_num_cpp > 2) {
          callback({ code: 406 }) // 拉起两次还是失败；放弃
        } else {
          runTask_cpp(config, callback) // 重新拉起
        }
      }, 90)
      log({ data: code, filename: 'with-cpp-error.log' })
      electronDev && console.log('[aclas-sdk.js] 有报错，重新拉起', code)
    } else {
      electronDev && console.log('[aclas-sdk.js] 下发进程完成')
    }
  })
  forked.send({ cmd: 'dispatch', data: config }) // 下发
}

/** AclasSDK */
module.exports = {
  ACLAS_ADDONS,
  ADDONS_TYPE,
  runTask() {
    try {
      let flag = store.get(ACLAS_ADDONS) || ADDONS_TYPE.cpp
      if (process.arch === 'ia32') flag = ADDONS_TYPE.csharp // 32bit 机器上只能用 C#
      flag === ADDONS_TYPE.cpp ? runTask_cpp(...arguments) : require('./with-csharp')(...arguments)
    } catch (error) {
      log({ data: error, filename: 'aclas-sdk-error.log' })
    }
  }
}




// --------- 调试-s ---------
let error_info = ''
ipcMain.on('dev-info', (event) => {
  event.sender.send('dev-info', {
    cwd: process.cwd(),
    dirname: __dirname,
    arch: process.arch,
    NODE_ENV: process.env.NODE_ENV,
    error_info,
  })
})
// --------- 调试-e ---------
