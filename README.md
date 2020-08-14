# middle-web-umi

web模板 + umi思想集成

### 集成说明
- 配置基于 umi@3，部分参考 Ant Design Pro
- 路由使用 [约定式路由](https://umijs.org/zh-CN/docs/convention-routing)
  * 自动生成不要修改 🙃
  * 路由查看 `src/.umi/core/routes.ts` 可作为配置菜单的参考
- 菜单配置 `src/layouts/menu/config.tsx`

### 目录树
```tree
.
├── mock/
├── public/
├── src/
.   ├── .umi/                        # umi 根据约定即使生成的文件夹
.   ├── assets/
.   .   ├── image/
.   .   ├── style/
.   ├── layouts/                     # 外壳布局
.   .   ├── menu/
.   .   .   ├── config.tsx           # 左侧菜单配置
.   .   .   ├── index.less
.   .   .   ├── index.tsx
.   .   ├── index.less
.   .   ├── index.tsx
.   ├── models/                      # 全局 dva
.   ├── pages/                       # pages 下的一个文件夹(含有index.tsx)会自动生成一个路由
.   .   ├── .umi/                    # umi 根据约定即使生成的文件夹
.   .   ├── foo/
.   .   .   ├── index.less
.   .   .   ├── index.tsx
.   ├── app.ts                       # 运行时配置
.   ├── global.less                  # 全局样式文件
├── .editorconfig
├── .env                             # 环境变量配置
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .prettierignore
├── .prettierrc.js
├── .umirc.ts                        # umi 自定义配置
├── .yarnrc
├── package.json
├── README.md
├── tsconfig.json
├── typings.d.ts                     # 全局 typescript 类型
├── yarn.lock
```

### 参考
[doc](docs/umi.md)


### log

- 本地调试日志

```js
const log = require('electron-log');
// log.transports.file.file = '/Users/Mac/workSpace/electron/ypshop-desktop-app-electron/src/main/log/record.log' 本地可指定文件
// 默认日志存放
// on Linux: ~/.config/{appName}/log.log
// on macOS: ~/Library/Logs/{appName}/log.log
// on Windows: user\AppData\Roaming\{appName}\log.log
log.info('Hello, log');
log.warn('Some problem appears');
```


### electron

1. `errorOut=Reserved header is not 0 or image type is not icon`
  png转ico不能单纯改后缀，需要工具处理；

2. electron-store本地缓存存放目录
win: C:\Users\你的用户\AppData\Roaming\ypshop-app
mac: /Users/Mac/Library/Application Support/ypshop-app/config.json
