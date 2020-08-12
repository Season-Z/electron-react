/**
 * FixedBottomCps 底部固定DIV
 */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'

interface IPros {
  /** 是否有外部RE,否则默认暂时返回按钮 */
  outerRE?: React.ReactElement
}
const val = 200 // + 16 + 16
function FixedBottomCps(props: IPros) {
  const { outerRE } = props
  const history = useHistory()
  const clientWidth = document.body.offsetWidth - val // 除去left menu  width
  const [curWidth, setcurWidth] = useState<number>(clientWidth)

  const resizeFunc = () => {
    const w = document.body.offsetWidth - val
    setcurWidth(w)
  }

  useEffect(() => {
    window.addEventListener('resize', resizeFunc)
  }, [])

  return (
    <div>
      <div style={{ padding: '20px' }}></div>
      <div className='bottom-fixed' style={{ width: curWidth }}>
        {outerRE ? (
          outerRE
        ) : (
          <Button
            type='primary'
            onClick={() => {
              history.goBack()
            }}
            className='bottom-fixed-button'
          >
            返回
          </Button>
        )}
      </div>
    </div>
  )
}

export default FixedBottomCps
