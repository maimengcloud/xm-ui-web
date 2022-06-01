import Vue from 'vue' 
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default { 
	routes:[  
	    {
	      path: '/mdp/im',
	      component: Layout,
	      name: '即聊',
	      meta: {
	          title: '即聊',
	          icon: 'example'
	      },
	      iconCls: 'fa el-icon-menu',
		  hidden: true,
	      //leaf: true,//只有一个节点
	      children: [
			{ path: 'messages/messageChat',   name: 'messageChat', meta: { title: '即聊' ,openTab:true,outUrl:'${curlDomain}/im/'+process.env.VERSION+'/#/mdp/im/messages/messageChat',menu:false}, hidden: true, },
			{ path: 'messages/crmChat',   name: 'crmChat', meta: { title: '客服' ,openTab:true,outUrl:'${curlDomain}/im/'+process.env.VERSION+'/#/mdp/im/messages/messageChat',menu:false}, hidden: true, }
	      ]
		},  
	]
}
