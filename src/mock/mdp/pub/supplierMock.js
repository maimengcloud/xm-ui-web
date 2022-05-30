import { Suppliers } from './supplier';
let _Suppliers = Suppliers;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import SupplierMock from './mdp/pub/supplierMock';
 * SupplierMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/pub/supplier/listKey').reply(config => {
      let params = config.params;
      let mockSuppliers = _Suppliers.filter(supplier => {
      	if(params.supplierId||params.supplierId==''){ if( supplier.supplierId.indexOf(params.supplierId)>=0) return true;}
      	if(params.supplierName||params.supplierName==''){ if( supplier.supplierName.indexOf(params.supplierName)>=0) return true;}
      	if(params.enabled||params.enabled==''){ if( supplier.enabled.indexOf(params.enabled)>=0) return true;}
      	if(params.branchId||params.branchId==''){ if( supplier.branchId.indexOf(params.branchId)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockSuppliers
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/pub/supplier/list').reply(config => {
      let params = config.params;
      let mockSuppliers = _Suppliers.filter(supplier => {
      	var isTrue=false;
      	if(params.supplierId||params.supplierId==''){if(supplier.supplierId.indexOf(params.supplierId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.supplierName||params.supplierName==''){if(supplier.supplierName.indexOf(params.supplierName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.enabled||params.enabled==''){if(supplier.enabled.indexOf(params.enabled)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.branchId||params.branchId==''){if(supplier.branchId.indexOf(params.branchId)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockSuppliers
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockSuppliers.length;
      mockSuppliers = mockSuppliers.filter((supplier, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockSuppliers,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/pub/supplier/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  supplierId  } = params;
      _Suppliers = _Suppliers.filter(supplier => supplier.supplierId !== supplierId);
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
    mock.onPost('/mdp/pub/supplier/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Suppliers = _Suppliers.filter(supplier => !params.includes(supplier.supplierId));
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
    mock.onPost('/mdp/pub/supplier/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { supplierId,supplierName,enabled,branchId } = params;
      _Suppliers.some(supplier => {
        if (supplier.supplierId === supplierId) {
			supplier.supplierId = supplierId;
			supplier.supplierName = supplierName;
			supplier.enabled = enabled;
			supplier.branchId = branchId
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
    mock.onPost('/mdp/pub/supplier/add').reply(config => {
      var params = JSON.parse( config.data );
      let { supplierId,supplierName,enabled,branchId } = params;
      _Suppliers.push({
		supplierId:supplierId,
		supplierName:supplierName,
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