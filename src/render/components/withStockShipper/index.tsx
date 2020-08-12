/**
 * 包装 货主 信息，提供仓库模块使用
 */
import React from 'react'
import { Spin } from 'antd'
import { useShipper, IShipper, OPTIONS_ITEM } from '@/hooks/useStockShipper'
import { PlaceProps } from '@components/withStockPlace'
import styles from './index.less'

export interface ShipperProps extends PlaceProps {
  shippers: OPTIONS_ITEM[]
  shippers_raw: IShipper[]
}

export function withShipper<P = {}>(Component: React.ComponentType<any>):
  React.ComponentType<P & ShipperProps> {
  const WithShipper: React.FC<P & ShipperProps> = function (props) {
    const [shippers, shippers_raw, result] = useShipper(props.placeId)

    return shippers.length
      ? <Component {...props} shippers={shippers} shippers_raw={shippers_raw} />
      : <div className={styles.withShipper}>
        <Spin spinning={result === undefined}>
          <span>{result !== undefined && shippers.length === 0
            ? '该地点无货主信息，请联系管理员配置货主信息' : null}</span>
        </Spin>
      </div>
  }
  return WithShipper
}
