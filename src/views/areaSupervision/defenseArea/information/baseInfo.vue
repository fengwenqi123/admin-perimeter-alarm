<template>
  <div class="container">
    <div class="common">
      <div class="label">名称:</div>
      <div class="value">
        <el-input
          placeholder="请输入内容"
          v-model="val.name"
          clearable>
        </el-input>
      </div>
    </div>
    <div class="common">
      <div class="label">优先级:</div>
      <div class="value">
        <el-select clearable v-model="val.level" placeholder="请选择">
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="common">
      <div class="label">状态:</div>
      <div class="value">
        <el-select clearable v-model="val.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="common">
      <div class="label">描述:</div>
      <div class="value">
        <el-input
          type="textarea"
          :rows="4"
          v-model="val.description"
          placeholder="请输入内容">
        </el-input>
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
      levelOptions: [{
        value: '1',
        label: '1'
      }, {
        value: '2',
        label: '2'
      }, {
        value: '3',
        label: '3'
      }, {
        value: '4',
        label: '4'
      }],
      statusOptions: [{
        value: '1',
        label: '布防'
      }, {
        value: '2',
        label: '撤防'
      }, {
        value: '3',
        label: '旁路'
      }]
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
</style>
