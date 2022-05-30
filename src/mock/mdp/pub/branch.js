 import Mock from 'mockjs';

const Branchs = [];

for (let i = 0; i < 25; i++) {
  Branchs.push(Mock.mock({
		branchId:Mock.Random.string(5),
		branchName:Mock.Random.ctitle(1,0) , 
		enabled:Mock.Random.character('lower')
  }));
}

export { Branchs };
