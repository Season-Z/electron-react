const Store = require('@utils/polyfill')('electron-store')

const store = new Store()

class YpStore {
  /** store 对象本身 */
  public instance = store

  /** 获取存储数据，支持 key、Array<key> */
  public get(name: string | string[]): any {
    if (Array.isArray(name)) {
      return name.map(n => store.get(n))
    } else {
      return store.get(name)
    }
  }
  public set(key: string, val: any): void {
    store.set(key, val)
  }
  public delete(key: string | string[]): void {
    if (Array.isArray(key)) {
      key.forEach(k => store.delete(k))
    } else {
      store.delete(key)
    }
  }
  /** 获取所有数据 */
  public all(): { [key: string]: any } {
    return store.store
  }
}

export default new YpStore()
