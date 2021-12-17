import { resolve } from 'path'
import { PROJECT_PATH } from './config'

export default {
  mode: process.env.NODE_ENV,
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@/': resolve(PROJECT_PATH, './app'),
      '@router': resolve(PROJECT_PATH, './app/renderer/router'),
      '@components': resolve(PROJECT_PATH, './app/renderer/components'),
      '@views': resolve(PROJECT_PATH, './app/renderer/views'),
      '@config': resolve(PROJECT_PATH, './app/renderer/config'),
      '@utils': resolve(PROJECT_PATH, './app/renderer/utils'),
    }
  }
}
