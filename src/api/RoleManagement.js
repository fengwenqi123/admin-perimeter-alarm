import request from '@/utils/request'
import qs from 'qs'

export function lists (pageNum, pageSize, order, sort, status, keyword) {
  return request({
    url: '/simple/role',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      status,
      keyword
    }
  })
}

export function add (form) {
  const data = qs.stringify(form)
  return request({
    url: '/simple/role',
    method: 'POST',
    data
  })
}

export function delt (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/role/remove',
    method: 'PUT',
    data
  })
}

export function enable (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/role/enable',
    method: 'PUT',
    data
  })
}

export function disable (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/role/disable',
    method: 'PUT',
    data
  })
}

export function findRole () {
  return request({
    url: '/simple/authorize/findAllListWithPid',
    method: 'GET'
  })
}

export function findRoleById (roleId) {
  return request({
    url: '/simple/authorize/findListByRole',
    method: 'GET',
    params: {
      roleId
    }
  })
}
