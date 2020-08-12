# umi 使用
`umi@^3.1.1` `react@^16.13.1`

### 命令
- npm start
- npm build

### Demo 示例
- 请查看 `src/pages/Foo/`

### 一些有必要的说明
- pages 下的文件会被自动识别路由，除了 `components/` `models/` `_name` 文件夹
- 任意路径下的 `.umi` 文件夹为运行时自动生成，不要修改

### 新建一个页面
- 在 `src/pages` 下新建一个文件夹即可，文件夹中的 `**/*.tsx` 将自动会被识别并生成路由
- 动态路由请以 `[xx].tsx` 命名 

### 菜单&路由
- 路由会根据 `pages` 下的结构自动生成
  * 查看核对 `src/.umi/core/routes.ts`
- 新建菜单 `src/config/menus.tsx`
  ```tsx
  interface IMenu {
    title: string           // 名称
    path: string            // 路由，参考自动生成路由
    icon?: React.ReactNode  // 图标
    subs?: Array<IMenu>     // 子路由
  }
  ```

### Redux 使用
  * 任意路径下的 `models/*.ts` `model.ts` 将自动识别为 Redux 文件
  * `namespace` 用于 `connect` 标识符
  * `state` 数据源
  * `effects` 副作用：如异步请求 - 使用 `redux-saga` 写法
  * `reducers` 同 redux 中的 reducer
  * 示例
    ```tsx
    export default {
      namespace: 'foo',
      state: {
        list: []
      },
      effects: {
        *fetch({ payload }: any, { call, put }: any) {
          const { data } = yield call(api.getFoo, payload)
          yield put({
            type: 'save',
            payload: { list: data.list }
          })
        }
      },
      reducers: {
        save(state: FooState, { payload }: any) {
          return { ...state, ...payload }
        }
      },
    }
    ```
  * 组件中使用
    ```tsx
    const Foo = (props: any) => {
      const { dispatch, foo, loading } = props

      React.useEffect(() => {
        dispatch({ type: 'foo/fetch', payload: { xxx })
      }, [])

      return ...
    }

    const mapState = ({ foo, loading }: any) => ({
      foo,
      loading: loading.effects['foo/fetch'] // umi 自动注入的请求监听
    })

    export default connect(mapState)(Foo)
    ```

### 环境变量配置
- https://umijs.org/zh-CN/docs/env-variables#host
- 根目录下 .env
  ```env
  PORT=8080
  ESLINT=1
  ```
### 自定义启动
- https://umijs.org/zh-CN/docs/runtime-config
- 如果有需要修改 `src/app.ts`

### 全局样式
- `global.less`
- `src/assets/style/*.less`

### less 使用
- `import styles from 'xxx.less'` 将会自动开启命名空间
- `import 'xxx.less'` 不会开启命名空间

### mook 数据
- 在 `mook` 目录下新建任意文件导出即可
- 示例
  ```js
  module.exports = {
    'POST /api/foo'(req, res) {
      res.json({
        list: [
          { age: 29, name: 'anan', job: '前端组长' },
          { age: 36, name: 'andy', job: 'BOSS' },
          { age: 28, name: 'kevin', job: '前端开发' },
        ],
      });
    },
  };
  ```