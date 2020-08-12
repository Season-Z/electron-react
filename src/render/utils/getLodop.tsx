/**
 * 获取lodop控件
 */
import React from 'react'
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { ipcRenderer: ipc } = require('@utils/polyfill')('electron')

console.log('process.platform', process.platform);
if (process.platform === 'win32') { // 注意： 仅在electron项目控制，普通web无需
  // ====页面动态加载C-Lodop云打印必须的文件CLodopfuncs.js====
  let head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
  let oscript = document.createElement('script')
  // 让本机的浏览器打印(更优先一点)：
  oscript = document.createElement('script')
  oscript.src = 'http://localhost:8000/CLodopfuncs.js?priority=2'
  head.insertBefore(oscript, head.firstChild)
  // 加载双端口(8000和18000）避免其中某个端口被占用：
  oscript = document.createElement('script')
  oscript.src = 'http://localhost:18000/CLodopfuncs.js?priority=1'
  head.insertBefore(oscript, head.firstChild)
}


const { confirm } = Modal;

/**
 * 通知主进程安装控件
 */
function loadLodop() {
  ipc.send('execClodop')
}

/**
 * 获取Lodop对象
 */
function getLodop() {
  let LODOP
  try {
    // eslint-disable-next-line no-undef
    if (window.getCLodop) {
      LODOP = window.getCLodop() // 控件安装完会默认自动开启, 直接访问，不用修改不用调tslint
    }
    if (!LODOP && document.readyState !== 'complete') {
      message.info('C-Lodop打印控件还没准备好，请稍后再试或者重装控件！')
      // return
      throw 'C-Lodop打印控件还没准备好，请稍后再试或者重装控件！'
    }
    if (LODOP) {
      LODOP.SET_LICENSES("重庆谊品到家科技有限公司", "5D9B0FA6D7DEAA27349BB3B4177E3152454", "重慶誼品到家科技有限公司", "D2E9AA6901BB9815BD6B266D4BE551917E1");
      LODOP.SET_LICENSES("THIRD LICENSE", "", "Chongqing yipinjia Technology Co., Ltd", "708ACF3FA5B2CC480BDDDCF1F90C16232A0");
      return LODOP
    }
  } catch (err) {
    console.error(err)
    // confirm({
    //   title: '未找到打印控件，请安装打印控件！',
    //   content: `安装过程中请勾选默认项，是否开始确认安装？`,
    //   icon: <ExclamationCircleOutlined />,
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk() {
    //     loadLodop()
    //   },
    //   onCancel() {
    //     console.log('Cancel');
    //   },
    // });
  }
}

export default getLodop
