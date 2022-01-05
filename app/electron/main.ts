import { app } from 'electron'
import { createWindow } from './window/create-window'

const appLock = app.requestSingleInstanceLock()

if (!appLock) {
  // 作为第二个实例运行时, 主动结束进程
  app.quit()
}

app.on('second-instance', (event, commandLine, workingDirectory) => {
  // 当运行第二个实例时,将会聚焦到myWindow这个窗口
  // if (myWindow) {
  //   if (myWindow.isMinimized()) myWindow.restore()
  //   myWindow.focus()
  // }
  createWindow('Home')
})

app.on('ready', () => {
  // tray = creatAppTray()
  createWindow('Home')
})

app.on('activate', () => {
  if (process.platform == 'darwin') {
    createWindow('Home')
  }
})
