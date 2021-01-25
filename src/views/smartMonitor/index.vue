<template>
  <div class="container smart">
    <div class="title">
      <title-header/>
      <div class="dropdown">
        <el-dropdown>
          <span class="el-dropdown-link">华是科技园<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>华是科技园</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
    <div class="main">
      <div class="left">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span>追踪视频</span>
          </div>
          <div class="video">
            <flv :url="url" :ids="id"></flv>
          </div>
        </el-card>
        <el-card class="box-card" :body-style="{ padding: '0px' }" style="margin-top: 20px;">
          <div slot="header" class="clearfix">
            <span>点云实景图</span>
          </div>
          <div class="button">
            <div :class="{'active' :active===1 }" @click="clickDiv(1)">点云</div>
            <div :class="{'active' :active===2 }" @click="clickDiv(2)">防区</div>
          </div>
          <iframe ref="iframe" :src="`${publicPath}static/pointcloud/index.html`" frameborder="0" width="100%"
                  height="400px;"></iframe>
        </el-card>
      </div>
      <div class="right">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span>追踪视频</span>
          </div>
          <div class="video">
            <flv :url="url1" :ids="id1"></flv>
          </div>
        </el-card>

        <el-card class="box-card" :body-style="{ padding: '0px' }" style="margin-top: 20px;">
          <div slot="header" class="clearfix">
            <span>告警日志</span>
          </div>
        </el-card>
      </div>
    </div>

  </div>
</template>

<script>
import titleHeader from '@/components/title/index'
import flv from '@/components/flv'

const url = 'ws://192.168.1.129:11004/ws/cloud/1'
export default {
  name: 'index',
  components: {
    flv,
    titleHeader
  },
  data () {
    return {
      url: 'http://192.168.1.201:9001/flv/zhoujie/47',
      url1: 'http://192.168.1.201:9001/flv/zhoujie/46',
      id: 'id1',
      id1: 'id2',
      websock: null,
      publicPath: process.env.BASE_URL,
      active: 1
    }
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  mounted () {
  },
  methods: {
    clickDiv (i) {
      this.active = i
    },
    initWebSocket () { // 初始化weosocket
      const wsuri = url
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      const actions = '链接成功'
      console.log(actions)
    },
    websocketonerror () { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage (e) { // 数据接收
      const str = e.data.substr(6).replace(/,/g, '\n')
      console.log(str)
      this.$refs.iframe.contentWindow.init(str)
    },
    websocketsend (actions) { // 数据发送
      this.websock.send(actions)
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .title {
    position: relative;
    .dropdown{
      cursor: pointer;
      position: absolute;
      top: 16px;
      left: 177px;
    }
  }

  .main {
    display: flex;
  }

  .left {
    width: 1000px;

    .video {
      height: 400px;
    }

    .box-card {
      .button {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: flex-start;

        div {
          text-align: center;
          background: #fff;
          cursor: pointer;
          width: 80px;
          height: 40px;
          line-height: 40px;
          border: 1px solid #fff;
        }

        .active {
          //border: 1px solid #1890ff;
          color: #1890ff;
          font-size: 20px;
        }
      }
    }
  }

  .right {
    margin-left: 20px;
    flex: 1;

    .video {
      height: 300px;
    }
  }
}
</style>
