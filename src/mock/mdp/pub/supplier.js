 import Mock from 'mockjs';

const Suppliers = [];

for (let i = 0; i < 25; i++) {
  Suppliers.push(Mock.mock({
		supplierId:Mock.Random.string(5),
		branchId:Mock.Random.string(5),
		supplierName:Mock.Random.ctitle(1,0) , 
		enabled:Mock.Random.character('lower')
  }));
}

export { Suppliers };
