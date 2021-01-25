<template>
<div class="container">
  <el-time-select
    placeholder="起始时间"
    v-model="val.startTime"
    value-format="HH:mm"
    size="mini"
    :picker-options="{
      start: '00:00',
      step: '00:15',
      end: '24:00'
    }">
  </el-time-select>
  <span>-</span>
  <el-time-select
    placeholder="结束时间"
    v-model="val.endTime"
    value-format="HH:mm"
    size="mini"
    :picker-options="{
      start: '00:00',
      step: '00:15',
      end: '24:00',
      minTime: val.startTime
    }">
  </el-time-select>
</div>
</template>

<script>
export default {
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

</style>
