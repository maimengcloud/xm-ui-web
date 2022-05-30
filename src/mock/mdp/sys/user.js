 import Mock from 'mockjs';

const Users = [];

for (let i = 0; i < 25; i++) {
  Users.push(Mock.mock({
		userid:Mock.Random.string(5),
		unionid:Mock.Random.ctitle(1,4) , 
		displayUserid:Mock.Random.ctitle(1,4) , 
		locked:Mock.Random.character('lower') , 
		startdate:Mock.Random.date('yyyy-MM-dd') , 
		nickname:Mock.Random.ctitle(1,8) , 
		username:Mock.Random.ctitle(1,8) , 
		deptid:Mock.Random.ctitle(1,0) , 
		phoneno:Mock.Random.ctitle(1,0) , 
		password:Mock.Random.ctitle(1,0) , 
		salt:Mock.Random.ctitle(1,0) , 
		fingerpassword1:Mock.Random.ctitle(1,0) , 
		fingerpassword2:Mock.Random.ctitle(1,0) , 
		fingerpassword3:Mock.Random.ctitle(1,0) , 
		fingerpassword4:Mock.Random.ctitle(1,0) , 
		pwdtype:Mock.Random.character('lower') , 
		headimgurl:Mock.Random.ctitle(1,0) , 
		country:Mock.Random.ctitle(1,0) , 
		city:Mock.Random.ctitle(1,0) , 
		province:Mock.Random.ctitle(1,0) , 
		address:Mock.Random.ctitle(1,0) , 
		sex:Mock.Random.ctitle(1,0) , 
		enddate:Mock.Random.date('yyyy-MM-dd') , 
		districtId:Mock.Random.ctitle(1,0) , 
		custtype:Mock.Random.ctitle(1,3)
  }));
}

export { Users };
