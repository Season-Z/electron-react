import { EleProps } from '@components/FormBuilder'

interface ModalParamsProps {
  [x: string]: any
  condition: {
    merchantId: number | string
    placeId: number | string
    firstCategoryId: number | string
    secondCategoryId: number | string
    [x: string]: any
  }
}

export interface GoodsModalProps {
  formfields?: EleProps[]
  columns?: any[]
  saveModalCallback: (arg: any) => void
  closeModalCallback: () => void
  searchParams: ModalParamsProps // 查询列表的参数
  title?: string // modal标题
  tableOptions?: any
  queryGoodsModalDataUrl?: string
  GoodsModalFormElements?: any // 商品框表单elements
}
