import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'
var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
var baseApiUrl="";
if(process.env.BASE_API ){
  if(process.env.BASE_API.indexOf("http")<0 && process.env.BASE_API.indexOf("wwww.")<0){
    baseApiUrl=curlDomain+"/"+process.env.BASE_API+"/"+process.env.VERSION;
  }else{
    baseApiUrl=process.env.BASE_API+"/"+process.env.VERSION;
  }
  
}else{
  baseApiUrl=curlDomain+"/api/"+process.env.VERSION
} 
var indexOfHttp=baseApiUrl.indexOf("://");
if(indexOfHttp>0){
  baseApiUrl=baseApiUrl.substr(0,indexOfHttp+3)+baseApiUrl.substr(indexOfHttp+3,baseApiUrl.length).replace("//","/");
}else{
  baseApiUrl=baseApiUrl.replace("//","/")
}
// create an axios instance
const service = axios.create({
  baseURL:baseApiUrl, // api的base_url
  timeout: 25000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent 
    var token=getToken();
    if(token==null ||token=='' ||token=="" || token ==undefined ){
      return config;
    }else{
      config.headers['Authorization'] = 'Bearer '+token // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    }
    
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(                                       
  response => {
	if(response.data && response.data.tips && response.data.tips.msg == 'Full authentication is required to access this resource'){ 
    Message.closeAll()
		 Message.error('会话过期，请重新登陆')
		 //response.data.tips.msg="会话过期，请重新登陆";
		 store.dispatch('FedLogOut').then(() => { 
            router.replace({path: '/login'})
         })
	}
	return response
  }, 
  error => {
    console.log(error)// for debug
    if(error.response){
    	switch (error.response.status) {
	        case 401:
	            // 返回 401 清除token信息并跳转到登录页面
              Message.closeAll()
	        	 Message.error('会话过期，请重新登陆')
				     store.dispatch('FedLogOut').then(() => { 
		            router.replace({path: '/login'})
		         })
             return;
	    }
    }
    Message.closeAll() 
    return Promise.reject(error)
  })

export default service
