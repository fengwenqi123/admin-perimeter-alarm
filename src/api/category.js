import request from '@/utils/request'

// import qs from 'qs'

export function lists (boundaryId, areaId, startTime, endTime) {
  return request({
    url: '/boundary/alarmStat/byType',
    method: 'GET',
    params: {
      boundaryId, areaId, startTime, endTime
    }
  })
}
