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
          label-width="120px"
        >
          <el-form-item label="关键字">
            <el-input
              v-model="keyword"
              clearable
              placeholder="请输入关键字"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="status" clearable placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
        <div class="table_search_buttonLeft">
          <el-button
            class="blueButton"
            icon="el-icon-circle-plus"
            size="small"
            type="primary"
            @click="add"
          >
            添加
          </el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          :height="tableHeight"
          stripe
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="序号"
            prop="Id"
            width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + (page.pageNum - 1) * page.pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            prop="name"
          />
          <el-table-column
            label="状态"
            prop="status">
            <template slot-scope="scope">
              {{scope.row.status==1?'启用':'禁用'}}
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="description"
          />
          <el-table-column
            fixed="right"
            label="操作"
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
          >全选
          </el-checkbox>
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
            @click="Enable"
          >
            批量启用
          </el-button>
          <el-button
            class="whiteButton"
            icon="el-icon-circle-close"
            size="small"
            @click="Disable"
          >
            批量禁用
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
    <el-dialog
      v-el-drag-dialog
      :before-close="handleClose"
      :title="title"
      width="90%"
      :visible.sync="addDialog"
      top="3vh">
      <information
        v-if="addDialog"
        :readonly="readonly"
        :id="row_id"
        @cancel="cancel"
        @submit="submit"
      />
    </el-dialog>
  </div>
</template>

<script>
import titleHeader from '@/components/title/index'
import { lists } from '@/api/partition'
import Pagination from '@/components/Paginations'
import elDragDialog from '@/directive/el-drag-dialog'
import tableMixin from '@/mixins/tableMixin'
import information from './information'

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
      border: true,
      row_id: null,
      order: null,
      sort: null,
      status: null,
      keyword: null,
      tableData: [],
      statusList: [{
        label: '启用',
        value: 1
      }, {
        label: '禁用',
        value: 2
      }]
    }
  },
  created () {
    this.list()
  },
  methods: {
    add () {
      this.title = '新增'
      this.addDialog = true
      this.row_id = null
    },
    handleClickModify (row) {
      this.title = '编辑'
      this.row_id = row.id
      this.addDialog = true
    },
    list () {
      lists(
        this.page.pageNum,
        this.page.pageSize,
        this.order,
        this.sort,
        this.status,
        this.keyword
      ).then(response => {
        this.tableData = response.data.dataList
        this.page = response.data.page
      })
    },
    _delt (listId) {

    },
    _enable (listId) {
    },
    _disable (listId) {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
