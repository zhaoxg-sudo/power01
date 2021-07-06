<template>
  <div id="topo-container">
    <!-- <item-list id="item-list-left"></item-list> -->
    <div>
      <h4>{{this.runMsg}}</h4>
    </div>
    <div id="chart-container">
      <div class="toolbar">
        <!-- <el-button type="primary" size="medium" @click="itemRemove()">删除</el-button> -->
        <!-- <el-button type="primary" size="medium" @click="save()">保存</el-button> -->
        <el-button type="primary" size="medium" @click="runStatus()">get运行状态</el-button>
        <el-button type="primary" size="medium" @click="getSetParam()">get设置参数</el-button>
        <el-button type="primary" size="medium" @click="subModuleID()">get子模块ID</el-button>
        <el-button type="primary" size="medium" @click="getAlarmData()">get报警信息</el-button>
        <el-button type="primary" size="medium" @click="setPowerOn()">set电源开机</el-button>
        <el-button type="primary" size="medium" @click="setPowerOff()">set电源关机</el-button>
        <el-button type="primary" size="medium" @click="setPowerParam()">set电源参数</el-button>
      </div>
      <svg
        id="topo-chart"
        width="100%"
        height="100%"
        style="stroke: rgb(0, 0, 255); stroke-width: 2"
      ></svg>
    </div>

    <dialog-device
      v-if="dialog.DEVICE"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-device>
    <dialog-custom-data
      v-if="dialog.CUSTOM_DATA"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-custom-data>
    <dialog-logic-rule
      v-if="dialog.LOGIC_RULE"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-logic-rule>
    <dialog-arithmetic
      v-if="dialog.ARITHMETIC"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-arithmetic>
    <dialog-app
      v-if="dialog.APP"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-app>
    <dialog-email
      v-if="dialog.EMAIL"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-email>
    <dialog-http
      v-if="dialog.HTTP"
      :item="editItem"
      @on-close="onCloseDialog"
    ></dialog-http>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import * as d3 from 'd3'
import Chart from './chart'
import itemList from './item-list.vue'
import dialogDevice from './dialog/device.vue'
import dialogCustomData from './dialog/custom_data.vue'
import dialogLogicRule from './dialog/logic_rule.vue'
import dialogArithmetic from './dialog/arithmetic.vue'
import dialogApp from './dialog/app.vue'
import dialogEmail from './dialog/email.vue'
import dialogHttp from './dialog/http.vue'
import './dialog/_dialog.scss'

