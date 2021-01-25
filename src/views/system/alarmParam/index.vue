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
            <el-select v-model="area" clearable placeholder="请选择">
              <el-option
                v-for="item in areaOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="common">
          <div class="label">宽度（米）：</div>
          <div class="value">0.2<span>-</span>3</div>
        </div>
        <div class="common">
          <div class="label">高度（米）：</div>
          <div class="value">0.15<span>-</span>5</div>
        </div>
      </el-card>

      <el-card class="box-card" :body-style="{ padding: '20px' ,paddingTop:'0px' }">
        <div slot="header" class="clearfix">
          <span>一级告警（行人，车辆等较大移动目标）</span>
        </div>
        <div class="common">
          <div class="label">宽度（米）：</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="maxSmallTargetSizeWidth"
              clearable>
            </el-input>
            <span>-</span>3
          </div>
        </div>
        <div class="common">
          <div class="label">高度（米）：</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="maxSmallTargetSizeHeight"
              clearable>
            </el-input>
            <span>-</span>5
          </div>
        </div>
      </el-card>

      <el-card class="box-card" :body-style="{ padding: '20px' ,paddingTop:'0px' }">
        <div slot="header" class="clearfix">
          <span>二级告警（小猫，小狗等较小移动目标）</span>
        </div>
        <div class="common">
          <div class="label">宽度（米）：</div>
          <div class="value">0.2<span>-</span>1.2</div>
        </div>
        <div class="common">
          <div class="label">高度（米）：</div>
          <div class="value">0.15<span>-</span>0.8</div>
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
import { add, lists } from '@/api/alarmParam'
import { listsNoPage } from '@/api/partition'
export default {
  name: 'index',
  data () {
    return {
      maxSmallTargetSizeWidth: null,
      maxSmallTargetSizeHeight: null,
      timeList,
      startLightOn: null,
      endLightOn: null,
      area: null,
      areaOption: null
    }
  },
  created () {
    this.getList()
    this.getArea()
  },
  methods: {
    getArea () {
      listsNoPage().then(response => {
        this.areaOption = response.data
      })
    },
    getList () {
      lists().then(response => {
        this.maxSmallTargetSizeWidth = response.data[0].maxSmallTargetSizeWidth
        this.maxSmallTargetSizeHeight = response.data[0].maxSmallTargetSizeHeight
        this.startLightOn = response.data[0].startLightOn
        this.endLightOn = response.data[0].endLightOn
      })
    },
    submit () {
      if (this.area === null) {
        this.$message('请选择区域')
        return
      }
      if (this.maxSmallTargetSizeWidth === null) {
        this.$message('请输入宽度')
        return
      }
      if (this.maxSmallTargetSizeHeight === null) {
        this.$message('请输入高度')
        return
      }
      if (this.startLightOn === null) {
        this.$message('请选择开始时间')
        return
      }
      if (this.endLightOn === null) {
        this.$message('请选择结束时间')
        return
      }
      add({
        boundaryId: this.area,
        maxSmallTargetSizeWidth: this.maxSmallTargetSizeWidth,
        maxSmallTargetSizeHeight: this.maxSmallTargetSizeHeight,
        startLightOn: this.startLightOn,
        endLightOn: this.endLightOn
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

        .value {
          margin-left: 100px;
          display: flex;
          align-items: center;

          span {
            margin: 0 20px;
          }
        }
      }
    }
    .information-foot{
      .blueButton{
        width: 100%;
        height: 48px;
      }
    }
  }

}
</style>
