import axios from '@/utils/request'

import config from '@/common/config'
import { CodeToText, TextToCode } from 'element-china-area-data';

let base=config.getSysBasePath();

/**
 * 用户表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={userid:'内部用户编号 主键',unionid:'全局唯一编号',displayUserid:'登录展示使用用户编号',locked:'是否被锁定0否1是',startdate:'启用日期',nickname:'昵称',username:'用户名称',phoneno:'移动电话号码',password:'密码',salt:'盐值',fgOne:'指纹1',fgTwo:'指纹2',fgThr:'指纹3',idCardNo:'身份证号码',pwdtype:'密码类型1指纹2密码',headimgurl:'头像地址',country:'国家',city:'城市',province:'省份',address:'详细地址',sex:'性别',enddate:'到期日期',districtId:'区县编号',email:'邮箱',userId:'user_id',userAccount:'user_account',userPwd:'user_pwd',userName:'user_name',userDesc:'user_desc'}
 **/

//普通查询 条件之间and关系
export const listUser = params => { return axios.get(`${base}/mdp/sys/user/list`, { params: params }); };

//免登录查询用户数据
export const listCrowdUser = params => { return axios.get(`${base}/mdp/sys/user/crowd/list`, { params: params }); };

//查询用户详情
export const detailNoauthUser = params => { return axios.get(`${base}/mdp/sys/user/noauth/detail`, { params: params }); };
export const listUserNames = params => { return axios.get(`${base}/mdp/sys/user/listUserNames`, { params: params }); };
export const  selectlistKey= params => { return axios.get(`${base}/mdp/sys/user/selectlistKey`, { params: params }); };

//模糊查询用户表 条件之间or关系
//export const listUserKey = params => { return axios.get(`${base}/mdp/sys/user/listKey`, { params: params }); };

export const addUser = params => { return axios.post(`${base}/mdp/sys/user/add`,params); };

//删除一条用户表 params={userid:'内部用户编号 主键'}
export const delUser = params => { return axios.post(`${base}/mdp/sys/user/del`,params); };

//批量删除用户表  params=[{userid:'内部用户编号 主键'}]
export const batchDelUser = params => { return axios.post(`${base}/mdp/sys/user/batchDel`, params); };

//修改一条用户表记录
export const editUser = params => { return axios.post(`${base}/mdp/sys/user/edit`, params); };


//修改某个字段
export const editSomeFieldsUser  = params => { return axios.post(`${base}/mdp/sys/user/editSomeFields`, params); };

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

export const formatGradeLogo = item => {
  if (item.gradeId == '2') {
    item.gradeName = '学士';
    item.gradeLogo = require('../../../../static/images/ability-level2.png');
  } else if (item.gradeId == '3') {
    item.gradeName = '进士';
    item.gradeLogo = require('../../../../static/images/ability-level3.png');
  } else if (item.gradeId == '4') {
    item.gradeName = '大师';
    item.gradeLogo = require('../../../../static/images/ability-level4.png');
  } else if (item.gradeId == '5') {
    item.gradeName = '宗师';
    item.gradeLogo = require('../../../../static/images/ability-level5.png');
  } else if (item.gradeId == '6') {
    item.gradeName = '天师';
    item.gradeLogo = require('../../../../static/images/ability-level6.png');
  } else if (item.gradeId == '7') {
    item.gradeName = '神师';
    item.gradeLogo = require('../../../../static/images/ability-level7.png');
  }else {
    item.gradeName = '学徒';
    item.gradeLogo = require('../../../../static/images/ability-level1.png');
  }
  return item
}

export const formatInterestsLogo = item => {
  
  if (item.ilvlId == '2') {
    item.ilvlName = '青铜会员';
    item.ilvlLogo = require('../../../../static/images/mem-level1.png');
  } else if (item.ilvlId == '3') {
    item.ilvlName = '白银会员';
    item.ilvlLogo = require('../../../../static/images/mem-level2.png');
  } else if (item.ilvlId == '4') {
    item.ilvlName = '黄金会员';
    item.ilvlLogo = require('../../../../static/images/mem-level3.png');
  } else if (item.ilvlId == '5') {
    item.ilvlName = '紫金会员';
    item.ilvlLogo = require('../../../../static/images/mem-level4.png');
  } else if (item.ilvlId == '6') {
    item.ilvlName = '皇冠会员';
    item.ilvlLogo = require('../../../../static/images/mem-level5.png');
  } else {
    item.ilvlId = '1';
    item.ilvlName = '普通会员';
    item.ilvlLogo = require('../../../../static/images/mem-level6.png');
  }
  return item
}

export const formatGuardLogo = item => {
  if (item.guardId == '3') {
    item.guardName = '金牌三保用户';
    item.guardLogo = require('../../../../static/images/is-gua.png');
  } else if (item.guardId == '2') {
    item.guardName = '银牌三保用户';
    item.guardLogo = require('../../../../static/images/is-gua.png');
  } else if (item.guardId == '1') {
    item.guardName = '铜牌三保用户';
    item.guardLogo = require('../../../../static/images/is-gua.png');
  } else {
    item.guardName = '非三保用户';
    item.guardLogo = require('../../../../static/images/not-gua.png');
  }
  return item
}
export const formatCreditLogo = item => {
  if (item.creditId == 'D') {
    item.creditName = 'D级信用';
    item.creditLogo = require('../../../../static/images/credit-level7.png');
  } else if (item.creditId == 'C') {
    item.creditName = 'C级信用';
    item.creditLogo = require('../../../../static/images/credit-level6.png');
  } else if (item.creditId == 'B') {
    item.creditName = 'B级信用';
    item.creditLogo = require('../../../../static/images/credit-level5.png');
  } else if (item.creditId == 'A') {
    item.creditName = 'A级信用';
    item.creditLogo = require('../../../../static/images/credit-level4.png');
  } else if (item.creditId == 'S') {
    item.creditName = 'S级信用';
    item.creditLogo = require('../../../../static/images/credit-level3.png');
  } else if (item.creditId == 'SS') {
    item.creditName = 'SS级信用';
    item.creditLogo = require('../../../../static/images/credit-level2.png');
  } else if (item.creditId == 'SSS') {
    item.creditName = 'SSS级信用';
    item.creditLogo = require('../../../../static/images/credit-level1.png');
  } else {
    item.creditId = 'D';
    item.creditName = 'D级信用';
    item.creditLogo = require('../../../../static/images/credit-level7.png');
  }
  return item;
}
export const formatUser = item => {
    item.province = item.province ? CodeToText[item.province] : '';
    item.city = item.city ? CodeToText[item.city] : '';  
    formatGuardLogo(item);
    formatGradeLogo(item);
    formatInterestsLogo(item);
    formatCreditLogo(item);
    return item
    
}


