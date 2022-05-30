 import Mock from 'mockjs';

const Qxs = [];

for (let i = 0; i < 25; i++) {
  Qxs.push(Mock.mock({
		qxId:Mock.Random.string(5),
		qxName:Mock.Random.ctitle(1,0) , 
		qxType:Mock.Random.ctitle(1,0) , 
		remark:Mock.Random.ctitle(1,0) , 
		qxCode:Mock.Random.ctitle(1,0) , 
		enabled:Mock.Random.character('lower') , 
		deptid:Mock.Random.ctitle(1,0)
  }));
}

export { Qxs };
