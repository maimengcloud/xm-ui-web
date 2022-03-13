<template>
	<section  class="page-container ">
		<el-row>
			<el-menu :default-active="infotype"   mode="horizontal"  @select="setInfotype"   class="menus" background-color="rgb(48, 65, 86)" text-color="rgb(191, 203, 217)" active-text-color="#409eff">

				<el-menu-item  index="返回" > 
						<span slot="title"><i class="el-icon-back" ></i></span>  
				</el-menu-item> 
				<el-menu-item  index="迭代概览" >
					<span slot="title" style="font-size:18px;color:#409eff;" class="hidden-md-and-down">
 						<font v-if="xmIteration.iterationName.length>=15"><strong>迭代:&nbsp;&nbsp;{{xmIteration.iterationName.substring(0,15)}}</strong></font>
						<font type="danger" v-else><strong>迭代:&nbsp;&nbsp;{{xmIteration.iterationName}}</strong></font> 
					</span>
					<span slot="title" style="color:#409eff;" class="hidden-lg-and-up">
 						<font v-if="xmIteration.iterationName.length>=15">迭代:&nbsp;{{xmIteration.iterationName.substring(0,15)}}</font>
						<font type="danger" v-else>迭代:&nbsp;{{xmIteration.iterationName}}</font> 
					</span>
				</el-menu-item> 
				<el-menu-item label="项目" index="项目" class="hidden-sm-and-down">
					 <span slot="title"><i class="el-icon-document"></i>项目</span> 
				</el-menu-item>
				<el-menu-item   index="产品" class="hidden-sm-and-down">
					 <span slot="title"><i class="el-icon-s-flag"></i>产品</span> 
				</el-menu-item>
				<el-menu-item label="需求" index="需求">
					 <span slot="title"><i class="el-icon-document"></i>需求</span>  
				</el-menu-item>
				<el-menu-item   index="任务">
					 <span slot="title"><i class="el-icon-s-operation"></i>任务</span> 
				</el-menu-item>
				<el-menu-item  index="缺陷">
					 <span slot="title"><i class="el-icon-question"></i>缺陷</span> 
				</el-menu-item> 
			</el-menu>
		   
   			<xm-iteration-overview-complex  v-if="infotype=='迭代概览'" :xm-iteration="xmIteration"></xm-iteration-overview-complex>
 			<xm-project-complex  v-if="infotype=='项目'" ref="xmProjectComplex" :xm-iteration="xmIteration"></xm-project-complex>
			 <xm-product-for-project-complex  v-if="infotype=='产品'" ref="xmProductComplex" :xm-iteration="xmIteration"></xm-product-for-project-complex>
			 <xm-menu-mng v-if="infotype=='需求'" :xm-iteration="xmIteration" :disabled-mng="false"></xm-menu-mng>
			 <xm-task-mng v-if="infotype=='任务'" ref="xmTaskMng" ptype="" queryScope="task" :xm-iteration="xmIteration" ></xm-task-mng>
			  <xm-question v-if="infotype=='缺陷'" :qtype="'bug'" :xm-iteration='xmIteration' ref="xmQuestion"></xm-question>
			  <xm-group-mng v-if="infotype=='团队'" :xm-iteration="xmIteration"></xm-group-mng>
  			<el-drawer title="选中团队成员" :visible.sync="groupUserVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				<xm-group-select :xm-iteration="xmIteration" :visible="groupUserVisible" is-select-multi-user="1" @user-confirm="onUserSelected"></xm-group-select>
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
	import xmGroupMng from '../xmGroup/XmGroupMng';
	import xmGroupSelect from '../xmGroup/XmGroupSelect';

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
	import xmPhaseMng from '../xmPhase/XmPhaseMng';
	import xmMenuMng from '../xmMenu/XmMenuMng';
	import xmMenuWithPlan from '../xmMenu/XmMenuWithPlan';
	import xmProjectStateMng from '../xmProjectState/XmProjectStateMng';
	import xmTestCaseExecMng from '../xmTestCaseExec/XmTestCaseExecMng';  
	import XmIterationForProjectComplex from '../xmIteration/XmIterationForProjectComplex.vue'; 
	import XmIterationOverviewComplex from '../xmIteration/XmIterationOverviewComplex.vue';
	import XmProductForProjectComplex from '../xmProduct/XmProductForProjectComplex.vue';
 import XmProjectComplex from '../xmProject/XmProjectComplex.vue';


	export default {
		props: ["xmIteration","visible"],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]),
		},
		watch:{
			xmIteration:function(xmIteration){
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
				infotype:"迭代概览",
				load:{list:false,edit:false},
        groupUserVisible:false,
        exportArr: ['任务', '计划', '需求监控']
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
		  
			if(infotype=='返回'){
				this.goBack()
			}
	  },
      handleExport() {
        this.downloadLoading = true
        let list = [];
        let header = [];
        let keyList = [];
        let pageNum = 1;
        let infotypeKey = '';
        if (this.infotype === '任务') {
          header = ['序号', '任务名称', '需求', '预算(万)', '工作量（人时）', '执行人', '进度', '任务开始时间', '任务结束时间', '任务技能需求'];
          keyList = ['sortLevel', 'name', 'menuName', 'budgetCost', 'budgetWorkload', 'exeUsernames', 'rate', 'startTime', 'endTime', 'taskSkillNames'];
          list = this.$refs.xmTaskMng.tasksTreeData;
          pageNum = this.$refs.xmTaskMng.pageInfo.pageNum;
        } else if (this.infotype === '计划') {
          header = ['序号', '计划名称', '开始时间', '结束时间', '进度(%)', '状态', '计划人数', '实际人数', '计划工期', '实际工期',  '计划工作量（人时）', '实际工作量（人时）', '计划非人力成本(元)', '实际非人力成本(元)', '计划内购人力成本(元)', '实际内购人力成本(元)', '计划外购人力成本(元)', '实际外购人力成本(元)', '计划成本合计(元)', '实际成本合计(元)', '审批状态', '备注'];
          keyList = ['seqNo', 'name', 'beginDate', 'endDate', 'actRate', 'phaseStatus', 'budgetOuserCnt', 'actStaffNu', 'budgetHours', 'actHours', 'budgetWorkload', 'actWorkload', 'budgetNouserAt', 'actNouserAt', 'budgetIuserAt', 'actIuserAt', 'budgetOuserAt', 'actOuserAt', 'budgetCostAt', 'actCostAt', 'bizFlowState', 'remark'];
          list = this.$refs.xmPhaseMng.projectPhaseTreeData;
          pageNum = this.$refs.xmPhaseMng.pageInfo.pageNum;

        } else if (this.infotype === '需求监控') {
          header = ['序号', '需求名称', '计划状态', '负责人', '上线时间', '计划开始时间', '实际开始时间', '计划结束时间', '实际结束时间', '计划工作量(人时)', '实际工作量(人时)', '计划成本(元)', '实际成本(元)', '总体完成比例%', '需求完成比例%', '设计完成比例%', '开发完成比例%', 'sit完成比例%', 'uat完成比例%', '上线状态'];
          keyList = ['seqNo', 'menuName', 'planStatus', 'chargeUsername', 'onlineTime', 'planStartTime', 'actStartTime', 'planEndTime', 'actEndTime', 'planWorkload', 'actWorkload', 'planCostAmount', 'actCostAmount', 'finishRate', 'demandRate', 'designRate', 'devRate', 'sitRate', 'uatRate', 'onlineStatus'];
          list = this.$refs.xmMenuWithPlan.xmMenusTreeData;
          pageNum = this.$refs.xmMenuWithPlan.pageInfo.pageNum;
        }
        const filename = `${this.xmIteration.iterationName}_${this.infotype}_第${pageNum}页`;
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
        } else if (this.infotype == '计划') {
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
                return this.$refs.xmPhaseMng.formateOption('xmPhaseStatus', v.phaseStatus);
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
        } else if (this.infotype == '需求监控') {
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
			xmPhaseMng,
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
