<template>
  <div>
      <!-- <h4>{{msg}}</h4> -->
      <div class="middleCon">
        <topo ></topo>
      </div>
  </div>
</template>

<script>
import $ from 'jquery'
import topo from './topo/topo.vue'
// import { mapGetters } from 'vuex'
export default {
  name: 'run',
  data () {
    return {
      msg: '供电系统运行正常'
    }
  },
  components: {
    topo: topo
  },
  created () {
    this.$nextTick(async () => {
      this.getHeightsWidths()
      this.sockets.subscribe('alarm', (data) => {
      })
    })
  },
  methods: {
    getHeightsWidths () {
    //  高度判断
      var contentHeight = $(window).height() - 120
      var menuHeight = $('.menubanner').outerHeight()
      $('.content').height(contentHeight)
      $('.orgTreeList').css('top', menuHeight)
      $('.openTreeList').css('top', menuHeight)
      if ($('.orgTreeList').hasClass('treeListShow')) {
        var contentWidth = $(window).width()
        var treeWidth = $('.orgTreeList').width()
        $('.content').css('left', treeWidth)
        $('.content').width(contentWidth - treeWidth - 10)
      } else {
        var contentWidths = $(window).width()
        $('.content').css('left', 0)
        $('.content').width(contentWidths - 10)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  border: 5px solid green;
  padding: 0;
  margin: 0;
}
h1, h2 {
  font-weight: normal;
  }
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
