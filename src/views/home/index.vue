<template>
  <div class="container home" v-if="mapList">
    <div class="dropdown">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link"
          >{{ nowVal.name }}<i class="el-icon-arrow-down el-icon--right"></i
        ></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in mapList"
            :command="item.id"
            :key="item.id"
            >{{ item.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-scrollbar class="scrolls">
      <div class="img">
        <img :src="nowImg" ref="image" alt="" />
        <template>
          <svg-icon
            @click.native="showDiaLog(item.id,item.name)"
            v-for="item in nowVal.boundaryJson"
            :style="{
              left: item.x * image.width - 15 + 'px',
              top: item.y * image.height - 15 + 'px',
              color:item.alarmType==0?'#00FF7F':item.alarmType==1?'#FF0000':item.alarmType==2?'#FF7F50':'#FFFF00'
            }"
            :key="item.id"
            icon-class="monitor"
          />
        </template>
      </div>
    </el-scrollbar>
    <el-dialog
      v-el-drag-dialog
      :before-close="handleClose"
      :title="title"
      width="1800px"
      :visible.sync="addDialog"
      :modal='modal'
      top="3vh">
      <information
        v-if="addDialog"
        :id="boundaryId"
        @cancel="cancel"
        @submit="submit"
      />
    </el-dialog>
  </div>
</template>

<script>
import jc from '@/assets/img/jc.png'
import { listsNoPage, level } from '@/api/map'
import information from './information'
import elDragDialog from '@/directive/el-drag-dialog'
import tableMixin from '@/mixins/tableMixin'
import bus from '@/components/bus'

export default {
  directives: { elDragDialog },
  mixins: [tableMixin],
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
      boundaryId: null
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
        const image = new Image()
        image.src = this.imgUrl + this.nowVal.imageUrl
        image.onload = () => {
          this.image.width = this.$refs.image.width
          this.image.height = this.$refs.image.height
          // console.log(this.$refs.image.height)
        }
      },
      deep: true
    }
  },
  created () {
    this.list()
  },
  methods: {
    list () {
      listsNoPage().then(response => {
        this.mapList = response.data
        this.nowVal = response.data[0]
      })
    },
    // 获取对应分区告警级别
    getLevel (id) {
      if (Array.isArray(this.nowVal.boundaryJson)) {
        return
      }
      const boundaryJson = JSON.parse(this.nowVal.boundaryJson)
      level(id).then(response => {
        response.data.forEach(item => {
          boundaryJson.forEach(boundary => {
            if (item.id === boundary.id) {
              boundary.alarmType = item.alarmType
            }
          })
        })
        this.nowVal.boundaryJson = boundaryJson
        this.getVideoList(boundaryJson)
      })
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
      bus.$emit('video-list', obj)
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
    top: 0px;
    left: -120px;
    z-index: 9;
  }

  .img {
    width: 1480px;
    height: 100%;
    position: relative;

    img {
      width: 100%;
    }

    .svg-icon {
      font-size: 30px;
      position: absolute;
      cursor: pointer;
    }
  }
}
</style>
