<template>
  <div class="information" v-if="alarmDetails">
      <el-scrollbar class="scrolls" style="width: 100%">
        <div class="information-con">
        <div class="left">
          <div class="video">
            <div class="big-video">
              <flv :val="trackVideo"></flv>
              <el-card class="small-video" :body-style="{ padding: '2px' }">
                <flv :val="panoramaVideo"></flv>
              </el-card>
            </div>
            <div class="button">
              <div class="btn b0" :class="{'stop':playStatus==='播放'}" @click="play">{{ playStatus }}</div>
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
          </div>
          <div class="val">
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
                  <div class="data">
                   {{alarmDetails.position}}
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
                        style="width: 320px;"
                        type="textarea"
                        :rows="6"
                        placeholder="请输入内容"
                        v-model="alarmDetails.description">
                      </el-input>
                    </div>
                  </div>
                  <div class="con submit">
                    <el-button type="primary" @click="submit">立即处理</el-button>
                    <el-button @click="cancel">取 消</el-button>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
        <div class="right">
          <img :src="imageSrc" alt="" ref="iamge">
          <canvas id="canvas1">
          </canvas>
        </div>
        </div>
      </el-scrollbar>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { details, handle } from '@/api/alarmInfo'
import flv from '@/components/flv'
import download from 'downloadjs'
import { getDataById as getDataByIdPar } from '@/api/partition'
import { getDataById, listsNoPage } from '@/api/defenseArea'
const otherColor = '#828282'
const currentColor = 'yellow'
const ctxLineWidth = 4
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
  watch: {
    alarmAreaVal: {
      handler (newVal) {
        if ((newVal.minDistance || newVal.minDistance === 0) && (newVal.maxDistance || newVal.maxDistance === 0)) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.getArea()
          const x = this.origin.X * this.$refs.iamge.width
          const y1 = (this.origin.Y - newVal.minDistance * this.unit) * this.$refs.iamge.height
          const y2 = (this.origin.Y - newVal.maxDistance * this.unit) * this.$refs.iamge.height
          this.ctx.strokeStyle = currentColor
          this.ctx.beginPath()
          this.ctx.moveTo(x, y1)
          this.ctx.lineTo(x, y2)
          this.ctx.stroke()
          this.point = [{
            X: this.origin.X,
            Y: this.origin.Y - newVal.minDistance * this.unit
          }, {
            X: this.origin.X,
            Y: this.origin.Y - newVal.maxDistance * this.unit
          }]
        }
      },
      deep: true
    }
  },
  data () {
    return {
      trackVideo: {
        url: '',
        id: 'alarmTrackVideo'
      },
      panoramaVideo: {
        url: '',
        id: 'alarmPanoramaVideo'
      },
      alarmDetails: null,
      inx: 1,
      playStatus: '暂停',
      imageSrc: null,
      pointJson: null,
      unit: null,
      origin: null,
      pointList: null,
      canvas: null,
      ctx: null,
      alarmAreaVal: {
        minDistance: null,
        maxDistance: null
      },
      point: null
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.row) {
        const id = this.row.id
        this.getdetails(id)
        getDataByIdPar(this.row.boundaryId).then(response => {
          this.imageSrc = response.data.image
          // 数组奇数位的xy对应偶数位的yx
          this.pointJson = JSON.parse(response.data.pointJson)
          // 图片加载完成初始化canvas
          const newImg = new Image()
          newImg.src = response.data.image
          newImg.onload = () => {
            this.canvasInit()
            this.calculation()
            this.getListFun()
            this.getDataByIdFun()
          }
        })
      }
    },
    // 根据id查详情
    getDataByIdFun () {
      getDataById(this.row.areaId).then(response => {
        this.point = JSON.parse(response.data.pointJson)
        this.alarmAreaVal.minDistance = response.data.miniRange
        this.alarmAreaVal.maxDistance = response.data.maxRange
        // this.unitCon()
      })
    },
    getdetails (id) {
      details(id).then(response => {
        this.trackVideo.url = response.data.videoWholePlayback
        this.panoramaVideo.url = response.data.videoPartPlayback
        this.alarmDetails = response.data
      })
    },
    cancel () {
      this.$emit('cancel')
    },
    submit () {
      handle(this.alarmDetails.id, this.alarmDetails.description).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.$emit('submit')
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
    },
    calculation () {
      // 设置原点
      this.origin = this.pointJson[1]
      // 计算1米对应图片百分比长度
      this.unit = (parseFloat(this.pointJson[1].Y) - parseFloat(this.pointJson[3].Y)) / (parseFloat(this.pointJson[2].X) - parseFloat(this.pointJson[0].X))
    },
    // 获得分区下所有防区范围
    getListFun () {
      listsNoPage(this.row.boundaryId).then(response => {
        this.pointList = response.data.reduce((total, currentValue) => {
          if (currentValue.id.toString() === this.row.areaId.toString()) {
            return [...total]
          }
          const point = JSON.parse(currentValue.pointJson)
          return [...total, point]
        }, [])
        this.getArea()
      })
    },
    getArea () {
      const x = this.origin.X * this.$refs.iamge.width
      if (this.pointList) {
        this.pointList.forEach(item => {
          this.ctx.strokeStyle = otherColor
          this.ctx.beginPath()
          this.ctx.moveTo(x, item[0].Y * this.$refs.iamge.height)
          this.ctx.lineTo(x, item[1].Y * this.$refs.iamge.height)
          this.ctx.stroke()
        })
      }
    },
    canvasInit () {
      this.canvas = document.getElementById('canvas1')
      this.canvas.width = this.$refs.iamge.width
      this.canvas.height = this.$refs.iamge.height
      this.ctx = this.canvas.getContext('2d')
      this.ctx.lineWidth = ctxLineWidth
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.information {
  height: 800px;
  .information-con {
      display: flex;
      .left {
        width: 1120px;

        .video {
          .big-video {
            position: relative;
            height: 460px;

            .small-video {
              width: 350px;
              height: 200px;
              position: absolute;
              right: 10px;
              top: 10px;
            }
          }

          .button {
            display: flex;
            margin-top: 10px;
            .btn {
              width: 320px;
              height: 60px;
              text-align: center;
              line-height: 60px;
              font-size: 26px;
              cursor: pointer;
              margin: 0 20px;
              margin-bottom: 20px;
            }

            .b0 {
              border: 2px solid #1890ff;
              color: #1890ff;
            }

            .stop {
              border: 2px solid red;
              color: red;
            }

            .b1 {
              background: #13ce66;
              color: #fff;
            }

            .b2 {
              background: #1890ff;
              color: #fff;

              span {
                font-size: 26px;
                color: #fff;
              }

              .el-dropdown-link {
                margin-left: 20px;
                cursor: pointer;
              }
            }

            .b3 {
              border: 1px solid #1890ff;
              color: #1890ff;
            }
          }
        }
        .val{
          display: flex;
          .alarm {
            width: 640px;
            margin-right: 20px;
            .box-card {
              .main {
                margin-bottom: 28px;
                display: flex;
                align-items: flex-start;
                flex-wrap: wrap;

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
            flex: 1;
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

      .right {
        position: relative;
        margin: 0 30px;
        flex: 1;
        img{
          width: 100%;
        }
        #canvas1{
          position: absolute;
          top: 0px;
          left: 0px;
        }
      }

  }
}

#canvas {
  //position: absolute;
  display: none;
}
</style>
