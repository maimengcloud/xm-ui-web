<template>
	<section>
		<el-row class="app-container app-height">   
			<el-tabs :tab-position="tabPosition"  v-model="infotype" @tab-click="handleClick" stretch=true   class="tabs">
				<el-tab-pane  name="项目概览" class="tab-pannel"> 
					 <span slot="label"><i class="el-icon-s-data"></i>项目概览</span>
					<xm-detail v-if="infotype=='项目概览'" :sel-project="selProject" @submit="afterEditSubmit"></xm-detail>
				</el-tab-pane>
				<el-tab-pane label="迭代" name="迭代"> 
					 <span slot="label"><i class="el-icon-document-copy"></i>迭代</span>
					 <xm-iteration-mng v-if="infotype=='迭代'" ref="xmIterationMng" :sel-project="selProject" ></xm-iteration-mng> 
				</el-tab-pane>
				<el-tab-pane label="产品" name="产品">
					 <span slot="label"><i class="el-icon-s-flag"></i>产品</span>
					 <xm-product-mng v-if="infotype=='产品'" ref="xmProductMng" :sel-project="selProject" ></xm-product-mng> 
				</el-tab-pane>
				<el-tab-pane label="故事" name="用户故事">
					 <span slot="label"><i class="el-icon-document"></i>故事</span>
					<xm-menu-mng v-if="infotype=='用户故事'" :sel-project="selProject"></xm-menu-mng> 

				</el-tab-pane>
				<el-tab-pane label="任务" name="任务">
					 <span slot="label"><i class="el-icon-s-operation"></i>任务</span>
					<xm-task-mng v-if="infotype=='任务'" ref="xmTaskMng" :sel-project="selProject" ></xm-task-mng>

				</el-tab-pane>
				<el-tab-pane label="缺陷" name="缺陷">
					 <span slot="label"><i class="el-icon-question"></i>缺陷</span>
					 <xm-question v-if="infotype=='缺陷'" :qtype="'bug'" :sel-project='selProject' ref="xmQuestion"></xm-question>

				</el-tab-pane>
				<el-tab-pane label="团队" name="团队">
					 <span slot="label"><i class="el-icon-user-solid"></i>团队</span>					
					 <xm-group-mng v-if="infotype=='团队'" :sel-project="selProject"></xm-group-mng>  


				</el-tab-pane>
				<el-tab-pane label="文档" name="文档">
					 <span slot="label"><i class="el-icon-document"></i>文档</span>
					<xm-file-mng v-if="infotype=='文档'" :sel-project="selProject"></xm-file-mng> 

				</el-tab-pane>
				<el-tab-pane label="阶段计划" name="阶段计划">
					 <span slot="label"><i class="el-icon-odometer"></i>阶段计划</span>
					 <xm-project-phase-mng v-if="infotype=='阶段计划'" ref="xmProjectPhaseMng" :sel-project="selProject" ></xm-project-phase-mng>

				</el-tab-pane>
				<el-tab-pane label="测试计划" name="测试计划">
					 <span slot="label"><i class="el-icon-odometer"></i>测试计划</span>
					<xm-test-case-exec-mng v-if="infotype=='测试计划'" :visible="infotype=='测试计划'"  :sel-project='selProject' ref="xmQuestion"></xm-test-case-exec-mng> 

				</el-tab-pane>
				<el-tab-pane label="故事监控" name="故事监控">
					 <span slot="label"><i class="el-icon-video-camera"></i>故事监控</span>
 					<xm-menu-with-plan v-if="infotype=='故事监控'" ref="xmMenuWithPlan" :sel-project="selProject"></xm-menu-with-plan> 

				</el-tab-pane>
				<el-tab-pane label="项目监控" name="项目监控">
					 <span slot="label"><i class="el-icon-video-camera"></i>项目监控</span>
					<xm-project-state-mng v-if="infotype=='项目监控'" :sel-project="selProject"></xm-project-state-mng> 

				</el-tab-pane>
				<el-tab-pane label="预算" name="预算">
					 <span slot="label"><i class="el-icon-coin"></i>预算</span>
					<xm-budget v-if="infotype=='预算'" :sel-project="selProject"></xm-budget>

				</el-tab-pane>
				<el-tab-pane label="费用" name="费用">
					 <span slot="label"><i class="el-icon-coin"></i>费用</span>
					 <xm-cost v-if="infotype=='费用'" :sel-project="selProject"></xm-cost>

				</el-tab-pane>
				<el-tab-pane label="考核" name="考核">
					 <span slot="label"><i class="el-icon-view"></i>考核</span> 
					 <xm-project-kpi v-if="infotype=='考核'"  :sel-project="selProject"></xm-project-kpi>

				</el-tab-pane> 
				<el-tab-pane label="日志" name="日志">
					 <span slot="label"><i class="el-icon-edit-outline"></i>日志</span>
					<xm-record v-if="infotype=='日志'" :visible="infotype=='日志'" :sel-project="selProject"></xm-record>

				</el-tab-pane>
				<el-tab-pane label="合同管理" name="合同管理">
					 <span slot="label"><i class="el-icon-s-data"></i>合同管理</span>
					<xm-contract v-if="infotype=='合同管理'" :sel-project="selProject"></xm-contract>

				</el-tab-pane> 
				<el-tab-pane label="环境清单" name="环境清单">
					 <span slot="label"><i class="el-icon-setting"></i>环境清单</span>
					<xm-env-list v-if="infotype=='环境清单'" :sel-project="selProject"></xm-env-list>  
				</el-tab-pane> 
				<el-tab-pane label="风险" name="风险">
					 <span slot="label"><i class="el-icon-question"></i>风险</span>
					<xm-question v-if="infotype=='风险'" :qtype="'risk'" :sel-project='selProject' ref="xmRisk"></xm-question>
				</el-tab-pane> 
				<el-tab-pane label="论坛" name="论坛">
					 <span slot="label"><i class="el-icon-date"></i>论坛</span> 
				</el-tab-pane>
				<el-tab-pane label="即聊" name="即聊">
					 <span slot="label"><i class="el-icon-date"></i>即聊</span> 
				</el-tab-pane>
				<el-tab-pane label="客服" name="客服">
					 <span slot="label"><i class="el-icon-date"></i>客服</span>

				</el-tab-pane> 
			</el-tabs> 
		</el-row>  
		
		<el-dialog title="选中团队成员" :visible.sync="groupUserVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
			<xm-project-group-select :sel-project="selProject" :visible="groupUserVisible" is-select-multi-user="1" @user-confirm="onUserSelected"></xm-project-group-select>
		</el-dialog> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProject,editStatus , delXmProject, batchDelXmProject } from '@/api/xm/core/xmProject';
	import  XmProjectAdd from './XmProjectAdd';//新增界面
	import  XmProjectEdit from './XmProjectEdit';//修改界面
	import { mapGetters } from 'vuex';
	import xmTaskMng from '../xmTask/XmTaskMng';
	import xmGroupMng from '../xmProjectGroup/XmProjectGroupMng';
	import xmProjectGroupSelect from '../xmProjectGroup/XmProjectGroupSelect';

	import xmExchange from '../xmExchange/XmExchangeMng';
	import xmQuestion from '../xmQuestion/XmQuestionMng';
	import xmFileMng from '../xmFile/XmFileMng';
	import xmDetail from './XmProjectDetail';
	import xmProjectKpi from '../xmProjectKpi/XmProjectKpiMng';
	import xmRecord from '../xmRecord/XmRecordMng';
	import xmCost from './XmProjectCost';
	import xmBudget from './XmProjectBudgetCost';
	import xmContract from '../xmProjectContract/XmProjectContractMng';
	import xmEnvList from '../xmProjectEnvList/XmProjectEnvListMng';
	import xmProjectPhaseMng from '../xmProjectPhase/XmProjectPhaseMng'; 
	import xmMenuMng from '../xmMenu/XmMenuMng';
	import xmMenuWithPlan from '../xmMenu/XmMenuWithPlan';
	import xmProjectStateMng from '../xmProjectState/XmProjectStateMng';
	import xmTestCaseExecMng from '../xmTestCaseExec/XmTestCaseExecMng';
	import xmIterationMng from '../xmIteration/XmIterationMng';
	import xmProductMng from '../xmProduct/XmProductMng';


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
			xmIterationMng,
			xmProductMng
			//在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
			 
      }); 
		}
	}
</script>

<style scoped> 
.tabs{  
	height: calc(98vh);
}
.tab-pannel{ 
	overflow: auto;   
	height: calc(98vh);
} 
.app-height{
	height: calc(100vh);
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>