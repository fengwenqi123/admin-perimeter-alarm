<template>
  <div class="information">
    <div class="information-main">
      <el-scrollbar class="scrolls">
        <div class="information-form">
          <div class="left">
            <img :src="imageSrc" alt="" ref="iamge">
            <canvas id="canvas">
            </canvas>
          </div>
          <div class="right">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>基本信息</span>
              </div>
              <base-info :Val.sync="baseInfoVal"></base-info>
            </el-card>

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>告警设置</span>
              </div>
              <alarm-setting :Val.sync="alarmSetVal"></alarm-setting>
            </el-card>

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>时间设置</span>
              </div>
              <time-temp :Val.sync="timeTempVal"></time-temp>
            </el-card>

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>告警区域</span>
              </div>
              <alarm-area :Val.sync="alarmAreaVal"></alarm-area>
            </el-card>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div slot="footer" class="information-foot">
      <el-button
        icon="el-icon-document"
        size="small"
        class="blueButton"
        @click="submit"
      >
        保存
      </el-button>
      <el-button
        icon="el-icon-refresh-left"
        size="small"
        class="whiteButton"
        @click="cancel"
      >
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import dialogFormMixin from '@/mixins/dialogFormMixin'
import baseInfo from './information/baseInfo'
import alarmSetting from './information/alarmSetting'
import timeTemp from './information/timeTemp'
import alarmArea from './information/alarmArea'
import { add, getDataById, listsNoPage } from '@/api/defenseArea'
import { getDataById as getDataByIdPar } from '@/api/partition'
const currentColor = 'yellow'
const otherColor = '#828282'
const ctxLineWidth = 4

