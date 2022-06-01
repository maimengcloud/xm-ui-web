import Vue from 'vue' 
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default { 
	routes:[   
		{
			path: '/mdp/arc/mate',
			component: Layout,
			name: '论坛',
			meta: {
				title: '论坛',
				icon: 'example'
			},
			iconCls: 'fa el-icon-menu',
			//leaf: true,//只有一个节点
			children: [
			  { path: 'archive/ArchiveMng',   name: 'ArchiveMng', meta: { title: '文章管理' ,openTab:true,outUrl:'${curlDomain}/arc/'+process.env.VERSION+'/#/mdp/arc/mate/archive/ArchiveMng',menu:false} },
			  { path: 'archive/ArchiveAdd',   name: 'ArchiveAdd', meta: { title: '发表文章' ,openTab:true,outUrl:'${curlDomain}/arc/'+process.env.VERSION+'/#/mdp/arc/mate/archive/ArchiveAdd',menu:false} }, 
			]
		}, 
	]
}
