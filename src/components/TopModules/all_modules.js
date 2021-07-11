var categorys= 
[
  {
    title:"日常应用",
    childrens:[
    {
      moduleName:"任务中心",
      topModuleId:'oa',
      link:"/mdp/workflow/ru/task/TaskListAssigneeToMe",
      icon: require("../../assets/image/platform/module-task.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"流程中心",
      topModuleId:'oa',
      link:"/mdp/workflow/ru/execution/ExecutionListMyMonitors",
      icon: require("../../assets/image/platform/module-flow.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"历史流程",
      topModuleId:'oa',
      link:"/mdp/workflow/hi/procinst/ProcinstListMyStart",
      icon: require("../../assets/image/platform/module-historical.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"模型中心",
      topModuleId:'oa',
      link:"/mdp/workflow/de/ModelMng",
      icon: require("../../assets/image/platform/module-odelCenter.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"智能表单",
      topModuleId:'oa',
      link:"/mdp/form/formDef/FormDefAdd",
      icon: require("../../assets/image/platform/module-intelligentForms.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"新闻管理",
      topModuleId:'arc',
      link:"/mdp/arc/news/newsMng",
      icon: require("../../assets/image/platform/module-news.png"),
      isHighlight:false,
      moduleType : '3', // 模块类型，1-系统类模块 2-系统外模块 3-系统外模块的模块
    },
    {
      moduleName:"公告管理",
      topModuleId:'arc',
      link:"/mdp/arc/notice/noticeMng",
      icon: require("../../assets/image/platform/module-notice.png"),
      isHighlight:false,
      moduleType : '3' // 模块类型，1-系统类模块 2-系统外模块 3-系统外模块的模块
    },
    ]
  },
  {
    title:"通讯沟通",
    childrens:[
      {
        moduleName:"通讯录",
        topModuleId:'sys',
        link:"/mdp/sys/user/deptUserMng",
        icon: require("../../assets/image/platform/module-addressBook.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"内部邮件",
        topModuleId:'oa',
        link:"/oa/mail/mailEmail/MailEmailInbox",
        icon: require("../../assets/image/platform/module-email1.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"外部邮件",
        topModuleId:'oa',
        link:"/oa/mail/mailAccount/MailAccountMng",
        icon: require("../../assets/image/platform/module-email2.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"短信",
        topModuleId:'sms',
        link:"",
        icon: require("../../assets/image/platform/module-note.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"聊天",
        topModuleId:'im',
        link:"",
        icon: require("../../assets/image/platform/module-project.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
    ]
  },
  {
    title:"工作执行",
    childrens:[
      {
        moduleName:"日程管理",
        topModuleId:'oa',
        link:"/oa/rc/rcScheduleMy/RcScheduleMyMng",
        icon: require("../../assets/image/platform/module-schedule.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"督办管理",
        topModuleId:'oa',
        link:"/oa/duban/dubanItem/DubanItem",
        icon: require("../../assets/image/platform/module-supervise.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"督办任务",
        topModuleId:'oa',
        link:"/oa/duban/dubanItemTask/HostDubanItemTask",
        icon: require("../../assets/image/platform/module-supervisoryTask.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
    ]
  },
  {
    title:"行政管理",
    childrens:[
      {
        moduleName:"组织",
        topModuleId:'sys',
        link:"/mdp/sys/dept/DeptMng",
        icon: require("../../assets/image/platform/module-organization.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"资产管理",
        topModuleId:'oa',
        link:"/oa/erp/pur/require/RequireMng",
        icon: require("../../assets/image/platform/module-property.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"会议管理",
        topModuleId:'oa',
        link:"/oa/meet/meetMeeting/MeetMeetingRequire",
        icon: require("../../assets/image/platform/module-meeting.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"印章中心",
        topModuleId:'oa',
        link:"/oa/sig/sigSignet/SigSignetMng",
        icon: require("../../assets/image/platform/module-sealCenter.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"车辆中心",
        topModuleId:'oa',
        link:"/oa/car/carOfficeCar/CarOfficeCarMng",
        icon: require("../../assets/image/platform/module-car.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"办公用品",
        topModuleId:'oa',
        link:"/oa/om/omCategory/OmCategoryMng",
        icon: require("../../assets/image/platform/module-office.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      
    ]
  },
  {
    title:"人事管理",
    childrens:[
      {
        moduleName:"考勤管理",
        topModuleId:'oa',
        link:"/oa/kq/attendance/AttendanceMonth",
        icon: require("../../assets/image/platform/module-attendance.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"绩效考核",
        topModuleId:'oa',
        link:"/oa/jx/MyAssessment",
        icon: require("../../assets/image/platform/module-performance.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"档案信息",
        topModuleId:'oa',
        link:"/oa/hr/user/employeeInfo",
        icon: require("../../assets/image/platform/module-record.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
    ]
  },
  {
    title:"仓储管理",
    childrens:[
      {
        moduleName:"合同管理",
        topModuleId:'oa',
        link:"/oa/ht/contractCard/ContractCardMng",
        icon: require("../../assets/image/platform/module-contract.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      }
    ]
  },
  {
    title:"业务管控",
    childrens:[
      {
        moduleName:"业务中心",
        topModuleId:'oa',
        link:"/mdp/workflow/re/procdef/ProcdefListForParames",
        icon: require("../../assets/image/platform/module-business.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"客户管理",
        topModuleId:'oa',
        link:"/oa/crm/customer/CustomerIndex",
        icon: require("../../assets/image/platform/module-customerCenter.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"项目管理",
        topModuleId:'xm',
        link:"/xm/core/xmProject/XmProjectMng",
        icon: require("../../assets/image/platform/module-project.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"费用管理",
        topModuleId:'ac',
        link:"",
        icon: require("../../assets/image/platform/module-cost.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      }, 
      {
        moduleName:"防伪",
        topModuleId:'audit',
        link:"/audit/base/productLifeCycle/productLifeCycleDetail/Safeguard",
        icon: require("../../assets/image/platform/anti-fake.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },{
        moduleName:"溯源",
        topModuleId:'audit',
        link:"/audit/base/productLifeCycle/productLifeCycleDetail/ProductLifeCycleDetailMng",
        icon: require("../../assets/image/platform/traceSource.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },{
        moduleName:"审计",
        topModuleId:'audit',
        link:"/audit/base/oper/operLog/OperLogMng",
        icon: require("../../assets/image/platform/audit.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },

    ]
  },
  {
    title:"系统模块",
    childrens:[
      {
        moduleName:"组织",
        topModuleId:'sys',
        link:"",
        icon: require("../../assets/image/platform/module-organization.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"内容",
        topModuleId:'arc',
        link:"",
        icon: require("../../assets/image/platform/module-content.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"流程",
        topModuleId:'oa',
        link:"",
        icon: require("../../assets/image/platform/module-oa.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"商城",
        topModuleId:'mallm',
        link:"",
        icon: require("../../assets/image/platform/module-store.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      } ,
      {
        moduleName:"营销",
        topModuleId:'mk',
        link:"",
        icon: require("../../assets/image/platform/module-marketing.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"财务",
        topModuleId:'ac',
        link:"",
        icon: require("../../assets/image/platform/module-finance.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"短信",
        topModuleId:'',
        link:"sms",
        icon: require("../../assets/image/platform/module-note.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"聊天",
        topModuleId:'im',
        link:"",
        icon: require("../../assets/image/platform/module-project.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"防伪",
        topModuleId:'audit',
        link:"/audit/base/productLifeCycle/productLifeCycleDetail/Safeguard",
        icon: require("../../assets/image/platform/anti-fake.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },{
        moduleName:"溯源",
        topModuleId:'audit',
        link:"/audit/base/productLifeCycle/productLifeCycleDetail/ProductLifeCycleDetailMng",
        icon: require("../../assets/image/platform/traceSource.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },{
        moduleName:"审计",
        topModuleId:'audit',
        link:"/audit/base/oper/operLog/OperLogMng",
        icon: require("../../assets/image/platform/audit.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      
    ]
  },
  
]
export default categorys;