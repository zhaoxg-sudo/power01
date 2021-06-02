// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
// 导入JQ
// import $ from 'jquery'
import VueSocketio from 'vue-socket.io'
// 引入element ui tree css
import 'element-ui/lib/theme-chalk/index.css'
// 引入bootstrap css
import './assets/css/bootstrap.css'
// 引入 font-awesome
import './assets/css/font-awesome.css'
// 引入公用 css
import './assets/css/default.css'
// 引入播放条样式
import './assets/css/loaderskit.css'
// 引入系统设置样式
import './assets/css/setting.css'
// 引入公用 js
// import 'utils/public'
// 1.滚动条
// import './assets/js/jquery.slimscroll.min'
// 2.动态高度
// import './assets/js/effect.js'

Vue.use(ElementUI)
// web socket
Vue.use(new VueSocketio({

  debug: false,

  connection: 'http://power.ieyeplus.com:7001'

}))
Vue.prototype.$ajax = axios

Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  sockets: {
    connect: function () {
      console.log('websocket has connected++++++++++++++++++++++++++++++++++++\n')
    }
  }
})
