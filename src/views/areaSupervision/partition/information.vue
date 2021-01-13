<template>
  <div class="information">
    <div class="information-main">
      <el-scrollbar class="scrolls">
        <div class="information-form">
          <el-tabs :tab-position="tabPosition" style="height: 600px;" type="border-card">
            <el-tab-pane label="基本信息">
              <essentialInfo :Val.sync="essentialInfoVal"></essentialInfo>
            </el-tab-pane>
            <el-tab-pane label="控制服务">配置管理</el-tab-pane>
            <el-tab-pane label="追踪视频">角色管理</el-tab-pane>
            <el-tab-pane label="全景视频">定时任务补偿</el-tab-pane>
          </el-tabs>
        </div>
      </el-scrollbar>
    </div>
    <div slot="footer" class="information-foot"  v-if="!readonly">
      <el-button
        icon="el-icon-document"
        size="small"
        class="blueButton"
        @click="submitForm('addForm')"
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
import essentialInfo from './information/essentialInfo'
import dialogFormMixin from '@/mixins/dialogFormMixin'
export default {
  mixins: [dialogFormMixin],
  props: {
    readonly: {
      type: Boolean
    },
    id: {
      type: String
    }
  },
  components: {
    essentialInfo
  },
  data () {
    return {
      tabPosition: 'left',
      essentialInfoVal: {
        name: null,
        description: null,
        status: '1'
      }
    }
  },
  created () {
  },
  methods: {}

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
