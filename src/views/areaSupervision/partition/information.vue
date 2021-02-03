<template>
  <div class="information">
    <div class="information-main">
      <el-scrollbar class="scrolls">
        <div class="information-form" v-if="show">
          <el-tabs :tab-position="tabPosition" type="border-card">
            <el-tab-pane label="基本信息">
              <essentialInfo :Val.sync="essentialInfoVal"></essentialInfo>
            </el-tab-pane>
            <el-tab-pane label="控制服务">
              <control :Val.sync="controlVal"></control>
            </el-tab-pane>
            <el-tab-pane label="追踪视频">
              <track-video :Val.sync="videoPart"></track-video>
            </el-tab-pane>
            <el-tab-pane label="全景视频">
              <panorama :Val.sync="videoWhole"></panorama>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-scrollbar>
    </div>
    <div slot="footer" class="information-foot">
      <el-button
        icon="el-icon-document"
        size="small"
        class="blueButton"
        @click="submit()"
      >
        保存
      </el-button>
      <el-button
        icon="el-icon-refresh-left"
        size="small"
        class="whiteButton"
        @click="cancel"
      >
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import essentialInfo from './information/essentialInfo'
import control from './information/control'
import trackVideo from './information/Track'
import panorama from './information/panorama'
import dialogFormMixin from '@/mixins/dialogFormMixin'
import { getDataById, add } from '@/api/partition'
export default {
  mixins: [dialogFormMixin],
  props: {
    id: {
      type: String
    }
  },
  components: {
    essentialInfo,
    control,
    trackVideo,
    panorama
  },
  data () {
    return {
      tabPosition: 'left',
      essentialInfoVal: {
        name: null,
        description: null,
        status: '1',
        point: null,
        image: null
      },
      controlVal: {
        ip: null,
        port: null,
        imageUrl: null
      },
      videoPart: [{
        Title: null,
        IP: null,
        Port: null,
        UserName: null,
        Password: null,
        Channel: null,
        StreamType: null
      }, {
        Title: null,
        IP: null,
        Port: null,
        UserName: null,
        Password: null,
        Channel: null,
        StreamType: null,
        LiveChannelStream: null,
        LiveName: null,
        AppName: null
      }],
      videoWhole: [{
        Title: null,
        IP: null,
        Port: null,
        UserName: null,
        Password: null,
        Channel: null,
        StreamType: null
      }, {
        Title: null,
        IP: null,
        Port: null,
        UserName: null,
        Password: null,
        Channel: null,
        StreamType: null,
        LiveChannelStream: null,
        LiveName: null,
        AppName: null
      }],
      show: false
    }
  },
  created () {
    this.getDataByIdFun()
  },
  methods: {
    getDataByIdFun () {
      if (this.id) {
        getDataById(this.id).then(response => {
          this.videoPart = JSON.parse(response.data.videoPartJson)
          this.videoWhole = JSON.parse(response.data.videoWholeJson)
          this.controlVal = {
            ip: response.data.ip,
            port: response.data.port,
            imageUrl: response.data.imageUrl
          }
          this.essentialInfoVal = {
            name: response.data.name,
            description: response.data.description,
            status: response.data.status.toString(),
            point: JSON.parse(response.data.pointJson),
            image: response.data.image
          }
          this.show = true
        })
      } else {
        this.show = true
      }
    },
    submit () {
      const point = []
      this.essentialInfoVal.point.forEach(item => {
        const arr = item.split(',')
        const obj = {}
        obj.X = arr[0]
        obj.Y = arr[1]
        point.push(obj)
      })
      add({
        id: this.id,
        name: this.essentialInfoVal.name,
        imageUrl: this.controlVal.imageUrl,
        ip: this.controlVal.ip,
        port: this.controlVal.port,
        videoWholeJson: JSON.stringify(this.videoWhole),
        videoPartJson: JSON.stringify(this.videoPart),
        pointJson: JSON.stringify(point),
        description: this.essentialInfoVal.description,
        image: this.essentialInfoVal.image,
        status: this.essentialInfoVal.status
      }).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.$emit('submit')
      })
    },
    cancel () {
      this.$emit('cancel')
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.information-main{
  height: 700px;
}
</style>