export default {
  mixins: [dialogFormMixin],
  props: {
    id: {
      type: String
    },
    areaInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    baseInfo,
    alarmSetting,
    timeTemp,
    alarmArea
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
      baseInfoVal: {
        name: null,
        level: null,
        status: null,
        description: null
      },
      alarmSetVal: {
        oneLevelStatus: '1',
        oneLevelJson: { VoiceStatus: null, LightStatus: null, CenterStatus: null, HighVoice: null },
        twoLevelStatus: '1',
        twoLevelJson: { VoiceStatus: null, LightStatus: null, CenterStatus: null, HighVoice: null },
        threeLevelStatus: '1',
        threeLevelJson: { VoiceStatus: null, LightStatus: null, CenterStatus: null, HighVoice: null }
      },
      timeTempVal: {
        templateName: null,
        templateId: null
      },
      alarmAreaVal: {
        minDistance: null,
        maxDistance: null
      },
      point: null,
      imageSrc: null,
      canvas: null,
      ctx: null,
      pointJson: null,
      unit: null,
      origin: null,
      pointList: null
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.areaInfo) {
        getDataByIdPar(this.areaInfo.id).then(response => {
          this.imageSrc = response.data.image
          // 数组奇数位的xy对应偶数位的yx
          this.pointJson = JSON.parse(response.data.pointJson)
          this.calculation()
          this.getListFun()
          // 图片加载完成初始化canvas
          const newImg = new Image()
          newImg.src = response.data.image
          newImg.onload = () => {
            this.canvasInit()
            // 获取防区详情
            if (this.id) {
              setTimeout(() => {
                this.getDataByIdFun()
              }, 500)
            }
          }
        })
      }
    },
    // 根据id查详情
    getDataByIdFun () {
      getDataById(this.id).then(response => {
        this.baseInfoVal.name = response.data.name
        this.areaInfo.id = response.data.boundaryId
        this.areaInfo.name = response.data.boundaryName
        this.timeTempVal.templateId = response.data.templateId.toString()
        this.timeTempVal.templateName = response.data.templateName
        this.baseInfoVal.level = response.data.level
        this.alarmSetVal.oneLevelStatus = response.data.oneLevelStatus.toString()
        this.alarmSetVal.oneLevelJson = this.NumToBoolean(JSON.parse(response.data.oneLevelJson))
        this.alarmSetVal.twoLevelStatus = response.data.twoLevelStatus.toString()
        this.alarmSetVal.twoLevelJson = this.NumToBoolean(JSON.parse(response.data.twoLevelJson))
        this.alarmSetVal.threeLevelStatus = response.data.threeLevelStatus.toString()
        this.alarmSetVal.threeLevelJson = this.NumToBoolean(JSON.parse(response.data.threeLevelJson))
        this.point = JSON.parse(response.data.pointJson)
        this.baseInfoVal.status = response.data.status.toString()
        this.baseInfoVal.description = response.data.description
        this.alarmAreaVal.minDistance = response.data.miniRange
        this.alarmAreaVal.maxDistance = response.data.maxRange
        // this.unitCon()
      })
    },
    unitCon () {
      this.alarmAreaVal.minDistance = ((this.origin.Y - this.point[0].Y) / this.unit).toFixed(0)
      this.alarmAreaVal.maxDistance = ((this.origin.Y - this.point[1].Y) / this.unit).toFixed(0)
    },
    calculation () {
      // 设置原点
      this.origin = this.pointJson[1]
      // 计算1米对应图片百分比长度
      this.unit = (parseFloat(this.pointJson[1].Y) - parseFloat(this.pointJson[3].Y)) / (parseFloat(this.pointJson[2].X) - parseFloat(this.pointJson[0].X))
    },
    canvasInit () {
      this.canvas = document.getElementById('canvas')
      this.canvas.width = this.$refs.iamge.width
      this.canvas.height = this.$refs.iamge.height
      this.ctx = this.canvas.getContext('2d')
      this.ctx.lineWidth = ctxLineWidth
    },
    // 获得分区下所有防区范围
    getListFun () {
      listsNoPage(this.areaInfo.id).then(response => {
        this.pointList = response.data.reduce((total, currentValue) => {
          if (currentValue.id === this.id) {
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
    submit () {
      if ((!this.alarmAreaVal.minDistance && this.alarmAreaVal.minDistance !== 0) || (!this.alarmAreaVal.maxDistance && this.alarmAreaVal.maxDistance !== 0)) {
        this.$message('请先填写告警区域')
      }
      add({
        id: this.id || null,
        name: this.baseInfoVal.name,
        boundaryId: this.areaInfo.id,
        boundaryName: this.areaInfo.name,
        templateId: this.timeTempVal.templateId,
        templateName: this.timeTempVal.templateName,
        level: this.baseInfoVal.level,
        oneLevelStatus: this.alarmSetVal.oneLevelStatus,
        oneLevelJson: JSON.stringify(this.booleanToNum(this.alarmSetVal.oneLevelJson)),
        twoLevelStatus: this.alarmSetVal.twoLevelStatus,
        twoLevelJson: JSON.stringify(this.booleanToNum(this.alarmSetVal.twoLevelJson)),
        threeLevelStatus: this.alarmSetVal.threeLevelStatus,
        threeLevelJson: JSON.stringify(this.booleanToNum(this.alarmSetVal.threeLevelJson)),
        pointJson: JSON.stringify(this.point),
        status: this.baseInfoVal.status,
        description: this.baseInfoVal.description,
        miniRange: this.alarmAreaVal.minDistance,
        maxRange: this.alarmAreaVal.maxDistance
      }).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.$emit('submit')
      })
    },
    booleanToNum (obj) {
      const Json = {}
      for (const key in obj) {
        if (obj[key]) {
          Json[key] = 1
        } else {
          Json[key] = 0
        }
      }
      return Json
    },
    NumToBoolean (obj) {
      const Json = {}
      for (const key in obj) {
        if (obj[key]) {
          Json[key] = true
        } else {
          Json[key] = false
        }
      }
      return Json
    },
    cancel () {
      this.$emit('cancel')
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.information-form{
  display: flex;
  align-items: flex-start;
  .left{
    position: relative;
    #canvas{
      position: absolute;
      top: 0px;
      left: 0px;
    }
  }
  .right{
    margin-left: 20px;
  }
}
.box-card{
  margin-bottom: 20px;
}
.box-card:last-child{
  margin: 0;
}
</style>
