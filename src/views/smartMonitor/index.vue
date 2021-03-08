<template>
  <div class="container smart" v-if="show">
    <div class="title">
      <title-header/>
      <div class="dropdown">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">{{checkedPartition.name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in partitionData" :command="item.id" :key="item.id">{{item.name}}</el-dropdown-item>
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
            <flv :val="trackVideo"></flv>
          </div>
        </el-card>
        <div class="box">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div slot="header" class="clearfix">
              <span>全景视频</span>
            </div>
            <div class="video">
              <flv :val="panoramaVideo"></flv>
            </div>
          </el-card>

          <el-card class="box-card" :body-style="{ padding: '0px' }" style="margin-left: 10px;">
            <div slot="header" class="clearfix">
              <span>告警日志</span>
            </div>
            <div class="tip">
              <div class="voice">
                <span>声音告警</span>
                <el-tooltip :content="'声音告警: ' + getStatus(voice)" placement="top">
                  <el-switch
                    v-model="voice"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value='1'
                    inactive-value='0'>
                  </el-switch>
                </el-tooltip>
              </div>
              <div class="more" @click="more">更多告警</div>
            </div>
            <el-table
              :data="tableData"
              border
              @row-dblclick="showInfo"
              height="300">
              <el-table-column
                prop="startTimeStr"
                label="时间"
                width="180">
              </el-table-column>
              <el-table-column
                prop="areaName"
                label="防区">
              </el-table-column>
              <el-table-column
                prop="dist"
                label="距离">
              </el-table-column>
              <el-table-column
                prop="h"
                label="高">
              </el-table-column>
              <el-table-column
                prop="w"
                label="宽">
              </el-table-column>
              <el-table-column
                label="状态">
                <template slot-scope="scope">
                  {{scope.row.status===1?'未处理':'已处理'}}
                </template>
              </el-table-column>

            </el-table>
          </el-card>
        </div>
      </div>
      <div class="right">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span>点云实景图</span>
          </div>
          <div class="button">
            <div :class="{'active' :active===1 }" @click="clickDiv(1)">点云</div>
            <div :class="{'active' :active===2 }" @click="clickDiv(2)">防区</div>
          </div>
          <iframe v-show="active===1" ref="iframe" :src="`${publicPath}static/pointcloud/index1.html`" frameborder="0"
                  width="100%"
                  height="750px;">
          </iframe>
          <div class="map" v-show="active===2">
            <img :src="img" alt="" ref="iamge">
            <canvas id="canvas"></canvas>
          </div>
        </el-card>

      </div>
    </div>
    <el-dialog v-el-drag-dialog :title="title" :visible.sync="addDialog" :before-close="handleClose" top="1vh" width="1800px">
      <information v-if="addDialog" :row="row" @cancel="cancel" @submit="submit"/>
    </el-dialog>
  </div>
</template>

<script>
import titleHeader from '@/components/title/index'
import flv from '@/components/flv'
import { getRealAlarm } from '@/api/smartMonitor'
import { listsNoPage, getDataById } from '@/api/partition'
import { listsNoPage as defenseAreaListsNoPage } from '@/api/defenseArea'
import information from './information'
import tableMixin from '@/mixins/tableMixin'
import elDragDialog from '@/directive/el-drag-dialog'

