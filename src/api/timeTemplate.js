import request from '@/utils/request'

import qs from 'qs'

export function listsNoPage (keyword) {
  return request({
    url: '/boundary/timeTemplate/list',
    method: 'GET',
    params: {
      keyword
    }
  })
}

export function lists (pageNum, pageSize, order, sort, keyword) {
  return request({
    url: '/boundary/timeTemplate',
    method: 'GET',
    params: {
      pageNum, pageSize, order, sort, keyword
    }
  })
}

export function add (form) {
  const data = qs.stringify(form)
  return request({
    url: '/boundary/timeTemplate',
    method: 'POST',
    data
  })
}

export function delt (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/boundary/timeTemplate/remove',
    method: 'POST',
    data
  })
}
