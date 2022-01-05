import React from 'react'
import { HashRouter } from 'react-router-dom' // electron 打包必须要用hash路由，否则找不到路由
import { AppRoutes } from '@router/index'

const Entry = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}

export default Entry
