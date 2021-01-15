<template>
  <div class="container">
    <div class="common">
      <div class="label">选择模版:</div>
      <div class="value">
        <el-select v-model="val.templateId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import { listsNoPage } from '@/api/timeTemplate'
export default {
  name: 'baseInfo',
  props: {
    Val: {
      type: Object
    }
  },
  watch: {
    val: {
      handler (newVal) {
        if (this.options) {
          this.options.forEach(item => {
            if (item.id === newVal.templateId) {
              newVal.templateName = item.name
            }
          })
        }
      },
      deep: true
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
  created () {
    this.list()
  },
  data () {
    return {
      options: null
    }
  },
  methods: {
    list () {
      listsNoPage().then(response => {
        this.options = response.data
      })
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
