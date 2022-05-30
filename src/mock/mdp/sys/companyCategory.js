 import Mock from 'mockjs';

const CompanyCategorys = [];

for (let i = 0; i < 25; i++) {
  CompanyCategorys.push(Mock.mock({
		id:Mock.Random.string(5),
		categoryName:Mock.Random.ctitle(1,0) , 
		pid:Mock.Random.ctitle(1,0)
  }));
}

export { CompanyCategorys };
