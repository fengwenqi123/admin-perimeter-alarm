export function timeDifference (start, end) {
  var start1 = start.split(':')
  var startTime = parseInt(start1[0] * 60) + parseInt(start1[1])

  var end1 = end.split(':')
  var endTime = parseInt(end1[0] * 60) + parseInt(end1[1])
  var diffTime = endTime - startTime
  return { startTime, diffTime }
}
export const weekArr = [
  {
    label: '周一',
    value: [{
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }]
  }, {
    label: '周二',
    value: [{
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }]
  }, {
    label: '周三',
    value: [{
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }]
  }, {
    label: '周四',
    value: [{
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }]
  }, {
    label: '周五',
    value: [{
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }]
  }, {
    label: '周六',
    value: [{
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }]
  }, {
    label: '周日',
    value: [{
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }, {
      startTime: null,
      endTime: null
    }]
  }
]
