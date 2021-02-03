/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/index'

const smartMonitor = {
  path: '/smart',
  component: Layout,
  redirect: '/smart/smartMonitor',
  name: 'smart',
  meta: { title: '智能监控', roles: ['sys'], icon: 'sys' },
  children: [
    {
      path: 'smartMonitor',
      name: 'smartMonitor',
      component: () => import('@/views/smartMonitor/index'),
      meta: { keepAlive: false, title: '智能监控', roles: ['sys'] }
    }
  ]
}

export default smartMonitor
