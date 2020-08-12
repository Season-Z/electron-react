import { EleProps } from '../FormBuilder'

export interface GoodsModalProps {
  formfields?: EleProps[]
  columns?: any[]
  saveModalCallback: (arg: any) => void
  closeModalCallback: () => void
  billType?: number // 单据类型
  searchParams?: any // 默认参数
  goodsModalOptions?: any // goodsModal Tableoptions
  GoodsModalFormElements?: any // 外部form
  pageSize?: number // 一页展示数据条数
}
