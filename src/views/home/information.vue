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
          <el-tabs type="border-card">
            <el-tab-pane label="预警日志">
              <div class="log">
                <el-scrollbar class="scrolls">
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
                        <div class="right" :class="{'IsStatus':item.status === 2}">
                          {{ item.status === 1 ? "未处理" :item.status === 2 ? "已处理": "" }}
                        </div>
                      </div>
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
            </el-tab-pane>
            <el-tab-pane label="点云">
              <div class="three-model" v-show="flag">
                <threeModel :boundaryId="id" @showThree="showThree"></threeModel>
              </div>
            </el-tab-pane>
          </el-tabs>
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
import threeModel from './threeModel'

export default {
  mixins: [dialogFormMixin],
  components: {
    flv,
    threeModel
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
      },
      flag: false
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
      this.$router.push({
        name: 'alarmInfo'
      })
      this.$store.commit('addAlarmInfo', item)
    },
    showThree () {
      this.flag = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.information-main {
  height: 510px;
  .information-form {
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    .video {
      width: 850px;

      .big-video {
        position: relative;
        height: 480px;

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
      .log{
        height: 410px;
      }
      ul {
        li {
          .item {
            background: #f8f8f8;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            cursor: pointer;
            .left {
              .level {
                margin-top: 4px;
              }
            }
            .right{
              color: red;
            }
            .IsStatus{
              color: #13ce66;
            }
          }
        }
      }
      .three-model{
        height: 410px;
      }
    }
  }
}
</style>
