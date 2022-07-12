<template>
  <section>
    <el-row>
      <el-menu
        :default-active="infotype"
        mode="horizontal"
        @select="setInfotype"
        class="menus"
        background-color="rgb(48, 65, 86)"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
      >
        <el-menu-item index="返回">
          <span slot="title"><i class="el-icon-back"></i></span>
        </el-menu-item>
        <el-menu-item index="迭代概览">
          <span
            slot="title"
            style="font-size: 18px; color: #409eff"
            class="hidden-md-and-down"
            :title="xmIteration.iterationName"
          >
            <font v-if="xmIteration.iterationName.length >= 15"
              ><strong
                >迭代:&nbsp;&nbsp;{{
                  xmIteration.iterationName.substring(0, 15)
                }}</strong
              ></font
            >
            <font type="danger" v-else
              ><strong
                >迭代:&nbsp;&nbsp;{{ xmIteration.iterationName }}</strong
              ></font
            >
          </span>
          <span
            slot="title"
            style="color: #409eff"
            class="hidden-lg-and-up"
            :title="xmIteration.iterationName"
          >
            <font v-if="xmIteration.iterationName.length >= 15"
              >迭代:&nbsp;{{ xmIteration.iterationName.substring(0, 15) }}</font
            >
            <font type="danger" v-else
              >迭代:&nbsp;{{ xmIteration.iterationName }}</font
            >
          </span>
        </el-menu-item>
        <el-menu-item label="项目" index="项目" class="hidden-sm-and-down">
          <span slot="title"><i class="el-icon-document"></i>项目</span>
        </el-menu-item>
        <el-menu-item label="需求" index="需求">
          <span slot="title"><i class="el-icon-document"></i>需求</span>
        </el-menu-item>
        <el-menu-item index="任务">
          <span slot="title"><i class="el-icon-s-operation"></i>任务</span>
        </el-menu-item>
        <el-menu-item index="缺陷">
          <span slot="title"><i class="el-icon-question"></i>缺陷</span>
        </el-menu-item>
        <el-menu-item index="效能">
          <span slot="title"><i class="el-icon-s-data"></i>效能</span>
        </el-menu-item>
      </el-menu>
    </el-row>
    <el-row ref="pageMainRef">
      <el-col
        :span="infotype == '迭代概览' ? 4 : 0"
        class="padding border"
        :style="{ maxHeight: maxTableHeight + 'px', overflowY: 'auto' }"
      >
        <h4 class="padding-bottom">常用功能导航</h4>
        <el-steps
          :active="calcIterationStatusStep"
          finish-status="success"
          direction="vertical"
        >
          <el-step
            v-for="(i, index) in dicts['iterationStatus']"
            :title="i.name"
            :key="index"
          >
            <el-row slot="description">
              <el-row v-if="i.id == '0'"
                ><!--打开-->
                <span v-if="xmIteration.istatus == i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="infotype = '需求'"
                    >需求管理</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="showIterationMenu"
                    >配置需求范围</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="danger"
                    size="mini"
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '1')"
                    >开启需求评审</el-button
                  > 
                </span>
                <span v-if="xmIteration.istatus != i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="infotype = '需求'"
                    >需求管理</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="showIterationMenu"
                    >需求范围</el-button
                  > 
                </span>
              </el-row>
              <el-row v-else-if="i.id == '1'"
                ><!--需求评审-->
                <span v-if="xmIteration.istatus == i.id"> 
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="showIterationMenu"
                    >确认需求范围</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="infotype='缺陷'"
                    >缺陷登记</el-button
                  >
                  <el-button
                    class="step-btn"
                    type="danger"
                    size="mini"
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '2')"
                    >进入计划会</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id">
                   
                </span>
              </el-row>
              <el-row v-else-if="i.id == '2'"
                ><!--计划会-->
                <span v-if="xmIteration.istatus == i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="showIterationDetail"
                    >迭代计划</el-button
                  >
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="infotype = '任务'"
                    >任务管理</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="danger"
                    size="mini"
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '3')"
                    >设为研发中</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="showIterationDetail"
                    >迭代计划</el-button
                  >
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="infotype = '任务'"
                    >任务管理</el-button
                  > 
                </span>
              </el-row>
              <el-row v-else-if="i.id == '3'"
                ><!--研发中-->
                <span v-if="xmIteration.istatus == i.id"> 
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="infotype = '任务'"
                    >任务管理</el-button
                  >  
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="infotype = '效能'"
                    >效能分析</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="danger"
                    size="mini"
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '4')"
                    >设为测试中</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id"> 
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="infotype = '效能'"
                    >效能分析</el-button
                  > 
                </span>
              </el-row>
              <el-row v-else-if="i.id == '4'"
                ><!--测试中-->
                <span v-if="xmIteration.istatus == i.id"> 
                  <el-button
                    class="step-btn"
                    type="warning"
                    size="mini"
                    plain
                    @click="infotype = '缺陷'"
                    >缺陷管理</el-button
                  >  
                  <el-button
                    class="step-btn"
                    type="danger"
                    size="mini"
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '5')"
                    >设为待上线</el-button
                  >
                </span>
              </el-row>
              <el-row v-else-if="i.id == '5'"
                ><!--上线中-->
                <span v-if="xmIteration.istatus == i.id">
                  
                  <el-button
                    class="step-btn"
                    type="danger"
                    size="mini"
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '6')"
                    >设为已完成</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id">
                  
                </span>
              </el-row>
              <el-row v-else-if="i.id == '6'"
                ><!--已完成-->
                <span v-if="xmIteration.istatus == i.id">
                  <el-button
                    class="step-btn"
                    type="danger"
                    size="mini"
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '7')"
                    >设为已关闭</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id"> 
				   
				</span>
              </el-row>
              <el-row v-else-if="i.id == '7'"
                ><!--已关闭-->
                <span v-if="xmIteration.istatus == i.id">
                  <el-button
                    class="step-btn"
                    type="danger"
                    size="mini"
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '0')"
                    >重新打开</el-button
                  >
                </span> 
              </el-row> 
            </el-row>
          </el-step>
        </el-steps>
      </el-col>
      <el-col :span="infotype == '迭代概览' ? 20 : 24">
        <xm-iteration-overview-complex
          v-if="infotype == '迭代概览'"
		  ref="迭代概览"
          :xm-iteration="xmIteration"
		  @edit-fields="onEditFields"
        ></xm-iteration-overview-complex>
        <xm-project-complex
          v-if="infotype == '项目'"
          ref="xmProjectComplex"
          :xm-iteration="xmIteration"
        ></xm-project-complex>
        <xm-menu-mng
          v-if="infotype == '需求'"
          :xm-iteration="xmIteration"
          :xm-product="{id:xmIteration.productId,name:xmIteration.productName}" 
        ></xm-menu-mng>
        <xm-task-mng
          v-if="infotype == '任务'"
          ref="xmTaskMng"
          ptype=""
          queryScope="task"
          :xm-iteration="xmIteration"
        ></xm-task-mng>
        <xm-question
          v-if="infotype == '缺陷'"
          :xm-iteration="xmIteration"
          ref="xmQuestion"
        ></xm-question>
        <xm-group-mng
          v-if="infotype == '团队'"
          :xm-iteration="xmIteration"
        ></xm-group-mng>
        <xm-report
          v-if="infotype == '效能'"
          :xm-iteration="xmIteration"
        ></xm-report>
        <el-drawer
          title="选中团队成员"
          :visible.sync="groupUserVisible"
          size="50%"
          append-to-body
          :close-on-click-modal="false"
        >
          <xm-group-select
            :xm-iteration="xmIteration"
            :visible="groupUserVisible"
            is-select-multi-user="1"
            @user-confirm="onUserSelected"
          ></xm-group-select>
        </el-drawer>
      </el-col>
    </el-row>
    
		<el-dialog  width="60%" top="20px" :visible.sync="iterationAddVisible" append-to-body>  
					<xm-iteration-add  :xm-product="xmProduct" :sel-project="selProject" :visible="iterationAddVisible" @cancel="iterationAddVisible=false" @submit="afterIterationAddSubmit"></xm-iteration-add>
 		</el-dialog> 
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
import { initSimpleDicts } from "@/api/mdp/meta/item"; //下拉框数据查询
import { mapGetters } from "vuex";
import xmTaskMng from "../xmTask/XmTaskMng";
import xmGroupMng from "../xmGroup/XmGroupMng";
import xmGroupSelect from "../xmGroup/XmGroupSelect";

