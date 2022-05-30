import { Codes } from './code';
let _Codes = Codes;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import CodeMock from './mdp/sys/codeMock';
 * CodeMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/code/listKey').reply(config => {
      let params = config.params;
      let mockCodes = _Codes.filter(code => {
      	if(params.codeRow||params.codeRow==''){ if( code.codeRow.indexOf(params.codeRow)>=0) return true;}
      	if(params.tcodeId||params.tcodeId==''){ if( code.tcodeId.indexOf(params.tcodeId)>=0) return true;}
      	if(params.tcodeName||params.tcodeName==''){ if( code.tcodeName.indexOf(params.tcodeName)>=0) return true;}
      	if(params.remark||params.remark==''){ if( code.remark.indexOf(params.remark)>=0) return true;}
      	if(params.state||params.state==''){ if( code.state.indexOf(params.state)>=0) return true;}
      	if(params.codeBeg||params.codeBeg==''){ if( code.codeBeg.indexOf(params.codeBeg)>=0) return true;}
      	if(params.codeEnd||params.codeEnd==''){ if( code.codeEnd.indexOf(params.codeEnd)>=0) return true;}
      	if(params.createPerson||params.createPerson==''){ if( code.createPerson.indexOf(params.createPerson)>=0) return true;}
      	if(params.createDate||params.createDate==''){ if( code.createDate.indexOf(params.createDate)>=0) return true;}
      	if(params.loperatePerson||params.loperatePerson==''){ if( code.loperatePerson.indexOf(params.loperatePerson)>=0) return true;}
      	if(params.loperateDate||params.loperateDate==''){ if( code.loperateDate.indexOf(params.loperateDate)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockCodes
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/code/list').reply(config => {
      let params = config.params;
      let mockCodes = _Codes.filter(code => {
      	var isTrue=false;
      	if(params.codeRow||params.codeRow==''){if(code.codeRow.indexOf(params.codeRow)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.tcodeId||params.tcodeId==''){if(code.tcodeId.indexOf(params.tcodeId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.tcodeName||params.tcodeName==''){if(code.tcodeName.indexOf(params.tcodeName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.remark||params.remark==''){if(code.remark.indexOf(params.remark)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.state||params.state==''){if(code.state.indexOf(params.state)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.codeBeg||params.codeBeg==''){if(code.codeBeg.indexOf(params.codeBeg)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.codeEnd||params.codeEnd==''){if(code.codeEnd.indexOf(params.codeEnd)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.createPerson||params.createPerson==''){if(code.createPerson.indexOf(params.createPerson)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.createDate||params.createDate==''){if(code.createDate.indexOf(params.createDate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.loperatePerson||params.loperatePerson==''){if(code.loperatePerson.indexOf(params.loperatePerson)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.loperateDate||params.loperateDate==''){if(code.loperateDate.indexOf(params.loperateDate)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockCodes
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockCodes.length;
      mockCodes = mockCodes.filter((code, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockCodes,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/code/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  codeRow  } = params;
      _Codes = _Codes.filter(code => code.codeRow !== codeRow);
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
    mock.onPost('/mdp/sys/code/batchDel').reply(config => {
      var params = JSON.parse( config.data );
       
      codeRows = codeRows.split(',');
      _Codes = _Codes.filter(code => !params.includes(code.codeRow));
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
    mock.onPost('/mdp/sys/code/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { codeRow,tcodeId,tcodeName,remark,state,codeBeg,codeEnd,createPerson,createDate,loperatePerson,loperateDate } = params;
      _Codes.some(code => {
        if (code.codeRow === codeRow) {
			code.codeRow = codeRow;
			code.tcodeId = tcodeId;
			code.tcodeName = tcodeName;
			code.remark = remark;
			code.state = state;
			code.codeBeg = codeBeg;
			code.codeEnd = codeEnd;
			code.createPerson = createPerson;
			code.createDate = createDate;
			code.loperatePerson = loperatePerson;
			code.loperateDate = loperateDate
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
    mock.onPost('/mdp/sys/code/add').reply(config => {
      var params = JSON.parse( config.data );
      let { codeRow,tcodeId,tcodeName,remark,state,codeBeg,codeEnd,createPerson,createDate,loperatePerson,loperateDate } = params;
      _Codes.push({
		codeRow:codeRow,
		tcodeId:tcodeId,
		tcodeName:tcodeName,
		remark:remark,
		state:state,
		codeBeg:codeBeg,
		codeEnd:codeEnd,
		createPerson:createPerson,
		createDate:createDate,
		loperatePerson:loperatePerson,
		loperateDate:loperateDate
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