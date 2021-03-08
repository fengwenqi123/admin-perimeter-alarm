const cancel = {
  state: {
    cancelTokenArr: [] // 存储cancel token
  },
  mutations: {
    addCancelToken ({ cancelTokenArr }, data) {
      cancelTokenArr.push(data)
    },
    clearCancelToken (state) {
      state.cancelTokenArr.map(item => {
        item.cancel(`${item.url}---路由切换取消请求`)
      })
      state.cancelTokenArr = []
    }
  }
}

export default cancel
