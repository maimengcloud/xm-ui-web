<template>
	<section  class="page-container page-full-height">
		<el-row>
			<el-menu :default-active="infotype"   mode="horizontal"  @select="setInfotype"   class="menus" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">

				<el-menu-item  index="项目概览" >
					<span slot="title" >
						<span slot="title" @click.stop="goBack"><i class="el-icon-back" ></i></span>
						<i class="el-icon-s-data"></i>
						<font v-if="selProject.name.length>=10">{{selProject.name.substring(0,10)}}</font>
						<font type="danger" v-else>{{selProject.name}}</font>
						概览
					</span>
				</el-menu-item>
				<el-menu-item   index="迭代">
					 <span slot="title"><i class="el-icon-document-copy"></i>迭代</span>

				</el-menu-item>
				<el-menu-item   index="产品">
					 <span slot="title"><i class="el-icon-s-flag"></i>产品</span>

				</el-menu-item>
				<el-menu-item label="故事" index="用户故事">
					 <span slot="title"><i class="el-icon-document"></i>故事</span>


				</el-menu-item>
				<el-menu-item   index="任务">
					 <span slot="title"><i class="el-icon-s-operation"></i>任务</span>


				</el-menu-item>
				<el-menu-item  index="缺陷">
					 <span slot="title"><i class="el-icon-question"></i>缺陷</span>


				</el-menu-item>
				<el-menu-item  index="团队">
					 <span slot="title"><i class="el-icon-user-solid"></i>团队</span>
				</el-menu-item>
				<el-menu-item  index="文档">
					 <span slot="title"><i class="el-icon-document"></i>文档</span>
				</el-menu-item>
				<el-submenu index="规划与里程碑">
					<template slot="title">规划与里程碑 </template>
					<el-menu-item index="阶段计划及里程碑">
					 <span slot="title"><i class="el-icon-odometer"></i>阶段计划及里程碑</span>
					</el-menu-item>
					<el-menu-item  index="测试计划">
						<span slot="title"><i class="el-icon-odometer"></i>测试计划</span>
					</el-menu-item>
				</el-submenu >

				<el-menu-item index="项目监控" class="hidden-lg-and-down">
					<span slot="title"><i class="el-icon-video-camera"></i>项目监控</span>
				</el-menu-item>
				<el-menu-item   index="故事监控" class="hidden-lg-and-down">
					<span slot="title"><i class="el-icon-video-camera"></i>故事监控</span>
				</el-menu-item>

				<el-menu-item   index="合同管理" class="hidden-md-and-down">
					<span slot="title"><i class="el-icon-s-data"></i>合同管理</span>
				</el-menu-item>
				<el-menu-item   index="预算" class="hidden-md-and-down">
					<span slot="title"><i class="el-icon-coin"></i>预算</span>


				</el-menu-item>
				<el-menu-item  index="费用" class="hidden-md-and-down">
					<span slot="title"><i class="el-icon-coin"></i>费用</span>


				</el-menu-item>
				<el-menu-item   index="考核" class="hidden-lg-and-down">
					<span slot="title"><i class="el-icon-view"></i>考核</span>


				</el-menu-item>
				<el-menu-item   index="日志" class="hidden-lg-and-down">
					<span slot="title"><i class="el-icon-edit-outline"></i>日志</span>


				</el-menu-item>
				<el-menu-item   index="环境清单" class="hidden-lg-and-down">
					<span slot="title"><i class="el-icon-setting"></i>环境清单</span>

				</el-menu-item>
				<el-menu-item   index="风险" class="hidden-lg-and-down">
					<span slot="title"><i class="el-icon-question"></i>风险</span>
				</el-menu-item>
				<el-submenu index="更多">
					<template slot="title">更多 </template>
					<el-menu-item  index="故事监控" >
						<span slot="title"><i class="el-icon-video-camera"></i>故事监控</span>
					</el-menu-item>
					<el-menu-item   index="项目监控">
						<span slot="title"><i class="el-icon-video-camera"></i>项目监控</span>
					</el-menu-item>
					<el-menu-item   index="预算">
						<span slot="title"><i class="el-icon-coin"></i>预算</span>


					</el-menu-item>
					<el-menu-item   index="费用">
						<span slot="title"><i class="el-icon-coin"></i>费用</span>


					</el-menu-item>
					<el-menu-item   index="考核">
						<span slot="title"><i class="el-icon-view"></i>考核</span>


					</el-menu-item>
					<el-menu-item   index="日志">
						<span slot="title"><i class="el-icon-edit-outline"></i>日志</span>


					</el-menu-item>
					<el-menu-item   index="合同管理">
						<span slot="title"><i class="el-icon-s-data"></i>合同管理</span>


					</el-menu-item>
					<el-menu-item  index="环境清单">
						<span slot="title"><i class="el-icon-setting"></i>环境清单</span>

					</el-menu-item>
					<el-menu-item   index="风险">
						<span slot="title"><i class="el-icon-question"></i>风险</span>
					</el-menu-item>
					<el-menu-item   index="论坛">
						<span slot="title"><i class="el-icon-date"></i>论坛</span>
					</el-menu-item>
					<el-menu-item   index="即聊">
						<span slot="title"><i class="el-icon-date"></i>即聊</span>
					</el-menu-item>
					<el-menu-item  index="客服">
						<span slot="title"><i class="el-icon-date"></i>客服</span>

					</el-menu-item>
				</el-submenu>
			</el-menu>
		   
		  	<xm-project-overview-complex v-if="infotype=='项目概览'" :sel-project="selProject"></xm-project-overview-complex>  
			 <xm-iteration-for-project-complex  v-if="infotype=='迭代'" ref="xmIterationMng" :sel-project="selProject"></xm-iteration-for-project-complex>
 			 <xm-product-for-project-complex  v-if="infotype=='产品'" ref="xmProductComplex" :sel-project="selProject"></xm-product-for-project-complex>
			 <xm-menu-mng v-if="infotype=='用户故事'" :sel-project="selProject"></xm-menu-mng>
			 <xm-task-mng v-if="infotype=='任务'" ref="xmTaskMng" :sel-project="selProject" ></xm-task-mng>
			  <xm-question v-if="infotype=='缺陷'" :qtype="'bug'" :sel-project='selProject' ref="xmQuestion"></xm-question>
			  <xm-group-mng v-if="infotype=='团队'" :sel-project="selProject"></xm-group-mng>
			  <xm-file-mng v-if="infotype=='文档'" :sel-project="selProject"></xm-file-mng>
			  <xm-project-phase-mng v-if="infotype=='阶段计划及里程碑'" ref="xmProjectPhaseMng" :sel-project="selProject" ></xm-project-phase-mng>
			  <xm-test-case-exec-mng v-if="infotype=='测试计划'" :visible="infotype=='测试计划'"  :sel-project='selProject' ref="xmQuestion"></xm-test-case-exec-mng>
			<xm-menu-with-plan v-if="infotype=='故事监控'" ref="xmMenuWithPlan" :sel-project="selProject"></xm-menu-with-plan>
			<xm-project-state-mng v-if="infotype=='项目监控'" :sel-project="selProject"></xm-project-state-mng>
			<xm-budget v-if="infotype=='预算'" :sel-project="selProject"></xm-budget>
			 <xm-cost v-if="infotype=='费用'" :sel-project="selProject"></xm-cost>
			<xm-project-kpi v-if="infotype=='考核'"  :sel-project="selProject"></xm-project-kpi>
			<xm-record v-if="infotype=='日志'" :visible="infotype=='日志'" :sel-project="selProject"></xm-record>
			<xm-contract v-if="infotype=='合同管理'" :sel-project="selProject"></xm-contract>
			<xm-env-list v-if="infotype=='环境清单'" :sel-project="selProject"></xm-env-list>
			<xm-question v-if="infotype=='风险'" :qtype="'risk'" :sel-project='selProject' ref="xmRisk"></xm-question>
			<el-drawer title="选中团队成员" :visible.sync="groupUserVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				<xm-project-group-select :sel-project="selProject" :visible="groupUserVisible" is-select-multi-user="1" @user-confirm="onUserSelected"></xm-project-group-select>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProject,editStatus , delXmProject, batchDelXmProject } from '@/api/xm/core/xmProject';
	import  XmProjectAdd from '../xmProject/XmProjectAdd';//新增界面
	import  XmProjectEdit from '../xmProject/XmProjectEdit';//修改界面
	import { mapGetters } from 'vuex';
	import xmTaskMng from '../xmTask/XmTaskMng';
	import xmGroupMng from '../xmProjectGroup/XmProjectGroupMng';
	import xmProjectGroupSelect from '../xmProjectGroup/XmProjectGroupSelect';

	import xmExchange from '../xmExchange/XmExchangeMng';
	import xmQuestion from '../xmQuestion/XmQuestionMng';
	import xmFileMng from '../xmFile/XmFileMng';
	import xmDetail from '../xmProject/XmProjectDetail';
	import xmProjectKpi from '../xmProjectKpi/XmProjectKpiMng';
	import xmRecord from '../xmRecord/XmRecordMng';
	import xmCost from '../xmProject/XmProjectCost';
	import xmBudget from '../xmProject/XmProjectBudgetCost';
	import xmContract from '../xmProjectContract/XmProjectContractMng';
	import xmEnvList from '../xmProjectEnvList/XmProjectEnvListMng';
	import xmProjectPhaseMng from '../xmProjectPhase/XmProjectPhaseMng';
	import xmMenuMng from '../xmMenu/XmMenuMng';
	import xmMenuWithPlan from '../xmMenu/XmMenuWithPlan';
	import xmProjectStateMng from '../xmProjectState/XmProjectStateMng';
	import xmTestCaseExecMng from '../xmTestCaseExec/XmTestCaseExecMng';  
	import XmIterationForProjectComplex from '../xmIteration/XmIterationForProjectComplex.vue'; 
	import XmProjectOverviewComplex from '../xmProject/XmProjectOverviewComplex.vue';
	import XmProductForProjectComplex from '../xmProduct/XmProductForProjectComplex.vue';


	export default {
		props: ["selProject","visible"],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]),
		},
		watch:{
			selProject:function(selProject){
				var oldInfotype=this.infotype
				this.infotype=''
				this.$nextTick(()=>{

					this.infotype=oldInfotype
				})

			}
		},
		data() {
			return {
				platformViewVisible:false,
				tabPosition:'left',
				infotype:"项目概览",
				load:{list:false,edit:false},
        groupUserVisible:false,
        exportArr: ['任务', '阶段计划', '故事监控']
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {

			afterEditSubmit:function(project){
				this.$emit("submit",project)
			},
			toArchive:function(){
					this.$router.push({
						path: "/mdp/arc/mate/archive/ArchiveMng"
					});
			},
			toIm:function(){
				this.groupUserVisible=true
			},
			toHelpMe:function(){
				this.$router.push({
						path: "/mdp/im/messages/crmChat",
						query:{
							categoryId:'css',
							sendContent:'咨询'
						}
				});
			},
			handleMenuSelect(menuId){
				this.infotype=menuId
			},
			onUserSelected:function(users){
				if(this.groupUserVisible==true){
					var query={}
					if(users){
						if(  users.length==1 ){
							var user=users[0]
							query.toUserid=user.userid
							query.toUsername=user.username
							query.msgType="prichat"
						}else if( users.length >=2 ){
							query.users=JSON.stringify(users.map(i=>{return {userid:i.userid,username:i.username}}))
							query.categoryId="common"
							query.msgType="group"
 						}
					}
					this.$router.push({
						path: "/mdp/im/messages/messageChat",
						query: query
					});
				}


      },
      setInfotype(infotype){
		  this.infotype=infotype;
	  },
      handleExport() {
        this.downloadLoading = true
        let list = [];
        let header = [];
        let keyList = [];
        let pageNum = 1;
        let infotypeKey = '';
        if (this.infotype === '任务') {
          header = ['序号', '任务名称', '故事', '预算(万)', '工作量（人时）', '执行人', '进度', '任务开始时间', '任务结束时间', '任务技能需求'];
          keyList = ['sortLevel', 'name', 'menuName', 'budgetCost', 'budgetWorkload', 'exeUsernames', 'rate', 'startTime', 'endTime', 'taskSkillNames'];
          list = this.$refs.xmTaskMng.tasksTreeData;
          pageNum = this.$refs.xmTaskMng.pageInfo.pageNum;
        } else if (this.infotype === '阶段计划') {
          header = ['序号', '阶段名称', '开始时间', '结束时间', '进度(%)', '状态', '计划人数', '实际人数', '计划工期', '实际工期',  '计划工作量（人时）', '实际工作量（人时）', '计划非人力成本(元)', '实际非人力成本(元)', '计划内购人力成本(元)', '实际内购人力成本(元)', '计划外购人力成本(元)', '实际外购人力成本(元)', '计划成本合计(元)', '实际成本合计(元)', '审批状态', '备注'];
          keyList = ['seqNo', 'phaseName', 'beginDate', 'endDate', 'actRate', 'phaseStatus', 'phaseBudgetOutUserCnt', 'actStaffNu', 'phaseBudgetHours', 'actHours', 'phaseBudgetWorkload', 'phaseActWorkload', 'phaseBudgetNouserAt', 'actNouserAt', 'phaseBudgetInnerUserAt', 'actInnerUserAt', 'phaseBudgetOutUserAt', 'actOutUserAt', 'phaseBudgetCostAt', 'actCostAt', 'bizFlowState', 'remark'];
          list = this.$refs.xmProjectPhaseMng.projectPhaseTreeData;
          pageNum = this.$refs.xmProjectPhaseMng.pageInfo.pageNum;

        } else if (this.infotype === '故事监控') {
          header = ['序号', '故事名称', '计划状态', '负责人', '上线时间', '计划开始时间', '实际开始时间', '计划结束时间', '实际结束时间', '计划工作量(人时)', '实际工作量(人时)', '计划成本(元)', '实际成本(元)', '总体完成比例%', '需求完成比例%', '设计完成比例%', '开发完成比例%', 'sit完成比例%', 'uat完成比例%', '上线状态'];
          keyList = ['seqNo', 'menuName', 'planStatus', 'chargeUsername', 'onlineTime', 'planStartTime', 'actStartTime', 'planEndTime', 'actEndTime', 'planWorkload', 'actWorkload', 'planCostAmount', 'actCostAmount', 'finishRate', 'demandRate', 'designRate', 'devRate', 'sitRate', 'uatRate', 'onlineStatus'];
          list = this.$refs.xmMenuWithPlan.xmMenusTreeData;
          pageNum = this.$refs.xmMenuWithPlan.pageInfo.pageNum;
        }
        const filename = `${this.selProject.name}_${this.infotype}_第${pageNum}页`;
				const data = this.formatJson(keyList, list);

				import('@/vendor/Export2Excel').then(excel => {
					excel.export_json_to_excel({
						header,
						data,
						filename,
						// autoWidth: this.autoWidth,
						bookType: 'xlsx'
					})
					this.downloadLoading = false
				})
			},
			formatJson(filterVal, jsonData, dataList = []) {
        if (this.infotype == '任务') {
          jsonData.forEach(v => {
            const row = filterVal.map(j => {
              let key = '';
              return v[j];
            })
          dataList.push(row);
            if (v.children && v.children.length) {
              dataList = this.formatJson(filterVal, v.children, dataList);
            }
          })
          return dataList;
        } else if (this.infotype == '阶段计划') {
          const bizFlowStateDict = {
            0: '未发审',
            1: '审核中',
            2: '已通过',
            3: '未通过',
            4: '已取消'
          }
          jsonData.forEach(v => {
            const row = filterVal.map(j => {
              let key = '';
              if(j == 'phaseStatus') {
                return this.$refs.xmProjectPhaseMng.formateOption('xmPhaseStatus', v.phaseStatus);
              } else if(j == 'bizFlowState') {
                return `${bizFlowStateDict[parseInt(v[j]) || 0]}`;
              } else {
                return v[j];
              }
            })
            dataList.push(row);
            if (v.children && v.children.length) {
              dataList = this.formatJson(filterVal, v.children, dataList);
            }
          })
          return dataList;
        } else if (this.infotype == '故事监控') {
          jsonData.forEach(v => {
            const row = filterVal.map(j => {
              let key = '';
              if(j == 'planStatus') {
                key = 'xmMenuPlanStatus';
              } else if(j == 'onlineStatus') {
                return parseInt(v[j]) ? '已上线' : '未上线';
              } else {
                return v[j];
              }
              const options = this.$refs.xmMenuWithPlan.options;
              if(options[key]==undefined || options[key]==null || options[key].length==0   ){
                return v[j];
              }
              var rowData=options[key].filter(i=>i.optionValue==v[j])
              if(rowData.length>0){
                return rowData[0].optionName
              }else{
                return v[j];
              }
            });
            dataList.push(row);
            if (v.children && v.children.length) {
              dataList = this.formatJson(filterVal, v.children, dataList);
            }
          })
          return dataList;
        }
      },
      getDateString(dateStr){
				if(dateStr==null || dateStr=="" || dateStr==undefined){
					return ""
				}else{
					return dateStr.substr(0,10);
				}
			},
			goBack(){
				this.$router.back()
			}

		},//end methods
		components: { 
			xmTaskMng,
			xmProjectPhaseMng,
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
			xmProjectGroupSelect,
			XmIterationForProjectComplex, 
			XmProjectOverviewComplex,
			XmProductForProjectComplex,
			//在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {

      });
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 .menus{
	 .el-menu-item{
		 padding-left: 0px !important;
	 }
 }
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
