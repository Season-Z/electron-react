## 标题 tab 切换功能组件

```ts

export const TITLE_BAR_DATA = [
  {
    name: 'ORDER_INFO',  // 字段名（自定义，必须唯一）
    title: '订单信息'     // 标题的名字
  },
  {
    name: 'JOB_INFO',
    title: '作业信息'
  }
]

// 获取初始值
const initActive = useMemo(() => {
  const { name } = TITLE_BAR_DATA[0] || {}
  return name
}, [TITLE_BAR_DATA])
const [activeKey, setActiveKey] = useState(initActive)
// 改变title高亮事件
const clickTitleCallback = useCallback(value => {
  setActiveKey(value.name)
}, [])

<TitleBar
  activeKey={activeKey}
  data={TITLE_BAR_DATA}
  clickTitleCallback={clickTitleCallback}
/>

interface TitleBarProps {
  activeKey: string   // 默认高亮的数据
  data: DataProps[]   // 标题数据
  clickTitleCallback: (arg: DataProps) => void   // 点击标题切换的回调
}

```
