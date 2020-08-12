/**
 * 组件控制app更新
 */

import React, { useEffect, useState } from 'react'
import { Modal, message, Button, Progress } from 'antd'
import style from './style.less'

interface IProps {
  percent: any
}
const ProgressModal = (props: IProps) => {
  const { percent } = props

  useEffect(() => {
    // console.log(111, (percent === 0 || percent === 100))
  }, [percent]);
  const [visible, setvisible] = useState<boolean>(false)

  useEffect(() => {
    setvisible(!(percent === 0))
  }, [percent]);

  const closeModal = () => {
    setvisible(false)
  }

  return (
    <>
      <Modal
        title={'更新进度条'}
        maskClosable={true}
        width={500}
        // visible={!(percent === 0)}
        className={style.ProgressModal}
        visible={visible}
        footer={null}
      // onCancel={closeModal}
      >
        <div className='div-center'>
          <Progress
            type='circle'
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068'
            }}
            percent={percent}
          />
        </div>
      </Modal>
    </>
  )
}

export default ProgressModal
