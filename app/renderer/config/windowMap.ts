/**
 * 获取views文件夹下的所有windo配置信息
 */
 const views = require.context('../views', true, /window\.ts$/)

 let windows: Map<string, WindowConfig> = new Map()

 views.keys().forEach((path) => {
   const conf: WindowConfig = views(path).default
   if (Array.isArray(conf)) {
     conf.forEach((v) => addRouteConfig(v))
   } else {
     addRouteConfig(conf)
   }
 })

 function addRouteConfig(conf: WindowConfig) {
   windows.set(conf.key, conf)
 }

 export default windows