let chart = null
export default {
  components: {
    itemList,
    dialogDevice,
    dialogCustomData,
    dialogLogicRule,
    dialogArithmetic,
    dialogApp,
    dialogEmail,
    dialogHttp
  },
  name: 'topo',
  data () {
    return {
      currentTreeNodeID: '',
      runMsg: 'runstatus',
      currentCatalogID: '',
      draged: false,
      editItem: null,
      dialog: {
        DEVICE: false,
        CUSTOM_DATA: false,
        LOGIC_RULE: false,
        ARITHMETIC: false,
        APP: false,
        HTTP: false,
        EMAIL: false
      },
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  mounted () {
    let container = d3
      .select('#topo-chart')
      .style('background-color', '#4e545a')
    chart = new Chart({
      container: container,
      onItemDblclick: this.onItemDblclick
    })
    this.currentCatalogID = this.TreeData.catalogid
    // console.log('TreeData:=', this.TreeData)
    this.loadData(this.currentCatalogID)
    // this.loadDataDemo()
    this.bindDragEvent()
  },
  computed: {
    ...mapGetters({
      updateState: 'updateState',
      TreeData: 'TreeData'
    })
  },
  watch: {
    'TreeData': {
      handler: async function (data) {
        console.log('topo model has watched  tree data id ,labal:=', data.catalogid, data.label)
        this.currentTreeNodeID = data.label
        this.currentCatalogID = data.catalogid
        // refresh chart to blank
        let list = chart.getItems()
        let line = chart.getLines()
        console.log('所有item：', list)
        console.log('所有line：', line)
        await this.refreshChart()
        this.$nextTick(function () {
          // new topo load from DB
          this.loadData(this.currentCatalogID)
          // this.loadDataDemo()
          this.bindDragEvent()
        })
      },
      deep: true
    }
  },
  methods: {
    bindDragEvent () {
      let dragDeltaX, dragDeltaY, dragItem, $dragItem
      let items = d3.selectAll('.item-list .item')
      let drag = d3
        .drag()
        .on('start', function () {
          let mousePosition = d3.mouse(this)
          dragDeltaX = mousePosition[0]
          dragDeltaY = mousePosition[1]
          dragItem = this.cloneNode(true)
          document.getElementsByTagName('body')[0].append(dragItem)
          $dragItem = d3.select(dragItem)
          getItemPosition(
            $dragItem,
            d3.event.sourceEvent.x - dragDeltaX,
            d3.event.sourceEvent.y - dragDeltaY
          )
        })
        .on('drag', function () {
          getItemPosition(
            $dragItem,
            d3.event.sourceEvent.x - dragDeltaX,
            d3.event.sourceEvent.y - dragDeltaY
          )
        })
        .on('end', function () {
          let $container = document.getElementById('chart-container')
          let position = {
            x: d3.event.sourceEvent.x - dragDeltaX - $container.offsetLeft,
            y: d3.event.sourceEvent.y - dragDeltaY - $container.offsetTop
          }
          if (position.x > 0) {
            chart.addItem({
              x: position.x,
              y: position.y,
              name: $dragItem.attr('data-name'),
              type: $dragItem.attr('data-type')
            })
          }
          $dragItem.remove()
        })
      items.call(drag)

      let getItemPosition = function ($item, x, y) {
        $item.attr(
          'style',
          `position:absolute;transform:translate(${x}px, ${y}px)`
        )
      }
    },
    // 刷新画布为空白
    refreshChart () {
      // console.log('refreshChart list=', list)
      for (var element in chart.list) {
        console.log('chart item list=', element, chart.list[element])
        this.itemDelete(chart.list[element])
      }
      return chart.list
    },
    // 保存画布元素到数据库
    save () {
      let itemList = chart.getItems()
      // 存入数据库
      let items = {}
      let catalogid = this.currentCatalogID
      // for (let id in itemList) {
      //   catalogid = itemList[id].catalogid
      // }
      console.log('这次存储的catalogid：=', catalogid)
      console.log('这次存储的item列表：=', itemList)
      items.catalogid = catalogid
      items.itemdata = JSON.stringify(itemList)
      this.instance({
        url: 'topo/additem',
        method: 'post',
        data: items
      }).then(res => {
        console.log('数据库存储成功！', res)
      })
      // localStorage
      // localStorage.setItem('items', JSON.stringify(chart.getItems()))
    },
    // 读取运行状态
    runStatus () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次读取运行状态的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getrunstatus/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res电源运行状态读取成功！', res)
          let msg = res.data.result
          console.log('msg电源运行状态读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let outv = ''
          outv = msgJson.outv.toString()
          console.log('msg电源运行状态读取成功！', outv)
          _this.runMsg = '输出电压: ' + outv
        } else {
          console.log('电源运行状态读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '电源运行状态: ' + msg
        }
      })
    },
    // 读取设置参数
    getSetParam () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次读取设置参数的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getsetparam/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res电源设置参数读取成功！', res)
          let msg = res.data.result
          console.log('msg电源设置参数读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let setparamv = ''
          setparamv = msgJson.setparamv.toString()
          console.log('msg电源设置参数读取成功！', setparamv)
          _this.runMsg = '设置电压值: ' + setparamv
        } else {
          console.log('电源设置参数读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '设置电压值: ' + msg
        }
      })
    },
    // 读取子模块ID
    subModuleID () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次读取子模块ID的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getsubmoduleid/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res电源子模块ID读取成功！', res)
          let msg = res.data.result
          console.log('msg电源子模块ID读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let submodulenum = ''
          submodulenum = msgJson.submodulenum.toString()
          console.log('msg电源子模块ID读取成功！', submodulenum)
          _this.runMsg = '子模块ID数量: ' + submodulenum
        } else {
          console.log('电源子模块ID读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '子模块ID数量: ' + msg
        }
      })
    },
    // 读取告警参数
    getAlarmData () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次读取告警参数的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getalarmdata/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res电源告警参数读取成功！', res)
          let msg = res.data.result
          console.log('msg电源告警参数读取成功！', msg)
          let msgJson = JSON.parse(msg)
          let alarmbyte2 = ''
          alarmbyte2 = msgJson.alarmbyte2.poweronoff.toString()
          console.log('msg电源告警参数读取成功！', alarmbyte2)
          _this.runMsg = '告警字节2->poweronoff: ' + alarmbyte2
        } else {
          console.log('电源告警参数读取失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '告警字节2: ' + msg
        }
      })
    },
    // 控制电源开机
    setPowerOn () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次控制电源开机的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getpoweron/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res控制电源开机读取成功！', res)
          let msg = res.data.result
          console.log('msg控制电源开机成功！', msg)
          let msgJson = JSON.parse(msg)
          let setpoweron = ''
          setpoweron = msgJson.onoff.toString()
          console.log('msg控制电源开机成功！', setpoweron)
          _this.runMsg = '控制电源开机: ' + setpoweron
        } else {
          console.log('控制电源开机失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '开机: ' + msg
        }
      })
    },
    // 控制电源关机
    setPowerOff () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次控制电源关的catalogid：=', catalogid)
      this.instance({
        url: '/device/local/getpoweroff/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res控制电源关成功！', res)
          let msg = res.data.result
          console.log('msg控制电源关成功！', msg)
          let msgJson = JSON.parse(msg)
          let setpoweroff = ''
          setpoweroff = msgJson.onoff.toString()
          console.log('msg控制电源关成功！', setpoweroff)
          _this.runMsg = '控制电源关机: ' + setpoweroff
        } else {
          console.log('控制电源关机失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '关机: ' + msg
        }
      })
    },
    // 设置电源参数
    setPowerParam () {
      let catalogid = this.currentCatalogID
      let _this = this
      console.log('这次设置电源参数的catalogid：=', catalogid)
      let temp = {}
      temp.catalogid = catalogid
      temp.setparamv = 6000
      temp.setparamampercetage = 0x64
      temp.shareamflag = 0x55
      temp.autopoweronflag = 0x55
      temp.submoduleratedkw = 2
      this.instance({
        url: '/device/local/setpowerparam',
        method: 'post',
        data: temp
      }).then(res => {
        if (res.data.code === 1) {
          console.log('res设置电源参数！', res)
          let msg = res.data.result
          console.log('msg设置电源参数！', msg)
          let msgJson = JSON.parse(msg)
          let catalogid = ''
          catalogid = msgJson.onoff.toString()
          console.log('msg设置电源参数关成功！', catalogid)
          _this.runMsg = '设置电源参数: ' + catalogid
        } else {
          console.log('设置电源参数失败？？？', res)
          let msg = res.data.result
          _this.runMsg = '设置电源参数: ' + msg
        }
      })
    },
    // 从数据库中，导入站点的元素到当前画布
    loadData (id) {
      let catalogid = id
      if (catalogid) {
        this.instance({
          url: 'topo/getitem/' + catalogid,
          method: 'get'
        }).then(res => {
          if (res.data.code === 1) {
            // 把数据库中的拓扑图保存到当前画布内存中
            chart.setItems((res.data.result.itemdata))
            console.log('从数据库catalog item ，获取返回成功！', res)
          } else {
            console.log('从数据库catalog item ,无数据！！！！！', res)
          }
        })
      } else {
        console.log('catalog id ,为空！！！！！')
      }
      // chart.setItems(JSON.parse(localStorage.getItem('items')))
    },
    loadDataDemo () {
      let l1 = chart.addItem({
        x: 85,
        y: 175,
        name: 'CUSTOM_DATA',
        type: 'INPUT'
      })
      let r1 = chart.addItem({
        x: 455,
        y: 100,
        name: 'EMAIL',
        type: 'ACTION'
      })
      let r2 = chart.addItem({
        x: 455,
        y: 250,
        name: 'EMAIL',
        type: 'ACTION'
      })
      l1.updateItem({
        text: '局端直流电源1',
        catalogid: '123456'
      })
      r1.updateItem({
        text: '远端直流电源1',
        catalogid: '123456'
      })
      r2.updateItem({
        text: '远端直流电源2',
        catalogid: '123456'
      })
      let line1 = chart._addLine(l1, 'output', r1, 'input')
      let line2 = chart._addLine(l1, 'output', r2, 'input')

      console.log('新建的_output', l1._output)
      console.log('新建的_input1', r1._input)
      console.log('新建的_input2', r2._input)
      console.log('新建的item1', l1)
      console.log('新建的item2', r1)
      console.log('新建的item3', r2)

      line1.updatePath()
      line1.path.classed('active', false)
      line1.targetPortType = 'input'
      line1.targetItem = r1
      line1.fromItem['inputIds'].add(line1.targetItem.id)
      line1.fromItem['inputPathIds'].add(line1.id)
      line1.targetItem['inputIds'].add(line1.fromItem.id)
      line1.targetItem['inputPathIds'].add(line1.id)
      chart.lineList[line1.id] = line1
      chart.drawingLine = false

      line2.updatePath()
      line2.path.classed('active', false)
      line2.targetPortType = 'input'
      line2.targetItem = r2
      line2.fromItem['inputIds'].add(line2.targetItem.id)
      line2.fromItem['inputPathIds'].add(line2.id)
      line2.targetItem['inputIds'].add(line2.fromItem.id)
      line2.targetItem['inputPathIds'].add(line2.id)
      chart.lineList[line2.id] = line2
      chart.drawingLine = false

      console.log('新建的line1', line1)
      console.log('新建的line2', line2)
    },
    itemDelete (item) {
      if (item) {
        console.log('当前要删除的item=', item)
        // console.log('删除后的item list：', list)
        // 删除D3中的item
        let allList = chart.delItem(item)
        console.log('删除D3后的的chart item list：', allList)
        // 删除chart中的item
        // del 关联的线
        // chart._onItemRemove(item)
      }
    },
    itemRemove () {
      if (chart.selectedItem) {
        let item = chart.selectedItem
        console.log('当前要删除的selected item=', item)
        // console.log('删除后的item list：', list)
        // 删除D3中的item
        chart.selectedItem.remove()
        console.log('删除D3后的的chart item list：', chart.list)
        // 删除chart中的item
        console.log('当前要删除的item id=', item.id)
        delete chart.list[item.id]
        // let list = chart.delItem(selectedItem)
        console.log('删除后的item list：', chart.list)
        // del 关联的线
        // chart._onItemRemove(selectedItem)
      }
    },
    onItemDblclick (item) {
      this.editItem = item
      this.dialog[item.name] = true
    },
    onCloseDialog (item) {
      this.dialog[item.name] = false
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
h4 {
  font-weight: normal;
  background:darkorchid;
  height: 50px;
  width: 100%;
}
.toolbar {
  position: absolute;
  right: 10px;
  top: 10px;
}

#item-list-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 160px;
  border-right: 1px solid #ccc;
  background: #f3f3f3;
}

#chart-container {
  position: absolute;
  top: 0;
  left: 160px;
  bottom: 0;
  right: 0;
  overflow: hidden;
}

#topo-chart {
  cursor: crosshair;

  /deep/ .item {
    cursor: move;

    &.active .item-rect {
      stroke: #999;
      stroke-width: 1px;
      stroke-dasharray: 5px;
    }
  }

  /deep/ .item_label {
    font-size: 13px;
    fill: #fff;
    stroke-width: 0;
    user-select: none;
  }

  /deep/ .port {
    fill: #ddd;
    stroke: #999;
    stroke-width: 1;
    cursor: crosshair;
  }

  /deep/ .port-hovered {
    fill: #ff7f0e;
    stroke: #ff7f0e;
  }

  /deep/ .line {
    fill: none;
    stroke: #999;
    stroke-width: 3px;

    &.active {
      stroke: #ff7f0e;
    }
  }
}
</style>
