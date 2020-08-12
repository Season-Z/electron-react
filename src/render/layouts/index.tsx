import React, { useState, useCallback, useEffect } from 'react'
import { Layout, message } from 'antd'
import { useLocation } from 'umi'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import Header from './header'
import SideMenu from './menu'
import MenuTab from '@components/MenuTab'
import ProgressModal from '@/components/ProgressModal'
import { debounce } from 'lodash'
import store from '@utils/ypStore'
import styles from './index.less'

const app = require('@utils/polyfill')('electron')
const { ipcRenderer: ipc } = app

const { Content, Sider } = Layout

const BasicLayout: React.FC = (props: any) => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [percent, setPercent] = useState<any>(0)
  const [timeStr, setTimeStr] = useState(new Date().getTime())
  const clickCollapse = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])
  const resizeFunc = useCallback(
    debounce(() => {
      setTimeStr(new Date().getTime())
    }, 400),
    []
  )
  const env = store.get('env') || 'prod'

  useEffect(() => {
    if (env !== 'prod') {
      return
    }
    window.addEventListener('resize', resizeFunc)
    return () => {
      window.removeEventListener('resize', resizeFunc)
    }
  }, [])
  useEffect(() => {
    // console.log('AppAutoUpdate_ipc', ipc)
    if (ipc) {
      // 进度条
      ipc.on('downloadProgress', (event: any, { percent }: any) => {
        console.log('downloadProgress:', percent)
        setPercent(parseInt(percent))
      })
      ipc.on('updateMessage', (event: any, text: any) => {
        if (text === '现在使用的已经是最新版本') {
          return
        }
        if (text.indexOf('ERROR') !== -1) {
          if (text.indexOf('ERR_CONNECTION_REFUSED') !== -1) {
            message.info('检查安装包更新: 获取服务器地址异常')
          } else {
            message.info(JSON.parse(JSON.stringify(text)))
          }
          return
        }
        message.info(JSON.parse(JSON.stringify(text)))
      })

      // 接收到主进程有新的版本已经下载完成，询问是否更新。
      ipc.on('isUpdateNow', () => {
        message.info('安装包下载完成!准备安装..')
        store.set('stopCheckUpdate', true)
        ipc.send('updateNow')
      })
    }
  }, [])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s4.cnzz.com/z_stat.php?id=1279092442&web_id=1279092442'
    document.body.appendChild(script)
    setTimeout(() => {
      let _czc = (window as any)._czc || []
      // 绑定siteid，请用您的siteid替换下方"XXXXXXXX"部分
      _czc.push(['_setAccount', '1279092442'])
    }, 500)
  }, [])

  const LayoutMain = (
    <Layout className={styles.container}>
      <ProgressModal percent={percent} />

      <Header collapsed={collapsed} clickCollapse={clickCollapse} />
      <Layout>
        {/* 左侧菜单 */}
        <Sider collapsed={collapsed}>
          <SideMenu />
        </Sider>
        <div
          className={styles.collapseHandle}
          onClick={clickCollapse}
          style={{ left: collapsed ? '80px' : '200px' }}
        >
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
          <div className={styles.collapseBackground}></div>
        </div>
        {/* 右侧 content */}
        <Layout>
          <MenuTab />
          <Content className={styles.content} key={timeStr}>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )

  const LayoutLogin = props.children

  const LayoutDict: any = {
    '/User/login': LayoutLogin
  }

  return LayoutDict[location.pathname] ? LayoutDict[location.pathname] : LayoutMain
}

export default BasicLayout
