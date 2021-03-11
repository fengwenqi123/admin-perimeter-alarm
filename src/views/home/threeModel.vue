<template>
  <div class="container">
    <iframe
      class="iframe"
      ref="iframe"
      :src="`${publicPath}static/pointcloud/index1.html`"
      frameborder="0"
    >
    </iframe>
  </div>
</template>

<script>
export default {
  props: {
    boundaryId: {
      type: String
    }
  },
  data () {
    return {
      publicPath: process.env.BASE_URL
    }
  },
  computed: {
    url () {
      return process.env.VUE_APP_BASE_WS + this.boundaryId
    }
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket () {
      // 初始化weosocket
      const wsuri = this.url
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () {
      // 连接建立之后执行send方法发送数据
      const actions = '链接成功'
      console.log(actions)
    },
    websocketonerror () {
      // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage (e) {
      // 数据接收 0差分，1初始, 2告警
      const i = e.data.substr(4, 1)
      const str = e.data.substr(6).replace(/,/g, '\n')
      console.log(i)
      if (i === '0') {
        this.$refs.iframe.contentWindow.add(str)
      } else if (i === '1') {
        this.$refs.iframe.contentWindow.init(str)
        console.log(111)
        this.$emit('showThree')
      }
    },
    websocketsend (actions) {
      // 数据发送
      this.websock.send(actions)
    },
    websocketclose (e) {
      // 关闭
      console.log('断开连接', e)
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  height: 100%;
}
.iframe{
  width: 100%;
  height: 100%;
}
</style>
