## Antd 的通用 table 组件

#### 基本功能

1. 集成了异步请求，只需要传入请求的`url`地址就行
2. 列举了枚举，可以控制异步请求的格式
3. 拥有`antd`的`Table`组件所有功能，并对各项表单的操作都有函数回调
4. 可以传入`antd`的`Table`组件所有原生配置

```ts
const columns = [
  {
    title: '货主',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'Jim', value: 'Jim' }
    ],
    // 这些筛选、排序的条件自己根据业务需求配置
    filteredValue: filteredInfo.name || null,
    onFilter: (value, record) => record.name.includes(value),
    sorter: (a, b) => a.name.length - b.name.length,
    sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    ellipsis: true
  },
  {
    title: '制单人',
    dataIndex: 'okoo',
    key: 'okoo',
    width: 100,
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'ji',
    key: 'ji',
    width: 160,
    ellipsis: true
  }
]

// 进行筛选、排序操作的回调函数
const sortCallback = useCallback((filters, sorters) => {
  console.log(filters, sorters)
}, [])
// 表格选择时的回调
const rowSelectCallback = useCallback((keys, rows) => {
  console.log(keys, rows)
}, [])
const paginationElement = (total, range) => {
  console.log(total, range)
}

const table: any = useRef()

{
  table.current?.reflashTable() // 父组件调用CommonTable的表单请求函数
}

;<CommonTable
  ref={table}
  columns={columns}
  queryDataUrl='settlement.sheet.querySettlementSheets'
  showAlert={true}
  rowSelectCallback={rowSelectCallback}
  searchParams={} // 表格搜索的参数，修改此参数表格重新发送请求更新
  sortCallback={sortCallback}
  paginationElement={paginationElement}
  tableOptions={{
    // antd的table组件原生配置项
    scroll: { x: 1400 }
  }}
/>

export interface IProps {
  columns: any[] // 列表的表头项
  queryDataUrl: string // 请求的url
  sortCallback?: (arg0: any, arg1: any) => void // 筛选的回调
  showAlert?: boolean // 是否展示alert，默认展示
  rowSelectCallback?: (arg0: any[], arg1: any[]) => void | undefined // 列表选择的回调
  paginationElement?: (arg0: any, arg1: any) => ReactNode | string // 分页左侧内容
  searchParams?: any // 表格搜索的参数
  tableOptions?: any // antd的table组件原生配置项
}
```

父组件调用 `CommonTable` 的列表刷新方法

```tsx
const table: any = useRef()

// 编辑、新增或者删除事件的 函数里调用
function 函数名称() {
  table.current?.reflashTable()
}

<CommonTable
  ref={table}
  columns={newColumns}
  queryDataUrl='settlement.sheet.querySettlementSheets'
  searchParams={searchParams}
  tableOptions={{
    scroll: { x: 1400 }
  }}
/>
```
父组件获取 `CommonTable` 的列表的所有数据

```tsx
const table: any = useRef()

// 获取table所有数据，包括如下
// dataSource: [],
// loading: false,
// total: 0,
// current: 1,
// pageSize: 10,
// order: {},
// isEnd: false,
// filters: {},
// sorters: {}
function 函数名称() {
  table.current?.getTableData()
}

// 每次table的数据更新都会触发这个函数
function getTableDataSource(data) {
  // 表格数据
  console.log(data)
}

<CommonTable
  ref={table}
  columns={newColumns}
  queryDataUrl='settlement.sheet.querySettlementSheets'
  searchParams={searchParams}
  returnData={getTableDataSource}
  tableOptions={{
    scroll: { x: 1400 }
  }}
/>
```