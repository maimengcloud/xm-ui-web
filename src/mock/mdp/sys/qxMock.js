import { Qxs } from './qx';
let _Qxs = Qxs;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import QxMock from './mdp/sys/qxMock';
 * QxMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/qx/listKey').reply(config => {
      let params = config.params;
      let mockQxs = _Qxs.filter(qx => {
      	if(params.qxId||params.qxId==''){ if( qx.qxId.indexOf(params.qxId)>=0) return true;}
      	if(params.qxName||params.qxName==''){ if( qx.qxName.indexOf(params.qxName)>=0) return true;}
      	if(params.qxType||params.qxType==''){ if( qx.qxType.indexOf(params.qxType)>=0) return true;}
      	if(params.remark||params.remark==''){ if( qx.remark.indexOf(params.remark)>=0) return true;}
      	if(params.qxCode||params.qxCode==''){ if( qx.qxCode.indexOf(params.qxCode)>=0) return true;}
      	if(params.enabled||params.enabled==''){ if( qx.enabled.indexOf(params.enabled)>=0) return true;}
      	if(params.deptid||params.deptid==''){ if( qx.deptid.indexOf(params.deptid)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockQxs
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/qx/list').reply(config => {
      let params = config.params;
      let mockQxs = _Qxs.filter(qx => {
      	var isTrue=false;
      	if(params.qxId||params.qxId==''){if(qx.qxId.indexOf(params.qxId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.qxName||params.qxName==''){if(qx.qxName.indexOf(params.qxName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.qxType||params.qxType==''){if(qx.qxType.indexOf(params.qxType)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.remark||params.remark==''){if(qx.remark.indexOf(params.remark)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.qxCode||params.qxCode==''){if(qx.qxCode.indexOf(params.qxCode)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.enabled||params.enabled==''){if(qx.enabled.indexOf(params.enabled)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.deptid||params.deptid==''){if(qx.deptid.indexOf(params.deptid)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockQxs
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockQxs.length;
      mockQxs = mockQxs.filter((qx, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockQxs,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/qx/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  qxId  } = params;
      _Qxs = _Qxs.filter(qx => qx.qxId !== qxId);
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
    mock.onPost('/mdp/sys/qx/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Qxs = _Qxs.filter(qx => !params.includes(qx.qxId));
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
    mock.onPost('/mdp/sys/qx/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { qxId,qxName,qxType,remark,qxCode,enabled,deptid } = params;
      _Qxs.some(qx => {
        if (qx.qxId === qxId) {
			qx.qxId = qxId;
			qx.qxName = qxName;
			qx.qxType = qxType;
			qx.remark = remark;
			qx.qxCode = qxCode;
			qx.enabled = enabled;
			qx.deptid = deptid
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
    mock.onPost('/mdp/sys/qx/add').reply(config => {
      var params = JSON.parse( config.data );
      let { qxId,qxName,qxType,remark,qxCode,enabled,deptid } = params;
      _Qxs.push({
		qxId:qxId,
		qxName:qxName,
		qxType:qxType,
		remark:remark,
		qxCode:qxCode,
		enabled:enabled,
		deptid:deptid
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