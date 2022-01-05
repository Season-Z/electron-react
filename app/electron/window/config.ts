import { app, BrowserWindowConstructorOptions } from 'electron'
// import { asAssetsPath } from './paths'

/**
 * 应用名称
 */
export const APP_NAME = app.name

/**
 * 应用版本
 */
export const APP_VERSION = app.getVersion()

/**
 * 应用标题
 */
export const APP_TITLE = 'Electron React'

/** 应用主图标 (桌面) */
// export const APP_ICON = asAssetsPath('app-icon/app-icon@256.png')

/** 亮色风格托盘图标 标准尺寸 16*16, 系统会自动载入 @2x 和 @3x */
// export const TRAY_ICON_LIGHT = asAssetsPath('tray-icon/tray-icon-light.png')

/** 暗色风格托盘图标 (仅 macOS) */
// export const TRAY_ICON_DARK = asAssetsPath('tray-icon/tray-icon-dark.png')

/** 创建新窗口时默认加载的选项 */
export const DEFAULT_WINDOW_OPTIONS: BrowserWindowConstructorOptions = {
  // icon: APP_ICON,
  minWidth: 400,
  minHeight: 300,
  width: 800,
  height: 600,
  show: false,
  vibrancy: 'dark', // 'light', 'medium-light' etc
  visualEffectState: 'active', // 这个参数不加的话，鼠标离开应用程序其背景就会变成白色
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    webSecurity: false,
    scrollBounce: true
  }
  // skipTaskbar: false, // 是否在任务栏中隐藏窗口
  // backgroundColor: '#fff',
}

/** 创建的基本配置信息 */
export const DEFAULT_CREATE_CONFIG: CreateWindowConfig = {
  showSidebar: false,
  showTitlebar: true,
  autoShow: true,
  delayToShow: 10,
  single: true
}
