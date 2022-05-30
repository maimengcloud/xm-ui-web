import { Dists } from './dist';
let _Dists = Dists;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import DistMock from './mdp/pub/distMock';
 * DistMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/pub/dist/listKey').reply(config => {
      let params = config.params;
      let mockDists = _Dists.filter(dist => {
      	if(params.distId||params.distId==''){ if( dist.distId.indexOf(params.distId)>=0) return true;}
      	if(params.distName||params.distName==''){ if( dist.distName.indexOf(params.distName)>=0) return true;}
      	if(params.enabled||params.enabled==''){ if( dist.enabled.indexOf(params.enabled)>=0) return true;}
      	if(params.branchId||params.branchId==''){ if( dist.branchId.indexOf(params.branchId)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockDists
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/pub/dist/list').reply(config => {
      let params = config.params;
      let mockDists = _Dists.filter(dist => {
      	var isTrue=false;
      	if(params.distId||params.distId==''){if(dist.distId.indexOf(params.distId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.distName||params.distName==''){if(dist.distName.indexOf(params.distName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.enabled||params.enabled==''){if(dist.enabled.indexOf(params.enabled)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.branchId||params.branchId==''){if(dist.branchId.indexOf(params.branchId)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockDists
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockDists.length;
      mockDists = mockDists.filter((dist, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockDists,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/pub/dist/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  distId  } = params;
      _Dists = _Dists.filter(dist => dist.distId !== distId);
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
    mock.onPost('/mdp/pub/dist/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Dists = _Dists.filter(dist => !params.includes(dist.distId));
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
    mock.onPost('/mdp/pub/dist/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { distId,distName,enabled,branchId } = params;
      _Dists.some(dist => {
        if (dist.distId === distId) {
			dist.distId = distId;
			dist.distName = distName;
			dist.enabled = enabled;
			dist.branchId = branchId
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
    mock.onPost('/mdp/pub/dist/add').reply(config => {
      var params = JSON.parse( config.data );
      let { distId,distName,enabled,branchId } = params;
      _Dists.push({
		distId:distId,
		distName:distName,
		enabled:enabled,
		branchId:branchId
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