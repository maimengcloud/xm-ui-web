/* Layout */
import Layout from '../views/layout/Layout'
import XmProjectLayout from '../views/xm/core/xmProject/index'
import XmProductLayout from '../views/xm/core/xmProduct/index'
import XmIterationLayout from '../views/xm/core/xmIteration/index'
import XmTestLayout from '../views/xm/core/xmTestCasedb/index'
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
        { path: 'xmProject/XmProjectAllMng', component: _import('xm/core/xmProject/XmProjectAllMng'), name: 'xmProjectAllMng', meta: { title: '项目总览',roles:["user"] }},
        { path: 'xmProject/XmProjectMng', component: _import('xm/core/xmProject/XmProjectMng'), name: 'xmProjectMng', meta: { title: '项目(我的)',roles:["user"] }},
        { path: 'xmProject/XmProjectRecycle', component: _import('xm/core/xmProject/XmProjectRecycle'), name: 'XmProjectRecycle', meta: { title: '项目回收站',roles:["user"] }},
        { path: 'xmRecord/XmRecord', component: _import('xm/core/xmRecord/XmRecord'), name: 'XmRecord', meta: { title: '项目动态',roles:["user"] }},
        { path: 'xmProject/XmProjectTplMng', component: _import('xm/core/xmProject/XmProjectTplMng'), name: 'XmProjectTplMng', meta: { title: '项目模板',roles:["user"] }},
        { path: 'xmEnvList/XmEnvListMng', component: _import('xm/core/xmEnvList/XmEnvListMng'), name: 'XmEnvListMng', meta: { title: '环境清单',roles:["user"] }},
        { path: 'xmTask/XmTaskCenter', component: _import('xm/core/xmTask/XmTaskCenter'), name: 'xmTaskCenter', meta: { title: '任务大厅',roles:["user"] }},
        { path: 'xmTask/XmMyTaskCenter', component: _import('xm/core/xmTask/XmMyTaskCenter'), name: 'xmMyTaskCenter', meta: { title: '任务(我的)',roles:["user"] }},
        { path: 'xmTask/XmTaskDetailRoute', component: _import('xm/core/xmTask/XmTaskDetailRoute'), name: 'XmTaskDetailRoute', meta: { title: '任务详情',roles:["user"] },hidden:true},
       

      ]
    },{
      path: '/xm/core/project',
      component: XmProjectLayout,
      name: '项目管理',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '项目管理',
        icon: 'project'
      }, 
      hidden:true,
      // leaf: true,//只有一个节点
      children: [
        {
          path: 'overview',
          component: _import('xm/core/xmProject/XmProjectOverviewComplex'),
          name: 'projectOverview',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-首页',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'product',
          component: _import('xm/core/xmProduct/XmProductForLinkComplex'),
          name: 'projectProductLink',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-产品',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'menu',
          component: _import('xm/core/xmMenu/XmMenuBoxForProject'),
          name: 'projectMenu',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-需求',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'iteration',
          component: _import('xm/core/xmIteration/XmIterationForLinkComplex'),
          name: 'projectIteration',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-迭代',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'plan',
          component: _import('xm/core/xmTask/XmPlanForProject'),
          name: 'projectPlan',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-计划',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'task',
          component: _import('xm/core/xmTask/XmTaskListForProject'),
          name: 'projectTask',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-任务',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'env',
          component: _import('xm/core/xmEnvList/XmEnvListMng'),
          name: 'projectEnv',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-环境清单',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'question',
          component: _import('xm/core/xmQuestion/XmQuestionForProject'),
          name: 'projectQuestion',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-缺陷',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'group',
          component: _import('xm/core/xmGroup/XmGroupForProject'),
          name: 'projectGroup',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-团队',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'contract',
          component: _import('xm/core/xmContract/XmContractForProject'),
          name: 'projectContract',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-合同',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'record',
          component: _import('xm/core/xmRecord/XmRecordForProject'),
          name: 'projectRecord',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-日志',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'budget',
          component: _import('xm/core/xmProject/XmProjectBudgetCost'),
          name: 'projectBudget',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-预算',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        }, 
        {
          path: 'cost',
          component: _import('xm/core/xmProject/XmProjectCost'),
          name: 'projectCost',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-费用',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        }, 
        {
          path: 'workloadDay',
          component: _import('xm/core/xmWorkload/WorkloadSetDayList'),
          name: 'projectBudget',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-工时日报',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'workloadMonth',
          component: _import('xm/core/xmWorkload/WorkloadSetMonthList'),
          name: 'projectWorkloadMonth',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-工时月报',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'file',
          component: _import('xm/core/xmFile/XmFileForProject'),
          name: 'projectFile',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-文档',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'rpt',
          component: _import('xm/rpt/indexForProject'),
          name: 'projectReport',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '项目-效能',
            icon: 'project',roles:["user"]
          }, 
          hidden:true
        },
        
      ]
    },
    {
      path: '/xm/core/product',
      component: XmProductLayout,
      name: '产品管理',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '产品管理',
        icon: 'product'
      }, 
      hidden:true,
      // leaf: true,//只有一个节点
      children: [
        {
          path: 'overview',
          component: _import('xm/core/xmProduct/XmProductOverviewComplex'),
          name: 'productOverview',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-首页',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'project',
          component: _import('xm/core/xmProject/XmProjectForLinkComplex'),
          name: 'productProjectLink',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-项目',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'menu',
          component: _import('xm/core/xmMenu/XmMenuBoxForProduct'),
          name: 'productMenu',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-需求',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'func',
          component: _import('xm/core/xmFunc/XmFuncForProduct'),
          name: 'productFunc',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-模块',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'iteration',
          component: _import('xm/core/xmIteration/XmIterationForLinkComplex'),
          name: 'productIteration',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-迭代',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'plan',
          component: _import('xm/core/xmTask/XmPlanForProduct'),
          name: 'productPlan',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-计划',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'task',
          component: _import('xm/core/xmTask/XmTaskListForProduct'),
          name: 'productTask',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-任务',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'env',
          component: _import('xm/core/xmEnvList/XmEnvListMng'),
          name: 'productEnv',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-环境清单',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'casedb',
          component: _import('xm/core/xmTestCasedb/XmTestCasedbMngForProduct'),
          name: 'productCasedb',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-测试管理',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },  
        {
          path: 'question',
          component: _import('xm/core/xmQuestion/XmQuestionForProduct'),
          name: 'productQuestion',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-缺陷',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'group',
          component: _import('xm/core/xmGroup/XmGroupForProduct'),
          name: 'productGroup',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-团队',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'contract',
          component: _import('xm/core/xmContract/XmContractForProduct'),
          name: 'productContract',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-合同',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'record',
          component: _import('xm/core/xmRecord/XmRecordForProduct'),
          name: 'productRecord',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-日志',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },  
        {
          path: 'workloadDay',
          component: _import('xm/core/xmWorkload/WorkloadSetDayList'),
          name: 'productBudget',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-工时日报',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'workloadMonth',
          component: _import('xm/core/xmWorkload/WorkloadSetMonthList'),
          name: 'productWorkloadMonth',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-工时月报',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'file',
          component: _import('xm/core/xmFile/XmFileForProduct'),
          name: 'productFile',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-文档',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'rpt',
          component: _import('xm/rpt/indexForProduct'),
          name: 'productReport',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '产品-效能',
            icon: 'product',roles:["user"]
          }, 
          hidden:true
        },
        
      ]
    },

    {
      path: '/xm/core/iteration',
      component: XmIterationLayout,
      name: '迭代管理',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '迭代管理',
        icon: 'iteration'
      }, 
      hidden:true,
      // leaf: true,//只有一个节点
      children: [
        {
          path: 'overview',
          component: _import('xm/core/xmIteration/XmIterationOverviewComplex'),
          name: 'iterationOverview',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-首页',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'project',
          component: _import('xm/core/xmProject/XmProjectForLinkComplex'),
          name: 'iterationProjectLink',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-项目',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'menu',
          component: _import('xm/core/xmMenu/XmMenuBoxForIteration'),
          name: 'iterationMenu',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-需求',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        }, 
        {
          path: 'func',
          component: _import('xm/core/xmFunc/XmFuncForIteration'),
          name: 'iterationFunc',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-模块',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        }, 
        {
          path: 'task',
          component: _import('xm/core/xmTask/XmTaskListForIteration'),
          name: 'iterationTask',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-任务',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'casedb',
          component: _import('xm/core/xmTestCasedb/XmTestCasedbMngForIteration'),
          name: 'iterationCasedb',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-测试管理',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },  
        {
          path: 'question',
          component: _import('xm/core/xmQuestion/XmQuestionForIteration'),
          name: 'iterationQuestion',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-缺陷',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },        
        { path: 'group', component: _import('xm/core/xmGroup/XmGroupForIteration'), name: 'iterationGroup', meta: { title: '团队',roles:["user"] },hidden:true},

        {
          path: 'record',
          component: _import('xm/core/xmRecord/XmRecordForIteration'),
          name: 'iterationRecord',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-日志',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },  
        {
          path: 'workloadDay',
          component: _import('xm/core/xmWorkload/WorkloadSetDayList'),
          name: 'iterationBudget',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-工时日报',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'workloadMonth',
          component: _import('xm/core/xmWorkload/WorkloadSetMonthList'),
          name: 'iterationWorkloadMonth',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-工时月报',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },
        {
          path: 'rpt',
          component: _import('xm/rpt/indexForIteration'),
          name: 'iterationReport',
          iconCls: 'fa el-icon-menu',
          meta: {
            title: '迭代-效能',
            icon: 'iteration',roles:["user"]
          }, 
          hidden:true
        },
        
      ]
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

         { path: 'xmQuestion/XmQuestionMng', component: _import('xm/core/xmQuestion/XmQuestionMngRoute'), name: 'XmQuestionMng', meta: { title: '缺陷管理',roles:["user"] }},
        { path: 'xmQuestion/XmQuestionMngMy', component: _import('xm/core/xmQuestion/XmQuestionMngMy'), name: 'XmQuestionMngMy', meta: { title: '我的缺陷' ,roles:["user"]}},
        { path: 'xmTestCasedb/XmTestCasedbMng', component: _import('xm/core/xmTestCasedb/XmTestCasedbMng'), name: 'XmTestCasedbMng', meta: { title: '测试管理',roles:["user"] }},
 
      ]
    }, 
    {
      path: '/xm/core/test',
      component: XmTestLayout,
      name: '测试管理',
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '测试管理',
        icon: 'bug'
      },
      hidden:true,
      // leaf: true,//只有一个节点
      children: [

        { path: 'overview', component: _import('xm/core/xmTestCasedb/Overview'), name: 'testOverview', meta: { title: '测试管理',roles:["user"] },hidden:true},
        { path: 'case', component: _import('xm/core/xmTestCase/XmTestCaseList'), name: 'testCase', meta: { title: '用例管理',roles:["user"] },hidden:true},
        { path: 'flow', component: _import('xm/core/xmTestCase/XmTestCaseFlow'), name: 'testFlow', meta: { title: '用例评审',roles:["user"] },hidden:true},
        { path: 'plan', component: _import('xm/core/xmTestPlan/Overview'), name: 'testPlan', meta: { title: '测试计划',roles:["user"] },hidden:true},
        { path: 'group', component: _import('xm/core/xmGroup/XmGroupForTest'), name: 'testGroup', meta: { title: '团队',roles:["user"] },hidden:true},
        { path: 'rpt', component: _import('xm/rpt/indexForTest'), name: 'testReport', meta: { title: '统计分析',roles:["user"] },hidden:true},

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
        { path: 'crowd/XmTaskCrowdMng', component: _import('xm/core/crowd/XmTaskCrowdMng'), name: 'XmTaskCrowdMng', meta: { title: '众包大厅',roles:["user"] }}, 
        { path: 'xmTaskExecuser/XmTaskExecuserMng', component: _import('xm/core/xmTaskExecuser/XmTaskExecuserMng'), name: 'XmTaskExecuserMng', meta: { title: '候选人管理',roles:["user"] }},
        { path: 'xmTaskExecuser/XmTaskExecuserForMy', component: _import('xm/core/xmTaskExecuser/XmTaskExecuserForMy'), name: 'XmTaskExecuserForMy', meta: { title: '候选人(我的)',roles:["user"] }},
 
      ]
    },
    
    {
      path: '/xm/rpt', 
      name: 'xmRpt', 
      component: Layout,
      iconCls: 'fa el-icon-menu',
      meta: {
        title: '效能分析',
        icon: 'chart'
      },
      
      children: [
        { path: 'index', component: _import('xm/rpt/index'), name: 'rptIndex', meta: { title: '指标分析',roles:["user"] }}, 
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
        { path: 'xmProduct/XmProductAllMng', component: _import('xm/core/xmProduct/XmProductAllMng'), name: 'XmProductAllMng', meta: { title: '产品总览',roles:["user"] }},

         { path: 'xmProduct/XmProductMng', component: _import('xm/core/xmProduct/XmProductMng'), name: 'XmProductMng', meta: { title: '产品管理',roles:["user"] }},
         { path: 'xmProduct/XmProductRecycle', component: _import('xm/core/xmProduct/XmProductRecycle'), name: 'XmProductRecycle', meta: { title: '产品回收站',roles:["user"] }},

         { path: 'xmProduct/XmProductTplMng', component: _import('xm/core/xmProduct/XmProductTplMng'), name: 'XmProductTplMng', meta: { title: '产品模板',roles:["user"] }},
         { path: 'xmMenu/XmMenuDetailRoute', component: _import('xm/core/xmMenu/XmMenuDetailRoute'), name: 'XmMenuDetailRoute', meta: { title: '需求明细',roles:["user"] },hidden:true},

        { path: 'xmMenu/XmMenuMng', component: _import('xm/core/xmMenu/XmMenuMngRoute'), name: 'XmMenuMng', meta: { title: '需求管理',roles:["user"] }},
          { path: 'xmIteration/XmIterationMng', component: _import('xm/core/xmIteration/XmIterationMng'), name: 'XmIterationMng', meta: { title: '迭代管理',roles:["user"] }},
         
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
         { path: 'xmGroup/XmGroupAllMng', component: _import('xm/core/xmGroup/XmGroupAllMng'), name: 'XmGroupAllMng', meta: { title: '团队管理',roles:["user"] }},
         { path: 'xmGroupUser/XmGroupUserMng', component: _import('xm/core/xmGroupUser/XmGroupUserMng'), name: 'XmGroupUserMng', meta: { title: '成员管理',roles:["user"] }},
         { path: 'xmGroup/XmGroupRoute', component: _import('xm/core/xmGroup/XmGroupRoute'), name: 'XmGroupRoute', meta: { title: '项目团队',roles:["user"] } ,hidden:true},

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
        { path: 'xmProduct/XmProjectCost', component: _import('xm/core/xmProject/XmProjectCost'), name: 'XmProjectCost', meta: { title: '应付款',roles:["user"]}},    

        { path: 'xmTaskSbill/XmTaskSbillMng', component: _import('xm/core/xmTaskSbill/XmTaskSbillMng'), name: 'XmTaskSbilllMng', meta: { title: '任务结算单',roles:["user"]}},    
         { path: 'xmWorkload/WorkloadSetDayListMy', component: _import('xm/core/xmWorkload/WorkloadSetDayListMy'), name: 'WorkloadSetDayListMy', meta: { title: '工时日报(我)',roles:["user"]}},
        { path: 'xmWorkload/WorkloadSetMonthListMy', component: _import('xm/core/xmWorkload/WorkloadSetMonthListMy'), name: 'WorkloadSetMonthListMy', meta: { title: '工时月报(我)',roles:["user"]}}, 
         { path: 'xmWorkload/WorkloadSetDayList', component: _import('xm/core/xmWorkload/WorkloadSetDayList'), name: 'WorkloadSetDayList', meta: { title: '工时日报',roles:["user"]}},
        { path: 'xmWorkload/WorkloadSetMonthList', component: _import('xm/core/xmWorkload/WorkloadSetMonthList'), name: 'WorkloadSetMonthList', meta: { title: '工时月报',roles:["user"]}},
      ]
    }
  ]
}
