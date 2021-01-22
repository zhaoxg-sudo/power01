<template>
  <div>
      <topMenu></topMenu>
      <container></container>
      <footNav  :username = "username"></footNav>
      <switchLeft></switchLeft>
      <treeList></treeList>
  </div>
</template>

<script>
import $ from 'jquery'
import topMenu from './topMenu/index.vue'
import container from './container/index.vue'
import footNav from './footNav/index.vue'
import switchLeft from './switchLeft/index.vue'
import treeList from './treeList/index.vue'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '还没收到websockt数据',
      devicelist: [],
      username: '',
      instance: this.$ajax.create({
        baseURL: 'http://power.ieyeplus.com:7001/'
      })
    }
  },
  components: {
    'topMenu': topMenu,
    'container': container,
    'footNav': footNav,
    'switchLeft': switchLeft,
    'treeList': treeList
  },
  created () {
    let _this = this
    this.username = 'power'
    this.$nextTick(async () => {
      this.getHeights()
      this.sockets.subscribe('alarm', (data) => {
        console.log(data)
        _this.msg = data
      })
      this.instance({
        'url': 'localall',
        'method': 'get'
      }).then((res) => {
        console.log('\npower local device db:')
        console.log(res.data)
        if (res.data) {
          res.data.forEach((num) => {
            this.devicelist.push(num)
            // console.log(num.dianum)
            // console.log(this.video_link_list)
          })
          console.log('\npower local device table')
          console.log(this.devicelist)
        }
      })
    })
  },
  methods: {
    getHeights () {
    //  高度判断
      var menuHeight = $('.menubanner').outerHeight()
      $('.orgTreeList').css('top', menuHeight)
      $('.openTreeList').css('top', menuHeight)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
