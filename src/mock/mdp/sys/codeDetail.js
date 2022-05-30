 import Mock from 'mockjs';

const CodeDetails = [];

for (let i = 0; i < 25; i++) {
  CodeDetails.push(Mock.mock({
		dcodeRow:Mock.Random.string(5),
		codeValue:Mock.Random.ctitle(1,0) , 
		codeName:Mock.Random.ctitle(1,2) , 
		ifdefault:Mock.Random.character('lower') , 
		state:Mock.Random.ctitle(1,4) , 
		codeBeg:Mock.Random.date('yyyy-MM-dd') , 
		codeEnd:Mock.Random.date('yyyy-MM-dd') , 
		createPerson:Mock.Random.ctitle(1,8) , 
		createDate:Mock.Random.date('yyyy-MM-dd') , 
		loperatePerson:Mock.Random.ctitle(1,8) , 
		loperateDate:Mock.Random.date('yyyy-MM-dd') , 
		'seqOrder|0-5': 1 , 
		keys:Mock.Random.ctitle(1,0) , 
		fp:Mock.Random.ctitle(1,0) , 
		sp:Mock.Random.ctitle(1,0) , 
		tp:Mock.Random.ctitle(1,0) , 
		secondCodeRow:Mock.Random.ctitle(1,0) , 
		deptid:Mock.Random.ctitle(1,0) , 
		codeRow:Mock.Random.ctitle(1,0) , 
		dtcodeId:Mock.Random.ctitle(1,2) , 
		dtcodeName:Mock.Random.ctitle(1,2)
  }));
}

export { CodeDetails };
