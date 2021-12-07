import { resolve } from 'path'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import WebpackBar from 'webpackbar'
import common from './webpack.common'
import { DIST_PATH, PROJECT_PATH } from './config'

export default merge(
  common as Configuration,
  {
    target: 'electron-main',
    entry: {
      main: resolve(PROJECT_PATH, './app/electron', 'main.ts')
    },

    output: {
      path: resolve(DIST_PATH, './main'),
      filename: '[name].js',
      chunkFilename: '[name].js'
    },

    module: {
      rules: [
        {
          test: /(?<!\.d)\.ts$/,
          use: 'babel-loader',
          // options: { cacheDirectory: true },
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new WebpackBar({
        name: 'Main  ',
        color: '#fa8c16'
      })
    ]
  } as unknown as Configuration
)
