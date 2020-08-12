/**
 * electron 辅助工具集
 */
'use strict'

const path = require('path')
const { exec } = require('child_process');

/**
 * 执行打印组件安装程序
 */

const isElectronDev = require('electron-is-dev')


function execClodop() {
  // let exeUrl =``
  // let exeUrl = `${path.join(__dirname, '/public/lodop-print/CLodop_Setup_for_Win32NT.exe')}`
  // // if (isElectronDev) {
  // //   exeUrl = `${path.join(__dirname, '/public/lodop-print/CLodop_Setup_for_Win32NT.exe')}`
  // // } else {
  // //   exeUrl = `./resources/app/src/main/public/lodop-print/CLodop_Setup_for_Win32NT.exe'`
  // // }
  // // const exeUrl = `./resources/app/src/main/public/lodop-print/CLodop_Setup_for_Win32NT.exe'`
  // // const exeUrl = `${path.join(__dirname, '/public/lodop-print/CLodop_Setup_for_Win32NT.exe')}`
  // return new Promise((resolve, reject) => {
  //   exec(exeUrl, (error, stdout) => {
  //     if (error) {
  //       console.error(error);
  //       return reject(error);
  //     }
  //     console.log('initPrint stdout', stdout)
  //     return resolve(true);
  //   })
  // })
}

module.exports = {
  execClodop
}