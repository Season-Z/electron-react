/**
 * 商家商品
 */
import React, { useCallback, useState } from 'react'
import { Modal } from 'antd'
import FormBuilder from '@components/FormBuilder'
import ScrollTable from '@components/ScrollTable'
import goodsFormfields from './formfields'
import shopColumns from './columns'
import { GoodsModalProps } from './interface'
import useMapping from '@/hooks/useMapping'

function GoodsModal(props: GoodsModalProps) {
  const [selectedRows, setSelectedRows] = useState([])
  const [searchParams, setSearchParams] = useState<any>({
    billType: props.billType,
    condition: { ...props.searchParams }
  })
  const { mappingList } = useMapping(5)
  const searchHandler = useCallback((state, values) => {
    for (let k in values) {
      if (!values[k]) {
        delete values[k]
      }
    }
    setSearchParams({
      ...searchParams,
      condition: {
        ...values,
        ...props.searchParams
      }
    })
  }, [])
  const rowSelectCallback = useCallback((keys, rows) => {
    setSelectedRows(rows)
  }, [])

  const handleOk = () => {
    props.saveModalCallback(selectedRows)
  }

  // useEffect(() => {
  //   console.log('searchParams', searchParams)
  //   setSearchParams(
  //     { billType: props.billType, condition: { ...props.searchParams, ...searchParams } }
  //   )
  // }, [searchParams])

  const handleReset = () => {
    setSearchParams({
      ...searchParams,
      condition: {
        ...props.searchParams
      }
    })
  }

  return (
    <Modal
      title={props.goodsModalOptions['title'] || '商家选择'}
      destroyOnClose
      maskClosable={false}
      width={1000}
      visible
      onOk={handleOk}
      onCancel={props.closeModalCallback}
    >
      <FormBuilder
        elements={props.GoodsModalFormElements || goodsFormfields(mappingList)}
        callbackHandler={searchHandler}
        onReset={handleReset}
      />
      <ScrollTable
        columns={props.columns ?? shopColumns}
        searchParams={searchParams}
        queryDataUrl='purchase.product.querySelectPlaceProductByCondition'
        rowSelectCallback={rowSelectCallback}
        pageSize={20}
        tableOptions={{
          rowSelection: {
            type: props.goodsModalOptions['rowSelectionType'] || 'radio'
          },
          scroll: { y: 350 }
        }}
      />
    </Modal>
  )
}

export default GoodsModal
