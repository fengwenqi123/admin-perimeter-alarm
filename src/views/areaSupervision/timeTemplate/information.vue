<template>
  <div class="information">
    <div class="information-main">
      <el-scrollbar class="scrolls">
        <div class="information-form">
          <el-card class="box-card">
            <div class="common">
              <div class="label">名称:</div>
              <div class="value">
                <el-input
                  placeholder="请输入内容"
                  v-model="name"
                  clearable>
                </el-input>
              </div>
            </div>
            <div class="common">
              <div class="label">描述:</div>
              <div class="value">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="description"
                  placeholder="请输入内容">
                </el-input>
              </div>
            </div>
            <div class="common">
              <div class="label">周期选择:</div>
              <div class="value">
                <el-radio v-model="type" label="1">按天</el-radio>
                <el-radio v-model="type" label="2">按周</el-radio>
              </div>
            </div>
            <div class="time-set">
              <div class="time">
                <span>0</span><span>4</span><span>8</span><span>12</span><span>16</span><span>20</span><span>24</span>
              </div>
              <!--              按天-->
              <div class="main" v-show="type==='1'">
                <div class="label">每天</div>
                <div class="canvas">
                  <canvas ref="Canvas" class="Canvas" width="900" height="40"></canvas>
                </div>
                <div class="set">
                  <el-popover
                    placement="bottom-end"
                    trigger="click">
                    <div class="box">
                      <p>第一段：</p>
                      <TimePicker :Val="dayArr[0]"></TimePicker>
                    </div>
                    <div class="box">
                      <p>第二段：</p>
                      <TimePicker :Val="dayArr[1]"></TimePicker>
                    </div>
                    <div class="box">
                      <p>第三段：</p>
                      <TimePicker :Val="dayArr[2]"></TimePicker>
                    </div>
                    <div class="box">
                      <p>第四段：</p>
                      <TimePicker :Val="dayArr[3]"></TimePicker>
                    </div>
                    <el-button slot="reference">设置</el-button>
                  </el-popover>
                </div>
              </div>
              <!--              按周-->
                <div class="main" v-show="type==='2'" v-for="(item,index) in weekArr" :key="index">
                  <div class="label">{{ item.label }}</div>
                  <div class="canvas">
                    <canvas ref="Canvas" class="Canvas1" width="900" height="40"></canvas>
                  </div>
                  <div class="set week">
                    <el-popover
                      placement="bottom-end"
                      trigger="click">
                      <div class="box">
                        <p>第一段：</p>
                        <TimePicker :Val="item.value[0]"></TimePicker>
                      </div>
                      <div class="box">
                        <p>第二段：</p>
                        <TimePicker :Val="item.value[1]"></TimePicker>
                      </div>
                      <div class="box">
                        <p>第三段：</p>
                        <TimePicker :Val="item.value[2]"></TimePicker>
                      </div>
                      <div class="box">
                        <p>第四段：</p>
                        <TimePicker :Val="item.value[3]"></TimePicker>
                      </div>
                      <el-button slot="reference">设置</el-button>
                    </el-popover>
                    <el-popover
                      style="margin-left: 10px;"
                      placement="bottom-end"
                      @after-leave="afterLeave(index)"
                      trigger="click">
                      <div class="box">
                        <el-checkbox-group v-model="checkList">
                          <el-checkbox v-for="(day,i) in week" :label='day.value' :disabled="index===i">
                            {{ day.label }}
                          </el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <el-button slot="reference">复制</el-button>
                    </el-popover>
                  </div>
                </div>
            </div>
          </el-card>
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
import TimePicker from './TimePicker'
import { timeDifference, weekArr } from './time'
import { add } from '@/api/timeTemplate'

