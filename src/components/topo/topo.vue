<template>
  <div id="topo-container">
    <item-list id="item-list-left"></item-list>
    <div id="chart-container">
      <div class="toolbar">
        <el-button size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="save()">保存</el-button>
      </div>
      <svg id="topo-chart" width="70%" height="40%" style="stroke:rgb(0,0,255);stroke-width:2"></svg>
    </div>

    <dialog-device v-if="dialog.DEVICE" :item="editItem" @on-close="onCloseDialog"></dialog-device>
    <dialog-custom-data v-if="dialog.CUSTOM_DATA" :item="editItem" @on-close="onCloseDialog"></dialog-custom-data>
    <dialog-logic-rule v-if="dialog.LOGIC_RULE" :item="editItem" @on-close="onCloseDialog"></dialog-logic-rule>
    <dialog-arithmetic v-if="dialog.ARITHMETIC" :item="editItem" @on-close="onCloseDialog"></dialog-arithmetic>
    <dialog-app v-if="dialog.APP" :item="editItem" @on-close="onCloseDialog"></dialog-app>
    <dialog-email v-if="dialog.EMAIL" :item="editItem" @on-close="onCloseDialog"></dialog-email>
    <dialog-http v-if="dialog.HTTP" :item="editItem" @on-close="onCloseDialog"></dialog-http>
  </div>
</template>

<script>
  import * as d3 from "d3"
  import Chart from "./chart"
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
    components: { itemList, dialogDevice, dialogCustomData, dialogLogicRule, dialogArithmetic, dialogApp, dialogEmail, dialogHttp },
    name: 'topo',
    data() {
      return {
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
        }
      }
    },
    mounted() {
      let container = d3.select("#topo-chart").style("background-color", "#4e545a");
      chart = new Chart({
        container: container,
        onItemDblclick: this.onItemDblclick
      })

      this.loadData()
      this.bindDragEvent()


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
        text: '局端直流电源1'
      })
      r1.updateItem({
        text: '远端直流电源1'
      })
      r2.updateItem({
        text: '远端直流电源2'
      })
     // chart.addItem({
     //   x: 255,
     //   y: 250,
     //    name: 'LOGIC_RULE',
     //    type: 'FUNCTION'
     // })
     let line1 = chart._addLine(l1, 'output', r1, 'input')
     let line2 = chart._addLine(l1, 'output', r2, 'input')
     
     console.log('_input', r1._input)
     console.log('item', l1)
     line1.updatePath()
     // line1.updatePath(coordinates1)
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

     console.log('line1', line1)
     console.log('line2', line2)
    },
    methods: {
      bindDragEvent() {
       
        let dragDeltaX, dragDeltaY, dragItem, $dragItem
        let items = d3.selectAll('.item-list .item')
        let drag = d3.drag()
          .on("start", function() {
            let mousePosition = d3.mouse(this)
            dragDeltaX = mousePosition[0]
            dragDeltaY = mousePosition[1]
            dragItem = this.cloneNode(true)
            document.getElementsByTagName('body')[0].append(dragItem)
            $dragItem = d3.select(dragItem)
            getItemPosition($dragItem, d3.event.sourceEvent.x - dragDeltaX, d3.event.sourceEvent.y - dragDeltaY)
          })
          .on("drag", function() {
            getItemPosition($dragItem, d3.event.sourceEvent.x - dragDeltaX, d3.event.sourceEvent.y - dragDeltaY)
          })
          .on("end", function() {
            let $container = document.getElementById('chart-container')
            let position = {
              x: d3.event.sourceEvent.x - dragDeltaX - $container.offsetLeft,
              y: d3.event.sourceEvent.y - dragDeltaY - $container.offsetTop
            }
            if(position.x > 0) {
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

        let getItemPosition = function($item, x, y) {
          $item.attr('style', `position:absolute;transform:translate(${x}px, ${y}px)`)
        }
      },
      save() {
        console.log(chart.getItems())
        // 项目中替换为持久存储
        localStorage.setItem('items', JSON.stringify(chart.getItems()))
      },
      loadData() {
        chart.setItems(JSON.parse(localStorage.getItem('items')))
      },
      onItemDblclick(item) {
        this.editItem = item
        this.dialog[item.name] = true
      },
      onCloseDialog(item) {
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
