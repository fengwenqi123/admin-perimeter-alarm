<template>
<div class="app">
  <video
    :id="val.id"
    controls = "true"
    muted
    class="video-class">
  </video>
</div>
</template>
<script>
import flvjs from 'flv.js'
export default {
  props: {
    val: {
      type: Object
    }
  },
  data () {
    return {
      flvPlayer: null
    }
  },
  watch: {
    val: {
      handler () {
        this.close()
        setTimeout(() => {
          this.play()
        }, 100)
      }
    }
  },
  mounted () {
    this.play()
  },
  methods: {
    play () {
      const url = this.val.url
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById(this.val.id)
        this.flvPlayer = flvjs.createPlayer({
          type: 'flv',
          hasAudio: false,
          url: url
        })
        this.flvPlayer.attachMediaElement(videoElement)
        this.flvPlayer.load()
        this.flvPlayer.play()
      }
    },
    close () {
      this.flvPlayer.pause()
      this.flvPlayer.unload()
      this.flvPlayer.detachMediaElement()
      this.flvPlayer.destroy()
      this.flvPlayer = null
    }
  },
  beforeDestroy () {
    this.close()
  }
}
</script>

<style lang="scss" scoped>
.app{
  height: 100%;
  .video-class{
    width: 100%;
    height: 100%;
    object-fit:fill;
  }
}
</style>
