import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { RouteObject } from 'react-router-dom'
import { BrowserWindowKey } from '@/electron/base'

declare global {
  type UnionType<T> = T extends (infer P)[] ? P : never

  type WindowKey = BrowserWindowKey[number]
  /**
   * 新窗口启动参数
   */
  interface CreateWindowConfig {
    /** 显示标题栏 默认 true */
    showTitlebar?: boolean
    /** 显示侧边栏 默认 false */
    showSidebar?: boolean
    /** 记住窗口关闭时的位置和尺寸, 窗口打开时自动加载 */
    saveWindowBounds?: boolean
    /** 延迟执行 win.show() 单位：ms 默认：10 (适当的延迟避免 DOM 渲染完成前白屏或闪烁) */
    delayToShow?: number
    /** 创建完成后自动显示 默认：true */
    autoShow?: boolean
    /** 禁止重复创建窗口 默认：true */
    single?: boolean
    /** 隐藏菜单栏 默认：false */
    hideMenus?: boolean
    /** 窗口创建完成回调 */
    created?: (win: BrowserWindow) => void
  }

  /** 窗口配置 */
  interface WindowConfig extends RouteObject {
    /** 页面资源 key */
    key: string
    /** 自定义参数, 视情况而定 */
    type?: string
    redirect?: object
    /** 以 createWindow 打开时, 加载的 BrowserWindow 选项 */
    windowOptions?: BrowserWindowConstructorOptions
    /** 新窗口启动参数 */
    createConfig?: CreateWindowConfig
  }
}
