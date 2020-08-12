'use strict'
require('./menu')
const { app, ipcMain, globalShortcut } = require('electron')
const AppMainWindow = require('./controls/AppMainWindow')
const AppTray = require('./controls/AppTray')
const AppHelper = require('./controls/ElectronHelper')
const Store = require('electron-store')
const { downloadFile } = require('./utils/download')
const electronDev = require('electron-is-dev')
// const devTron = require('devtron')
const { ADDRESS_LOCAL, ADDRESS_PROD, CONST_ADDRESS_PROD } = require('./config/config')

const store = new Store()

app.allowRendererProcessReuse = true
app.name = '谊品门店管理系统'
class MainApp {
  constructor() {
    this.mainWindow = null
    this.printWindow = null
    this.tray = null
  }
  init() {
    this.initAppLife()
    this.initIPC()
  }
  // app 的生命周期
  initAppLife() {
    app.whenReady().then(() => {
      this.createMainWindow()

      if (!this.mainWindow) return

      if (process.platform === 'darwin') {
        let contents = this.mainWindow.webContents
        globalShortcut.register('CommandOrControl+C', () => {
          contents.copy()
        })
        globalShortcut.register('CommandOrControl+V', () => {
          contents.paste()
        })
        globalShortcut.register('CommandOrControl+X', () => {
          contents.cut()
        })
        globalShortcut.register('CommandOrControl+A', () => {
          contents.selectAll()
        })
      }
    })

    app.on('browser-window-blur', () => {
      globalShortcut.unregisterAll()
    })

    app.on('window-all-closed', () => {
      // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
      // 否则绝大部分应用及其菜单栏会保持激活。
      console.log('process.platform', process.platform)
      if (process.platform !== 'darwin') {
        console.log('quit')
        app.quit()
      }
    })

    app.on('before-quit', () => {
      console.log('before-quit')
      this.mainWindow.destoryMainWindow()
      if (this.printWindow) {
        this.printWindow.destoryPrintWindow()
      }
    })
  }
  // 所有的IPC通讯都放这边
  initIPC() {
    ipcMain.on('stop-loading-main', () => {
      this.mainWindow.removeView()
    })
    ipcMain.on('toggle-devtool', () => {
      this.mainWindow.webContents.toggleDevTools()
    })
    ipcMain.on('dispatch-dzc', this.dispatchDZC)
    // 新版electron在win7下的打印无效，已废弃，使用lodop
    // Clodop打印初始化，建立ipc连接，接送通知等待执行控件安装
    if (process.platform === 'win32') {
      ipcMain.on('execClodop', (event, obj) => {
        console.log('initPrint execClodop')
        AppHelper.execClodop()
          .then(e => {
            setTimeout(() => {
              app.relaunch()
              app.quit()
            }, 900)
          })
          .catch(e => {
            console.error(`execClodop:${e}`)
            // TODO: 日志记录
          })
      })
    }
    ipcMain.on('load-url', (event, { type, data }) => {
      if (type === 'get') {
        event.sender.send('load-url', { type, data: { ADDRESS_PROD, ADDRESS_LOCAL } })
      } else if (type === 'set') {
        store.set(CONST_ADDRESS_PROD, data)
        this.mainWindow.loadURL()
      }
    })

    ipcMain.handle('file-download', async (event, fileurl) => {
      const result = await downloadFile(fileurl)
      return result
    })
  }
  // 创建主进程的窗口
  createMainWindow() {
    this.mainWindow = new AppMainWindow()
    this.createTray()
    electronDev || this.singleApp()
  }
  // 创建小图标
  createTray() {
    this.tray = new AppTray(this.mainWindow)
  }
  // 单一启动实例 https://www.cnblogs.com/ybixian/p/11169027.html
  singleApp() {
    // 限制只可以打开一个应用, 4.x的文档
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
    } else {
      app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) this.mainWindow.restore()
          this.mainWindow.focus()
          this.mainWindow.show()
        }
      })
    }
  }
  // 下发电子称
  dispatchDZC(event, { type, host, file_path, dll_path }) {
    const sdk = require('./addons/aclas-sdk')
    sdk.runTask(
      {
        type: type === 'plu' ? 0x0000 : 0x0011, // PLU、条码
        filename: file_path,
        dll_path,
        host
      },
      function (json) {
        if (electronDev) {
          console.log(json)
        }
        event.sender.send('dispatch-dzc', json)
      }
    )
  }

}

new MainApp().init()
