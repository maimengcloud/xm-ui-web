import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import routesWorkflow from './routes_workflow'
import routesForm from './routes_form' 
import routesXm from './routes_xm' 
import routesDatavXm from './routes_datav_xm' 
import routesArc from './routes_arc'
import routesIm from './routes_im' 
import routesMyWork from './routes_my_work'
//import routesOrder from './routes_order'

export { Layout }

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
 
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/error', component: _import('errorPage/error'), hidden: true },
  { path: '/changeEmailStepOne', component: _import('myWork/set/ChangeEmailStepOne'), hidden: true },
  { path: '/changeEmailStepTwo', component: _import('myWork/set/ChangeEmailStepTwo'), hidden: true },
  { path: '/invite/code/:inviteId', component: _import('login/InviteScanCode'), name: '邀请扫码',hidden:true},
 	{ path: '/invite/success', component: _import('login/InviteSuccess'), name: '扫码成功', meta: { title: 'InviteSuccess' ,menu:false} ,hidden:true},
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    meta:{title:'首页',icon: 'home-page'},
    children: [
      {
        path: 'dashboard',
        component: _import('xm/XmOverview'),
        name: '首页',
        meta: { title: '首页', icon: 'home-page', noCache: true}
      },
      { path: 'forum', name: 'forum', meta: { title: '论坛',openTab:true,outUrl:'${curlDomain}/#/communityForum' },hidden:true},
      { path: 'im', name: 'im', meta: { title: '即聊',openTab:true,outUrl:'${curlDomain}/im/'+process.env.VERSION+'/' },hidden:true},
      { path: 'helpCenter', name: 'helpCenter', meta: { title: '客服',openTab:true,outUrl:'${curlDomain}/#/helpCenter' },hidden:true},
  
      // {
      //   path: 'updateUserInfo',
      //   component: _import('mdp/sys/user/UpdateUserInfo'),
      //   name: '账户设置',
      //   meta: {
      //     title: '修改个人信息',
      //     icon: 'component'
      //   }
      // }
    ],
    hidden: false
  }, 
  
]


export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
}) 

let allRoutes = [] 
allRoutes=allRoutes.concat(routesMyWork.routes);
allRoutes=allRoutes.concat(routesXm.routes); 
allRoutes=allRoutes.concat(routesDatavXm.routes);
allRoutes=allRoutes.concat(routesWorkflow.routes).concat(routesForm.routes)
//allRoutes=allRoutes.concat(routesArc.routes);
//allRoutes=allRoutes.concat(routesIm.routes);
//allRoutes=allRoutes.concat(routesOrder.routes); 
export const asyncRouterMap = allRoutes
 
