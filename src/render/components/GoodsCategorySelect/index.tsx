/**
 * 商品类目下拉框
 */

import React, { useState, useEffect, forwardRef } from 'react'
import { TreeSelect } from 'antd'
import ypRider from '../../utils/ypRequest'

import './index.less'
const { TreeNode } = TreeSelect

interface IProps {
  api?: string
  setCategoryId?: (categoryId: string) => void
  categoryId?: string
  /** 类目过滤 */
  categoryFilter?: (category: ITreeData) => ITreeData
  /** 当前ref */
  formRef?: any
}

export interface ITreeData {
  backCategoryName: string
  id: string
  backCategoryId: string
  status: number
  level: number
  childBackCategory: ITreeData[] | undefined
  checked?: boolean
}

export const GoodsCategorySelect = forwardRef((props: IProps, ref: any) => {
  const [treeData, setTreeData] = useState<ITreeData[]>([])

  const [curCategoryValue, setCurCategoryValue] = useState<any>()
  useEffect(() => {
    getTreeData()
  }, [])

  useEffect(() => {
    // console.log('formRefVal', props.formRef?.current.getFieldsValue());
    const val = props.formRef?.current.getFieldsValue()
    if (val && val['categoryId']) {
      setCurCategoryValue(val['categoryId'])
    }
  }, [props.formRef?.current])

  const getTreeData = async () => {
    const url = props.api || 'pms.backCategoryManage.getBackCategoryTree'
    const params = {}
    try {
      const res: any = await ypRider<ITreeData>(url, params)
      const { result, success } = res
      if (success) {
        const { childBackCategory = [] } =
          props.categoryFilter instanceof Function ? props.categoryFilter(result) : result
        setTreeData(childBackCategory)
      }
    } catch (err) {
      console.error(`getTreeDataERROR`, err)
    }
  }

  const renderTreeNode = (treeData: ITreeData[]) => {
    if (!treeData) return
    return treeData.map((item: ITreeData, key: number) => {
      if (item.childBackCategory) {
        return (
          <TreeNode
            value={item.backCategoryId}
            title={item.backCategoryName}
            key={item.backCategoryId}
          >
            {renderTreeNode(item.childBackCategory)}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode
            value={item.backCategoryId}
            title={item.backCategoryName}
            key={item.backCategoryId}
          />
        )
      }
    })
  }
  const onTreeChange = (id: any) => {
    setCurCategoryValue(id)
    if (props.setCategoryId) {
      // console.log('categoryId:', id);
      props.setCategoryId(id)
    }
  }

  useEffect(() => {
    // console.log('curCategoryValue', curCategoryValue);
  }, [curCategoryValue])

  return (
    <div id='my-tree-select'>
      <TreeSelect
        treeDataSimpleMode
        style={{ width: '100%' }}
        value={props.categoryId ? String(props.categoryId) : curCategoryValue}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder='请选择商品类目'
        onChange={onTreeChange}
        allowClear
      >
        {renderTreeNode(treeData)}
      </TreeSelect>
    </div>
  )
})

export default GoodsCategorySelect
