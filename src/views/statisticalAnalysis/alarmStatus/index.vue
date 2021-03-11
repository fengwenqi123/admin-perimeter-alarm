<template>
  <div class="common-table">
    <div class="title">
      <title-header/>
    </div>
    <el-card class="content">
      <div class="search">
        <el-form
          :inline="true"
          class="form-inline"
          label-width="100px">
          <el-form-item label="选择分区">
            <el-select v-model="boundaryId" clearable placeholder="请选择">
              <el-option
                v-for="item in areaOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择防区">
            <el-select v-model="areaId" clearable :disabled="disabled" placeholder="请选择">
              <el-option
                v-for="item in defenseAreaOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="startTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="截止时间">
            <el-date-picker
              v-model="endTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              class="blueButton"
              icon="el-icon-search"
              size="small"
              type="primary"
              @click="search"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="charts" v-if="tableData">
        <echarts :val="tableData" :type="chartType"></echarts>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          height="410"
          stripe
          border
        >
          <el-table-column
            label="日期"
            prop="statDate">
          </el-table-column>
          <el-table-column
            label="总量"
            prop="total">
          </el-table-column>
          <el-table-column
            label="未处理"
            prop="c1">
          </el-table-column>
          <el-table-column
            label="已处理"
            prop="c2">
          </el-table-column>

        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import titleHeader from '@/components/title/index'
import { lists } from '@/api/alarmStatus'
import { listsNoPage } from '@/api/partition'
import { listsNoPage as defenseAreaList } from '@/api/defenseArea'
import { getLastMonth, getNowTime } from '@/utils/day'
import echarts from '../echarts/index'

export default {
  components: {
    titleHeader,
    echarts
  },
  data () {
    return {
      startTime: getLastMonth(),
      endTime: getNowTime(),
      boundaryId: null,
      areaId: null,
      areaOption: null,
      defenseAreaOption: null,
      disabled: true,
      tableData: null,
      chartType: ['未处理', '已处理']

    }
  },
  watch: {
    boundaryId () {
      this.areaId = null
      if (this.boundaryId) {
        this.disabled = false
        this.getDefenseArea()
      } else {
        this.disabled = true
      }
    }
  },
  created () {
    this.list()
    this.getPartition()
  },
  methods: {
    search () {
      this.list()
    },
    list () {
      lists(this.boundaryId, this.areaId, this.startTime, this.endTime).then(response => {
        this.tableData = response.data
      })
    },
    getPartition () {
      listsNoPage().then(response => {
        this.areaOption = response.data
      })
    },
    getDefenseArea () {
      defenseAreaList(this.boundaryId).then(response => {
        this.defenseAreaOption = response.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.charts {
  height: 300px;
  margin-bottom: 20px;
}
</style>
