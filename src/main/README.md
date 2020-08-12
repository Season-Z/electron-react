##  ypshop-electron主进程

```
|-- src
    |-- app-update.yml 自动更新：正式环境服务器
    |-- app-local-update.yml 自动更新: 开发环境服务器
    |-- bundle.js
    |-- bundle.js.map
    |-- electron-helper.js 工具集
    |-- index.js 入口
    |-- loading.html app运行loading页
    |-- preload.js 配合loading
    |-- config 配置
    |   |-- config.js 主进程全局配置
    |   |-- greyPublish.js 灰度发布配置(dev)
    |   |-- webpack.config.js
    |-- controls
    |   |-- AppAutoUpdater.js 自动更新
    |   |-- AppMainWindow.js 窗口初始化
    |   |-- AppTray.js 系统托盘
    |-- log
    |   |-- record.log // 本地日志
    |-- print // electron自带打印(已无用)
    |   |-- print.html
    |   |-- print.js
    |-- public
    |   |-- icon.png 打包app图标
    |   |-- lodop-print lodop打印组件
    |-- script // 构建
        |-- build.js

```


#### 自动更新

###### 1.0
- 开放自动更新和手动更新，重启或者每次回到home页会触发一次检查更新，当前版本号小于服务器版本号时自动更新覆盖，手动安装和重启（默认builder流程）

开发环境服务器地址配置：app-local-update.yml
线上环境服务器地址配置：app-update.yml

###### 1.1
- 通过接口控制人群灰度版本控制，app启动或者通过某个接口获取更新数据和服务器地址，如果该门店需要更新，则update组件通知主进程，主进程会重置服务器URL等配置后，再触发检查更新覆盖

###### 1.2 TODO
- 加入自动安装和重启
- 增加"增量更新"，不用下载和安装整包来更新

备注：
1. window.isOpenAutoUpdate： 是否开启自动更新
2. 服务器至少需要文件：latest.yml YPSHOP_setup_0.1.3 (windows)