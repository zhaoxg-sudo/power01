import Vue from 'vue'
import Router from 'vue-router'
// 引入进度条
// import Nprogress from 'nprogress'
// import 'nprogress.css'

import HelloWorld from '@/components/HelloWorld'
import alarm from '@/components/alarm'
import run from '@/components/run'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/run',
      component: HelloWorld,
      children: [
        {
          path: '/run',
          name: '运行管理',
          component: run
        },
        {
          path: '/alarm',
          name: '报警管理',
          component: alarm
        }
      ]
    }
  ]
})
export default router
