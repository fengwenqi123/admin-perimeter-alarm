<template>
  <div class="container">
    <div class="common">
      <div class="label">一级告警设置:</div>
      <div class="value">
        <el-tooltip :content="'状态:' + getStatus(val.oneLevelStatus)" placement="top">
          <el-switch
            v-model="val.oneLevelStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value='1'
            inactive-value='2'>
          </el-switch>
        </el-tooltip>
          <div class="checkbox">
            <el-checkbox v-model="val.oneLevelJson.VoiceStatus">声光告警</el-checkbox>
            <el-checkbox v-model="val.oneLevelJson.LightStatus">灯光告警</el-checkbox>
            <el-checkbox v-model="val.oneLevelJson.CenterStatus">指挥中心告警</el-checkbox>
          </div>
      </div>
    </div>

    <div class="common">
      <div class="label">二级告警设置:</div>
      <div class="value">
        <el-tooltip :content="'状态:' + getStatus(val.twoLevelStatus)" placement="top">
          <el-switch
            v-model="val.twoLevelStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value='1'
            inactive-value='2'>
          </el-switch>
        </el-tooltip>
        <div class="checkbox">
          <el-checkbox v-model="val.twoLevelJson.VoiceStatus">声光告警</el-checkbox>
          <el-checkbox v-model="val.twoLevelJson.LightStatus">灯光告警</el-checkbox>
          <el-checkbox v-model="val.twoLevelJson.CenterStatus">指挥中心告警</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'baseInfo',
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
      return val === '1' ? '启用' : '禁用'
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .common {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;

    .label {
      width: 100px;
      text-align: right;
    }

    .value {
      margin-left: 20px;
      .checkbox{
        margin-top: 20px;
      }
    }
  }

  .common:last-child {
    margin: 0px;
  }
}
</style>
