/**
 * 查看导出结果浮层
 */
import React, { useRef } from 'react'
import { Modal, message, Button } from 'antd'
import CommonTable from '../CommonTable'

interface IProps {
  businessType?: number
  closeModalCallback: () => void
}

function ExportModal(props: IProps) {
  const table: any = useRef()
  const searchParams = { businessType: props.businessType ?? 2 }

  const downloadFile = (url: string) => {
    if (!url) {
      message.error('不存在文件')
      return
    }
    window.location.href = url
  }

  const reloadTable = () => {
    table.current.reflashTable()
  }

  const columns = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 160
    },
    {
      title: '导出时间',
      dataIndex: 'exportTime',
      key: 'exportTime',
      width: 140
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 100
    },
    {
      title: '操作人',
      dataIndex: 'creator',
      key: 'creator',
      width: 120
    },
    {
      title: '操作',
      dataIndex: 'operateeee',
      key: 'operateeee',
      width: 100,
      render: (_: any, r: any) => {
        return r.status === 8 ? (
          <a onClick={() => downloadFile(r.downloadUrl)}>下载</a>
        ) : (
          <a onClick={reloadTable}>刷新</a>
        )
      }
    }
  ]
  return (
    <Modal
      title='查看导出结果'
      destroyOnClose
      maskClosable={false}
      width={800}
      visible
      onOk={props.closeModalCallback}
      onCancel={props.closeModalCallback}
      footer={<Button onClick={props.closeModalCallback}>关闭</Button>}
    >
      <CommonTable
        ref={table}
        searchParams={searchParams}
        columns={columns}
        queryDataUrl='purchase.export.getExportTaskList'
      />
    </Modal>
  )
}

export default ExportModal
