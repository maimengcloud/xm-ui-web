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
	          { path: 'sys/role/index', component: _import('mdp/sys/role/Index'), name: 'RoleMng', meta: { title: 'RoleMng',menu:false }},
	          { path: 'sys/qx/index', component: _import('mdp/sys/qx/Index'), name: 'QxMng', meta: { title: 'QxMng' ,menu:true}},
	          { path: 'menu/index', component: _import('mdp/menu/menuDef/Index'), name: 'MenuDefMng', meta: { title: 'MenuDefMng' ,menu:true}}, 
			  { path: 'menu/module/index', component: _import('mdp/menu/menuModule/Index'), name: 'MenuModuleMng', meta: { title: '模块管理' ,menu:true  }},
			  { path: 'menu/module/branch', component: _import('mdp/menu/menuModuleBranch/Index'), name: 'MenuModuleBranchMng', meta: { title: '已开通模块',menu:false  }}, 
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
			  { path: 'branch/set', component: _import('mdp/sys/branch/BranchSet'), name: 'BranchSet', meta: { title: '机构设置' ,menu:false}},
	          { path: 'user/index', component: _import('mdp/sys/user/Index'), name: 'userIndex', meta: { title: 'UserMng',menu:false }},

	          { path: 'dept/index', component: _import('mdp/sys/dept/Index'), name: 'DeptMng', meta: { title: 'DeptMng' ,menu:false}},
	          { path: 'branch/index', component: _import('mdp/sys/branch/Index'), name: 'BranchMng', meta: { title: 'BranchMng' ,menu:false}},
	          { path: 'post/index', component: _import('mdp/sys/post/Index'), name: 'PostMng', meta: { title: 'PostMng' ,menu:false}},
			  { path: 'user/adm', component: _import('mdp/sys/user/BranchAdm'), name: 'BranchAdm', meta: { title: '机构管理员',menu:false }},
 	          { path: 'user/unregister', component: _import('mdp/sys/user/UserUnregister'), name: 'UserUnregister', meta: { title: '注销审核',menu:false }},
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
	          { path: 'userValidInfo', component: _import('mdp/sys/userValidInfo/UserValidInfoMngForPerson'), name: 'UserValidInfoMngForPerson', meta: { title: '个人认证审核' ,menu:true}}, 
	          { path: 'branchValidInfo', component: _import('mdp/sys/userValidInfo/UserValidInfoMngForBranch'), name: 'UserValidInfoMngForBranch', meta: { title: '企业认证审核' ,menu:true}}, 
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
 	          { path: 'item/index', component: _import('mdp/meta/item/Index'), name: 'ItemMng', meta: { title: 'ItemMng' ,menu:false}},	 
			  { path: 'item/option/index', component: _import('mdp/meta/itemOption/Index'), name: 'ItemList', meta: { title: 'ItemList' ,menu:false}},	 
			  { path: 'item/option/index/:itemCode', component: _import('mdp/meta/itemOption/Index'), name: 'ItemList', meta: { title: 'ItemList' },hidden:true},	 

			  { path: 'item/set/:itemCode', component: _import('mdp/meta/item/Set'),hidden:true},	//如 http://wxxx.com/sys/m1/mdp/meta/item/set/xxxx?categoryId=all ,其中 categoryId 取值all、sysParams 

			  { path: 'params/index', component: _import('mdp/meta/sysParam/Index'), name: 'SysParamMng', meta: { title: 'SysParamMng' ,menu:false}},   
      
	      ]
	  }, 
	  {
	      path: '/mdp/tpa',
	      component: Layout, 
	      meta: {
	          title: 'tpaMng',
	          icon: 'star'
	      },
	      name: '第三方应用',
	      iconCls: 'fa el-icon-menu',
	      //leaf: true,//只有一个节点
	      children: [
	          { path: 'invite/index', component: _import('mdp/sys/userTpaInvite/Index'), name: '我的邀请', meta: { title: 'userTpaInviteIndex' ,menu:false}},

			  { path: 'user/index/:inviteId', component: _import('mdp/sys/userTpa/Index'), name: '我邀请的用户', meta: { title: 'myInviteUserTpa' ,menu:false}},
 			  { path: 'user/index', component: _import('mdp/sys/userTpa/Index'), name: '第三方用户查询', meta: { title: 'userTpaIndex' ,menu:false}},

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
