<template>
  <div id="topo-container">
    <item-list id="item-list-left"></item-list>
    <div id="chart-container">
      <div class="toolbar">
        <el-button type="primary" size="medium" @click="itemRemove()">删除</el-button>
        <el-button type="primary" size="medium" @click="save()">保存</el-button>
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

    // this.loadData()
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
        // refresh chart
        let list = chart.getItems()
        let line = chart.getLines()
        console.log('所有item：', list)
        console.log('所有line：', line)
        await this.refreshChart()
        this.$nextTick(function () {
          this.loadData()
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
    refreshChart () {
      // console.log('refreshChart list=', list)
      for (var element in chart.list) {
        console.log('chart item list=', element, chart.list[element])
        this.itemDelete(chart.list[element])
        // let delItem = list[element]
        // // del 关联的线
        // chart._onItemRemove(delItem)
        // console.log('删除的delItem=', delItem)
        // // 删除chart中的item
        // // let list = chart.delItem(selectedItem)
        // // console.log('删除后的item list：', list)
        // // 删除D3中的item
        // delItem.remove()
        // console.log('删除后的chart item list：', chart.list)
        // // 删除chart中的item
        // delete chart.list[delItem]
        // // let list = chart.delItem(selectedItem)
        // console.log('删除后的item list：', chart.list)
      }
      return chart.list
    },
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
    loadData () {
      let catalogid = this.currentCatalogID
      this.instance({
        url: 'topo/getitem/' + catalogid,
        method: 'get'
      }).then(res => {
        if (res.data.code === 1) {
          chart.setItems((res.data.result.itemdata))
          console.log('从数据库catalog item ，获取返回成功！', res)
        } else {
          console.log('从数据库catalog item ,无数据！！！！！', res)
        }
      })
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
