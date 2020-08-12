# FormBuilder

## 简介

1. `Form` 表单的响应式布局，支持`antd`的`Form`所有`API`
2. 传入 `json` 数组字符串可生成对应的表单项，目前支持：`Select`、`Input`、`TextArea`、`RangePicker`、`DatePicker` 和 `Radio` 等 `antd` 组件，可传入 `antd` 组件的原生 `API`
3. 可以自定义单个组件的栅格布局，自定义 `FormItem` 展示的组件内容
4. 涵盖大部分的业务场景

## 基本用法(查询功能)

```tsx
/**
 * title: 基本用法
 * desc: 查询功能。包含了：表单数据初始化、支持的各类控件、以及各种默认配置
 */
import React, { useEffect, useRef, useCallback } from 'react';
import { Select } from 'antd';
import dayjs from 'dayjs';
import FormBuilder from './index';

export default function() {
  const formfields = [
    {
      label: 'input',
      name: 'input',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {},
    },
    {
      label: 'select',
      name: 'select',
      type: 'SELECT',
      dataList: [
        // Select组件下拉框的值
        { value: '3', label: '已失效' },
        { value: '4', label: '已结束' },
      ],
      fieldOptions: {},
    },
    {
      label: 'range',
      name: 'range',
      type: 'RANGE_PICKER',
      fieldOptions: {
        // antd组件的原生api配置
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      label: 'date',
      name: 'date',
      type: 'DATE_PICKER',
      fieldOptions: {},
    },
  ];

  // 点击查询的回调
  const searchHandler = useCallback((status, values) => {
    console.log(status, values);
  }, []);

  const defaultValues = {
    input: 'input',
    select: '3',
    range: [dayjs('2020-04-26 17:00:00'), dayjs('2020-04-26 18:00:00')],
    date: dayjs('2020-04-28 18:00:00'),
  };

  return (
    <FormBuilder
      elements={formfields}
      gutter={24}
      colon={true}
      defaultValues={defaultValues}
      callbackHandler={searchHandler}
      // leftElement="hahah"
      // formOptions={{layout: 'vertical'}}
      // notSearchForm={true}    // false 就不是查询功能的表单(不展示查询、重置按钮)，而是新增、编辑功能
    />
  );
}
```

## 非查询的表单

```tsx
import React, { useState } from 'react';
import { Radio, Checkbox } from 'antd';
import FormBuilder from './index';

export default function() {
  const formfields = [
    {
      label: 'input',
      name: 'input',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {},
    },
    {
      label: 'select',
      name: 'select',
      type: 'SELECT',
      dataList: [
        // Select组件下拉框的值
        { value: '3', label: '已失效' },
        { value: '4', label: '已结束' },
      ],
      fieldOptions: {},
    },
    {
      label: 'range',
      name: 'range',
      type: 'RANGE_PICKER',
      fieldOptions: {
        // antd组件的原生api配置
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      label: 'date',
      name: 'date',
      type: 'DATE_PICKER',
      fieldOptions: {},
    },
    {
      label: 'textarea',
      name: 'textarea',
      type: 'TEXTAREA',
      fieldOptions: {},
    },
  ];

  const [layout, setLayout] = useState('horizontal');
  const [responsed, setResponsed] = useState(false);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Radio.Group
          value={layout}
          onChange={v => setLayout(v.target.value)}
          style={{ marginBottom: '16px' }}
        >
          <Radio.Button value="horizontal">horizontal</Radio.Button>
          <Radio.Button value="vertical">vertical</Radio.Button>
          <Radio.Button value="inline">inline</Radio.Button>
        </Radio.Group>
        <Checkbox
          checked={responsed}
          onChange={v => setResponsed(v.target.checked)}
        >
          是否响应式
        </Checkbox>
      </div>
      <FormBuilder
        elements={formfields}
        notSearchForm={true}
        responsed={responsed}
        formOptions={{
          layout,
          labelCol: {
            xs: { span: 6 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 14 },
            sm: { span: 14 },
          },
        }}
      />
    </div>
  );
}
```

## 业务里基本的联动操作

