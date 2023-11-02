/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
	routes: [
		{
			path: '/my/order',
			component: Layout,
			name: '订单',
			meta: {
				title: '订单管理',
				icon: 'business'
			},
            children: [
				{ path: 'branch/list', component: _import('mdp/menu/menuModuleBranch/Index'), name: 'MenuModuleBranchMng', meta: { title: '已购模块(平台)',icon: 'component',menu:true  }}, 

				{
				    path: 'platfrom/list',
					component: _import('mdp/mo/moOrder/Index'),
					name: '订单列表(平台)',
					meta: {
						title: '订单列表(平台)',
						icon: 'component',
						menu:true
					}
				},
				{
				    path: 'my/list',
					component: _import('mdp/mo/moOrder/MyMoOrderMng'),
					name: '我的订单',
					meta: {
						title: '我的订单',
						icon: 'component',
						menu:false
					}
				},
				{
				    path: 'index',
					component: _import('order/index'),
					name: '购买产品',
					meta: {
						title: '购买产品',
						icon: 'component',
						menu:false
					}
				},
				{
				    path: 'create',
					component: _import('order/createOrder'),
					name: '创建订单',
					meta: {
						title: '创建订单',
						icon: 'component', 
						menu:false
					},
					hidden:true,
				},
				{
				    path: 'addUsers',
					component: _import('order/addUsersIndex'),
					name: '增购人数',
					meta: {
						title: '增购人数',
						icon: 'component', 
					}
				},
				{
				    path: 'renew',
					component: _import('order/renewIndex'),
					name: '续费',
					meta: {
						title: '续费',
						icon: 'component',
					},  
				},
				{
				    path: 'paySuccess',
					component: _import('order/paySuccess'),
					name: '支付成功',
					meta: {
						title: '支付成功',
						icon: 'component'
					}, 
					hidden:true,
				}
			]
		},
        
        
	]
}
