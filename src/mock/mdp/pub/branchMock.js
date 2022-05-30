import { Branchs } from './branch';
let _Branchs = Branchs;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import BranchMock from './mdp/pub/branchMock';
 * BranchMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/pub/branch/listKey').reply(config => {
      let params = config.params;
      let mockBranchs = _Branchs.filter(branch => {
      	if(params.branchId||params.branchId==''){ if( branch.branchId.indexOf(params.branchId)>=0) return true;}
      	if(params.branchName||params.branchName==''){ if( branch.branchName.indexOf(params.branchName)>=0) return true;}
      	if(params.enabled||params.enabled==''){ if( branch.enabled.indexOf(params.enabled)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockBranchs
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/pub/branch/list').reply(config => {
      let params = config.params;
      let mockBranchs = _Branchs.filter(branch => {
      	var isTrue=false;
      	if(params.branchId||params.branchId==''){if(branch.branchId.indexOf(params.branchId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.branchName||params.branchName==''){if(branch.branchName.indexOf(params.branchName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.enabled||params.enabled==''){if(branch.enabled.indexOf(params.enabled)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockBranchs
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockBranchs.length;
      mockBranchs = mockBranchs.filter((branch, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockBranchs,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/pub/branch/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  branchId  } = params;
      _Branchs = _Branchs.filter(branch => branch.branchId !== branchId);
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
    mock.onPost('/mdp/pub/branch/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Branchs = _Branchs.filter(branch => !params.includes(branch.branchId));
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
    mock.onPost('/mdp/pub/branch/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { branchId,branchName,enabled } = params;
      _Branchs.some(branch => {
        if (branch.branchId === branchId) {
			branch.branchId = branchId;
			branch.branchName = branchName;
			branch.enabled = enabled
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
    mock.onPost('/mdp/pub/branch/add').reply(config => {
      var params = JSON.parse( config.data );
      let { branchId,branchName,enabled } = params;
      _Branchs.push({
		branchId:branchId,
		branchName:branchName,
		enabled:enabled
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