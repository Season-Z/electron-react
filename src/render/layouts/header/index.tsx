import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { history, useDispatch } from 'umi'
import { ipcRenderer } from 'electron'
import { Layout, Button, Modal, Alert, Input } from 'antd'
import {
  ReloadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HomeOutlined
} from '@ant-design/icons'
import ypStore from '@utils/ypStore/'
import './index.less'

const isDev = process.env.NODE_ENV === 'development'

export interface IProps {
  clickCollapse: () => void
  collapsed: boolean
}

const { Header } = Layout

const headerProps = {
  style: {
    backgroundImage: `url(${require('@/assets/image/nav-bg.jpg')})`,
    backgroundSize: 'cover',
    color: 'white'
  }
}

const HeaderComponent: React.FC<IProps> = () => {
  const dispatch = useDispatch()
  const [address, setAddress] = useState<{ ADDRESS_PROD: string; ADDRESS_LOCAL: string }>({} as any)
  const [inputAddr, setInputAddr] = useState<string>()
  const [visibleAddr, setVisibleAddr] = useState(false)

  const href = useMemo(() => {
    let url: string = location.href.replace(location.origin, '')
    const tmp = location.href.split('#')
    if (tmp[1]) url = tmp[1]
    return url
  }, [location.href])

  const LoginOutFunc = useCallback(() => {
    history.replace('/User/login')
    dispatch({ type: 'global/shop', shop: null })
  }, [])

  useEffect(() => {
    const handle = ipcRenderer.on('load-url', (event, { type, data }: any) => {
      if (type === 'get') {
        setAddress(data)
      }
    })
    return () => {
      handle.removeAllListeners('load-url')
    }
  }, [])

  const devtool = (
    <div className='header-devtool'>
      <div className='btn-group'>
        <HomeOutlined onClick={() => history.replace('/')} />
        <ArrowLeftOutlined onClick={() => history.goBack()} />
        <ArrowRightOutlined onClick={() => history.goForward()} />
        <ReloadOutlined onClick={() => window.location.reload(true)} />
      </div>
      <div className='href ml-2 mr-2'>{href}</div>
    </div>
  )

  return (
    <Header {...headerProps} className='layout-top-eader'>
      <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex flex-fill' style={{ width: 0 }}>
          {isDev || devtool ? devtool : null}
        </div>
        <div className='d-flex align-items-center'>
          <span className='mr-2'>{ypStore.get('employee')?.relName ?? '-'}</span>
          <Button type='primary' className='mr-2' onClick={LoginOutFunc}>
            退出
          </Button>
        </div>
        {visibleAddr && (
          <Modal
            title='切换远程地址'
            visible={visibleAddr}
            onCancel={() => setVisibleAddr(false)}
            width={900}
            onOk={() => {
              let url = address.ADDRESS_PROD
              if (inputAddr) {
                url = inputAddr.trim()
              }
              ipcRenderer.send('load-url', { type: 'set', data: url ?? address.ADDRESS_PROD })
            }}
          >
            <Alert type='warning' message='请谨慎操作，错误地址会导致软件崩溃' />
            <div className='m-2'>本地地址：{address.ADDRESS_LOCAL}</div>
            <div className='m-2'>当前地址：{address.ADDRESS_PROD}</div>
            <hr />
            <Input
              placeholder='请输入远程地址'
              value={inputAddr}
              onChange={ev => setInputAddr(ev.target.value)}
            />
          </Modal>
        )}
      </div>
    </Header>
  )
}

export default HeaderComponent
