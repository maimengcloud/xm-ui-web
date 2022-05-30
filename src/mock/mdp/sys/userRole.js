 import Mock from 'mockjs';

const UserRoles = [];

for (let i = 0; i < 25; i++) {
  UserRoles.push(Mock.mock({
		id:Mock.Random.string(5),
		roleid:Mock.Random.ctitle(1,0) , 
		userid:Mock.Random.ctitle(1,4) , 
		remark:Mock.Random.ctitle(1,5) , 
		userroleBeg:Mock.Random.date('yyyy-MM-dd') , 
		userroleEnd:Mock.Random.date('yyyy-MM-dd') , 
		createPerson:Mock.Random.ctitle(1,0) , 
		createDate:Mock.Random.date('yyyy-MM-dd') , 
		loperatePerson:Mock.Random.ctitle(1,0) , 
		loperateDate:Mock.Random.date('yyyy-MM-dd') , 
		'roleSort|0-4': 1 , 
		enabled:Mock.Random.character('lower') , 
		deptid:Mock.Random.ctitle(1,0)
  }));
}

export { UserRoles };
