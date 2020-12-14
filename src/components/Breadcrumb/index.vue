<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
        <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{generateTitle(item.meta.title)}}</span>
        <router-link v-else :to="item.redirect||item.path">{{generateTitle(item.meta.title)}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px;"> <i class="el-icon-menu" style="margin-right:5px"></i>全部应用</el-button>
    <div class="drawer-box">
        <el-drawer
        :visible.sync="drawer"
        :direction="direction">
        <div class="drawer">
          <div class="drawer-content">
            <div class="drawer-content-input">
              <el-input placeholder="请输入中文" v-model.trim="key" clearable prefix-icon = "el-icon-search" size="small" style="width:60%">
              </el-input>
            </div>
            <div class="drawer-content-category" v-for="(item,index) in categorys" :key="index">
              <div class="category-name" v-text="item.title"></div>
              <div class="category-list">
                <div
                  class="category-item"
                  v-for="(module,mindex) in item.childrens" :key="index+'_'+mindex"
                  @click="gotolink(module)"
                  :class="{highlight : module.isHighlight }"
                > 
                  <div class="module-icon">
                    <img :src="module.icon">
                  </div>
                  <div class="module-name" v-text="module.moduleName"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
    
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/i18n'

export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null,
      drawer: false,
      direction: 'ttb',
      key:"",
      //模块分类
      categorys:[
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
        
      ],
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
    key(val){
      console.log(this.key);
      this.searchModule();
    }
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
      }
      this.levelList = matched
    },
    //路由跳转
    gotolink(module) {
      if(module.topModuleId==process.env.CONTEXT){
        this.drawer = false
        this.$router.replace(module.link);
      } else{
        this.jumpToOtherSystem(module);
      }   
    },
    //系统跳转
    jumpToOtherSystem(module) { 
        let href = window.location.protocol + "//" + window.location.host + "/" + module.topModuleId + "/"+ process.env.VERSION +"/#" + module.link; 
        window.open(href, module.moduleName,null,true);
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it

      },
    //搜索
    searchModule(){
      for(let i =0 ; i <this.categorys.length; i++){
        for(let j =0 ; j <this.categorys[i].childrens.length; j++){
          let module = this.categorys[i].childrens[j];
            this.categorys[i].childrens[j].isHighlight = false;
        }

      }
      if(this.key != ""){
        for(let i =0 ; i <this.categorys.length; i++){
          for(let j =0 ; j <this.categorys[i].childrens.length; j++){
            let module = this.categorys[i].childrens[j];
            if(module.moduleName.indexOf(this.key) > -1){
              this.categorys[i].childrens[j].isHighlight = true;
            }
          }
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
  .drawer-box{
    .drawer{
      display: flex;
      justify-content: center;
      align-items: center;
      .drawer-content{
        width: 900px;
        height: 100%;
        .drawer-content-input{
          display: flex;
          justify-content: center;
        }
        .drawer-content-category{
          .category-name{
            color: #333333;
            font-size: 16px;
          }
          .category-list{
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .category-item{
              height: 70px;
              width: 70px;
              margin-right: 20px;
              transition: all 0.3s;
              .module-icon{
                width: 70px;
                height: 38px;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;  
                align-items: center;
                img{
                  width: 20px;
                }
                }
              .module-name{
                height: 32px;
                line-height: 32px;
                color:#666666;
                font-size: 12px;
                text-align: center;
              }
            }
            .category-item:hover{
              background: rgb(240, 241, 245);
            }
          }
        }
      }
    }
    .highlight{
      transform: scale(1.05);
      -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
    }
    
  }
  
</style>
<style rel="stylesheet/scss" lang="scss">
.drawer-box{
  .el-drawer{
    height: 95%!important;
    overflow: auto;
  }
}

</style>
