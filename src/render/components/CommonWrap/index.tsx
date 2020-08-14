import React, { useEffect, useState } from 'react'
import Bowser from 'bowser'
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
