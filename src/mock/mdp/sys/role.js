 import Mock from 'mockjs';

const Roles = [];

for (let i = 0; i < 25; i++) {
  Roles.push(Mock.mock({
		roleid:Mock.Random.string(5),
		rolename:Mock.Random.ctitle(1,5) , 
		remark:Mock.Random.ctitle(1,5) , 
		roletype:Mock.Random.character('lower') , 
		rolebeg:Mock.Random.date('yyyy-MM-dd') , 
		roleend:Mock.Random.date('yyyy-MM-dd') , 
		crperson:Mock.Random.ctitle(1,8) , 
		crdate:Mock.Random.date('yyyy-MM-dd') , 
		lopperson:Mock.Random.ctitle(1,8) , 
		lopdate:Mock.Random.date('yyyy-MM-dd') , 
		enabled:Mock.Random.character('lower') , 
		deptid:Mock.Random.ctitle(1,0) , 
		'sortOrder|0-2': 1
  }));
}

export { Roles };
