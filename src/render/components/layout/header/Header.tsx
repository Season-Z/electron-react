// import React, { useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom'
// // import apis from '@api/'
// // import { connect } from 'react-redux'
// // import moment from 'moment'
// import { Button } from 'antd'
// import style from './header.less'
// import bgImg from '@images/nav-bg.jpg'
// import ypStore from '@utils/ypStore/'
// import ypEvent from '@utils/ypRequest/utils/event'

// const headerStyle = {
//   background: `url(${bgImg}) no-repeat`,
//   backgroundSize: 'cover'
// }

// const MyHeader = () => {
//   const history = useHistory()
//   const loginOut = () => {
//     ypStore.save('token', '')
//     history.push('/login')
//   }

//   useEffect(() => {
//     ypEvent.on('auth_error', () => {
//       history.push('/login')
//     })
//   }, [])
//   return (
//     <div className={style.header} style={headerStyle}>
//       <div className='logo'>
//         <img src='/logo.png' width='38' />
//         <h1>谊品</h1>
//       </div>
//       <Button onClick={loginOut} type='primary'>
//         退出
//       </Button>
//     </div>
//   )
// }

// export default MyHeader
