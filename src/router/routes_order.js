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
				title: '订单',
				icon: 'task'
			},
            children: [
				{
				    path: 'index',
					component: _import('order/index'),
					name: '我的',
					meta: {
						title: '我的',
						icon: 'component'
					}
				}
			]
		},
        
        
	]
}