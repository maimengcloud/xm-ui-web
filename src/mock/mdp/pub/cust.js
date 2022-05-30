 import Mock from 'mockjs';

const Custs = [];

for (let i = 0; i < 25; i++) {
  Custs.push(Mock.mock({
		custId:Mock.Random.string(5),
		branchId:Mock.Random.string(5),
		custName:Mock.Random.ctitle(1,0) , 
		enabled:Mock.Random.character('lower')
  }));
}

export { Custs };
