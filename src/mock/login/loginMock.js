import { LoginUsers,Users } from './user';

let _Users = Users;

export default {
  /**
   * mock bootstrap
   */
  bootstrap(mock) {    
	    //DeptMock.bootstrap();
	    // mock success request
	    mock.onGet('/success').reply(200, {
	      msg: 'success'
	    });

	    // mock error request
	    mock.onGet('/error').reply(500, {
	      msg: 'failure'
	    });
	    //登录
	    mock.onPost('/cfm/common/login').reply(config => {
	      let {displayUserid, password} = JSON.parse(config.data);
	      return new Promise((resolve, reject) => {
	        let user = null;
	        setTimeout(() => {
	          let hasUser = LoginUsers.some(u => {
	            if (u.displayUserid === displayUserid && u.password === password) {
	              user = JSON.parse(JSON.stringify(u));
	              user.password = undefined;
	              return true;
	            }
	          });

	          if (hasUser) {
	            resolve([200, { tips:{isOk:true,msg:'请求成功'}, data:user }]);
	          } else {
	            resolve([200, { tips:{isOk:false,msg:'请求失败'} }]);
	          }
	        }, 1000);
	      });
	    }); 
  }
};