```tsx
/**
 * title: 业务里基本的联动操作
 * desc: 显示隐藏某个表单项，给某个表单项控件赋值
 */
import React, { useRef, useState, useCallback } from 'react';
import { Select } from 'antd';
import FormBuilder from './index';

export default function() {
  const formfields = [
    {
      label: 'name',
      name: 'name',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {},
    },
    {
      label: 'description',
      name: 'description',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {},
      hide: true, // 隐藏该表单项
    },
    {
      label: 'memo',
      name: 'memo',
      type: 'SELECT',
      dataList: [
        { value: '3', label: '已失效' },
        { value: '4', label: '已结束' },
      ],
      fieldOptions: {},
    },
  ];

  // 可通过ref 获取Form的实例
  // 可在父组件（引入FormBuilder的组件）内使用antd form组件的方法
  const form = useRef();
  const [fields, setFields] = useState(formfields);

  const changeForm = useCallback((field, allFields) => {
    // field:当前改变的表单项, allFields所有的表单数据
    // 也可通过匹配表单项字段名来触发异步请求的函数，动态渲染其他表单项(如Select组件的下拉数据)
    console.log(field, allFields);
    if (field['name']) {
      const list = fields.map(v => {
        if (v.name === 'description') {
          return Object.assign(v, { hide: false });
        }
        if (v.name === 'memo') {
          return Object.assign(v, { hide: true });
        }
        return v;
      });
      setFields(list);

      form.current?.setFieldsValue({
        description: 'hahaha',
      });
    }
  }, []);

  return <FormBuilder ref={form} elements={fields} onChange={changeForm} />;
}
```

## 自定义渲染表单项

```tsx
/**
 * title: 自定义渲染表单项
 * desc: 自定义渲染表单控件、设置表单项的布局、设置表单项的样式
 */
import React from 'react';
import { Input, Row, Col } from 'antd';
import FormBuilder from './index';

export default function() {
  const formfields = [
    {
      label: 'field',
      name: 'sssdffd',
      widget: (
        <Input.Group size="large">
          <Row gutter={8}>
            <Col span={10}>
              <Input />
            </Col>
            <Col span={14}>
              <Input />
            </Col>
          </Row>
        </Input.Group>
      ),
    },
    {
      label: 'field',
      name: 'test',
      type: 'INPUT',
      formItemLayout: {
        // 设置该属性
        labelCol: {
          xs: { span: 12 },
          sm: { span: 12 },
        },
        wrapperCol: {
          xs: { span: 12 },
          sm: { span: 12 },
        },
      },
      formItemProps: {
        style: { marginRight: '20px' },
      },
    },
  ];
  return <FormBuilder elements={formfields} />;
}
```

## API

#### FormBuilder

| 参数            | 说明                                                                               | 类型                            | 默认值 |
| :-------------- | :--------------------------------------------------------------------------------- | :------------------------------ | :----- |
| elements        | 展示的表单项 list                                                                  | EleProps[]                      | -      |
| gutter          | 表单项之的间距                                                                     | number?                         | -      |
| colon           | 标签前是否显示冒号                                                                 | boolean?                        | true   |
| leftElement     | 搜索按钮左侧的内容                                                                 | ReactNode、string?              | -      |
| callbackHandler | 点击查询时所有表单项值的回调                                                       | (string, any) => void?          | -      |
| notSearchForm   | 是否为查询表单(样式会存在区别)                                                     | boolean?                        | true   |
| responsed       | 是否为响应式的表单(用于 notSearchForm 为 true 的情况)                              | boolean?                        | false  |
| defaultValues   | 表单所有的默认值；对象格式，键为字段名，对应表单项的值；比如：{name: 'zhouxishun'} | object?                         | -      |
| onChange        | 改变表单项时触发事件，返回当前项和所有项的值                                       | (arg0: any, arg1: any) => void? | -      |
| onReset         | 重置表单的回调                                                                     | () => void?                     | -      |
| number          | 点击收起后展示的表单项数量(搜索功能的表单)                                         | number?                         | 4      |
| formOptions     | Antd 原生 Form 表单的配置信息                                                      | any?                            | -      |

#### EleProps[](传入的表单项参数)

| 参数           | 说明                                                                       | 类型            | 默认值                     |
| :------------- | :------------------------------------------------------------------------- | :-------------- | :------------------------- |
| name           | 控件的字段名                                                               | string          | -                          |
| label          | 控件名                                                                     | string?         | -                          |
| initialValue   | 控件的初始值                                                               | any?            | undefined                  |
| rules          | 控件的校验规则                                                             | []?             | -                          |
| required       | 控件是否必填                                                               | boolean?        | false                      |
| tooltip        | 控件 tooltip 提示的内容                                                    | string?         | -                          |
| widget         | 自定义渲染表单项                                                           | any?            | -                          |
| formItemProps  | antd 的 formItem 的属性；设置样式：formItemProps:{style: {display:'none'}} | object?         | -                          |
| formItemLayout | 控件单独的样式，自定义                                                     | any?            | -                          |
| type           | 组件类型                                                                   | 'SELECT'        | 'INPUT'                    | 'RANGE_PICKER' | 'DATE_PICKER' | 'TEXTAREA'? | undefined |
| dataList       | Select 和 Radio 的枚举数据                                                 | { value: number | string; label: string }[]? | - |
| hide           | 隐藏该表单项                                                               | boolean?        | false                      |
| fieldOptions   | Antd 的控件(Input、Select 等等)原生配置                                    | any?            | -                          |
