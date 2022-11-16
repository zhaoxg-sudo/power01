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
import { mapGetters } from 'vuex'
import {GET_USER_INFO} from '@/store/getters/type.js'
export default {
  name: 'power',
  data () {
    return {
      alarmMsg: '还没收到websockt数据',
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
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO
    })
  },
  created () {
    let _this = this
    this.username = this.get_user_info.user.username
    this.$nextTick(async () => {
      this.getHeightsWidths()
      // 初始化，默认展开树
      $('.orgTreeList').removeClass('treeListHide').addClass('treeListShow')
      this.$store.dispatch('treeListOpenedState', 1)
      this.sockets.subscribe('alarm', (data) => {
        // console.log(data)
        _this.alarmMsg = data
        this.$router.push('/alarm/currentAlarm/index').catch(err => { console.log('\nroot user alarm router-out-err:', err) })
        this.$store.dispatch('alarmReport', _this.alarmMsg)
        console.log('收到了后台推送的告警消息！！！！！！！！！！\n', _this.alarmMsg)
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
