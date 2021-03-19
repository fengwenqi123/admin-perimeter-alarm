<template>
  <div class="container home" v-if="mapList">
    <div class="dropdown">
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link"
          >{{ nowVal.name }}<i class="el-icon-arrow-down el-icon--right"></i
        ></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in mapList"
            :command="item.id"
            :key="item.id"
            >{{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="controller">
      <div class="add" @click="add()">
        <el-button icon="el-icon-plus" circle></el-button>
      </div>
      <div class="reset" @click="reset()">
        <el-button icon="el-icon-refresh" circle></el-button>
      </div>
      <div class="del" @click="del()">
        <el-button icon="el-icon-minus" circle></el-button>
      </div>
    </div>
    <div class="image">
      <div class="dragged" v-dragged="onDragged" ref="dragged">
        <div
          @wheel="handleScroll"
          class="img"
          :style="{
            width: image.width + 'px',
            height: image.height + 'px',
            marginLeft: (image.width / 2) * -1 + 'px'
          }"
        >
          <img id="image" v-if="image.width" :src="nowImg" ref="image" alt="" />
          <div
            class="icon"
            @click="showDiaLog(item.id, item.name)"
            v-for="item in boundaryJson"
            :style="{
              left: item.x * image.width - 30 + 'px',
              top: item.y * image.height - 30 - 12 + 'px',
              color:
                item.alarmType == 0
                  ? '#00FF7F'
                  : item.alarmType == 1
                  ? '#FF0000'
                  : item.alarmType == 2
                  ? '#FF7F50'
                  : '#FFFF00'
            }"
            :key="item.id"
          >
            <el-badge :value="item.unHandles" :max="999" class="item">
              <div class="name">{{ item.name }}</div>
            </el-badge>
            <svg-icon icon-class="monitor" />
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-el-drag-dialog
      :title="title"
      width="1200px"
      :visible.sync="addDialog"
      :modal="false"
      :close-on-click-modal="false"
      top="12vh"
    >
      <information v-if="addDialog" :id="boundaryId" />
    </el-dialog>
  </div>
</template>

<script>
import jc from '@/assets/img/jc.png'
import { listsNoPage, level } from '@/api/map'
import information from './information'
import elDragDialog from '@/directive/el-drag-dialog'
import bus from '@/components/bus'

let image = null
const maxWidth = 1920
export default {
  directives: {
    elDragDialog
  },
  components: {
    information
  },
  data () {
    return {
      modal: false,
      title: null,
      jc: jc,
      mapList: null,
      nowVal: null,
      imgUrl: process.env.VUE_APP_BASE_API + 'boundary/images/',
      checkedPartitionName: null,
      image: {
        width: null,
        height: null
      },
      addDialog: false,
      boundaryId: null,
      boundaryJson: null,
      clearTime: null,
      num: 1.2
    }
  },
  computed: {
    nowImg () {
      if (this.nowVal) {
        return this.imgUrl + this.nowVal.imageUrl
      }
      return false
    }
  },
  watch: {
    nowVal: {
      handler (newVal) {
        this.getLevel(newVal.id)
        image = new Image()
        image.src = this.nowImg
        image.onload = () => {
          this.image.width = maxWidth
          this.image.height = (image.height * maxWidth) / image.width
          this.$nextTick(() => {
            this.$refs.image.onmousedown = e => {
              e.preventDefault()
            }
          })
        }
      },
      deep: true
    }
  },
  created () {
    this.list()
  },
  mounted () {
    this.getBoundaryloop()
  },
  beforeDestroy () {
    if (this.clearTime) {
      clearInterval(this.clearTime) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    handleScroll (e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      if (eventDelta > 0) {
        this.add()
      } else {
        this.del()
      }
    },
    list () {
      listsNoPage().then(response => {
        this.mapList = response.data
        this.nowVal = response.data[0]
      })
    },
    // 获取对应分区告警级别
    getLevel (id) {
      const boundaryJson = JSON.parse(this.nowVal.boundaryJson)
      level(id).then(response => {
        response.data.forEach(item => {
          boundaryJson.forEach(boundary => {
            if (item.id === boundary.id) {
              boundary.alarmType = item.alarmType
              boundary.unHandles = item.unHandles
            }
          })
        })
        this.boundaryJson = boundaryJson
        this.getVideoList(boundaryJson)
      })
    },
    getBoundaryloop () {
      this.clearTime = setInterval(() => {
        this.getLevel(this.nowVal.id)
      }, 10000)
    },
    handleCommand (command) {
      this.mapList.forEach(item => {
        if (item.id === command) {
          this.nowVal = item
        }
      })
    },
    showDiaLog (id, name) {
      this.title = name
      this.boundaryId = id
      this.addDialog = true
    },
    getVideoList (obj) {
      console.log(obj)
      bus.$emit('video-list', obj)
    },
    add () {
      if (this.image.width / maxWidth < 3) {
        this.image.width = this.image.width * this.num
        this.image.height = this.image.height * this.num
      }
    },
    del () {
      if (maxWidth / this.image.width < 3) {
        this.image.width = this.image.width / this.num
        this.image.height = this.image.height / this.num
      }
    },
    reset () {
      this.image.width = maxWidth
      this.image.height = (image.height * maxWidth) / image.width
      this.$refs.dragged.style.top = 0
      this.$refs.dragged.style.left = 0
    },
    onDragged ({
      el,
      deltaX,
      deltaY
    }) {
      var l = +window.getComputedStyle(el).left.slice(0, -2) || 0
      var t = +window.getComputedStyle(el).top.slice(0, -2) || 0
      el.style.left = l + deltaX + 'px'
      el.style.top = t + deltaY + 'px'
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  position: relative;

  .dropdown {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 9;

    .el-dropdown-link {
      font-size: 25px;
      color: #fff;
      cursor: pointer;
      text-shadow: #000 1px 0 0, #000000 0 1px 0, #000000 -1px 0 0, #000000 0 -1px 0;
    }
  }

  .controller {
    display: flex;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    width: 140px;
    justify-content: space-between;

    .svg-icon {
      cursor: pointer;
      font-size: 30px;
      color: #ccc;
    }
  }

  .image {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .dragged{
      position: relative;
      width: 100%;
    }
  }

  .img {
    position: absolute;
    left: 50%;
    transition: all 0.5s;
    #image {
      width: 100%;
    }

    .icon {
      transition: all 0.5s;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      position: absolute;
      cursor: pointer;
      width: 60px;
      height: 60px;

      .name {
        font-size: 12px;
      }

      .svg-icon {
        font-size: 40px;
      }
    }
  }
}
</style>
