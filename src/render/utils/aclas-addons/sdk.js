// ---- code 对照码 ----
// 0   0      正常
// 1   0x0001 进度事件
// 2   0x0002 手动停止
// 256 0x0100 已初始化
// 257 0x0101 未初始化
// 258 0x0102 设备不存在
// 259 0x0103 不支持的协议类型
// 260 0x0104 该数据类型不支持此操作
// 261 0x0105 该数据类型不支持
// 264 0x0108 无法打开输入文件
// 265 0x0109 字段数与内容数不匹配
// 266 0x010A 通讯数据异常
// 267 0x010B 解析数据异常
// 268 0x010C CodePage错误
// 269 0x010D 无法创建输出文件
// ---- 自定义错误 ----
// 404 [LoadLibrary][未加载到AclasSDK.dll]
// 403 [链接超时][默认40秒]

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

let polyfill_sdk = {
  runTask: (_, cb) => {
    console.log('表折腾啦，这是个 polyfill :)')
    cb instanceof Function && cb({ code: 0, error: 'polyfill addons.' })
  }
}

try {
  if (process.platform === 'win32') {
    polyfill_sdk = process.arch === 'ia32' // x64
      ? require('./addons/aclas_sdk-ia32.node')
      : require('./addons/aclas_sdk-x64.node')
    // require.cache[require.resolve('./addons/aclas_sdk-x64.node')]
  }
} catch (error) {
  console.warn(error)
}

/** AclasSDK */
exports.sdk = polyfill_sdk
