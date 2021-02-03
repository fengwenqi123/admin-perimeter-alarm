/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/index'

const alarmInfo = {
  path: '/alarmInfo',
  component: Layout,
  redirect: '/alarmInfo/alarm',
  name: 'alarmInfo',
  // alwaysShow: true,
  meta: { title: '告警信息', roles: ['sys'], icon: 'sys' },
  children: [
    {
      path: 'alarm',
      name: 'alarm',
      component: () => import('@/views/alarmInfo/alarmInfo/index'),
      meta: { keepAlive: false, title: '告警信息', roles: ['sys'] }
    }
  ]
}

export default alarmInfo
