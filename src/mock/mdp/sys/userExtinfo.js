 import Mock from 'mockjs';

const UserExtinfos = [];

for (let i = 0; i < 25; i++) {
  UserExtinfos.push(Mock.mock({
		userid:Mock.Random.string(5),
		lastLoginTime:Mock.Random.date('yyyy-MM-dd') , 
		'pwdErrorCount|0-0': 1 , 
		firstLoginChannel:Mock.Random.ctitle(1,0) , 
		lastLoginChannel:Mock.Random.ctitle(1,0) , 
		lastLoginArea:Mock.Random.ctitle(1,0) , 
		visitMsg:Mock.Random.ctitle(1,0) , 
		tpaOpenid:Mock.Random.ctitle(1,0)
  }));
}

export { UserExtinfos };
