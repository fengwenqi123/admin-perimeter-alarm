<template>
  <div class="container">
    <el-card class="box-card">
      <div class="main">
        <div class="form">
          <div class="common">
            <el-upload
              class="upload-demo"
              :action="upLoadImage"
              :auto-upload=true
              name="image"
              :show-file-list=false
              :on-change="handlePreview"
              :on-remove="handleRemove"
              :on-success="success"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传区域图</el-button>
            </el-upload>
          </div>
          <div class="common">
            <div class="label">区域名称:</div>
            <div class="value">
              <el-input
                placeholder="请输入内容"
                v-model="val.name"
                clearable>
              </el-input>
            </div>
          </div>
          <div class="common">
            <div class="label">选择分区:</div>
            <div class="value fq">
              <div class="area" v-for="(item,index) in selectArea" :key="index">
                <el-select v-model="item.id" placeholder="请选择">
                  <el-option
                    v-for="item in areaOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <i class="el-icon-aim" @click="editActive(item.name,index)"></i>
                <el-button class="button" icon="el-icon-plus" circle type="primary" @click="addArea()"></el-button>
                <el-button v-if="delFlag" class="button" icon="el-icon-minus" circle type="info"
                           @click="delArea(index)"></el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="other">
          <div class="common file pic">
            <canvas id="myCanvas"></canvas>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { listsNoPage } from '@/api/partition'
const STARTCOLOR = '#00FF00'
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
  },
  data () {
    return {
      image: null,
      fileList: [],
      canvas: null,
      ctx: null,
      areaOption: null,
      area: null,
      selectArea: null,
      delFlag: false,
      active: null,
      upLoadImage: process.env.VUE_APP_BASE_API + 'boundary/warnArea/upload/image'
    }
  },
  watch: {
    selectArea: {
      handler (newVal) {
        this.delFlag = newVal.length > 1
        newVal.forEach(item => {
          this.areaOption.forEach(area => {
            if (item.id === area.id) {
              item.name = area.name
              item.LiveChannelStream = JSON.parse(area.videoWholeJson)[0].LiveChannelStream
              item.liveCaptureUrl = JSON.parse(area.videoWholeJson)[0].liveCaptureUrl
            }
          })
        })
        if (this.ctx) {
          this.ctx.clearRect(0, 0, this.image.width, this.image.height)
          this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
          newVal.forEach(item => {
            if (item.x && item.y) {
              this.draw(item.x, item.y, item.name)
            }
          })
        }
      },
      deep: true
    }
  },
  created () {
    this.findAreaList()
  },
  methods: {
    init () {
      if (this.val.id) {
        this.image = new Image()
        this.image.src = process.env.VUE_APP_BASE_API + 'boundary/images/' + this.val.imageUrl
        this.image.onload = () => {
          this.canvasDrawImg()
          this.selectArea = this.val.selectArea
        }
      } else {
        this.selectArea = this.val.selectArea
      }
    },
    // 图片上传成功回调
    success (response) {
      this.val.imageUrl = response.data
    },
    handleRemove () {
      this.ctx.clearRect(0, 0, this.image.width, this.image.height)
    },
    handlePreview (file) {
      this.chose(file.raw)
      const obj = [{
        id: null,
        name: null,
        x: null,
        y: null,
        LiveChannelStream: null,
        liveCaptureUrl: null
      }]
      this.selectArea = this.val.selectArea = obj
    },
    chose (raw) {
      if (raw) {
        this.image = new Image()
        this.image.src = window.URL.createObjectURL(raw)
        this.image.onload = () => {
          this.canvasDrawImg()
        }
      }
    },
    // 初始化背景图
    canvasDrawImg () {
      this.canvas = document.getElementById('myCanvas')
      this.canvas.width = this.image.width
      this.canvas.height = this.image.height
      this.ctx = this.canvas.getContext('2d')
      this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
    },
    findAreaList () {
      listsNoPage().then(response => {
        this.areaOption = response.data
        this.init()
      })
    },
    // 点击定位按钮触发事件
    editActive (name, i) {
      if (!name) {
        this.$message('请先选择分区')
        return
      }
      this.active = i
      this.canvas.addEventListener('click', this.pointFun)
    },
    // 获取定位点，标记
    pointFun (event) {
      var rect = this.canvas.getBoundingClientRect()
      var diffX = event.clientX - rect.left
      var diffY = event.clientY - rect.top
      var x = (diffX / this.canvas.width).toFixed(10)
      var y = (diffY / this.canvas.height).toFixed(10)
      this.selectArea[this.active].x = x
      this.selectArea[this.active].y = y
      this.canvas.removeEventListener('click', this.pointFun)
    },
    addArea () {
      const obj = {
        id: null,
        name: null,
        x: null,
        y: null,
        LiveChannelStream: null,
        liveCaptureUrl: null
      }
      this.$set(this.selectArea, this.selectArea.length, obj)
    },
    delArea (index) {
      this.$delete(this.selectArea, index)
    },
    draw (x, y, name) {
      this.ctx.fillStyle = STARTCOLOR
      this.ctx.beginPath()
      this.ctx.arc(x * this.canvas.width, y * this.canvas.height, 5, 0, Math.PI * 2, true)
      this.ctx.font = '20px Arial'
      this.ctx.fillText(name, x * this.canvas.width, y * this.canvas.height - 5)
      this.ctx.closePath()
      this.ctx.fill()
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .box-card {
    .main {
      display: flex;
      align-items: flex-start;
    }

    .common {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .label {
        width: 90px;
        text-align: right;
      }

      .value {
        margin-left: 20px;
        display: flex;
        align-items: center;

        .el-icon-aim {
          margin-left: 6px;
        }
      }

      .fq {
        width: 400px;
        display: flex;
        flex-wrap: wrap;

        .area {
          margin-top: 10px;
        }
      }

      .el-icon-aim {
        margin-left: 6px;
        cursor: pointer;
      }

      .button {
        margin-left: 20px;
      }
    }

    .common:last-child {
      margin: 0px;
    }

    .other {
      width: 1078px;
      overflow-x: auto;
      margin-left: 50px;
      display: flex;
      align-items: flex-start;

      .common {
        width: 400px;

        i {
          margin-left: 10px;
          cursor: pointer;
        }

        .up-load {
          background-color: #fbfdff;
          border: 1px dashed #c0ccda;
          border-radius: 6px;
          box-sizing: border-box;
          width: 248px;
          height: 248px;
          line-height: 246px;
          vertical-align: top;
          text-align: center;

          i {
            margin: 0 auto;
            font-size: 30px;
          }
        }
      }

      .file {
        margin-left: 20px;
        width: auto;
      }

      .pic {
        overflow: auto;
      }
    }
  }
}

.common {
  .file {
    cursor: pointer;
    position: relative;
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    margin-right: 30px;
  }

  .file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
  }

  .file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
  }
}

.upload-demo {
  display: flex;
  align-items: center;
}
</style>
