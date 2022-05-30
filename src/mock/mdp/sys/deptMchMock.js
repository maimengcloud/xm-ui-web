import { DeptMchs } from './deptMch';
let _DeptMchs = DeptMchs;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import DeptMchMock from './mdp/sys/deptMchMock';
 * DeptMchMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/deptMch/listKey').reply(config => {
      let params = config.params;
      let mockDeptMchs = _DeptMchs.filter(deptMch => {
      	if(params.deptid||params.deptid==''){ if( deptMch.deptid.indexOf(params.deptid)>=0) return true;}
      	if(params.mchid||params.mchid==''){ if( deptMch.mchid.indexOf(params.mchid)>=0) return true;}
      	if(params.mchName||params.mchName==''){ if( deptMch.mchName.indexOf(params.mchName)>=0) return true;}
      	if(params.bankName||params.bankName==''){ if( deptMch.bankName.indexOf(params.bankName)>=0) return true;}
      	if(params.bankAccount||params.bankAccount==''){ if( deptMch.bankAccount.indexOf(params.bankAccount)>=0) return true;}
      	if(params.bankBranchName||params.bankBranchName==''){ if( deptMch.bankBranchName.indexOf(params.bankBranchName)>=0) return true;}
      	if(params.creditCode||params.creditCode==''){ if( deptMch.creditCode.indexOf(params.creditCode)>=0) return true;}
      	if(params.businessLicenseImage||params.businessLicenseImage==''){ if( deptMch.businessLicenseImage.indexOf(params.businessLicenseImage)>=0) return true;}
      	if(params.mchImage||params.mchImage==''){ if( deptMch.mchImage.indexOf(params.mchImage)>=0) return true;}
      	if(params.legalPerson||params.legalPerson==''){ if( deptMch.legalPerson.indexOf(params.legalPerson)>=0) return true;}
      	if(params.businessLicenseBegin||params.businessLicenseBegin==''){ if( deptMch.businessLicenseBegin.indexOf(params.businessLicenseBegin)>=0) return true;}
      	if(params.businessLicenseEnd||params.businessLicenseEnd==''){ if( deptMch.businessLicenseEnd.indexOf(params.businessLicenseEnd)>=0) return true;}
      	if(params.businessLicenseType||params.businessLicenseType==''){ if( deptMch.businessLicenseType.indexOf(params.businessLicenseType)>=0) return true;}
      	if(params.mchState||params.mchState==''){ if( deptMch.mchState.indexOf(params.mchState)>=0) return true;}
      	if(params.mchFlowState||params.mchFlowState==''){ if( deptMch.mchFlowState.indexOf(params.mchFlowState)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockDeptMchs
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/deptMch/list').reply(config => {
      let params = config.params;
      let mockDeptMchs = _DeptMchs.filter(deptMch => {
      	var isTrue=false;
      	if(params.deptid||params.deptid==''){if(deptMch.deptid.indexOf(params.deptid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.mchid||params.mchid==''){if(deptMch.mchid.indexOf(params.mchid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.mchName||params.mchName==''){if(deptMch.mchName.indexOf(params.mchName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.bankName||params.bankName==''){if(deptMch.bankName.indexOf(params.bankName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.bankAccount||params.bankAccount==''){if(deptMch.bankAccount.indexOf(params.bankAccount)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.bankBranchName||params.bankBranchName==''){if(deptMch.bankBranchName.indexOf(params.bankBranchName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.creditCode||params.creditCode==''){if(deptMch.creditCode.indexOf(params.creditCode)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.businessLicenseImage||params.businessLicenseImage==''){if(deptMch.businessLicenseImage.indexOf(params.businessLicenseImage)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.mchImage||params.mchImage==''){if(deptMch.mchImage.indexOf(params.mchImage)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.legalPerson||params.legalPerson==''){if(deptMch.legalPerson.indexOf(params.legalPerson)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.businessLicenseBegin||params.businessLicenseBegin==''){if(deptMch.businessLicenseBegin.indexOf(params.businessLicenseBegin)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.businessLicenseEnd||params.businessLicenseEnd==''){if(deptMch.businessLicenseEnd.indexOf(params.businessLicenseEnd)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.businessLicenseType||params.businessLicenseType==''){if(deptMch.businessLicenseType.indexOf(params.businessLicenseType)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.mchState||params.mchState==''){if(deptMch.mchState.indexOf(params.mchState)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.mchFlowState||params.mchFlowState==''){if(deptMch.mchFlowState.indexOf(params.mchFlowState)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockDeptMchs
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockDeptMchs.length;
      mockDeptMchs = mockDeptMchs.filter((deptMch, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockDeptMchs,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/deptMch/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  mchid  } = params;
      _DeptMchs = _DeptMchs.filter(deptMch => deptMch.mchid !== mchid);
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
    mock.onPost('/mdp/sys/deptMch/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _DeptMchs = _DeptMchs.filter(deptMch => !params.includes(deptMch.mchid));
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
    mock.onPost('/mdp/sys/deptMch/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { deptid,mchid,mchName,bankName,bankAccount,bankBranchName,creditCode,businessLicenseImage,mchImage,legalPerson,businessLicenseBegin,businessLicenseEnd,businessLicenseType,mchState,mchFlowState } = params;
      _DeptMchs.some(deptMch => {
        if (deptMch.mchid === mchid) {
			deptMch.deptid = deptid;
			deptMch.mchid = mchid;
			deptMch.mchName = mchName;
			deptMch.bankName = bankName;
			deptMch.bankAccount = bankAccount;
			deptMch.bankBranchName = bankBranchName;
			deptMch.creditCode = creditCode;
			deptMch.businessLicenseImage = businessLicenseImage;
			deptMch.mchImage = mchImage;
			deptMch.legalPerson = legalPerson;
			deptMch.businessLicenseBegin = businessLicenseBegin;
			deptMch.businessLicenseEnd = businessLicenseEnd;
			deptMch.businessLicenseType = businessLicenseType;
			deptMch.mchState = mchState;
			deptMch.mchFlowState = mchFlowState
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
    mock.onPost('/mdp/sys/deptMch/add').reply(config => {
      var params = JSON.parse( config.data );
      let { deptid,mchid,mchName,bankName,bankAccount,bankBranchName,creditCode,businessLicenseImage,mchImage,legalPerson,businessLicenseBegin,businessLicenseEnd,businessLicenseType,mchState,mchFlowState } = params;
      _DeptMchs.push({
		deptid:deptid,
		mchid:mchid,
		mchName:mchName,
		bankName:bankName,
		bankAccount:bankAccount,
		bankBranchName:bankBranchName,
		creditCode:creditCode,
		businessLicenseImage:businessLicenseImage,
		mchImage:mchImage,
		legalPerson:legalPerson,
		businessLicenseBegin:businessLicenseBegin,
		businessLicenseEnd:businessLicenseEnd,
		businessLicenseType:businessLicenseType,
		mchState:mchState,
		mchFlowState:mchFlowState
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