import xmExchange from "../xmExchange/XmExchangeMng";
import xmQuestion from "../xmQuestion/XmQuestionMng";
import xmFileMng from "../xmFile/XmFileMng";
import xmDetail from "../xmProject/XmProjectDetail";
import xmProjectKpi from "../xmProjectKpi/XmProjectKpiMng";
import xmRecord from "../xmRecord/XmRecordMng";
import xmCost from "../xmProject/XmProjectCost";
import xmBudget from "../xmProject/XmProjectBudgetCost";
import xmContract from "../xmContract/XmContractMng";
import xmEnvList from "../xmEnvList/XmEnvListMng";
import xmMenuMng from "../xmMenu/XmMenuBox";
import xmMenuWithPlan from "../xmMenu/XmMenuWithPlan";
import xmProjectStateMng from "../xmProjectState/XmProjectStateMng";
import xmTestCaseExecMng from "../xmTestCaseExec/XmTestCaseExecMng";
import XmIterationForProjectComplex from "./XmIterationForLinkComplex.vue";
import XmIterationOverviewComplex from "../xmIteration/XmIterationOverviewComplex.vue";
import XmProductForProjectComplex from "../xmProduct/XmProductForLinkComplex.vue";
import XmProjectComplex from "../xmProject/XmProjectForLinkComplex.vue";	
import {initDicts, listXmIteration, editSomeFieldsXmIteration } from '@/api/xm/core/xmIteration';


