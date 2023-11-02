import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 用户表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={userid:'内部用户编号(账户编号)，如果是机构管理员账户，则=机构号 主键',unionid:'全局唯一编号，也叫主账户，同一个人（比如同一个微信号，同一个邮箱，同一个手机号视为同一个人）。同一个人在mdp有唯一的主账号。',displayUserid:'登录展示使用用户编号',locked:'是否被锁定0否1是',startdate:'启用日期',nickname:'昵称',username:'用户名称',phoneno:'移动电话号码',password:'密码',salt:'盐值',pwdtype:'密码类型1指纹2密码',headimgurl:'头像地址',country:'国家',city:'城市',province:'省份',address:'详细地址',sex:'性别',enddate:'到期日期',districtId:'区县编号',email:'邮箱',fgOne:'指纹1',fgTwo:'指纹2',fgThr:'指纹3',idCardNo:'身份证号码',officePhoneno:'办公室电话',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态',memType:'从平台角度看会员类型0-个人账户、1-企业管理员账户、2-企业员工账户，个人账户无须绑定机构号，个人子账户可升级为企业员工账户，企业账户必须绑定机构编号branchId个人账户升级后，保留个人主账户，个人子账户绑定企业编号成为企业员工账户',orgId:'机构会员自己的机构会员的机构号，理解为客户的客户',emailBak:'备用邮箱',pwdStrong:'1-高风险，2-中风险，3-低风险',lockType:'锁定类型:0-注册等待邮箱验证，1-注册等待修改初始密码，2-注册等待验证手机号码，3-密码高风险，等待重新修改密码，9-业务需要锁定禁止登录，10-账户被锁定，请联系客服',lockRemark:'锁定原因',ltime:'更新日期',atype:'相对于平台来说的账户类型0-子账户，1-主账户。',branchId:'机构主子账户归属的机构编号,如果是个人，这里填虚拟机构编号，作为虚拟的机构号，方便将来升级成企业号',continent:'洲别',cpaType:'从入驻企业角度看协作类型0-企业内部人员，1-客户，2-供应商，3-上级机构，4-下属机构',cpaOrg:'协作组织0-个人，1机构，如果是机构，机构号填入orgId',roleids:'个人账户拥有的角色，逗号分割',birthday:'生日',shopId:'商户编号',profeId:'职业编号',profeName:'职业名称',gradeId:'等级会员，根据经验值而定',gradeName:'等级会员名称',ilvlId:'权益等级青铜、白银、黄金、紫金、钻石',ilvlName:'权益等级名称',istatus:'会员权益状态0-无效，1-有效，2-过期',istime:'权益开始时间',ietime:'权益结束时间',validLvls:'人工验证结果，当审核状态为2时，同步到sys_user表同一个字段，或者sys_branch同一个字段',features:'个性化签名',profeType:'职业类型1-开发类，2-测试类，3-设计类，4-管理类；',ustatus:'用户账户状态0-初始，1-起效，2-注销申请，3-注销后删除',creditId:'信用等级编号',creditScore:'信用等级分数',guardId:'服务保障等级0-初始，1-金，2-银，3-铜',open:'是否对互联网用户开放查询0-否1是',remark:'简介备注',bizHours:'营业时间说明09:00-12:00',skillIds:'技能编号列表',skillNames:'技能名称列表'}
 **/
 
//普通查询 条件之间and关系  
export const listUser = params => { return axios.get(`${base}/mdp/sys/user/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryUserById = params => { return axios.get(`${base}/mdp/sys/user/queryById`, { params: params }); };

//删除一条用户表 params={userid:'内部用户编号(账户编号)，如果是机构管理员账户，则=机构号 主键'}
export const delUser = params => { return axios.post(`${base}/mdp/sys/user/del`,params); };

//批量删除用户表  params=[{userid:'内部用户编号(账户编号)，如果是机构管理员账户，则=机构号 主键'}]
export const batchAddUser = params => { return axios.post(`${base}/mdp/sys/user/batchAdd`, params); };

//批量删除用户表  params=[{userid:'内部用户编号(账户编号)，如果是机构管理员账户，则=机构号 主键'}]
export const batchDelUser = params => { return axios.post(`${base}/mdp/sys/user/batchDel`, params); };

//修改一条用户表记录
export const editUser = params => { return axios.post(`${base}/mdp/sys/user/edit`, params); };

//新增一条用户表
export const addUser = params => { return axios.post(`${base}/mdp/sys/user/add`, params); };

//批量修改某些字段
export const editSomeFieldsUser = params => { return axios.post(`${base}/mdp/sys/user/editSomeFields`, params); };

//重置管理人员帮别人重置密码
export const resetPasswordByAdmin = params => { return axios.post(`${base}/sys/user/resetPassword`, params); };

//修改自己的密码
export const changePassword = params => { return axios.post(`${base}/sys/user/changePassword`, params); };

//邀请别人加入团队-邮箱方式邀请
export const inviteUsersByEmails = params => { return axios.post(`${base}/sys/user/inviteUsersByEmails`, params); };

//邀请别人加入团队-手机号码方式邀请
export const inviteUsersByPhonenos = params => { return axios.post(`${base}/sys/user/inviteUsersByPhonenos`, params); }; 


//设置用户为机构管理员
export const setUsersToBranchAdm = params => { return axios.post(`${base}/sys/user/setUsersToBranchAdm`, params); };


//取消用户的机构管理员资格
export const setUsersUnBranchAdm = params => { return axios.post(`${base}/sys/user/setUsersUnBranchAdm`, params); }; 


//更新当前登录着的头像
export const editHeadimgurl = params => { return axios.post(`${base}/sys/user/editHeadimgurl`, params); }; 





