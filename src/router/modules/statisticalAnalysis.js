/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/index'

const statisticalAnalysis = {
  path: '/statisticalAnalysis',
  component: Layout,
  redirect: '/statisticalAnalysis/category',
  name: 'statisticalAnalysis',
  meta: { title: '统计分析', roles: ['statistics'], icon: 'sys' },
  children: [
    {
      path: 'category',
      name: 'category',
      component: () => import('@/views/statisticalAnalysis/category/index'),
      meta: { keepAlive: false, title: '告警类别', roles: ['statistics:category'] }
    },
    {
      path: 'alarmStatus',
      name: 'alarmStatus',
      component: () => import('@/views/statisticalAnalysis/alarmStatus/index'),
      meta: { keepAlive: false, title: '告警状态', roles: ['statistics:status'] }
    }
  ]
}

export default statisticalAnalysis
