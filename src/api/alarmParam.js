import request from '@/utils/request'

import qs from 'qs'

export function add (form) {
  const data = qs.stringify(form)
  return request({
    url: '/boundary/alarmConfig',
    method: 'POST',
    data
  })
}

export function lists (keyword) {
  return request({
    url: '/boundary/alarmConfig/list',
    method: 'GET',
    params: {
      keyword
    }
  })
}

export function listsById (boundaryId) {
  return request({
    url: '/boundary/alarmConfig/findByBoundaryId',
    method: 'GET',
    params: {
      boundaryId
    }
  })
}
