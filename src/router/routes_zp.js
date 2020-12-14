import Vue from 'vue'
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {
	routes: [
		{
			path: '/oa/zp',
			component: Layout,
			name: '招聘管理',
			iconCls: 'fa el-icon-menu',
			meta: {
				title: '招聘管理',
				icon: 'record'
			},
			// leaf: true,//只有一个节点
			children: [
				{ path: 'ZpDemandApply', component: _import('oa/zp/ZpDemandApply'), name: 'ZpDemandApply', meta: { title: '招聘需求申请' } },
			]
		},	
	]
}
