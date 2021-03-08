<template>
  <div class="information">
    <div class="information-main">
      <el-scrollbar class="scrolls">
        <div class="information-form">
          <info :Val.sync="infoVal"></info>
        </div>
      </el-scrollbar>
    </div>
    <div slot="footer" class="information-foot">
      <el-button
        icon="el-icon-document"
        size="small"
        class="blueButton"
        @click="submit()"
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
import info from './information/info'
import dialogFormMixin from '@/mixins/dialogFormMixin'
import { add } from '@/api/map'

export default {
  mixins: [dialogFormMixin],
  props: {
    row: {
      type: Object
    }
  },
  components: {
    info
  },
  data () {
    return {
      infoVal: {
        id: null,
        name: null,
        selectArea: [{
          id: null,
          name: null,
          x: null,
          y: null,
          LiveChannelStream: null,
          liveCaptureUrl: null
        }],
        imageUrl: null
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.row) {
        this.infoVal.id = this.row.id
        this.infoVal.imageUrl = this.row.imageUrl
        this.infoVal.name = this.row.name
        this.infoVal.selectArea = JSON.parse(this.row.boundaryJson)
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    submit () {
      add({
        id: this.row ? this.row.id : null,
        name: this.infoVal.name,
        imageUrl: this.infoVal.imageUrl,
        boundaryJson: JSON.stringify(this.infoVal.selectArea),
        status: 1
      }).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.$emit('submit')
      })
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.information-main {
  height: 700px;
}
</style>
