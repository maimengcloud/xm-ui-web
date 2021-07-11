var topModules=
[
    {
      moduleName:"待审批",
      topModuleId:'oa',
      link:"/mdp/workflow/ru/task/TaskListAssigneeToMe",
      icon: require("../../assets/image/platform/module-task.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"日程",
      topModuleId:'oa',
      link:"/oa/rc/rcScheduleMy/RcScheduleMyMng",
      icon: require("../../assets/image/platform/module-schedule.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"会议",
      topModuleId:'oa',
      link:"/oa/meet/meetMeeting/MeetMeetingRequire",
      icon: require("../../assets/image/platform/module-meeting.png"),
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
    {
      moduleName:"档案",
      topModuleId:'oa',
      link:"/oa/hr/user/employeeInfo",
      icon: require("../../assets/image/platform/module-record.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"通讯录",
      topModuleId:'sys',
      link:"/mdp/sys/user/deptUserMng",
      icon: require("../../assets/image/platform/module-addressBook.png"),
      isHighlight:false,
      moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"合同",
      topModuleId:'oa',
      link:"/oa/ht/contractCard/ContractCardMng",
      icon: require("../../assets/image/platform/module-contract.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
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
      moduleName:"项目",
      topModuleId:'xm',
      link:"/xm/core/xmProject/XmProjectMng",
      icon: require("../../assets/image/platform/module-project.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"资产",
      topModuleId:'oa',
      link:"/oa/erp/pur/require/RequireMng",
      icon: require("../../assets/image/platform/module-property.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
]

export default topModules