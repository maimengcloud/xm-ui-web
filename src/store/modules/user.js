import { loginByUsername, loginByPhoneno, logout, getUserInfo, switchDept } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    userInfo: {
      userid:'',
      jsessionid:'',
      displayUserid:'',
      username:'',
      nickname:'',
      branchId:'',
      deptid:'',
      branchName:'',
      deptName:'',
      locationId:'',
      locationName:'',
      shopId:'',
      shopName:'',
      isSuperAdmin:false,
      isPlatformAdmin:false,
      isBranchAdmin:false,
      isShopAdmin:false,
      isLocationAdmin:false
    },
	workShop:{},
    status: '',
    code: '',
    token: getToken(),
    roles: [],
    qxs:[],
    myDepts: [],
    myShops: [],
    myLocations: [],
    myBranchs:[],
    myMenus:[],
    myPosts:[],
    setting: {
      articlePlatform: []
    },
    isLoadOk:false//是否加载完毕userInfo及其它数据
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token);
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
	SET_WORK_SHOP:(state,workShop)=>{
	  state.workShop = workShop
	},
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_QXS: (state, qxs) => {
        state.qxs = qxs
    },
    SET_MYDEPTS: (state, depts) => {
        state.myDepts = depts
    },
    SET_MYSHOPS: (state, shops) => {
        state.myShops = shops
    },
    SET_MYLOCATIONS: (state, locations) => {
        state.myLocations = locations
    },
    SET_MYBRANCHS: (state, branchs) => {
        state.myBranchs = branchs
    },
    SET_BRANCHID: (state, branchId) => {
        state.userInfo.branchId = branchId
    },
    SET_DEPTID: (state, deptid) => {
        state.userInfo.deptid = deptid
    },
    SET_MYMENUS: (state, menus) => {
        state.myMenus = menus
    },
    SET_MYPOSTS: (state, posts) => {
        state.myPosts = posts
    },
    SET_IS_LOAD_OK: (state, isLoadOk ) => {
        state.isLoadOk = isLoadOk
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password,userInfo.deptid).then(res => {
        	if(res.data.tips.isOk==true){
        		let data = res.data
                let userInfo=data.userInfo;
                let roles=data.roles;
                if(roles!=null && roles.length>0){
              	  roles.forEach(role=>{
              		  if(role.roleid=='superAdmin'){
              			  userInfo.isSuperAdmin=true
              		  }
              		  if(role.roleid=='platformAdmin'){
              			  userInfo.isPlatformAdmin=true
              		  }
              		  if(role.roleid=='branchAdmin'){
              			  userInfo.isBranchAdmin=true
              		  }
              		  if(role.roleid=='shopAdmin'){
              			  userInfo.isShopAdmin=true
              		  }
              		  if(role.roleid=='locationAdmin'){
              			  userInfo.isLocationAdmin=true
              		  }
              	  });
                }
                commit('SET_USER_INFO', userInfo)
                commit('SET_ROLES', roles)
                commit('SET_QXS', data.qxs)
                commit('SET_TOKEN', data.data.accessToken.tokenValue)
                setToken( data.data.accessToken.tokenValue)
        	} 
            resolve(res) 
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 用户名登录
    LoginByPhoneno({ commit }, userInfo) { 
      return new Promise((resolve, reject) => {
        loginByPhoneno(userInfo.phoneno, userInfo.smsCode, userInfo.isAdmin,userInfo.deptid).then(res => {
        	if(res.data.tips.isOk==true){
        		let data = res.data
                let userInfo=data.userInfo;
                let roles=data.roles;
                if(roles!=null && roles.length>0){
              	  roles.forEach(role=>{
              		  if(role.roleid=='superAdmin'){
              			  userInfo.isSuperAdmin=true
              		  }
              		  if(role.roleid=='platformAdmin'){
              			  userInfo.isPlatformAdmin=true
              		  }
              		  if(role.roleid=='branchAdmin'){
              			  userInfo.isBranchAdmin=true
              		  }
              		  if(role.roleid=='shopAdmin'){
              			  userInfo.isShopAdmin=true
              		  }
              		  if(role.roleid=='locationAdmin'){
              			  userInfo.isLocationAdmin=true
              		  }
              	  });
                }
                commit('SET_USER_INFO', userInfo)
                commit('SET_ROLES', roles)
                commit('SET_QXS', data.qxs)
                commit('SET_TOKEN', data.data.accessToken.tokenValue)
                setToken( data.data.accessToken.tokenValue)
        	} 
            resolve(res) 
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
    	  getUserInfo({userid:state.userInfo.userid}).then(res=>{
			  if(res.data.tips.isOk==true){ 
	    		  let userInfo = res.data.userInfo;
	    		  let roles = res.data.roles; 
				  let qxs=res.data.qxs;
				  
	              if(roles!=null && roles.length>0){
	            	  roles.forEach(role=>{
	            		  if(role.roleid=='superAdmin'){
	            			  userInfo.isSuperAdmin=true
	            		  }
	            		  if(role.roleid=='platformAdmin'){
	            			  userInfo.isPlatformAdmin=true
	            		  }
	            		  if(role.roleid=='branchAdmin'){
	            			  userInfo.isBranchAdmin=true
	            		  }
	            		  if(role.roleid=='shopAdmin'){
	            			  userInfo.isShopAdmin=true
	            		  }
	            		  if(role.roleid=='locationAdmin'){
	            			  userInfo.isLocationAdmin=true
	            		  }
	            	  });
	              } 
				 
				  
				  let branchs=res.data.branchs==null?[]:res.data.branchs;
				  let depts=res.data.depts==null?[]:res.data.depts;
				  let shops=res.data.shops==null?[]:res.data.shops;
				  let locations=res.data.locations==null?[]:res.data.locations
				  locations.forEach(l=>{
					  shops.forEach(s=>{
						  if(s.shopId==l.shopId){
							  l.shopName=s.shopName 
						  }
					  })
					  depts.forEach(d=>{
						  if(d.deptid==l.deptid){
							  l.deptName=d.deptName
							  l.branchName=d.branchName 
						  } 
					  })
				  })
				  let posts=res.data.posts==null?[]:res.data.posts;
				  posts.forEach(post=>{
					  depts.forEach(dept=>{
						  if(dept.deptid==post.deptid){
							  post.deptName=dept.deptName
							  post.branchId=dept.branchId
							  post.branchName=dept.branchName
						  }
					  })
				  })
				  depts.forEach(d=>{
            var branch=branchs.find(b=>b.branchId==d.branchId)
            if(branch){
              d.branchName=branch.branchName
            }
          })
				  commit('SET_MYBRANCHS',branchs);
				  commit('SET_MYDEPTS',depts);
				  commit('SET_MYLOCATIONS',locations); 
				  commit('SET_MYMENUS',res.data.menus); 
				  commit('SET_MYPOSTS', posts);
				  commit('SET_USER_INFO',userInfo);
				  commit('SET_ROLES', roles) 
		          commit('SET_QXS', qxs)
		          //commit('SET_TOKEN', res.data.access_token);
				  commit('SET_WORK_SHOP',userInfo);
		          commit('SET_IS_LOAD_OK', true)
			  }
    		  resolve(res); 
    	  }).catch(error => {
              reject(error)
          }); 
    	  /**
        getUserInfo(state.access_token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          commit('SET_USER_INFO', data.userInfo)
          commit('SET_ROLES', data.roles)
          commit('SET_TOKEN', data.userInfo.jsessionid)
          setToken(data.userInfo.jsessionid)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
        */
      })
    },
    // 获取用户信息
    SwitchDept({ commit,state } ,dept) {
      return new Promise((resolve, reject) => { 
    	  let userInfo=state.userInfo; 
    	  let params={deptName:dept.deptName,deptid:dept.deptid,branchId:dept.branchId,branchName:dept.branchName,userid:userInfo.userid}
    	  switchDept(params).then(res=>{
			  if(res.data.tips.isOk==true){ 
	    		  let userInfo = res.data.userInfo;
	    		  let roles = res.data.roles; 
				  let qxs=res.data.qxs;
				  
	              if(roles!=null && roles.length>0){
	            	  roles.forEach(role=>{
	            		  if(role.roleid=='superAdmin'){
	            			  userInfo.isSuperAdmin=true
	            		  }
	            		  if(role.roleid=='platformAdmin'){
	            			  userInfo.isPlatformAdmin=true
	            		  }
	            		  if(role.roleid=='branchAdmin'){
	            			  userInfo.isBranchAdmin=true
	            		  }
	            		  if(role.roleid=='shopAdmin'){
	            			  userInfo.isShopAdmin=true
	            		  }
	            		  if(role.roleid=='locationAdmin'){
	            			  userInfo.isLocationAdmin=true
	            		  }
	            	  });
	              } 
				 
				  
				  let branchs=res.data.branchs==null?[]:res.data.branchs;
				  let depts=res.data.depts==null?[]:res.data.depts;
				  let shops=res.data.shops==null?[]:res.data.shops;
				  let locations=res.data.locations==null?[]:res.data.locations
				  locations.forEach(l=>{
					  shops.forEach(s=>{
						  if(s.shopId==l.shopId){
							  l.shopName=s.shopName 
						  }
					  })
					  depts.forEach(d=>{
						  if(d.deptid==l.deptid){
							  l.deptName=d.deptName
							  l.branchName=d.branchName 
						  } 
					  })
				  })
				  let posts=res.data.posts==null?[]:res.data.posts;
				  posts.forEach(post=>{
					  depts.forEach(dept=>{
						  if(dept.deptid==post.deptid){
							  post.deptName=dept.deptName
							  post.branchId=dept.branchId
							  post.branchName=dept.branchName
						  }
					  })
				  })
				  
				  commit('SET_MYBRANCHS',branchs);
				  commit('SET_MYDEPTS',depts);
				  commit('SET_MYLOCATIONS',locations); 
				  commit('SET_MYMENUS',res.data.menus); 
				  commit('SET_MYPOSTS', posts);
				  commit('SET_USER_INFO',userInfo);
				  commit('SET_ROLES', roles) 
		          commit('SET_QXS', qxs)
              commit('SET_TOKEN', res.data.access_token)
              commit('SET_WORK_SHOP',JSON.parse(JSON.stringify(userInfo)));
		          commit('SET_IS_LOAD_OK', true)
			  }
    		  resolve(res); 
    	  }).catch((res)=>{
    		  reject(res); 
    	  }); 
      });  
    },
    
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.access_token)
    //       setToken(response.data.access_token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
    	    commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_MYDEPTS', [])
          commit('SET_MYLOCATIONS', [])
          commit('SET_MYBRANCHS', [])
          commit('SET_MYSHOPS', [])
          commit('SET_MYPOSTS', [])
          commit('SET_USER_INFO', {})
           removeToken()
           resolve()
        logout(state.token)
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
         
        getUserInfo(role).then(response => {
            const data = response.data
            commit('SET_USER_INFO', data.userInfo)
            commit('SET_ROLES', data.roles)
            commit('SET_TOKEN', data.access_token)
            setToken(data.userInfo.jsessionid)
          resolve()
        })
      })
    }
  }
}

export default user