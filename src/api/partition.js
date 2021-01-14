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
