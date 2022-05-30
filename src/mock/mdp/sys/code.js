 import Mock from 'mockjs';

const Codes = [];

for (let i = 0; i < 25; i++) {
  Codes.push(Mock.mock({
		codeRow:Mock.Random.string(5),
		tcodeId:Mock.Random.ctitle(2,32) , 
		tcodeName:Mock.Random.ctitle(2,12) , 
		remark:Mock.Random.ctitle(2,24) , 
		state:Mock.Random.ctitle(2,4) , 
		codeBeg:Mock.Random.date('yyyy-MM-dd') , 
		codeEnd:Mock.Random.date('yyyy-MM-dd') , 
		createPerson:Mock.Random.ctitle(2,8) , 
		createDate:Mock.Random.date('yyyy-MM-dd') , 
		loperatePerson:Mock.Random.ctitle(2,8) , 
		loperateDate:Mock.Random.date('yyyy-MM-dd')
  }));
}

export { Codes };
