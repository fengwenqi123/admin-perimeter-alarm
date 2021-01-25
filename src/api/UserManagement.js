import request from '@/utils/request'
import qs from 'qs'

export function lists (pageNum, pageSize, order, sort, status, keyword, parentDepartmentId) {
  return request({
    url: '/simple/personnel',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      status,
      keyword,
      parentDepartmentId
    }
  })
}

export function lists1 (order, sort, status, departmentId, roleId, keyword) {
  return request({
    url: '/simple/personnel/list',
    method: 'GET',
    params: {
      order, sort, status, departmentId, roleId, keyword
    }
  })
}

export function watch (id) {
  return request({
    url: '/simple/personnel/' + id,
    method: 'GET'
  })
}

export function add (form) {
  const data = qs.stringify(form)
  return request({
    url: '/simple/personnel',
    method: 'POST',
    data
  })
}

export function delt (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/personnel/remove',
    method: 'PUT',
    data
  })
  // return request.put('/simple/personnel/remove', data)
}

export function enable (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/personnel/enable',
    method: 'PUT',
    data
  })
  // return request.put('/simple/personnel/enable', data)
}

export function disable (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/personnel/disable',
    method: 'PUT',
    data
  })
  // return request.put('/simple/personnel/disable', data)
}

export function getDepartArr () {
  return request({
    url: '/simple/department',
    method: 'GET',
    params: {
      order: 'layer',
      status: 1
    }
  })
}

export function getRoleArr () {
  return request({
    url: '/simple/role',
    method: 'GET',
    params: {
      pageSize: 5000,
      status: 1
    }
  })
}

export function resetpassword (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request.put('/simple/personnel/passwordReset', data)
}

export function findRoleById (personnelId) {
  return request({
    url: '/simple/role/findListByPersonnel',
    method: 'GET',
    params: {
      personnelId
    }
  })
}

export function findDepById (personnelId) {
  return request({
    url: '/simple/department/findListByPersonnel',
    method: 'GET',
    params: {
      personnelId
    }
  })
}

export function findXq () {
  return request({
    url: '/area/manageRange/myManageRange',
    method: 'GET'
  })
}
