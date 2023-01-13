import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表

import config from '@/common/config'

let base = config.getCoreBasePath();

/**
 * xm_task
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'任务编号 主键',name:'任务名称',parentTaskid:'父任务编号',parentTaskname:'父任务名称',projectId:'项目编号',projectName:'项目名称',level:'任务级别',sortLevel:'排序级别',executorUserid:'任务执行人编号',executorUsername:'任务执行人',preTaskid:'前置任务编号',preTaskname:'前置任务名称',startTime:'任务开始时间',endTime:'任务结束时间',milestone:'里程碑',description:'任务描述',remarks:'备注',createUserid:'任务创建人编号',createUsername:'任务创建人',createTime:'创建时间',rate:'任务进度'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTask = params => { return axios.get(`${base}/xm/core/xmTask/list`, { params: params }); };

//模糊查询xm_task 条件之间or关系  
//export const listXmTaskKey = params => { return axios.get(`${base}/xm/core/xmTask/listKey`, { params: params }); };

//删除一条xm_task params={id:'任务编号 主键'}
export const delXmTask = params => { return axios.post(`${base}/xm/core/xmTask/del`,params); };

//批量删除xm_task  params=[{id:'任务编号 主键'}]
export const batchDelXmTask = params => { return axios.post(`${base}/xm/core/xmTask/batchDel`, params); };

//修改一条xm_task记录
export const editXmTask = params => { return axios.post(`${base}/xm/core/xmTask/edit`, params); };

//新增一条xm_task
export const addXmTask = params => { return axios.post(`${base}/xm/core/xmTask/add`, params); };

export const getTask = params => { return axios.get(`${base}/xm/core/xmTask/getTask`, { params: params }); };
export const getOutTask = params => { return axios.get(`${base}/xm/core/xmTask/getOutTask`, { params: params }); };

export const addTask = params => { return axios.post(`${base}/xm/core/xmTask/addTask`, params ); };

export const editRate = params => { return axios.post(`${base}/xm/core/xmTask/editProgress`, params); };


//批量删除xm_task  params=[{id:'任务编号 主键'}]
export const batchImportTaskFromTemplate = params => { return axios.post(`${base}/xm/core/xmTask/batchImportFromTemplate`, params); }; 


//批量删除xm_task  params=[{id:'任务编号 主键'}]
export const batchSaveBudget = params => { return axios.post(`${base}/xm/core/xmTask/batchSaveBudget`, params); }; 

export const batchRelTasksWithMenu = params => { return axios.post(`${base}/xm/core/xmTask/batchRelTasksWithMenu`, params); }; 

export const batchRelTasksWithPhase = params => { return axios.post(`${base}/xm/core/xmTask/batchRelTasksWithPhase`, params); }; 


export const setTaskCreateUser = params => { return axios.post(`${base}/xm/core/xmTask/setTaskCreateUser`, params); };

export const editTime = params => { return axios.post(`${base}/xm/core/xmTask/editTime`, params); };



export const calcProgress = params => { return axios.post(`${base}/xm/core/xmTask/calcProgress`, params); };


export const calcProjectProgress = params => { return axios.post(`${base}/xm/core/xmTask/calcProjectProgress`, params); };

export const batchChangeParentTask = params => { return axios.post(`${base}/xm/core/xmTask/batchChangeParentTask`, params); }; 


export const editXmTaskSomeFields = params => { return axios.post(`${base}/xm/core/xmTask/editSomeFields`, params); }; 




export const getXmTaskAttDist = params => { return axios.get(`${base}/xm/core/xmTask/getXmTaskAttDist`, { params: params }); };



export const getXmTaskAgeDist = params => { return axios.get(`${base}/xm/core/xmTask/getXmTaskAgeDist`, { params: params }); };
export const getXmTaskSort = params => { return axios.get(`${base}/xm/core/xmTask/getXmTaskSort`, { params: params }); };

//任务类型字典taskState,交易模式字典tranMode,能力要求字典capaLvl,保障要求字典supRequire,会员权益等级memInterestLvl

/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
    //任务类型字典taskState,交易模式字典tranMode,能力要求字典capaLvl,保障要求字典supRequire,会员权益等级memInterestLvl
    var itemCodes=['planType','taskType','priority','xmTaskSettleSchemel','taskState','bidStep','tranMode','capaLvl','supRequire','memInterestLvl','regionType','estate'];//在此添加要加载的字典 如['sex','grade','lvl']
    that.dicts['marketState']=[{id:'0',name:'关闭'},{id:'1',name:'待付款'},{id:'2',name:'已开通'},{id:'3',name:'已过期'}]
    if(itemCodes.length>0){
       initSimpleDicts('all',itemCodes).then(res=>{
        if(that.dicts){
            Object.assign(that.dicts,res.data.data)
        }else{
            that.dicts=res.data.data
        } 
       });
    }
   };

   export const  initSysDicts =async (that) => {
    //任务类型字典taskState,交易模式字典tranMode,能力要求字典capaLvl,保障要求字典supRequire,会员权益等级memInterestLvl
    var itemCodes=['crowd_task_market'];//在此添加要加载的字典 如['sex','grade','lvl']  
        var res=await initComplexDicts('sysParam',itemCodes); 
        Object.assign(that.dicts,res.data.data) 
        return res; 
   };

   export const logBrowseTimes=(taskId)=>{
    /**
   * 登记浏览量
   */
     var taskReadNumsStr=localStorage.getItem('task-read-nums')
     var date=new Date();
     var taskReadNums={ltime:date.getTime(),data:[]}
     if(taskReadNumsStr){
       taskReadNums=JSON.parse(taskReadNumsStr)
     }  
     taskReadNums.data.push({ taskId: taskId,nums:1 })
     localStorage.setItem('task-read-nums',JSON.stringify(taskReadNums));
     var ntime=date.getTime();
     if((ntime-taskReadNums.ltime)>=10*60*1000){
       localStorage.removeItem('task-read-nums');
       upBrowseTimes(taskReadNums.data);
      
     }
     //upBrowseTimes(taskReadNums.data);
}
export const formatTask = taskMsg => { 
    taskMsg.gradeId=taskMsg.capaLvls;
    taskMsg.creditId=taskMsg.creditId;
    taskMsg.guardId=taskMsg.supRequires;
    taskMsg.ilvlId=taskMsg.interestLvls;
    formatCreditLogo(taskMsg)
    formatGradeLogo(taskMsg)
    formatGuardLogo(taskMsg)
    formatInterestsLogo(taskMsg)
    taskMsg.skills = taskMsg.taskSkillNames ? taskMsg.taskSkillNames.split(',') : [];
};



