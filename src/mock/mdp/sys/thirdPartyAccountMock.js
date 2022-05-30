import { ThirdPartyAccounts } from './thirdPartyAccount';
let _ThirdPartyAccounts = ThirdPartyAccounts;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import ThirdPartyAccountMock from './mdp/sys/thirdPartyAccountMock';
 * ThirdPartyAccountMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/thirdPartyAccount/listKey').reply(config => {
      let params = config.params;
      let mockThirdPartyAccounts = _ThirdPartyAccounts.filter(thirdPartyAccount => {
      	if(params.unionid||params.unionid==''){ if( thirdPartyAccount.unionid.indexOf(params.unionid)>=0) return true;}
      	if(params.openid||params.openid==''){ if( thirdPartyAccount.openid.indexOf(params.openid)>=0) return true;}
      	if(params.userid||params.userid==''){ if( thirdPartyAccount.userid.indexOf(params.userid)>=0) return true;}
      	if(params.locked||params.locked==''){ if( thirdPartyAccount.locked.indexOf(params.locked)>=0) return true;}
      	if(params.startdate||params.startdate==''){ if( thirdPartyAccount.startdate.indexOf(params.startdate)>=0) return true;}
      	if(params.nickname||params.nickname==''){ if( thirdPartyAccount.nickname.indexOf(params.nickname)>=0) return true;}
      	if(params.username||params.username==''){ if( thirdPartyAccount.username.indexOf(params.username)>=0) return true;}
      	if(params.phoneno||params.phoneno==''){ if( thirdPartyAccount.phoneno.indexOf(params.phoneno)>=0) return true;}
      	if(params.country||params.country==''){ if( thirdPartyAccount.country.indexOf(params.country)>=0) return true;}
      	if(params.city||params.city==''){ if( thirdPartyAccount.city.indexOf(params.city)>=0) return true;}
      	if(params.headimgurl||params.headimgurl==''){ if( thirdPartyAccount.headimgurl.indexOf(params.headimgurl)>=0) return true;}
      	if(params.province||params.province==''){ if( thirdPartyAccount.province.indexOf(params.province)>=0) return true;}
      	if(params.userunionid||params.userunionid==''){ if( thirdPartyAccount.userunionid.indexOf(params.userunionid)>=0) return true;}
      	if(params.frontApp||params.frontApp==''){ if( thirdPartyAccount.frontApp.indexOf(params.frontApp)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockThirdPartyAccounts
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/thirdPartyAccount/list').reply(config => {
      let params = config.params;
      let mockThirdPartyAccounts = _ThirdPartyAccounts.filter(thirdPartyAccount => {
      	var isTrue=false;
      	if(params.unionid||params.unionid==''){if(thirdPartyAccount.unionid.indexOf(params.unionid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.openid||params.openid==''){if(thirdPartyAccount.openid.indexOf(params.openid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.userid||params.userid==''){if(thirdPartyAccount.userid.indexOf(params.userid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.locked||params.locked==''){if(thirdPartyAccount.locked.indexOf(params.locked)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.startdate||params.startdate==''){if(thirdPartyAccount.startdate.indexOf(params.startdate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.nickname||params.nickname==''){if(thirdPartyAccount.nickname.indexOf(params.nickname)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.username||params.username==''){if(thirdPartyAccount.username.indexOf(params.username)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.phoneno||params.phoneno==''){if(thirdPartyAccount.phoneno.indexOf(params.phoneno)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.country||params.country==''){if(thirdPartyAccount.country.indexOf(params.country)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.city||params.city==''){if(thirdPartyAccount.city.indexOf(params.city)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.headimgurl||params.headimgurl==''){if(thirdPartyAccount.headimgurl.indexOf(params.headimgurl)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.province||params.province==''){if(thirdPartyAccount.province.indexOf(params.province)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.userunionid||params.userunionid==''){if(thirdPartyAccount.userunionid.indexOf(params.userunionid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.frontApp||params.frontApp==''){if(thirdPartyAccount.frontApp.indexOf(params.frontApp)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockThirdPartyAccounts
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockThirdPartyAccounts.length;
      mockThirdPartyAccounts = mockThirdPartyAccounts.filter((thirdPartyAccount, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockThirdPartyAccounts,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/thirdPartyAccount/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  openid  } = params;
      _ThirdPartyAccounts = _ThirdPartyAccounts.filter(thirdPartyAccount => thirdPartyAccount.openid !== openid);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            tips:{
            	isOk:true,
            	msg:'删除成功'
            }
          }]);
        }, 500);
      });
    });

    //批量删除
    mock.onPost('/mdp/sys/thirdPartyAccount/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _ThirdPartyAccounts = _ThirdPartyAccounts.filter(thirdPartyAccount => !params.includes(thirdPartyAccount.openid));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
           tips:{
            	isOk:true,
            	msg:'删除成功'
            }
          }]);
        }, 500);
      });
    });

    //编辑
    mock.onPost('/mdp/sys/thirdPartyAccount/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { unionid,openid,userid,locked,startdate,nickname,username,phoneno,country,city,headimgurl,province,userunionid,frontApp } = params;
      _ThirdPartyAccounts.some(thirdPartyAccount => {
        if (thirdPartyAccount.openid === openid) {
			thirdPartyAccount.unionid = unionid;
			thirdPartyAccount.openid = openid;
			thirdPartyAccount.userid = userid;
			thirdPartyAccount.locked = locked;
			thirdPartyAccount.startdate = startdate;
			thirdPartyAccount.nickname = nickname;
			thirdPartyAccount.username = username;
			thirdPartyAccount.phoneno = phoneno;
			thirdPartyAccount.country = country;
			thirdPartyAccount.city = city;
			thirdPartyAccount.headimgurl = headimgurl;
			thirdPartyAccount.province = province;
			thirdPartyAccount.userunionid = userunionid;
			thirdPartyAccount.frontApp = frontApp
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            tips:{
            	isOk:true,
            	msg:'编辑成功'
            }
          }]);
        }, 500);
      });
    });

    //新增
    mock.onPost('/mdp/sys/thirdPartyAccount/add').reply(config => {
      var params = JSON.parse( config.data );
      let { unionid,openid,userid,locked,startdate,nickname,username,phoneno,country,city,headimgurl,province,userunionid,frontApp } = params;
      _ThirdPartyAccounts.push({
		unionid:unionid,
		openid:openid,
		userid:userid,
		locked:locked,
		startdate:startdate,
		nickname:nickname,
		username:username,
		phoneno:phoneno,
		country:country,
		city:city,
		headimgurl:headimgurl,
		province:province,
		userunionid:userunionid,
		frontApp:frontApp
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            tips:{
            	isOk:true,
            	msg:'新增成功'
            }
          }]);
        }, 500);
      });
    });

  }
};