import { EleProps } from '@components/FormBuilder'
import useMapping from '@/hooks/useMapping'

export default function useFormfields(secondCategoryId: string | number | undefined): EleProps[] {
  const { mappingList } = useMapping(5)

  return [
    {
      label: '编码/名称/plu码',
      name: 'queryCriteria',
      type: 'INPUT',
      fieldOptions: {
        placeholder: '编码/名称/PLU码'
      }
    },
    {
      label: '商品条码',
      name: 'goodsBarCode',
      type: 'INPUT',
      fieldOptions: {
        placeholder: '条码6位可模糊搜索'
      }
    },
    {
      label: '商品品类',
      name: 'secondCategoryId',
      type: 'SELECT',
      dataList: mappingList.get(5),
      initialValue: secondCategoryId === 0 || !secondCategoryId ? undefined : secondCategoryId,
      fieldOptions: {
        disabled: !!secondCategoryId
      }
    },
    {
      label: '品牌名称',
      name: 'brandName',
      type: 'INPUT'
    }
  ]
}
