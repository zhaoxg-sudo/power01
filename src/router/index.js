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
import alarmConfig from '@/components/setting/deviceManage/index'
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
      component: HelloWorld,
      children: [
        {
          path: '/run',
          name: '运行管理',
          component: run
        },
        {
          path: '/alarm',
          name: '告警管理',
          component: alarm
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
          name: '告警配置',
          component: alarmConfig
        }
      ]
    }
  ],
  mode: 'hash'
})
router.beforeEach((to, from, next) => {
  // NProgress.done().start()
  /* let toName = to.name
  let fromName = from.name
  // let islogin = store.state.user_info.login
  console.log('to name= ', to.name)
  // let islogin = 'noLogin'
  if (toName !== 'login' && fromName !== 'login') {
    console.log('enter 路由守卫。rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    next({
      name: 'login'
    })
  } else {
    if (fromName === 'login') {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } */
  let toName = to.name
  // let fromName = from.name
  let isLogin = store.state.user_info.login
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
