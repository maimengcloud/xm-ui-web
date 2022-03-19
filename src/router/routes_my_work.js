/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
	routes: [
		{
			path: '/my/work',
			component: Layout,
			name: '我的工作台',
			meta: {
				title: 'TaskCenter',
				icon: 'task'
			},
			iconCls: 'fa el-icon-menu',
            // leaf: true,
			children: [
                {
                  path: 'updateUserInfo',
                  component: _import('mdp/sys/user/UpdateUserInfo'),
                  name: '账户设置',
                  meta: {
                    title: '修改个人信息',
                    icon: 'component'
                  }
                }
			]
		}
	]
}
