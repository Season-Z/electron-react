/**
 * 通用表单组件
 */
import React, { useMemo, useEffect, useState } from 'react'
import { Row, Col, Form, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import * as Fields2 from './components/Field'
import useSliderBtn from './useSliderBtn'
import useMediaAntdQuery from 'use-media-antd-query'
import {
  twoColsMap,
  trimWhitespaceFields,
  getValueInBlur,
  currentLayoutType
} from './utils/constance'
import {
  defaultLayout,
  normalColLayout,
  rangeColLayout,
  rangeFormLayout,
  fullColLayout
} from './utils/layouts'
import { FormBuilderProps, EleProps } from './interface'
import './index.less'
import { useSelector, useDispatch } from 'umi'

const { Item: FormItem } = Form
const Fields: any = Fields2

/**
 * 去除用户输入造成的前后空格
 * @param value 当前控件输入的值
 * @param element 用户传入的当前表单项的配置的属性
 */
function handleNormalize(value: any, type: string) {
  if (!trimWhitespaceFields.includes(type)) {
    return value
  }

  if (typeof value === 'number') {
    return value
  }
  if (value) {
    return value.replace(/(^\s*)|(\s*$)/g, '')
  }
}

const FormBuilder = (props: FormBuilderProps, ref: any) => {
  const [form] = Form.useForm()
  const mediaSize = useMediaAntdQuery()

  const formCache = useSelector((state: any) => state.formCache)
  const dispatch = useDispatch()

  // 根据传入的值，获取不同的布局栅格参数
  const layoutType = currentLayoutType[props.columns ?? 'default']

  // const [btnOffset, setBtnOffset] = useState(0)

  // 获取表单项list，以及搜索、重置按钮
  const [formfields, btnElement] = useSliderBtn({
    formfields: props.elements,
    notSearchForm: props.notSearchForm,
    columns: props.columns,
    openAll: props.openAll
  })

  // 表单验证完成
  const onFinish = (values: any) => {
    if (props.callbackHandler) {
      props.callbackHandler('success', { ...values })
    }
    if (!props.disableCache) {
      dispatch({
        type: 'formCache/save',
        payload: {
          [location.hash]: values
        }
      })
    }

    // setTimeout(()=>{
    //   console.log(formCache,location,form.getFieldsValue())
    // },1000)
  }
  // 表单验证失败
  const onFinishFailed = (errorInfo: any) => {
    if (props.callbackHandler) {
      props.callbackHandler('error', { ...errorInfo })
    }
  }

  // 重置表单
  const resetField = () => {
    const arr = props.elements.filter(ele => (ele.reset === undefined ? true : ele.reset))
    form.resetFields(arr.map(e => e.name))

    const values = form.getFieldsValue()
    if (props.onReset) {
      props.onReset({ ...values })
    }

    if (!props.disableCache) {
      dispatch({
        type: 'formCache/save',
        payload: {
          [location.hash]: values
        }
      })
    }
  }

  /**
   * 计算按钮的布局
   */
  const btnOffset = useMemo(() => {
    if (props.doNotCalculate) return 0
    const span = layoutType[mediaSize]
    // 计算一行展示多少个表单项
    const rowLength = 24 / span

    // 当按钮存在左侧内容时
    if (props.leftElement) {
      const offset = (rowLength - 1) * span
      return offset
    }
    const usefulFormfields = formfields.filter((v: any) => !v.hide)

    const twoColLength = usefulFormfields.filter((v: EleProps) => !!v.type && twoColsMap[v.type])
      .length
    // 求余数，传入的表单项数量与每行展示的数量的余数；最后一行展示的数量
    const remainder = (usefulFormfields.length + twoColLength) % rowLength
    const restLength = rowLength - remainder
    const offset = remainder === 0 ? (rowLength - 1) * span : (restLength - 1) * span

    return offset
  }, [mediaSize, props.leftElement, formfields, layoutType, props.doNotCalculate])

  // 表单排布，栅格布局渲染
  const renderLayout = (elements: any[]) => {
    return elements.map((ele, key) => {
      const { name, fieldtype, style, hide } = ele.props
      /**
       * 是否将本表单项设置为独占一行(row:24)的布局
       * 如果不是搜索表单且不是响应式表单，设置为每一项form占据一行
       */
      const shouldFull = props.notSearchForm && !props.responsed

      let colLayout = layoutType

      // 是否为特殊表单项，如：日期区间、多行文本输入
      if (twoColsMap[fieldtype]) {
        colLayout = rangeColLayout
      }
      // 暂时适配掉colLayout 个别页面用。
      if (props.defaultColLayout) {
        colLayout = props.defaultColLayout
      }

      // 是否占据一行展示
      if (shouldFull) {
        colLayout = fullColLayout
      }

      let fieldStyle = null
      // 如果设置了 display:none，或设置了hide属性
      if ((style && style.display === 'none') || hide === 'true') {
        fieldStyle = { display: 'none' }
      }

      return (
        <Col key={name + key} {...colLayout} style={fieldStyle} className='col-item'>
          {ele}
        </Col>
      )
    })
  }

  //  渲染表单项
  const renderElement = (element: any) => {
    // Handle form item props
    const label = element.tooltip ? (
      <span>
        {element.label}
        <Tooltip title={element.tooltip}>
          <QuestionCircleOutlined />
        </Tooltip>
      </span>
    ) : (
      element.label
    )

    // 设置校验的属性
    let rules = element.rules || []
    if (element.required) {
      rules = [
        ...rules,
        {
          required: true,
          message: `${element.label || element.key || element.id}不能为空.`
        }
      ]
    }

    // 校验时机
    const triggerInBlur: boolean = getValueInBlur.includes(element.type)

    const formItemProps = {
      name: element.name || element.id,
      colon: props.colon || false,
      label,
      rules,
      key: element.name || element.key,
      hide: element.hide ? element.hide.toString() : 'false',
      validateTrigger: triggerInBlur ? 'onBlur' : 'onChange',
      ...element.formItemProps,
      normalize: (val: any) => handleNormalize(val, element.type)
    }

    if (element.type) {
      const options = { ...element.fieldOptions, label }
      // 如果是特定的表单项(通过type判断)，设置特定的布局；如果是自定义的表单项则设置
      let formLayout = element.formItemLayout

      // 非查询功能表单，不设置特定的样式
      if (!props.notSearchForm) {
        formLayout = twoColsMap[element.type] ? rangeFormLayout : {}
      }

      return (
        <FormItem {...formItemProps} {...formLayout} fieldtype={element.type}>
          {Fields[element.type](options, element.dataList)}
        </FormItem>
      )
    }

    return <FormItem {...formItemProps}>{element.widget}</FormItem>
  }

  // 获取所有表单项的初始值
  const initialValues = useMemo(() => {
    return formfields.reduce((prev: any, next: any) => {
      if (!next) return prev

      return { ...prev, [next.name]: next.initialValue }
    }, {})
  }, [formfields])

  useEffect(() => {
    // 没有则忽略
    if (formCache[location.hash] && !props.disableCache) {
      form.setFieldsValue(formCache[location.hash] || initialValues)
      if (props.callbackHandler) {
        props.callbackHandler('success', { ...initialValues, ...formCache[location.hash] })
      }
    }
  }, [props.disableCache])

  // 设置不同模式的form布局
  const defaultFormLayout = useMemo(() => {
    const layout = props.formOptions?.layout || 'horizontal'
    return defaultLayout[layout]
  }, [props.formOptions?.layout])

  return (
    <div className='formBuilder'>
      <Form
        ref={ref}
        form={form}
        initialValues={props.defaultValues || initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={props.onChange}
        {...defaultFormLayout}
        {...props.formOptions}
      >
        <Row gutter={24}>
          {renderLayout(formfields.map(renderElement))}
          {props.notSearchForm ? null : (
            <Col
              span={8}
              key='button'
              offset={btnOffset}
              {...normalColLayout}
              style={props.doNotCalculate ? { flexGrow: 1, maxWidth: '100%' } : {}}
              className='col-item'
            >
              <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                {Fields['SEARCH_BUTTON'](resetField, props.leftElement, btnElement)}
              </FormItem>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  )
}

export { FormBuilderProps, EleProps, FormRefProps } from './interface'

export default React.forwardRef(FormBuilder)
