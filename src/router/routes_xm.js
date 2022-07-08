/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
  routes: [
    {
      path: '/xm/core',
      component: Layout,
      name: '项目管理',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '项目管理',
        icon: 'project'
      },
      // leaf: true,//只有一个节点
      children: [
        { path: 'xmProject/XmProjectAllMng', component: _import('xm/core/xmProject/XmProjectAllMng'), name: 'xmProjectAllMng', meta: { title: '项目总览' }},
        { path: 'xmProject/XmProjectMng', component: _import('xm/core/xmProject/XmProjectMng'), name: 'xmProjectMng', meta: { title: '项目(我的)' }},
        { path: 'xmProject/XmProjectRecycle', component: _import('xm/core/xmProject/XmProjectRecycle'), name: 'XmProjectRecycle', meta: { title: '项目回收站' }},
        { path: 'xmRecord/XmRecord', component: _import('xm/core/xmRecord/XmRecord'), name: 'XmRecord', meta: { title: '项目动态' }},
        { path: 'xmProject/XmProjectTplMng', component: _import('xm/core/xmProject/XmProjectTplMng'), name: 'XmProjectTplMng', meta: { title: '项目模板' }},
        { path: 'xmEnvList/XmEnvListMng', component: _import('xm/core/xmEnvList/XmEnvListMng'), name: 'XmEnvListMng', meta: { title: '环境清单' }},
        { path: 'xmTask/XmTaskCenter', component: _import('xm/core/xmTask/XmTaskCenter'), name: 'xmTaskCenter', meta: { title: '任务大厅' }},
        { path: 'xmTask/XmMyTaskCenter', component: _import('xm/core/xmTask/XmMyTaskCenter'), name: 'xmMyTaskCenter', meta: { title: '任务(我的)' }},
        { path: 'xmTask/XmTaskDetailRoute', component: _import('xm/core/xmTask/XmTaskDetailRoute'), name: 'XmTaskDetailRoute', meta: { title: '任务详情' },hidden:true},
       
      ]
    },
    {
      path: '/xm/core/xmProject/XmProjectInfoRoute',
      component: _import('xm/core/xmProject/XmProjectInfoRoute'),
      name: 'XmProjectInfoRoute',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '项目管理-路由跳转',
        icon: 'project',
      }, 
      hidden:true
    },
    {
      path: '/xm/core',
      component: Layout,
      name: '测试管理',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '测试管理',
        icon: 'bug'
      },
      // leaf: true,//只有一个节点
      children: [

        { path: 'xmQuestion/XmQuestionAdd', component: _import('xm/core/xmQuestion/XmQuestionAdd'), name: 'XmQuestionAdd', meta: { title: '新建缺陷' }},
        { path: 'xmQuestion/XmQuestionMng', component: _import('xm/core/xmQuestion/XmQuestionMng'), name: 'XmQuestionMng', meta: { title: '缺陷管理' }},
        { path: 'xmQuestion/XmQuestionMngMy', component: _import('xm/core/xmQuestion/XmQuestionMngMy'), name: 'XmQuestionMngMy', meta: { title: '我的缺陷' }},
        { path: 'xmTestCase/XmTestCaseMng', component: _import('xm/core/xmTestCase/XmTestCaseMng'), name: 'XmTestCaseMng', meta: { title: '测试设计' }},
        //{ path: 'xmTestCaseExec/XmTestCaseExecMng', component: _import('xm/core/xmTestCaseExec/XmTestCaseExecMng'), name: 'XmTestCaseExecMng', meta: { title: '测试执行' }},
        { path: 'xmQuestion/XmQuestionDetailRoute', component: _import('xm/core/xmQuestion/XmQuestionDetailRoute'), name: 'XmQuestionDetailRoute', meta: { title: '缺陷明细' },hidden:true},
 
      ]
    }, 
    {
      path: '/xm/core',
      component: Layout,
      name: 'crowd',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '众包管理',
        icon: 'task'
      },
      // leaf: true,//只有一个节点
      children: [ 
        { path: 'crowd/XmTaskCrowdMng', component: _import('xm/core/crowd/XmTaskCrowdMng'), name: 'XmTaskCrowdMng', meta: { title: '众包大厅' }}, 
        { path: 'xmTaskExecuser/XmTaskExecuserMng', component: _import('xm/core/xmTaskExecuser/XmTaskExecuserMng'), name: 'XmTaskExecuserMng', meta: { title: '候选人管理' }},
        { path: 'xmTaskExecuser/XmTaskExecuserForMy', component: _import('xm/core/xmTaskExecuser/XmTaskExecuserForMy'), name: 'XmTaskExecuserForMy', meta: { title: '候选人(我的)' }},
 
      ]
    },
    
    {
      path: '/xm/rpt', 
      name: 'reportIndex', 
      component: Layout,
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '效能分析',
        icon: 'chart'
      },
      
      children: [
        { path: 'reportIndex', component: _import('xm/rpt/reportIndex'), name: 'reportIndex', meta: { title: '指标分析' }}, 
        { path: 'branch/branchDatavFullScreen',   name: 'branchDatavFullScreen', meta: {   title: '机构效能',openTab:true,outUrl:"${curlDomain}/"+process.env.CONTEXT+"/"+process.env.VERSION+"/#/datav/xm/branch/branchDatavFullScreen" }}, 
      ]
    },
    {
      path: '/xm/core',
      component: Layout,
      name: '产品管理',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '产品管理',
        icon: 'international'
      },
      // leaf: true,//只有一个节点
      children: [
        { path: 'xmProduct/XmProductAllMng', component: _import('xm/core/xmProduct/XmProductAllMng'), name: 'XmProductAllMng', meta: { title: '产品总览' }},

         { path: 'xmProduct/XmProductMng', component: _import('xm/core/xmProduct/XmProductMng'), name: 'XmProductMng', meta: { title: '产品管理' }},
         { path: 'xmProduct/XmProductRecycle', component: _import('xm/core/xmProduct/XmProductRecycle'), name: 'XmProductRecycle', meta: { title: '产品回收站' }},

         { path: 'xmProduct/XmProductTplMng', component: _import('xm/core/xmProduct/XmProductTplMng'), name: 'XmProductTplMng', meta: { title: '产品模板' }},
         { path: 'xmMenu/XmMenuDetailRoute', component: _import('xm/core/xmMenu/XmMenuDetailRoute'), name: 'XmMenuDetailRoute', meta: { title: '需求明细' },hidden:true},

        { path: 'xmMenu/XmMenuMng', component: _import('xm/core/xmMenu/XmMenuMng'), name: 'XmMenuMng', meta: { title: '需求管理' }},
         { path: 'xmMenuExchange/XmMenuExchangeMng', component: _import('xm/core/xmMenuExchange/XmMenuExchangeMng'), name: 'XmMenuExchangeMng', meta: { title: '互动评论' }},
         { path: 'xmIteration/XmIterationMng', component: _import('xm/core/xmIteration/XmIterationMng'), name: 'XmIterationMng', meta: { title: '迭代管理' }},
         
      ]
    }, 
    
    {
      path: '/xm/core/xmProduct/XmProductInfoRoute',
      component: _import('xm/core/xmProduct/XmProductInfoRoute'),
      name: 'XmProductInfoRoute',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '产品管理-如有跳转',
        icon: 'product',
      },
      hidden:true
    },
    {
      path: '/xm/core/xmIteration/XmIterationInfoRoute',
      component: _import('xm/core/xmIteration/XmIterationInfoRoute'),
      name: 'XmIterationInfoRoute',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '迭代管理-路由跳转',
        icon: 'flow',
      },
      hidden:true
    },
    {
      path: '/xm/core',
      component: Layout,
      name: 'GroupMng',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '团队管理',
        icon: 'user'
      },
      // leaf: true,//只有一个节点
      children: [
         { path: 'xmGroup/XmGroupAllMng', component: _import('xm/core/xmGroup/XmGroupAllMng'), name: 'XmGroupAllMng', meta: { title: '团队管理' }},
         { path: 'xmGroupUser/XmGroupUserMng', component: _import('xm/core/xmGroupUser/XmGroupUserMng'), name: 'XmGroupUserMng', meta: { title: '成员管理' }},
         { path: 'xmGroup/XmGroupRoute', component: _import('xm/core/xmGroup/XmGroupRoute'), name: 'XmGroupRoute', meta: { title: '项目团队' } ,hidden:true},

      ]
    },
    {
      path: '/xm/core',
      component: Layout,
      name: 'TaskSbill',
      iconCls: 'fa el-icon-menu',
      meta: {
        menu:true,
        title: '财务结算',
        icon: 'task'
      },
      //leaf: true,//只有一个节点
      children: [
        { path: 'xmProject/XmProjectCost', component: _import('xm/core/xmProject/XmProjectCost'), name: 'XmProjectCost', meta: { title: '应付款'}},    

        { path: 'xmTaskSbill/XmTaskSbillMng', component: _import('xm/core/xmTaskSbill/XmTaskSbillMng'), name: 'XmTaskSbilllMng', meta: { title: '任务结算单'}},    
         { path: 'xmTaskWorkload/WorkloadSetDayListMy', component: _import('xm/core/xmTaskWorkload/WorkloadSetDayListMy'), name: 'WorkloadSetDayListMy', meta: { title: '工时日报(我)'}},
        { path: 'xmTaskWorkload/WorkloadSetMonthListMy', component: _import('xm/core/xmTaskWorkload/WorkloadSetMonthListMy'), name: 'WorkloadSetMonthListMy', meta: { title: '工时月报(我)'}}, 
         { path: 'xmTaskWorkload/WorkloadSetDayList', component: _import('xm/core/xmTaskWorkload/WorkloadSetDayList'), name: 'WorkloadSetDayList', meta: { title: '工时日报'}},
        { path: 'xmTaskWorkload/WorkloadSetMonthList', component: _import('xm/core/xmTaskWorkload/WorkloadSetMonthList'), name: 'WorkloadSetMonthList', meta: { title: '工时月报'}},
      ]
    }
  ]
}
