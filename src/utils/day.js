import dayjs from 'dayjs'

export function getLastMonth (format) {
  format = format || 'YYYY-MM-DD'
  return dayjs().subtract(1, 'month').format(format)
}

export function getNowTime (format) {
  format = format || 'YYYY-MM-DD'
  return dayjs().format(format)
}
