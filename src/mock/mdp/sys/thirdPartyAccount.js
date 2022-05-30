 import Mock from 'mockjs';

const ThirdPartyAccounts = [];

for (let i = 0; i < 25; i++) {
  ThirdPartyAccounts.push(Mock.mock({
		openid:Mock.Random.string(5),
		unionid:Mock.Random.ctitle(1,4) , 
		userid:Mock.Random.ctitle(1,4) , 
		locked:Mock.Random.ctitle(1,6) , 
		startdate:Mock.Random.date('yyyy-MM-dd') , 
		nickname:Mock.Random.ctitle(1,8) , 
		username:Mock.Random.ctitle(1,8) , 
		phoneno:Mock.Random.ctitle(1,0) , 
		country:Mock.Random.ctitle(1,0) , 
		city:Mock.Random.ctitle(1,0) , 
		headimgurl:Mock.Random.ctitle(1,0) , 
		province:Mock.Random.ctitle(1,0) , 
		userunionid:Mock.Random.ctitle(1,4) , 
		frontApp:Mock.Random.ctitle(1,5)
  }));
}

export { ThirdPartyAccounts };
