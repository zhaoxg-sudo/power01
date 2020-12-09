// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from 'store'
import axios from 'axios'
import VueSocketio from 'vue-socket.io'

Vue.use(new VueSocketio({

  debug: true,

  connection: 'http://127.0.0.1:7001'

}))
Vue.prototype.$ajax = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  sockets: {
    connect: function () {
      console.log('socket has connected++++++++++++++++++++++++++++++++++++\n')
    }
  }
})
