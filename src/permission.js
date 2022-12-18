import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken,setToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (!permissionRoles) return true
  if (roles.some(role => role.roleid==='superAdmin')) return true // admin permission passed directly
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect','/changeEmailStepOne','/changeEmailStepTwo']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  var outUrl="";
  if (whiteList.indexOf(to.path) !== -1) { //在免登录白名单，直接进入
    next()
    NProgress.done() //如果当前页面为登录页，则在每个afterEach钩子后都不会触发，因此请手动处理它
    return;
  }
  if(to.meta.openTab==true && to.meta.outUrl){
	outUrl=to.meta.outUrl;
  	if(to.query){
  		var querys='';
  		Object.keys(to.query).forEach(function(key){
  			if(outUrl.indexOf(key+"=")<=0){
  				if(querys==''){
	  				querys=key+"="+to.query[key]
	  			}else{
	  				querys=querys+"&"+key+"="+to.query[key]
	  			}
  			}

  		});
  		if(querys!=''){
  			if(outUrl.indexOf("?")>0){
  				outUrl=outUrl+"&"+querys;
  			}else{
  				outUrl=outUrl+"?"+querys;
  			}
  		}
  	}
  	if(outUrl.indexOf("${router.path}")>=0){
  		outUrl=outUrl.replace("${router.path}",to.path);
		}
  	if(outUrl.indexOf("${curlDomain}")>=0){
		var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
  		outUrl=outUrl.replace("${curlDomain}",curlDomain);
		}
		var indexOfHttp=outUrl.indexOf("://");
  	if(indexOfHttp>0){
  		outUrl=outUrl.substr(0,indexOfHttp+3)+outUrl.substr(indexOfHttp+3,outUrl.length).replace("//","/");
  	}else{
			outUrl=outUrl.replace("//","/")
		}
	window.open(outUrl,to.meta.title,null,true)
	NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
	return;
  }
   if(to!=null && to.fullPath!=null){
	var accessToken=getQueryVariable("accessToken",to.fullPath);
	if(accessToken!=null){
		setToken(accessToken);
	}
   }
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
		next()//
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
    	if(store.getters.isLoadOk==false ){
    		store.dispatch('GetUserInfo').then(res=>{
    			if(!res.data.tips.isOk){
    				 store.dispatch('FedLogOut').then(() => {
			              Message.error('请重新登陆')
			              next({ path: '/login' })
			            })
    			}else{
    				store.dispatch('GenerateRoutes', {roles:store.getters.roles ,menus:store.getters.myMenus} ).then(() => { // 根据roles权限生成可访问的路由表
			              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
			              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
			          }).catch(() => {
			            store.dispatch('FedLogOut').then(() => {
			              Message.error('路由处理出错，请重新登陆')
			              next({ path: '/login' })
			            })
			          })
    			}

    		});
    	}else if (store.getters.added==false ) { // 判断当前用户是否已拉取完user_info信息并且已经计算完毕动态路由
	        store.dispatch('GenerateRoutes', {roles:store.getters.roles ,menus:store.getters.myMenus} ).then(() => { // 根据roles权限生成可访问的路由表
	           router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
	           next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
	        }).catch(() => {
	          store.dispatch('FedLogOut').then(() => {
	            Message.error('路由处理出错，请重新登陆')
	            next({ path: '/login' })
	          })
	        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

function getQueryVariable(variable,url){
	var query =url;
	if(url==null || url==undefined || url==''){
		query=window.location.href;

	}
	//alert(query);
	var query2=query.split("?");
	if(query2.length>1){
		query=query2[1];
	}else{
		query=""
		return null;
	}

       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return null;
}


function setIndexPath() {  
	var indexPath=null
	var url=window.location.href;
	if(url.indexOf("/login")<0){
		var indexOf=url.indexOf("/#")
		if(indexOf > 0){
		indexPath=url.substring(indexOf+2)
		sessionStorage.setItem("index-path",indexPath);
		}else{
		sessionStorage.setItem("index-path",null);
		}
	} 
}
setIndexPath();
var accessToken=getQueryVariable('accessToken');
if(accessToken!=null){
	//alert(access_token);
	setToken(accessToken);
}
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
