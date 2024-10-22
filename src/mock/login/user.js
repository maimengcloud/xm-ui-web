 import Mock from 'mockjs';

 const LoginUsers = [
	  {
	    id: 1,
	    displayUserid: 'admin',
	    password: '123456',
	    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
	    username: '张某某'
	  }
	];

	const Users = [];

	for (let i = 0; i < 86; i++) {
	  Users.push(Mock.mock({
		displayUserid: Mock.Random.guid(),
	    username: Mock.Random.cname(),
	    addr: Mock.mock('@county(true)'),
	    'age|18-60': 1,
	    birth: Mock.Random.date(),
	    sex: Mock.Random.integer(0, 1)
	  }));
	}

export { LoginUsers, Users };