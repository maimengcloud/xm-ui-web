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

        { path: 'xmProject/XmProjectAdd', component: _import('xm/core/xmProject/XmProjectAdd'), name: 'xmProjectAdd',hidden:true, meta: { title: '项目立项' }},
        { path: 'xmProject/XmProjectAllMng', component: _import('xm/core/xmProject/XmProjectAllMng'), name: 'xmProjectAllMng', meta: { title: '项目总览' }},
        { path: 'xmProject/XmProjectMng', component: _import('xm/core/xmProject/XmProjectMng'), name: 'xmProjectMng', meta: { title: '项目(我的)' }},
        { path: 'xmProjectState/XmCockpit',   name: 'XmCockpit', meta: { title: '领导驾驶舱' ,openTab:true,outUrl:'${curlDomain}/xm/'+process.env.VERSION+'/#/datav/xm/branch/branchDatavFullScreen'}},
        { path: 'xmProjectState/XmProjectStateMng', component: _import('xm/core/xmProjectState/XmProjectStateMng'), name: 'XmProjectStateMng', meta: { title: '项目统计' }},
        { path: 'xmBranchState/XmBranchStateMng', component: _import('xm/core/xmBranchState/XmBranchStateMng'), name: 'XmBranchStateMng', meta: { title: '所有项目汇总' }},

        { path: 'xmRecord/XmRecord', component: _import('xm/core/xmRecord/XmRecord'), name: 'XmRecord', meta: { title: '项目动态' }},
        { path: 'xmProjectTemplate/XmProjectTemplateMng', component: _import('xm/core/xmProjectTemplate/XmProjectTemplateMng'), name: 'XmProjectTemplateMng', meta: { title: '项目模板' }},
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
        icon: 'project'
      },
      // leaf: true,//只有一个节点
      children: [

        { path: 'xmQuestion/XmQuestionAdd', component: _import('xm/core/xmQuestion/XmQuestionAdd'), name: 'XmQuestionAdd', meta: { title: '新建缺陷' }},
        { path: 'xmQuestion/XmQuestionMng', component: _import('xm/core/xmQuestion/XmQuestionMng'), name: 'XmQuestionMng', meta: { title: '缺陷管理' }},
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
        icon: 'project'
      },
      // leaf: true,//只有一个节点
      children: [

        { path: 'xmTask/XmTaskCenter', component: _import('xm/core/xmTask/XmTaskCenter'), name: 'xmTaskCenter', meta: { title: '任务大厅' }},
        { path: 'xmTask/XmMyTaskCenter', component: _import('xm/core/xmTask/XmMyTaskCenter'), name: 'xmMyTaskCenter', meta: { title: '任务(我的)' }},
        { path: 'xmTask/XmTaskCenterForProduct', component: _import('xm/core/xmTask/XmTaskCenterForProduct'), name: 'XmTaskCenterForProduct', meta: { title: '产品任务',hidden:true }},

      ]
    },
    {
      path: '/xm/core/xmProduct/XmProductInfoRoute',
      component: _import('xm/core/xmProduct/XmProductInfoRoute'),
      name: 'XmProductInfoRoute',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '产品管理',
        icon: 'project',
        hidden:true
      },
    },
    {
      path: '/xm/core',
      component: Layout,
      name: '产品管理',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '产品管理',
        icon: 'project'
      },
      // leaf: true,//只有一个节点
      children: [
        { path: 'xmProduct/XmProductAllMng', component: _import('xm/core/xmProduct/XmProductAllMng'), name: 'XmProductAllMng', meta: { title: '产品总览' }},

         { path: 'xmProduct/XmProductMng', component: _import('xm/core/xmProduct/XmProductMng'), name: 'XmProductMng', meta: { title: '产品管理' }},

        { path: 'xmMenu/XmMenuMng', component: _import('xm/core/xmMenu/XmMenuMng'), name: 'XmMenuMng', meta: { title: '故事管理' }},
         { path: 'xmMenuExchange/XmMenuExchangeMng', component: _import('xm/core/xmMenuExchange/XmMenuExchangeMng'), name: 'XmMenuExchangeMng', meta: { title: '互动评论' }},
        { path: 'xmMenuTemplate/XmMenuTemplateMng', component: _import('xm/core/xmMenuTemplate/XmMenuTemplateMng'), name: 'XmMenuTemplateMng', meta: { title: '故事模板' }},
      ]
    },
    {
      path: '/xm/core/xmIteration/XmIterationInfoRoute',
      component: _import('xm/core/xmIteration/XmIterationInfoRoute'),
      name: 'XmIterationInfoRoute',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '迭代管理',
        icon: 'project',
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
        icon: 'project'
      },
      // leaf: true,//只有一个节点
      children: [
         { path: 'xmIteration/XmIterationMng', component: _import('xm/core/xmIteration/XmIterationMng'), name: 'XmIterationMng', meta: { title: '迭代管理' }},
        { path: 'xmIterationMenu/XmIterationMenuMng', component: _import('xm/core/xmIterationMenu/XmIterationMenuMng'), name: 'XmIterationMenuMng', meta: { title: '故事迭代' }},
      ]
    }
  ]
}
