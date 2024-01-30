import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken,setToken,removeToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (!permissionRoles) return true
  if (roles.some(role => role.roleid==='superAdmin')) return true // admin permission passed directly
  return roles.some(role => permissionRoles.indexOf(role.roleid) >= 0)
}

const whiteList = ['/login', '/authredirect','/changeEmailStepOne','/changeEmailStepTwo','/error']// no redirect whitelist
const scanCodeLoginPath='/invite/code/'

var curlDomain=window.location.protocol+"//"+window.location.host; //  
var baseUrl=`${curlDomain}/${process.env.CONTEXT}/${process.env.VERSION}/`

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  var outUrl="";
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
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
		removeToken();
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
        if ( !to.meta || !to.meta.roles || hasPermission(store.getters.roles, to.meta.roles)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else { 
    /* has no token*/ 
    if (whiteList.indexOf(to.path) !== -1 || to.path.startsWith(scanCodeLoginPath)) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
}) 

var queryParams;
function getQueryVariable(variable,url){
	if(!queryParams){
		queryParams={}
	}else{
		return queryParams[variable]
	}
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
			   queryParams[pair[0]]=pair[1] 
       }
       return queryParams[variable];
}


function setIndexPath() { 
	var indexPath=null
	var url=window.location.href;
	if(url.indexOf("/login")<=0){ 
		indexPath=url
		sessionStorage.setItem("index-path",url); 
	}else{
		var idxPath=sessionStorage.getItem("index-path");
		if(idxPath && idxPath!='null'){
			indexPath=idxPath
		}else{
			indexPath=url.substring(0,url.indexOf('/login'))
			sessionStorage.setItem("index-path",indexPath); 
		}
		
	}
	return indexPath
} 
var indexPath=setIndexPath();
indexPath=indexPath?indexPath:''
var accessToken=getQueryVariable('accessToken');
if(accessToken!=null){ 
	store.dispatch('LogOut').then(res=>{ 
		setToken(accessToken);
		getInfo();
	}) 
} 

var isOk=getQueryVariable('isOk');
if(indexPath.indexOf('/#/error')<0 && (isOk=="false" || isOk===false)  ){  
 	location.replace(getIndexPathUrl(`${baseUrl}#/error`,queryParams))
 }

function getInfo(){
	store.dispatch('GetUserInfo').then(res=>{ 
		if(!res.data.tips.isOk){
			 store.dispatch('LogOut').then(() => {
				  Message.error('请重新登陆') 
				  location.replace(`${baseUrl}#/login`)
				})
		}else{
			store.dispatch('GenerateRoutes', {roles:store.getters.roles ,menus:store.getters.myMenus} ).then(() => { // 根据roles权限生成可访问的路由表
				  router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
				  var inviteId=queryParams['inviteId']
				  if(inviteId && !inviteId.startsWith('login')){ 
					location.replace(getIndexPathUrl(`${baseUrl}#/invite/success`,queryParams))
				  }else{
					location.replace(getIndexPathUrl(indexPath,{}))
				  } 
			  }).catch(() => {
				store.dispatch('LogOut').then(() => {
				  Message.error('路由处理出错，请重新登陆') 
				  location.replace(`${baseUrl}#/login`)
				})
			  })
		}

	});
}

function getIndexPathUrl(indexPath,queryParams2){
	if(indexPath==null){
		indexPath=""
	}
	var queryParams=queryParams2?{...queryParams2}:{}
	delete queryParams.accessToken
	//router.push({path:'/invite/success',query:queryParams}) 
	var indexQua=indexPath.indexOf("?")
	var indexUri="";
	if(indexQua<0){
		indexUri=indexPath
	}else{
		indexUri=indexPath.substr(0,indexQua)
	}
	var indexPathUrl="";
	if(Object.keys(queryParams).length>0){
		indexPathUrl=indexUri+"?"+Object.keys(queryParams).map(k=>k+'='+queryParams[k]).join('&')
	}else{
		indexPathUrl=indexUri;
	} 
	return indexPathUrl
}
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
