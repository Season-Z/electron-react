const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

const isWeb = process.env.TARGET === 'web' // 是否为 web 构建模式
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const resolvePath = dir => path.join(__dirname, dir) // 指向
const { routes = [] } = require('./config/routes')
const closeFlexRoute = process.env.closeFlexRoute

let devtool = 'eval'
try {
  /**
   * 如果你需要 "能看懂的source-map"
   * 新建 _env 文件，内容：
   * devtool=eval-source-map
   */
  const conf = fs.readFileSync(path.join(__dirname, '_env'), 'utf-8')
  devtool = dotenv.parse(conf).devtool
} catch (error) { }

const webpack = {
  dev: config => {
    config
      .devtool(devtool)
      .target('electron-renderer')
      .module.rule('node-addons')
      .test(/\.node$/)
      .use('node-loader')
      .loader('node-loader')
    config.node.set('__dirname', false).set('__filename', false)
    // return config
  },
  dev_web: config =>
    config
      .devtool('eval-cheap-source-map')
      .node.set('fs', 'empty')
      .set('worker_threads', 'empty')
      .set('electron', 'empty')
      .set('electron-is-dev', 'empty')
      .set('electron-store', 'empty')
      .set('electron-updater', 'empty'),
  prod: config => {
    config
      .devtool('cheap-module-source-map')
      .target('electron-renderer')
      .module.rule('node-addons')
      .test(/\.node$/)
      .use('relative-loader')
      .loader('relative-loader')
      .options({
        relativePath: '/addons/'
      })
    config.node.set('__dirname', false).set('__filename', false)
    return config
  },
  prod_web: config =>
    config
      .devtool('source-map') // 原装还原，速度最慢
      .node.set('fs', 'empty')
      .set('worker_threads', 'empty')
      .set('electron', 'empty')
      .set('electron-is-dev', 'empty')
      .set('electron-store', 'empty')
      .set('electron-updater', 'empty')
}

const chainWebpack = config =>
  isProd
    ? isWeb
      ? webpack.prod_web(config)
      : webpack.prod(config)
    : isWeb
      ? webpack.dev_web(config)
      : webpack.dev(config)

export default {
  chainWebpack,
  // 是否编译 node_modules
  nodeModulesTransform: {
    type: 'none'
  },
  // 生成资源带 hash 尾缀
  // 开发模式下 umi 会忽略此选项，不然热重载会出问题(很贴心)
  hash: true,
  // url 格式
  history: {
    type: 'hash'
  },
  // script、link 标签资源引入路径
  publicPath: './',
  // 文件输出目录
  outputPath: process.env.DIST ? `../../${process.env.DIST}` : undefined,
  // antd 主题配置
  theme: {
    '@primary-color': '#A14EFF',
    '@link-color': '#A14EFF',
    '@font-family': '"futura-pt", sans-serif',
    '@line-height-base': '1.2',
    // '@border-radius-base': '4px',
    '@font-size-base': '14px'
  },
  // 路径别名
  alias: {
    '@': resolvePath(''),
    '@components': resolvePath('components'),
    '@config': resolvePath('config'),
    '@utils': resolvePath('utils'),
    '@pages': resolvePath('pages'),
    '@hooks': resolvePath('hooks')
  },
  // 全局环境常量
  define: {
    NODE_ENV: process.env.NODE_ENV,
    YPSHOP_ENV: process.env.YPSHOP_ENV,
    TARGET: process.env.TARGET,
    RENDER__DIR: __dirname,
  },
  // 本地热加载走写死路由，提高速度，命令行添加参数才有效
  routes: closeFlexRoute ? routes : undefined,
  // 拷贝一些静态文件
  copy: [
    'utils/aclas-addons/static',
  ],
  terserOptions: {
    compress: {
      // 去掉 console.log
      // drop_console: true,
      // pure_funcs: ['console.log'],
    },
  },
}
