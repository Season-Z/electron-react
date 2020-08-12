/**
 * 主进程窗口
 */
'use strict'

const { BrowserView, BrowserWindow, app } = require('electron')
const isDevEnv = require('electron-is-dev')
const path = require('path')
// const { autoUpdater } = require('electron-updater')
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer')
// const electronHelper = require('./electron-helper')
const AppAutoUpdater = require('../controls/AppAutoUpdater')
const { ADDRESS_DEV, ADDRESS_LOCAL, ADDRESS_PROD, CONST_ADDRESS_PROD } = require('../config/config')
const log = require('electron-log')
const Store = require('electron-store')
const { autoUpdater } = require('electron-updater')

const store = new Store()

module.exports = class AppMainWindow extends BrowserWindow {
  constructor() {
    const config = {
      width: 1010,
      height: 716,
      minWidth: 800,
      minHeight: 600,
      // frame: false,
      autoHideMenuBar: false,
      // titleBarStyle: 'hidden',
      fullscreen: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
        preload: path.join(__dirname, 'preload.js')
      }
    }

    super(config)

    this.mainWindow = this
    this.browserView = null

    // 先隐藏主窗口，把主窗口设置为最大，再展示
    this.mainWindow.maximize()
    this.mainWindow.show()

    this.initMainWindow()
    this.initEvents()

    this.reload_count = 0 // 重载次数
  }

  loadURL(url) {
    super.loadURL(url ? url : (isDevEnv ? ADDRESS_DEV : ADDRESS_PROD()))
      .then(() => { })
      .catch(() => {
        if (this.reload_count > 0) {
          // 已经重载了一次，没救了，直接退掉吧 ^_^
          process.exit()
        } else {
          this.reload_count++
          store.delete(CONST_ADDRESS_PROD)
          this.loadURL(ADDRESS_LOCAL)
        }
      })
  }

  initMainWindow() {

    // 必须在主进程塞入文件前配置 loading
    this.windowLoading()

    this.loadURL()

    // 打开开发者工具
    if (isDevEnv) {
      this.mainWindow.openDevTools()
    }

    // eslint-disable-next-line no-constant-condition
    // if (false) { // 20-06-16 尝试修复频繁崩溃
    // 异步安装插件
    if (isDevEnv) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension REDUX_DEVTOOLS:  ${name}`))
        .catch(err => console.log('An error occurred: ', err))
      installExtension(REDUX_DEVTOOLS)
        .then(name => console.log(`Added Extension REDUX_DEVTOOLS:  ${name}`))
        .catch(err => console.log('An error occurred: ', err))
    }
    // }
  }

  // 主进程加载时的loading过渡，避免白屏
  windowLoading() {
    this.browserView = new BrowserView()

    this.mainWindow.setBrowserView(this.browserView)

    // 获取主窗口当前的大小，并将其赋值给蒙层，从而将窗口完全盖住
    const { width, height } = this.mainWindow.getContentBounds()
    this.browserView.setBounds({ x: 0, y: 0, width, height })

    this.browserView.webContents.loadURL(`file://${path.join(__dirname, 'loading.html')}`)

    this.browserView.webContents.on('dom-ready', () => {
      this.mainWindow.show()
    })
  }

  initEvents() {
    // 窗口关闭的监听
    if (process.platform === 'win32') {
      this.mainWindow.on('closed', () => {
        console.log('closed')
        this.mainWindow = null
      })

      this.mainWindow.on('close', e => {
        console.log('close:')
        if (!this.mainWindow) {
          return
        }
        // mac平台，左上角关闭窗口 = 隐藏窗口
        if (this.mainWindow['hide'] && this.mainWindow['setSkipTaskbar']) {
          this.mainWindow.hide()
          e.preventDefault()
          // this.mainWindow.setSkipTaskbar(true)
        }
      })
    } else {
      // this.mainWindow.on('closed', () => {
      //   console.log('closed')
      //   this.mainWindow = null
      //   app.quit()
      // })

      // this.mainWindow.on('close', e => {
      //   this.mainWindow = null
      //   app.quit()
      // })
      this.mainWindow.on('closed', () => {
        console.log('closed')
        this.mainWindow = null
      })

      this.mainWindow.on('close', e => {
        console.log('close:')
        if (!this.mainWindow) {
          return
        }
        // mac平台，左上角关闭窗口 = 隐藏窗口
        if (this.mainWindow['hide'] && this.mainWindow['setSkipTaskbar']) {
          this.mainWindow.hide()
          e.preventDefault()
          // this.mainWindow.setSkipTaskbar(true)
        }
      })
    }
    this.mainWindow.once('ready-to-show', () => {
      // 加入loading.html后, 此处updateHandle无效
      // 检查自动更新
      log.info('enter ready-to-show')
    })

    this.mainWindow.once('show', () => {
      log.info('enter show')
      // 检查自动更新
      isDevEnv || AppAutoUpdater.updateHandle(this.mainWindow)
      const stopCheckUpdate = store.get('stopCheckUpdate')
      if (stopCheckUpdate) {
        store.set('stopCheckUpdate', false) // 每次初始化，如果本地store stopCheckUpdate存在 则设置下次升级为否
      }
    })

    // 隐藏默认菜单
    this.mainWindow.webContents.once('did-finish-load', () => {
      // this.mainWindow.setMenuBarVisibility(false)
    })
  }

  destoryMainWindow() {
    this.mainWindow = null
  }

  removeView() {
    this.mainWindow.removeBrowserView(this.browserView)
    this.browserView = null
  }
}
