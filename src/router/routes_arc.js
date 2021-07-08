import Vue from 'vue' 
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default { 
	routes:[  
	    {
	      path: '/mdp/arc/aq',
	      component: Layout,
	      name: '咨询中心',
	      meta: {
	          title: '咨询中心',
	          icon: 'example'
	      },
	      iconCls: 'fa el-icon-menu',
	      //leaf: true,//只有一个节点
	      children: [
	    	{ path: 'aqQuestion/AqQuestionMng',   name: 'AqQuestionMng', meta: { title: '咨询信息管理' ,openTab:true,outUrl:'${curlDomain}/arc/'+process.env.VERSION+'/#/mdp/arc/aq/aqQuestion/AqQuestionMng',menu:false} },
	    	{ path: 'aqQuestion/AqQuestionAdd',   name: 'AqQuestionAdd', meta: { title: '发起咨询' ,openTab:true,outUrl:'${curlDomain}/arc/'+process.env.VERSION+'/#/mdp/arc/aq/aqQuestion/AqQuestionAdd',menu:false} }, 
	      	{ path: 'aqFaq/AqFaqMng',  name: 'AqFaqMng', meta: { title: '常见缺陷管理' ,openTab:true,outUrl:'${curlDomain}/arc/'+process.env.VERSION+'/#/mdp/arc/aq/aqFaq/AqFaqMng',menu:false}},
	      	
	      ]
		}, 
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
