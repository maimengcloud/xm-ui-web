 import Mock from 'mockjs';

const RoleQxs = [];

for (let i = 0; i < 25; i++) {
  RoleQxs.push(Mock.mock({
		id:Mock.Random.string(5),
		qxId:Mock.Random.ctitle(1,0) , 
		remark:Mock.Random.ctitle(1,0) , 
		roleid:Mock.Random.ctitle(1,0)
  }));
}

export { RoleQxs };
