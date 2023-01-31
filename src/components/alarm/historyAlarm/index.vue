<template>
  <div>
      <div class="tableTool">
      <!-- <button type="button" @click="prePlay" class="btn btn-sm btn-info" id="play"><i :class="recordPlay(recordState)" aria-hidden="true"></i>{{recordState}}</button> -->
      <!-- <a download @click="downLoad()" class="btn btn-sm btn-info"><i class="fa fa-cloud-download" aria-hidden="true"></i>导出</a> -->
      <div class="operate">
        <form class="form-inline">
          <div class="form-group">
            <span>
            <label>告警发生时间</label>
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
          <!-- <div class="form-group">
            <label>告警设备</label>
            <input type="text" v-model.number="formData.device" class="form-control" style="width:70px;">
          </div> -->
          <!-- <div class="form-group">
            <label>告警级别</label>
            <input type="text" v-model.number="formData.level" class="form-control" style="width:70px;">
          </div> -->
          <button type="button" class="btn btn-info" @click="queryAlarmRecord">
            <i class="fa fa-search" aria-hidden="true"></i>查询</button>
        </form>
      </div>
    </div>
      <table class="table">
        <thead>
          <tr>
            <td>告警序列号</td>
            <td>告警设备</td>
            <!-- <td>告警收到时间</td> -->
            <td>告警发生时间</td>
            <td>告警详情</td>
            <!-- <td>告警级别</td> -->
            <!-- <td>告警原因</td> -->
            <td>告警确认</td>
            <td>告警确认时间</td>
            <td>告警确认信息</td>
            <td>告警恢复</td>
            <td>告警恢复信息</td>
            <!-- <td>告警源IP</td> -->
          </tr>
        </thead>
        <tbody>
          <tr  v-for="item in alarmparameter" :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.mudid}}</td>
            <!-- <td>{{(item.receivedtime)}}</td> -->
            <td>{{(item.firedtime)}}</td>
            <td>{{detailView(item.detail)}}</td>
            <!-- <td>{{item.level}}</td> -->
            <!-- <td>{{item.reason}}</td> -->
            <td>
              <input type="checkbox" id="inlineCheckbox" v-model="item.confirmedflag" @click="alarmConfirmed(item, !item.confirmedflag)">
              <label for="checkbox">{{confirmedView(item.confirmedflag)}}</label>
            </td>
            <td>{{item.confirmedtime}}</td>
            <td>{{item.confirmedinfo}}</td>
            <td>{{restoredView(item.restoreflag)}}</td>
            <td>{{item.restoreinfo}}</td>
            <!-- <td>{{item.sourceip}}</td> -->
          </tr>
        </tbody>
      </table>
      <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.pageIndex"
        :page-sizes="[6, 10, 30, 40]"
        :page-size="pageData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
  </div>
      <el-dialog
        title ="告警输入信息："
        :visible.sync="dialogVisible"
        :show-close = false
        width ="25%">
      <textarea style="height:300px;color:#000;background-color:#fff;" class="form-control" v-model="alarmConfiredText"  id="textarea"  placeholder="输入告警确认信息.....">
        告警确认
      </textarea>
      <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="alarmConfirmInfo()">确 定</el-button>
      </span>
     </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'alarm',
  data () {
    return {
      pageData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      formData: {
        alarmType: 0,
        firedTime: '',
        BeginTime: '',
        EndTime: ''
      },
      value: '',
      startStamp: {},
      endStamp: {},
      alarmparameter: [
      ],
      dialogVisible: false,
      alarmConfiredText: '',
      selectedAlarmID: '',
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  created () {
    this.$nextTick(async () => {
      await this.refresh()
    })
  },
  computed: {
    ...mapGetters({
    })
  },
  watch: {
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageData.pageIndex = val
      // this.refreshTotal()
      this.refresh()
    },
    alarmReportFormat (report) {
      let alarmReportTem = {}
      let alarmReport = report
      alarmReportTem.id = alarmReport.alarmid
      alarmReportTem.mudid = alarmReport.alarmmudid
      alarmReportTem.receivedtime = alarmReport.alarmreceivedtime
      alarmReportTem.firedtime = alarmReport.alarmfiredtime
      alarmReportTem.detail = alarmReport.alarmdetail
      alarmReportTem.reason = alarmReport.alarmreason
      alarmReportTem.level = alarmReport.alarmlevel
      alarmReportTem.confirmedflag = alarmReport.alarmconfirmedflag
      alarmReportTem.confirmedtime = alarmReport.alarmconfirmedtime
      alarmReportTem.confirmedinfo = alarmReport.alarmconfirmedinfo
      alarmReportTem.restoreflag = alarmReport.alarmrestoreflag
      alarmReportTem.restoreinfo = alarmReport.alarmrestoreinfo
      alarmReportTem.sourceip = alarmReport.alarmsourceip
      this.alarmparameter.push(alarmReportTem)
    },
    async refresh () {
      let _this = this
      this.formData = Object.assign(this.formData, this.pageData)
      this.instance({
        'url': '/alarm/historypage/' + this.formData.station + '/' + this.formData.alarmType,
        data: this.formData,
        'method': 'post'
      }).then((res) => {
        console.log('\npower page history alarm db:')
        console.log(res)
        let alarmList = []
        if (res.data.list) {
          _this.alarmparameter = []
          res.data.list.forEach((num) => {
            _this.alarmReportFormat(num)
            alarmList.push(num)
          })
          console.log('\npower history alarm page List table')
          console.log(alarmList)
          _this.pageData.total = res.data.total
        }
      })
    },
    async refreshTotal () {
      let _this = this
      this.instance({
        'url': '/getallhistoryalarmtotol',
        'method': 'get'
      }).then((res) => {
        console.log('\npower totol number history alarm db number :')
        console.log(res.data)
        _this.pageData.total = res.data
      })
    },
    alarmConfirmInfo () {
      console.log('输入的告警确认信息：', this.alarmConfiredText)
      this.dialogVisible = false
      let _this = this
      // 修改历史告警数据库的告警确认相关信息
      // 修改历史告警数据库的这条信息
      this.alarmparameter.forEach((num) => {
        if (num.id === this.selectedAlarmID) {
          let toHistoryAlarm = num
          let date = new Date()
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          let hour = date.getHours()
          let minute = date.getMinutes()
          let second = date.getSeconds()
          let confirmedtime = year + '-' + String(month > 9 ? month : ('0' + month)) + '-' + String(day > 9 ? day : ('0' + day)) + ' ' + String(hour > 9 ? hour : ('0' + hour)) + ':' + String(minute > 9 ? minute : ('0' + minute)) + ':' + String(second > 9 ? second : ('0' + second))
          console.log('告警确任要修改的一条history数据=========', toHistoryAlarm)
          toHistoryAlarm.alarmid = toHistoryAlarm.id
          toHistoryAlarm.alarmstation = toHistoryAlarm.station
          toHistoryAlarm.alarmmudid = toHistoryAlarm.mudid
          toHistoryAlarm.alarmreceivedtime = toHistoryAlarm.receivedtime
          toHistoryAlarm.alarmfiredtime = toHistoryAlarm.firedtime
          toHistoryAlarm.alarmdetail = toHistoryAlarm.detail
          toHistoryAlarm.alarmreason = toHistoryAlarm.reason
          toHistoryAlarm.alarmlevel = toHistoryAlarm.level
          toHistoryAlarm.alarmrestoreflag = toHistoryAlarm.restoreflag
          toHistoryAlarm.alarmrestoreinfo = toHistoryAlarm.restoreinfo
          toHistoryAlarm.alarmsourceip = toHistoryAlarm.sourceip
          toHistoryAlarm.alarmconfirmedflag = true
          toHistoryAlarm.alarmconfirmedtime = confirmedtime
          toHistoryAlarm.alarmconfirmedinfo = this.alarmConfiredText
          this.instance({
            'url': '/alarm/history/update',
            data: toHistoryAlarm,
            'method': 'post'
          }).then((res) => {
            console.log('\nupdate to history db is ok:')
            console.log(res.data)
            _this.refreshTotal()
            _this.refresh()
          })
          this.alarmConfiredText = ''
        }
      })
    },
    confirmedView (v) {
      let view = ''
      // console.log('mudid in ', v)
      if (v) {
        view = '已确认'
      } else {
        view = '未确认' + v
      }
      return view
    },
    restoredView (v) {
      let view = ''
      // console.log('mudid in ', v)
      if (v) {
        view = '已恢复'
      } else {
        view = '未恢复' + v
      }
      return view
    },
    mudidView (v) {
      let view = ''
      // console.log('mudid in ', v)
      if (v === 'ff') {
        view = '整机'
      } else {
        view = '模块' + v
      }
      return view
    },
    detailView (v) {
      let view = ''
      // console.log('detail in ', v)
      switch (v) {
        case 'auv' :
          view = 'A相欠压'
          break
        case 'buv' :
          view = 'B相欠压'
          break
        case 'cuv' :
          view = 'c相欠压'
          break
        case 'aov' :
          view = 'A相过压'
          break
        case 'bov' :
          view = 'B相过压'
          break
        case 'cov' :
          view = 'C相过压'
          break
        case 'aoa' :
          view = 'A相过流'
          break
        case 'boa' :
          view = 'B相过流'
          break
        case 'coa' :
          view = 'C相过流'
          break
        case 'afu' :
          view = 'A相保险'
          break
        case 'bfu' :
          view = 'B相保险'
          break
        case 'cfu' :
          view = 'C相保险'
          break
        case 'com' :
          view = '通信故障'
          break
      }
      return view
    },
    alarmConfirmed (e, visible) {
      if (visible) {
        this.dialogVisible = true
        this.selectedAlarmID = e.id
      }
    },
    queryAlarmRecord () {
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
        console.log('历史告警查询开始时间=', this.formData.BeginTime)
        console.log('历史告警查询结束时间=', this.formData.EndTime)
      } else {
        this.formData.BeginTime = ''
        this.formData.EndTime = ''
      }
      // 查询历史告警
      this.refresh()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" rel="stylesheet/scss" lang="scss">
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
</style>
