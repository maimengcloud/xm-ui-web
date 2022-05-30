 import Mock from 'mockjs';

const CodeSeconds = [];

for (let i = 0; i < 25; i++) {
  CodeSeconds.push(Mock.mock({
		secondCodeRow:Mock.Random.string(5),
		codeRow:Mock.Random.ctitle(1,0) , 
		dtcodeId:Mock.Random.ctitle(1,2) , 
		dtcodeName:Mock.Random.ctitle(1,2) , 
		fp:Mock.Random.ctitle(1,0) , 
		sp:Mock.Random.ctitle(1,0) , 
		state:Mock.Random.character('lower') , 
		deptid:Mock.Random.ctitle(1,0)
  }));
}

export { CodeSeconds };
