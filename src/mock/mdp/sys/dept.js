 import Mock from 'mockjs';

const Depts = [];

for (let i = 0; i < 25; i++) {
  Depts.push(Mock.mock({
		deptid:Mock.Random.string(5),
		deptName:Mock.Random.ctitle(1,4) , 
		pdeptid:Mock.Random.ctitle(1,0) , 
		deptType:Mock.Random.character('lower') , 
		state:Mock.Random.ctitle(1,4) , 
		manager:Mock.Random.ctitle(1,0) , 
		leader:Mock.Random.ctitle(1,0) , 
		shortName:Mock.Random.ctitle(1,2) , 
		displayDeptid:Mock.Random.ctitle(1,0) , 
		orgType:Mock.Random.character('lower') , 
		managerName:Mock.Random.ctitle(1,0) , 
		leaderName:Mock.Random.ctitle(1,0)
  }));
}

export { Depts };
