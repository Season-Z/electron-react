/**
 * 详情页面的头部文案的布局展示
 */
import React from 'react'
import cls from 'classnames'
import './Style.normal.less'

interface IProps {
  label: string
  text: string
  noBorder?: boolean
}

const TextLine = (props: IProps) => {
  const { text, label, noBorder = false } = props
  return (
    <div className={cls('titleLineWrap', { noBorder })}>
      <div className='fk'>{label}</div>
      <div className='wz'>{text}</div>
    </div>
  )
}

export default TextLine
