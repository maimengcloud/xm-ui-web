import { DeptExtinfos } from './deptExtinfo';
let _DeptExtinfos = DeptExtinfos;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import DeptExtinfoMock from './mdp/sys/deptExtinfoMock';
 * DeptExtinfoMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/deptExtinfo/listKey').reply(config => {
      let params = config.params;
      let mockDeptExtinfos = _DeptExtinfos.filter(deptExtinfo => {
      	if(params.deptid||params.deptid==''){ if( deptExtinfo.deptid.indexOf(params.deptid)>=0) return true;}
      	if(params.extState||params.extState==''){ if( deptExtinfo.extState.indexOf(params.extState)>=0) return true;}
      	if(params.extFlowState||params.extFlowState==''){ if( deptExtinfo.extFlowState.indexOf(params.extFlowState)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockDeptExtinfos
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/deptExtinfo/list').reply(config => {
      let params = config.params;
      let mockDeptExtinfos = _DeptExtinfos.filter(deptExtinfo => {
      	var isTrue=false;
      	if(params.deptid||params.deptid==''){if(deptExtinfo.deptid.indexOf(params.deptid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.extState||params.extState==''){if(deptExtinfo.extState.indexOf(params.extState)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.extFlowState||params.extFlowState==''){if(deptExtinfo.extFlowState.indexOf(params.extFlowState)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockDeptExtinfos
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockDeptExtinfos.length;
      mockDeptExtinfos = mockDeptExtinfos.filter((deptExtinfo, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockDeptExtinfos,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/deptExtinfo/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  deptid  } = params;
      _DeptExtinfos = _DeptExtinfos.filter(deptExtinfo => deptExtinfo.deptid !== deptid);
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
    mock.onPost('/mdp/sys/deptExtinfo/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _DeptExtinfos = _DeptExtinfos.filter(deptExtinfo => !params.includes(deptExtinfo.deptid));
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
    mock.onPost('/mdp/sys/deptExtinfo/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { deptid,extState,extFlowState } = params;
      _DeptExtinfos.some(deptExtinfo => {
        if (deptExtinfo.deptid === deptid) {
			deptExtinfo.deptid = deptid;
			deptExtinfo.extState = extState;
			deptExtinfo.extFlowState = extFlowState
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
    mock.onPost('/mdp/sys/deptExtinfo/add').reply(config => {
      var params = JSON.parse( config.data );
      let { deptid,extState,extFlowState } = params;
      _DeptExtinfos.push({
		deptid:deptid,
		extState:extState,
		extFlowState:extFlowState
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