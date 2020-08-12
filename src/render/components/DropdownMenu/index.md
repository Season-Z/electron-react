# DropdownMenu

#### 基本功能

1. 表格的「操作」栏可能存在大量的操作按钮，`DropdownMenu`可以将过多的操作按钮隐藏

## 基本用法

```tsx
/**
 * title: 基本用法
 * desc: 最基本的功能
 */

import React, { useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import CommonTable from '@components/CommonTable';
import DropdownMenu from './index';

export default function() {
  const columns = [
    {
      title: '货主',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 120,
      ellipsis: true,
    },
    {
      title: '制单人',
      dataIndex: 'cityCode',
      key: 'cityCode',
      width: 100,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'settlementTime',
      key: 'settlementTime',
      width: 160,
      ellipsis: true,
      render: t => (t ? dayjs(t).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: 160,
      ellipsis: true,
      render: (_, r) => {
        const dataList = [
          {
            event: () => {},
            name: '编辑',
          },
          {
            event: () => {},
            name: '删除',
          },
          {
            event: () => {},
            name: '启用',
          },
          {
            event: () => {},
            name: '禁用',
          },
        ];
        return <DropdownMenu dataList={dataList} num={2} />;
      },
    },
  ];
  return (
    <CommonTable
      columns={columns}
      queryDataUrl="settlement.sheet.querySettlementSheets"
    />
  );
}
```

## API

| 参数     | 说明                                             | 类型                                 | 默认值 |
| :------- | :----------------------------------------------- | :----------------------------------- | :----- |
| dataList | 渲染的按钮的 list                                | `{name: string;event: () => void}[]` | -      |
| num      | 展示几个按钮，（剩下的按钮以下拉菜单的形式展示） | `number`                             | -      |
