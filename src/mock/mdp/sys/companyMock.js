import { Companys } from './company';
let _Companys = Companys;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import CompanyMock from './mdp/sys/companyMock';
 * CompanyMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/company/listKey').reply(config => {
      let params = config.params;
      let mockCompanys = _Companys.filter(company => {
      	if(params.id||params.id==''){ if( company.id.indexOf(params.id)>=0) return true;}
      	if(params.companyName||params.companyName==''){ if( company.companyName.indexOf(params.companyName)>=0) return true;}
      	if(params.districtId||params.districtId==''){ if( company.districtId.indexOf(params.districtId)>=0) return true;}
      	if(params.categoryId||params.categoryId==''){ if( company.categoryId.indexOf(params.categoryId)>=0) return true;}
      	if(params.phoneNo||params.phoneNo==''){ if( company.phoneNo.indexOf(params.phoneNo)>=0) return true;}
      	if(params.orgId||params.orgId==''){ if( company.orgId.indexOf(params.orgId)>=0) return true;}
      	if(params.address||params.address==''){ if( company.address.indexOf(params.address)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockCompanys
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/company/list').reply(config => {
      let params = config.params;
      let mockCompanys = _Companys.filter(company => {
      	var isTrue=false;
      	if(params.id||params.id==''){if(company.id.indexOf(params.id)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.companyName||params.companyName==''){if(company.companyName.indexOf(params.companyName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.districtId||params.districtId==''){if(company.districtId.indexOf(params.districtId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.categoryId||params.categoryId==''){if(company.categoryId.indexOf(params.categoryId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.phoneNo||params.phoneNo==''){if(company.phoneNo.indexOf(params.phoneNo)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.orgId||params.orgId==''){if(company.orgId.indexOf(params.orgId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.address||params.address==''){if(company.address.indexOf(params.address)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockCompanys
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockCompanys.length;
      mockCompanys = mockCompanys.filter((company, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockCompanys,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/company/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  id  } = params;
      _Companys = _Companys.filter(company => company.id !== id);
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
    mock.onPost('/mdp/sys/company/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Companys = _Companys.filter(company => !params.includes(company.id));
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
    mock.onPost('/mdp/sys/company/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { id,companyName,districtId,categoryId,phoneNo,orgId,address } = params;
      _Companys.some(company => {
        if (company.id === id) {
			company.id = id;
			company.companyName = companyName;
			company.districtId = districtId;
			company.categoryId = categoryId;
			company.phoneNo = phoneNo;
			company.orgId = orgId;
			company.address = address
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
    mock.onPost('/mdp/sys/company/add').reply(config => {
      var params = JSON.parse( config.data );
      let { id,companyName,districtId,categoryId,phoneNo,orgId,address } = params;
      _Companys.push({
		id:id,
		companyName:companyName,
		districtId:districtId,
		categoryId:categoryId,
		phoneNo:phoneNo,
		orgId:orgId,
		address:address
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