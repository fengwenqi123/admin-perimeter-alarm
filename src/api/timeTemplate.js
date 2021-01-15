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
