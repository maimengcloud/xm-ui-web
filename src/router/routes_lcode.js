/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV) 
 
 
export default { 
	routes:[
		{
	        path: '/mdp/lcode',
	        component: Layout,
	        name: '智能表单',
	        iconCls: 'fa el-icon-menu',
		    meta: {
		       title: 'IntelligentForm',
		       icon: 'capacity-form'
		    }, 
	        //leaf: true,//只有一个节点
	        children: [
				{
					iconCls: 'fa el-icon-star-off', path: 'index', component: _import("mdp/lcode/formDef/Index"), name: 'FormDefMng' ,meta:{
					title: 'FormDefIndex', } },
				{ path: 'design/index/:expandId', component: _import("mdp/lcode/formDef/Index"), name: 'FormDefIndex',meta:{title:'FormDefIndex'} ,hidden:true },
				{ path: 'design/:expandId', component: _import("mdp/lcode/formDef/DesignRoute"), name: 'FormDesignRoute',meta:{title:'FormDesign'} ,hidden:true },
				{ iconCls: 'fa el-icon-circle-plus', path: 'create', component: _import("mdp/lcode/formDef/DesignRoute"), name: 'FormDesign',meta:{title:'FormDesign'} },

				{ path: 'data/edit/:formId/:dataId', component: _import("mdp/lcode/formData/FormRoute"), name: '数据填报',meta:{title:'FormDataAddRoute'} ,hidden:true },

 	        	{ path: 'data/add/:formId', component: _import("mdp/lcode/formData/FormRoute"), name: '数据填报',meta:{title:'FormDataAddRoute'} ,hidden:true },
 	        	{ path: 'data/index/:formId', component: _import("mdp/lcode/formData/Index"), name: '智能表单数据管理',meta:{title:'FormDataMng' } ,hidden:true },
 	        	{ path: 'data/index/:formId/:dataType/:dataField', component: _import("mdp/lcode/formData/Index"), name: '智能表单数据管理',meta:{title:'FormDataMng' } ,hidden:true },

	            { path: 'data/mng', component: _import("mdp/lcode/formData/Index"), name: 'FormDataMng', meta:{title:'FormDataMng'},hidden:true }
	        ]
	    },
		{
	        path: '/mdp/lcode/gen',
	        component: Layout,
	        name: '代码生成',
	        iconCls: 'fa el-icon-menu',
		    meta: {
		       title: 'gen',
		       icon: 'capacity-form'
		    }, 
	        //leaf: true,//只有一个节点
	        children: [
				{
					path: 'index', component: _import("mdp/lcode/gen/Index"), name: 'CodeGenIndex' ,meta:{ title: 'CodeGenIndex', icon: 'component' } }, 
	        ]
	    }
	]
}
