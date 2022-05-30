import { UserExtinfos } from './userExtinfo';
let _UserExtinfos = UserExtinfos;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import UserExtinfoMock from './mdp/sys/userExtinfoMock';
 * UserExtinfoMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/userExtinfo/listKey').reply(config => {
      let params = config.params;
      let mockUserExtinfos = _UserExtinfos.filter(userExtinfo => {
      	if(params.lastLoginTime||params.lastLoginTime==''){ if( userExtinfo.lastLoginTime.indexOf(params.lastLoginTime)>=0) return true;}
      	if(params.pwdErrorCount||params.pwdErrorCount==''){ if( userExtinfo.pwdErrorCount.indexOf(params.pwdErrorCount)>=0) return true;}
      	if(params.userid||params.userid==''){ if( userExtinfo.userid.indexOf(params.userid)>=0) return true;}
      	if(params.firstLoginChannel||params.firstLoginChannel==''){ if( userExtinfo.firstLoginChannel.indexOf(params.firstLoginChannel)>=0) return true;}
      	if(params.lastLoginChannel||params.lastLoginChannel==''){ if( userExtinfo.lastLoginChannel.indexOf(params.lastLoginChannel)>=0) return true;}
      	if(params.lastLoginArea||params.lastLoginArea==''){ if( userExtinfo.lastLoginArea.indexOf(params.lastLoginArea)>=0) return true;}
      	if(params.visitMsg||params.visitMsg==''){ if( userExtinfo.visitMsg.indexOf(params.visitMsg)>=0) return true;}
      	if(params.tpaOpenid||params.tpaOpenid==''){ if( userExtinfo.tpaOpenid.indexOf(params.tpaOpenid)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockUserExtinfos
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/userExtinfo/list').reply(config => {
      let params = config.params;
      let mockUserExtinfos = _UserExtinfos.filter(userExtinfo => {
      	var isTrue=false;
      	if(params.lastLoginTime||params.lastLoginTime==''){if(userExtinfo.lastLoginTime.indexOf(params.lastLoginTime)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.pwdErrorCount||params.pwdErrorCount==''){if(userExtinfo.pwdErrorCount.indexOf(params.pwdErrorCount)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.userid||params.userid==''){if(userExtinfo.userid.indexOf(params.userid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.firstLoginChannel||params.firstLoginChannel==''){if(userExtinfo.firstLoginChannel.indexOf(params.firstLoginChannel)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.lastLoginChannel||params.lastLoginChannel==''){if(userExtinfo.lastLoginChannel.indexOf(params.lastLoginChannel)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.lastLoginArea||params.lastLoginArea==''){if(userExtinfo.lastLoginArea.indexOf(params.lastLoginArea)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.visitMsg||params.visitMsg==''){if(userExtinfo.visitMsg.indexOf(params.visitMsg)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.tpaOpenid||params.tpaOpenid==''){if(userExtinfo.tpaOpenid.indexOf(params.tpaOpenid)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockUserExtinfos
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockUserExtinfos.length;
      mockUserExtinfos = mockUserExtinfos.filter((userExtinfo, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockUserExtinfos,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/userExtinfo/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  userid  } = params;
      _UserExtinfos = _UserExtinfos.filter(userExtinfo => userExtinfo.userid !== userid);
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
    mock.onPost('/mdp/sys/userExtinfo/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _UserExtinfos = _UserExtinfos.filter(userExtinfo => !params.includes(userExtinfo.userid));
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
    mock.onPost('/mdp/sys/userExtinfo/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { lastLoginTime,pwdErrorCount,userid,firstLoginChannel,lastLoginChannel,lastLoginArea,visitMsg,tpaOpenid } = params;
      _UserExtinfos.some(userExtinfo => {
        if (userExtinfo.userid === userid) {
			userExtinfo.lastLoginTime = lastLoginTime;
			userExtinfo.pwdErrorCount = pwdErrorCount;
			userExtinfo.userid = userid;
			userExtinfo.firstLoginChannel = firstLoginChannel;
			userExtinfo.lastLoginChannel = lastLoginChannel;
			userExtinfo.lastLoginArea = lastLoginArea;
			userExtinfo.visitMsg = visitMsg;
			userExtinfo.tpaOpenid = tpaOpenid
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
    mock.onPost('/mdp/sys/userExtinfo/add').reply(config => {
      var params = JSON.parse( config.data );
      let { lastLoginTime,pwdErrorCount,userid,firstLoginChannel,lastLoginChannel,lastLoginArea,visitMsg,tpaOpenid } = params;
      _UserExtinfos.push({
		lastLoginTime:lastLoginTime,
		pwdErrorCount:pwdErrorCount,
		userid:userid,
		firstLoginChannel:firstLoginChannel,
		lastLoginChannel:lastLoginChannel,
		lastLoginArea:lastLoginArea,
		visitMsg:visitMsg,
		tpaOpenid:tpaOpenid
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