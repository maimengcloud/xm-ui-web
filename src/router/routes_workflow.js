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
				{ path: 'task/TaskListAssigneeToMe', component: _import("mdp/workflow/ru/task/TaskListAssigneeToMe"), name: 'TaskListAssigneeToMe', meta: { title: '审批中心',icon: 'task',openTab:true,outUrl:'${curlDomain}/workflow/'+process.env.VERSION+'/#/${router.path}' } },
			]
		}, 
	]
}
