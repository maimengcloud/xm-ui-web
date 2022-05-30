import { Roles } from './role';
let _Roles = Roles;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import RoleMock from './mdp/sys/roleMock';
 * RoleMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/role/listKey').reply(config => {
      let params = config.params;
      let mockRoles = _Roles.filter(role => {
      	if(params.roleid||params.roleid==''){ if( role.roleid.indexOf(params.roleid)>=0) return true;}
      	if(params.rolename||params.rolename==''){ if( role.rolename.indexOf(params.rolename)>=0) return true;}
      	if(params.remark||params.remark==''){ if( role.remark.indexOf(params.remark)>=0) return true;}
      	if(params.roletype||params.roletype==''){ if( role.roletype.indexOf(params.roletype)>=0) return true;}
      	if(params.rolebeg||params.rolebeg==''){ if( role.rolebeg.indexOf(params.rolebeg)>=0) return true;}
      	if(params.roleend||params.roleend==''){ if( role.roleend.indexOf(params.roleend)>=0) return true;}
      	if(params.crperson||params.crperson==''){ if( role.crperson.indexOf(params.crperson)>=0) return true;}
      	if(params.crdate||params.crdate==''){ if( role.crdate.indexOf(params.crdate)>=0) return true;}
      	if(params.lopperson||params.lopperson==''){ if( role.lopperson.indexOf(params.lopperson)>=0) return true;}
      	if(params.lopdate||params.lopdate==''){ if( role.lopdate.indexOf(params.lopdate)>=0) return true;}
      	if(params.enabled||params.enabled==''){ if( role.enabled.indexOf(params.enabled)>=0) return true;}
      	if(params.deptid||params.deptid==''){ if( role.deptid.indexOf(params.deptid)>=0) return true;}
      	if(params.sortOrder||params.sortOrder==''){ if( role.sortOrder.indexOf(params.sortOrder)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockRoles
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/role/list').reply(config => {
      let params = config.params;
      let mockRoles = _Roles.filter(role => {
      	var isTrue=false;
      	if(params.roleid||params.roleid==''){if(role.roleid.indexOf(params.roleid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.rolename||params.rolename==''){if(role.rolename.indexOf(params.rolename)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.remark||params.remark==''){if(role.remark.indexOf(params.remark)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.roletype||params.roletype==''){if(role.roletype.indexOf(params.roletype)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.rolebeg||params.rolebeg==''){if(role.rolebeg.indexOf(params.rolebeg)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.roleend||params.roleend==''){if(role.roleend.indexOf(params.roleend)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.crperson||params.crperson==''){if(role.crperson.indexOf(params.crperson)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.crdate||params.crdate==''){if(role.crdate.indexOf(params.crdate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.lopperson||params.lopperson==''){if(role.lopperson.indexOf(params.lopperson)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.lopdate||params.lopdate==''){if(role.lopdate.indexOf(params.lopdate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.enabled||params.enabled==''){if(role.enabled.indexOf(params.enabled)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.deptid||params.deptid==''){if(role.deptid.indexOf(params.deptid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.sortOrder||params.sortOrder==''){if(role.sortOrder.indexOf(params.sortOrder)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockRoles
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockRoles.length;
      mockRoles = mockRoles.filter((role, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockRoles,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/role/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  roleid  } = params;
      _Roles = _Roles.filter(role => role.roleid !== roleid);
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
    mock.onPost('/mdp/sys/role/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Roles = _Roles.filter(role => !params.includes(role.roleid));
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
    mock.onPost('/mdp/sys/role/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { roleid,rolename,remark,roletype,rolebeg,roleend,crperson,crdate,lopperson,lopdate,enabled,deptid,sortOrder } = params;
      _Roles.some(role => {
        if (role.roleid === roleid) {
			role.roleid = roleid;
			role.rolename = rolename;
			role.remark = remark;
			role.roletype = roletype;
			role.rolebeg = rolebeg;
			role.roleend = roleend;
			role.crperson = crperson;
			role.crdate = crdate;
			role.lopperson = lopperson;
			role.lopdate = lopdate;
			role.enabled = enabled;
			role.deptid = deptid;
			role.sortOrder = sortOrder
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
    mock.onPost('/mdp/sys/role/add').reply(config => {
      var params = JSON.parse( config.data );
      let { roleid,rolename,remark,roletype,rolebeg,roleend,crperson,crdate,lopperson,lopdate,enabled,deptid,sortOrder } = params;
      _Roles.push({
		roleid:roleid,
		rolename:rolename,
		remark:remark,
		roletype:roletype,
		rolebeg:rolebeg,
		roleend:roleend,
		crperson:crperson,
		crdate:crdate,
		lopperson:lopperson,
		lopdate:lopdate,
		enabled:enabled,
		deptid:deptid,
		sortOrder:sortOrder
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