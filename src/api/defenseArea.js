import request from '@/utils/request'

import qs from 'qs'

export function lists (pageNum, pageSize, order, sort, boundaryId, status, keyword) {
  return request({
    url: '/boundary/area',
    method: 'GET',
    params: {
      pageNum, pageSize, order, sort, boundaryId, status, keyword
    }
  })
}
export function listsNoPage (boundaryId, status, keyword) {
  return request({
    url: '/boundary/area/list',
    method: 'GET',
    params: {
      boundaryId, status, keyword
    }
  })
}

export function add (form) {
  const data = qs.stringify(form)
  return request({
    url: '/boundary/area',
    method: 'POST',
    data
  })
}

export function getDataById (id) {
  return request({
    url: '/boundary/area/' + id,
    method: 'GET'
  })
}

export function delt (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/boundary/area/remove',
    method: 'POST',
    data
  })
}
export function defence (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/boundary/area/defence',
    method: 'POST',
    data
  })
}
export function garrison (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/boundary/area/garrison',
    method: 'POST',
    data
  })
}

export function bypass (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/boundary/area/bypass',
    method: 'POST',
    data
  })
}
