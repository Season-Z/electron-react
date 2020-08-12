/**
 * 作废功能，填写作废原因
 */
import React, { useRef } from 'react'
import { Modal } from 'antd'
import { FormBuilder } from 'yp-frontend-library'
import { EleProps } from 'yp-frontend-library/dist/components/FormBuilder'
import { CancelModalProps } from './interface'

const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}

function CancelModal(props: CancelModalProps) {
  const { params, title, formfields } = props
  const form: any = useRef()

  const handleOk = () => {
    const values = form.current.getFieldsValue()
    props.saveModalCallback({ ...values, purchaseOrderNo: params.purchaseOrderNo })
  }

  return (
    <Modal
      title={title ?? '作废'}
      destroyOnClose
      maskClosable={false}
      width={500}
      visible
      onOk={handleOk}
      onCancel={props.closeModalCallback}
    >
      <FormBuilder ref={form} elements={formfields as EleProps[]} notSearchForm formOptions={{ ...layout }} />
    </Modal>
  )
}

export default CancelModal
