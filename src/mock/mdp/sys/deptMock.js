import { Depts } from './dept';
let _Depts = Depts;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import DeptMock from './mdp/sys/deptMock';
 * DeptMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/dept/listKey').reply(config => {
      let params = config.params;
      let mockDepts = _Depts.filter(dept => {
      	if(params.deptid||params.deptid==''){ if( dept.deptid.indexOf(params.deptid)>=0) return true;}
      	if(params.deptName||params.deptName==''){ if( dept.deptName.indexOf(params.deptName)>=0) return true;}
      	if(params.pdeptid||params.pdeptid==''){ if( dept.pdeptid.indexOf(params.pdeptid)>=0) return true;}
      	if(params.deptType||params.deptType==''){ if( dept.deptType.indexOf(params.deptType)>=0) return true;}
      	if(params.state||params.state==''){ if( dept.state.indexOf(params.state)>=0) return true;}
      	if(params.manager||params.manager==''){ if( dept.manager.indexOf(params.manager)>=0) return true;}
      	if(params.leader||params.leader==''){ if( dept.leader.indexOf(params.leader)>=0) return true;}
      	if(params.shortName||params.shortName==''){ if( dept.shortName.indexOf(params.shortName)>=0) return true;}
      	if(params.displayDeptid||params.displayDeptid==''){ if( dept.displayDeptid.indexOf(params.displayDeptid)>=0) return true;}
      	if(params.orgType||params.orgType==''){ if( dept.orgType.indexOf(params.orgType)>=0) return true;}
      	if(params.managerName||params.managerName==''){ if( dept.managerName.indexOf(params.managerName)>=0) return true;}
      	if(params.leaderName||params.leaderName==''){ if( dept.leaderName.indexOf(params.leaderName)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockDepts
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/dept/list').reply(config => {
      let params = config.params;
      let mockDepts = _Depts.filter(dept => {
      	var isTrue=false;
      	if(params.deptid||params.deptid==''){if(dept.deptid.indexOf(params.deptid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.deptName||params.deptName==''){if(dept.deptName.indexOf(params.deptName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.pdeptid||params.pdeptid==''){if(dept.pdeptid.indexOf(params.pdeptid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.deptType||params.deptType==''){if(dept.deptType.indexOf(params.deptType)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.state||params.state==''){if(dept.state.indexOf(params.state)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.manager||params.manager==''){if(dept.manager.indexOf(params.manager)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.leader||params.leader==''){if(dept.leader.indexOf(params.leader)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.shortName||params.shortName==''){if(dept.shortName.indexOf(params.shortName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.displayDeptid||params.displayDeptid==''){if(dept.displayDeptid.indexOf(params.displayDeptid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.orgType||params.orgType==''){if(dept.orgType.indexOf(params.orgType)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.managerName||params.managerName==''){if(dept.managerName.indexOf(params.managerName)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.leaderName||params.leaderName==''){if(dept.leaderName.indexOf(params.leaderName)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockDepts
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockDepts.length;
      mockDepts = mockDepts.filter((dept, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockDepts,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/dept/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  deptid  } = params;
      _Depts = _Depts.filter(dept => dept.deptid !== deptid);
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
    mock.onPost('/mdp/sys/dept/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Depts = _Depts.filter(dept => !params.includes(dept.deptid));
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
    mock.onPost('/mdp/sys/dept/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { deptid,deptName,pdeptid,deptType,state,manager,leader,shortName,displayDeptid,orgType,managerName,leaderName } = params;
      _Depts.some(dept => {
        if (dept.deptid === deptid) {
			dept.deptid = deptid;
			dept.deptName = deptName;
			dept.pdeptid = pdeptid;
			dept.deptType = deptType;
			dept.state = state;
			dept.manager = manager;
			dept.leader = leader;
			dept.shortName = shortName;
			dept.displayDeptid = displayDeptid;
			dept.orgType = orgType;
			dept.managerName = managerName;
			dept.leaderName = leaderName
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
    mock.onPost('/mdp/sys/dept/add').reply(config => {
      var params = JSON.parse( config.data );
      let { deptid,deptName,pdeptid,deptType,state,manager,leader,shortName,displayDeptid,orgType,managerName,leaderName } = params;
      _Depts.push({
		deptid:deptid,
		deptName:deptName,
		pdeptid:pdeptid,
		deptType:deptType,
		state:state,
		manager:manager,
		leader:leader,
		shortName:shortName,
		displayDeptid:displayDeptid,
		orgType:orgType,
		managerName:managerName,
		leaderName:leaderName
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