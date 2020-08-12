/**
 * 详情页面的头部文案的布局展示
 */
import React, { useState } from 'react'
import cls from 'classnames'
import './Style.normal.less'
import { Button, Modal } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import CommonTable from '@components/CommonTable'
interface IProps {
  title?: string
}

const ExportOffline = (props: IProps) => {
  // const {} = props

  const [visible, setVisible] = useState(false)
  const openFunc = () => {
    console.log(1234)
  }
  const onOkFunc = () => {
    console.log('onOkFunc')
  }
  const onCancelFunc = () => {
    setVisible(false)
  }
  const openModal = () => {
    setVisible(true)
  }
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'sCode',
      key: 'sCode',
      width: 100
    },

    {
      title: '导出时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      width: 130
    },
    {
      title: '操作人',
      dataIndex: 'status',
      key: 'status',
      width: 130
    },

    {
      title: '状态',
      dataIndex: 'status2',
      key: 'status2',
      width: 130,
      render: record => <div>状态</div>
    },

    {
      title: '操作',
      key: 'operation',
      width: 60,
      render: record => (
        <div>
          <span
            className={cls('curblue')}
            onClick={() => {
              console.log(12)
            }}
          >
            下载
          </span>
        </div>
      )
    }
  ]
  return (
    <div className={cls('exportOfferLineWrap')}>
      {visible ? (
        <Modal
          visible={visible}
          footer={null}
          title={props.title || '导出列表'}
          onOk={() => {
            onOkFunc()
          }}
          onCancel={() => {
            onCancelFunc()
          }}
        >
          <CommonTable
            // canSelect={false}
            showAlert={false}
            columns={columns}
            queryDataUrl='settlement.sheet.querySettlementSheets'
          />
        </Modal>
      ) : null}
      <Button
        type='primary'
        onClick={() => {
          openFunc()
        }}
      >
        <ExportOutlined />
        导出
      </Button>
      <Button
        style={{ marginLeft: 20 }}
        onClick={() => {
          openModal()
        }}
      >
        查看导出结果
      </Button>
    </div>
  )
}

export default ExportOffline
