/**
 * 商品分类联动选择-平行的
 * 待完善 ---------
 */
import React from 'react'
import { Form, Select, message } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import api from '@/api/node-api'
import styles from './index.module.less'

/** 商品类目 */
export interface Category {
  categoryId: string // "10"
  categoryName: string // "生鲜部"
  deptLevelId: number // 1
  parentCategoryId: string // "0"
}

export interface IProps {
  form: FormInstance
  className?: string
}

const { Item } = Form
const { Option } = Select

const GoodsCategory: React.FC<IProps> = props => {
  const { form, className, ...omit } = props
  const { getFieldDecorator } = form
  const [categories, setCategories] = React.useState<Array<Array<Category>>>([])

  const getCategories = async (categoryId = null, idx = 0) => { // idx 点击位置
    const url = 'item.erpCategory.queryCategoryListByHeadId'
    const [err, res] = await api.post(url, { categoryId })
    if (err) {
      console.warn(err)
      message.error(err.message)
    } else {
      const data = res as Array<Category>
      let arr: Array<Array<Category>>
      if (categoryId === null) { // 顶级类目(全部类目为空时候)
        arr = [data]
      } else { // 重选某级类目
        arr = categories.filter((_, i) => i <= idx) // 裁剪掉后面的 select
        if (data.length) {
          arr = [...arr, data]
        }
      }
      setCategories(arr)
    }
  }

  const categoryChange = React.useCallback((cateId: any, idx: number) => {
    if (cateId) {
      getCategories(cateId, idx)
    } else { // 点击 Select 的清空按钮
      setCategories(categories.filter((_, i) => i <= idx)) // 裁剪掉后面的 select
    }
    const cates = form.getFieldValue('cates')
    cates[idx] = cateId
    form.resetFields([`cates[${idx + 1}]`]) // 重置子集
  }, [categories])

  const cateComp = categories.map((cates, i) => getFieldDecorator(`cates[${i}]`)(
    <Select
      allowClear
      className={[styles.selectItem, className].join(' ')}
      key={i}
      placeholder='请选择'
      onChange={val => categoryChange(val, i)}>
      {cates.map(cate => <Option
        title={cate.categoryId}
        key={cate.categoryId}
        value={cate.categoryId}>
        {cate.categoryName}
      </Option>)}
    </Select>
  ))

  React.useEffect(() => {
    getCategories()
  }, [])

  return (
    <Item label='商品分类' {...omit}>
      {cateComp}
    </Item>
  )
}

export default GoodsCategory
