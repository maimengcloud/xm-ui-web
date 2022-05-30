import { UserRoles } from './userRole';
let _UserRoles = UserRoles;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import UserRoleMock from './mdp/sys/userRoleMock';
 * UserRoleMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/userRole/listKey').reply(config => {
      let params = config.params;
      let mockUserRoles = _UserRoles.filter(userRole => {
      	if(params.id||params.id==''){ if( userRole.id.indexOf(params.id)>=0) return true;}
      	if(params.roleid||params.roleid==''){ if( userRole.roleid.indexOf(params.roleid)>=0) return true;}
      	if(params.userid||params.userid==''){ if( userRole.userid.indexOf(params.userid)>=0) return true;}
      	if(params.remark||params.remark==''){ if( userRole.remark.indexOf(params.remark)>=0) return true;}
      	if(params.userroleBeg||params.userroleBeg==''){ if( userRole.userroleBeg.indexOf(params.userroleBeg)>=0) return true;}
      	if(params.userroleEnd||params.userroleEnd==''){ if( userRole.userroleEnd.indexOf(params.userroleEnd)>=0) return true;}
      	if(params.createPerson||params.createPerson==''){ if( userRole.createPerson.indexOf(params.createPerson)>=0) return true;}
      	if(params.createDate||params.createDate==''){ if( userRole.createDate.indexOf(params.createDate)>=0) return true;}
      	if(params.loperatePerson||params.loperatePerson==''){ if( userRole.loperatePerson.indexOf(params.loperatePerson)>=0) return true;}
      	if(params.loperateDate||params.loperateDate==''){ if( userRole.loperateDate.indexOf(params.loperateDate)>=0) return true;}
      	if(params.roleSort||params.roleSort==''){ if( userRole.roleSort.indexOf(params.roleSort)>=0) return true;}
      	if(params.enabled||params.enabled==''){ if( userRole.enabled.indexOf(params.enabled)>=0) return true;}
      	if(params.deptid||params.deptid==''){ if( userRole.deptid.indexOf(params.deptid)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockUserRoles
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/userRole/list').reply(config => {
      let params = config.params;
      let mockUserRoles = _UserRoles.filter(userRole => {
      	var isTrue=false;
      	if(params.id||params.id==''){if(userRole.id.indexOf(params.id)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.roleid||params.roleid==''){if(userRole.roleid.indexOf(params.roleid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.userid||params.userid==''){if(userRole.userid.indexOf(params.userid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.remark||params.remark==''){if(userRole.remark.indexOf(params.remark)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.userroleBeg||params.userroleBeg==''){if(userRole.userroleBeg.indexOf(params.userroleBeg)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.userroleEnd||params.userroleEnd==''){if(userRole.userroleEnd.indexOf(params.userroleEnd)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.createPerson||params.createPerson==''){if(userRole.createPerson.indexOf(params.createPerson)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.createDate||params.createDate==''){if(userRole.createDate.indexOf(params.createDate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.loperatePerson||params.loperatePerson==''){if(userRole.loperatePerson.indexOf(params.loperatePerson)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.loperateDate||params.loperateDate==''){if(userRole.loperateDate.indexOf(params.loperateDate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.roleSort||params.roleSort==''){if(userRole.roleSort.indexOf(params.roleSort)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.enabled||params.enabled==''){if(userRole.enabled.indexOf(params.enabled)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.deptid||params.deptid==''){if(userRole.deptid.indexOf(params.deptid)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockUserRoles
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockUserRoles.length;
      mockUserRoles = mockUserRoles.filter((userRole, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockUserRoles,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/userRole/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  id  } = params;
      _UserRoles = _UserRoles.filter(userRole => userRole.id !== id);
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
    mock.onPost('/mdp/sys/userRole/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _UserRoles = _UserRoles.filter(userRole => !params.includes(userRole.id));
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
    mock.onPost('/mdp/sys/userRole/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { id,roleid,userid,remark,userroleBeg,userroleEnd,createPerson,createDate,loperatePerson,loperateDate,roleSort,enabled,deptid } = params;
      _UserRoles.some(userRole => {
        if (userRole.id === id) {
			userRole.id = id;
			userRole.roleid = roleid;
			userRole.userid = userid;
			userRole.remark = remark;
			userRole.userroleBeg = userroleBeg;
			userRole.userroleEnd = userroleEnd;
			userRole.createPerson = createPerson;
			userRole.createDate = createDate;
			userRole.loperatePerson = loperatePerson;
			userRole.loperateDate = loperateDate;
			userRole.roleSort = roleSort;
			userRole.enabled = enabled;
			userRole.deptid = deptid
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
    mock.onPost('/mdp/sys/userRole/add').reply(config => {
      var params = JSON.parse( config.data );
      let { id,roleid,userid,remark,userroleBeg,userroleEnd,createPerson,createDate,loperatePerson,loperateDate,roleSort,enabled,deptid } = params;
      _UserRoles.push({
		id:id,
		roleid:roleid,
		userid:userid,
		remark:remark,
		userroleBeg:userroleBeg,
		userroleEnd:userroleEnd,
		createPerson:createPerson,
		createDate:createDate,
		loperatePerson:loperatePerson,
		loperateDate:loperateDate,
		roleSort:roleSort,
		enabled:enabled,
		deptid:deptid
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