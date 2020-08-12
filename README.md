# middle-web-umi

web模板 + umi思想集成

### 集成说明
- 配置基于 umi@3，部分参考 Ant Design Pro
- 路由使用 [约定式路由](https://umijs.org/zh-CN/docs/convention-routing)
  * 自动生成不要修改 🙃
  * 路由查看 `src/.umi/core/routes.ts` 可作为配置菜单的参考
- 菜单配置 `src/layouts/menu/config.tsx`

### 名词解释
- umi
  * 核心概念 **约定优于配置** 简化项目整合复杂度，降低思考成本 😄
  * 做的事情比 `create-react-app` 更多的脚手架(可以叫框架)
- dva
  * 早期是一个整合 `redux` `redux-saga` `dva-cli` 的独立项目
  * 在 `umi@3` 中默认集成，所以会淡化 `dva` 的概念
- model
  * `dva` 文件, `状态` `副作用` `action` `reducer` (四合一的 `redux`)
  * 以 `model.tsx` 或 `models/xxx.ts` 两种出场方式
  * 以 `connect` 方式将数据链接到组件

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

### 私有仓库
- .npmrc
  ```
  registry=http://nexus.ypsx-internal.com/repository/npm-group/
  email=node-developer@ypshengxian.com
  always-auth=true
  _auth="bm9kZS1kZXZlbG9wZXI6N1pYR3pFelJxTVlMYzE0d1U0NUE="
  electron_mirror="https://npm.taobao.org/mirrors/electron/"
  ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
  ```
- .yarnrc
  ```
  registry "http://nexus.ypsx-internal.com/repository/npm-group/"
  "_auth" bm9kZS1kZXZlbG9wZXI6N1pYR3pFelJxTVlMYzE0d1U0NUE=
  always-auth true
  email node-developer@ypshengxian.com
  electron_mirror https://npm.taobao.org/mirrors/electron/
  ELECTRON_MIRROR https://npm.taobao.org/mirrors/electron/
  ```

### 使用
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

### umi

1. "umi": "^3.1.1" 最新包热加载失效，暂时锁版本 (2020-05-18)


### electron

1. `errorOut=Reserved header is not 0 or image type is not icon`
  png转ico不能单纯改后缀，需要工具处理；

2. electron-store本地缓存存放目录
win: C:\Users\你的用户\AppData\Roaming\ypshop-app
mac: /Users/Mac/Library/Application Support/ypshop-app/config.json

### 20-06-14 aclas_sdk.node 说明
- 开发用的 `node-loader`
- 打包用的 `relative-loader`
- 所以说目录结构不要乱动(要烦死人的😭)，注意点如下
  * .umirc 下的 copy 配置
  * utils/aclas-addons/static/addons 是配合 .umirc 中 copy 用的
  * utils/aclas-addons/addons 是开发用的
  * **所以说 utils/aclas-addons 文件夹千万不要改结构**

> 思路2：
  - 分析路径 `D:\ypsx\ypshop-desktop-app-electron\node_modules\electron\dist\resources\electron.asar\renderer`
  开发环境下可以通过路径切割配合 `relative-loader` 跑起来，能少装个 `node-loader`
  - 思路来源开发环境读取 dll 文件实现

### 20-06-14 render进程静态文件地址
- https://ss1.ypshengxian.com/feassets/electron_render/index.html

### 全量更新文件存放OSS
1. win: oss://ypsx-static-01/feassets/ypshop_setup/win/

### 20-07-16 下发电子称崩溃兜底方案思路
1. C 插件开多线程下载，由于受限于 napi 提供的 api 不能随心所欲的写；分析可能是线程竞争导致
2. 崩溃几率不高；尤其在 electron@9.x.x 和 win10 下灰常稳定；门店用的 win7 😥
3. 综合考虑；在 electron 主进程中开子进程下发，C 代码崩溃也不会导致 electron 闪退，还可以重新拉起
4. 2.0 版本会使用 C# 实现；独立程序，通过 http 进行通讯

### 20-07-17 windows 缓存地址
```
C:\Users\用户\AppData\Roaming\ypshop-app
```

#### 注意事项
#### 禁止任何情况下从feature/SIT/test/dev合并或拉取分支 feature分支只能合并到发布分支
#### 禁止任何情况下合并未经测试同意的功能发布到任意发布分支  客户端有测试需求可从feature分支打包供测试使用

### 20-07-17 发布流程
1. menu分支上要确保所有功能是要发上线的
2. 从menu分支新建分支vxxx
3. 登录页面关闭切环境功能
4. ypRequest写死接口请求地址为线上环境
5. 上传安装包exe,dmg到这个目录 oss://ypsx-static-01/feassets/ypshop/package/（老的安装包不用删除）
6. 操作这个静态资源gitlab项目：https://coding.ypsx-internal.com/web-front-end/static-res-web
7. 修改这个文件里面的下载地址：
https://coding.ypsx-internal.com/web-front-end/static-res-web/-/blob/master/dist/treaty/h5/ypshop/index.html
**直接在master分支修改，git commit 的时候 要加上 “xxxxx  --skip-build”**
8. 如果要开启自动更新 exe文件和yml文件放这个目录 oss://ypsx-static-01/feassets/ypshop_setup/win/

- wiki 地址
https://wiki.ypsx-internal.com/pages/viewpage.action?pageId=35761698

### 20-07-20 下发电子称 C# 版本
```
src\render\utils\aclas-addons\exe\AclasFor_node.exe
```
- pre 环境测试单号: TJ2007130000046
