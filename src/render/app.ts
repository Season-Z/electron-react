/**
 * 自定义运行时配置
 * https://umijs.org/zh-CN/docs/runtime-config
 */
import React from 'react'
import { history } from 'umi'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import store from '@utils/ypStore'
import ypEvent from '@utils/ypRequest/utils/event'
import { SHOP_CURRENT } from '@config/constant'
const app = require('@utils/polyfill')('electron')
const { ipcRenderer: ipc } = app
const CLOSE_UPDATE = process.env.CLOSE_UPDATE

// tooken 过期
ypEvent.on('auth_error', () => history.push('/User/login'))

// 关闭electron的loading
setTimeout(() => window.stopLoading(), 1000)

// 覆写 render
export function render(oldRender: () => void) {
  oldRender()
}

// 在初始加载和路由切换时做一些事情
export function onRouteChange({ location, routes, action, matchedRoutes }: any) {
  // 登录判断处理
  if (location.pathname !== '/User/login') {
    const token = store.get('token')
    const shopId = store.get(SHOP_CURRENT)?.id
    if (!token) {
      message.warn('token 过期，请重新登陆')
      history.replace('/User/login')
    } else if (!shopId) {
      message.warn('门店 id 不存在，请重新登陆')
      history.replace('/User/login')
    }
  }
  const stopCheckUpdate = store.get('stopCheckUpdate') || false // 完成下载后，是否立即升级，如果否，下次不会继续，重启才继续
  if (!CLOSE_UPDATE) {
    // 更新开关
    if (!stopCheckUpdate) {
      ipc && ipc.send('checkAllUpdates') // 发起检测
      store.set('stopCheckUpdate', true)
    }
  }
}

// 修改交给 react-dom 渲染时的根组件
export function rootContainer(container: React.ReactDOM) {
  return React.createElement(ConfigProvider, { locale: zhCN }, container)
}
