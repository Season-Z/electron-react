import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import chalk from 'chalk'
import webpackConfigMain from './config/webpack.main'
import webpackConfigRenderer from './config/webpack.renderer'
import ElectronProcess from './electron-process'
import { SERVER_HOST, SERVER_PORT } from './config/config'
import proxySetting from './config/proxy'
import { appLog } from './utils'

const serverConfig: WebpackDevServer.Configuration = {
  host: SERVER_HOST,
  port: SERVER_PORT, // 默认是8080
  // clientLogLevel: 'silent', // 日志等级
  compress: true, // 是否启用 gzip 压缩
  // open: true, // 打开默认浏览器
  // hot: true, // 热更新
  historyApiFallback: true,
  proxy: proxySetting
}

const electronProcess = new ElectronProcess()

// 主进程
function startMainServer() {
  return new Promise((resolve) => {
    webpackConfigMain.devtool = 'source-map'
    webpackConfigMain.mode = 'development'
    webpackConfigMain.watch = true
    webpackConfigMain.watchOptions = {
      ignored: ['**/*.tsx', '**/*.jsx', '**/*.less', '**/*.css']
    }
    webpack(webpackConfigMain, (err, stats) => {
      if (err) throw err
      if (!stats) throw 'webpack states error!'

      if (stats.hasErrors()) {
        console.log(chalk.red(stats.toString()))
      } else {
        electronProcess.start()
        resolve(stats)
      }
    })
  })
}

// 渲染进程
function startRendererServer(runInBrowser: boolean) {
  return new Promise(async (resolve, reject) => {
    process.env.port = serverConfig.port as string
    process.env.host = serverConfig.host

    if (runInBrowser) {
      webpackConfigRenderer.target = 'web'
      serverConfig.open = true
    }

    const compiler = webpack(webpackConfigRenderer as any)
    // @ts-ignore
    const server = new WebpackDevServer(serverConfig, compiler)

    try {
      await server.start()
      appLog.success('[Renderer] : renderer process has complated')
      resolve(undefined)
    } catch (error) {
      console.log(chalk.red(error))
      reject(error)
    }
  })
}

function startApp() {
  const runInBrowser = process.argv.some((v) => v.includes('web'))
  if (runInBrowser) {
    startRendererServer(runInBrowser)
  } else {
    Promise.allSettled([startMainServer(), startRendererServer(runInBrowser)]).then((res) => {
      const [main, renderer] = res

      if (main.status === 'rejected') {
        return Promise.reject(main.reason)
      }
      if (renderer.status === 'rejected') {
        return Promise.reject(renderer.reason)
      }

      appLog.success(chalk.cyanBright('App has started！'))
    })
  }
}

startApp()
