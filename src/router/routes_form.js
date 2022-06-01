/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV) 
 
 
export default { 
	routes:[
		{
	        path: '/mdp/form',
	        component: Layout,
	        name: '智能表单',
	        iconCls: 'fa el-icon-menu',
		    meta: {
		       title: 'IntelligentForm',
		       icon: 'capacity-form'
		    },
			hidden: true,
	        //leaf: true,//只有一个节点
	        children: [
	        	{ path: 'formDef/FormDefAdd', component: _import("mdp/form/formDef/FormDefAdd"), name: 'FormDefAdd',meta:{title:'FormDefAdd'}  , hidden: true},
	            { path: 'formDef/FormDefMng', component: _import("mdp/form/formDef/FormDefMng"), name: 'FormDefMng' ,meta:{title:'FormDefMng'} , hidden: true},
	            { path: 'formData/FormDataMng', component: _import("mdp/form/formData/FormDataMng"), name: 'FormDataMng', meta:{title:'FormDataMng'} , hidden: true}
	        ]
	    }
	]
}
