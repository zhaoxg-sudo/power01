<template>
  <div class="show-area-table">
     <div class="tableTool">
      <form class="form-inline">
            <div class="form-group">
              <label>电源站点</label>
              <input type="text" v-model="currentCatalogLabel" class="form-control" style="width:200px;">
              <span :class="autoUpdate == true ? 'selected' : ''" @click="changeType(1)">自动更新</span>
            </div>
            <button type="button" class="btn btn-info" @click="refresh">
              <i class="fa fa-search" aria-hidden="true"></i>刷新
            </button>
          </form>
    </div>
    <table class="table">
        <thead>
          <tr>
            <td>电源名称</td>
            <td>电源类型</td>
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
        <tbody v-for="item in showTable" :key="item.station">
          <tr>
            <td>
              {{item.station}}
              <input type="checkbox" id="inlineCheckbox" v-model="item.expendFlag" @click="remoteExpand(item, !item.expendFlag)">
              <!-- <label for="checkbox">{{expandView(item.expendFlag)}}</label> -->
            </td>
            <td>{{item.type}}</td>
            <td>{{item.av + 'V'}}</td>
            <td>{{item.bv + 'V'}}</td>
            <td>{{item.cv + 'V'}}</td>
            <td>{{item.aa + 'A'}}</td>
            <td>{{item.ba + 'A'}}</td>
            <td>{{item.ca + 'A'}}</td>
            <td>
              <el-switch
                 v-model="item.mainstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
            </td>
            <td>
              <el-switch
                 v-model="item.stabilestatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
            </td>
            <td>
              <el-switch
                 v-model="item.stepstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
            </td>
            <td>
              <el-switch
                 v-model="item.syncstatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
            </td>
            <td>
              <el-switch
                 v-model="item.autostatus"
                 active-color="#13ce66"
                 inactive-color="#999">
               </el-switch>
            </td>
            <td :style="{backgroundColor:item.alarmstatus!=''?'#ff4949':'#999'}">{{item.alarmstatus}}</td>
          </tr>
          <tr>
            <td  v-show="item.expendFlag">
              <table border=”2” bordercolor=”red”>
                <!-- <thead> -->
                <tr>
                  <td rowspan="3">{{item.station}}</td>
                  <th scope="col">远端标识</th>
                  <th scope="col">远端名称</th>
                  <th scope="col">输入电压</th>
                  <th scope="col">输出电压</th>
                  <th scope="col">输出电流</th>
                  <th scope="col">输出功率</th>
                  <th scope="col">告警状态</th>
                </tr>
                <!-- </thead> -->
                <!-- <tbody> -->
                 <tr v-for="items in showTable" :key="items.station">
                  <td>{{items.station}}</td>
                  <td>{{items.station}}</td>
                  <td>{{items.station}}</td>
                  <td>{{items.station}}</td>
                  <td>{{items.station}}</td>
                  <td>{{items.station}}</td>
                  <td>{{items.station}}</td>
                  <td>{{items.station}}</td>
                </tr>
                <!-- </tbody> -->
              </table>
            </td>
          </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: '',
  components: {
  },
  props: ['currentCatalogLabel', 'currentCatalogID', 'allChildrenList'],
  data () {
    return {
      autoUpdate: true,
      updatetime: 5000,
      currentCatalogLabelAc: '',
      runMsg: 'runstatus',
      readErrorNum: 0,
      showTable: [],
      rowlength: 2,
      currentAlarmTable: [],
      paramShow0: {
        station: '',
        type: '',
        com: '',
        auv: '',
        buv: '',
        cuv: '',
        aov: '',
        bov: '',
        cov: '',
        aoa: '',
        boa: '',
        coa: '',
        afu: '',
        bfu: '',
        cfu: '',
        abcv: '',
        av: '',
        bv: '',
        cv: '',
        abca: '',
        aa: '',
        ba: '',
        ca: '',
        mainstatus: '',
        stabilestatus: '',
        stepstatus: '',
        syncstatus: '',
        autostatus: '',
        alarmstatus: ''
      },
      setpowerparam: {
        setparamv: '',
        setparamampercetage: '',
        setshareamflag: '',
        setautopoweronflag: '',
        setsubratedkw: '',
        index: 0
      },
      powerparameter: {
        setparamv: '',
        setparamampercetage: '',
        setshareamflag: '',
        setautopoweronflag: '',
        setsubratedkw: '',
        index: 8
      },
      onoffparameter: [
        {slot: '00', id: 'ff', status: '55', actionselected: false},
        {slot: '01', id: '01', status: '55', actionselected: false}
      ],
      showSetOnOff: true,
      showSetParam: true,
      modolType: null,
      modolType0: null,
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  watch: {
    'TreeData': {
      handler: async function (data) {
        console.log('show_table show model has watched  tree data id ,labal:=', data.catalogid, data.label)
        // this.currentCatalogID = data.catalogid
        // this.currentCatalogLabelAc = data.label
        this.$nextTick(async function () {
          this.refresh()
        })
      },
      deep: true
    },
    'updateTime': {
      handler: async function (data) {
        console.log('show_table show has watched  updateTime:=', data)
        this.updatetime = data
        this.$nextTick(async function () {
          // this.refresh()
        })
      }
    }
  },
  created () {
    let _this = this
    this.updatetime = this.$store.state.updateTime
    this.refresh()
    if (this.autoUpdate === true) {
      if (this.updateTimer) {
        console.log('created() updateTimer is exist!!!', this.updateTimer)
      } else {
        this.updateTimer = setInterval(() => {
          console.log('show_table发起参数更新')
          _this.refresh()
        }, _this.updatetime)
        console.log('show_table开启了定时器++++++++=', this.updatetime)
      }
    } else if (this.autoUpdate === false) {
      console.log('show_table进入了关掉自动读取定时器')
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
    }
  },
  beforeMount () {},
  mounted () {},
  beforeDestroy () {
    if (this.updateTimer) {
      console.log('show_table 关掉自动读取定时器--------------------:', this.updatetime)
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }
  },
  methods: {
    changeType (type) {
      let _this = this
      this.autoUpdate = !this.autoUpdate
      if (this.autoUpdate === true) {
        this.refresh()
        console.log('show_table开启自动读取定时器')
        if (this.updateTimer) {
        } else {
          this.updateTimer = setInterval(() => {
            console.log('show_table发起参数更新请求')
            _this.refresh()
          }, _this.updatetime)
          console.log('show_table开启了定时器++++++++=', this.updateTimer)
        }
      } else if (this.autoUpdate === false) {
        console.log('show_table进入了关掉自动读取定时器')
        if (this.updateTimer) {
          console.log('show_table关掉自动读取定时器', this.updateTimer)
          clearInterval(this.updateTimer)
          this.updateTimer = null
        }
      }
      $('.selected').removeClass('selected')
    },
    expandView (v) {
      let view = ''
      // console.log('mudid in ', v)
      if (v) {
        view = '远端已展开'
      } else {
        view = '远端未展开'
      }
      return view
    },
    remoteExpand (e, visible) {
      if (visible) {
        e.expendFlag = true
      }
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
      let a = alarm
      console.log('aaaaaaaaaaaaaaaaaaaaaaa=', a)
      let view = ''
      if (a !== []) {
        for (let i = 0; i < a.length; i++) {
          switch (a[i].alarmdetail) {
            case 'com' :
              view = view + '通信故障' + ','
              break
            case 'auv' :
              view = view + 'A相欠压' + ','
              break
            case 'buv' :
              view = view + 'B相欠压' + ','
              break
            case 'cuv' :
              view = view + 'c相欠压' + ','
              break
            case 'aov' :
              view = view + 'A相过压' + ','
              break
            case 'bov' :
              view = view + 'B相过压' + ','
              break
            case 'cov' :
              view = view + 'C相过压' + ','
              break
            case 'aoa' :
              view = view + 'A相过流' + ','
              break
            case 'boa' :
              view = view + 'B相过流' + ','
              break
            case 'coa' :
              view = view + 'C相过流' + ','
              break
            case 'afu' :
              view = view + 'A相保险' + ','
              break
            case 'bfu' :
              view = view + 'B相保险' + ','
              break
            case 'cfu' :
              view = view + 'C相保险' + ','
              break
          }
        }
        return view
      } else {
        return view
      }
    },
    refresh () {
      this.getAllCurrentAlarm()
      console.log('showTable当前的children=', this.allChildrenList)
      for (let i = 0; i < this.allChildrenList.length; i++) {
        if (this.allChildrenList[i].protocoltype === '2') {
          console.log('本次读取的data node======', this.allChildrenList[i])
          this.readAcParam(this.allChildrenList[i])
        }
      }
    },
    // get all current alarm
    async getAllCurrentAlarm () {
      let _this = this
      this.instance({
        'url': '/getallcurrentalarm',
        'method': 'get'
      }).then((res) => {
        console.log('\npower all current alarm db:')
        console.log(res.data)
        _this.currentAlarmTable = res.data
      })
    },
    // 读取运行状态
    readAcParam (data) {
      let _this = this
      console.log('show_table 这次读取运行状态的catalogid：=', data.catalogid)
      let catalogid = data.catalogid
      let station = data.label
      let ipaddress = data.ipaddress
      // let paramShow = {}
      this.instance({
        url: '/device/local/getacparamfromagent/' + data.catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          // console.log('res电源运行状态读取成功！', res)
          let msg = res.data.result
          let receivedCatalogID = res.data.catalogid
          let paramShow = {}
          // console.log('msg电源运行状态读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let receivedAddress = msgJson.ipaddress.toString()
          if (ipaddress === receivedAddress) {
            console.log('show_table电源运行状态读取成功json！', msgJson, catalogid, receivedCatalogID)
          } else {
            console.log('show_table电源运行状态读取失败？？？？？？？？？json！', msgJson, catalogid)
          }
          paramShow.catalogid = catalogid
          paramShow.station = station
          if (data.protocoltype === '2') {
            paramShow.type = '交流'
          } if (data.protocoltype === '1') {
            paramShow.type = '直流'
          }
          paramShow.com = _this.alarmStatus(msgJson.com.toString())
          paramShow.auv = _this.alarmStatus(msgJson.auv.toString())
          // _this.paramShow.auv = true
          paramShow.buv = _this.alarmStatus(msgJson.buv.toString())
          paramShow.cuv = _this.alarmStatus(msgJson.cuv.toString())
          paramShow.aov = _this.alarmStatus(msgJson.aov.toString())
          paramShow.bov = _this.alarmStatus(msgJson.bov.toString())
          paramShow.cov = _this.alarmStatus(msgJson.cov.toString())
          paramShow.aoa = _this.alarmStatus(msgJson.aoa.toString())
          paramShow.boa = _this.alarmStatus(msgJson.boa.toString())
          paramShow.coa = _this.alarmStatus(msgJson.coa.toString())
          paramShow.afu = _this.alarmStatus(msgJson.afu.toString())
          paramShow.bfu = _this.alarmStatus(msgJson.bfu.toString())
          paramShow.cfu = _this.alarmStatus(msgJson.cfu.toString())
          paramShow.abcv = parseInt(msgJson.abcv.toString(), 16) / 10
          paramShow.av = parseInt(msgJson.av.toString(), 16) / 10
          paramShow.bv = parseInt(msgJson.bv.toString(), 16) / 10
          paramShow.cv = parseInt(msgJson.cv.toString(), 16) / 10
          paramShow.abca = parseInt(msgJson.abca.toString(), 16) / 10
          paramShow.aa = parseInt(msgJson.aa.toString(), 16) / 10
          paramShow.ba = parseInt(msgJson.ba.toString(), 16) / 10
          paramShow.ca = parseInt(msgJson.ca.toString(), 16) / 10
          paramShow.mainstatus = _this.indStatus(msgJson.mainstatus.toString())
          paramShow.stabilestatus = _this.indStatus(msgJson.stabilestatus.toString())
          paramShow.stepstatus = _this.indStatus(msgJson.stepstatus.toString())
          paramShow.syncstatus = _this.indStatus(msgJson.syncstatus.toString())
          paramShow.autostatus = _this.indStatus(msgJson.autostatus.toString())
          paramShow.alarmstatus = ''
          paramShow.time = msgJson.time.toString()
          paramShow.receivedCatalogID = receivedCatalogID
          paramShow.expendFlag = true
          // alarm process
          let alarmTable = this.alarmCheck(paramShow)
          // console.log('alarmTable============', alarmTable)
          if (alarmTable !== null) {
            this.alarmProcess(alarmTable)
            let alarm = this.alarmView(alarmTable)
            console.log('alarm============', alarm)
            paramShow.alarmstatus = alarm
          }
          // alarm restore
          for (let i = 0; i < _this.currentAlarmTable.length; i++) {
            if (this.currentAlarmTable[i].alarmmudid === paramShow.catalogid) {
              console.log('show_table发现当前告警记录已存在.............\n', this.currentAlarmTable[i], paramShow)
              let restoreTable = _this.alarmRestoreCheck(this.currentAlarmTable[i], paramShow)
              console.log('找到了告警恢复了嘛？？=', restoreTable)
              if (restoreTable.length > 0) {
                this.restoreProcess(restoreTable)
              }
            }
          }
          let exist = false
          for (let i = 0; i < _this.showTable.length; i++) {
            if (_this.showTable[i].station === paramShow.station) {
              console.log('show_table 发现电源已存在+——+——+——+——+——+——+——', _this.showTable[i], paramShow)
              // _this.showTable.splice(i, 1)
              _this.showTable[i].catalogid = paramShow.catalogid
              _this.showTable[i].station = paramShow.station
              _this.showTable[i].type = paramShow.type
              _this.showTable[i].com = paramShow.com
              _this.showTable[i].auv = paramShow.auv
              _this.showTable[i].buv = paramShow.buv
              _this.showTable[i].cuv = paramShow.cuv
              _this.showTable[i].aov = paramShow.aov
              _this.showTable[i].bov = paramShow.bov
              _this.showTable[i].cov = paramShow.cov
              _this.showTable[i].aoa = paramShow.aoa
              _this.showTable[i].boa = paramShow.boa
              _this.showTable[i].coa = paramShow.coa
              _this.showTable[i].afu = paramShow.afu
              _this.showTable[i].bfu = paramShow.bfu
              _this.showTable[i].cfu = paramShow.cfu
              _this.showTable[i].abcv = paramShow.abcv
              _this.showTable[i].av = paramShow.av
              _this.showTable[i].bv = paramShow.bv
              _this.showTable[i].cv = paramShow.cv
              _this.showTable[i].abca = paramShow.abca
              _this.showTable[i].aa = paramShow.aa
              _this.showTable[i].ba = paramShow.ba
              _this.showTable[i].ca = paramShow.ca
              _this.showTable[i].mainstatus = paramShow.mainstatus
              _this.showTable[i].stabilestatus = paramShow.stabilestatus
              _this.showTable[i].stepstatus = paramShow.stepstatus
              _this.showTable[i].syncstatus = paramShow.syncstatus
              _this.showTable[i].autostatus = paramShow.autostatus
              _this.showTable[i].alarmstatus = paramShow.alarmstatus
              _this.showTable[i].time = paramShow.time
              exist = true
              break
            }
          }
          if (!exist) {
            _this.showTable.unshift(paramShow)
            console.log('show_table电源AC参数push+++++++++++++++\n', paramShow)
          }
          for (let i = 0; i < _this.showTable.length; i++) {
            console.log('show_table电源AC参数表当前数据\n', _this.showTable[i])
          }
          console.log('show_table电源AC参数读取成功！param', paramShow)
        } else {
          console.log('show_table本次电源AC参数读取失败？？？', res)
          _this.readErrorNum = _this.readErrorNum + 1
          console.log('show_table累计参数读取失败次数==', _this.readErrorNum)
        }
      })
    },
    // alarmProcess
    alarmProcess (a) {
      console.log('show_table 查询到了告警！！！！！！！！！！\n', a)
      // 向上级vue发送alarmFired消息
      // this.$emit('alarmFired', a)
      // 查询当前告警列表
      // 新告警写入当前告警数据库
      // 跳转到当前告警界面并处理
    },
    // restoreProcess
    restoreProcess (r) {
      console.log('show_table 查询到了告警恢复！！！！！！！！！！\n', r)
      // 向上级vue发送alarmRestore消息
      // this.$emit('alarmRestored', r)
    },
    // alarm restore check
    alarmRestoreCheck (oldAlarm, newAlarm) {
      let restoredTable = []
      let arrayData = new Array(13)
      console.log('alarmRestoreCheck', oldAlarm, newAlarm)
      for (let i = 0; i < 13; i++) {
        arrayData[i] = {
          alarmid: '',
          alarmrestoreflag: false,
          alarmrestoreinfo: ''
        }
      }
      if (oldAlarm.alarmdetail === 'auv' && newAlarm.auv === false) {
        arrayData[0].alarmid = oldAlarm.alarmid
        arrayData[0].alarmrestoreflag = true
        arrayData[0].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[0])
      }
      if (oldAlarm.alarmdetail === 'buv' && newAlarm.buv === false) {
        arrayData[1].alarmid = oldAlarm.alarmid
        arrayData[1].alarmrestoreflag = true
        arrayData[1].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[1])
      }
      if (oldAlarm.alarmdetail === 'cuv' && newAlarm.cuv === false) {
        arrayData[2].alarmid = oldAlarm.alarmid
        arrayData[2].alarmrestoreflag = true
        arrayData[2].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[2])
      }
      if (oldAlarm.alarmdetail === 'aov' && newAlarm.aov === false) {
        arrayData[3].alarmid = oldAlarm.alarmid
        arrayData[3].alarmrestoreflag = true
        arrayData[3].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[3])
      }
      if (oldAlarm.alarmdetail === 'bov' && newAlarm.bov === false) {
        arrayData[4].alarmid = oldAlarm.alarmid
        arrayData[4].alarmrestoreflag = true
        arrayData[4].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[4])
      }
      if (oldAlarm.alarmdetail === 'cov' && newAlarm.cov === false) {
        arrayData[5].alarmid = oldAlarm.alarmid
        arrayData[5].alarmrestoreflag = true
        arrayData[5].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[5])
      }
      if (oldAlarm.alarmdetail === 'aoa' && newAlarm.aoa === false) {
        arrayData[6].alarmid = oldAlarm.alarmid
        arrayData[6].alarmrestoreflag = true
        arrayData[6].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[6])
      }
      if (oldAlarm.alarmdetail === 'boa' && newAlarm.boa === false) {
        arrayData[7].alarmid = oldAlarm.alarmid
        arrayData[7].alarmrestoreflag = true
        arrayData[7].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[7])
      }
      if (oldAlarm.alarmdetail === 'coa' && newAlarm.coa === false) {
        arrayData[8].alarmid = oldAlarm.alarmid
        arrayData[8].alarmrestoreflag = true
        arrayData[8].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[8])
      }
      if (oldAlarm.alarmdetail === 'afu' && newAlarm.afu === false) {
        arrayData[9].alarmid = oldAlarm.alarmid
        arrayData[9].alarmrestoreflag = true
        arrayData[9].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[9])
      }
      if (oldAlarm.alarmdetail === 'bfu' && newAlarm.bfu === false) {
        arrayData[10].alarmid = oldAlarm.alarmid
        arrayData[10].alarmrestoreflag = true
        arrayData[10].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[10])
      }
      if (oldAlarm.alarmdetail === 'cfu' && newAlarm.cfu === false) {
        arrayData[11].alarmid = oldAlarm.alarmid
        arrayData[11].alarmrestoreflag = true
        arrayData[11].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[11])
      }
      if (oldAlarm.alarmdetail === 'com' && newAlarm.com === false) {
        arrayData[12].alarmid = oldAlarm.alarmid
        arrayData[12].alarmrestoreflag = true
        arrayData[12].alarmrestoreinfo = newAlarm.time
        restoredTable.push(arrayData[12])
      }
      return restoredTable
    },
    // alarm fired check
    alarmCheck (a) {
      let alarmFired = false
      alarmFired = a.auv | a.buv | a.cuv | a.aov | a.bov | a.cov | a.aoa | a.boa | a.coa | a.afu | a.bfu | a.cfu | a.com
      let alarmTable0 = []
      let arrayData = new Array(13)
      for (let i = 0; i < 13; i++) {
        arrayData[i] = {
          alarmid: '',
          alarmstation: a.station,
          alarmmudid: a.catalogid,
          alarmreceivedtime: a.time,
          alarmfiredtime: a.time,
          alarmdetail: '',
          alarmreason: '',
          alarmlevel: '',
          alarmconfirmedflag: '',
          alarmconfirmedtime: '',
          alarmconfirmedinfo: '',
          alarmrestoreflag: '',
          alarmrestoreinfo: '',
          alarmsourceip: '',
          alarmaddition: ''
        }
      }
      if (alarmFired) {
        if (a.auv) {
          arrayData[0].alarmdetail = 'auv'
          arrayData[0].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[0].alarmdetail
          arrayData[0].alarmStatus = true
          arrayData[0].time = a.time
          console.log('auv', arrayData[0])
          alarmTable0.push(arrayData[0])
          console.log('auv后', alarmTable0)
        }
        if (a.buv) {
          arrayData[1].alarmdetail = 'buv'
          arrayData[1].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[1].alarmdetail
          arrayData[1].alarmStatus = true
          arrayData[1].time = a.time
          console.log('buv', arrayData[1])
          alarmTable0.push(arrayData[1])
          console.log('buv后', alarmTable0)
        }
        if (a.cuv) {
          arrayData[2].alarmdetail = 'cuv'
          arrayData[2].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[2].alarmdetail
          arrayData[2].alarmStatus = true
          arrayData[2].time = a.time
          console.log('cuv', arrayData[2])
          alarmTable0.push(arrayData[2])
          console.log('cuv后', alarmTable0)
        }
        if (a.aov) {
          arrayData[3].alarmdetail = 'aov'
          arrayData[3].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[3].alarmdetail
          arrayData[3].alarmStatus = true
          arrayData[3].time = a.time
          console.log('aov', arrayData[3])
          alarmTable0.push(arrayData[3])
          console.log('aov后', alarmTable0)
        }
        if (a.bov) {
          arrayData[4].alarmdetail = 'bov'
          arrayData[4].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[4].alarmdetail
          arrayData[4].alarmStatus = true
          arrayData[4].time = a.time
          console.log('buv', arrayData[4])
          alarmTable0.push(arrayData[4])
          console.log('buv后', alarmTable0)
        }
        if (a.cov) {
          arrayData[5].alarmdetail = 'cov'
          arrayData[5].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[5].alarmdetail
          arrayData[5].alarmStatus = true
          arrayData[5].time = a.time
          console.log('cov', arrayData[5])
          alarmTable0.push(arrayData[5])
          console.log('cov后', alarmTable0)
        }
        if (a.aoa) {
          arrayData[6].alarmdetail = 'aoa'
          arrayData[6].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[6].alarmdetail
          arrayData[6].alarmStatus = true
          arrayData[6].time = a.time
          console.log('aoa', arrayData[6])
          alarmTable0.push(arrayData[6])
          console.log('aoa后', alarmTable0)
        }
        if (a.boa) {
          arrayData[7].alarmdetail = 'boa'
          arrayData[7].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[7].alarmdetail
          arrayData[7].alarmStatus = true
          arrayData[7].time = a.time
          console.log('boa', arrayData[7])
          alarmTable0.push(arrayData[7])
          console.log('boa后', alarmTable0)
        }
        if (a.coa) {
          arrayData[8].alarmdetail = 'coa'
          arrayData[8].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[8].alarmdetail
          arrayData[8].alarmStatus = true
          arrayData[8].time = a.time
          console.log('coa', arrayData[8])
          alarmTable0.push(arrayData[8])
          console.log('coa后', alarmTable0)
        }
        if (a.afu) {
          arrayData[9].alarmdetail = 'afu'
          arrayData[9].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[9].alarmdetail
          arrayData[9].alarmStatus = true
          arrayData[9].time = a.time
          console.log('afu', arrayData[9])
          alarmTable0.push(arrayData[9])
          console.log('afu后', alarmTable0)
        }
        if (a.bfu) {
          arrayData[10].alarmdetail = 'bfu'
          arrayData[10].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[10].alarmdetail
          arrayData[10].alarmStatus = true
          arrayData[10].time = a.time
          console.log('bfu', arrayData[10])
          alarmTable0.push(arrayData[10])
          console.log('bfu后', alarmTable0)
        }
        if (a.cfu) {
          arrayData[11].alarmdetail = 'cfu'
          arrayData[11].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[11].alarmdetail
          arrayData[11].alarmStatus = true
          arrayData[11].time = a.time
          console.log('cfu', arrayData[11])
          alarmTable0.push(arrayData[11])
          console.log('cfu后', alarmTable0)
        }
        if (a.com) {
          arrayData[12].alarmdetail = 'com'
          arrayData[12].alarmid = a.catalogid + '_' + a.time + '_' + arrayData[11].alarmdetail
          arrayData[12].alarmStatus = true
          arrayData[12].time = a.time
          console.log('com', arrayData[12])
          alarmTable0.push(arrayData[12])
          console.log('com后', alarmTable0)
        }
        console.log('查询到了告警！！！！！！！！！！\n', alarmTable0)
        return alarmTable0
      }
      return null
    },
    // 设置参数组件关闭
    closeModal () {
      this.modolType = null
      this.modolType0 = null
    }
  },
  computed: {
    ...mapGetters({
      TreeData: 'TreeData',
      updateTime: 'updateTime'
    })
  }
}
</script>
<style lang='' scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
tbody {
  display: block;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
thead,
tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
  word-break: break-all;
}

table tbody::-webkit-scrollbar {
  width: 6px;
}
table tbody::-webkit-scrollbar-thumb {
  background-color: #01f5f1;
  border-radius: 5px;
}
table tbody::-webkit-scrollbar-track {
  background-color: #004453;
}
table tbody::-webkit-scrollbar-thumb:hover {
  background-color: rgb(17, 177, 174);
}
table tbody::-webkit-scrollbar-thumb:active {
  background-color: rgb(9, 136, 134);
}
::-webkit-scrollbar{
  width: 5px;
  background: #4E545A
}
/* .show-area{overflow-y:auto;}
::-webkit-scrollbar-button{  }
::-webkit-scrollbar-track{ }
::-webkit-scrollbar-track-piece {}
::-webkit-scrollbar-thumb{
  background:#6F7882;
  border-radius: 5px;
}

::-webkit-scrollbar-corner {  }
::-webkit-resizer{} */
</style>
