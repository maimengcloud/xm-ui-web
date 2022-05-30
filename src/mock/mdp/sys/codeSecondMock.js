import { CodeSeconds } from './codeSecond';
let _CodeSeconds = CodeSeconds;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import CodeSecondMock from './mdp/sys/codeSecondMock';
 * CodeSecondMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/codeSecond/listKey').reply(config => {
      let params = config.params;
      let mockCodeSeconds = _CodeSeconds.filter(codeSecond => {
      	if(params.secondCodeRow||params.secondCodeRow==''){ if( codeSecond.secondCodeRow.indexOf(params.secondCodeRow)>=0) return true;}
      	if(params.codeRow||params.codeRow==''){ if( codeSecond.codeRow.indexOf(params.codeRow)>=0) return true;}
      	if(params.dtcodeId||params.dtcodeId==''){ if( codeSecond.dtcodeId.indexOf(params.dtcodeId)>=0) return true;}
      	if(params.dtcodeName||params.dtcodeName==''){ if( codeSecond.dtcodeName.indexOf(params.dtcodeName)>=0) return true;}
      	if(params.fp||params.fp==''){ if( codeSecond.fp.indexOf(params.fp)>=0) return true;}
      	if(params.sp||params.sp==''){ if( codeSecond.sp.indexOf(params.sp)>=0) return true;}
      	if(params.state||params.state==''){ if( codeSecond.state.indexOf(params.state)>=0) return true;}
      	if(params.deptid||params.deptid==''){ if( codeSecond.deptid.indexOf(params.deptid)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockCodeSeconds
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/codeSecond/list').reply(config => {
      let params = config.params;
      let mockCodeSeconds = _CodeSeconds.filter(codeSecond => {
      	var isTrue=false;
      	if(params.secondCodeRow||params.secondCodeRow==''){if(codeSecond.secondCodeRow.indexOf(params.secondCodeRow)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.codeRow||params.codeRow==''){if(codeSecond.codeRow.indexOf(params.codeRow)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.dtcodeId||params.dtcodeId==''){if(codeSecond.dtcodeId.indexOf(params.dtcodeId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.dtcodeName||params.dtcodeName==''){if(codeSecond.dtcodeName.indexOf(params.dtcodeName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.fp||params.fp==''){if(codeSecond.fp.indexOf(params.fp)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.sp||params.sp==''){if(codeSecond.sp.indexOf(params.sp)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.state||params.state==''){if(codeSecond.state.indexOf(params.state)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.deptid||params.deptid==''){if(codeSecond.deptid.indexOf(params.deptid)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockCodeSeconds
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockCodeSeconds.length;
      mockCodeSeconds = mockCodeSeconds.filter((codeSecond, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockCodeSeconds,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/codeSecond/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  secondCodeRow  } = params;
      _CodeSeconds = _CodeSeconds.filter(codeSecond => codeSecond.secondCodeRow !== secondCodeRow);
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
    mock.onPost('/mdp/sys/codeSecond/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _CodeSeconds = _CodeSeconds.filter(codeSecond => !params.includes(codeSecond.secondCodeRow));
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
    mock.onPost('/mdp/sys/codeSecond/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { secondCodeRow,codeRow,dtcodeId,dtcodeName,fp,sp,state,deptid } = params;
      _CodeSeconds.some(codeSecond => {
        if (codeSecond.secondCodeRow === secondCodeRow) {
			codeSecond.secondCodeRow = secondCodeRow;
			codeSecond.codeRow = codeRow;
			codeSecond.dtcodeId = dtcodeId;
			codeSecond.dtcodeName = dtcodeName;
			codeSecond.fp = fp;
			codeSecond.sp = sp;
			codeSecond.state = state;
			codeSecond.deptid = deptid
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
    mock.onPost('/mdp/sys/codeSecond/add').reply(config => {
      var params = JSON.parse( config.data );
      let { secondCodeRow,codeRow,dtcodeId,dtcodeName,fp,sp,state,deptid } = params;
      _CodeSeconds.push({
		secondCodeRow:secondCodeRow,
		codeRow:codeRow,
		dtcodeId:dtcodeId,
		dtcodeName:dtcodeName,
		fp:fp,
		sp:sp,
		state:state,
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