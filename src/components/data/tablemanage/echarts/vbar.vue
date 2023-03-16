<template>
  <div>
    <!-- <h3>报表管理显示区</h3> -->
    <div ref="chart" style="width:100%;height:376px"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
let myChart
let option = {
  title: {
    text: '电源电压历史柱线'
  },
  legend: {
    // left: 'right',
    // top: 'center',
    textStyle: {
      color: '#ccc'
      // ...
    },
    data: ['A相电压', 'B相电压', 'C相电压']
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      // restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  tooltip: {},
  dataset: {
  // 提供一份数据。
    source: [
      // ['product', 'A相电压', 'B相电压', 'C相电压']
      // ['Matcha Latte', 43.3, 85.8, 93.7]
    ]
  },
  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  xAxis: { type: 'category' },
  // 声明一个 Y 轴，数值轴。
  yAxis: {
    name: '三相电压',
    min: 0,
    // max: 280,
    axisLabel: {
      formatter: '{value} V'
    }
  },
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series: [
    { type: 'bar', name: 'A相电压' },
    { type: 'bar', name: 'B相电压' },
    { type: 'bar', name: 'C相电压' }
  ]
}
export default {
  name: '',
  components: {},
  props: ['vData'],
  data () {
    return {
      colorTheme: 'dark'
    }
  },
  watch: {},
  created () {},
  beforeMount () {},
  mounted () {
    this.getEchartData()
    console.log('vbar ECharts当前版本=', echarts.version)
  },
  methods: {
    async getEchartData () {
      let chart = this.$refs.chart
      if (chart) {
        myChart = echarts.init(chart, this.colorTheme)
        console.log('\noption:', option)
        console.log('\noption后:', option)
        myChart.setOption(option)
        window.addEventListener('resize', function () {
          myChart.resize()
        })
        this.$on('hook:destroyed', () => {
          window.removeEventListener('resize', function () {
            myChart.resize()
          })
        })
      }
    },
    reSetOptionV () {
      console.log('enter into vData reSetOption')
      // refresh bar data
      let data = option.dataset.source
      data.splice(0, data.length)
      for (let i = 0; i < this.vData.length; i++) {
        let temp = ['Matcha Latte', 43.3, 85.8, 93.7]
        console.log('this.dataparam[i]', this.vData[i])
        temp[0] = this.vData[i][0]
        temp[1] = this.vData[i][1]
        temp[2] = this.vData[i][2]
        temp[3] = this.vData[i][3]
        data.push(temp)
      }
      myChart.setOption(option)
    }
  },
  computed: {}
}
</script>
<style lang='' scoped>
</style>
