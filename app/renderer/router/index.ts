export { default as AppRoutes } from './appRoutes'
export { default as routerConfig } from './router'

import { RouteObject } from 'react-router-dom'
import router from './router'

const map: Map<string, RouteObject> = new Map()

router.forEach((v) => {
  if (v.path) {
    map.set(v.path, v)
  }
})

export const routerMap = map
