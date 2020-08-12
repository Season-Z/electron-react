import React, { useEffect } from 'react'
import { Modal, Button } from 'antd'
import ypStore from '@utils/ypStore'
import { useHistory } from 'react-router-dom'
interface Props {
  visible: boolean
  hideModal: Function
}
const EnvModal = (props: Props) => {
  const envList = ['dev', 'test', 'sit', 'pre', 'prod']
  const history = useHistory()
  const setEnv = (item) => {
    ypStore.set('env', item)
    props.hideModal(2, item)
  }
  const hideModalFunc = (type) => {
    props.hideModal(type, null)
  }

  useEffect(() => {}, [])
  const { visible } = props
  return (
    <div>
      {visible ? (
        <Modal
          onCancel={() => {
            hideModalFunc(1)
          }}
          visible={visible}
          footer={null}
          title='设置接口环境'
        >
          {envList.map((item) => {
            return (
              <Button
                key={item}
                onClick={() => {
                  setEnv(item)
                }}
              >
                {item}
              </Button>
            )
          })}
        </Modal>
      ) : null}
    </div>
  )
}

export default EnvModal
