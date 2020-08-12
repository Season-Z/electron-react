import { useState, useEffect, useRef } from 'react'

/**
 * 滑动加载
 */
export function useScrollLoad(callback = (bool: boolean) => {}) {
  const [container, setContainer] = useState<any>()
  const ref_state = useRef(false)
  const ref_last = useRef(ref_state.current)

  const tableBodyDivScroll = (ev: any) => {
    const bodyDivRect = ev.target.getBoundingClientRect()
    const tableRect = ev.target.getElementsByTagName('table')[0].getBoundingClientRect()
    const scrollBarHeight = 7 // global.less 中设置的滚动条厚度 7px
    const THRESHOLD = 34 // 触发阈值 (row高度)

    ref_state.current = tableRect.bottom + scrollBarHeight - bodyDivRect.bottom < THRESHOLD
    if (ref_state.current !== ref_last.current) {
      callback((ref_last.current = ref_state.current))
      // console.log(ref_last.current ? '触底' : '离开')
    }
  }

  useEffect(() => {
    let destroy = () => {}
    if (!(container instanceof HTMLElement)) return
    const tableContainer = container.getElementsByClassName('ant-table-container')[0]
    if (!(tableContainer instanceof HTMLElement)) return

    const handle = new MutationObserver(function() {
      const tableBody = container.getElementsByClassName('ant-table-body')[0]
      if (!(tableBody instanceof HTMLElement)) return
      tableBody.addEventListener('scroll', tableBodyDivScroll)

      destroy = () => {
        handle.disconnect()
        tableBody.removeEventListener('scroll', tableBodyDivScroll)
      }
    })
    handle.observe(tableContainer, { childList: true, subtree: true })

    return destroy
  }, [container])

  return [setContainer]
}
