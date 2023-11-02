import mdpCfg from "@/api/mdp_pub/mdp_config"
var categorys= 
[ 
  {
    moduleName:"唛盟项目管理系统",
    moduleId:'maim',  
    icon: require("@/assets/image/platform/module-maim.png"),
    sysLink:"/xm/"+process.env.VERSION+"/",
    topModuleId:'maim',isOpenSource:true,
    childrens:[
      {
        moduleName:"项目管理",
        moduleId:'maim-project',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/xm/"+process.env.VERSION+"/#/xm/core/xmProject/XmProjectMng",   
        icon: require("@/assets/image/platform/module-project.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"测试管理 ",
        moduleId:'maim-testhub',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/xm/"+process.env.VERSION+"/#/xm/core/xmQuestion/XmQuestionMng",  
        icon: require("@/assets/image/platform/module-customerCenter.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"产品规划",
        moduleId:'maim-plan',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/xm/"+process.env.VERSION+"/#/xm/core/xmProduct/XmProductAllMng", 
        icon: require("@/assets/image/platform/module-intelligentForms.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"效能管理",
        moduleId:'maim-performance',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/xm/"+process.env.VERSION+"/#/xm/core/xmProjectState/XmProjectStateMng", 
        icon: require("@/assets/image/platform/module-cost.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      }, 
      {
        moduleName:"流水线",
        moduleId:'maim-pipeline',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/xm/"+process.env.VERSION+"/#/mdp/workflow/ru/task/TaskListAssigneeToMe", 
        icon: require("@/assets/image/platform/module-trace.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },{
        moduleName:"组织架构",
        moduleId:'maim-org',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/"+mdpCfg.getSysContext()+"/"+process.env.VERSION+"/#/mdp/sys/dept/DeptMng", 
        icon: require("@/assets/image/platform/module-organization.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },{
        moduleName:"知识库",
        moduleId:'maim-wiki',
        topModuleId:'maim',isOpenSource:true,
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/mate/archive/ArchiveMng",
        icon: require("@/assets/image/platform/module-performance.png"), 
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

    ]
  },
  {
    moduleName:"智慧协同办公系统",
    moduleId:'oa',  
    sysLink:"/oa/"+process.env.VERSION+"/",
    icon: require("@/assets/image/platform/module-oa.png"),
    topModuleId:'oa',isOpenSource:true,
    childrens:[
      {
        moduleName:"日程管理",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-rc',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/rc/rcSchedule/RcScheduleMng",
        icon: require("@/assets/image/platform/module-schedule.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      
      {
        moduleName:"督办管理",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-duban',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/duban/dubanItem/DutyDubanItem",
        icon: require("@/assets/image/platform/module-supervise.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      }, 
      
      /**
      {
        moduleName:"组织",
        topModuleId:mdpCfg.getSysContext(),
        moduleId:'oa-org',  
        sysLink:"/mdp/sys/dept/DeptMng",
        icon: require("@/assets/image/platform/module-organization.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
       */
      {
        moduleName:"资产管理",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-assets',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/erp/ass/assetDispose/assetDisposeMng",
        icon: require("@/assets/image/platform/module-property.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"会议管理",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-meet',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/meet/meetMeeting/MeetMeetingMng",
        icon: require("@/assets/image/platform/module-meeting.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"印章中心",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-sig',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/sig/sigSignet/SigSignetMng",
        icon: require("@/assets/image/platform/module-sealCenter.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"车辆中心",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-car',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/car/components/watch",
        icon: require("@/assets/image/platform/module-car.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"办公用品",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-om',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/om/omAppliance/OmApplianceMng",
        icon: require("@/assets/image/platform/module-office.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      }, 
      
      {
        moduleName:"合同管理",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-ht',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/ht/contractCard/ContractCardMng",
        icon: require("@/assets/image/platform/module-contract.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      /** 归入财务，不单独显示
      {
        moduleName:"费用管理",
        topModuleId:'ac',
        moduleId:'oa-cost',  
        sysLink:"/ac/"+process.env.VERSION+"/#/ac/cost/cost/require/RequireMng",
        icon: require("@/assets/image/platform/module-cost.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      }, 
       */
      {
        moduleName:"考勤管理",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-kq',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/kq/attendance/AttendanceMonth",
        icon: require("@/assets/image/platform/module-attendance.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"绩效考核",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-jx',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/jx/AssesssSatistical",
        icon: require("@/assets/image/platform/module-performance.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"档案信息",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-hr',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/hr/user/employeeInfo",
        icon: require("@/assets/image/platform/module-record.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"客户管理",
        topModuleId:'oa',isOpenSource:true,
        moduleId:'oa-crm',  
        sysLink:"/oa/"+process.env.VERSION+"/#/oa/crm/customer/CustomerIndex",
        icon: require("@/assets/image/platform/module-customerCenter.png"),
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
    ]
  },
  {
    moduleName:"内容管理与发布系统",
    moduleId:mdpCfg.getArcContext(),  
    icon: require("@/assets/image/platform/module-arc.png"),
    sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/",
    topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
    childrens:[
      {
        moduleName:"图片库",
        topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
        moduleId:'arc-image',  
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/mate/image/ImageMng",
        icon: require("@/assets/image/platform/module-image.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"视频库",
        topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
        moduleId:'arc-video',  
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/mate/image/MovieMng",
        icon: require("@/assets/image/platform/module-video.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"文章库",
        topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
        moduleId:'arc-image',  
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/mate/archive/ArchiveMng",
        icon: require("@/assets/image/platform/module-performance.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"知识库",
        topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
        moduleId:'arc-knowledge',  
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/knowledge/KnowledgeMng",
        icon: require("@/assets/image/platform/module-performance.png"),
        isHighlight:false,
        moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"新闻中心",
        topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
        moduleId:'arc-news',  
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/news/newsMng",
        icon: require("@/assets/image/platform/module-news.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"公告中心",
        topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
        moduleId:'arc-notice',  
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/platformnotice/NoticeMng",
        icon: require("@/assets/image/platform/module-note.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"帮助中心",
        topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
        moduleId:'arc-help',  
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/knowledge/KnowledgeMng",
        icon: require("@/assets/image/platform/module-help.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"公文中心",
        topModuleId:mdpCfg.getArcContext(),isOpenSource:true,
        moduleId:'arc-doc',  
        sysLink:"/"+mdpCfg.getArcContext()+"/"+process.env.VERSION+"/#/mdp/arc/doc/documentCentre",
        icon: require("@/assets/image/platform/module-performance.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
    ]
  },
  {
    moduleName:"电商定制系统",
    moduleId:'mall',   
    sysLink:"/mallm/"+process.env.VERSION+"/",
    icon: require("@/assets/image/platform/module-mall.png"),
    topModuleId:'mall',isOpenSource:true,
    childrens:[
      
      {
        moduleName:"商城",
        topModuleId:'mall-shop',isOpenSource:true,
        moduleId:'mall',  
        sysLink:"/mallm/"+process.env.VERSION+"/",
        icon: require("@/assets/image/platform/module-store.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
      {
        moduleName:"营销",
        topModuleId:'mk',isOpenSource:true,
        moduleId:'mk',  
        sysLink:"/mk/"+process.env.VERSION+"/",
        icon: require("@/assets/image/platform/module-marketing.png"),
        isHighlight:false,
        moduleType : '2' // 模块类型，1-系统类模块 2-系统外模块
      },
    ]
  },
  {
    moduleName:"智能低代码开发平台",  
    moduleId:'mdp',  
    sysLink:"/gitlab/qqkj/mmcloud/mdp/mdp-products/mdp-lcode/mdp-lcode-ui-web",
    icon: require("@/assets/image/platform/module-mdp.png"),
    topModuleId:'mdp',isOpenSource:true,
    childrens:[ 
    {
      moduleName:"代码生成",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-dev',  
      sysLink:"/gitlab/qqkj/dev/mdp-code-generator",
      icon: require("@/assets/image/platform/module-code.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"微服务",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-micro',  
      sysLink:"/gitlab/qqkj/mmcloud/mdp/mdp-products/mdp-cloud",
      icon: require("@/assets/image/platform/module-historical.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    }, 
    {
      moduleName:"核心组件",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-core',  
      sysLink:"/gitlab/qqkj/mmcloud/mdp/mdp-core",
      icon: require("@/assets/image/platform/module-news.png"),
      isHighlight:false,
      moduleType : '3', // 模块类型，1-系统类模块 2-系统外模块 3-系统外模块的模块
    },
    {
      moduleName:"角色权限",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-qx',  
      sysLink:"/"+mdpCfg.getSysContext()+"/"+process.env.VERSION+"/#/mdp/sys/role/index",
      icon: require("@/assets/image/platform/anti-fake.png"),
      isHighlight:false,
      moduleType : '3' // 模块类型，1-系统类模块 2-系统外模块 3-系统外模块的模块
    },
    {
      moduleName:"元数据组件",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-meta',  
      sysLink:"/"+mdpCfg.getSysContext()+"/"+process.env.VERSION+"/#/mdp/meta/item/index",
      icon: require("@/assets/image/platform/module-historical.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"菜单管理",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-safe',  
      sysLink:"/"+mdpCfg.getSysContext()+"/"+process.env.VERSION+"/#/mdp/menu/index",
      icon: require("@/assets/image/platform/anti-fake.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"平台配置",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-plat',  
      sysLink:"/"+mdpCfg.getSysContext()+"/"+process.env.VERSION+"/#/mdp/plat/platform/PlatformMng",
      icon: require("@/assets/image/platform/module-intelligentForms.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"短信组件",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-sms',  
      sysLink:"/sms/"+process.env.VERSION+"/",
      icon: require("@/assets/image/platform/module-note.png"),
      isHighlight:false,
      moduleType : '3', // 模块类型，1-系统类模块 2-系统外模块 3-系统外模块的模块
    },
    {
      moduleName:"邮件组件",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-email',  
      sysLink:"/oa/"+process.env.VERSION+"/#/oa/mail/outMailEmail/MailEmailInbox",
      icon: require("@/assets/image/platform/module-email2.png"),
      isHighlight:false,
      moduleType : '3' // 模块类型，1-系统类模块 2-系统外模块 3-系统外模块的模块
    },
    {
      moduleName:"消息队列",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-mq',  
      sysLink:"/gitlab/qqkj/mmcloud/mdp/mdp-core",
      icon: require("@/assets/image/platform/module-notice.png"),
      isHighlight:false,
      moduleType : '3' // 模块类型，1-系统类模块 2-系统外模块 3-系统外模块的模块
    },
    {
      moduleName:"即时通讯",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-im',  
      sysLink:"/im/"+process.env.VERSION+"/",
      icon: require("@/assets/image/platform/module-notice.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"审计组件",
      topModuleId:'mdp',isOpenSource:true,
      moduleId:'mdp-audit',  
      sysLink:"/gitlab/qqkj/mmcloud/mdp/mdp-products/mdp-audit",
      icon: require("@/assets/image/platform/audit.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"工作流",
      moduleId:"mdp-workflow",
      topModuleId:'mdp',isOpenSource:true,
      sysLink:"/gitlab/qqkj/mmcloud/mdp/mdp-products/mdp-workflow",
      icon: require("@/assets/image/platform/module-flow.png"),
      isHighlight:false,
      moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
    },
    {
      moduleName:"第三方",
      moduleId:"mdp-tpa",
      topModuleId:'mdp',isOpenSource:true,
      sysLink:"/gitlab/qqkj/mmcloud/mdp/mdp-products/mdp-tpa",
      icon: require("@/assets/image/platform/module-note.png"),
      isHighlight:false,
      moduleType : '3', // 模块类型，1-系统类模块 2-系统外模块 3-系统外模块的模块
    }
    ]
  }  
]
export default categorys;