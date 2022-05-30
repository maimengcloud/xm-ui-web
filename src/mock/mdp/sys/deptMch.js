 import Mock from 'mockjs';

const DeptMchs = [];

for (let i = 0; i < 25; i++) {
  DeptMchs.push(Mock.mock({
		mchid:Mock.Random.string(5),
		deptid:Mock.Random.ctitle(1,0) , 
		mchName:Mock.Random.ctitle(1,0) , 
		bankName:Mock.Random.ctitle(1,0) , 
		bankAccount:Mock.Random.ctitle(1,0) , 
		bankBranchName:Mock.Random.ctitle(1,0) , 
		creditCode:Mock.Random.ctitle(1,0) , 
		businessLicenseImage:Mock.Random.ctitle(1,0) , 
		mchImage:Mock.Random.ctitle(1,0) , 
		legalPerson:Mock.Random.ctitle(1,0) , 
		businessLicenseBegin:Mock.Random.date('yyyy-MM-dd') , 
		businessLicenseEnd:Mock.Random.date('yyyy-MM-dd') , 
		businessLicenseType:Mock.Random.character('lower') , 
		mchState:Mock.Random.character('lower') , 
		mchFlowState:Mock.Random.character('lower')
  }));
}

export { DeptMchs };
