/* eslint-disable react-hooks/exhaustive-deps */
/**
 * 组件 componentDidMount 的时候不执行 useEffect 的方法
 * 只有依赖变化的时候会执行
 */
import { useRef, useEffect } from 'react'

export default function useDependencyEffect(effect: React.EffectCallback, dependencies: any[]) {
  const componentDidMount = useRef<boolean>(false)

  useEffect(() => {
    if (componentDidMount.current) {
      effect()
    }
  }, dependencies)

  /**
   * 必须放在最底下
   */
  useEffect(() => {
    componentDidMount.current = true
  }, [])
}