import XmReport from "@/views/xm/rpt/reportIndex";

export default {
  props: ["xmIteration", "visible"],
  computed: {
    ...mapGetters(["userInfo", "roles"]),

    calcIterationStatusStep() {
      if (this.dicts["iterationStatus"] && this.xmIteration) {
        var index = this.dicts["iterationStatus"].findIndex((i) => {
          if (i.id == this.xmIteration.istatus) {
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
      dicts: { iterationStatus: [] },
      platformViewVisible: false,
      tabPosition: "left",
      infotype: "迭代概览",
      load: { list: false, edit: false },
      groupUserVisible: false,
      exportArr: ["任务", "计划", "需求监控"],
      maxTableHeight: 300,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    ...util,
    afterEditSubmit: function (project) {
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
    handleMenuSelect(menuId) {
      this.infotype = menuId;
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
      this.infotype = infotype;

      if (infotype == "返回") {
        this.goBack();
      } else {
        localStorage.setItem("iteration-infotype", infotype);
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
      const filename = `${this.xmIteration.iterationName}_${this.infotype}_第${pageNum}页`;
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
    goBack() {
      localStorage.setItem("iteration-infotype", "迭代概览");
      this.$router.back();
    },
	

	editSomeFields(row,fieldName,$event){ 
		let params={};
		params['ids']=[row].map(i=>i.id)
		params[fieldName]=$event
		var func = editSomeFieldsXmIteration
		func(params).then(res=>{
			let tips = res.data.tips;
			if(tips.isOk){
			  Object.assign(row,params)
			  this.$emit('edit-fields',params)
			}else{ 
				this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
			}
		}).catch((e)=>Object.assign(this.editForm,this.editFormBak))
	},
	showIterationMenu(){
		this.$refs['迭代概览'].showPanelName='iterationMenuMng'
	},
	showIterationDetail(){
		this.$refs['迭代概览'].showPanelName='detail'
	},
    onEditFields(row){
      Object.assign(this.xmIteration,row)
      this.$emit('edit-fields',row)
    }
  }, //end methods
  components: {
    xmTaskMng,
    xmGroupMng,
    xmExchange,
    xmQuestion,
    xmFileMng,
    xmDetail,
    xmProjectKpi,
    xmRecord,
    xmCost,
    xmBudget,
    xmContract,
    xmEnvList,
    xmMenuMng,
    xmMenuWithPlan,
    xmProjectStateMng,
    xmTestCaseExecMng,
    xmGroupSelect,
    XmIterationForProjectComplex,
    XmIterationOverviewComplex,
    XmProductForProjectComplex,
    XmProjectComplex,
    XmReport,
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => { 
	  initDicts(this);
      var infotype = localStorage.getItem("iteration-infotype");
      if (infotype) {
        this.infotype = infotype;
      }
    });

    this.$nextTick(() => {

      this.maxTableHeight = util.calcTableMaxHeight(this.$refs.pageMainRef.$el);
    });
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.menus {
  .el-menu-item {
    padding-left: 0px !important;
  }
}
/* 超过宽度则用...代替 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
