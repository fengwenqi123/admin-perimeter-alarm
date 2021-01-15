<template>
<div class="container">
  <div class="common">
    <div class="label">最近距离（米）:</div>
    <div class="value">
      <el-input
        placeholder="请输入内容"
        v-model="val.minDistance"
        clearable>
      </el-input>
    </div>
  </div>
  <div class="common">
    <div class="label">最远距离（米）:</div>
    <div class="value">
      <el-input
        placeholder="请输入内容"
        v-model="val.maxDistance"
        clearable>
      </el-input>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'alarmArea',
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
  .common {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .label {
      width: 140px;
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
</style>
