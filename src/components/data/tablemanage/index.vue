<template>
  <div>
    <div class="tableTool">
         <!-- <button type="button" @click="prePlay" class="btn btn-sm btn-info" id="play"><i :class="recordPlay(recordState)" aria-hidden="true"></i>{{recordState}}</button> -->
         <!-- <a download @click="downLoad()" class="btn btn-sm btn-info"><i class="fa fa-cloud-download" aria-hidden="true"></i>导出</a> -->
         <label>电源站点&nbsp;&nbsp;&nbsp;&nbsp;</label>
         <el-select v-model="selectValue" :clearable="true" placeholder="请选择站点" ref="selectTree"  @clear="clearHandle">
           <el-option :key="selectValue" :value="selectValue" :label="selectValue" style="height: auto;">
             <!-- <div class="dept"> -->
             <el-tree :data="data" :props="defaultProps" node-key="id" :accordion="true" @node-click="handleNodeClick"></el-tree>
             <!-- </div> -->
           </el-option>
         </el-select>
         <label>显示图例&nbsp;&nbsp;&nbsp;&nbsp;</label>
         <el-select v-model="selectLegend" :clearable="true" placeholder="请选择图例" ref="selectOption"  @clear="clearLegend" @change="changeLegend">
           <el-option
             v-for="item in legends"
             :key="item.value"
             :label="item.label"
             :value="item.value">>
           </el-option>
         </el-select>
      <div class="operate">
        <form class="form-inline">
          <div class="form-group">
            <span>
            <label>历史数据日期</label>
            <el-date-picker
              popper-class="elDatePicker"
              v-model="value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="backgroud-color: #333;">
            </el-date-picker>
            </span>
          </div>
          <button type="button" class="btn btn-info" @click="queryDataRecord">
            <i class="fa fa-search" aria-hidden="true"></i>查询</button>
        </form>
      </div>
    </div>
    <vbar v-if="barSelected.v==true" ref="vbar" :vData="vData"></vbar>
    <abar v-if="barSelected.a==true" ref="abar" :aData="aData"></abar>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.pageIndex"
        :page-sizes="[6, 10, 15, 20]"
        :page-size="pageData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

