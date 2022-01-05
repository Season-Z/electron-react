import path from 'path'
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
// import { log } from '../log'
import windowMap from '@config/windowMap'
import { DEFAULT_CREATE_CONFIG, DEFAULT_WINDOW_OPTIONS } from './config'

const { NODE_ENV, HOST, PORT } = process.env

/** 创建新窗口相关选项 */
export interface CreateWindowOptions {
  /** 路由启动参数 */
  params?: any
  /** URL 启动参数 */
  query?: any
  /** BrowserWindow 选项 */
  windowOptions?: BrowserWindowConstructorOptions
  /** 窗口启动参数 */
  createConfig?: CreateWindowConfig
}

/** 已创建的窗口列表 */
export const windowList: Map<WindowKey, BrowserWindow> = new Map()

/**
 * 通过 windowMap 中的 key(name) 得到 url
 * @param key
 */
export function getWindowUrl(key: WindowKey, options: CreateWindowOptions = {}): string {
  let routePath = windowMap.get(key)?.path

  if (typeof routePath === 'string' && options.params) {
    routePath = routePath.replace(/\:([^\/]+)/g, (_, $1) => {
      return options.params[$1]
    })
  }

  // const query = options.query ? $tools.toSearch(options.query) : ''

  // if (NODE_ENV === 'development') {
  //   return `http://${host}:${port}#${routePath}${query}`
  // } else {
  //   return `file://${path.join(__dirname, '../renderer/index.html')}#${routePath}${query}`
  // }
  if (NODE_ENV === 'development') {
    return `http://${HOST}:${PORT}#${routePath}`
  } else {
    return `file://${path.join(__dirname, '../renderer/index.html')}`
  }
}

/**
 * 创建一个新窗口
 * @param key
 * @param options
 */
export function createWindow(
  key: WindowKey,
  options: CreateWindowOptions = {}
): Promise<BrowserWindow> {
  return new Promise((resolve) => {
    const windowConfig: WindowConfig | AnyObj = windowMap.get(key) || {}

    const windowOptions: BrowserWindowConstructorOptions = {
      ...DEFAULT_WINDOW_OPTIONS, // 默认新窗口选项
      ...windowConfig.windowOptions, // windowMap 中的配置的window选项
      ...options.windowOptions // 调用方法时传入的选项
    }

    const createConfig: CreateWindowConfig = {
      ...DEFAULT_CREATE_CONFIG,
      ...windowConfig.createConfig,
      ...options.createConfig
    }

    let activeWin: BrowserWindow | boolean
    if (createConfig.single) {
      activeWin = activeWindow(key)
      if (activeWin) {
        resolve(activeWin)
        return activeWin
      }
    }

    const win = new BrowserWindow(windowOptions)

    const url = getWindowUrl(key, options)
    windowList.set(key, win)
    win.loadURL(url)

    // if (createConfig.saveWindowBounds) {
    //   const lastBounds = $tools.settings.windowBounds.get(key)
    //   if (lastBounds) win.setBounds(lastBounds)
    // }

    if (createConfig.hideMenus) win.setMenuBarVisibility(false)
    if (createConfig.created) createConfig.created(win)

    win.webContents.on('dom-ready', () => {
      win.webContents.send('dom-ready', createConfig)
    })

    win.webContents.on('did-finish-load', () => {
      if (createConfig.autoShow) {
        if (createConfig.delayToShow) {
          setTimeout(() => {
            win.show()
            win.webContents.openDevTools()
          }, createConfig.delayToShow)
        } else {
          win.show()
          win.webContents.openDevTools()
        }
      }
      resolve(win)
    })

    win.once('ready-to-show', () => {
      if (createConfig.openDevTools) win.webContents.openDevTools()
    })

    win.once('show', () => {
      // log.info(`Window <${key}:${win.id}> url: ${url} opened.`)
    })

    win.on('close', () => {
      // if (createConfig.saveWindowBounds && win) {
      //   $tools.settings.windowBounds.set(key, win.getBounds())
      // }
      windowList.delete(key)
      // log.info(`Window <${key}:${win.id}> closed.`)
    })
  })
}

/**
 * 激活一个已存在的窗口, 成功返回 BrowserWindow 失败返回 false
 * @param key
 */
export function activeWindow(key: WindowKey): BrowserWindow | false {
  const win: BrowserWindow | undefined = windowList.get(key)

  if (win) {
    win.show()
    return win
  } else {
    return false
  }
}
