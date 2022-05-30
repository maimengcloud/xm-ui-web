 import Mock from 'mockjs';

const Categorys = [];

for (let i = 0; i < 25; i++) {
  Categorys.push(Mock.mock({
		id:Mock.Random.string(5),
		pid:Mock.Random.ctitle(1,0) , 
		name:Mock.Random.ctitle(1,0) , 
		'sortOrder|0-5': 1
  }));
}

export { Categorys };
