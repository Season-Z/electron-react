import React, { useEffect, useRef, SFC } from 'react'
import { Select, Input, DatePicker, InputNumber } from 'antd'
import moment from 'moment'
import { FieldsProps } from '../interface'

const { RangePicker } = DatePicker

/**
 * 下拉框控件
 */
export const SELECT: SFC<FieldsProps> = props => {
  const { fieldOptions, dataList, fieldChange, fieldValue } = props

  return (
    <Select
      showSearch
      onBlur={() => fieldChange('')}
      dropdownMatchSelectWidth={false}
      value={fieldValue}
      filterOption={(input, option: any) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      {...fieldOptions}
      onChange={fieldChange}
      style={{ width: '100%' }}
    >
      {dataList.map((item: any) => {
        const { value, label } = item
        return (
          <Select.Option key={value} value={value} rows={item}>
            {label}
          </Select.Option>
        )
      })}
    </Select>
  )
}

/**
 * 输入框控件
 */
export const INPUT: SFC<FieldsProps> = props => {
  const { fieldOptions, fieldChange, editing, fieldValue } = props
  const inputRef: any = useRef()

  const save = (e: any) => {
    const val = e.target.value.replace(/(^\s*)|(\s*$)/g, '')
    fieldChange(val)
  }

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  return (
    <Input
      {...fieldOptions}
      ref={inputRef}
      defaultValue={fieldValue}
      onChange={undefined}
      onPressEnter={save}
      onBlur={save}
    />
  )
}

/**
 * 时间范围控件
 */
export const RANGE_PICKER: SFC<FieldsProps> = props => {
  const { fieldOptions, fieldChange, fieldValue } = props
  const format = fieldOptions?.fieldOptions || 'YYYY-MM-DD'

  const value = Array.isArray(fieldValue) ? fieldValue : []

  const defaultStart = fieldValue ? moment(value[0]) : undefined
  const defaultEnd = fieldValue ? moment(value[1]) : undefined

  const handleChange = (e: any[]) => {
    if (!e) {
      fieldChange(undefined)
      return
    }
    const value = Array.isArray(e) ? e : []
    const start = moment(value[0]).format(format)
    const end = moment(value[1]).format(format)

    fieldChange(`${start} ~ ${end}`)
  }

  return (
    <RangePicker
      allowClear
      autoFocus
      style={{ width: '100%' }}
      format={[format, format]}
      placeholder={['开始', '结束']}
      {...fieldOptions}
      defaultValue={[defaultStart, defaultEnd]}
      onChange={handleChange}
    />
  )
}

/**
 * 时间选择控件
 */
export const DATE_PICKER: SFC<FieldsProps> = props => {
  const { fieldOptions, fieldChange, fieldValue } = props
  const format = fieldOptions?.fieldOptions || 'YYYY-MM-DD'
  const defaultValue = fieldValue ? moment(fieldValue) : undefined

  const handleChange = (e: any) => {
    const data = moment(e).format(format)
    fieldChange(data)
  }

  return (
    <DatePicker
      allowClear
      autoFocus
      style={{ width: '100%' }}
      format={format}
      placeholder='请选择'
      {...fieldOptions}
      defaultValue={defaultValue}
      onBlur={() => fieldChange('')}
      onChange={handleChange}
    />
  )
}

/**
 * 数值控件
 */
export const INPUT_NUMBER: SFC<FieldsProps> = props => {
  const { fieldOptions, fieldChange, editing, fieldValue } = props
  const inputRef: any = useRef()

  const save = (e: any) => {
    const val = e.target.value
    fieldChange(val)
  }

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])
  return (
    <InputNumber
      style={{ width: '100%' }}
      {...fieldOptions}
      ref={inputRef}
      defaultValue={fieldValue}
      onChange={undefined}
      onPressEnter={save}
      onBlur={save}
    />
  )
}
// export const SELECT_INPUT_NUMBER = (props: FieldsProps) => {
//   const { fieldOptions, dataList, fieldChange, fieldValue } = props

//   return (
//     <AutoComplete
//       options={dataList}
//       allowClear
//       showSearch
//        value={fieldValue}
//       filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
//       {...fieldOptions}
//       onChange={fieldChange}
//     >
//       <InputNumber
//         placeholder='input here'
//         className='custom'
//         style={{ height: 50 }}
//         // onKeyPress={handleKeyPress}
//       />
//     </AutoComplete>
//   )
// }
