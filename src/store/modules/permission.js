import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * 通过 route.path与menu.rpath比对看是否有对应的权限
 * @param roles 我拥有的角色
 * @param menus 我拥有的菜单
 * @param route
 */
function hasPermission(  roles,menus ,route) {
  if(route==null || route=='undefined'){
	  return false;
  }
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role.roleid) >= 0)
  } else {
	  if(route.children && route.children.length){
		  return true;
	  }else{
		  if( route.meta && route.meta.menu && menus && menus.length ){
			  return  menus.some(menu => menu.rpath==null?false:menu.rpath.indexOf(route.path) >= 0);
		  }else if( !route.meta || !route.meta.menu ){
			  return true;
		  }else{
			  return false
		  }
	  }
    return false
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles,menus ) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles,menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles,menus )
        if(route.children==null  || route.children.length==0){
        	return false
        }
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    added:false //是否已经计算完毕动态路由false没有，true已计算完毕
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_ADDED: (state, added) => {
        state.added = added 
    }
  },
  actions: {
    GenerateRoutes({ commit }, {roles,menus}) {
      return new Promise(resolve => {  
        let accessedRouters 
        if (roles.some(role => role.roleid==='superAdmin')) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles,menus)
        }
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_ADDED', true)
        resolve()
      })
    }
  }
}

export default permission
