import { Categorys } from './category';
let _Categorys = Categorys;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import CategoryMock from './mdp/sys/categoryMock';
 * CategoryMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/category/listKey').reply(config => {
      let params = config.params;
      let mockCategorys = _Categorys.filter(category => {
      	if(params.id||params.id==''){ if( category.id.indexOf(params.id)>=0) return true;}
      	if(params.pid||params.pid==''){ if( category.pid.indexOf(params.pid)>=0) return true;}
      	if(params.name||params.name==''){ if( category.name.indexOf(params.name)>=0) return true;}
      	if(params.sortOrder||params.sortOrder==''){ if( category.sortOrder.indexOf(params.sortOrder)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockCategorys
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/category/list').reply(config => {
      let params = config.params;
      let mockCategorys = _Categorys.filter(category => {
      	var isTrue=false;
      	if(params.id||params.id==''){if(category.id.indexOf(params.id)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.pid||params.pid==''){if(category.pid.indexOf(params.pid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.name||params.name==''){if(category.name.indexOf(params.name)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.sortOrder||params.sortOrder==''){if(category.sortOrder.indexOf(params.sortOrder)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockCategorys
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockCategorys.length;
      mockCategorys = mockCategorys.filter((category, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockCategorys,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/category/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  id  } = params;
      _Categorys = _Categorys.filter(category => category.id !== id);
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
    mock.onPost('/mdp/sys/category/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Categorys = _Categorys.filter(category => !params.includes(category.id));
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
    mock.onPost('/mdp/sys/category/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { id,pid,name,sortOrder } = params;
      _Categorys.some(category => {
        if (category.id === id) {
			category.id = id;
			category.pid = pid;
			category.name = name;
			category.sortOrder = sortOrder
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
    mock.onPost('/mdp/sys/category/add').reply(config => {
      var params = JSON.parse( config.data );
      let { id,pid,name,sortOrder } = params;
      _Categorys.push({
		id:id,
		pid:pid,
		name:name,
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