import vbar from './echarts/vbar.vue'
import abar from './echarts/abar.vue'
export default {
  name: '',
  components: {
    vbar: vbar,
    abar: abar
  },
  props: [''],
  data () {
    return {
      value: '',
      selectValue: '',
      selectLegend: 'lv',
      data: [],
      vData: [],
      aData: [],
      barSelected: {
        v: true,
        a: false
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pageData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      formData: {
        catalogid: '',
        BeginTime: '',
        EndTime: ''
      },
      dataparam: [
        // ['Matcha Latte', 43.3, 85.8, 93.7]
      ],
      dataparama: [
        // ['Matcha Latte', 43.3, 85.8, 93.7]
      ],
      legends: [
        {
          value: 'lv',
          label: '电压柱线'
        },
        {
          value: 'la',
          label: '电流柱线'
        }
      ],
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  watch: {},
  created () {
    this.selectValue = ''
    this.selectLegend = ''
    this.$nextTick(async () => {
      await this.getAllStation()
      await this.getDeviceDataFromDB()
    })
  },
  beforeMount () {},
  mounted () {},
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageData.pageIndex = val
      this.getDeviceDataFromDB()
    },
    handleNodeClick (data) {
      // 配置树形组件点击节点后，设置选择器的值，配置组件的数据
      this.selectValue = data.label
      this.formData.catalogid = data.catalogid
      // 选择器执行完成后，使其失去焦点隐藏下拉框效果
      this.$refs.selectTree.blur()
      console.log('当前选中的站点名称：', this.selectValue)
    },
    clearHandle () {
      this.selectValue = ''
      this.formData.catalogid = ''
    },
    changeLegend (l) {
      switch (l) {
        case 'lv' :
          this.barSelected.v = true
          this.barSelected.a = false
          // this.$refs.vbar.reSetOptionV()
          break
        case 'la' :
          this.barSelected.a = true
          this.barSelected.v = false
          // this.$refs.abar.reSetOptionA()
          break
        default :
          this.$refs.vbar.reSetOptionV()
      }
      // refresh data
      this.getDeviceDataFromDB()
    },
    clearLegend () {
      this.selectLegend = ''
      this.barSelected.v = true
      this.barSelected.a = false
    },
    async getAllStation () {
      this.instance({
        'url': 'localall',
        'method': 'get'
      }).then((res) => {
        console.log('\ndatamanage get station tree return:')
        console.log(res.data)
        this.data = this.getJsonTree(res.data, {
          id: 'catalogid',
          pid: 'parentid',
          children: 'children'
        })
        console.log('datamanage生成树data:')
        console.log(this.data)
      })
    },
    async queryDataRecord () {
      /* eslint-disable no-extend-native */
      Date.prototype.format = function (format) {
        var o = {
          'M+': this.getMonth() + 1,
          'd+': this.getDate(),
          'H+': this.getHours(),
          'm+': this.getMinutes(),
          's+': this.getSeconds(),
          'q+': Math.floor((this.getMonth() + 3) / 3),
          'S': this.getMilliseconds()
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
        return format
      }
      console.log('value =', this.value)
      if (this.value) {
        if (typeof (this.value[0]) !== 'undefined' && this.value[0] !== null) {
          this.formData.BeginTime = this.value[0].format('yyyy-MM-dd HH:mm:ss')
        }
        if (typeof (this.value[1]) !== 'undefined' && this.value[1] !== null) {
          this.formData.EndTime = this.value[1].format('yyyy-MM-dd HH:mm:ss')
        }
        console.log('数据查询开始时间=', this.formData.BeginTime)
        console.log('数据查询结束时间=', this.formData.EndTime)
      } else {
        this.formData.BeginTime = ''
        this.formData.EndTime = ''
      }
      await this.getDeviceDataFromDB()
    },
    dataReportFormat (report) {
      let datalist = {}
      datalist.catalogid = report.catalogid
      datalist.id = report.id
      datalist.code = report.code
      datalist.mudtype = report.mudtype
      if (report.devicetype === '2') {
        datalist.devicetype = '交流局端'
      }
      if (report.devicetype === '1') {
        datalist.devicetype = '直流局端'
      }
      // datalist.com = this.alarmStatus(report.com)
      // datalist.auv = this.alarmStatus(report.auv)
      // datalist.buv = this.alarmStatus(report.buv)
      // datalist.cuv = this.alarmStatus(report.cuv)
      // datalist.aov = this.alarmStatus(report.aov)
      // datalist.bov = this.alarmStatus(report.bov)
      // datalist.cov = this.alarmStatus(report.cov)
      // datalist.aoa = this.alarmStatus(report.aoa)
      // datalist.boa = this.alarmStatus(report.boa)
      // datalist.coa = this.alarmStatus(report.coa)
      // datalist.afu = this.alarmStatus(report.afu)
      // datalist.bfu = this.alarmStatus(report.bfu)
      // datalist.cfu = this.alarmStatus(report.cfu)
      datalist.abcv = parseInt(report.abcv.toString(), 16) / 10
      datalist.av = parseInt(report.av.toString(), 16) / 10
      datalist.bv = parseInt(report.bv.toString(), 16) / 10
      datalist.cv = parseInt(report.cv.toString(), 16) / 10
      datalist.abca = parseInt(report.abca.toString(), 16) / 10
      datalist.aa = parseInt(report.aa.toString(), 16) / 10
      datalist.ba = parseInt(report.ba.toString(), 16) / 10
      datalist.ca = parseInt(report.ca.toString(), 16) / 10
      // datalist.mainstatus = this.indStatus(report.mainstatus.toString())
      // datalist.stabilestatus = this.indStatus(report.stabilestatus.toString())
      // datalist.stepstatus = this.indStatus(report.stepstatus.toString())
      // datalist.syncstatus = this.indStatus(report.syncstatus.toString())
      // datalist.autostatus = this.indStatus(report.autostatus.toString())
      datalist.timestamp = report.timestamp
      // datalist.alarmstatus = this.alarmView(datalist)
      // this.dataparameter.push(datalist)
      let temp = ['Matcha Latte', 43.3, 85.8, 93.7]
      let tempa = ['Matcha Latte', 43.3, 85.8, 93.7]
      // console.log(this.dataparameter[i])
      // temp[0] = datalist.timestamp
      temp[0] = datalist.id
      temp[1] = datalist.av
      temp[2] = datalist.bv
      temp[3] = datalist.cv
      this.dataparam.push(temp)
      tempa[0] = datalist.id
      tempa[1] = datalist.aa
      tempa[2] = datalist.ba
      tempa[3] = datalist.ca
      this.dataparama.push(tempa)
      console.log('this.dataparam===:', this.dataparam)
      console.log('this.dataparam.length===:', this.dataparam.length)
    },
    async dataSetFormat () {
      console.log('\nthis.dataparam:', this.dataparam)
      let _this = this
      console.log('\n_this.dataparam.length:', _this.dataparam.length)
      this.vData.splice(0, this.vData.length)
      this.aData.splice(0, this.aData.length)
      for (let i = 0; i < _this.dataparam.length; i++) {
        // v set
        let temp = ['Matcha Latte', 43.3, 85.8, 93.7]
        console.log('this.dataparam[i]', _this.dataparam[i])
        temp[0] = _this.dataparam[i][0]
        temp[1] = _this.dataparam[i][1]
        temp[2] = _this.dataparam[i][2]
        temp[3] = _this.dataparam[i][3]
        this.vData.push(temp)
      }
      for (let i = 0; i < _this.dataparama.length; i++) {
      // a set
        let tempa = ['Matcha Latte', 43.3, 85.8, 93.7]
        console.log('this.dataparama[i]', _this.dataparama[i])
        tempa[0] = _this.dataparama[i][0]
        tempa[1] = _this.dataparama[i][1]
        tempa[2] = _this.dataparama[i][2]
        tempa[3] = _this.dataparama[i][3]
        this.aData.push(tempa)
      }
      // reset option
      switch (this.selectLegend) {
        case 'lv' :
          this.$refs.vbar.reSetOptionV()
          break
        case 'la' :
          this.$refs.abar.reSetOptionA()
          break
        default :
          this.$refs.vbar.reSetOptionV()
      }
    },
    async getDeviceDataFromDB () {
      let _this = this
      this.formData = Object.assign(this.formData, this.pageData)
      this.instance({
        'url': '/data/postdatapage',
        data: this.formData,
        'method': 'post'
      }).then((res) => {
        console.log('\npower page datadb:')
        console.log(res)
        let dataList = []
        if (res.data.list) {
          _this.dataparam = []
          res.data.list.forEach((num) => {
            _this.dataReportFormat(num)
            dataList.push(num)
          })
          console.log('\ngetDeviceDataFromDB table')
          console.log(dataList)
          _this.pageData.total = res.data.total
        }
        _this.dataSetFormat()
      })
    },
    getJsonTree (data, config) {
      let id = config.id || 'id'
      let pid = config.pid || 'pid'
      let children = config.children || 'children'
      let idMap = []
      let jsonTree = []
      data.forEach(function (v) {
        idMap[v[id]] = v
      })
      data.forEach(function (v) {
        let parent = idMap[v[pid]]
        if (parent) {
          !parent[children] && (parent[children] = [])
          parent[children].push(v)
        } else {
          jsonTree.push(v)
        }
      })
      return jsonTree
    }
  },
  computed: {}
}
</script>
<style type="text/scss" rel="stylesheet/scss" lang="scss" >
.elDatePicker {
   .el-picker-panel {
    background: #0f0472a9 !important;
    color: #ffffff;
    border: 1px solid #93bee7 !important;
    line-height: 20px;
  }
  .el-picker-panel .el-date-range-picker__time-header {
    border-bottom: 1px solid #93bee7 !important;
  }
  .el-picker-panel__icon-btn {
  width: 8px;
  height: 10px;
  color: #cbd3f0 !important;
}
.el-picker-panel .el-input__inner {
  background-color: #19466f;
  border: #75ebf2;
  color: #e8fdff;
}
.el-date-picker__header-label {
  color: #6ce6cb !important;
}
.el-date-picker__header-label:hover {
  color: #ffffff;
}
.el-date-table td.disabled div {
  background-color: #6891cfa8 !important;
}
.el-picker-panel .el-date-table th {
  color: #7d98a0;
}
.el-picker-panel .el-date-table td.available {
  font-size: 16px;
  font-weight: bold;
  color: #6ce6cb;
}
.el-picker-panel .el-date-table td.available:hover {
  color: #ffffff;
}
.el-picker-panel .el-date-table table caption h3, span {
  border-radius: 5px;
  color: #75ebf2;
  }
}
.block {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
// .tableTool {
  .el-input input {
  color: #5bc0de!important;
}
.el-input__inner {
  color: #888!important;
}
.el-range-input {
  color: #5bc0de!important;
}
.el-tree-node__label {
  color: #409eee
// }
}
.selected {
    border-color: #000;
    background: url(/static/img/jiaobiao04.fw.2d8fb46.png) no-repeat bottom right #aaaaaa;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
</style>