const url = 'ws://192.168.1.120:11004/ws/cloud/1'
const currentColor = 'yellow'
export default {
  name: 'index',
  directives: { elDragDialog },
  mixins: [tableMixin],
  components: {
    flv,
    titleHeader,
    information
  },
  data () {
    return {
      trackVideo: {
        url: null,
        id: 'trackVideo'
      },
      panoramaVideo: {
        url: null,
        id: 'panoramaVideo'
      },
      websock: null,
      publicPath: process.env.BASE_URL,
      active: 1,
      initThree: null,
      otherThree: null,
      tableData: [],
      voice: '1',
      partitionData: null,
      checkedPartition: null,
      show: false,
      img: null,
      canvas: null,
      ctx: null
    }
  },
  watch: {
    tableData: {
      handler (newVal) {
        if (newVal && newVal.length > 20) {
          newVal = newVal.slice(0, 20)
        }
      }
    }
  },
  created () {
    this.getPartitionList()
    this.getAlarmData()
    this.initWebSocket()
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  mounted () {
  },
  methods: {
    handleCommand (command) {
      console.log(command)
      this.partitionData.forEach(item => {
        if (item.id === command) {
          this.checkedPartition = item
        }
      })
    },
    // 获取分区列表
    getPartitionList () {
      listsNoPage().then(response => {
        this.partitionData = response.data
        if (this.partitionData) {
          this.checkedPartition = this.partitionData[0]
          this.getPartitionDetails(this.checkedPartition.id)
        }
      })
    },
    // id获取分区详情
    getPartitionDetails (id) {
      getDataById(id).then(response => {
        this.trackVideo.url = (JSON.parse(response.data.videoPartJson))[1].LiveChannelStream
        this.panoramaVideo.url = (JSON.parse(response.data.videoWholeJson))[1].LiveChannelStream
        this.img = response.data.image
        // 图片加载完成初始化canvas
        const newImg = new Image()
        newImg.src = response.data.image
        newImg.onload = () => {
          this.canvasInit()
          this.getdefenseArea(id)
        }
        this.show = true
      })
    },
    getdefenseArea (id) {
      const status = 1
      defenseAreaListsNoPage(id, status).then(response => {
        const arr = []
        response.data.forEach(item => {
          arr.push(JSON.parse(item.pointJson))
        })
        arr.forEach(item => {
          this.draw(item)
        })
      })
    },
    draw (item) {
      const iamge = this.$refs.iamge
      console.log(iamge)
      this.ctx.strokeStyle = currentColor
      this.ctx.beginPath()
      this.ctx.moveTo(item[0].X * iamge.width, item[0].Y * iamge.height)
      this.ctx.lineTo(item[1].X * iamge.width, item[1].Y * iamge.height)
      this.ctx.stroke()
    },
    canvasInit () {
      this.canvas = document.getElementById('canvas')
      this.canvas.width = this.$refs.iamge.width
      this.canvas.height = this.$refs.iamge.height
      this.ctx = this.canvas.getContext('2d')
    },
    getStatus (val) {
      return val === '1' ? '启用' : '禁用'
    },
    getAlarmData () {
      getRealAlarm(1).then(response => {
        this.tableData = response.data
      })
    },
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
    websocketonmessage (e) { // 数据接收 0差分，1初始, 2告警
      const i = e.data.substr(4, 1)
      const str = e.data.substr(6).replace(/,/g, '\n')
      console.log(i)
      if (i === '0') {
        this.$refs.iframe.contentWindow.add(str)
      } else if (i === '1') {
        this.$refs.iframe.contentWindow.init(str)
      } else if (i === '2') {
        const data = e.data.substr(6).split(',')
        const obj = {
          startTimeStr: data[0],
          areaName: data[1],
          dist: data[2],
          h: data[3],
          w: data[4],
          status: parseFloat(data[5])
        }
        this.tableData.unshift(obj)
      }
    },
    websocketsend (actions) { // 数据发送
      this.websock.send(actions)
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
    },
    showInfo (row) {
      this.title = '查看'
      this.row = row
      this.addDialog = true
    },
    more () {
      this.$router.push({
        name: 'alarm'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding:0 20px;
  .title {
    position: relative;

    .dropdown {
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
    .box{
      margin-top: 20px;
      display: flex;
      align-items: flex-start;
      flex: 1;
      .video{
        width: 400px;
        height: 350px;
      }
      .tip{
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        .more{
          cursor: pointer;
          color: #1890ff;
        }
      }
    }

  }

  .right {
    margin-left: 20px;
    flex: 1;
    .box-card {
      .button {
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
      .map{
        position: relative;
        width: 100%;
        padding-bottom: 15px;
        img{
          margin-left: 100px;
          //width: 350px;
        }
        #canvas{
          position: absolute;
          top: 0px;
          left: 100px;
        }
      }
    }
  }
}
</style>
