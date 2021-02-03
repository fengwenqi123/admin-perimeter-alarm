import request from '@/utils/request'
import qs from 'qs'

export function lists (pageNum, pageSize, order, sort, classification, type, status, keyword) {
  return request({
    url: '/simple/dataDictionary/list',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      classification,
      type,
      status,
      keyword
    }
  })
}

export function add (form) {
  const data = qs.stringify(form)
  return request({
    url: '/simple/dataDictionary',
    method: 'POST',
    data
  })
}

export function delt (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/dataDictionary/remove',
    method: 'PUT',
    data
  })
}

export function enable (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/dataDictionary/enable',
    method: 'PUT',
    data
  })
}

export function disable (id) {
  const data = qs.stringify({
    id: id.join(',')
  })
  return request({
    url: '/simple/dataDictionary/disable',
    method: 'PUT',
    data
  })
}

export function classification (classification, status) {
  return request({
    url: '/simple/dataDictionary/findListByClassification',
    method: 'GET',
    params: {
      classification, status
    }
  })
}
