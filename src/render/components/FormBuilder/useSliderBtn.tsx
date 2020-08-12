/**
 * 搜索功能的Form表单 「收起展开」 功能
 */
import React, { useState, useEffect, useMemo } from 'react'
import { ColumnsType } from './interface'
import { twoColsMap } from './utils/constance'
import ypEvent from '@/utils/ypRequest/utils/event'
interface UseSliderBtnProps {
  formfields: any | any[]
  notSearchForm: boolean | undefined
  columns: ColumnsType | undefined
  openAll: boolean | undefined
}

const formfieldsLen = 7
// 默认收起时展示3个表单项
function useSliderBtn(props: UseSliderBtnProps) {
  const { formfields, notSearchForm, columns = formfieldsLen, openAll = false } = props

  const usefulFields = useMemo(() => formfields.filter(Boolean), [formfields])
  const twoColLength = useMemo(
    () =>
      usefulFields.reduce((pre: number, next: any, i: number) => {
        // 是否占据两行的表单项
        const isTwoCol = !!next.type && twoColsMap[next.type]
        // 是否默认要展示出来的
        const isShow = i < columns
        if (isTwoCol && isShow) {
          pre += 1
        }
        return pre
      }, 0),
    [usefulFields]
  )

  // 默认收起
  const [slideForm, setSlideForm] = useState(openAll)
  const [fields, setFields] = useState(usefulFields)

  const toggleForm = () => {
    setSlideForm(v => !v)
    ypEvent.emit('open_hide', slideForm)
  }
  useEffect(() => {
    if (!slideForm && !notSearchForm) {
      const list = usefulFields.map((v: any, k: number) => ({
        ...v,
        hide: v.hide ? v.hide : k >= columns - twoColLength
      }))
      setFields(list)
    } else {
      setFields(usefulFields)
    }
  }, [slideForm, usefulFields, columns, notSearchForm, twoColLength])

  // 如果表单项比较小
  if (usefulFields.length < columns) {
    return [fields, null]
  }

  return [
    fields,
    <a key='btn' style={{ minWidth: '30px' }} onClick={toggleForm}>
      {!slideForm ? '展开' : '收起'}
    </a>
  ]
}

export default useSliderBtn
