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
import { getThreeDataById } from '@/api/partition'
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
      return `ws://${window.location.host}/ws/boundary/cloud/${this.boundaryId}`
      // return `ws://192.168.1.120:84/ws/boundary/cloud/${this.boundaryId}`
    }
  },
  created () {
    this.getThreeDataFun()
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    getThreeDataFun () {
      getThreeDataById(this.boundaryId).then(response => {
        const str = response.data.substr(6).replace(/,/g, '\n')
        this.$refs.iframe.contentWindow.init(str)
        this.initWebSocket()
        this.$emit('showThree')
      })
    },
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
