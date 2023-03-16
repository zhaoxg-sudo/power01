<template>
  <div>
      <div class="tableTool">
         <!-- <button type="button" @click="prePlay" class="btn btn-sm btn-info" id="play"><i :class="recordPlay(recordState)" aria-hidden="true"></i>{{recordState}}</button> -->
         <!-- <a download @click="downLoad()" class="btn btn-sm btn-info"><i class="fa fa-cloud-download" aria-hidden="true"></i>导出Excel</a> -->
         <downloadExcel
           class = "btn btn-info"
           :data = "dataparameter"
           :fields = "json_fields"
           :type="fileType"
           :header="header"
           :worksheet="workSheet"
           :before-generate = "setFileName"
           :name = "name">
           <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
           <a><i class="fa fa-cloud-download" aria-hidden="true"></i>导出Excel</a>
         </downloadExcel>
         <label>电源站点&nbsp;&nbsp;&nbsp;&nbsp;</label>
         <el-select v-model="selectValue" :clearable="true" placeholder="请选择站点" ref="selectTree"  @clear="clearHandle">
           <el-option :key="selectValue" :value="selectValue" :label="selectValue" style="height: auto;">
             <el-tree :data="data" :props="defaultProps" node-key="id" :accordion="true" @node-click="handleNodeClick"></el-tree>
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
      <table class="table">
        <thead>
          <tr>
            <!-- <td>设备ID</td> -->
            <td>设备名称</td>
            <td>设备类型</td>
            <td>时间戳</td>
            <td>A相电压</td>
            <td>B相电压</td>
            <td>C相电压</td>
            <td>A相电流</td>
            <td>B相电流</td>
            <td>c相电流</td>
            <td>市电指示</td>
            <td>稳压指示</td>
            <td>分调指示</td>
            <td>同调指示</td>
            <td>自动指示</td>
            <td>告警状态</td>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="item in dataparameter" :key="item.id">
            <!-- <td>{{item.id}}</td> -->
            <td>{{item.code}}</td>
            <td>{{item.devicetype}}</td>
            <td>{{item.timestamp}}</td>
            <td>{{item.av + 'V'}}</td>
            <td>{{item.bv + 'V'}}</td>
            <td>{{item.cv + 'V'}}</td>
            <td>{{item.aa + 'A'}}</td>
            <td>{{item.ba + 'A'}}</td>
            <td>{{item.ca + 'A'}}</td>
            <td> <el-switch
                 v-model="item.mainstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch></td>
            <td><el-switch
                 v-model="item.stabilestatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch></td>
            <td><el-switch
                 v-model="item.stepstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch></td>
            <td><el-switch
                 v-model="item.syncstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch></td>
            <td><el-switch
                 v-model="item.autostatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch></td>
             <td :style="{backgroundColor:item.alarmstatus!=''?'#ff4949':'#999'}">{{item.alarmstatus}}</td>
          </tr>
        </tbody>
      </table>
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
export default {
  name: '',
  components: {},
  props: [''],
  data () {
    return {
      header: '电源运行历史数据表',
      name: 'data',
      fileType: 'xls',
      workSheet: '数据表',
      json_fields: {
        设备名称: 'code',
        设备类型: 'devicetype',
        时间戳: 'timestamp',
        A相电压: 'av',
        B相电压: 'bv',
        C相电压: 'cv',
        A相电流: 'aa',
        B相电流: 'ba',
        c相电流: 'ca',
        市电指示: 'mainstatus',
        稳压指示: 'stabilestatus',
        分调指示: 'stepstatus',
        同调指示: 'syncstatus',
        自动指示: 'autostatus',
        告警状态: 'alarmstatus'
      },
      data: [],
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
        firedTime: '',
        BeginTime: '',
        EndTime: ''
      },
      value: '',
      selectValue: '',
      dataparameter: [
      ],
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  watch: {},
  created () {
    this.selectValue = ''
    this.$nextTick(async () => {
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
      await this.refresh()
    })
  },
  beforeMount () {},
  mounted () {},
  methods: {
    setFileName () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      let downloadtime = year + '-' + String(month > 9 ? month : ('0' + month)) + '-' + String(day > 9 ? day : ('0' + day)) + '_' + String(hour > 9 ? hour : ('0' + hour)) + ':' + String(minute > 9 ? minute : ('0' + minute)) + ':' + String(second > 9 ? second : ('0' + second))
      this.name = '历史运行数据_' + downloadtime
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageData.pageIndex = val
      this.refresh()
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
    downLoad () {

    },
    // 指示状态转换
    indStatus (a) {
      let status = false
      switch (a) {
        case '0001':
          status = true
          break
        case '0000':
          status = false
          break
      }
      return status
    },
    // 故障状态转换
    alarmStatus (a) {
      let status = false
      switch (a) {
        case '00aa':
          status = true
          break
        case '0055':
          status = false
          break
      }
      return status
    },
    // 故障显示
    alarmView (alarm) {
      // console.log('a=', alarm)
      let view = ''
      if (alarm.auv) {
        view = view + 'A相欠压' + ','
      }
      if (alarm.buv) {
        view = view + 'B相欠压' + ','
      }
      if (alarm.cuv) {
        view = view + 'c相欠压' + ','
      }
      if (alarm.aov) {
        view = view + 'A相过压' + ','
      }
      if (alarm.bov) {
        view = view + 'B相过压' + ','
      }
      if (alarm.cov) {
        view = view + 'C相过压' + ','
      }
      if (alarm.aoa) {
        view = view + 'A相过流' + ','
      }
      if (alarm.boa) {
        view = view + 'B相过流' + ','
      }
      if (alarm.coa) {
        view = view + 'C相过流' + ','
      }
      if (alarm.afu) {
        view = view + 'A相保险' + ','
      }
      if (alarm.bfu) {
        view = view + 'B相保险' + ','
      }
      if (alarm.cfu) {
        view = view + 'C相保险' + ','
      }
      if (alarm.com) {
        view = view + '通信故障' + ','
      }
      return view
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
      datalist.com = this.alarmStatus(report.com)
      datalist.auv = this.alarmStatus(report.auv)
      datalist.buv = this.alarmStatus(report.buv)
      datalist.cuv = this.alarmStatus(report.cuv)
      datalist.aov = this.alarmStatus(report.aov)
      datalist.bov = this.alarmStatus(report.bov)
      datalist.cov = this.alarmStatus(report.cov)
      datalist.aoa = this.alarmStatus(report.aoa)
      datalist.boa = this.alarmStatus(report.boa)
      datalist.coa = this.alarmStatus(report.coa)
      datalist.afu = this.alarmStatus(report.afu)
      datalist.bfu = this.alarmStatus(report.bfu)
      datalist.cfu = this.alarmStatus(report.cfu)
      datalist.abcv = parseInt(report.abcv.toString(), 16) / 10
      datalist.av = parseInt(report.av.toString(), 16) / 10
      datalist.bv = parseInt(report.bv.toString(), 16) / 10
      datalist.cv = parseInt(report.cv.toString(), 16) / 10
      datalist.abca = parseInt(report.abca.toString(), 16) / 10
      datalist.aa = parseInt(report.aa.toString(), 16) / 10
      datalist.ba = parseInt(report.ba.toString(), 16) / 10
      datalist.ca = parseInt(report.ca.toString(), 16) / 10
      datalist.mainstatus = this.indStatus(report.mainstatus.toString())
      datalist.stabilestatus = this.indStatus(report.stabilestatus.toString())
      datalist.stepstatus = this.indStatus(report.stepstatus.toString())
      datalist.syncstatus = this.indStatus(report.syncstatus.toString())
      datalist.autostatus = this.indStatus(report.autostatus.toString())
      datalist.timestamp = report.timestamp
      datalist.alarmstatus = this.alarmView(datalist)
      this.dataparameter.push(datalist)
    },
    async refresh () {
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
          _this.dataparameter = []
          res.data.list.forEach((num) => {
            _this.dataReportFormat(num)
            dataList.push(num)
          })
          console.log('\npower data page List table')
          console.log(dataList)
          _this.pageData.total = res.data.total
        }
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
      // 查询历史数据
      this.refresh()
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
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
