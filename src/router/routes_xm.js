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

      ]
    },
    {
      path: '/xm/core/xmProject/XmProjectInfoRoute',
      component: _import('xm/core/xmProject/XmProjectInfoRoute'),
      name: 'XmProjectInfoRoute',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '项目管理',
        icon: 'project',
        hidden:true
      },
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
        { path: 'xmTestCaseExec/XmTestCaseExecMng', component: _import('xm/core/xmTestCaseExec/XmTestCaseExecMng'), name: 'XmTestCaseExecMng', meta: { title: '测试执行' }},

      ]
    },
    {
      path: '/xm/core',
      component: Layout,
      name: '项目任务',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '项目任务',
        icon: 'task'
      },
      // leaf: true,//只有一个节点
      children: [

        { path: 'xmTask/XmTaskCenter', component: _import('xm/core/xmTask/XmTaskCenter'), name: 'xmTaskCenter', meta: { title: '任务大厅' }},
        { path: 'xmTask/XmMyTaskCenter', component: _import('xm/core/xmTask/XmMyTaskCenter'), name: 'xmMyTaskCenter', meta: { title: '任务(我的)' }},
        { path: 'xmTaskExecuser/XmTaskExecuserMng', component: _import('xm/core/xmTaskExecuser/XmTaskExecuserMng'), name: 'XmTaskExecuserMng', meta: { title: '竞标管理' }},
        { path: 'xmTaskExecuser/XmTaskExecuserForMy', component: _import('xm/core/xmTaskExecuser/XmTaskExecuserForMy'), name: 'XmTaskExecuserForMy', meta: { title: '竞标(我的)' }},
 
      ]
    },
    {
      path: '/xm/core/xmProduct/XmProductInfoRoute',
      component: _import('xm/core/xmProduct/XmProductInfoRoute'),
      name: 'XmProductInfoRoute',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '产品管理',
        icon: 'product',
        hidden:true
      },
    },
    
    {
      path: '/xm/rpt', 
      name: 'reportIndex', 
      component: Layout,
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '效能分析',
        icon: 'report',
        hidden:true
      },
      
      children: [

        { path: 'reportIndex', component: _import('xm/rpt/reportIndex'), name: 'reportIndex', meta: { title: '效能分析',  icon: 'chart' }}, 
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

        { path: 'xmMenu/XmMenuMng', component: _import('xm/core/xmMenu/XmMenuMng'), name: 'XmMenuMng', meta: { title: '需求管理' }},
         { path: 'xmMenuExchange/XmMenuExchangeMng', component: _import('xm/core/xmMenuExchange/XmMenuExchangeMng'), name: 'XmMenuExchangeMng', meta: { title: '互动评论' }},
      ]
    },
    {
      path: '/xm/core/xmIteration/XmIterationInfoRoute',
      component: _import('xm/core/xmIteration/XmIterationInfoRoute'),
      name: 'XmIterationInfoRoute',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '迭代管理',
        icon: 'flow',
        hidden:true
      },
    },
    {
      path: '/xm/core',
      component: Layout,
      name: '迭代管理',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '迭代管理',
        icon: 'flow'
      },
      // leaf: true,//只有一个节点
      children: [
         { path: 'xmIteration/XmIterationMng', component: _import('xm/core/xmIteration/XmIterationMng'), name: 'XmIterationMng', meta: { title: '迭代管理',icon: 'flow' }},
       ]
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
      ]
    },
    {
      path: '/xm/core',
      component: Layout,
      name: 'TaskSbill',
      iconCls: 'fa el-icon-menu',
      meta: {
        menu:true,
        title: '任务结算',
        icon: 'task'
      },
      //leaf: true,//只有一个节点
      children: [
        { path: 'xmTaskSbill/XmTaskSbillMng', component: _import('xm/core/xmTaskSbill/XmTaskSbillMng'), name: 'XmTaskSbilllMng', meta: { title: '任务结算单'}},
        /*{ path: 'xmTaskWorkload/XmTaskWorkloadMng', component: _import('xm/core/xmTaskWorkload/XmTaskWorkloadMng'), name: 'XmTaskWorkloadMng', meta: { title: '工时列表'}},*/
        { path: 'xmTaskWorkload/ToComfirmWorkload', component: _import('xm/core/xmTaskWorkload/ToComfirmWorkload'), name: 'ToComfirmWorkload', meta: { title: '待确认工时(我)'}},
        { path: 'xmTaskWorkload/HadComfirmWorkload', component: _import('xm/core/xmTaskWorkload/HadComfirmWorkload'), name: 'HadComfirmWorkload', meta: { title: '已确认工时(我)'}},
        { path: 'xmTaskWorkload/WaitWorkloadToSbill', component: _import('xm/core/xmTaskWorkload/WaitWorkloadToSbill'), name: 'WaitWorkloadToSbill', meta: { title: '待结算工时(我)'}},
        { path: 'xmTaskWorkload/FinWorkloadToSbill', component: _import('xm/core/xmTaskWorkload/FinWorkloadToSbill'), name: 'FinWorkloadToSbill', meta: { title: '已结算工时(我)'}},
        
        { path: 'xmTaskWorkload/WorkloadSetDayListMy', component: _import('xm/core/xmTaskWorkload/WorkloadSetDayListMy'), name: 'WorkloadSetDayListMy', meta: { title: '工时日报表(我)'}},
        { path: 'xmTaskWorkload/WorkloadSetMonthListMy', component: _import('xm/core/xmTaskWorkload/WorkloadSetMonthListMy'), name: 'WorkloadSetMonthListMy', meta: { title: '工时月报表(我)'}},
        
        { path: 'xmTaskWorkload/ToComfirmWorkloadAll', component: _import('xm/core/xmTaskWorkload/ToComfirmWorkloadAll'), name: 'ToComfirmWorkloadAll', meta: { title: '待确认工时'}},
        { path: 'xmTaskWorkload/HadComfirmWorkloadAll', component: _import('xm/core/xmTaskWorkload/HadComfirmWorkloadAll'), name: 'HadComfirmWorkloadAll', meta: { title: '已确认工时'}},
         { path: 'xmTaskWorkload/WaitWorkloadToSbillAll', component: _import('xm/core/xmTaskWorkload/WaitWorkloadToSbillAll'), name: 'WaitWorkloadToSbillAll', meta: { title: '待结算工时'}},
        { path: 'xmTaskWorkload/FinWorkloadToSbillAll', component: _import('xm/core/xmTaskWorkload/FinWorkloadToSbillAll'), name: 'FinWorkloadToSbillAll', meta: { title: '已结算工时'}},
        
        { path: 'xmTaskWorkload/WorkloadSetDayList', component: _import('xm/core/xmTaskWorkload/WorkloadSetDayList'), name: 'WorkloadSetDayList', meta: { title: '工时日报表'}},
        { path: 'xmTaskWorkload/WorkloadSetMonthList', component: _import('xm/core/xmTaskWorkload/WorkloadSetMonthList'), name: 'WorkloadSetMonthList', meta: { title: '工时月报表'}},
      ]
    }
  ]
}
