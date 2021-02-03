const base = [{
  path: '/',
  redirect: '/smart'
}, {
  path: '/home',
  component: () => import('@/views/home')
}, {
  path: '/login',
  component: () => import('@/views/login/index')
}, {
  path: '/404',
  component: () => import('@/views/404')
}]
export default base
