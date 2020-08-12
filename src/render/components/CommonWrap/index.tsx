import React, { useEffect, useState } from 'react'
import Bowser from 'bowser'
import { SHOP_CURRENT } from '@config/constant'
import ypEvent from '@/utils/ypRequest/utils/event'
import ypStore from '@/utils/ypStore/'
import moment from 'moment'
import { values } from 'lodash'
const browser = Bowser.getParser(window.navigator.userAgent)
interface IProps {
  id: string
  type: number
  children: any
  cls?: string
}

const CommonWrap = (props: IProps) => {
  const { cls } = props
  // const [flag, setFlag] = useState(true)
  useEffect(() => {
    const logFlag = sessionStorage.getItem('logFlag')
    if (!logFlag) {
      const env = ypStore.get('env') || 'prod'
      const shopInfo = ypStore.get(SHOP_CURRENT)
      const employee = ypStore.get('employee')
      const token = ypStore.get('token')
      const clientWidth = document.body.clientWidth
      const clientHeight = document.body.clientHeight
      const screenHeight = window.screen.height
      const screenWidth = window.screen.width
      sessionStorage.setItem('logFlag', '1')
      if (token && shopInfo && employee && employee.phone) {
        const OSVAL = `${browser.getOS().name}-${browser.getOS().versionName}-${
          browser.getOS().version
        }`
        const msg2 = `${shopInfo.name}门店员工-${employee.relName}-${
          employee.phone
        }在${moment().format(
          'YYYY-MM-DD HH:mm:ss'
        )}用${OSVAL}打开系统，,网页可见区域${clientWidth}*${clientHeight},屏幕分辨率${screenWidth}*${screenHeight}`
        if (env === 'prod') {
          ;(window as any)._czc.push(['_trackEvent', '每日记录', '信息', msg2])
        }
      }
    }
    // ypEvent.on('open_hide', values => {
    //   setFlag(values)
    // })
    // return () => {
    //   cleanup
    // }
  }, [])
  return (
    <div
      className={`commonWrap ${cls}`}
      id={props.id}
      // style={{ overflow: flag ? 'hidden' : 'hidden scroll' }}
    >
      {props.children}
    </div>
  )
}

CommonWrap.defaultProps = {
  type: 1,
  id: 1
}
export default CommonWrap
