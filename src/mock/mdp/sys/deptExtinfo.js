 import Mock from 'mockjs';

const DeptExtinfos = [];

for (let i = 0; i < 25; i++) {
  DeptExtinfos.push(Mock.mock({
		deptid:Mock.Random.string(5),
		extState:Mock.Random.character('lower') , 
		extFlowState:Mock.Random.character('lower')
  }));
}

export { DeptExtinfos };
