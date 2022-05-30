 import Mock from 'mockjs';

const Regions = [];

for (let i = 0; i < 25; i++) {
  Regions.push(Mock.mock({
		id:Mock.Random.string(5),
		parentId:Mock.Random.ctitle(1,0) , 
		name:Mock.Random.ctitle(1,0) , 
		type:Mock.Random.character('lower') , 
		agencyId:Mock.Random.ctitle(1,0)
  }));
}

export { Regions };
