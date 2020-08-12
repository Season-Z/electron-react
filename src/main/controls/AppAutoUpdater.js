/**
 * 自动更新
 * https://www.electron.build/auto-update
 */


const { autoUpdater } = require('electron-updater')
const { ipcMain, app } = require('electron')
const log = require('electron-log');
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"
const isElectronDev = require('electron-is-dev')
const axios = require('axios').default;
const logRequest = require('ypsx-fe-log')
const path = require('path')
const fs = require('fs')
const AdmZip = require('adm-zip')
const Store = require('electron-store')

const store = new Store()

/**
 * 通过main进程发送事件给renderer进程，提示更新信息
 * @param {string} text
 * @param {object} mainWindow
 */
function sendUpdateMessage(text, mainWindow) {
  log.info('enter sendUpdateMessage', text);
  mainWindow.webContents.send('updateMessage', text)
}

/**
 * 全量更新操作
 * @param {object} mainWindow
 */
function updateHandle(mainWindow) {
  // let serverPackageInfo; // 服务器包信息
  // logRequest({ desc: 'updateHandle', tag: 'autoUpdater', deviceInfo: 'electron/ypshop' }).then( 远程日志
  //   (res) => {
  //     console.log('logRequestRes', res);
  //   },
  //   (rej) => {
  //     console.log('logRequestRej', rej);
  //   },
  // );
  // log.info('enter updateHandle')
  // log.info(`mainWindow： ${mainWindow}`)1

  if (process.platform === 'darwin') {
    // mac平台暂不支持更新
    return
  }
  autoUpdater.on('error', function (error) {
    // sendUpdateMessage(`ERROR: 检查更新出错:${error}`, mainWindow)
    console.error(`ERROR: 检查更新出错: ${error}`) // TODO: 远程日志记录
    // log.info('检查更新出错')
    store.set('stopCheckUpdate', true)
  });
  autoUpdater.on('checking-for-update', function () {
    log.info(`enter checking-for-update`)
    log.info(`正在检查更新…`)
    // sendUpdateMessage('正在检查更新…', mainWindow)
  });
  autoUpdater.on('update-available', function (UpdateInfo) {
    log.info('UpdateInfo', UpdateInfo)
    console.log(`update-available：${UpdateInfo}`)
    // sendUpdateMessage('检测到新版本，正在下载…', mainWindow)
  });
  autoUpdater.on('update-not-available', function (info) {
    log.info(`现在使用的已经是最新版本`)
    // sendUpdateMessage('现在使用的已经是最新版本', mainWindow)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj)
  });

  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    // 渲染层回复立即更新，则自动退出当前程序，然后进行程序更新
    ipcMain.on('updateNow', (e, arg) => {
      log.info('开始更新');
      autoUpdater.quitAndInstall(); // mac主动关闭窗口有问题
    });

    // 询问渲染层是否立即更新
    mainWindow.webContents.send('isUpdateNow')
  });


  /** 全量更新 - 服务器配置地址：yml */
  // if (isElectronDev) {
  //   autoUpdater.updateConfigPath = path.join(__dirname, 'app-local-update.yml') // 本地开发
  // } else {
  // }
  if (process.platform === 'win32') {
    autoUpdater.updateConfigPath = path.join(__dirname, 'app-win-update.yml') // 远程包配置-win
  } else {
    autoUpdater.updateConfigPath = path.join(__dirname, 'app-mac-update.yml') // 远程包配置-mac
  }


  /** 全量更新 通过electron-builder匹配服务器yml的version和本地比较，符合更新条件进入下一步更新流程 */
  ipcMain.on('checkAllUpdates', (e, msg) => {
    console.log('entercheckAllUpdates')
    if (isElectronDev) { // 本地开发仅支持checkForUpdates
      autoUpdater.checkForUpdates()
    }
    if (!isElectronDev) { // 安装包支持checkForUpdatesAndNotify通知
      autoUpdater.checkForUpdatesAndNotify()
    }
  })

  let localresourcePath = ``
  let resourcePath = ``
  let appZipPath = ``
  const remoteAppURL = 'https://ss1.ypshengxian.com/feassets/ypshop_setup/part_update/latest/app.zip'


  if (isElectronDev && process.platform === 'win32') { // windows 本地测试
    localresourcePath = `C:/Users/chen/AppData/Local/Programs/YPSHOP/resources/app`
    resourcePath = `C:/Users/chen/AppData/Local/Programs/YPSHOP/resources`
    appZipPath = `C:/Users/chen/AppData/Local/Programs/YPSHOP/resources/app.zip`
  }
  if (!isElectronDev && process.platform === 'win32') { // win平台
    localresourcePath = `./resources/app`
    resourcePath = `./resources`
    appZipPath = `./resources/app.zip`
  }
  if (!isElectronDev && process.platform === 'darwin') { // mac平台
    // if (isElectronDev && process.platform === 'darwin') { // mac平台 local test
    localresourcePath = `/Applications/YPSHOP.app/Contents/Resources/app`
    resourcePath = `/Applications/YPSHOP.app/Contents/Resources`
    appZipPath = `/Applications/YPSHOP.app/Contents/Resources/app.zip`
  }


  if (isElectronDev && process.platform === 'darwin') { // mac平台-本地开发测试
    // if (isElectronDev && process.platform === 'darwin') { // mac平台 local test
    localresourcePath = `/Applications/YPSHOP.app/Contents/Resources/app`
    resourcePath = `/Applications/YPSHOP.app/Contents/Resources`
    appZipPath = `/Applications/YPSHOP.app/Contents/Resources/app.zip`
  }

  axios.defaults.headers['Cache-Control'] = 'no-cache' // 添加去http缓存


  /** 增量更新 下载远程压缩包并写入指定文件 */
  function downloadFile(uri, filename) {
    const writer = fs.createWriteStream(filename)
    axios.get(uri, { responseType: 'stream' }).then(res => {
      res.data.pipe(writer);
    });
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  /** 增量更新 删除文件夹 */
  function deleteDirSync(dir) {
    let files = fs.readdirSync(dir)
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0;i < files.length;i++) {
      let newPath = path.join(dir, files[i]);
      let stat = fs.statSync(newPath)
      if (stat.isDirectory()) {
        // 如果是文件夹就递归下去
        deleteDirSync(newPath);
      } else {
        // 删除文件
        fs.unlinkSync(newPath);
      }
    }
    fs.rmdirSync(dir)// 如果文件夹是空的，删除自身
  }

  ipcMain.on('restartApp', async (e, msg) => {
    app.relaunch(); // 重启
    app.exit(0);
  })

  /** 增量更新 */
  ipcMain.on('checkForPartUpdates', async (e, msg) => {
    try {
      if (fs.existsSync(`${localresourcePath}.back`)) { // 删除旧备份
        deleteDirSync(`${localresourcePath}.back`)
      }
      if (fs.existsSync(localresourcePath)) {
        fs.renameSync(localresourcePath, `${localresourcePath}.back`); // 备份目录
      }
      await downloadFile(remoteAppURL, appZipPath)
      console.log('app.asar.unpacked.zip 下载完成')
      if (!fs.existsSync(`${localresourcePath}`)) { // 删除旧备份
        fs.mkdirSync(localresourcePath) // 创建app来解压用
      }
      try {
        // 同步解压缩
        const unzip = new AdmZip(appZipPath)
        unzip.extractAllTo(resourcePath, true)
        console.log('app.asar.unpacked.zip 解压缩完成')
        console.log('更新完成，正在重启...')
        mainWindow.webContents.send('partUpdateReady')
      } catch (error) {
        console.error(`extractAllToERROR: ${error}`);
      }
      console.log('webContents reload完成')
    } catch (error) {
      console.error(`checkForPartUpdatesERROR`, error)
      if (fs.existsSync(`${localresourcePath}.back`)) {
        fs.renameSync(`${localresourcePath}.back`, localresourcePath);
      }
    }
  })

}


/**
 * 自动更新 - 灰度版本控制 -  shopId请求需要数据：是否强更+强更版本号
 * {
 *  isNewestUpdate: true
 * }
 * @param {object} msg
 * @return {boolean}
 */
function handleGreyUpdate(msg) {
  const appVersion = app.getVersion()
  const updateUrl = msg.updateUrl; // 对应包的服务器地址
  // 强更指定版本：
  autoUpdater.setFeedURL(updateUrl);
  checkAllUpdates()
}



module.exports = {
  updateHandle,
}