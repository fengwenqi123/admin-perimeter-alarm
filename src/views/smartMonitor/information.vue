<template>
  <div class="information" v-if="alarmDetails">
    <div class="information-main">
      <el-scrollbar class="scrolls">
        <div class="information-form">
          <div class="line">
            <div class="video">
              <el-card class="box-card">
                <flv :val="trackVideo"></flv>
              </el-card>
            </div>
            <div class="video">
              <el-card class="box-card">
                <flv :val="panoramaVideo"></flv>
              </el-card>
            </div>
          </div>
          <div class="line1">
            <div class="button">
              <div class="btn b0" :class="{'stop':playStatus==='播放'}" @click="play">{{playStatus}}</div>
              <div class="btn b1">视频下载</div>
              <div class="btn b2">
                <span>播放速度</span>
                <el-dropdown @command="handleCommand" trigger="click" placement="top-end">
                  <span class="el-dropdown-link">
                    x{{ inx }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="8">8</el-dropdown-item>
                    <el-dropdown-item command="4">4</el-dropdown-item>
                    <el-dropdown-item command="2">2</el-dropdown-item>
                    <el-dropdown-item command="1">1</el-dropdown-item>
                    <el-dropdown-item command="0.5">0.5</el-dropdown-item>
                    <el-dropdown-item command="0.25">0.25</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="btn b3" @click="screenshot">截图</div>
            </div>
            <div class="alarm">
              <el-card class="box-card" :body-style="{ padding: '0px' }">
                <div slot="header" class="clearfix">
                  <span>告警信息</span>
                </div>
                <div class="main">
                  <div class="img">
                    <img :src="alarmUrl" alt="">
                  </div>
                  <div class="info">
                    <div class="con">
                      <div class="label">开始时间</div>
                      <div class="val">{{ alarmDetails.startTimeStr }}</div>
                    </div>
                    <div class="con">
                      <div class="label">结束时间</div>
                      <div class="val">{{ alarmDetails.stopTimeStr }}</div>
                    </div>
                    <div class="con">
                      <div class="label">类别</div>
                      <div class="val">{{ alarmDetails.alarmType === 1 ? '一级告警' : '二级告警' }}</div>
                    </div>
                    <div class="con">
                      <div class="label">防区</div>
                      <div class="val">{{ alarmDetails.areaName }}</div>
                    </div>
                    <div class="con">
                      <div class="label">分区</div>
                      <div class="val">{{ alarmDetails.boundaryName }}</div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="handle">
              <el-card class="box-card" :body-style="{ padding: '10px' }">
                <div slot="header" class="clearfix">
                  <span>处理信息</span>
                </div>
                <div class="form">
                  <div class="con">
                    <div class="label">状态</div>
                    <div class="val">{{ alarmDetails.status === 1 ? '未处理' : '已处理' }}</div>
                  </div>
                  <div class="con">
                    <div class="label">处理人</div>
                    <div class="val">{{ alarmDetails.userName }}</div>
                  </div>
                  <div class="con">
                    <div class="label">处理意见</div>
                    <div class="val">
                      <el-input
                        type="textarea"
                        :rows="6"
                        placeholder="请输入内容"
                        v-model="alarmDetails.description">
                      </el-input>
                    </div>
                  </div>
                  <div class="con submit">
                    <el-button type="primary" @click="submit">立即处理</el-button>
                    <el-button>取 消</el-button>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { detailsByCode, handle } from '@/api/alarmInfo'
import flv from '@/components/flv'
import download from 'downloadjs'

export default {
  props: {
    row: {
      type: Object
    }
  },
  components: {
    flv
  },
  computed: {
    alarmUrl () {
      if (this.alarmDetails) {
        return `${this.alarmDetails.alarmUrl}${this.alarmDetails.image}`
      } else {
        return null
      }
    }
  },
  data () {
    return {
      trackVideo: {
        url: 'http://192.168.1.201:9001/flv/zhoujie/47',
        id: 'trackVideo1'
      },
      panoramaVideo: {
        url: 'http://192.168.1.201:9001/flv/zhoujie/47',
        id: 'panoramaVideo1'
      },
      alarmDetails: null,
      inx: 1,
      playStatus: '暂停'
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.row) {
        const code = this.row.code
        this.getdetails(code)
      }
    },
    getdetails (code) {
      detailsByCode(code).then(response => {
        this.alarmDetails = response.data
      })
    },
    submit () {
      handle(this.alarmDetails.id, this.alarmDetails.description).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
      })
    },
    play () {
      const arr = [document.getElementById(this.trackVideo.id), document.getElementById(this.panoramaVideo.id)]
      arr.forEach(item => {
        if (item.paused) {
          item.play()
          this.playStatus = '暂停'
        } else {
          item.pause()
          this.playStatus = '播放'
        }
      })
    },
    handleCommand (command) {
      this.inx = parseFloat(command)
      document.getElementById(this.trackVideo.id).playbackRate = this.inx
      document.getElementById(this.panoramaVideo.id).playbackRate = this.inx
    },
    screenshot () {
      const v1 = document.getElementById(this.trackVideo.id)
      const v2 = document.getElementById(this.panoramaVideo.id)
      const arr = [v1, v2]
      const canvas = document.getElementById('canvas')
      arr.forEach((item, index) => {
        canvas.width = item.offsetWidth
        canvas.height = item.offsetHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(item, 0, 0, item.offsetWidth, item.offsetHeight)
        const base64 = canvas.toDataURL('images/png')
        download(base64, `${index}.png`, 'image/png')
      })
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.information {
  .information-main {
    height: 800px;
  }

  .line {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: flex-start;

    .video {
      width: 800px;
      height: 400px;

      .box-card {
        height: 100%;
      }
    }

    .video:nth-child(2) {
      margin-left: 20px;
    }
  }

  .line1 {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;

    .button {
      .btn {
        width: 320px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 26px;
        margin-bottom: 20px;
        cursor: pointer;
      }
      .b0 {
        border:2px solid #1890ff;
        color: #1890ff;
      }
      .stop{
        border:2px solid red;
        color: red;
      }

      .b1 {
        background: #13ce66;
        color: #fff;
      }

      .b2 {
        background: #1890ff;
        color: #fff;
        span{
          font-size: 26px;
          color: #fff;
        }
        .el-dropdown-link{
          margin-left: 20px;
          cursor: pointer;
        }
      }

      .b3 {
        border: 1px solid #1890ff;
        color: #1890ff;
      }
    }

    .alarm {
      .box-card {
        .main {
          display: flex;
          align-items: flex-start;

          .img {
            img {
              width: 350px;
              height: 220px;
            }
          }

          .info {
            margin: 0 20px;

            .con {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              margin-top: 20px;

              .val {
                font-size: 16px;
                margin-left: 20px;
              }

              .label {
                font-size: 16px;
              }
            }
          }
        }
      }
    }

    .handle {
      .form {
        .con {
          margin-bottom: 10px;
          display: flex;

          .label {
            width: 100px;
            text-align: right;
          }

          .val {
            margin-left: 20px;
          }
        }

        .submit {
          justify-content: center;
        }
      }
    }
  }
}
#canvas{
  //position: absolute;
  display: none;
}
</style>
