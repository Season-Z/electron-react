/**
 * 商品列表
 */
import React, { useState, memo, useRef, forwardRef, useImperativeHandle } from 'react'
import { Button, message } from 'antd'
import _ from 'lodash'
import { PlusOutlined } from '@ant-design/icons'
import EditableTable from '@/components/EditableTable'
import GoodsModal from '@/components/GoodsModal'
// import { goodColumns } from './columns'
import { GoodsProps } from './interface'
import ypRider from '@utils/ypRequest'
// import { EditableTable } from 'yp-frontend-library'

function GoodEditableTable(props: GoodsProps, ref: any) {
  const { formData } = props
  const table: any = useRef()
  // 要更新的表格数据
  const [editTableData, setEditTableData] = useState<any>({})
  const [visible, setVisible] = useState(false)
  const [barCodeList, setBarCodeList] = useState([])

  const toggleGoodsModal = (bool: React.SetStateAction<boolean>) => {
    setVisible(bool)
  }
  const saveGoodModal = async (rows: any) => {
    await props.saveGoodsModal(rows)
    closeModal()
  }
  const closeModal = () => {
    setVisible(false)
  }
  // 处理商品编码的事件
  const handleGoodId = async (goodsId: string, currentRow: any) => {
    try {
      const params = {
        goodsId: +goodsId,
        merchantId: formData.merchantId
      }
      const res: any = await ypRider('purchase.product.queryBarcodeByProductId', params)
      const { success, result } = res
      if (success) {
        setBarCodeList(result.list)
        setEditTableData((v: any) => ({ ...v, ...currentRow }))
      }
    } catch (error) {
      message.error(error)
    }
  }
  // 处理商品条码的操作事件
  const handleGoodBarCode = async (code: string, currentRow: any) => {
    try {
      const params = {
        merchantId: +formData.merchantId,
        placeId: +formData.placeId,
        barcodeList: [code],
        withRealPrice: true,
        billType: +formData.orderDirect
      }
      // 获取商品数据
      const res: any = await ypRider('purchase.product.queryInsertPlaceProduct', params)
      if (res.success) {
        const { list } = res.result

        const rowData = {
          ...currentRow,
          ...list[0],
          goodsBarCode: code,
          categoryName: list[0].cate1Name,
          isGift: list[0].gift,
          orderSpecification: list[0].specification,
          orderSpecificationUnit: list[0].specUnit,
          taxRate: list[0].tax
        }
        // 更新表格数据
        setEditTableData(rowData)
      }
    } catch (error) {
      message.error(error)
    }
  }
  // 商品数据变化时
  const changeGoodsData = async (data: any, selected: any[]) => {
    const { currentCell, currentRow } = data

    if (_.isEmpty(currentCell)) {
      return
    }

    const goodsId = data.currentCell['goodsId']
    const barCode = data.currentCell['goodsBarCode']
    const unitPrice = data.currentCell['unitPrice']
    const goodsReqQty = data.currentCell['goodsReqQty']
    const amount = data.currentCell['amount']

    // 单元格是商品编码
    if (goodsId) {
      handleGoodId(goodsId, currentRow)
    }
    // 当前修改的单元格是商品条码时
    if (barCode) {
      handleGoodBarCode(barCode, currentRow)
    }
    // 单元格为单价和数量的时候，计算金额
    if (unitPrice || goodsReqQty) {
      const price = unitPrice ?? currentRow.unitPrice
      const qty = goodsReqQty ?? currentRow.goodsReqQty
      const amount = +price * +qty

      // 更新表格数据
      setEditTableData({ ...currentRow, amount })
    }
    // 单元格金额，计算单价
    if (amount) {
      const unitPrice = Math.floor((+amount / +currentRow.goodsReqQty) * 100) / 100
      // 更新表格数据
      setEditTableData({ ...currentRow, unitPrice })
    }
  }
  useImperativeHandle(ref, () => ({
    reflashTable: () => table.current.reflashTable()
  }))

  return (
    <>
      <div className='mTop16 mBottom16'>
        <Button
          type='primary'
          disabled={!props.canHandle}
          className='mRight16'
          icon={<PlusOutlined />}
          onClick={() => toggleGoodsModal(true)}
        >
          {props.addBtnText ?? '添加批发商品'}
        </Button>
        {props.btnElement}
      </div>
      <EditableTable
        ref={table}
        {...props}
        columns={props.columns}
        onChange={changeGoodsData}
        disableAddBtn={!props.canHandle}
        buttonTitle='添加商品行'
        canSelected
        tableOptions={{
          scroll: { x: 1400 }
        }}
      />
      {visible && <GoodsModal billType={props.billType} closeModalCallback={closeModal} saveModalCallback={saveGoodModal} />}
    </>
  )
}

export default memo(forwardRef(GoodEditableTable))
