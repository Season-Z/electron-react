/**
 * 配合process.env.openRoute提升开发编译速度
 */
const routes = [
  {
    path: '/',
    component: '@/layouts/index.tsx',
    routes: [
      {
        path: '/Reservation/Detail',
        exact: true,
        component: '@/pages/Reservation/Detail/index.tsx'
      },
      {
        path: '/Reservation/Search',
        exact: true,
        component: '@/pages/Reservation/Search/index.tsx'
      }
    ]
  }
]
module.exports = {
  routes
}
