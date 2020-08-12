import React, { useMemo } from 'react'
import { Button, message, Modal } from 'antd'
import { enumPurchaseDownloadType } from '@/config/enums'
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useDispatch } from 'umi'
import Uploader from '@components/Uploader'
import ypRider from '@utils/ypRequest'

interface HandleBtnProps {
  table: any
  hasGoods: boolean // 商品信息
  canHandle?: boolean // 能否操作
  downloadType?: enumPurchaseDownloadType
  uploadUrl?: string
  clearUrl?: string
  uploadOptions: object
  clearOptions?: object
}

const UploadUrl = {
  [enumPurchaseDownloadType.PURCAHSE_PRE_TEMPLATE]: '',
  [enumPurchaseDownloadType.TRANSFER_PRE_CD]: 'purchase.require.importTransferPreProcessOrderLine', // （仓店配送&店仓返配）
  [enumPurchaseDownloadType.TRANSFER_PRE_CCDD]: 'purchase.require.importTransferPreProcessOrderLine',
  [enumPurchaseDownloadType.WHOLESALE_GOOD_TEMPLATE]: '',
  [enumPurchaseDownloadType.PURCHASE_GOODS_IMPORT_TEMPLATE]: '',
  [enumPurchaseDownloadType.PURCHASE_PREPROCESS_TEMPLATE]: '',
  [enumPurchaseDownloadType.TRANSFER_PREPROCESS_TEMPLATE]: 'purchase.require.importTransferPreProcessOrderLine',
  [enumPurchaseDownloadType.APPLY_REQUIRE_ORDER]: '',
  [enumPurchaseDownloadType.APPLY_RETURN_ORDER]: '',
  [enumPurchaseDownloadType.GOODS_WASTAGE_RATE_TEMPLATE]: '',
  [enumPurchaseDownloadType.GOODS_ADD_PRICE_TEMPLATE]: ''
}

const ClearUrl = {
  [enumPurchaseDownloadType.PURCAHSE_PRE_TEMPLATE]: '',
  [enumPurchaseDownloadType.TRANSFER_PRE_CD]: 'purchase.require.clearTransferPreProcessOrderLine', // （仓店配送&店仓返配）
  [enumPurchaseDownloadType.TRANSFER_PRE_CCDD]: 'purchase.require.clearTransferPreProcessOrderLine',
  [enumPurchaseDownloadType.WHOLESALE_GOOD_TEMPLATE]: '',
  [enumPurchaseDownloadType.PURCHASE_GOODS_IMPORT_TEMPLATE]: '',
  [enumPurchaseDownloadType.PURCHASE_PREPROCESS_TEMPLATE]: '',
  [enumPurchaseDownloadType.TRANSFER_PREPROCESS_TEMPLATE]: 'purchase.require.clearTransferPreProcessOrderLine',
  [enumPurchaseDownloadType.APPLY_REQUIRE_ORDER]: '',
  [enumPurchaseDownloadType.APPLY_RETURN_ORDER]: '',
  [enumPurchaseDownloadType.GOODS_WASTAGE_RATE_TEMPLATE]: '',
  [enumPurchaseDownloadType.GOODS_ADD_PRICE_TEMPLATE]: ''
}

export default function HandleBtn(props: HandleBtnProps) {
  const {
    table,
    canHandle,
    uploadUrl,
    clearUrl,
    uploadOptions,
    clearOptions,
    hasGoods,
    downloadType = enumPurchaseDownloadType.PURCAHSE_PRE_TEMPLATE
  } = props

  const myUploadUrl = useMemo(() => {
    return uploadUrl ? uploadUrl : UploadUrl[downloadType]
  }, [downloadType, uploadUrl])

  const myClearUrl = useMemo(() => {
    return clearUrl ? clearUrl : ClearUrl[downloadType]
  }, [downloadType, clearUrl])

  const dispatch = useDispatch()
  // 能否上传：没有商品数据，存在调拨单id
  const canUpload = !hasGoods && canHandle

  // 下载模板
  const downloadTemplate = async () => {
    try {
      await dispatch({
        type: 'purchase/downloadGoodsTemplate',
        payload: { downloadType }
      })
    } catch (error) {
      message.error(error)
    }
  }

  const changeUpload = async (val: any) => {
    try {
      const params = {
        resId: val[0].files,
        ...uploadOptions
      }
      const res: any = await ypRider(myUploadUrl, params)
      if (res.success) {
        message.success('上传成功')
        table.reflashTable()
      }
    } catch (error) {
      message.error(error)
    }
  }

  //  清空商品
  const clearGood = async () => {

    try {
      const res: any = await ypRider(myClearUrl, clearOptions||uploadOptions)
      if (res.success) {
        table.reflashTable()
        message.success('清空商品成功')
      }
    } catch (error) {
      message.error(error)
    }
  }

  const confirmModal = () => {
    Modal.confirm({
      title: '清空商品',
      icon: <ExclamationCircleOutlined />,
      content: '确认清空全部商品吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        clearGood()
      }
    })
  }

  return (
    <>
      <span style={{ marginRight: '16px' }} key='upload'>
        <Uploader
          tokenParams={{}}
          onChange={changeUpload}
          btnText='导入excel商品'
          uploadOptions={{ showUploadList: false, disabled: !canUpload }}
        />
      </span>
      <Button className='mRight16' disabled={!canHandle} onClick={downloadTemplate} icon={<DownloadOutlined />} key='download'>
        下载excel模板
      </Button>
      <Button onClick={confirmModal} key='clean' disabled={!hasGoods}>
        清空商品
      </Button>
    </>
  )
}
