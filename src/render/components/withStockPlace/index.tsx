/**
 * 包装 place 信息，提供仓库模块使用
 */
import React from 'react'
import { Spin } from 'antd'
// import { withRouter } from 'react-router-dom'
import { usePlace, IPlaceState } from '@/hooks/useStockPlace'
import styles from './index.less'

export interface PlaceProps {
  place: IPlaceState
  placeId: string
}

// export { IPlace } // webpack 警告

export function withPlace<P = {}>(Component: React.ComponentType<any>):
  React.ComponentType<P & PlaceProps> {
  const WithPlace: React.FC<P & PlaceProps> = function (props) {
    const [placeId, place] = usePlace()

    return place
      ? <Component {...props} placeId={placeId} place={place} />
      : <div className={styles.withOutPlace}>
        <Spin spinning={place === undefined}>
          <span>{place === null ? '该门店无地点信息，请联系管理员配置地点信息' : null}</span>
        </Spin>
      </div>
  }
  return WithPlace
}
