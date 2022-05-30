 import Mock from 'mockjs';

const Companys = [];

for (let i = 0; i < 25; i++) {
  Companys.push(Mock.mock({
		companyId:Mock.Random.string(5),
		branchId:Mock.Random.string(5),
		companyName:Mock.Random.ctitle(1,0) , 
		districtId:Mock.Random.ctitle(1,0) , 
		categoryId:Mock.Random.ctitle(1,0) , 
		phoneNo:Mock.Random.ctitle(1,0) , 
		orgId:Mock.Random.ctitle(1,0) , 
		address:Mock.Random.ctitle(1,0)
  }));
}

export { Companys };
