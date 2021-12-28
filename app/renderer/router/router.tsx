import React from 'react'
import { RouteObject } from 'react-router-dom'

import Main from '@views/main'
import Contact from '@views/contact'
import NotFound from '@views/notFound'

const routers: RouteObject[] = [
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
  // { path: '*', element: <NotFound /> }
]

export default routers
