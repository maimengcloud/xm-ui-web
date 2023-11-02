/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)
export default {
	routes: [
		{
			path: '/mdp/workflow',
			component: Layout,
			name: '审批中心',
			meta: {
				title: 'TaskCenter',
				icon: 'task'
			},
			iconCls: 'fa el-icon-menu',
			//leaf: true,//只有一个节点
			children: [ 
				{ path: 'ru/task/me', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMe"), name: 'TaskListAssigneeToMe', meta: { title: 'TaskListAssigneeToMe',xxxRoles:['user'] } },
				{ path: 'ru/task/me/calendar', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMeCalendar"), name: 'TaskListAssigneeToMeCalendar', meta: { title: 'TaskListAssigneeToMeCalendar',xxxRoles:['user'] } },
				{ path: 'ru/task/claim/me', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMeClaim"), name: 'TaskListAssigneeToMeClaim', meta: { title: 'TaskListAssigneeToMeClaim',xxxRoles:['user'] } },
				{ path: 'ru/procinst/parames/exec/set', component: _import("mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSetRoute"), name: 'ProcinstParamesExecutionSetRoute', hidden: true, meta: { title: 'ProcinstParamesExecutionSetRoute', noCache: true } },
				{ path: 'ru/procinst/parames/start/set', component: _import("mdp/workflow/ru/procinstParames/ProcinstParamesStartSetRoute"), name: 'ProcinstParamesStartSetRoute', hidden: true, meta: { title: 'ProcinstParamesStartSetRoute', noCache: true } },
				{ path: 'ru/task/list', component: _import("mdp/workflow/ru/task/Index"), name: 'TaskMng', meta: { title: 'TaskMng', roles: ['flowAdmin', 'branchAdmin', 'platformAdmin'] } },
				{ path: 're/procdef/list/biz/start', component: _import("mdp/workflow/re/procdef/ProcdefListForBizStart"), name: 'ProcdefListForBizStart', meta: { title: 'ProcdefListForBizStart',xxxRoles:['user'] },hidden: true,},
				{ path: 're/procdef/list/start', component: _import("mdp/workflow/re/procdef/ProcdefListForSimpleStart"), name: 'ProcdefListForStart', meta: { title: 'ProcdefListForStart',xxxRoles:['user'] }},

			], 
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
				{ path: 'ru/execution/list/monitors/me', component: _import("mdp/workflow/ru/execution/ExecutionListMyMonitors"), name: 'ExecutionListMyMonitors', meta: { title: 'ExecutionListMyMonitors',xxxRoles:['user'] } },
				{ path: 'ru/execution/list/start/me', component: _import("mdp/workflow/ru/execution/ExecutionListMyStart"), name: 'ExecutionListMyStart', meta: { title: 'ExecutionListMyStart',xxxRoles:['user'] } },
 				{ path: 'ru/execution/list/partake/me', component: _import("mdp/workflow/ru/execution/ExecutionListMyPartake"), name: 'ExecutionListMyPartake', meta: { title: 'ExecutionListMyPartake',xxxRoles:['user'] } },
				{ path: 'ru/execution/list/sponsors/me', component: _import("mdp/workflow/ru/execution/ExecutionListMySponsors"), name: 'ExecutionListMySponsors', meta: { title: 'ExecutionListMySponsors',xxxRoles:['user'] } },
				{ path: 'ru/execution/list/sponsors/me/calendar', component: _import("mdp/workflow/ru/execution/ExecutionListMySponsorsCalendar"), name: 'ExecutionListMySponsorsCalendar', meta: { title: 'ExecutionListMySponsorsCalendar',xxxRoles:['user'] } },
				{ path: 'ru/execution/list', component: _import("mdp/workflow/ru/execution/ExecutionListAll"), name: 'ExecutionListAll', meta: { title: 'ExecutionListAll', roles: ['branchAdmin', 'superAdmin', 'platformAdmin'] } },

 
				{ path: 'hi/procinst/list/archive', component: _import("mdp/workflow/ru/execution/ExecutionListArchive"), name: 'ExecutionListArchive', meta: { title: 'ExecutionListArchive' } }
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
				{ path: 'procinst/list', component: _import("mdp/workflow/hi/procinst/ProcinstListAll"), name: 'ProcinstListAll', meta: { title: 'ProcinstListAll', roles: ['branchAdmin', 'superAdmin', 'platformAdmin'] } },
				{ path: 'procinst/list/start/me', component: _import("mdp/workflow/hi/procinst/ProcinstListMyStart"), name: 'ProcinstListMyStart', meta: { title: 'ProcinstListMyStart',xxxRoles:['user'] } },
				{ path: 'procinst/list/partake/me', component: _import("mdp/workflow/hi/procinst/ProcinstListMyPartake"), name: 'ProcinstListMyPartake', meta: { title: 'ProcinstListMyPartake',xxxRoles:['user'] } },
				{ path: 'procinst/list/monitors/me', component: _import("mdp/workflow/hi/procinst/ProcinstListMyMonitors"), name: 'ProcinstListMyMonitors', meta: { title: 'ProcinstListMyMonitors',xxxRoles:['user'] } },
				{ path: 'procinst/list/sponsors/me', component: _import("mdp/workflow/hi/procinst/ProcinstListMySponsors"), name: 'ProcinstListMySponsors', meta: { title: 'ProcinstListMySponsors',xxxRoles:['user'] } },

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
				{ path: 'editor/index', component: _import("mdp/workflow/editor/Index"), name: '模型编辑', meta: { title: 'workflowEditorIndex', openTab: true, outUrl: '${curlDomain}/workflow/'+process.env.VERSION+'/modeler-ui/',xxxRoles:['user'] } },
				{ path: 'de/model/index', component: _import("mdp/workflow/de/model/Index"), name: 'ModelMng', meta: { title: 'ModelMng',xxxRoles:['user'] } },
				{ path: 're/deploy/index', component: _import("mdp/workflow/re/deployment/Index"), name: 'DeploymentMng', meta: { title: 'DeploymentMng',xxxRoles:['user'] } },
				{ path: 're/procdef/index', component: _import("mdp/workflow/re/procdef/Index"), name: 'ProcdefSuspend', meta: { title: 'ProcdefSuspend',xxxRoles:['user'] } },
				{ path: 're/procdef/list/parames', component: _import("mdp/workflow/re/procdef/Index"), name: 'ProcdefListForParames', meta: { title: 'ProcdefListForParames',xxxRoles:['user'] } },
				{ path: 'biz/model/index', component: _import("mdp/workflow/biz/bizModel/Index"), name: 'BizModelMng', meta: { title: 'BizModelMng',xxxRoles:['user'] } },
			]
		},

	]
}
