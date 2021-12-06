import React from 'react'
import { useRoutes } from 'react-router'
import Main from '../views/main'
import Contact from '../views/contact'
import NotFound from '../views/notFound'

function AppRoutes() {
  const element = useRoutes([
    { path: '/', element: <Main /> },
    { path: '/contact', element: <Contact /> },
    // { path: 'invoices',
    //   element: <Invoices />,
    //   children: [
    //     { path: ':id', element: <Invoice /> },
    //     { path: 'sent', element: <SentInvoices /> }
    //   ]
    // },
    // 404找不到
    { path: '*', element: <NotFound /> }
  ])
  return element
}

export default AppRoutes
