import { EleProps } from '@components/FormBuilder'

export const getModalFields = (mappingList: Map<number, any>): EleProps[] => [
  // int64 merchantId = 1;
  // int64 goodsId = 2;
  // int64 placeId = 3;
  // string goodsBarCode = 4;
  // string plucode = 5;
  // string productName = 6;
  // string brandId = 7;
  // string brandName = 8;
  // int64 secondCategoryId = 9;
  // int32 logisticMode = 10;
  // bool withRealPrice = 11;
  // int32 firstCategoryId = 12;
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
