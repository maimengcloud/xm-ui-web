 import Mock from 'mockjs';

const Dists = [];

for (let i = 0; i < 25; i++) {
  Dists.push(Mock.mock({
		distId:Mock.Random.string(5),
		branchId:Mock.Random.string(5),
		distName:Mock.Random.ctitle(1,0) , 
		enabled:Mock.Random.character('lower')
  }));
}

export { Dists };
