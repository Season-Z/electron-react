const getUrlParams = (url, name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i') // 定义正则表达式
  let r = url.substr(1).match(reg)
  if (r !== null) return unescape(r[2])
  return null
}
const deepClone = (obj, hash = new WeakMap()) => {
  // 先把特殊情况全部过滤掉 null undefined date reg
  if (obj === null) return obj // null 和undefine的都不理你
  if (typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  // [] {} 判断是数组还是对象
  // 判断类型    typeof instanceof constructor
  if (hash.has(obj)) {
    // 有拷贝后的直接返还即可
    return hash.get(obj) // 解决循环引用的问题
  }
  let instance = new obj.constructor() // new 做了什么事 new实现原理
  hash.set(obj, instance) // 制作一个映射表
  // 把实例上的属性拷贝到这个对象身上 把原型链指向到原型对象上
  for (let key in obj) {
    // 递归拷贝
    if (obj.hasOwnProperty(key)) {
      // 不拷贝原型链上的属性
      instance[key] = deepClone(obj[key], hash)
    }
  }
  return instance
}

export default { getUrlParams, deepClone }
