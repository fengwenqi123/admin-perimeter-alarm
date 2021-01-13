<template>
<div class="container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>分区信息</span>
    </div>
      <div class="common">
        <div class="label">名称</div>
        <div class="value">
          <el-input
            placeholder="请输入内容"
            v-model="val.name"
            clearable>
          </el-input>
        </div>
      </div>
    <div class="common">
      <div class="label">描述</div>
      <div class="value">
        <el-input
          placeholder="请输入内容"
          v-model="val.description"
          clearable>
        </el-input>
      </div>
    </div>
    <div class="common">
      <div class="label">状态</div>
      <div class="value">
        <el-tooltip :content="'状态:' + getStatus(val.status)" placement="top">
          <el-switch
            v-model="val.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value='1'
            inactive-value='2'>
          </el-switch>
        </el-tooltip>
      </div>
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'essentialInfo',
  props: {
    Val: {
      type: Object
    }
  },
  computed: {
    val: {
      get () {
        return this.Val
      },
      set (val) {
        this.$emit('update:Val', val)
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    getStatus (val) {
      var status = null
      if (val === '1') {
        status = '启用'
      } else {
        status = '禁用'
      }
      return status
    }
  }
}
</script>

<style scoped lang="scss">

</style>
