const alarm = {
  state: {
    alarmInfo: null
  },
  mutations: {
    addAlarmInfo (state, info) {
      state.alarmInfo = info
    },
    clearAlarmInfo (state) {
      state.alarmInfo = null
    }
  }
}

export default alarm
