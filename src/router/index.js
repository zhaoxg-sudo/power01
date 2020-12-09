import Vue from 'vue'
import Router from 'vue-router'
// 引入进度条
// import Nprogress from 'nprogress'
// import 'nprogress.css'

import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
export default router
