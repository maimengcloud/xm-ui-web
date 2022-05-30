import { Regions } from './region';
let _Regions = Regions;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import RegionMock from './mdp/sys/regionMock';
 * RegionMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/region/listKey').reply(config => {
      let params = config.params;
      let mockRegions = _Regions.filter(region => {
      	if(params.id||params.id==''){ if( region.id.indexOf(params.id)>=0) return true;}
      	if(params.parentId||params.parentId==''){ if( region.parentId.indexOf(params.parentId)>=0) return true;}
      	if(params.name||params.name==''){ if( region.name.indexOf(params.name)>=0) return true;}
      	if(params.type||params.type==''){ if( region.type.indexOf(params.type)>=0) return true;}
      	if(params.agencyId||params.agencyId==''){ if( region.agencyId.indexOf(params.agencyId)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockRegions
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/region/list').reply(config => {
      let params = config.params;
      let mockRegions = _Regions.filter(region => {
      	var isTrue=false;
      	if(params.id||params.id==''){if(region.id.indexOf(params.id)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.parentId||params.parentId==''){if(region.parentId.indexOf(params.parentId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.name||params.name==''){if(region.name.indexOf(params.name)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.type||params.type==''){if(region.type.indexOf(params.type)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.agencyId||params.agencyId==''){if(region.agencyId.indexOf(params.agencyId)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockRegions
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockRegions.length;
      mockRegions = mockRegions.filter((region, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockRegions,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/region/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  id  } = params;
      _Regions = _Regions.filter(region => region.id !== id);
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
    mock.onPost('/mdp/sys/region/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Regions = _Regions.filter(region => !params.includes(region.id));
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
    mock.onPost('/mdp/sys/region/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { id,parentId,name,type,agencyId } = params;
      _Regions.some(region => {
        if (region.id === id) {
			region.id = id;
			region.parentId = parentId;
			region.name = name;
			region.type = type;
			region.agencyId = agencyId
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
    mock.onPost('/mdp/sys/region/add').reply(config => {
      var params = JSON.parse( config.data );
      let { id,parentId,name,type,agencyId } = params;
      _Regions.push({
		id:id,
		parentId:parentId,
		name:name,
		type:type,
		agencyId:agencyId
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