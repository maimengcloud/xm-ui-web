/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default { 
	routes:[ 
	  {
	      path: '/mdp',
	      component: Layout,
	      meta: {
	          title: 'RoleQxMng',
	          icon: 'people'
	      },
	      name: '角色权限',
	      iconCls: 'fa fa-tasks',
	      leaf: true,//只有一个节点
	      children: [  
	          { path: 'sys/role/RoleMng', component: _import('mdp/sys/role/RoleMng'), name: 'RoleMng', meta: { title: 'RoleMng',menu:false }},
	          { path: 'sys/qx/QxMng', component: _import('mdp/sys/qx/QxMng'), name: 'QxMng', meta: { title: 'QxMng' ,menu:true}},
	          { path: 'menu/menuDef/MenuDefMng', component: _import('mdp/menu/menuDef/MenuDefMng'), name: 'MenuDefMng', meta: { title: 'MenuDefMng' ,menu:true}}, 
			  { path: 'MenuModuleMng', component: _import('mdp/menu/menuModule/MenuModuleMng'), name: 'MenuModuleMng', meta: { title: '模块管理' ,menu:true  }},
			  { path: 'MenuModuleBranchMng', component: _import('mdp/menu/menuModuleBranch/MenuModuleBranchMng'), name: 'MenuModuleBranchMng', meta: { title: '已开通模块',menu:false  }}, 
	      ]
	  },  
	  {
	      path: '/mdp/sys',
	      component: Layout,
	      meta: {
	          title: 'OrgMng',
	          icon: 'peoples'
	      },
	      name: '机构管理',
	      iconCls: 'fa fa-tasks',
	      leaf: true,//只有一个节点
	      children: [  
			  { path: 'branch/BranchSet', component: _import('mdp/sys/branch/BranchSet'), name: 'BranchSet', meta: { title: '机构设置' ,menu:false}},

	          { path: 'dept/DeptMng', component: _import('mdp/sys/dept/DeptMng'), name: 'DeptMng', meta: { title: 'DeptMng' ,menu:false}},
	          { path: 'branch/BranchMng', component: _import('mdp/sys/branch/BranchMng'), name: 'BranchMng', meta: { title: 'BranchMng' ,menu:false}},
	          { path: 'post/post/PostMng', component: _import('mdp/sys/post/post/PostMng'), name: 'PostMng', meta: { title: 'PostMng' ,menu:false}},
			  { path: 'user/BranchAdm', component: _import('mdp/sys/user/BranchAdm'), name: 'BranchAdm', meta: { title: '机构管理员',menu:false },hidden:true},
	          { path: 'user/deptUserMng', component: _import('mdp/sys/user/UserMng'), name: 'UserMng', meta: { title: 'UserMng',menu:false }},
	          //{ path: 'user/noDeptUserMng', component: _import('mdp/sys/user/UserMng'), name: '用户管理(未分部门)',query:{showDeptTree:false}, meta: { title: 'NoDeptUserMng',menu:true }},
	          { path: 'user/deptPostUserMng', component: _import('mdp/sys/post/deptPostUser/DeptPostUserMng'), name: 'DeptPostUserMng', meta: { title: 'DeptPostUserMng',menu:false },hidden:true,},
	          { path: 'user/deptPostUserRole', component: _import('mdp/sys/post/deptPostUser/DeptPostUserRole'), name: 'DeptPostUserRole', meta: { title: 'DeptPostUserRole',menu:false },hidden:true,},
	          { path: 'user/deptPostUserMenu', component: _import('mdp/sys/post/deptPostUser/DeptPostUserMenu'), name: 'DeptPostUserMenu', meta: { title: 'DeptPostUserMenu',menu:false },hidden:true,},
	      ]
	  }, 
	  {
	      path: '/mdp/plat',
	      component: Layout,
	      meta: {
	          title: 'plat',
	          icon: 'international'
	      },
	      name: '平台管理',
	      iconCls: 'fa fa-tasks',
	      leaf: true,//只有一个节点
	      children: [  
	          { path: 'platform/PlatformMng', component: _import('mdp/plat/platform/PlatformMng'), name: 'PlatformMng', meta: { title: 'PlatformMng' ,menu:true}},
	          { path: 'bankAccount/BankAccountMng', component: _import('mdp/plat/bankAccount/BankAccountMng'), name: 'BankAccountMng', meta: { title: 'BankAccountMng' ,menu:true}}, 
	      ]
	  }, 
	  {
	      path: '/mdp/meta',
	      component: Layout,
	      meta: {
	          title: 'MetaData',
	          icon: 'model'
	      },
	      name: '元数据管理',
	      iconCls: 'fa el-icon-menu',
		  //leaf: true,//只有一个节点
		  //参数路径-------------------------------------------------------
	      children: [
	          { path: 'category/CategoryMng', component: _import('mdp/meta/category/CategoryMng'), name: 'CategoryMng', meta: { title: 'MetaCategoryMng' ,menu:true}},
	          { path: 'item/ItemMng', component: _import('mdp/meta/item/ItemMng'), name: 'ItemMng', meta: { title: 'ItemMng' ,menu:true}},	 
			  { path: 'item/ItemList', component: _import('mdp/meta/item/ItemList'), name: 'ItemList', meta: { title: 'ItemList' ,menu:true}},	 
			  { path: 'item/ItemSetDataRoute', component: _import('mdp/meta/item/ItemSetDataRoute'), name: '参数例子', query:{itemCode:'itemTest',itemName:'参数测试',itemType:'1'},  meta: { title:'参数测试',menu:true}},	 
			  { path: 'item/ItemSetDataFixdItemCode', component: _import('mdp/meta/item/ItemSetDataFixdItemCode'), name: '固定参数例子',   meta: { title:'固定参数例子', menu:true}},	 

			  { path: 'sysParam/SysParamMng', component: _import('mdp/meta/sysParam/SysParamMng'), name: 'SysParamMng', meta: { title: 'SysParamMng' ,menu:true}},   
			  { path: 'sysParam/SysParamSet', component: _import('mdp/meta/sysParam/SysParamSet'), name: 'SysParamSet', meta: { title: 'SysParamSet' ,menu:true}},         
      
	      ]
	  }, 
	  {
	      path: '/mdp/app',
	      component: Layout, 
	      meta: {
	          title: 'AppMdpMng',
	          icon: 'star'
	      },
	      name: '第三方应用',
	      iconCls: 'fa el-icon-menu',
	      //leaf: true,//只有一个节点
	      children: [
	          { path: 'appMdpDef/AppMdpDefMng', component: _import('mdp/app/appMdpDef/AppMdpDefMng'), name: 'AppMdpDefMng', meta: { title: 'AppMdpDefMng' ,menu:true}},
	          { path: 'appTpAuth/AppTpAuthMng', component: _import('mdp/app/appTpAuth/AppTpAuthMng'), name: 'AppTpAuthMng', meta: { title: 'AppTpAuthMng' ,menu:true}},	         
 			  

 	      ]
	  },  
		{
				path: '/mdp/openAccount',
				component: Layout, 
				meta: {
						title: 'AppMdpMng',
						icon: 'example'
				},
				name: '开户',
				iconCls: 'fa el-icon-menu',
				//leaf: true,//只有一个节点
				children: [
						{ path: 'openAccount/openAccountMng', component: _import('mdp/openAccount/openAccount/openAccountMng'), name: 'openAccountMng', meta: { title: 'OpenAccount' ,icon:'supervise-and-handle',menu:true}}
				]
		}
	]
}
