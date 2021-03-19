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
      i: null,
      handleClose: null

    }
  },
  created () {
    this.onBus()
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
    },
    i (newVal) {
      this.inx = this.list[newVal].id
    }
  },
  methods: {
    onBus () {
      bus.$on('video-list', arr => {
        if (JSON.stringify(this.list) !== JSON.stringify(arr)) {
          this.list = arr
          this.init(arr)
          this.handleClose && clearInterval(this.handleClose)
          this.ergodic()
        }
      })
    },
    init (arr) {
      this.i = null
      this.$nextTick(() => {
        this.i = 0
      })
      this.list1 = []
      this.list2 = []
      arr.forEach((item, index) => {
        if (index < 6) {
          this.list1.push(item)
        } else {
          this.list2.push(item)
        }
      })
    },
    handleSelect (item) {
      this.list.forEach((li, index) => {
        if (li.id === item.id) {
          this.i = index
        }
      })
    },
    // loop播放列表
    ergodic () {
      this.handleClose = setInterval(() => {
        if (this.list.length > 1) {
          if (this.i < this.list.length - 1) {
            this.i += 1
          } else {
            this.i = 0
          }
        }
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
