import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Radio, Button, message } from 'antd'
import useA4Printer from './hooks/useA4Printer'

interface PrinterProps {
  getPrintData(): Promise<string[] | undefined> | string[] | undefined
  closeModalCallback(): void
}

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
  marginBottom: '5px'
}

export default function SelectPrinter(props: PrinterProps) {
  const { getPrintData, closeModalCallback } = props
  const [radioSelect, setRadioSelect] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const [printers, handlePrint]: any = useA4Printer()

  const onChange = (e: any) => {
    setRadioSelect(e.target.value)
  }

  const handlePrintData = useCallback(async () => {
    setLoading(true)
    const res: string[] | undefined = await getPrintData()
    setLoading(false)
    if (!res || !res.length) {
      message.error('没有需要打印的内容')
      return
    }

    if (handlePrint) {
      handlePrint(radioSelect, res)
    }
  }, [radioSelect])

  useEffect(() => {
    if (process.platform !== 'win32') {
      closeModalCallback()
    }
  }, [])

  return (
    <Modal
      title='可选择的打印机'
      destroyOnClose
      maskClosable={false}
      width={400}
      visible
      onOk={handlePrintData}
      onCancel={closeModalCallback}
      footer={[
        <Button
          type='primary'
          key='true'
          onClick={handlePrintData}
          disabled={!radioSelect}
          loading={loading}
        >
          确定
        </Button>,
        <Button onClick={closeModalCallback} key='cancel'>
          取消
        </Button>
      ]}
    >
      <Radio.Group onChange={onChange} value={radioSelect} buttonStyle='solid'>
        {printers &&
          printers.map((v: string) => (
            <Radio.Button key={v} style={radioStyle} value={v}>
              {v}
            </Radio.Button>
          ))}
      </Radio.Group>
    </Modal>
  )
}
