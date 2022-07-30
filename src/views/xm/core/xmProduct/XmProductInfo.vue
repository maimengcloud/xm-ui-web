<template>
  <section>
    <el-row>
      <el-menu
        :default-active="infotype"
        mode="horizontal"
        class="menus"
        @select="setInfotype" 
        background-color="rgb(48, 65, 86)"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
      >
         
        <el-menu-item index="产品概览">
          <span
            slot="title"
            style="font-size: 18px; color: #409eff"
            class="hidden-md-and-down"
            :title="xmProduct.productName"
          >
            <font v-if="xmProduct.productName.length >= 15">
              <strong>
                
                &nbsp;<el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;{{ xmProduct.productName.substring(0, 15) }}</strong
              ></font
            >
            <div  v-else>
           
            <font type="danger">
              <strong>&nbsp; <el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;产品:&nbsp;{{ xmProduct.productName }}</strong></font
            >
            </div>
          </span>
          <span
            slot="title"
            style="color: #409eff"
            class="hidden-lg-and-up"
            :title="xmProduct.productName"
          >
            <font v-if="xmProduct.productName.length >= 15">
              &nbsp;<el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;产品:&nbsp;{{ xmProduct.productName.substring(0, 15) }}</font
            >
            <font type="danger" v-else>
              &nbsp;<el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;产品:&nbsp;{{ xmProduct.productName }}</font
            >
          </span>
        </el-menu-item>
        <el-menu-item index="迭代" class="hidden-sm-and-down">
          <span slot="title"><i class="el-icon-connection"></i>迭代</span>
        </el-menu-item>

        <el-menu-item label="项目" index="项目" class="hidden-sm-and-down">
          <span slot="title"><i class="el-icon-odometer"></i>项目</span>
        </el-menu-item>
        <el-menu-item label="需求" index="需求">
          <span slot="title"><i class="el-icon-document"></i>需求</span>
        </el-menu-item>
        <!--
				<el-menu-item index="项目任务">
					<span slot="title"><i class="el-icon-s-operation"></i>任务</span>
				</el-menu-item> 
				-->
        <!--
				<el-submenu index="任务">
					<template slot="title"><i class="el-icon-s-operation"></i>任务</template>
						<el-menu-item   index="产品任务">
							<span slot="title"><i class="el-icon-view"></i>产品任务</span> 
						</el-menu-item>
						<el-menu-item index="项目任务">
							<span slot="title"><i class="el-icon-video-camera"></i>项目任务</span>
						</el-menu-item> 
				</el-submenu > 
				-->
        <el-menu-item index="缺陷">
          <span slot="title"><i class="el-icon-question"></i>缺陷</span>
        </el-menu-item>
        <!--
				<el-submenu index="团队">
					<template slot="title"><i class="el-icon-user-solid"></i>团队</template>
						<el-menu-item   index="产品团队">
							<span slot="title"><i class="el-icon-solid"></i>产品团队</span> 
						</el-menu-item>
						<el-menu-item index="项目团队">
							<span slot="title"><i class="el-icon-solid"></i>项目团队</span>
						</el-menu-item> 
				</el-submenu >
				-->
        <el-menu-item index="项目团队">
          <span slot="title"><i class="el-icon-user-solid"></i>团队</span>
        </el-menu-item>
        <!--
				<el-submenu index="计划">
					<template slot="title"><i class="el-icon-time"></i>计划</template>
						
						<el-menu-item   index="产品计划">
							<span slot="title"><i class="el-icon-view"></i>产品计划</span> 
						</el-menu-item>
						
						<el-menu-item index="项目计划">
							<span slot="title"><i class="el-icon-video-camera"></i>项目计划</span>
						</el-menu-item> 
				</el-submenu >
				
				<el-menu-item index="项目计划">
							<span slot="title"><i class="el-icon-time"></i>计划</span>
						</el-menu-item> 
						-->
        <el-submenu index="财务" class="hidden-sm-and-down">
          <template slot="title"><i class="el-icon-coin"></i>财务</template>
          <el-menu-item index="合同管理">
            <span slot="title"><i class="el-icon-s-data"></i>合同管理</span>
          </el-menu-item>
          <el-menu-item index="预算">
            <span slot="title"><i class="el-icon-coin"></i>预算</span>
          </el-menu-item>
          <el-menu-item index="费用">
            <span slot="title"><i class="el-icon-coin"></i>费用</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="效能">
          <span slot="title"><i class="el-icon-s-data"></i>效能</span>
        </el-menu-item>
        <el-submenu index="知识" class="hidden-lg-and-down">
          <template slot="title">知识</template>

          <el-menu-item index="wiki">
            <span slot="title"><i class="el-icon-document"></i>wiki</span>
          </el-menu-item>
          <el-menu-item index="文档">
            <span slot="title"><i class="el-icon-document"></i>文档</span>
          </el-menu-item>
          <el-menu-item index="环境清单">
            <span slot="title"><i class="el-icon-setting"></i>环境清单</span>
          </el-menu-item>
          <el-menu-item index="日志">
            <span slot="title"><i class="el-icon-edit-outline"></i>日志</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="更多">
          <template slot="title">更多 </template>
          <el-menu-item index="合同管理">
            <span slot="title"><i class="el-icon-s-data"></i>合同管理</span>
          </el-menu-item>
          <el-menu-item index="预算">
            <span slot="title"><i class="el-icon-coin"></i>预算</span>
          </el-menu-item>
          <el-menu-item index="费用">
            <span slot="title"><i class="el-icon-coin"></i>费用</span>
          </el-menu-item>
          <el-menu-item index="考核">
            <span slot="title"><i class="el-icon-view"></i>考核</span>
          </el-menu-item>
          <el-menu-item index="日志">
            <span slot="title"><i class="el-icon-edit-outline"></i>日志</span>
          </el-menu-item>
          <el-menu-item index="合同管理">
            <span slot="title"><i class="el-icon-s-data"></i>合同管理</span>
          </el-menu-item>
          <el-menu-item index="环境清单">
            <span slot="title"><i class="el-icon-setting"></i>环境清单</span>
          </el-menu-item>
          <el-menu-item index="报表">
            <span slot="title"><i class="el-icon-view"></i>考核</span>
          </el-menu-item>
          <el-menu-item index="风险">
            <span slot="title"><i class="el-icon-question"></i>风险</span>
          </el-menu-item>
          <el-menu-item index="论坛">
            <span slot="title"><i class="el-icon-date"></i>论坛</span>
          </el-menu-item>
          <el-menu-item index="即聊">
            <span slot="title"><i class="el-icon-date"></i>即聊</span>
          </el-menu-item>
          <el-menu-item index="客服">
            <span slot="title"><i class="el-icon-date"></i>客服</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="首页" @click.native="goHome">
          <span slot="title"
            ><i class="el-icon-s-home"></i></span
          >
        </el-menu-item> 
        <el-menu-item index="上一页" class="hidden-lg-and-down"  @click.native="goBack">
          <span slot="title"
            ><i class="el-icon-back"></i></span
          >
        </el-menu-item> 
      </el-menu>
	  </el-row>
      <el-row ref="pageBody">
        <el-col
          :span="infotype == '产品概览' ? 4 : 0"
          class="padding border"
          :style="{ maxHeight: maxTableHeight + 'px', overflowY: 'auto' }"
        >
          <h4 class="padding-bottom">常用功能导航</h4>
          <el-steps
            :active="calcProductPstatusStep"
            finish-status="success"
            direction="vertical"
          >
            <el-step
              v-for="(i, index) in dicts['xmProductPstatus']"
              :title="i.name"
              :key="index"
            >
              <el-row slot="description">
                <el-row v-if="i.id == '0'"
                  ><!--打开-->
                  <span v-if="xmProduct.pstatus == i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="infotype='需求'"
                      >需求管理</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="linkProject()"
                      >关联项目</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="
                        editXmProductSomeFields(xmProduct, 'pstatus', '1')
                      "
                      >设为研发中</el-button
                    >
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
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
                      @click="linkProject()"
                      >关联项目</el-button
                    > 
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '1'"
                  ><!--研发中-->
                  <span v-if="xmProduct.pstatus == i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="infotype='迭代'"
                      >迭代管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="infotype='缺陷'"
                      >缺陷管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="infotype='项目'"
                      >项目管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="infotype='效能'"
                      >效能分析</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="
                        editXmProductSomeFields(xmProduct, 'pstatus', '2')
                      "
                      >设为已完成</el-button
                    >
                  </span>
                  <span v-if="xmProduct.pstatus != i.id"> 
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="infotype='迭代'"
                      >迭代管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="infotype='缺陷'"
                      >缺陷管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="infotype='项目'"
                      >项目管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="infotype='效能'"
                      >效能分析</el-button
                    >
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '2'"
                  ><!--已完成-->
                  <span v-if="xmProduct.pstatus == i.id"> 
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="
                        editXmProductSomeFields(xmProduct, 'pstatus', '3')
                      "
                      >设为已关闭</el-button
                    >
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                     
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '3'"
                  ><!--已关闭-->
                  <span v-if="xmProduct.pstatus == i.id"> 
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="
                        editXmProductSomeFields(xmProduct, 'pstatus', '0')
                      "
                      >重新打开</el-button
                    >
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                     
                  </span>
                </el-row> 
              </el-row>
            </el-step>
          </el-steps>
        </el-col>
        <el-col :span="infotype == '产品概览' ? 20 : 24" class="padding-left padding-right">
          <xm-product-overview-complex
            v-if="infotype == '产品概览'"
            :xm-product="xmProduct"
			ref="xmProductComplex"
          ></xm-product-overview-complex>
          <xm-iteration-for-link-complex
            v-if="infotype == '迭代'"
            ref="xmIterationMng"
            :xm-product="xmProduct"
          ></xm-iteration-for-link-complex>
          <xm-project-for-link-complex
            v-if="infotype == '项目'"
            ref="xmProjectForLink"
            :xm-product="xmProduct"
          ></xm-project-for-link-complex>
          <xm-menu-box
            v-if="infotype == '需求'"
            :xm-product="xmProduct" 
          ></xm-menu-box>
          <xm-task-mng
            v-if="infotype == '产品任务'"
            ptype="1"
            queryScope="task"
            ref="productXmTaskMng"
            :xm-product="xmProduct"
            key="productXmTaskMng"
          ></xm-task-mng>
          <xm-task-mng
            v-if="infotype == '项目任务'"
            ptype="0"
            queryScope="task"
            ref="projectXmTaskMng"
            :xm-product="xmProduct"
            key="projectXmTaskMng"
          ></xm-task-mng>
          <xm-question
            v-if="infotype == '缺陷'"
            :xm-product="xmProduct"
            :padding-top="false"
            ref="xmQuestion"
          ></xm-question>
          <xm-group-mng
            v-if="infotype == '项目团队'"
            pgClass="0"
            :xm-product="xmProduct"
            key="projectGroup"
          ></xm-group-mng>
          <xm-group-mng
            v-if="infotype == '产品团队'"
            pgClass="1"
            :xm-product="xmProduct"
            key="productGroup"
          ></xm-group-mng>
          <xm-file-mng
            v-if="infotype == '文档'"
            :xm-product="xmProduct"
          ></xm-file-mng>
          <wiki-list
            v-if="infotype == 'wiki'"
            :xm-product="xmProduct"
          ></wiki-list>

          <xm-plan
            v-if="infotype == '产品计划'"
            ref="productPlan"
            ptype="1"
            queryScope="planTask"
            :xm-product="xmProduct"
            key="productPlan"
          ></xm-plan>

          <xm-plan
            v-if="infotype == '项目计划'"
            ref="projectPlan"
            ptype="0"
            queryScope="planTask"
            :xm-product="xmProduct"
            key="projectPlan"
          ></xm-plan>
          <!--<xm-phase-for-product v-if="infotype=='计划'" ref="xmPhaseMng" :xm-product="xmProduct" ></xm-phase-for-product> -->
          <xm-test-case-exec-mng
            v-if="infotype == '测试计划'"
            :visible="infotype == '测试计划'"
            :xm-product="xmProduct"
            ref="xmQuestion"
          ></xm-test-case-exec-mng>
          <xm-menu-with-plan
            v-if="infotype == '需求监控'"
            ref="xmMenuWithPlan"
            :xm-product="xmProduct"
          ></xm-menu-with-plan>
          <xm-project-state-mng
            v-if="infotype == '项目监控'"
            :xm-product="xmProduct"
          ></xm-project-state-mng>
          <xm-budget
            v-if="infotype == '预算'"
            :xm-product="xmProduct"
          ></xm-budget>
          <xm-cost v-if="infotype == '费用'" :xm-product="xmProduct"></xm-cost>
          <xm-project-kpi
            v-if="infotype == '考核'"
            :xm-product="xmProduct"
          ></xm-project-kpi>
          <xm-record
            v-if="infotype == '日志'"
            :visible="infotype == '日志'"
            :xm-product="xmProduct"
          ></xm-record>
          <xm-contract
            v-if="infotype == '合同管理'"
            :xm-product="xmProduct"
          ></xm-contract>
          <xm-env-list
            v-if="infotype == '环境清单'"
            :xm-product="xmProduct"
          ></xm-env-list>
          <xm-question
            v-if="infotype == '风险'"
            :qtype="'2'"
            :xm-product="xmProduct"
            ref="xmRisk"
          ></xm-question>

          <xm-report
            v-if="infotype == '效能'"
            :xm-product="xmProduct"
          ></xm-report>
        </el-col>
      </el-row>
      <el-drawer
        title="选中团队成员"
        :visible.sync="groupUserVisible"
        size="50%"
        append-to-body
        :close-on-click-modal="false"
      >
        <xm-group-select
          :xm-product="xmProduct"
          :visible="groupUserVisible"
          is-select-multi-user="1"
          @user-confirm="onUserSelected"
        ></xm-group-select>
      </el-drawer> 
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
import XmProjectForLinkComplex from "../xmProject/XmProjectForLinkComplex"; //修改界面

