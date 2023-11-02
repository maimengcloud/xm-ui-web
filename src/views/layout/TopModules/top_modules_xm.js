import mdpCfg from "@/api/mdp_pub/mdp_config"
var categorys= 
[  
      {
        moduleName:"项目",
        moduleId:'maim-project',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/xm/"+process.env.VERSION+"/#/xm/core/xmProject/XmProjectMng",   
        icon: require("@/assets/image/platform/module-project.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"测试 ",
        moduleId:'maim-testhub',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/xm/"+process.env.VERSION+"/#/xm/core/xmQuestion/XmQuestionMng",  
        icon: require("@/assets/image/platform/module-customerCenter.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"产品",
        moduleId:'maim-plan',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/xm/"+process.env.VERSION+"/#/xm/core/xmProduct/XmProductAllMng", 
        icon: require("@/assets/image/platform/module-intelligentForms.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"效能",
        moduleId:'maim-performance',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/xm/"+process.env.VERSION+"/#/xm/core/xmProjectState/XmProjectStateMng", 
        icon: require("@/assets/image/platform/module-cost.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      }, {
        moduleName:"组织",
        moduleId:'maim-org',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/"+mdpCfg.getSysContext()+"/"+process.env.VERSION+"/#/mdp/sys/dept/DeptMng", 
        icon: require("@/assets/image/platform/module-organization.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },{
        moduleName:"众包",
        moduleId:'maim-crowd',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/", 
        icon: require("@/assets/image/platform/module-task.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },  
      {
        moduleName:"日程",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-rc',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/rc/rcSchedule/RcScheduleMng",
        icon: require("@/assets/image/platform/module-schedule.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
       
      {
        moduleName:"会议",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-meet',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/meet/meetMeeting/MeetMeetingMng",
        icon: require("@/assets/image/platform/module-meeting.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      }, 
      {
        moduleName:"合同",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-ht',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/ht/contractCard/ContractCardMng",
        icon: require("@/assets/image/platform/module-contract.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      
      {
        moduleName:"财务",
        topModuleId:'ac',
        moduleId:'oa-finance',  
        sysLink:"/ac/"+process.env.VERSION+"/",
        icon: require("@/assets/image/platform/module-finance.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },  
      {
        moduleName:"wiki",
        topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
        moduleId:'arc-knowledge',  
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/knowledge/KnowledgeMng",
        icon: require("@/assets/image/platform/module-performance.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },  
]
export default categorys;