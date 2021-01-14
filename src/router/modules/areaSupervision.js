/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/index'

const areaSupervision = {
  path: '/areaSupervision',
  component: Layout,
  redirect: '/areaSupervision/partition',
  name: 'areaSupervision',
  meta: { title: '防区监管', roles: ['sys'] },
  children: [
    {
      path: 'partition',
      name: 'partition',
      component: () => import('@/views/areaSupervision/partition/index'),
      meta: { keepAlive: false, title: '分区管理', roles: ['sys'] }
    }
  ]
}

export default areaSupervision