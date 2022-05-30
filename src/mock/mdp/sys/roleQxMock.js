import { RoleQxs } from './roleQx';
let _RoleQxs = RoleQxs;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import RoleQxMock from './mdp/sys/roleQxMock';
 * RoleQxMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/roleQx/listKey').reply(config => {
      let params = config.params;
      let mockRoleQxs = _RoleQxs.filter(roleQx => {
      	if(params.qxId||params.qxId==''){ if( roleQx.qxId.indexOf(params.qxId)>=0) return true;}
      	if(params.id||params.id==''){ if( roleQx.id.indexOf(params.id)>=0) return true;}
      	if(params.remark||params.remark==''){ if( roleQx.remark.indexOf(params.remark)>=0) return true;}
      	if(params.roleid||params.roleid==''){ if( roleQx.roleid.indexOf(params.roleid)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockRoleQxs
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/roleQx/list').reply(config => {
      let params = config.params;
      let mockRoleQxs = _RoleQxs.filter(roleQx => {
      	var isTrue=false;
      	if(params.qxId||params.qxId==''){if(roleQx.qxId.indexOf(params.qxId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.id||params.id==''){if(roleQx.id.indexOf(params.id)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.remark||params.remark==''){if(roleQx.remark.indexOf(params.remark)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.roleid||params.roleid==''){if(roleQx.roleid.indexOf(params.roleid)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockRoleQxs
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockRoleQxs.length;
      mockRoleQxs = mockRoleQxs.filter((roleQx, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockRoleQxs,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/roleQx/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  id  } = params;
      _RoleQxs = _RoleQxs.filter(roleQx => roleQx.id !== id);
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
    mock.onPost('/mdp/sys/roleQx/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _RoleQxs = _RoleQxs.filter(roleQx => !params.includes(roleQx.id));
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
    mock.onPost('/mdp/sys/roleQx/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { qxId,id,remark,roleid } = params;
      _RoleQxs.some(roleQx => {
        if (roleQx.id === id) {
			roleQx.qxId = qxId;
			roleQx.id = id;
			roleQx.remark = remark;
			roleQx.roleid = roleid
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
    mock.onPost('/mdp/sys/roleQx/add').reply(config => {
      var params = JSON.parse( config.data );
      let { qxId,id,remark,roleid } = params;
      _RoleQxs.push({
		qxId:qxId,
		id:id,
		remark:remark,
		roleid:roleid
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