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
          <el-form-item label="类别">
            <el-select v-model="alarmType" clearable placeholder="请选择">
              <el-option
                v-for="item in alarmOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="status" clearable placeholder="请选择">
              <el-option
                v-for="item in statusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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
          <el-form-item label="关键字">
            <el-input
              v-model="keyword"
              placeholder="请输入关键字"
              clearable
            />
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
      <div class="table">
        <el-table
          ref="multipleTable"
          :height="tableHeight"
          stripe
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            prop="Id"
            label="序号"
            width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index+(page.pageNum - 1) * page.pageSize+1 }} </span>
            </template>
          </el-table-column>
          <el-table-column
            label="时间"
            width="180"
            prop="startTimeStr">
          </el-table-column>
          <el-table-column
            label="类别">
            <template slot-scope="scope">
              {{scope.row.alarmType==1?'一级告警':scope.row.alarmType==2?'二级告警':'三级告警'}}
            </template>
          </el-table-column>
          <el-table-column
            label="距离（米）">
            <template slot-scope="scope">
              {{scope.row.d}}
            </template>
          </el-table-column>
          <el-table-column
            label="高（米）">
            <template slot-scope="scope">
              {{scope.row.h}}
            </template>
          </el-table-column>
          <el-table-column
            label="宽（米）">
            <template slot-scope="scope">
              {{scope.row.w}}
            </template>
          </el-table-column>
          <el-table-column
            label="分区"
            prop="boundaryName">
          </el-table-column>
          <el-table-column
            label="防区"
            prop="areaName">
          </el-table-column>
          <el-table-column
            label="处理人"
            prop="userName">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              {{scope.row.status==1?'未处理':'已处理'}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="120"
          >
            <template slot-scope="scope">
              <el-button-group>
                <div class="operation">
                  <el-button class="table_button" icon="el-icon-search" size="small" type="text"
                             @click="handleClickInfo(scope.row)">查看
                  </el-button>
                </div>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom">
        <div class="option">
        </div>
        <div class="pagination">
          <pagination
            v-show="page.total>0"
            :limit.sync="page.pageSize"
            :page.sync="page.pageNum"
            :total="page.total"
            @pagination="list"
          />
        </div>
      </div>
    </el-card>
    <el-dialog v-el-drag-dialog :title="title" :visible.sync="addDialog" :before-close="handleClose" top="1vh" width="1800px">
      <information v-if="addDialog" :row="row" @cancel="cancel" @submit="submit"/>
    </el-dialog>
  </div>
</template>

<script>
import titleHeader from '@/components/title/index'
import { lists } from '@/api/alarmInfo'
import { listsNoPage } from '@/api/partition'
import { listsNoPage as defenseAreaList } from '@/api/defenseArea'
import { getLastMonth, getNowTime } from '@/utils/day'
import information from './information'
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Paginations'
import tableMixin from '@/mixins/tableMixin'
import { mapGetters } from 'vuex'

export default {
  components: {
    titleHeader,
    information,
    Pagination
  },
  directives: { elDragDialog },
  mixins: [tableMixin],
  computed: {
    ...mapGetters([
      'alarmInfo'
    ])
  },
  data () {
    return {
      disabled: true,
      order: null,
      sort: null,
      startTime: getLastMonth(),
      endTime: getNowTime(),
      boundaryId: null,
      areaId: null,
      areaOption: null,
      defenseAreaOption: null,
      tableData: null,
      keyword: null,
      alarmType: null,
      alarmOption: [{
        label: '一级告警',
        value: 1
      }, {
        label: '二级告警',
        value: 2
      }, {
        label: '三级告警',
        value: 3
      }],
      status: null,
      statusOption: [{
        label: '未处理',
        value: 1
      }, {
        label: '已处理',
        value: 2
      }]
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
    },
    alarmInfo: {
      handler (newVal) {
        if (newVal) {
          this.title = '查看'
          this.row = this.alarmInfo
          this.readonly = true
          this.addDialog = true
          this.$store.commit('clearAlarmInfo')
        }
      },
      deep: true,
      immediate: true
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
      lists(this.page.pageNum, this.page.pageSize, this.order, this.sort, this.boundaryId, this.areaId, this.alarmType, this.status, this.startTime, this.endTime, this.keyword).then(response => {
        this.tableData = response.data.dataList
        this.page = response.data.page
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

</style>
