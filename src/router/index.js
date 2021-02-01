import Vue from 'vue'
import Router from 'vue-router'
// 引入进度条
// import Nprogress from 'nprogress'
// import 'nprogress.css'

import HelloWorld from '@/components/HelloWorld'
import alarm from '@/components/alarm'
import run from '@/components/run'
import setting from '@/components/setting/index'
import treeManager from '@/components/setting/userManage/index'
// import { settings } from 'nprogress'

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
    },
    {
      path: '/setting',
      name: '系统设置',
      // redirect: '/setting/userManage/index',
      component: setting,
      children: [
        {
          path: '/setting/userManage/index',
          name: '站点管理',
          component: treeManager
        }
      ]
    }
  ]
})
export default router
