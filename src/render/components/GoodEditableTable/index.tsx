/**
 * 商品列表
 */
import React, { useState, memo, useRef, forwardRef, useImperativeHandle } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import EditableTable from '@/components/EditableTable'
import GoodsModal from '@/components/GoodsModal'
// import { goodColumns } from './columns'
import { GoodsProps } from './interface'
// import { EditableTable } from 'yp-frontend-library'

function GoodEditableTable(props: GoodsProps, ref: any) {
  const table: any = useRef()
  const [visible, setVisible] = useState(false)

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
        hideBtn={props.hideBtn}
        hideDeleteBtn={props.hideDeleteBtn}
        ref={table}
        {...props}
        columns={props.columns}
        disableAddBtn={!props.canHandle}
        buttonTitle='添加商品行'
        canSelected={props.canSelected ?? true}
        scrollYSize={510}
        tableOptions={{
          scroll: { x: 1400, y: 450 }
        }}
      />
      {visible && (
        <GoodsModal
          GoodsModalFormElements={props.GoodsModalFormElements}
          goodsModalOptions={props.goodsModalOptions}
          pageSize={props.goodsModalPageSize}
          searchParams={props.goodsModalSearchParams}
          billType={props.billType}
          closeModalCallback={closeModal}
          saveModalCallback={saveGoodModal}
        />
      )}
    </>
  )
}

export default memo(forwardRef(GoodEditableTable))
