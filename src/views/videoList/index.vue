<template>
  <div class="container">
    <el-card class="box-card">
      <div class="line1">
        <div class="video" v-if="video">
          <flv :val="video"></flv>
        </div>
        <div class="img">
          <img
            class="image"
            v-for="(item) in list1"
            :key="item.id"
            :src="item.liveCaptureUrl"
            alt=""
            :class="{ inx: item.id === inx }"
            @click="handleSelect(item)"
          />
        </div>
      </div>
      <div class="line2" v-if="list2">
        <div class="img">
          <img
            v-for="item in list2"
            :key="item.id"
            :src="item.liveCaptureUrl"
            alt=""
            :class="{ inx: item.id === inx }"
            @click="handleSelect(item)"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import flv from '@/components/flv/index'
import bus from '@/components/bus'

export default {
  components: {
    flv
  },
  data () {
    return {
      video: null,
      list: null,
      list1: [],
      list2: [],
      inx: null,
      i: 0,
      handleClose: null,
      flag: true

    }
  },
  created () {
    this.onBus()
    this.ergodic()
  },
  watch: {
    inx (newVal) {
      this.list.forEach((item) => {
        if (newVal === item.id) {
          this.video = {
            id: `flv_${item.id}`,
            url: item.LiveChannelStream
          }
          console.log(this.video)
        }
      })
    }
  },
  methods: {
    onBus () {
      bus.$on('video-list', arr => {
        this.list = arr
        this.init(arr)
      })
    },
    init (arr) {
      this.list1 = []
      this.list2 = []
      if (this.flag) {
        this.inx = arr[0].id
        this.flag = false
      }
      arr.forEach((item, index) => {
        if (index < 6) {
          this.list1.push(item)
        } else {
          this.list2.push(item)
        }
      })
      // clearInterval(this.handleClose)
      // this.ergodic()
    },
    handleSelect (item) {
      this.inx = item.id
    },
    // loop播放列表
    ergodic () {
      this.i = 0
      this.handleClose = setInterval(() => {
        if (this.i < this.list.length) {
          this.inx = this.list[this.i].id
        }
        if (this.i === this.list.length) {
          this.i = 0
          this.inx = this.list[this.i].id
        }
        console.log(this.i)
        this.i += 1
      }, 12000)
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 0px 20px;

  .line1 {
    display: flex;

    .video {
      width: 1200px;
      height: 594px;
    }

    .img {
      margin-left: 10px;
      flex: 1;

      .image {
        width: 300px;
        height: 196px;
      }
    }
  }

  .line2 {
    .img {
      display: flex;
      flex-wrap: wrap;

      img {
        width: 300px;
        height: 190px;
      }
    }
  }
}
.inx {
  border: 2px solid #1482f0;
}
</style>
