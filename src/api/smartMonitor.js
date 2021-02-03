import request from '@/utils/request'
// import qs from 'qs'

export function getRealAlarm (boundaryId) {
  return request({
    url: '/boundary/alarm/realAlarm',
    method: 'GET',
    params: {
      boundaryId
    }
  })
}
