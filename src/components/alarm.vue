<template>
  <div>
      <h1>{{msg}}</h1>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'alarm',
  data () {
    return {
      msg: '还没收到websockt数据'
    }
  },
  created () {
    let _this = this
    this.$nextTick(async () => {
      this.getHeights()
      this.sockets.subscribe('alarm', (data) => {
        _this.msg = data
      })
    })
  },
  methods: {
    getHeights () {
    //  高度判断
      var contentHeight = $(window).height() - 120
      var menuHeight = $('.menubanner').outerHeight()
      $('.content').height(contentHeight)
      $('.orgTreeList').css('top', menuHeight)
      $('.openTreeList').css('top', menuHeight)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  border: 5px solid red;
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
