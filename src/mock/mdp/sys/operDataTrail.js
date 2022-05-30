 import Mock from 'mockjs';

const OperDataTrails = [];

for (let i = 0; i < 25; i++) {
  OperDataTrails.push(Mock.mock({
		id:Mock.Random.string(5),
		userid:Mock.Random.ctitle(1,0) , 
		startDate:Mock.Random.date('yyyy-MM-dd') , 
		endDate:Mock.Random.date('yyyy-MM-dd') , 
		fkey:Mock.Random.ctitle(1,0) , 
		skey:Mock.Random.ctitle(1,0) , 
		tableName:Mock.Random.ctitle(1,0) , 
		fields:Mock.Random.ctitle(1,0) , 
		remark:Mock.Random.ctitle(1,0)
  }));
}

export { OperDataTrails };
