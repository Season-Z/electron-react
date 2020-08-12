/**
 * 采购 - 权限下的类目
 */
import React, { useState, useEffect } from 'react'
import { Cascader } from 'antd'
import { purchaseEnumConfig } from '@config/enums'
import useMapping from '@/hooks/useMapping'

interface IProps {
  onChange: any
  data: Array<string>
  deepLength?: number // 获取类目层级
  disabled?: boolean
}

export const PurchaseCategorySelect = (props: IProps) => {
  const { mappingList } = useMapping([purchaseEnumConfig['categoryCodeAll']])
  const { onChange, deepLength = 2 } = props
  const list =
    mappingList && mappingList['get'] ? mappingList.get(purchaseEnumConfig['categoryCodeAll']) : []
  const allCatArr: any[] = []
  if (list && list.length) {
    list.forEach((e: any) => {
      allCatArr.push({
        value: e.others.categoryId.toString(),
        label: e.others.categoryName,
        children:
          deepLength === 2
            ? exchangeObjToArrFor2(e.others.childCategoryList)
            : exchangeObjToArrFor4(e.others.childCategoryList)
      })
    })
  }

  useEffect(() => {
    console.log('props.value', props.data)
  }, [props.data])

  const [state, setstate] = useState([])

  const _onChange = (value: any, selectedOptions: any) => {
    setstate(value)
    const _val: any = {
      firstCategoryId: selectedOptions[0] ? selectedOptions[0].value : undefined,
      firstCategoryName: selectedOptions[0] ? selectedOptions[0].label : undefined,
      secondCategoryId: selectedOptions[1] ? selectedOptions[1].value : undefined,
      secondCategoryName: selectedOptions[1] ? selectedOptions[1].label : undefined,
      threeCategoryId: selectedOptions[2] ? selectedOptions[2].value : undefined,
      threeCategoryName: selectedOptions[2] ? selectedOptions[2].label : undefined,
      fourCategoryId: selectedOptions[3] ? selectedOptions[3].value : undefined,
      fourCategoryName: selectedOptions[3] ? selectedOptions[3].label : undefined
    }

    for (const i in _val) {
      if (!_val[i]) {
        delete _val[i]
      }
    }
    onChange(_val)
  }

  return (
    <Cascader
      disabled={props.disabled}
      options={allCatArr}
      onChange={_onChange}
      changeOnSelect
      value={state.length ? state : props.data}
    />
  )
}

/** 1001: {categoryId: 11001, categoryName: "干货类",} => [{value: 1001, label: '干货类'}] */
/**
 *
 * @param object 处理对象
 * @param deepLength 获取2层对象
 */
const exchangeObjToArrFor2 = (object: any) => {
  const arr: any = []
  if (Object.keys(object).length) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const _arr: any = {
          value: key.toString(),
          label: object[key]['categoryName']
        }
        if (object[key]['categorylevel'] < 3) {
          if (
            exchangeObjToArrFor2(object[key]['childCategoryList']) &&
            exchangeObjToArrFor2(object[key]['childCategoryList']).length
          ) {
            _arr['children'] = exchangeObjToArrFor2(object[key]['childCategoryList'])
          }
          arr.push(_arr)
        }
      }
    }
  }
  return arr
}

const exchangeObjToArrFor4 = (object: any) => {
  const arr: any = []
  if (Object.keys(object).length) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const _arr: any = {
          value: key.toString(),
          label: object[key]['categoryName']
        }
        if (
          exchangeObjToArrFor4(object[key]['childCategoryList']) &&
          exchangeObjToArrFor4(object[key]['childCategoryList']).length
        ) {
          _arr['children'] = exchangeObjToArrFor4(object[key]['childCategoryList'])
        }
        arr.push(_arr)
      }
    }
  }
  return arr
}
