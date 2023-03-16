import Vue from 'vue'
import Router from 'vue-router'
// 引入进度条
// import Nprogress from 'nprogress'
// import 'nprogress.css'

import power from '@/components/power'
import currentAlarm from '@/components/alarm/currentAlarm/index'
import historyAlarm from '@/components/alarm/historyAlarm/index'
import alarm from '@/components/alarm/index'
import datamanage from '@/components/data/datamanage/index'
import tablemanage from '@/components/data/tablemanage/index'
import data from '@/components/data/index'
import run from '@/components/run'
import setting from '@/components/setting/index'
import treeManager from '@/components/setting/userManage/index'
import alarmConfig from '@/components/setting/deviceManage/index'
import dataConfig from '@/components/setting/dataManage/index'
import login from '@/components/login/index'
import store from '@/store/index'
// import { settings } from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/login', name: 'login', component: login },
    {
      path: '*',
      redirect: '/404'
    },
    {
      path: '/',
      redirect: '/run',
      component: power,
      children: [
        {
          path: '/run',
          name: '运行管理',
          component: run
        },
        {
          path: '/alarm',
          name: '告警管理',
          redirect: '/alarm/currentAlarm/index',
          component: alarm,
          children: [
            {
              path: '/alarm/currentAlarm/index',
              name: '当前告警',
              component: currentAlarm
            },
            {
              path: '/alarm/historyAlarm/index',
              name: '历史告警',
              component: historyAlarm
            }
          ]
        },
        {
          path: '/data',
          name: '用电管理',
          redirect: '/data/datamanage/index',
          component: data,
          children: [
            {
              path: '/data/datamanage/index',
              name: '统计管理',
              component: datamanage
            },
            {
              path: '/data/tablemanage/index',
              name: '图表管理',
              component: tablemanage
            }
          ]
        }
      ]
    },
    {
      path: '/setting',
      name: '配置管理',
      redirect: '/setting/userManage/index',
      component: setting,
      children: [
        {
          path: '/setting/userManage/index',
          name: '站点配置',
          component: treeManager
        },
        {
          path: '/setting/deviceManage',
          name: '设备管理',
          component: alarmConfig
        },
        {
          path: '/setting/dataManage',
          name: '空间管理',
          component: dataConfig
        }
      ]
    }
  ],
  mode: 'hash'
})
router.beforeEach((to, from, next) => {
  // NProgress.done().start()
  let toName = to.name
  let isLogin = store.state.user_info.login
  console.log('路由守卫login的当前值是', isLogin)
  if (!isLogin && toName !== 'login') {
    next({
      name: 'login'
    })
  } else {
    if (isLogin && toName === 'login') {
      next({
        path: '/'
      })
    } else {
      next()
    }
  }
})
export default router
