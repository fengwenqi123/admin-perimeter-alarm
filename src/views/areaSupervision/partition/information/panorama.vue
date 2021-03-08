<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>摄像机配置</span>
      </div>
      <div class="main">
        <div class="common">
          <div class="label">名称:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].Title"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">IP:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].IP"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">端口:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].Port"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">账号:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].UserName"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">密码:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].Password"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">通道:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].Channel"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">码流:</div>
          <div class="value">
            <el-select v-model="val[0].StreamType" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="common">
          <div class="label">直播地址:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].LiveChannelStream"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">直播名称:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].LiveName"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">应用名称:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].AppName"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">直播截图:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[0].liveCaptureUrl"
              clearable>
            </el-input>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>回放配置</span>
      </div>
      <div class="main">
        <div class="common">
          <div class="label">IP:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[1].IP"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">端口:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[1].Port"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">账号:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[1].UserName"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">密码:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[1].Password"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">通道:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="val[1].Channel"
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
  name: 'Track',
  props: {
    Val: {
      type: Array
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
      options: [{
        value: 0,
        label: '主码流'
      }, {
        value: 1,
        label: '子码流'
      }],
      value: ''
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .box-card {
    .main{
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
    }
    .common {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .label{
        width: 80px;
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
  .box-card:last-child{
    margin-top: 20px;
  }
}
</style>
