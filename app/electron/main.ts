import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'
import { PROJECT_PATH } from '../../scripts/config/config'
const { NODE_ENV, port, host } = process.env

// 获取窗口的url
function getWinUrl() {
  if (NODE_ENV === 'development') {
    return `http://${host}:${port}`
  } else {
    return `file://${path.join(PROJECT_PATH, './dist/renderer/index.html')}`
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })

  const url = getWinUrl()
  mainWindow.loadURL(url)
  mainWindow.webContents.openDevTools()
  // mainWindow.webContents.openDevTools()
  // mainWindow.loadFile(url.format({
  //   pathname: path.join(PROJECT_PATH, './dist/renderer/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
