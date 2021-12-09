import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@router/index'

const Entry = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default Entry
