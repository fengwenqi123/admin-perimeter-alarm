<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分区信息</span>
      </div>
      <div class="main">
      <div class="form">
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
          <div class="label">描述:</div>
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
        <div class="common">
          <el-upload
            class="upload-demo"
            action=""
            :auto-upload=false
            :show-file-list=false
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传分区图</el-button>
          </el-upload>
        </div>
        <p>设置原（零）点[x,y]</p>
        <div class="common">
          <div class="label">激光坐标:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="laser1"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">平面坐标:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="plane1"
              clearable>
            </el-input>
            <i class="el-icon-aim" @click="editActive(1)"></i>
          </div>
        </div>

        <p>设置校正点[x,y]</p>
        <div class="common">
          <div class="label">激光坐标:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="laser2"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="common">
          <div class="label">平面坐标:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="plane2"
              clearable>
            </el-input>
            <i class="el-icon-aim" @click="editActive(2)"></i>
          </div>
        </div>
      </div>
      <div class="other">
        <div class="common file pic">
<!--          <input type="file" name="" id="" @change="chose">-->

<!--          <el-upload-->
<!--            action=""-->
<!--            :auto-upload=false-->
<!--            list-type="picture-card"-->
<!--            :on-change="handlePreview"-->
<!--            :on-remove="handleRemove">-->
<!--            <i class="el-icon-plus"></i>-->
<!--          </el-upload>-->
          <canvas v-if="image" id="myCanvas"></canvas>
<!--          <div v-else class="up-load">-->
<!--            <i class="el-icon-plus"></i>-->
<!--          </div>-->
        </div>
      </div>
      </div>
    </el-card>
  </div>
</template>

<script>
const STARTCOLOR = '#00FF00'
const ENDCOLOR = 'red'
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
    },
    point () {
      var laser1 = this.laser1 || { X: 0, Y: 0 }
      var laser2 = this.laser2 || { X: 0, Y: 0 }
      var plane1 = this.plane1 || { X: 0, Y: 0 }
      var plane2 = this.plane2 || { X: 0, Y: 0 }
      return [laser1, plane1, laser2, plane2]
    }
  },
  watch: {
    point: {
      handler (newVal) {
        this.val.point = newVal
      },
      deep: true
    },
    plane1 () {
      this.ctx.clearRect(0, 0, this.image.width, this.image.height)
      this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
      this.draw(this.plane1, this.plane2)
    },
    plane2 () {
      this.ctx.clearRect(0, 0, this.image.width, this.image.height)
      this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
      this.draw(this.plane1, this.plane2)
    }
  },
  data () {
    return {
      ctx: null,
      canvas: null,
      laser1: null,
      laser2: null,
      plane1: null,
      plane2: null,
      active: null,
      image: null,
      fileList: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    handleRemove () {
      this.ctx.clearRect(0, 0, this.image.width, this.image.height)
    },
    handlePreview (file) {
      console.log(file)
      this.chose(file.raw)
    },
    init () {
      if (this.val.image) {
        this.image = new Image()
        this.image.src = this.val.image
        this.image.onload = () => {
          this.canvasDrawImg()
          if (this.val.point) {
            this.laser1 = `${this.val.point[0].X},${this.val.point[0].Y}`
            this.plane1 = `${this.val.point[1].X},${this.val.point[1].Y}`
            this.laser2 = `${this.val.point[2].X},${this.val.point[2].Y}`
            this.plane2 = `${this.val.point[3].X},${this.val.point[3].Y}`
          }
          // 即为转换为base64格式的图片形式
        }
      }
    },
    draw (p1, p2) {
      if (p1) {
        var arr = p1.split(',')
        this.ctx.fillStyle = STARTCOLOR
        this.ctx.beginPath()
        this.ctx.arc(arr[0] * this.canvas.width, arr[1] * this.canvas.height, 5, 0, Math.PI * 2, true)
        this.ctx.closePath()
        this.ctx.fill()
      }
      if (p2) {
        var arr1 = p2.split(',')
        this.ctx.fillStyle = ENDCOLOR
        this.ctx.beginPath()
        this.ctx.arc(arr1[0] * this.canvas.width, arr1[1] * this.canvas.height, 5, 0, Math.PI * 2, true)
        this.ctx.closePath()
        this.ctx.fill()
      }
    },
    getStatus (val) {
      return val === '1' ? '启用' : '禁用'
    },
    // 即为转换为base64格式的图片形式
    baseImg () {
      var ext = this.image.src.substring(this.image.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = this.canvas.toDataURL('image/' + ext)
      return dataURL
    },
    chose (raw) {
      if (raw) {
        this.image = new Image()
        this.plane1 = null
        this.plane2 = null
        this.image.src = window.URL.createObjectURL(raw)
        this.image.onload = () => {
          this.canvasDrawImg()
          this.val.image = this.baseImg()
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
    // 获取定位点，标记
    pointFun (event) {
      var rect = this.canvas.getBoundingClientRect()
      var diffX = event.clientX - rect.left
      var diffY = event.clientY - rect.top
      var x = (diffX / this.canvas.width).toFixed(10)
      var y = (diffY / this.canvas.height).toFixed(10)
      if (this.active === 1) {
        this.plane1 = `${x},${y}`
      }
      if (this.active === 2) {
        this.plane2 = `${x},${y}`
      }
      this.canvas.removeEventListener('click', this.pointFun)
    },
    // 添加点击事件
    editActive (i) {
      this.active = i
      this.canvas.addEventListener('click', this.pointFun)
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .box-card {
    .main{
      display: flex;
      align-items: flex-start;
    }
    .common {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .label{
        width: 90px;
        text-align: right;
      }

      .value {
        margin-left: 20px;
        display: flex;
        align-items: center;
        .el-icon-aim{
          margin-left: 6px;
        }
      }
    }

    .common:last-child {
      margin: 0px;
    }

    .other {
      margin-left: 50px;
      display: flex;
      align-items: flex-start;

      .common {
        width: 400px;
        i {
          margin-left: 10px;
          cursor: pointer;
        }
        .up-load{
          background-color: #fbfdff;
          border: 1px dashed #c0ccda;
          border-radius: 6px;
          box-sizing: border-box;
          width: 248px;
          height: 248px;
          line-height: 246px;
          vertical-align: top;
          text-align: center;
          i{
            margin: 0 auto;
            font-size: 30px;
          }
        }
      }
      .file {
        margin-left: 20px;
        width: auto;
      }
      .pic{
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
.upload-demo{
  display: flex;
  align-items: center;
}
</style>
