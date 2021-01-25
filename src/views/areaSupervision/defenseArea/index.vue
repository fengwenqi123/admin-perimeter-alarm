<template>
  <div class="common-table">
    <div class="title">
      <title-header />
    </div>
    <el-card class="content">
        <div class="search">
          <el-form :inline="true" class="form-inline" label-width="120px">
            <el-form-item label="所属分区">
              <el-select v-model="area" clearable placeholder="请选择">
                <el-option
                  v-for="item in areaOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="state" clearable placeholder="请选择">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-input
                v-model="keyword"
                placeholder="请输入关键字"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" class="blueButton" @click="search">查询
              </el-button>
            </el-form-item>
          </el-form>
          <div class="table_search_buttonLeft">
            <el-button type="primary" icon="el-icon-circle-plus" size="small" class="blueButton" @click="add">添加
            </el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            ref="multipleTable"
            :height="tableHeight"
            stripe
            border
            :data="tableData"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
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
              prop="name"
              label="名称"
            />
            <el-table-column
              prop="boundaryName"
              label="分区"
            />
            <el-table-column
              prop="templateName"
              label="模版"
            />
            <el-table-column
              prop="level"
              sortable
              label="优先级"
            />
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                {{scope.row.status===1?'布防':scope.row.status===2?'撤防':'旁路'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              sortable
              label="描述"
            />
            <el-table-column
              label="操作"
              fixed="right"
              width="220"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <div class="operation">
                    <el-button class="table_button" icon="el-icon-edit-outline" size="small" type="text"
                               @click="handleClickModify(scope.row)">编辑
                    </el-button>
                  </div>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      <div class="bottom">
        <div class="option">
          <el-checkbox
            v-model="checked"
            @change="toggleSelection(checked)"
          >全选</el-checkbox>
          <el-button
            class="whiteButton"
            icon="el-icon-delete"
            size="small"
            @click="del"
          >
            批量删除
          </el-button>
          <el-button
            class="whiteButton"
            icon="el-icon-circle-check"
            size="small"
            @click="Defence"
          >
            一键布防
          </el-button>
          <el-button
            class="whiteButton"
            icon="el-icon-circle-close"
            size="small"
            @click="Garrison"
          >
            一键撤防
          </el-button>
          <el-button
            class="whiteButton"
            icon="el-icon-circle-close"
            size="small"
            @click="Bypass"
          >
            一键旁路
          </el-button>
          <span class="checkNum">已选择{{ selectData.length }}项</span>
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
      <el-dialog v-el-drag-dialog :title="title" :visible.sync="addDialog" :before-close="handleClose" top="3vh" width="80%">
        <information v-if="addDialog" :id="row_id" :areaInfo="areaInfo" @cancel="cancel" @submit="submit" />
      </el-dialog>
  </div>
</template>

<script>
import titleHeader from '@/components/title/index'
import { listsNoPage } from '@/api/partition'
import { lists, delt, defence, garrison, bypass } from '@/api/defenseArea'
import information from './information'
import Pagination from '@/components/Paginations'
import elDragDialog from '@/directive/el-drag-dialog'
import tableMixin from '@/mixins/tableMixin'

export default {
  components: {
    titleHeader,
    information,
    Pagination
  },
  directives: { elDragDialog },
  mixins: [tableMixin],
  data () {
    return {
      order: null,
      sort: null,
      keyword: null,
      tableData: [],
      areaOption: null,
      area: null,
      stateOptions: [{
        value: 1,
        label: '布防'
      }, {
        value: 2,
        label: '撤防'
      }, {
        value: 3,
        label: '旁路'
      }],
      state: null,
      row_id: null,
      areaInfo: null
    }
  },
  created () {
    this.getArea()
  },
  watch: {
    area () {
      this.areaOption.forEach(item => {
        if (item.id === this.area) {
          this.areaInfo = item
        }
      })
    }
  },
  methods: {
    getArea () {
      listsNoPage().then(response => {
        this.areaOption = response.data
        if (response.data) {
          this.area = response.data[0].id
        }
        this.list()
      })
    },
    add () {
      this.title = '新增'
      this.addDialog = true
    },
    handleClickModify (row) {
      this.title = '编辑'
      this.row_id = row.id
      this.addDialog = true
    },
    handleClose () {
      this.addDialog = false
      this.row_id = null
      this.readonly = false
    },
    list () {
      lists(this.page.pageNum, this.page.pageSize, this.order, this.sort, this.area, this.state, this.keyword).then(response => {
        this.tableData = response.data.dataList
        this.page = response.data.page
      })
    },
    _delt (listId) {
      delt(listId).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.list()
      })
    },
    _defence (listId) {
      defence(listId).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.list()
      })
    },
    _garrison (listId) {
      garrison(listId).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.list()
      })
    },
    _bypass (listId) {
      bypass(listId).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.list()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
