import { EleProps } from '@components/FormBuilder'

const formfields: EleProps[] = [
  {
    label: '预约单号',
    name: 'suppName',
    initialValue: undefined,
    type: 'INPUT'
  },
  {
    label: '采购单号',
    name: 'purchaseOrderNo',
    initialValue: 123123,
    type: 'INPUT'
  },
  {
    label: '收货地',
    name: 'categoryName',
    initialValue: undefined,
    type: 'SELECT',
    dataList: [
      { value: '', label: '全部' },
      { value: '1', label: '进行中' },
      { value: '2', label: '未发布' },
      { value: '3', label: '已失效' },
      { value: '4', label: '已结束' }
    ]
  },
  {
    label: '预约送货日',
    name: 'placeName',
    initialValue: undefined,
    type: 'DATE_PICKER'
  },
  {
    label: '供应商',
    name: 'gmtCreate',
    initialValue: undefined,
    type: 'INPUT'
  },
  {
    label: '预约单状态',
    name: 'orderTypeName',
    initialValue: undefined,
    type: 'SELECT',
    dataList: [
      { value: '', label: '全部' },
      { value: '1', label: '进行中' },
      { value: '2', label: '未发布' },
      { value: '3', label: '已失效' },
      { value: '4', label: '已结束' }
    ]
  },
  {
    label: '预约类型',
    name: 'isStraight',
    initialValue: undefined,
    type: 'SELECT',
    dataList: [
      { value: '', label: '是' },
      { value: '1', label: '否' }
    ]
  }
]

export default formfields
