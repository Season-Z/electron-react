import { ReactNode } from 'react'
import { PageEditableTableProps } from '../EditableTable/interface'

export interface GoodsProps extends PageEditableTableProps {
  // columns: any[]
  btnElement: ReactNode | string // 按钮区域
  addBtnText?: string // 新增按钮的文案
  saveGoodsModal: (arg: any) => void | Promise<any>
  canHandle?: boolean // 能否对商品进行操作
  billType?: number // 单据类型
  goodsModalSearchParams?: any // goodsModal必填参数
  // formData: any // 表单内容
  goodsModalOptions?: any // goodsModal Tableoptions
  GoodsModalFormElements?: any // 外部form
  goodsModalPageSize?: number
}
