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
				title: '我的工作台',
				icon: 'task'
			},
			hidden: true,
			iconCls: 'fa el-icon-menu',
            // leaf: true,
			children: [
				{
				    path: 'index',
					component: _import('myWork/my/index'),
					name: '我的',
					meta: {
						title: '我的',
						icon: 'component'
					},
					hidden: true,
				},
                {
                    path: 'updateUserInfo',
                    component: _import('myWork/set/index'),
                    name: '账户设置',
                    meta: {
                    	title: '设置',
                    	icon: 'component'
                    },
					hidden: true,
                },
				{
                    path: 'message',
                    component: _import('myWork/message/index'),
                    name: '消息中心',
                    meta: {
                    	title: '消息中心',
                    	icon: 'component'
                    },
					hidden: true,
                },
				{
					path: 'userLoginRecord',
					component: _import('myWork/my/components/LoginRecord'),
					name: '登录日志',
					meta: {
						title: '登录日志',
						icon: 'component'
					},
					hidden: true,
				},
			]
		}
	]
}
