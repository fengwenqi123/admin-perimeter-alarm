<template>
  <div class="echarts" :class="className" :id="id"/>
</template>

<script>
const echarts = require('echarts')
export default {
  props: {
    val: {
      type: Array
    },
    type: {
      tpye: Array
    }
  },
  data () {
    return {
      chart: null,
      className: 'chart',
      id: 'chart'
    }
  },
  watch: {
    val: { //  深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        this.initChart()
      },
      deep: true
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        color: ['#FE973D', '#14D3EF'],
        legend: {
          x: 'right',
          data: this.type
        },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.val.reduce((total, currentValue) => {
              return [...total, currentValue.statDate]
            }, [])
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 20,
            end: 100
          }
        ],
        series: [
          {
            name: this.type[0],
            type: 'line',
            data: this.val.reduce((total, currentValue) => {
              return [...total, currentValue.c1]
            }, [])
          },
          {
            name: this.type[1],
            type: 'line',
            data: this.val.reduce((total, currentValue) => {
              return [...total, currentValue.c2]
            }, [])
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.echarts {
  height: 100%;
  width: 100%
}
</style>
