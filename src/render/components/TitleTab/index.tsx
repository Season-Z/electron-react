/**
 * 标题tab切换功能组件
 */
import React from 'react'
import classNames from 'classnames'
import styles from './Style.less'

interface DataProps {
  name: string
  title: string
}

interface TitleTabProps {
  activeKey: string // 默认高亮的数据
  data: DataProps[] // 标题数据
  clickTitleCallback: (arg: DataProps) => void // 点击标题切换的回调
}

function TitleTab(props: TitleTabProps) {
  const { activeKey, data, clickTitleCallback } = props

  return (
    <div className={styles.titleBar}>
      {data.map((val: DataProps) => {
        return (
          <div
            key={val.name}
            className={classNames(styles.titles, {
              [styles.active]: activeKey === val.name
            })}
            onClick={() => clickTitleCallback(val)}
          >
            <div>{val.title}</div>
          </div>
        )
      })}
    </div>
  )
}

export default TitleTab
