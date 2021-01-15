import request from '@/utils/request'

import qs from 'qs'

export function lists (pageNum, pageSize, order, sort, status, keyword) {
  return request({
    url: '/boundary/boundary',
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
export function listsNoPage (keyword, status) {
  return request({
    url: '/boundary/boundary/list',
    method: 'GET',
    params: {
      keyword, status
    }
  })
}

export function getDataById (id) {
  return request({
    url: '/boundary/boundary/' + id,
    method: 'GET'
  })
}

export function add (form) {
  const data = qs.stringify(form)
  return request({
    url: '/boundary/boundary',
    method: 'POST',
    data
  })
}

export function delt (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/boundary/boundary/remove',
    method: 'POST',
    data
  })
}

export function enable (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/boundary/boundary/enabled',
    method: 'POST',
    data
  })
}

export function disable (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/boundary/boundary/disabled',
    method: 'POST',
    data
  })
}
