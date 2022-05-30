import { CompanyCategorys } from './companyCategory';
let _CompanyCategorys = CompanyCategorys;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import CompanyCategoryMock from './mdp/sys/companyCategoryMock';
 * CompanyCategoryMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/companyCategory/listKey').reply(config => {
      let params = config.params;
      let mockCompanyCategorys = _CompanyCategorys.filter(companyCategory => {
      	if(params.id||params.id==''){ if( companyCategory.id.indexOf(params.id)>=0) return true;}
      	if(params.categoryName||params.categoryName==''){ if( companyCategory.categoryName.indexOf(params.categoryName)>=0) return true;}
      	if(params.pid||params.pid==''){ if( companyCategory.pid.indexOf(params.pid)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockCompanyCategorys
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/companyCategory/list').reply(config => {
      let params = config.params;
      let mockCompanyCategorys = _CompanyCategorys.filter(companyCategory => {
      	var isTrue=false;
      	if(params.id||params.id==''){if(companyCategory.id.indexOf(params.id)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.categoryName||params.categoryName==''){if(companyCategory.categoryName.indexOf(params.categoryName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.pid||params.pid==''){if(companyCategory.pid.indexOf(params.pid)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockCompanyCategorys
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockCompanyCategorys.length;
      mockCompanyCategorys = mockCompanyCategorys.filter((companyCategory, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockCompanyCategorys,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/companyCategory/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  id  } = params;
      _CompanyCategorys = _CompanyCategorys.filter(companyCategory => companyCategory.id !== id);
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
    mock.onPost('/mdp/sys/companyCategory/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _CompanyCategorys = _CompanyCategorys.filter(companyCategory => !params.includes(companyCategory.id));
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
    mock.onPost('/mdp/sys/companyCategory/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { id,categoryName,pid } = params;
      _CompanyCategorys.some(companyCategory => {
        if (companyCategory.id === id) {
			companyCategory.id = id;
			companyCategory.categoryName = categoryName;
			companyCategory.pid = pid
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
    mock.onPost('/mdp/sys/companyCategory/add').reply(config => {
      var params = JSON.parse( config.data );
      let { id,categoryName,pid } = params;
      _CompanyCategorys.push({
		id:id,
		categoryName:categoryName,
		pid:pid
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