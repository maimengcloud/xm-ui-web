<template>
  <section>
    <top-nav/> 
    <keep-alive><router-view></router-view></keep-alive> 
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
import { mapGetters } from "vuex"; 
import topNav from './top-nav.vue'
 
import { initDicts,getDefOptions,editXmProjectSomeFields } from "@/api/xm/core/xmProject";

export default { 
  computed: {
    ...mapGetters(["userInfo", "roles"]),

    calcProjectStatusStep() {
      if (this.dicts["projectStatus"] && this.selProject) {
        var index = this.dicts["projectStatus"].findIndex((i) => {
          if (i.id == this.selProject.status) {
            return true;
          } else {
            return false;
          }
        });
        return index + 1;
      } else {
        return 0;
      }
    },
  },
  watch: {},
  data() {
    return {
      platformViewVisible: false,
      tabPosition: "left",
      infotype: "项目概览",
      load: { list: false, edit: false },
      groupUserVisible: false,
      exportArr: ["任务", "计划", "需求监控"],
      dicts:  getDefOptions(), 
      maxTableHeight:300,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    afterEditSubmit: function (project) {
      this.selProject = Object.assign(this.selProject, project);
      this.$emit("submit", project);
    },
    toArchive: function () {
      this.$router.push({
        path: "/mdp/arc/mate/archive/ArchiveMng",
      });
    },
    toIm: function () {
      this.groupUserVisible = true;
    },
    toHelpMe: function () {
      this.$router.push({
        path: "/mdp/im/messages/crmChat",
        query: {
          categoryId: "css",
          sendContent: "咨询",
        },
      });
    },
    onUserSelected: function (users) {
      if (this.groupUserVisible == true) {
        var query = {};
        if (users) {
          if (users.length == 1) {
            var user = users[0];
            query.toUserid = user.userid;
            query.toUsername = user.username;
            query.msgType = "prichat";
          } else if (users.length >= 2) {
            query.users = JSON.stringify(
              users.map((i) => {
                return { userid: i.userid, username: i.username };
              })
            );
            query.categoryId = "common";
            query.msgType = "group";
          }
        }
        this.$router.push({
          path: "/mdp/im/messages/messageChat",
          query: query,
        });
      }
    },
    setInfotype(infotype) {
      if (infotype == "返回") {
        this.goBack();
      } else {
        this.infotype = infotype;
        localStorage.setItem("project-infotype", infotype);
      }
    },
    handleExport() {
      this.downloadLoading = true;
      let list = [];
      let header = [];
      let keyList = [];
      let pageNum = 1;
      let infotypeKey = "";
      if (this.infotype === "任务") {
        header = [
          "序号",
          "任务名称",
          "需求",
          "预算(万)",
          "工作量（人时）",
          "执行人",
          "进度",
          "任务开始时间",
          "任务结束时间",
          "任务技能需求",
        ];
        keyList = [
          "sortLevel",
          "name",
          "menuName",
          "budgetCost",
          "budgetWorkload",
          "exeUsernames",
          "rate",
          "startTime",
          "endTime",
          "taskSkillNames",
        ];
        list = this.$refs.xmTaskMng.tasksTreeData;
        pageNum = this.$refs.xmTaskMng.pageInfo.pageNum;
      } else if (this.infotype === "计划") {
        header = [
          "序号",
          "计划名称",
          "开始时间",
          "结束时间",
          "进度(%)",
          "状态",
          "计划人数",
          "实际人数",
          "计划工期",
          "实际工期",
          "计划工作量（人时）",
          "实际工作量（人时）",
          "计划非人力成本(元)",
          "实际非人力成本(元)",
          "计划内购人力成本(元)",
          "实际内购人力成本(元)",
          "计划外购人力成本(元)",
          "实际外购人力成本(元)",
          "计划成本合计(元)",
          "实际成本合计(元)",
          "审批状态",
          "备注",
        ];
        keyList = [
          "seqNo",
          "name",
          "beginDate",
          "endDate",
          "actRate",
          "phaseStatus",
          "budgetOuserCnt",
          "actStaffNu",
          "budgetHours",
          "actHours",
          "budgetWorkload",
          "actWorkload",
          "budgetNouserAt",
          "actNouserAt",
          "budgetIuserAt",
          "actIuserAt",
          "budgetOuserAt",
          "actOuserAt",
          "budgetCostAt",
          "actCostAt",
          "bizFlowState",
          "remark",
        ];
        list = this.$refs.xmPhaseMng.projectPhaseTreeData;
        pageNum = this.$refs.xmPhaseMng.pageInfo.pageNum;
      } else if (this.infotype === "需求监控") {
        header = [
          "序号",
          "需求名称",
          "计划状态",
          "负责人",
          "上线时间",
          "计划开始时间",
          "实际开始时间",
          "计划结束时间",
          "实际结束时间",
          "计划工作量(人时)",
          "实际工作量(人时)",
          "计划成本(元)",
          "实际成本(元)",
          "总体完成比例%",
          "需求完成比例%",
          "设计完成比例%",
          "开发完成比例%",
          "sit完成比例%",
          "uat完成比例%",
          "上线状态",
        ];
        keyList = [
          "seqNo",
          "menuName",
          "planStatus",
          "chargeUsername",
          "onlineTime",
          "planStartTime",
          "actStartTime",
          "planEndTime",
          "actEndTime",
          "planWorkload",
          "actWorkload",
          "planCostAmount",
          "actCostAmount",
          "finishRate",
          "demandRate",
          "designRate",
          "devRate",
          "sitRate",
          "uatRate",
          "onlineStatus",
        ];
        list = this.$refs.xmMenuWithPlan.xmMenusTreeData;
        pageNum = this.$refs.xmMenuWithPlan.pageInfo.pageNum;
      }
      const filename = `${this.selProject.name}_${this.infotype}_第${pageNum}页`;
      const data = this.formatJson(keyList, list);

      import("@/vendor/Export2Excel").then((excel) => {
        excel.export_json_to_excel({
          header,
          data,
          filename,
          // autoWidth: this.autoWidth,
          bookType: "xlsx",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData, dataList = []) {
      if (this.infotype == "任务") {
        jsonData.forEach((v) => {
          const row = filterVal.map((j) => {
            let key = "";
            return v[j];
          });
          dataList.push(row);
          if (v.children && v.children.length) {
            dataList = this.formatJson(filterVal, v.children, dataList);
          }
        });
        return dataList;
      } else if (this.infotype == "计划") {
        const bizFlowStateDict = {
          0: "未发审",
          1: "审核中",
          2: "已通过",
          3: "未通过",
          4: "已取消",
        };
        jsonData.forEach((v) => {
          const row = filterVal.map((j) => {
            let key = "";
            if (j == "phaseStatus") {
              return this.$refs.xmPhaseMng.formateOption(
                "xmPhaseStatus",
                v.phaseStatus
              );
            } else if (j == "bizFlowState") {
              return `${bizFlowStateDict[parseInt(v[j]) || 0]}`;
            } else {
              return v[j];
            }
          });
          dataList.push(row);
          if (v.children && v.children.length) {
            dataList = this.formatJson(filterVal, v.children, dataList);
          }
        });
        return dataList;
      } else if (this.infotype == "需求监控") {
        jsonData.forEach((v) => {
          const row = filterVal.map((j) => {
            let key = "";
            if (j == "planStatus") {
              key = "xmMenuPlanStatus";
            } else if (j == "onlineStatus") {
              return parseInt(v[j]) ? "已上线" : "未上线";
            } else {
              return v[j];
            }
            const dicts = this.$refs.xmMenuWithPlan.dicts;
            if (
              dicts[key] == undefined ||
              dicts[key] == null ||
              dicts[key].length == 0
            ) {
              return v[j];
            }
            var rowData = dicts[key].filter((i) => i.id == v[j]);
            if (rowData.length > 0) {
              return rowData[0].name;
            } else {
              return v[j];
            }
          });
          dataList.push(row);
          if (v.children && v.children.length) {
            dataList = this.formatJson(filterVal, v.children, dataList);
          }
        });
        return dataList;
      }
    },
    getDateString(dateStr) {
      if (dateStr == null || dateStr == "" || dateStr == undefined) {
        return "";
      } else {
        return dateStr.substr(0, 10);
      }
    }, 

    editXmProjectSomeFields(row,fieldName,$event){ 
      var that=this;
      var func=(params)=>{
        editXmProjectSomeFields(params).then(res=>{
          var tips = res.data.tips;
          if(tips.isOk){
            this.$emit('edit-fields',params)
            Object.assign(row,params) 
            this.selProjectBak=Object.assign({},row)
          }else{   
            Object.assign(this.selProject,this.selProjectBak)
            this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
          }
        })
      }
      var params={ids:[row.id]}; 
        
      params[fieldName]=$event 
      
      
      if(fieldName=='description'){
        this.$refs.selProject.validateField('description',err=>{
          if(err){ 
            this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
            return;
          }else{
            func(params)
          }
        })
      }else if(fieldName=='name'){  
        this.$refs.selProject.validateField('name',err=>{
          if(err){
            this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
            return;
          }else{
            func(params)
          }
        })
      }else{
        func(params)
      }
    },
    goBack() {
      localStorage.setItem("project-infotype", "项目概览");  
      this.$router.back(-1); 
    },
    goHome(){ 
      localStorage.setItem("project-infotype", "项目概览");  
      this.$router.push({path:'/'}) 
    },
    
			onEditFields(row){ 
				Object.assign(this.selProject,row)
				this.$emit("edit-fields",row);
			},
      showCurrFlow(){
        this.$refs['项目概览'].showPanelName='currFlow'
      },
      showHisFlow(){
        this.$refs['项目概览'].showPanelName='hisFlow'
      },
      showDetail(){
        this.$refs['项目概览'].showPanelName='detail'
      },
      showProjectGaiSuan(){ 
        this.$refs['项目概览'].showPanelName='detail' 
        this.$nextTick(()=>{ 
          this.$refs['项目概览'].$refs['detail'].$refs['projectEdit'].currTabPane='4'
        })
      },
      showProjectShouYi(){
        this.$refs['项目概览'].showPanelName='detail' 
        this.$nextTick(()=>{  
          this.$refs['项目概览'].$refs['detail'].$refs['projectEdit'].currTabPane='5'
        })
        
      },
      showMenusPage(){
        this.infotype='需求'  
      },
      linkProduct(){
        this.$refs['项目概览'].showPanelName='productProjectLink' 
      },
      createProduct(){
        this.infotype='产品'
        this.$nextTick(()=>{
          this.$refs['xmProductComplex'].addProductVisible=true
        })
      }
  }, //end methods
  components: {
    topNav
    //在下面添加其它组件
  }, 
  mounted() { 
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
