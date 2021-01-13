import request from '@/utils/request'

// import qs from 'qs'

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
