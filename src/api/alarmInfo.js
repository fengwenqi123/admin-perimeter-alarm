import request from '@/utils/request'

// import qs from 'qs'

export function lists (pageNum, pageSize, order, sort, boundaryId, areaId, alarmType, status, startTime, endTime, keyword) {
  return request({
    url: '/boundary/alarm',
    method: 'GET',
    params: {
      pageNum, pageSize, order, sort, boundaryId, areaId, alarmType, status, startTime, endTime, keyword
    }
  })
}
