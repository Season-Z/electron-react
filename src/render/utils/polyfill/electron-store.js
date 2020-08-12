module.exports = class Store {
  get(name) {
    let res = localStorage.getItem(name)
    try {
      res = JSON.parse(res)
    } finally {
      return res
    }
  }
  set(name, val) {
    if (val && typeof val === 'object') {
      localStorage.setItem(name, JSON.stringify(val))
    } else {
      localStorage.setItem(name, val)
    }
  }
  delete(key) {
    if (Array.isArray(key)) {
      key.forEach(k => localStorage.removeItem(k))
    } else {
      localStorage.removeItem(key)
    }
  }
}