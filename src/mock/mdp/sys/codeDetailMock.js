import { CodeDetails } from './codeDetail';
let _CodeDetails = CodeDetails;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import CodeDetailMock from './mdp/sys/codeDetailMock';
 * CodeDetailMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/codeDetail/listKey').reply(config => {
      let params = config.params;
      let mockCodeDetails = _CodeDetails.filter(codeDetail => {
      	if(params.dcodeRow||params.dcodeRow==''){ if( codeDetail.dcodeRow.indexOf(params.dcodeRow)>=0) return true;}
      	if(params.codeValue||params.codeValue==''){ if( codeDetail.codeValue.indexOf(params.codeValue)>=0) return true;}
      	if(params.codeName||params.codeName==''){ if( codeDetail.codeName.indexOf(params.codeName)>=0) return true;}
      	if(params.ifdefault||params.ifdefault==''){ if( codeDetail.ifdefault.indexOf(params.ifdefault)>=0) return true;}
      	if(params.state||params.state==''){ if( codeDetail.state.indexOf(params.state)>=0) return true;}
      	if(params.codeBeg||params.codeBeg==''){ if( codeDetail.codeBeg.indexOf(params.codeBeg)>=0) return true;}
      	if(params.codeEnd||params.codeEnd==''){ if( codeDetail.codeEnd.indexOf(params.codeEnd)>=0) return true;}
      	if(params.createPerson||params.createPerson==''){ if( codeDetail.createPerson.indexOf(params.createPerson)>=0) return true;}
      	if(params.createDate||params.createDate==''){ if( codeDetail.createDate.indexOf(params.createDate)>=0) return true;}
      	if(params.loperatePerson||params.loperatePerson==''){ if( codeDetail.loperatePerson.indexOf(params.loperatePerson)>=0) return true;}
      	if(params.loperateDate||params.loperateDate==''){ if( codeDetail.loperateDate.indexOf(params.loperateDate)>=0) return true;}
      	if(params.seqOrder||params.seqOrder==''){ if( codeDetail.seqOrder.indexOf(params.seqOrder)>=0) return true;}
      	if(params.keys||params.keys==''){ if( codeDetail.keys.indexOf(params.keys)>=0) return true;}
      	if(params.fp||params.fp==''){ if( codeDetail.fp.indexOf(params.fp)>=0) return true;}
      	if(params.sp||params.sp==''){ if( codeDetail.sp.indexOf(params.sp)>=0) return true;}
      	if(params.tp||params.tp==''){ if( codeDetail.tp.indexOf(params.tp)>=0) return true;}
      	if(params.secondCodeRow||params.secondCodeRow==''){ if( codeDetail.secondCodeRow.indexOf(params.secondCodeRow)>=0) return true;}
      	if(params.deptid||params.deptid==''){ if( codeDetail.deptid.indexOf(params.deptid)>=0) return true;}
      	if(params.codeRow||params.codeRow==''){ if( codeDetail.codeRow.indexOf(params.codeRow)>=0) return true;}
      	if(params.dtcodeId||params.dtcodeId==''){ if( codeDetail.dtcodeId.indexOf(params.dtcodeId)>=0) return true;}
      	if(params.dtcodeName||params.dtcodeName==''){ if( codeDetail.dtcodeName.indexOf(params.dtcodeName)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockCodeDetails
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/codeDetail/list').reply(config => {
      let params = config.params;
      let mockCodeDetails = _CodeDetails.filter(codeDetail => {
      	var isTrue=false;
      	if(params.dcodeRow||params.dcodeRow==''){if(codeDetail.dcodeRow.indexOf(params.dcodeRow)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.codeValue||params.codeValue==''){if(codeDetail.codeValue.indexOf(params.codeValue)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.codeName||params.codeName==''){if(codeDetail.codeName.indexOf(params.codeName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.ifdefault||params.ifdefault==''){if(codeDetail.ifdefault.indexOf(params.ifdefault)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.state||params.state==''){if(codeDetail.state.indexOf(params.state)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.codeBeg||params.codeBeg==''){if(codeDetail.codeBeg.indexOf(params.codeBeg)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.codeEnd||params.codeEnd==''){if(codeDetail.codeEnd.indexOf(params.codeEnd)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.createPerson||params.createPerson==''){if(codeDetail.createPerson.indexOf(params.createPerson)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.createDate||params.createDate==''){if(codeDetail.createDate.indexOf(params.createDate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.loperatePerson||params.loperatePerson==''){if(codeDetail.loperatePerson.indexOf(params.loperatePerson)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.loperateDate||params.loperateDate==''){if(codeDetail.loperateDate.indexOf(params.loperateDate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.seqOrder||params.seqOrder==''){if(codeDetail.seqOrder.indexOf(params.seqOrder)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.keys||params.keys==''){if(codeDetail.keys.indexOf(params.keys)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.fp||params.fp==''){if(codeDetail.fp.indexOf(params.fp)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.sp||params.sp==''){if(codeDetail.sp.indexOf(params.sp)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.tp||params.tp==''){if(codeDetail.tp.indexOf(params.tp)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.secondCodeRow||params.secondCodeRow==''){if(codeDetail.secondCodeRow.indexOf(params.secondCodeRow)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.deptid||params.deptid==''){if(codeDetail.deptid.indexOf(params.deptid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.codeRow||params.codeRow==''){if(codeDetail.codeRow.indexOf(params.codeRow)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.dtcodeId||params.dtcodeId==''){if(codeDetail.dtcodeId.indexOf(params.dtcodeId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.dtcodeName||params.dtcodeName==''){if(codeDetail.dtcodeName.indexOf(params.dtcodeName)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockCodeDetails
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockCodeDetails.length;
      mockCodeDetails = mockCodeDetails.filter((codeDetail, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockCodeDetails,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/codeDetail/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  dcodeRow  } = params;
      _CodeDetails = _CodeDetails.filter(codeDetail => codeDetail.dcodeRow !== dcodeRow);
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
    mock.onPost('/mdp/sys/codeDetail/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _CodeDetails = _CodeDetails.filter(codeDetail => !params.includes(codeDetail.dcodeRow));
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
    mock.onPost('/mdp/sys/codeDetail/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { dcodeRow,codeValue,codeName,ifdefault,state,codeBeg,codeEnd,createPerson,createDate,loperatePerson,loperateDate,seqOrder,keys,fp,sp,tp,secondCodeRow,deptid,codeRow,dtcodeId,dtcodeName } = params;
      _CodeDetails.some(codeDetail => {
        if (codeDetail.dcodeRow === dcodeRow) {
			codeDetail.dcodeRow = dcodeRow;
			codeDetail.codeValue = codeValue;
			codeDetail.codeName = codeName;
			codeDetail.ifdefault = ifdefault;
			codeDetail.state = state;
			codeDetail.codeBeg = codeBeg;
			codeDetail.codeEnd = codeEnd;
			codeDetail.createPerson = createPerson;
			codeDetail.createDate = createDate;
			codeDetail.loperatePerson = loperatePerson;
			codeDetail.loperateDate = loperateDate;
			codeDetail.seqOrder = seqOrder;
			codeDetail.keys = keys;
			codeDetail.fp = fp;
			codeDetail.sp = sp;
			codeDetail.tp = tp;
			codeDetail.secondCodeRow = secondCodeRow;
			codeDetail.deptid = deptid;
			codeDetail.codeRow = codeRow;
			codeDetail.dtcodeId = dtcodeId;
			codeDetail.dtcodeName = dtcodeName
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
    mock.onPost('/mdp/sys/codeDetail/add').reply(config => {
      var params = JSON.parse( config.data );
      let { dcodeRow,codeValue,codeName,ifdefault,state,codeBeg,codeEnd,createPerson,createDate,loperatePerson,loperateDate,seqOrder,keys,fp,sp,tp,secondCodeRow,deptid,codeRow,dtcodeId,dtcodeName } = params;
      _CodeDetails.push({
		dcodeRow:dcodeRow,
		codeValue:codeValue,
		codeName:codeName,
		ifdefault:ifdefault,
		state:state,
		codeBeg:codeBeg,
		codeEnd:codeEnd,
		createPerson:createPerson,
		createDate:createDate,
		loperatePerson:loperatePerson,
		loperateDate:loperateDate,
		seqOrder:seqOrder,
		keys:keys,
		fp:fp,
		sp:sp,
		tp:tp,
		secondCodeRow:secondCodeRow,
		deptid:deptid,
		codeRow:codeRow,
		dtcodeId:dtcodeId,
		dtcodeName:dtcodeName
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