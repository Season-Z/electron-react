import { EleProps } from '@components/FormBuilder'

const goodsFormfields = (mappingList: Map<number, any>): EleProps[] => [
  {
    label: '商品编码',
    name: 'goodsId',
    type: 'INPUT'
  },
  {
    label: '商品条码',
    name: 'goodsBarCode',
    type: 'INPUT'
  },
  {
    label: '商品PLU',
    name: 'plucode',
    type: 'INPUT'
  },
  {
    label: '商品名称',
    name: 'goodsName',
    type: 'INPUT'
  },
  {
    label: '商品品类',
    name: 'categoryName',
    type: 'SELECT',
    dataList: mappingList.get(5)
  },
  {
    label: '品牌名称',
    name: 'brandName',
    type: 'INPUT'
  }
  // {
  //   label: '品牌编码',
  //   name: 'brandId',
  //   type: 'INPUT'
  // }
]

export default goodsFormfields
