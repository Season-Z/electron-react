import webpack, { Configuration } from 'webpack'
import { build as electronBuilder } from 'electron-builder'
import chalk from 'chalk'
import webpackConfigMain from './config/webpack.main'
import webpackConfigRenderer from './config/webpack.renderer'
import electronBuildConfig from './config/electron-build.config'
import { appLog, clearDir } from './utils'
import { DIST_PATH } from './config/config'

interface BuildConfigProps {
  config: Configuration
}

// 打包配置
function buildConfig(props: BuildConfigProps) {
  const { config } = props

  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) throw err
      if (!stats) throw 'Webpack states error!'

      process.stdout.write(
        stats.toString({
          colors: true,
          hash: true,
          version: true,
          timings: true,
          assets: true,
          chunks: false,
          children: false,
          modules: false
        }) + '\n\n'
      )

      if (stats.hasErrors()) {
        reject(stats)
      } else {
        resolve(undefined)
      }
    })
  })
}

// 主进程打包
function buildMain() {
  return buildConfig({ config: webpackConfigMain }).then(() => {
    appLog.success('[Main] : Main has build completed !')
  })
}

// 渲染进程打包
function buildRenderer(buildWeb: boolean) {
  let config = {
    ...webpackConfigRenderer,
    devtool: false as any
  }

  if (buildWeb) {
    // config.plugins = config.plugins.concat()
  }

  return buildConfig({ config }).then(() => {
    appLog.success('[Renderer] : Renderer has build completed !')
  })
}

function buildApp() {
  appLog.info(chalk.cyanBright(`[Clear Dir...] : ${chalk.magenta.underline(DIST_PATH)}`))

  try {
    clearDir(DIST_PATH, false, true)
  } catch (error) {
    appLog.warn(error.message)
  }

  const { NODE_ENV, npm_package_version, npm_package_name } = process.env

  appLog.info(
    `[Building...] : ${chalk.cyan(`${npm_package_name}@v${npm_package_version} in ${NODE_ENV}`)}`
  )

  const buildWeb = process.argv.some((v) => v.includes('web'))

  if (buildWeb) {
    buildRenderer(buildWeb)
  } else {
    Promise.allSettled([buildMain(), buildRenderer(buildWeb)])
      .then((res) => {
        const [main, renderer] = res
        if (main.status === 'rejected') {
          return Promise.reject(main.reason)
        }
        if (renderer.status === 'rejected') {
          return Promise.reject(renderer.reason)
        }

        return electronBuilder(electronBuildConfig)
          .then((res) => {
            appLog.success(`[Released] : ${res}`)
          })
          .catch((err) => {
            appLog.error(err)
          })
          .finally(() => {
            process.exit()
          })
      })
      .catch((reason) => {
        appLog.error(reason)
      })
  }
}

buildApp()
