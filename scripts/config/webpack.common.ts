import { resolve } from 'path'
import { PROJECT_PATH } from './config'

export default {
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@src': resolve(PROJECT_PATH, './src'),
      components: resolve(PROJECT_PATH, './src/components'),
      '@utils': resolve(PROJECT_PATH, './src/utils')
    }
  }
}
