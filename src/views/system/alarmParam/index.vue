<template>
  <div class="container">
    <div class="main">
      <el-card class="box-card" :body-style="{ padding: '20px' ,paddingTop:'0px' }">
        <div slot="header" class="clearfix">
          <span>检测范围</span>
        </div>
        <div class="common">
          <div class="label">所属分区：</div>
          <div class="value">
            <el-select v-model="area" placeholder="请选择">
              <el-option
                v-for="item in areaOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-card>

      <el-card class="box-card" :body-style="{ padding: '20px' ,paddingTop:'0px' }">
        <div slot="header" class="clearfix">
          <span>目标</span>
        </div>
        <div class="common">
          <div class="label">最小的目标宽度：</div>
          <div class="value">{{minTargetSizeWidth}}</div>
        </div>
        <div class="common">
          <div class="label">最小的目标高度：</div>
          <div class="value">{{minTargetSizeHeight}}</div>
        </div>

        <div class="common">
          <div class="label">最大的小目标宽度：</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="maxSmallTargetSizeWidth"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">最大的小目标高度：</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="maxSmallTargetSizeHeight"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">最大的目标宽度：</div>
          <div class="value">{{maxTargetSizeWidth}}</div>
        </div>
        <div class="common">
          <div class="label">最大的目标高度：</div>
          <div class="value">{{maxTargetSizeHeight}}</div>
        </div>
        <div class="common">
          <div class="label">离围界边距离阈值：</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="distL2"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">离地面高度阈值：</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="distL3"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">每个目标跟踪轮询的时间：</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="traceTime"
              clearable>
            </el-input>
          </div>
        </div>
      </el-card>

      <el-card class="box-card" :body-style="{ padding: '20px' ,paddingTop:'0px' }">
        <div slot="header" class="clearfix">
          <span>激光探照灯</span>
        </div>
        <div class="common">
          <div class="label">开启时间：</div>
          <div class="value">
            <el-select v-model="startLightOn" placeholder="请选择">
              <el-option
                v-for="item in timeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span>-</span>
            <el-select v-model="endLightOn" placeholder="请选择">
              <el-option
                v-for="item in timeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="common">
          <div class="label">报警持续时间(秒)：</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="dualTime"
              clearable>
            </el-input>
          </div>
        </div>
      </el-card>

      <div slot="footer" class="information-foot">
        <el-button
          icon="el-icon-document"
          size="small"
          class="blueButton"
          @click="submit()"
        >
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { timeList } from './index'
import { add, listsById } from '@/api/alarmParam'
import { listsNoPage } from '@/api/partition'

export default {
  name: 'index',
  data () {
    return {
      minTargetSizeWidth: 0.2,
      minTargetSizeHeight: 0.2,
      maxTargetSizeWidth: 3,
      maxTargetSizeHeight: 5,
      maxSmallTargetSizeWidth: 0.4,
      maxSmallTargetSizeHeight: 0.4,
      distL2: 1,
      distL3: 1.5,
      timeList,
      startLightOn: 18,
      endLightOn: 6,
      area: null,
      areaOption: null,
      id: null,
      dualTime: 5,
      traceTime: 5
    }
  },
  watch: {
    area () {
      this.getList(this.area)
    }
  },
  created () {
    this.getArea()
  },
  methods: {
    getArea () {
      listsNoPage().then(response => {
        this.areaOption = response.data
        this.area = this.areaOption[0].id
      })
    },
    getList (id) {
      listsById(id).then(response => {
        this.id = response.data.id
        this.maxSmallTargetSizeWidth = response.data.maxSmallTargetSizeWidth
        this.maxSmallTargetSizeHeight = response.data.maxSmallTargetSizeHeight
        this.startLightOn = response.data.startLightOn
        this.endLightOn = response.data.endLightOn
        this.dualTime = response.data.dualTime
        this.distL2 = response.data.distL2
        this.distL3 = response.data.distL3
      })
    },
    submit () {
      if (this.area === '') {
        this.$message('请选择区域')
        return
      }
      if (this.maxSmallTargetSizeWidth === '') {
        this.$message('请输入最大的小目标宽度')
        return
      }
      if (this.maxSmallTargetSizeHeight === '') {
        this.$message('请输入最大的小目标高度')
        return
      }
      if (this.startLightOn === '') {
        this.$message('请选择开始时间')
        return
      }
      if (this.endLightOn === '') {
        this.$message('请选择结束时间')
        return
      }
      if (this.dualTime === '') {
        this.$message('请输入报警持续时间')
        return
      }
      if (this.distL2 === '') {
        this.$message('请输入离围界边距离阈值')
        return
      }
      if (this.distL3 === '') {
        this.$message('请输入离地面高度阈值')
        return
      }
      add({
        id: this.id,
        boundaryId: this.area,
        minTargetSizeWidth: this.minTargetSizeWidth,
        minTargetSizeHeight: this.minTargetSizeHeight,
        maxSmallTargetSizeWidth: this.maxSmallTargetSizeWidth,
        maxSmallTargetSizeHeight: this.maxSmallTargetSizeHeight,
        maxTargetSizeWidth: this.maxTargetSizeWidth,
        maxTargetSizeHeight: this.maxTargetSizeHeight,
        startLightOn: this.startLightOn,
        endLightOn: this.endLightOn,
        distL2: this.distL2,
        distL3: this.distL3,
        dualTime: this.dualTime,
        traceTime: this.traceTime
      }).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  height: 100%;
  width: 100%;
  background: #fff;

  .main {
    width: 800px;
    margin: 0 auto;

    .box-card {
      margin-top: 20px;

      .common {
        display: flex;
        align-items: center;
        margin-top: 20px;
        .label{
          width: 200px;
        }

        .value {
          display: flex;
          align-items: center;

          span {
            margin: 0 20px;
          }
        }
      }
    }

    .information-foot {
      .blueButton {
        width: 100%;
        height: 48px;
      }
    }
  }

}
</style>
