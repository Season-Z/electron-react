# EditableTable

#### 基本功能

1. 可以实现 `Antd` 的 `Table` 组件的编辑功能，每次编辑后都会返回表格及本行的数据
2. 目前表格编辑的组件配置了：`Select`、`Input`、`DatePicker`和`RangePicker`，且都能传入`antd`组件的一些原生`API`
3. `columns`里设置`editable`可设置为可编辑单元格，默认为`Input`输入框。如果设置了`type`属性，可以不用设置`editable`属性
4. 不支持分页功能

## 基本用法

```tsx
/**
 * title: 基本用法
 * desc: 设置表单项的布局、设置表单项的样式
 */
import React from 'react';
import EditableTable from './index';

export default function() {
  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      type: 'SELECT', // 表格编辑要展示组件类型
      dataList: [
        // 下拉框的数据
        { value: '3', label: '已失效' },
        { value: '4', label: '已结束' },
      ],
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      editable: true, // 编辑的单元格，带上这个属性默认表示Input输入框
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      type: 'INPUT_NUMBER',
    },
  ];

  const changeEditableTable = data => {
    console.log(data);
  };

  const dataSource = [
    {
      status: '3',
      name: 'test',
      count: 23,
    },
  ];

  return (
    <EditableTable
      columns={columns}
      dataSource={dataSource}
      onChange={changeEditableTable}
      buttonTitle="添加商品行"
      tableOptions={{}}
    />
  );
}
```

## 联动功能

```tsx
/**
 * title: 联动功能
 * desc: 修改某个单元格的值，修改其他单元格的值或者下拉框数据
 */
import React, { useState } from 'react';
import EditableTable from './index';

export default function() {
  const [dataSource, setDataSource] = useState([
    {
      status: '3',
      name: 'test',
      count: 23,
    },
  ]);
  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      type: 'SELECT', // 表格编辑要展示组件类型
      dataList: [
        { value: '3', label: '已失效' },
        { value: '4', label: '已结束' },
      ],
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      editable: true,
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      type: 'INPUT_NUMBER',
    },
  ];

  const changeEditableTable = (data, list, key) => {
    console.log(data, list);
    if (data['status']) {
      const arr = list.map(v => {
        if (v.key === key) {
          v.name = 'new value';
        }
        return v;
      });
      setDataSource(arr);
    }
  };

  return (
    <EditableTable
      columns={columns}
      dataSource={dataSource}
      onChange={changeEditableTable}
      buttonTitle="添加商品行"
      tableOptions={{}}
    />
  );
}
```

## API

#### EditableTableProps

| 参数         | 说明                                                                                 | 类型                                              | 默认值 |
| :----------- | :----------------------------------------------------------------------------------- | :------------------------------------------------ | :----- |
| columns      | 表单的数据项                                                                         | `EdtiableColumnsProps[]`                          | -      |
| buttonTitle  | 新增按钮的文案                                                                       | `string`?                                         | -      |
| hideBtn      | 是否隐藏新增按钮                                                                     | `boolean`?                                        | false  |
| onChange     | 录入表单控件数据时的回调，第一个参数是当前修改项，第二个是列表所有数据，第三个是 key | `(arg0: any, arg1: any[], arg2: number) => void`? | -      |
| dataSource   | 表格数据                                                                             | `any[]`?                                          | -      |
| canDelete    | 能否删除表格行                                                                       | `boolean`?                                        | false  |
| addRow       | 添加行之前的操作                                                                     | `() => void/Promise<void>`?                       | -      |
| saveRow      | 保存行之前的操作                                                                     | `(arg: any) => void/Promise<void>`?               | -      |
| deleteRow    | 删除行之前的操作                                                                     | `(arg: number) => void/Promise<'void'>`?          | -      |
| tableOptions | Antd 的 table 组件原生配置项                                                         | `any`?                                            | -      |

#### EdtiableColumnsProps[]

| 参数         | 说明                                                                          | 类型                                                  | 默认值 |
| :----------- | :---------------------------------------------------------------------------- | :---------------------------------------------------- | :----- |
| title        | 表头                                                                          | `string/ReactNode`                                    | -      |
| label        | 控件名                                                                        | `string`?                                             | -      |
| key          | 字段名或 key                                                                  | `string/number`?                                      | -      |
| dataIndex    | 单元格对应的字段名                                                            | `string`?                                             | -      |
| width        | 单元格的宽度                                                                  | `string/number`?                                      | -      |
| type         | 单元格控件                                                                    | `SELECT/INPUT/RANGE_PICKER/DATE_PICKER/INPUT_NUMBER`? | -      |
| dataList     | Select 和 Radio 的枚举数据                                                    | `{ value: string /number; label: any }[]`?            | -      |
| fieldOptions | Antd 的控件(Input、Select 等等)原生配置                                       | `any`?                                                | -      |
| editable     | 单元格是否可编辑(如果传了`type`属性，此属性可不传，默认为`true`时展示`Input`) | `boolean`?                                            | false  |
