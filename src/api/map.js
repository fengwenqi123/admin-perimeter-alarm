import request from '@/utils/request'
import qs from 'qs'

export function lists (pageNum, pageSize, order, sort, keyword) {
  return request({
    url: '/boundary/warnArea',
    method: 'GET',
    params: {
      pageNum, pageSize, order, sort, keyword
    }
  })
}

export function add (form) {
  const data = qs.stringify(form)
  return request({
    url: '/boundary/warnArea',
    method: 'POST',
    data
  })
}
export function delt (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/boundary/warnArea/remove',
    method: 'POST',
    data
  })
}

export function listsNoPage (keyword) {
  return request({
    url: '/boundary/warnArea/list',
    method: 'GET',
    params: {
      keyword
    }
  })
}

export function level (id, alarmType) {
  return request({
    url: '/boundary/warnArea/getBoundaryAlarmBy',
    method: 'GET',
    params: {
      id, alarmType
    }
  })
}
