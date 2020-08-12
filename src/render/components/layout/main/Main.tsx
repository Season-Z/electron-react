import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Layout, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import MyMenu from '@components/layout/menu/Menu'
import MyHeader from '@components/layout/header/Header'
import MenuTab from '@components/layout/MenuTab'

import style from './main.less'

interface IProps {
  children: any
  location?: any
}

const { Content } = Layout

const Main = (props: IProps & RouteComponentProps) => {
  const { location } = props
  const isLoginPage = location.pathname === '/login'

  return (
    <ConfigProvider locale={zhCN}>
      {isLoginPage ? (
        <div className='mid'>{props.children}</div>
      ) : (
          <Layout style={{ minHeight: '100vh', display: 'flex' }}>
            <MyHeader />
            <Layout style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
              <MyMenu pathname={location.pathname} />
              <Layout style={{ padding: '24px 24px 0 24px', width: 0, flex: 1 }}>
                <MenuTab location={props.location} />
                <Content
                  className={`site-layout-background ${
                    props.location.pathname.match(/[/]/g).length < 4
                      ? 'layout-content-withTab'
                      : 'layout-content'
                    }`}
                >
                  <div className={style.contentChild}>{props.children}</div>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        )}
    </ConfigProvider>
  )
}

export default withRouter(Main)
