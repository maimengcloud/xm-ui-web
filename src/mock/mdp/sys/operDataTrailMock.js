import { OperDataTrails } from './operDataTrail';
let _OperDataTrails = OperDataTrails;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import OperDataTrailMock from './mdp/sys/operDataTrailMock';
 * OperDataTrailMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/operDataTrail/listKey').reply(config => {
      let params = config.params;
      let mockOperDataTrails = _OperDataTrails.filter(operDataTrail => {
      	if(params.userid||params.userid==''){ if( operDataTrail.userid.indexOf(params.userid)>=0) return true;}
      	if(params.startDate||params.startDate==''){ if( operDataTrail.startDate.indexOf(params.startDate)>=0) return true;}
      	if(params.endDate||params.endDate==''){ if( operDataTrail.endDate.indexOf(params.endDate)>=0) return true;}
      	if(params.fkey||params.fkey==''){ if( operDataTrail.fkey.indexOf(params.fkey)>=0) return true;}
      	if(params.skey||params.skey==''){ if( operDataTrail.skey.indexOf(params.skey)>=0) return true;}
      	if(params.tableName||params.tableName==''){ if( operDataTrail.tableName.indexOf(params.tableName)>=0) return true;}
      	if(params.fields||params.fields==''){ if( operDataTrail.fields.indexOf(params.fields)>=0) return true;}
      	if(params.remark||params.remark==''){ if( operDataTrail.remark.indexOf(params.remark)>=0) return true;}
      	if(params.id||params.id==''){ if( operDataTrail.id.indexOf(params.id)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockOperDataTrails
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/operDataTrail/list').reply(config => {
      let params = config.params;
      let mockOperDataTrails = _OperDataTrails.filter(operDataTrail => {
      	var isTrue=false;
      	if(params.userid||params.userid==''){if(operDataTrail.userid.indexOf(params.userid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.startDate||params.startDate==''){if(operDataTrail.startDate.indexOf(params.startDate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.endDate||params.endDate==''){if(operDataTrail.endDate.indexOf(params.endDate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.fkey||params.fkey==''){if(operDataTrail.fkey.indexOf(params.fkey)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.skey||params.skey==''){if(operDataTrail.skey.indexOf(params.skey)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.tableName||params.tableName==''){if(operDataTrail.tableName.indexOf(params.tableName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.fields||params.fields==''){if(operDataTrail.fields.indexOf(params.fields)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.remark||params.remark==''){if(operDataTrail.remark.indexOf(params.remark)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.id||params.id==''){if(operDataTrail.id.indexOf(params.id)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockOperDataTrails
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockOperDataTrails.length;
      mockOperDataTrails = mockOperDataTrails.filter((operDataTrail, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockOperDataTrails,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/operDataTrail/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  id  } = params;
      _OperDataTrails = _OperDataTrails.filter(operDataTrail => operDataTrail.id !== id);
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
    mock.onPost('/mdp/sys/operDataTrail/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _OperDataTrails = _OperDataTrails.filter(operDataTrail => !params.includes(operDataTrail.id));
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
    mock.onPost('/mdp/sys/operDataTrail/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { userid,startDate,endDate,fkey,skey,tableName,fields,remark,id } = params;
      _OperDataTrails.some(operDataTrail => {
        if (operDataTrail.id === id) {
			operDataTrail.userid = userid;
			operDataTrail.startDate = startDate;
			operDataTrail.endDate = endDate;
			operDataTrail.fkey = fkey;
			operDataTrail.skey = skey;
			operDataTrail.tableName = tableName;
			operDataTrail.fields = fields;
			operDataTrail.remark = remark;
			operDataTrail.id = id
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
    mock.onPost('/mdp/sys/operDataTrail/add').reply(config => {
      var params = JSON.parse( config.data );
      let { userid,startDate,endDate,fkey,skey,tableName,fields,remark,id } = params;
      _OperDataTrails.push({
		userid:userid,
		startDate:startDate,
		endDate:endDate,
		fkey:fkey,
		skey:skey,
		tableName:tableName,
		fields:fields,
		remark:remark,
		id:id
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