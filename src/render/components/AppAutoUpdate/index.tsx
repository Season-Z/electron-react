/**
 * 组件控制app更新
 */

import React, { useEffect, useState } from 'react'
import { Modal, message, Button, Progress } from 'antd'
import { checkForPartUpdates } from '@/utils/autoUpdate/partUpdate'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ProgressModal from '@/components/ProgressModal'
const app = require('@utils/polyfill')('electron')
import store from '@utils/ypStore'

const { confirm } = Modal
interface IProps {
  loading?: boolean
}

const { ipcRenderer: ipc, remote } = app
const appPkgVersion = remote.app.getVersion()
const AppAutoUpdate = (props: IProps) => {
  const [percent, setPercent] = useState<any>(0)
  // 模拟 自动更新
  // useEffect(() => {
  //   const container = document.getElementById('container')
  //   console.log('AppAutoUpdate_ipc', ipc)
  //   if (ipc) {
  //     ipc.on('updateMessage', (event: any, text: any) => {
  //       console.log('text', text)
  // if (text == '现在使用的已经是最新版本') {
  //   return
  // }
  //       if (text.indexOf('ERROR') !== -1) {
  //         if (text.indexOf('ERR_CONNECTION_REFUSED') !== -1) {
  //           message.info('获取服务器地址异常')
  //         } else {
  //           message.info(JSON.parse(JSON.stringify(text)))
  //         }
  //         return
  //       }
  //       message.info(JSON.parse(JSON.stringify(text)))
  //     })

  //     // 进度条
  //     // ipc.on('downloadProgress', (event: any, { percent }) => {
  //     //   console.log()
  //     //   setPercent(parseInt(percent))
  //     // })

  //     // 接收到主进程有新的版本已经下载完成，询问是否更新。
  //     ipc.on('isUpdateNow', () => {
  //       // confirm({
  //       //   title: '是否立即升级？',
  //       //   // cancelText: '下次提醒',
  //       //   onOk() {
  //       //     store.set('stopCheckUpdate', false)
  //       //     ipc.send('updateNow')
  //       //   },
  //       //   // onCancel() {
  //       //   //   store.set('stopCheckUpdate', true)
  //       //   //   console.log('update canceled')
  //       //   // }
  //       // })
  //       Modal.info({
  //         title: '已下载最新安装包,是否立即升级？',
  //         content: (
  //           <div>
  //             {/* <p>some messages...some messages...</p>
  //             <p>some messages...some messages...</p> */}
  //           </div>
  //         ),
  //         onOk() {
  //           store.set('stopCheckUpdate', false)
  //           ipc.send('updateNow')
  //         },
  //       });
  //     })
  //     // 增量更新准备
  //     ipc.on('partUpdateReady', () => {
  //       // message.success('发现更新完成，正在准备重启，请稍等...')
  //       confirm({
  //         title: '检测到更新',
  //         icon: <ExclamationCircleOutlined />,
  //         content: (
  //           <div>
  //             <p>是否更新?</p>
  //           </div>
  //         ),
  //         okText: '确认',
  //         cancelText: '取消',
  //         onOk() {
  //           setTimeout(() => {
  //             message.info('更新完成，正在准备重启，请稍等...')
  //           }, 1000);
  //           setTimeout(() => {
  //             ipc.send('restartApp')
  //           }, 2500);
  //         },
  //         onCancel() {
  //           console.log('Cancel')
  //         }
  //       })
  //     })

  //   }
  //   // }
  // }, [])

  const updateSpecifiedVersion = (v: string) => {
    const updateInfo = {
      // TODO: 接口返回
      isUpdate: true,
      // updateUrl: 'http://127.0.0.1:4002/download/'
      updateUrl: 'https://ss1.ypshengxian.com/feassets/ypshop_setup/' + v
    }
    ipc && updateInfo.isUpdate && ipc.send('checkAllUpdates', updateInfo) // 如果强更才发起通知
  }


  return (
    <div>
      <div>Version: {appPkgVersion}</div>
      {/* {window.isOpenAutoUpdate && <div id='container'>1</div>}
      {!window.isOpenAutoUpdate && ( */}
      <div>
        {/* <ProgressModal percent={percent} /> */}

        {/* { <Button type='primary' onClick={() => partUpdate()}>
            增量更新最新版本-latest
        </Button> */}
        {/* <Button type='primary' className='ml-2' onClick={() => { ipc && ipc.send('checkAllUpdates') }}>
          全量更新最新版本-latest
        </Button> */}
        {/* <Button type='primary' className='ml-2' onClick={() => updateSpecifiedVersion('ypshop_v0.1.5')}>
            全量更新指定版本-ypshop_v0.1.5
        </Button>  */}
      </div>
    </div>
  )
}

export default AppAutoUpdate
