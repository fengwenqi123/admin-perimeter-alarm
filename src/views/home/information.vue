<template>
  <div class="information" v-if="boundaryInfo">
    <div class="information-main">
      <div class="information-form">
        <div class="video">
          <div class="big-video">
            <flv :val="trackVideo"></flv>
            <el-card class="small-video" :body-style="{ padding: '2px' }">
              <flv :val="panoramaVideo"></flv>
            </el-card>
          </div>
        </div>
        <div class="error-list">
          <el-scrollbar class="scrolls">
            <div class="title">
              预警日志
            </div>
            <ul>
              <li v-for="item in boundaryAlarmList" :key="item.id">
                <div class="item" @click="showAlarm(item)">
                  <div class="left">
                    <div class="time">{{ item.startTimeStr }}</div>
                    <div class="level">
                      {{
                        item.alarmType === 1
                          ? "一"
                          : item.alarmType === 2
                          ? "二"
                          : "三"
                      }}级告警
                    </div>
                  </div>
                  <div class="right">
                    {{ item.status === 1 ? "未处理" : "已处理" }}
                  </div>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dialogFormMixin from '@/mixins/dialogFormMixin'
import { getDataById } from '@/api/partition'
import flv from '@/components/flv'
import { getRealAlarm } from '@/api/smartMonitor'
import bus from '@/components/bus'

export default {
  mixins: [dialogFormMixin],
  components: {
    flv
  },
  props: {
    id: {
      type: String
    }
  },
  data () {
    return {
      boundaryInfo: null,
      boundaryAlarmList: null,
      trackVideo: {
        url: '',
        id: 'trackVideo'
      },
      panoramaVideo: {
        url: '',
        id: 'panoramaVideo'
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.id) {
        this.getRealAlarmFun(this.id)
        getDataById(this.id).then(response => {
          this.boundaryInfo = response.data
          this.trackVideo.url = JSON.parse(
            this.boundaryInfo.videoWholeJson
          )[0].LiveChannelStream
          this.panoramaVideo.url = JSON.parse(
            this.boundaryInfo.videoPartJson
          )[0].LiveChannelStream
        })
      }
    },
    // 根据分区id获取分区告警信息
    getRealAlarmFun (id) {
      getRealAlarm(id).then(response => {
        this.boundaryAlarmList = response.data
      })
    },
    showAlarm (item) {
      bus.$emit('alarm', item)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.information-main {
  height: 700px;
  .information-form {
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    .video {
      width: 1200px;

      .big-video {
        position: relative;
        height: 700px;

        .small-video {
          width: 350px;
          height: 200px;
          position: absolute;
          right: 10px;
          top: 10px;
        }
      }
    }

    .error-list {
      height: 100%;
      flex: 1;
      margin-left: 20px;
      .title {
        font-size: 16px;
        margin: 10px 0;
        font-weight: bold;
      }
      ul {
        li {
          .item {
            background: #f8f8f8;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            .left {
              .level {
                margin-top: 4px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
