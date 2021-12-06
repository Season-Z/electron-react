import { resolve } from 'path'
import { PROJECT_PATH } from './config'

export default {
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@': resolve(PROJECT_PATH, './app'),
      '@root': resolve(PROJECT_PATH, './app/renderer/router'),
      '@router': resolve(PROJECT_PATH, './src/components')
    }
  }
}
