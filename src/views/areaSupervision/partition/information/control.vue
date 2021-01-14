<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>服务信息</span>
      </div>
      <div class="main">
        <div class="common">
          <div class="label">IP:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val.ip"
              clearable>
            </el-input>
          </div>
        </div>

        <div class="common">
          <div class="label">端口:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val.port"
              clearable>
            </el-input>
          </div>
        </div>

        <div class="common">
          <div class="label">告警图片地址:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val.imageUrl"
              clearable>
            </el-input>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'control',
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
  }
}
</script>

<style scoped lang="scss">
.container {
  .box-card {
    .common {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-left: 400px;
      .label{
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
  }
}
</style>
