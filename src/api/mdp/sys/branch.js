import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 管理端机构表（机构下面若干部门）
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'机构编号 主键',branchName:'机构名称',enabled:'是否可用',industryCategory:'行业分类',cuserid:'创建人编号-可以转让,创建人与机构管理员有同样的权限',cdate:'创建日期',cusername:'创建人姓名-可以转让',lphoneNo:'联系电话',emaill:'邮件',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态',pbranchId:'上级机构',admUserid:'管理员编号（==机构编号，不允许修改，即机构主账户）',admUsername:'管理员名称（==机构名称+'管理员'，不允许修改）',lusername:'联系人姓名',luserid:'联系人编号',address:'公司地址',btype:'机构类别0-个人虚拟机构，1-实体机构，个人虚拟机构的话sys_branch表没有真正的机构数据',imgUrl:'企业头像',bcode:'税号-统一信用识别号',blicense:'营业执照图片',legalPerson:'法人名称',regCapital:'注册资本',remark:'企业简介',validLvls:'人工验证结果，当审核状态为2时，同步到sys_user表同一个字段，或者sys_branch同一个字段'}
 **/
 
//普通查询 条件之间and关系  
export const listBranch = params => { return axios.get(`${base}/mdp/sys/branch/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryBranchById = params => { return axios.get(`${base}/mdp/sys/branch/queryById`, { params: params }); };

//删除一条管理端机构表（机构下面若干部门） params={id:'机构编号 主键'}
export const delBranch = params => { return axios.post(`${base}/mdp/sys/branch/del`,params); };

//批量删除管理端机构表（机构下面若干部门）  params=[{id:'机构编号 主键'}]
export const batchAddBranch = params => { return axios.post(`${base}/mdp/sys/branch/batchAdd`, params); };

//批量删除管理端机构表（机构下面若干部门）  params=[{id:'机构编号 主键'}]
export const batchDelBranch = params => { return axios.post(`${base}/mdp/sys/branch/batchDel`, params); };

//修改一条管理端机构表（机构下面若干部门）记录
export const editBranch = params => { return axios.post(`${base}/mdp/sys/branch/edit`, params); };

//新增一条管理端机构表（机构下面若干部门）
export const addBranch = params => { return axios.post(`${base}/mdp/sys/branch/add`, params); };

//批量修改某些字段
export const editSomeFieldsBranch = params => { return axios.post(`${base}/mdp/sys/branch/editSomeFields`, params); };



export const initUserCountPieChart=(that)=>{
    var chartDom = document.getElementById('userCountPieChart');
    var myChart = that.$echarts.init(chartDom);
    var option;
    var branchInterestsDetail = that.branchInterestsDetail;
    if(!branchInterestsDetail){
        branchInterestsDetail={
            currUsers:1,
            maxUsers:10
        }
    }
    var currUsers= parseInt(branchInterestsDetail.currUsers)
    var maxUsers=parseInt(branchInterestsDetail.maxUsers);
    var syUsers=maxUsers-currUsers;
    if(syUsers<0){
        syUsers=0
    }
    option = { 
        title: {
            text:  currUsers+"/"+ maxUsers,
            left: "center",
            top: "50%",
            textStyle: {
                textAlign: "center",
                fill: "#333",
                fontSize: 14,
                fontWeight: 200,
            }
        },
        graphic: {
            type: "text",
            left: "center",
            top: "40%",
            style: {
                text: "剩余"+syUsers,
                textAlign: "center",
                fill: "#333",
                fontSize: 10,
            }
        }, 
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
        name: '账户数量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
            show: false,
            position: 'center'
        },
        emphasis: {
            label: {
            show: false,
            fontSize: '40',
            fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        data: [
            { value: currUsers , name: '已使用' },
            { value: syUsers , name: '未使用' }, 
        ]
        }
    ]
    };

    option && myChart.setOption(option);
};


export const initProductCountPieChart=(that)=>{
    var chartDom = document.getElementById('productCountPieChart');
    var myChart = that.$echarts.init(chartDom);
    var option;
    var calcBranchModule=that.calcBranchModule
    
    var allModules=calcBranchModule.allModules
    var freeModules=calcBranchModule.freeModules
    var hadModules=calcBranchModule.hadModules 
    var yktModules=hadModules+freeModules
    var syModules=allModules-freeModules-hadModules
    option = { 
        title: {
            text:  yktModules + " / "+allModules,
            left: "center",
            top: "50%",
            textStyle: {
                textAlign: "center",
                fill: "#333",
                fontSize: 18,
                fontWeight: 200,
            }
        },
        graphic: {
            type: "text",
            left: "center",
            top: "40%",
            style: {
                text: "未开通"+syModules,
                textAlign: "center",
                fill: "#333",
                fontSize: 10,
            }
        }, 
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
        name: '产品数量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
            show: false,
            position: 'center'
        },
        emphasis: {
            label: {
            show: false,
            fontSize: '40',
            fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        data: [
            { value: freeModules, name: '已免费开通' },
            { value: hadModules, name: '已付费开通' },
            { value: syModules, name: '未开通' },  
        ]
        }
    ]
    };

    option && myChart.setOption(option);
};


export const initEndTimePieChart=(that)=>{
    var chartDom = document.getElementById('endTimePieChart');
    var myChart = that.$echarts.init(chartDom);
    var option;
    var branchInterestsDetail=that.branchInterestsDetail;
    option = { 
        title: {
            text: branchInterestsDetail.maxRtime||"永久有效",
            left: "center",
            top: "45%",
            textStyle: {
                textAlign: "center",
                fill: "#ee6666",
                fontSize: 14,
                fontWeight: 200,
            }
        }, 
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
        name: '有效期',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
            show: false,
            position: 'center'
        },
        emphasis: {
            label: {
            show: false,
            fontSize: '40',
            fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        data: [ 
            { value: 0, name: '有效期' }, 
        ]
        }
    ]
    };

    option && myChart.setOption(option);
};