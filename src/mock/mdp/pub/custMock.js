import { Custs } from './cust';
let _Custs = Custs;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import CustMock from './mdp/pub/custMock';
 * CustMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/pub/cust/listKey').reply(config => {
      let params = config.params;
      let mockCusts = _Custs.filter(cust => {
      	if(params.custId||params.custId==''){ if( cust.custId.indexOf(params.custId)>=0) return true;}
      	if(params.custName||params.custName==''){ if( cust.custName.indexOf(params.custName)>=0) return true;}
      	if(params.enabled||params.enabled==''){ if( cust.enabled.indexOf(params.enabled)>=0) return true;}
      	if(params.branchId||params.branchId==''){ if( cust.branchId.indexOf(params.branchId)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockCusts
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/pub/cust/list').reply(config => {
      let params = config.params;
      let mockCusts = _Custs.filter(cust => {
      	var isTrue=false;
      	if(params.custId||params.custId==''){if(cust.custId.indexOf(params.custId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.custName||params.custName==''){if(cust.custName.indexOf(params.custName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.enabled||params.enabled==''){if(cust.enabled.indexOf(params.enabled)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.branchId||params.branchId==''){if(cust.branchId.indexOf(params.branchId)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockCusts
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockCusts.length;
      mockCusts = mockCusts.filter((cust, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockCusts,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/pub/cust/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  custId  } = params;
      _Custs = _Custs.filter(cust => cust.custId !== custId);
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
    mock.onPost('/mdp/pub/cust/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Custs = _Custs.filter(cust => !params.includes(cust.custId));
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
    mock.onPost('/mdp/pub/cust/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { custId,custName,enabled,branchId } = params;
      _Custs.some(cust => {
        if (cust.custId === custId) {
			cust.custId = custId;
			cust.custName = custName;
			cust.enabled = enabled;
			cust.branchId = branchId
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
    mock.onPost('/mdp/pub/cust/add').reply(config => {
      var params = JSON.parse( config.data );
      let { custId,custName,enabled,branchId } = params;
      _Custs.push({
		custId:custId,
		custName:custName,
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