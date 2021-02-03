import request from '@/utils/request'
import qs from 'qs'

export function lists (pageNum, pageSize, order, sort, status, keyword, parentId) {
  return request({
    url: '/simple/department',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      status,
      keyword,
      parentId
    }
  })
}

export function add (form) {
  const data = qs.stringify(form)
  return request({
    url: '/simple/department',
    method: 'POST',
    data
  })
}

export function delt (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/department/remove',
    method: 'PUT',
    data
  })
}

export function findDep () {
  return request({
    url: '/simple/department',
    method: 'GET',
    params: {
      pageNum: 1,
      pageSize: 5000,
      order: 'layer',
      sort: '',
      status: 1
    }
  })
}

export function findDepName (id) {
  return request({
    url: '/simple/department/' + id,
    method: 'GET'
  })
}

export function findDepartmentsByPersonnel (personnelId) {
  return request({
    url: '/simple/department/findDepartmentsByPersonnel',
    method: 'GET',
    params: {
      personnelId
    }
  })
}

export function findListByLayer (layer) {
  return request({
    url: '/simple/department/findListByLayer',
    method: 'GET',
    params: {
      layer
    }
  })
}