import { mapGetters } from "vuex";
import xmTaskMng from "../xmTask/XmTaskMng";
import xmPlan from "../xmTask/XmPlan";
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
import xmMenuWithPlan from "../xmMenu/XmMenuWithPlan";
import xmProjectStateMng from "../xmProjectState/XmProjectStateMng"; 
import XmIterationForLinkComplex from "../xmIteration/XmIterationForLinkComplex.vue";
import XmProductOverviewComplex from "../xmProduct/XmProductOverviewComplex.vue";
import XmProductForLinkComplex from "./XmProductForLinkComplex.vue";
import XmProjectForLink from "../xmProject/XmProjectForLink.vue";

import XmReport from "@/views/xm/rpt/reportIndex";
import XmMenuBox from "../xmMenu/XmMenuBox.vue";
import WikiList from "../wiki/archive/WikiList.vue";
import { initDicts,editXmProductSomeFields } from "@/api/xm/core/xmProduct";

export default {
  props: ["xmProduct", "visible"],
  computed: {
    ...mapGetters(["userInfo", "roles"]),

    calcProductPstatusStep() {
      if (this.dicts["xmProductPstatus"] && this.xmProduct) {
        var index = this.dicts["xmProductPstatus"].findIndex((i) => {
          if (i.id == this.xmProduct.pstatus) {
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
  watch: {
    xmProduct: function (xmProduct) {
      var oldInfotype = this.infotype;
      this.infotype = "";
      this.$nextTick(() => {
        this.infotype = oldInfotype;
      });
    },
  },
  data() {
    return {
      platformViewVisible: false,
      tabPosition: "left",
	  dicts:{xmProductPstatus:[]},
      infotype: "产品概览",
      load: { list: false, edit: false },
      groupUserVisible: false,
      exportArr: ["任务", "计划", "需求监控"],
	  xmProductBak:{},
	  maxTableHeight:300,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
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
        localStorage.setItem("product-infotype", infotype);
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
          "budgetWorkload",
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
      const filename = `${this.xmProduct.productName}_${this.infotype}_第${pageNum}页`;
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

    editXmProductSomeFields(row,fieldName,$event){ 
      var that=this;
      var func=(params)=>{
        editXmProductSomeFields(params).then(res=>{
          var tips = res.data.tips;
          if(tips.isOk){
            this.$emit('edit-fields',params)
            Object.assign(row,params) 
            this.xmProductBak=Object.assign({},row)
          }else{   
            Object.assign(this.xmProduct,this.xmProductBak)
            this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
          }
        })
      }
      var params={ids:[row.id]}; 
        
      params[fieldName]=$event 
      
      
      if(fieldName=='description'){
        this.$refs.xmProduct.validateField('description',err=>{
          if(err){ 
            this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
            return;
          }else{
            func(params)
          }
        })
      }else if(fieldName=='name'){  
        this.$refs.xmProduct.validateField('name',err=>{
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

    onEditFields(row) {
      Object.assign(this.xmProduct, row);
      this.$emit("edit-fields", row);
    },
    showCurrFlow() {
      this.$refs["产品概览"].showPanelName = "currFlow";
    },
    showHisFlow() {
      this.$refs["产品概览"].showPanelName = "hisFlow";
    },
    showDetail() {
      this.$refs["产品概览"].showPanelName = "detail";
    },
    showProjectGaiSuan() {
      this.$refs["产品概览"].showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs["产品概览"].$refs["detail"].$refs[
          "projectEdit"
        ].currTabPane = "4";
      });
    },
    showProjectShouYi() {
      this.$refs["产品概览"].showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs["产品概览"].$refs["detail"].$refs[
          "projectEdit"
        ].currTabPane = "5";
      });
    },
    showMenusPage() {
      this.infotype = "产品";
      this.$nextTick(() => {
        this.$refs["xmProductComplex"].showPanel = "menus";
      });
    },
    linkProject() {
      this.$refs["xmProductComplex"].showPanelName = "productProjectLink";
    },
    createProduct() {
      this.infotype = "产品";
      this.$nextTick(() => {
        this.$refs["xmProductComplex"].addProductVisible = true;
      });
    },
    goBack() {
      localStorage.setItem("product-infotype", "产品概览");
      this.$router.back(-1); 
    },
    goHome(){ 
      localStorage.setItem("product-infotype", "产品概览");
      this.$router.push({path:'/'}) 
    },
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
    XmMenuBox,
    xmMenuWithPlan,
    xmProjectStateMng, 
    xmGroupSelect,
    XmIterationForLinkComplex,
    XmProductOverviewComplex,
    XmProductForLinkComplex,
    XmProjectForLinkComplex,
    XmProjectForLink,
    XmReport,
    xmPlan,
    WikiList,
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
		initDicts(this)
		
      this.maxTableHeight  = util.calcTableMaxHeight(this.$refs.pageBody.$el);
      var infotype = localStorage.getItem("product-infotype");
      if (infotype) {
        this.infotype = infotype;
      }
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

.step-btn {
  margin-left: 0px;
  margin-bottom: 5px;
}
</style>