export const formatAtRemark = at => {  
if(!at){
  return "请输入预算金额"
}
if(at<10000){
  return ""
}
if(at<10000){
  return "约 " +(at) +" 元"
}else if(at<1000000){
  return "约 " +(at/10000).toFixed(2)+" 万元"
}else if(at<1000000){
  return "约 " +(at/10000).toFixed(2)+" 万元"
}else if(at<1000000){
  return "约 " +(at/10000).toFixed(2)+" 万元"
}else if(at>=1000000){
  return "约 " +(at/1000000).toFixed(2)+" 百万元"
}
};


export const formatWorkloadRemark = workload => {   
if(!workload){
  return "请输入估工时"
}

if(workload<8){
  return ""
}
if(workload<1760){
  return "约 " +(workload/8).toFixed(1)+" 人天 (1人天=8人时)"
}else if(workload<1760*12){
  return "约 " +(workload/(1760)).toFixed(1)+" 人月 (1人月=22人天)"
}else if(workload>=1760*12){
  return "约 " +(workload/1760*12).toFixed(2)+" 人年 (1人年=12人月)"
}

};

//更新任务的某些字段
export const editSomeFieldsTask = params => {
  return axios.post(`${base}/xm/core/xmTask/editSomeFields`, params);
};

export const getTaskState= task => {
  let obj = {
    type: '',
    state: '',
    desc: '',
  };
  if (task.bidStep == '0') {
    obj = {
      type: 'info',
      state: '草稿',
      desc: '仅自己可见可编辑',
    };
    return obj;
  } else if (task.bidStep == '1') {
    obj = {
      type: 'info',
      state: '发布需求',
      desc: '服务商可以搜素，但不可以投标。',
    };
    return obj;
  } else if (task.bidStep == '2') {
    obj = {
      type: 'warning',
      state: '投标进行中',
      desc: '投标截止时间：'+((task.bidEtime ? task.bidEtime.slice(0,10) : '')||'未设置'),
    };
    return obj;
  } else if (task.bidStep == '3') {
    obj = {
      type: 'warning',
      state: '待选标',
      desc: '投标截止时间：'+((task.bidEtime ? task.bidEtime.slice(0,10) : '')||'未设置'),
    };
    return obj;
  } else if (task.bidStep == '4') {
    obj = {
      type: 'warning',
      state: '托管赏金',
      desc: '甲方将任务赏金拓管到平台',
    };
    return obj;
  } else if (task.bidStep == '5') {
    obj = {
      type: 'danger',
      state: '工作中',
      desc: '服务商工作中',
    };
    return obj;
  } else if (task.bidStep == '6') {
    obj = {
      type: 'success',
      state: '确认验收',
      desc: '甲方确认验收完毕，付款完毕',
    };
    return obj;
  } else if (task.bidStep == '7') {
    obj = {
      type: 'success',
      state: '确认验收',
      desc: '甲方确认验收完毕，付款完毕',
    };
    return obj;
  } else {
    obj = {
      type: 'danger',
      state: '未知',
      desc: '无法获取任务状态',
    };
    return obj;
  } 
};







