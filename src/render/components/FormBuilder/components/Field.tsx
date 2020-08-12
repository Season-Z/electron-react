import React from 'react'
import { Select, Input, DatePicker, Radio, Button, InputNumber, Checkbox, Row, Col } from 'antd'
import cls from 'classnames'
import { FieldOpsProps } from '../interface'
import '../index.less'

const { RangePicker } = DatePicker
const { TextArea } = Input

export const SEARCH_BUTTON = (resetField: any, leftElement: any, btnElement: any) => {
  return (
    <div className='optionBtns'>
      <div className='ellipsis'>{leftElement}</div>
      <Button
        type='primary'
        htmlType='submit'
        className={cls('mRight10', {
          mLeft16: !!leftElement
        })}
      >
        查询
      </Button>
      <Button onClick={resetField} className='mRight10'>
        重置
      </Button>
      {btnElement ? btnElement : null}
    </div>
  )
}

export const SELECT = (options: FieldOpsProps, dataSource: any[]) => {
  const { label, ...rest } = options
  const fieldOpts = {
    allowClear: true,
    showSearch: true,
    filterOption: (input: string, option: any) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    placeholder: `请选择${label}`,
    dropdownMatchSelectWidth: false,
    ...rest
  }
  return (
    <Select {...fieldOpts}>
      {dataSource &&
        dataSource.map(val => {
          return (
            <Select.Option key={val.value} value={val.value} rows={val}>
              {val.label}
            </Select.Option>
          )
        })}
    </Select>
  )
}
export const VirtualSelect = (options: FieldOpsProps, dataSource: any[] = []) => {
  const { label, ...rest } = options
  const fieldOpts = {
    allowClear: true,
    showSearch: true,
    filterOption: (input: string, option: any) =>
      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    placeholder: `请选择${label}`,
    dropdownMatchSelectWidth: false,
    ...rest
  }
  return <Select {...fieldOpts} options={dataSource}></Select>
}
export const INPUT = (options: FieldOpsProps) => {
  const { label, ...rest } = options
  return <Input placeholder={`请输入${label}`} allowClear {...rest} />
}

export const TEXTAREA = (options: FieldOpsProps) => {
  const { label, ...rest } = options
  return <TextArea placeholder={`请输入${label}`} allowClear autoSize {...rest} />
}

export const RANGE_PICKER = (options: FieldOpsProps) => {
  return <RangePicker allowClear style={{ width: '100%' }} {...options} />
}

export const DATE_PICKER = (options: FieldOpsProps) => {
  return <DatePicker style={{ width: '100%' }} {...options} />
}

export const RADIO = (options: FieldOpsProps, dataSource: any[]) => {
  return (
    <Radio.Group {...options}>
      {dataSource &&
        dataSource.map((val, key) => {
          const optKey = val.key ?? val.value ?? key
          return (
            <Radio value={optKey} key={optKey}>
              {val.label}
            </Radio>
          )
        })}
    </Radio.Group>
  )
}

export const INPUT_NUMBER = (options: FieldOpsProps) => {
  const { label, ...rest } = options

  return <InputNumber style={{ width: '100%' }} {...rest} />
}

export const CHECKBOX_GROUP = (options: FieldOpsProps, dataSource: any[]) => {
  return (
    <div>
      <Checkbox.Group>
        <Row>
          {dataSource &&
            dataSource.map((val, key) => {
              const optKey = val.key ?? val.value ?? key
              return (
                <Col key={optKey}>
                  <Checkbox value={optKey}>{val.label}</Checkbox>
                </Col>
              )
            })}
        </Row>
      </Checkbox.Group>
    </div>
  )
}

export const BRAND = (options: FieldOpsProps, dataSource: any[]) => {
  return (
    <div>
      <Checkbox.Group>
        <Row>
          {dataSource &&
            dataSource.map((val, key) => {
              const optKey = val.key ?? val.value ?? key
              return (
                <Col key={optKey}>
                  <Checkbox value={optKey}>{val.label}</Checkbox>
                </Col>
              )
            })}
        </Row>
      </Checkbox.Group>
    </div>
  )
}

export const RANGE_PICKER_SHORT = (options: FieldOpsProps) => {
  return (
    <RangePicker
      allowClear
      style={{ width: '100%' }}
      {...options}
      showTime={false}
      className='shortPangePicker'
      suffixIcon={null}
    />
  )
}
