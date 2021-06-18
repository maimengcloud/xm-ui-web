/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)


export default {
	routes: [
		{
			path: '/mdp/workflow/ru',
			component: Layout,
			name: '审批中心',
			meta: {
				title: 'TaskCenter',
				icon: 'task'
			},
			iconCls: 'fa el-icon-menu',
			//leaf: true,//只有一个节点
			children: [
				{ path: 'task/TaskListAssigneeToMe', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMe"), name: 'TaskListAssigneeToMe', meta: { title: 'TaskListAssigneeToMe' } },
				{ path: 'task/TaskListAssigneeToMeCalendar', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMeCalendar"), name: 'TaskListAssigneeToMeCalendar', meta: { title: 'TaskListAssigneeToMeCalendar' } },
				{ path: 'task/TaskListAssigneeToMeClaim', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMeClaim"), name: 'TaskListAssigneeToMeClaim', meta: { title: 'TaskListAssigneeToMeClaim' } },
				{ path: 'procinstParames/ProcinstParamesExecutionSetRoute', component: _import("mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSetRoute"), name: 'ProcinstParamesExecutionSetRoute', hidden: true, meta: { title: 'ProcinstParamesExecutionSetRoute', noCache: true } },
				{ path: 'procinstParames/ProcinstParamesStartSetRoute', component: _import("mdp/workflow/ru/procinstParames/ProcinstParamesStartSetRoute"), name: 'ProcinstParamesStartSetRoute', hidden: true, meta: { title: 'ProcinstParamesStartSetRoute', noCache: true } },
				{ path: 'task/TaskMng', component: _import("mdp/workflow/ru/task/TaskMng"), name: 'TaskMng', meta: { title: 'TaskMng', roles: ['flowAdmin', 'branchAdmin', 'platformAdmin'] } }
			]
		},
		{
			path: '/mdp/workflow',
			component: Layout,
			name: '审批管理',
			iconCls: 'fa el-icon-menu',
			meta: {
				title: 'flowCenter',
				icon: 'flow'
			},
			//leaf: true,//只有一个节点
			children: [
				{ path: 'ru/execution/ExecutionListMyMonitors', component: _import("mdp/workflow/ru/execution/ExecutionListMyMonitors"), name: 'ExecutionListMyMonitors', meta: { title: 'ExecutionListMyMonitors' } },
				{ path: 'ru/execution/ExecutionListMyStart', component: _import("mdp/workflow/ru/execution/ExecutionListMyStart"), name: 'ExecutionListMyStart', meta: { title: 'ExecutionListMyStart' } },
				{ path: 'ru/execution/ExecutionMngForFormData', component: _import("mdp/workflow/ru/execution/ExecutionMngForFormData"), name: 'ExecutionMngForFormData', hidden: true, meta: { title: 'ExecutionMngForFormData' } },
				{ path: 'ru/execution/ExecutionListMyPartake', component: _import("mdp/workflow/ru/execution/ExecutionListMyPartake"), name: 'ExecutionListMyPartake', meta: { title: 'ExecutionListMyPartake' } },
				{ path: 'ru/execution/ExecutionListMySponsors', component: _import("mdp/workflow/ru/execution/ExecutionListMySponsors"), name: 'ExecutionListMySponsors', meta: { title: 'ExecutionListMySponsors' } },
				{ path: 'ru/execution/ExecutionListMySponsorsCalendar', component: _import("mdp/workflow/ru/execution/ExecutionListMySponsorsCalendar"), name: 'ExecutionListMySponsorsCalendar', meta: { title: 'ExecutionListMySponsorsCalendar' } },
				{ path: 'ru/execution/ExecutionListAll', component: _import("mdp/workflow/ru/execution/ExecutionListAll"), name: 'ExecutionListAll', meta: { title: 'ExecutionListAll', roles: ['branchAdmin', 'superAdmin', 'platformAdmin'] } },
				{ path: 're/procdef/ProcdefListForStart', component: _import("mdp/workflow/re/procdef/ProcdefListForStart"), name: 'ProcdefListForStart', meta: { title: 'ProcdefListForStart' } },
				{ path: 're/procdef/ProcdefListForBizStart', component: _import("mdp/workflow/re/procdef/ProcdefListForBizStart"), name: 'ProcdefListForBizStart', meta: { title: 'ProcdefListForBizStart' } },

				{ path: 're/procdef/ProcdefListForFormDataStart', component: _import("mdp/workflow/re/procdef/ProcdefListForFormDataStart"), name: 'ProcdefListForFormDataStart', hidden: true, meta: { title: 'ProcdefListForFormDataStart' } },

				{ path: 'hi/procinst/ExecutionListArchive', component: _import("mdp/workflow/ru/execution/ExecutionListArchive"), name: 'ExecutionListArchive', meta: { title: 'ExecutionListArchive' } }
			]
		},
		{
			path: '/mdp/workflow/hi',
			component: Layout,
			name: '历史审批',
			iconCls: 'fa el-icon-menu',
			meta: {
				title: 'procinstFlowCenter',
				icon: 'history'
			},
			//leaf: true,//只有一个节点
			children: [
				{ path: 'procinst/ProcinstListAll', component: _import("mdp/workflow/hi/procinst/ProcinstListAll"), name: 'ProcinstListAll', meta: { title: 'ProcinstListAll', roles: ['branchAdmin', 'superAdmin', 'platformAdmin'] } },
				{ path: 'procinst/ProcinstListMyStart', component: _import("mdp/workflow/hi/procinst/ProcinstListMyStart"), name: 'ProcinstListMyStart', meta: { title: 'ProcinstListMyStart' } },
				{ path: 'procinst/ProcinstListMyPartake', component: _import("mdp/workflow/hi/procinst/ProcinstListMyPartake"), name: 'ProcinstListMyPartake', meta: { title: 'ProcinstListMyPartake' } },
				{ path: 'procinst/ProcinstListMyMonitors', component: _import("mdp/workflow/hi/procinst/ProcinstListMyMonitors"), name: 'ProcinstListMyMonitors', meta: { title: 'ProcinstListMyMonitors' } },
				{ path: 'procinst/ProcinstListMySponsors', component: _import("mdp/workflow/hi/procinst/ProcinstListMySponsors"), name: 'ProcinstListMySponsors', meta: { title: 'ProcinstListMySponsors' } },

			]
		},
		{
			path: '/mdp/workflow',
			component: Layout,
			name: '审批模型',
			iconCls: 'fa el-icon-menu',
			//leaf: true,//只有一个节点
			meta: {
				title: 'modelCenter',
				icon: 'model'
			},
			children: [
				{ path: 'editor/Index', component: _import("mdp/workflow/editor/Index"), name: '在线模型编辑器', meta: { title: 'workflowEditorIndex', openTab: true, outUrl: 'https://www.qingqinkj.com/workflow/m1/modeler-ui/' } },
				{ path: 'de/ModelMng', component: _import("mdp/workflow/de/model/ModelMng"), name: 'ModelMng', meta: { title: 'ModelMng' } },
				{ path: 're/DeploymentMng', component: _import("mdp/workflow/re/deployment/DeploymentMng"), name: 'DeploymentMng', meta: { title: 'DeploymentMng' } },
				{ path: 're/procdef/ProcdefSuspend', component: _import("mdp/workflow/re/procdef/ProcdefSuspend"), name: 'ProcdefSuspend', meta: { title: 'ProcdefSuspend' } },
				{ path: 're/procdef/ProcdefListForParames', component: _import("mdp/workflow/re/procdef/ProcdefListForParames"), name: 'ProcdefListForParames', meta: { title: 'ProcdefListForParames' } }, 
				{ path: 'biz/bizModel/BizModelMng', component: _import("mdp/workflow/biz/bizModel/BizModelMng"), name: 'BizModelMng', meta: { title: 'BizModelMng' } },
			]
		}, 
		
	]
}
