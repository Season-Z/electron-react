/**
 * 商家商品
 */
import React, { useCallback, useState, useEffect } from 'react'
import { Modal } from 'antd'
import FormBuilder from '@components/FormBuilder'
import ScrollTable from '@components/ScrollTable'
import useFormfields from './useFormfields'
import shopColumns from './columns'
import { GoodsModalProps } from './interface'

// billType:
// 采购订货(1),
// 采购退货(2),
// 仓间调拨(3),
// 店间调拨(4),
// 仓店配送(5),
// 要货集单(6),
// 退货集单(7);
const defaultFormItemLayout: any = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 }
  }
}

function GoodsModal(props: GoodsModalProps) {
  const [selectedRows, setSelectedRows] = useState([])
  const [searchParams, setSearchParams] = useState<any>(props.searchParams)

  const secondCategoryId = isNaN(+props.searchParams.condition.secondCategoryId)
    ? undefined
    : +props.searchParams.condition.secondCategoryId

  const formfields = useFormfields(secondCategoryId)

  const searchHandler = useCallback(
    (state, values) => {
      setSearchParams((v: any) => {
        return { condition: { ...v.condition, ...values } }
      })
    },
    [props.searchParams]
  )

  const propsSearchHandler = (state: any, values: any) => {
    const { curSelectCategoryId } = props.searchParams
    values['backCategoryId'] = curSelectCategoryId
    for (let k in values) {
      if (values[k] === '' || values[k] === undefined || values[k] === null) {
        // 过滤
        delete values[k]
      }
    }
    setSearchParams((v: any) => ({ ...values }))
  }

  const resetFields = useCallback(values => {
    setSearchParams((v: any) => {
      return { condition: { ...v.condition, ...values } }
    })
  }, [])

  const rowSelectCallback = useCallback((keys, rows) => {
    setSelectedRows(rows)
  }, [])

  const handleOk = () => {
    props.saveModalCallback(selectedRows)
  }

  useEffect(() => {
    console.log('searchParams', props.searchParams)
  }, [props.searchParams])

  return (
    <Modal
      title={props.title || '商品选择'}
      destroyOnClose
      maskClosable={false}
      width={1000}
      visible
      onOk={handleOk}
      onCancel={props.closeModalCallback}
    >
      <FormBuilder
        elements={props.GoodsModalFormElements || formfields}
        columns={3}
        callbackHandler={props.GoodsModalFormElements ? propsSearchHandler : searchHandler}
        onReset={resetFields}
        disableCache={true}
        formOptions={{ ...defaultFormItemLayout }}
      />
      <ScrollTable
        columns={props.columns ?? shopColumns}
        searchParams={searchParams}
        queryDataUrl={
          props.queryGoodsModalDataUrl || 'purchase.product.querySelectPlaceProductByCondition'
        } // 采购模块: 商家维度接口，不需要物流模式；
        tableOptions={{ ...props.tableOptions, scroll: { y: 400 }, rowKey: 'goodsId' }}
        rowSelectCallback={rowSelectCallback}
        // {...props.tableOptions}
      />
    </Modal>
  )
}

export default GoodsModal
