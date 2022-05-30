import { Users } from './user';
let _Users = Users;
/**
 * 拷贝下面两行到 mock/index.js中,即可支持客户端虚拟数据、免服务端连接
 * import UserMock from './mdp/sys/userMock';
 * UserMock.bootstrap(mock);
 */
export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
  
    //获取列表 模糊查询、根据关键字查询
    mock.onGet('/mdp/sys/user/listKey').reply(config => {
      let params = config.params;
      let mockUsers = _Users.filter(user => {
      	if(params.unionid||params.unionid==''){ if( user.unionid.indexOf(params.unionid)>=0) return true;}
      	if(params.displayUserid||params.displayUserid==''){ if( user.displayUserid.indexOf(params.displayUserid)>=0) return true;}
      	if(params.userid||params.userid==''){ if( user.userid.indexOf(params.userid)>=0) return true;}
      	if(params.locked||params.locked==''){ if( user.locked.indexOf(params.locked)>=0) return true;}
      	if(params.startdate||params.startdate==''){ if( user.startdate.indexOf(params.startdate)>=0) return true;}
      	if(params.nickname||params.nickname==''){ if( user.nickname.indexOf(params.nickname)>=0) return true;}
      	if(params.username||params.username==''){ if( user.username.indexOf(params.username)>=0) return true;}
      	if(params.deptid||params.deptid==''){ if( user.deptid.indexOf(params.deptid)>=0) return true;}
      	if(params.phoneno||params.phoneno==''){ if( user.phoneno.indexOf(params.phoneno)>=0) return true;}
      	if(params.password||params.password==''){ if( user.password.indexOf(params.password)>=0) return true;}
      	if(params.salt||params.salt==''){ if( user.salt.indexOf(params.salt)>=0) return true;}
      	if(params.fingerpassword1||params.fingerpassword1==''){ if( user.fingerpassword1.indexOf(params.fingerpassword1)>=0) return true;}
      	if(params.fingerpassword2||params.fingerpassword2==''){ if( user.fingerpassword2.indexOf(params.fingerpassword2)>=0) return true;}
      	if(params.fingerpassword3||params.fingerpassword3==''){ if( user.fingerpassword3.indexOf(params.fingerpassword3)>=0) return true;}
      	if(params.fingerpassword4||params.fingerpassword4==''){ if( user.fingerpassword4.indexOf(params.fingerpassword4)>=0) return true;}
      	if(params.pwdtype||params.pwdtype==''){ if( user.pwdtype.indexOf(params.pwdtype)>=0) return true;}
      	if(params.headimgurl||params.headimgurl==''){ if( user.headimgurl.indexOf(params.headimgurl)>=0) return true;}
      	if(params.country||params.country==''){ if( user.country.indexOf(params.country)>=0) return true;}
      	if(params.city||params.city==''){ if( user.city.indexOf(params.city)>=0) return true;}
      	if(params.province||params.province==''){ if( user.province.indexOf(params.province)>=0) return true;}
      	if(params.address||params.address==''){ if( user.address.indexOf(params.address)>=0) return true;}
      	if(params.sex||params.sex==''){ if( user.sex.indexOf(params.sex)>=0) return true;}
      	if(params.enddate||params.enddate==''){ if( user.enddate.indexOf(params.enddate)>=0) return true;}
      	if(params.districtId||params.districtId==''){ if( user.districtId.indexOf(params.districtId)>=0) return true;}
      	if(params.custtype||params.custtype==''){ if( user.custtype.indexOf(params.custtype)>=0) return true;}
        return false;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            data: mockUsers
          }]);
        }, 1000);
      });
    });
    
    

    //获取列表（分页/不分页）
    mock.onGet('/mdp/sys/user/list').reply(config => {
      let params = config.params;
      let mockUsers = _Users.filter(user => {
      	var isTrue=false;
      	if(params.unionid||params.unionid==''){if(user.unionid.indexOf(params.unionid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.displayUserid||params.displayUserid==''){if(user.displayUserid.indexOf(params.displayUserid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.userid||params.userid==''){if(user.userid.indexOf(params.userid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.locked||params.locked==''){if(user.locked.indexOf(params.locked)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.startdate||params.startdate==''){if(user.startdate.indexOf(params.startdate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.nickname||params.nickname==''){if(user.nickname.indexOf(params.nickname)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.username||params.username==''){if(user.username.indexOf(params.username)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.deptid||params.deptid==''){if(user.deptid.indexOf(params.deptid)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.phoneno||params.phoneno==''){if(user.phoneno.indexOf(params.phoneno)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.password||params.password==''){if(user.password.indexOf(params.password)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.salt||params.salt==''){if(user.salt.indexOf(params.salt)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.fingerpassword1||params.fingerpassword1==''){if(user.fingerpassword1.indexOf(params.fingerpassword1)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.fingerpassword2||params.fingerpassword2==''){if(user.fingerpassword2.indexOf(params.fingerpassword2)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.fingerpassword3||params.fingerpassword3==''){if(user.fingerpassword3.indexOf(params.fingerpassword3)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.fingerpassword4||params.fingerpassword4==''){if(user.fingerpassword4.indexOf(params.fingerpassword4)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.pwdtype||params.pwdtype==''){if(user.pwdtype.indexOf(params.pwdtype)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.headimgurl||params.headimgurl==''){if(user.headimgurl.indexOf(params.headimgurl)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.country||params.country==''){if(user.country.indexOf(params.country)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.city||params.city==''){if(user.city.indexOf(params.city)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.province||params.province==''){if(user.province.indexOf(params.province)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.address||params.address==''){if(user.address.indexOf(params.address)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.sex||params.sex==''){if(user.sex.indexOf(params.sex)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.enddate||params.enddate==''){if(user.enddate.indexOf(params.enddate)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.districtId||params.districtId==''){if(user.districtId.indexOf(params.districtId)>=0){isTrue=true;}else{isTrue=false;}}
      	if(params.custtype||params.custtype==''){if(user.custtype.indexOf(params.custtype)>=0){isTrue=true;}else{isTrue=false;}}
      	return isTrue;
	  });
      if(!config.params.currentPage){ 
	      return new Promise((resolve, reject) => {
	        setTimeout(() => {
	          resolve([200, {
	            data: mockUsers
	          }]);
	        }, 1000);
	      });
      }
    
      let {pageSize,currentPage, total} = config.params;
      total = mockUsers.length;
      mockUsers = mockUsers.filter((user, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            pageInfo: {
            	total:total
            },
            data: mockUsers,
            tips:{
            	isOk:true,
            	msg:'查询成功'
            }
          }]);
        }, 1000);
      });
    });

    //删除
    mock.onPost('/mdp/sys/user/del').reply(config => {
      var params = JSON.parse( config.data );
      let {  userid  } = params;
      _Users = _Users.filter(user => user.userid !== userid);
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
    mock.onPost('/mdp/sys/user/batchDel').reply(config => {
      var params = JSON.parse( config.data );
      _Users = _Users.filter(user => !params.includes(user.userid));
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
    mock.onPost('/mdp/sys/user/edit').reply(config => {
      var params = JSON.parse( config.data );
      let { unionid,displayUserid,userid,locked,startdate,nickname,username,deptid,phoneno,password,salt,fingerpassword1,fingerpassword2,fingerpassword3,fingerpassword4,pwdtype,headimgurl,country,city,province,address,sex,enddate,districtId,custtype } = params;
      _Users.some(user => {
        if (user.userid === userid) {
			user.unionid = unionid;
			user.displayUserid = displayUserid;
			user.userid = userid;
			user.locked = locked;
			user.startdate = startdate;
			user.nickname = nickname;
			user.username = username;
			user.deptid = deptid;
			user.phoneno = phoneno;
			user.password = password;
			user.salt = salt;
			user.fingerpassword1 = fingerpassword1;
			user.fingerpassword2 = fingerpassword2;
			user.fingerpassword3 = fingerpassword3;
			user.fingerpassword4 = fingerpassword4;
			user.pwdtype = pwdtype;
			user.headimgurl = headimgurl;
			user.country = country;
			user.city = city;
			user.province = province;
			user.address = address;
			user.sex = sex;
			user.enddate = enddate;
			user.districtId = districtId;
			user.custtype = custtype
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
    mock.onPost('/mdp/sys/user/add').reply(config => {
      var params = JSON.parse( config.data );
      let { unionid,displayUserid,userid,locked,startdate,nickname,username,deptid,phoneno,password,salt,fingerpassword1,fingerpassword2,fingerpassword3,fingerpassword4,pwdtype,headimgurl,country,city,province,address,sex,enddate,districtId,custtype } = params;
      _Users.push({
		unionid:unionid,
		displayUserid:displayUserid,
		userid:userid,
		locked:locked,
		startdate:startdate,
		nickname:nickname,
		username:username,
		deptid:deptid,
		phoneno:phoneno,
		password:password,
		salt:salt,
		fingerpassword1:fingerpassword1,
		fingerpassword2:fingerpassword2,
		fingerpassword3:fingerpassword3,
		fingerpassword4:fingerpassword4,
		pwdtype:pwdtype,
		headimgurl:headimgurl,
		country:country,
		city:city,
		province:province,
		address:address,
		sex:sex,
		enddate:enddate,
		districtId:districtId,
		custtype:custtype
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