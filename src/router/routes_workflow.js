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
				{ path: 'task/TaskListAssigneeToMe', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMe"), name: 'TaskListAssigneeToMe', meta: { title: 'TaskListAssigneeToMe',openTab:true,outUrl:'${curlDomain}/workflow/'+process.env.VERSION+'/#/${router.path}' } },
				{ path: 'task/TaskListAssigneeToMeCalendar', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMeCalendar"), name: 'TaskListAssigneeToMeCalendar', meta: { title: 'TaskListAssigneeToMeCalendar' ,openTab:true,outUrl:'${curlDomain}/workflow/'+process.env.VERSION+'/#/${router.path}'} },
				{ path: 'task/TaskListAssigneeToMeClaim', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMeClaim"), name: 'TaskListAssigneeToMeClaim', meta: { title: 'TaskListAssigneeToMeClaim' ,openTab:true,outUrl:'${curlDomain}/workflow/'+process.env.VERSION+'/#/${router.path}'} ,hidden:true},
				{ path: 'procinstParames/ProcinstParamesExecutionSetRoute', component: _import("mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSetRoute"), name: 'ProcinstParamesExecutionSetRoute', hidden: true, meta: { title: 'ProcinstParamesExecutionSetRoute', openTab:true,outUrl:'${curlDomain}/workflow/'+process.env.VERSION+'/#/${router.path}',noCache: true } },
				{ path: 'procinstParames/ProcinstParamesStartSetRoute', component: _import("mdp/workflow/ru/procinstParames/ProcinstParamesStartSetRoute"), name: 'ProcinstParamesStartSetRoute', hidden: true, meta: { title: 'ProcinstParamesStartSetRoute', openTab:true,outUrl:'${curlDomain}/workflow/'+process.env.VERSION+'/#/${router.path}',noCache: true } },
				{ path: 'task/TaskMng', component: _import("mdp/workflow/ru/task/TaskMng"), name: 'TaskMng', meta: { title: 'TaskMng', openTab:true,outUrl:'${curlDomain}/workflow/'+process.env.VERSION+'/#/${router.path}', roles: ['flowAdmin', 'branchAdmin', 'platformAdmin'] } }
			]
		}, 
	]
}
