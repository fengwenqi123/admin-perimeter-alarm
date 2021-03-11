/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/index'

const areaSupervision = {
  path: '/areaSupervision',
  component: Layout,
  redirect: '/areaSupervision/partition',
  name: 'areaSupervision',
  meta: { title: '区域管理', roles: ['area'], icon: 'sys' },
  children: [
    {
      path: 'partition',
      name: 'partition',
      component: () => import('@/views/areaSupervision/partition/index'),
      meta: { keepAlive: false, title: '分区管理', roles: ['area:partition'] }
    }, {
      path: 'defenseArea',
      name: 'defenseArea',
      component: () => import('@/views/areaSupervision/defenseArea/index'),
      meta: { keepAlive: false, title: '防区管理', roles: ['area:defense'] }
    }, {
      path: 'map',
      name: 'map',
      component: () => import('@/views/areaSupervision/map/index'),
      meta: { keepAlive: false, title: '区域管理', roles: ['area:area'] }
    }, {
      path: 'timeTemplate',
      name: 'timeTemplate',
      component: () => import('@/views/areaSupervision/timeTemplate/index'),
      meta: { keepAlive: false, title: '模版设置', roles: ['area:template'] }
    }
  ]
}

export default areaSupervision
