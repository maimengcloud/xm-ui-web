import { constantRouterMap } from '@/router'

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
      if(!route.meta||!route.meta.menu){
        return true
      }
		  if( route.meta && route.meta.menu && menus && menus.length ){
			  return  menus.some(menu => menu.rpath==null?false:menu.rpath.indexOf(route.fullPath) >= 0);
		  }else if( !route.meta || !route.meta.menu ){
			  return true;
		  }else{
			  return false
		  }
	  }
    return false
  }
}
function findRouteInner(routers,fullPath){
  return findRouteByFullPath({children:routers},fullPath)
}
function findRouteByFullPath(router,fullPath){  
  if(router==null){
    return null;
  }else{
    if(router.children && router.children.length>0){
      var routerFind=null;
      router.children.forEach(i=>{
        var r= findRouteByFullPath(i,fullPath) 
        if(r){
          routerFind=r;
          return routerFind;
        }
      }) 
      return routerFind;
    }else{
      if(router.fullPath==fullPath){
        return router;
      }
    }
  }
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles,menus) { 
  if(!asyncRouterMap){
    const accessedRouters=[]
    return accessedRouters
  }
  const accessedRouters = asyncRouterMap.filter(route => { 
    if(!route.fullPath){
      route.fullPath=route.path;
    }else{
      route.fullPath=route.fullPath+"/"+route.path 
    }
    route.fullPath=route.fullPath.replace("//","/")
    if (hasPermission(roles,menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouterWithParentRoute(route, roles,menus )
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
function filterAsyncRouterWithParentRoute(proute, roles,menus) {
  
  var accessedRouters = proute.children.filter(route => {
    
    if(!route.fullPath){
      route.fullPath=proute.fullPath+"/"+route.path;
      route.fullPath=route.fullPath.replace("//","/")
    }
    
    if (hasPermission(roles,menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouterWithParentRoute(route, roles,menus )
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

function initRouter(proute) {
  if(proute==null){
    return;
  }else{
    if(!proute.fullPath){
      if(proute.path){
        proute.fullPath=proute.path
      }else{
        proute.fullPath=""
      }
    }
    if(proute.children && proute.children.length>0){
      proute.children.forEach(i=>{
        if(!i.fullPath){
          i.fullPath=proute.fullPath+"/"+i.path
          i.fullPath=i.fullPath.replace("//","/")
        }
        initRouter(i)
      })
    } 
  } 
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
      state.routers=routers 
      
    },
    SET_ADDED: (state, added) => {
        state.added = added 
    }
  },
  actions: {
    GenerateRoutes({ commit }, {roles,menus}) {
      return new Promise(resolve => {    
        initRouter({children:constantRouterMap})
        let accessedRouters 
        if (roles.some(role => role.roleid==='superAdmin'||role.roleid==='platformAdmin')) {
          accessedRouters = constantRouterMap
        } else { 
          accessedRouters = filterAsyncRouter(constantRouterMap, roles,menus)
        }
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_ADDED', true)
        resolve()
      })
    },
    FindRouter({ commit ,state}, fullPath){
      return new Promise(resolve => {  
        resolve(findRouteInner(state.routers,fullPath))
      }) 
    }
  },
  
}

export default permission