export default {
  mixins: [dialogFormMixin],
  props: {
    row: {
      type: Object
    }
  },
  components: {
    TimePicker
  },
  watch: {
    dayArr: {
      handler (newVal) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        newVal.forEach(item => {
          if (item.startTime && item.endTime) {
            var {
              startTime,
              diffTime
            } = timeDifference(item.startTime, item.endTime)
            this.ctx.beginPath()
            this.ctx.fillRect(startTime * this.unit, 0, diffTime * this.unit, 40)
            this.ctx.stroke()
          }
        })
      },
      deep: true
    },
    weekArr: {
      handler (newVal) {
        setTimeout(() => {
          this.drawWeek(newVal)
        }, 10)
      },
      deep: true
    },
    type () {
      this.$nextTick(() => {
        this.canvasInit()
      })
    }
  },
  data () {
    return {
      unit: 900 / 24 / 60, /* 像素/分钟 */
      name: null,
      description: null,
      type: '1',
      dateJson: null,
      dayArr: [{
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
      }],
      weekArr: weekArr,
      canvas: null,
      ctx: null,
      ctxArr: [],
      checkList: [],
      week: [{
        label: '周一',
        value: 0
      }, {
        label: '周二',
        value: 1
      }, {
        label: '周三',
        value: 2
      }, {
        label: '周四',
        value: 3
      }, {
        label: '周五',
        value: 4
      }, {
        label: '周六',
        value: 5
      }, {
        label: '周日',
        value: 6
      }]
    }
  },
  mounted () {
    this.init()
    this.canvasInit()
  },
  methods: {
    drawWeek (newVal) {
      newVal.forEach((val, index) => {
        this.ctxArr[index].clearRect(0, 0, this.canvas.width, this.canvas.height)
        val.value.forEach(item => {
          if (item.startTime && item.endTime) {
            var {
              startTime,
              diffTime
            } = timeDifference(item.startTime, item.endTime)
            this.ctxArr[index].beginPath()
            this.ctxArr[index].fillRect(startTime * this.unit, 0, diffTime * this.unit, 40)
            this.ctxArr[index].stroke()
          }
        })
      })
    },
    // 编辑初始化数据格式转换
    init () {
      if (this.row) {
        this.name = this.row.name
        this.description = this.row.description
        this.type = this.row.type.toString()
        if (this.type === '1') {
          const day = JSON.parse(this.row.dateJson)[0]
          for (let i = day.length; i <= 3; i++) {
            day.push({
              startTime: null,
              endTime: null
            })
          }
          this.dayArr = day
        } else {
          this.weekArr = []
          let data = JSON.parse(this.row.dateJson)
          const sunDay = data.splice(0, 1)
          console.log(sunDay)
          data = [...data, ...sunDay]
          data.forEach((item, index) => {
            const obj = {}
            obj.label = this.week[index].label
            for (let i = item.length; i <= 3; i++) {
              item.push({
                startTime: null,
                endTime: null
              })
            }
            obj.value = item
            this.weekArr.push(obj)
          })
        }
      }
    },
    canvasInit () {
      if (this.type === '1') {
        this.canvas = document.querySelector('.Canvas')
        this.ctx = this.canvas.getContext('2d')
        this.ctx.fillStyle = '#1890ff'
      } else {
        var canvas = document.querySelectorAll('.Canvas1')
        console.log(canvas.length)
        this.canvas = canvas[0]
        canvas.forEach(item => {
          var ctx = item.getContext('2d')
          ctx.fillStyle = '#1890ff'
          this.ctxArr.push(ctx)
        })
      }
    },
    // 表单操作
    submit () {
      var dateJson = []
      if (this.type === '1') {
        const val = []
        this.dayArr.forEach(item => {
          if (item.startTime && item.endTime && item.startTime !== item.endTime) {
            val.push(item)
          }
        })
        dateJson.push(val)
        dateJson = JSON.stringify(dateJson)
      } else {
        this.weekArr.forEach(item => {
          const val = []
          item.value.forEach(item1 => {
            if (item1.startTime && item1.endTime && item1.startTime !== item1.endTime) {
              val.push(item1)
            }
          })
          dateJson.push(val)
        })
        const lastDay = dateJson.splice(dateJson.length - 1, 1)
        dateJson = JSON.stringify([...lastDay, ...dateJson])
      }
      add({
        id: this.row ? this.row.id : null,
        name: this.name,
        description: this.description,
        type: this.type,
        dateJson: dateJson
      }).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.$emit('submit')
      })
    },
    cancel () {
      this.$emit('cancel')
    },
    afterLeave (i) {
      // 选择复制行
      const weekVal = this.weekArr[i].value
      this.checkList.forEach(item => {
        this.weekArr[item].value = JSON.parse(JSON.stringify(weekVal))
      })
      this.checkList = []
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card {
  .common {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 400px;

    .label {
      width: 100px;
      text-align: right;
    }

    .value {
      margin-left: 20px;
    }
  }

  .common:last-child {
    margin: 0px;
  }

  .time-set {
    width: 900px;
    margin: 0 auto;

    .time {
      position: relative;
      display: flex;
      align-items: center;

      span {
        width: 150px;
        text-indent: -6px;
      }

      span:last-child {
        position: absolute;
        right: 0px;
        text-align: right;
        text-indent: 0px;
      }
    }

    .main {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .label {
        width: 40px;
        position: absolute;
        left: -40px;
      }

      .set {
        position: absolute;
        right: -96px;
      }

      .canvas {
        width: 900px;
        height: 40px;
        background: #f5f5f5;
      }

      .week {
        right: -160px;
      }
    }
  }
}

.box {
  display: flex;
  align-items: center;
}
</style>
