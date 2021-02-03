import request from '@/utils/request'

import qs from 'qs'

export function lists (pageNum, pageSize, order, sort, boundaryId, areaId, alarmType, status, startTime, endTime, keyword) {
  return request({
    url: '/boundary/alarm',
    method: 'GET',
    params: {
      pageNum, pageSize, order, sort, boundaryId, areaId, alarmType, status, startTime, endTime, keyword
    }
  })
}

export function details (id) {
  return request({
    url: '/boundary/alarm/' + id,
    method: 'GET'
  })
}

export function detailsByCode (code) {
  return request({
    url: '/boundary/alarm/findByCode',
    method: 'GET',
    params: {
      code
    }
  })
}

export function handle (id, description) {
  const data = qs.stringify({ id, description })
  return request({
    url: '/boundary/alarm/handle',
    method: 'POST',
    data
  })
}
