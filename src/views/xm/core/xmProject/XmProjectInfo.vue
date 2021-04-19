<template>
	<section>
		<el-row class="app-container"> 
			<div class="project-info" v-loading.lock="load.list || load.edit">
				<div class="info-type">
					<el-radio-group v-model="infotype" size="medium">
						<el-radio-button label="任务"></el-radio-button>
						<el-radio-button label="阶段计划"></el-radio-button>
						<el-radio-button label="团队"></el-radio-button>
						<el-radio-button label="风险"></el-radio-button>
						<el-radio-button label="问题"></el-radio-button>
						<el-radio-button label="测试计划"></el-radio-button> 
						<el-radio-button label="文档"></el-radio-button>
						<el-radio-button label="用户故事"></el-radio-button>
						<el-radio-button label="故事监控"></el-radio-button>
						<el-radio-button label="项目监控"></el-radio-button> 
						<el-radio-button label="详情"></el-radio-button>
						<el-radio-button label="考核"></el-radio-button>
						<el-radio-button label="日志"></el-radio-button>
						<el-radio-button label="费用"></el-radio-button>
						<el-radio-button label="预算"></el-radio-button>
						<el-radio-button label="合同管理"></el-radio-button>
						<el-radio-button label="环境清单"></el-radio-button> 
					</el-radio-group>
					<el-popover
						placement="top-start"
						title="更多操作"
						width="400"
						trigger="hover"
						content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
						  
						<el-button type="primary" @click="toArchive" round>论坛</el-button>
						<el-button type="success" @click="toIm" round>即聊</el-button> 
						<el-button type="warning" @click="toHelpMe" round>客服</el-button>
						<el-button type="primary" @click="handleExport" round v-if="exportArr.includes(infotype)">导出</el-button> 
						<el-button size="mini" slot="reference" icon="el-icon-more" circle></el-button>
					</el-popover>
				</div>
				<div class="info-detail">
					<xm-task-mng v-if="infotype=='任务'" ref="xmTaskMng" :sel-project="selProject" ></xm-task-mng>
					<xm-project-phase-mng v-if="infotype=='阶段计划'" ref="xmProjectPhaseMng" :sel-project="selProject" ></xm-project-phase-mng>
					<xm-group-mng v-if="infotype=='团队'" :sel-project="selProject"></xm-group-mng>  
					<xm-question v-if="infotype=='风险'" :qtype="'risk'" :sel-project='selProject' ref="xmRisk"></xm-question>
					<xm-question v-if="infotype=='问题'" :qtype="'bug'" :sel-project='selProject' ref="xmQuestion"></xm-question>
					<xm-test-case-exec-mng v-if="infotype=='测试计划'" :visible="infotype=='测试计划'"  :sel-project='selProject' ref="xmQuestion"></xm-test-case-exec-mng> 
					<xm-file-mng v-if="infotype=='文档'" :sel-project="selProject"></xm-file-mng> 
					<xm-menu-mng v-if="infotype=='用户故事'" :sel-project="selProject"></xm-menu-mng> 
					<xm-menu-with-plan v-if="infotype=='故事监控'" ref="xmMenuWithPlan" :sel-project="selProject"></xm-menu-with-plan> 
					<xm-project-state-mng v-if="infotype=='项目监控'" :sel-project="selProject"></xm-project-state-mng> 
					<xm-detail v-if="infotype=='详情'" :sel-project="selProject" @submit="afterEditSubmit"></xm-detail>
					<xm-project-kpi v-if="infotype=='考核'"  :sel-project="selProject"></xm-project-kpi>
					<xm-record v-if="infotype=='日志'" :visible="infotype=='日志'" :sel-project="selProject"></xm-record>
					<xm-cost v-if="infotype=='费用'" :sel-project="selProject"></xm-cost>
					<xm-budget v-if="infotype=='预算'" :sel-project="selProject"></xm-budget>
					<xm-contract v-if="infotype=='合同管理'" :sel-project="selProject"></xm-contract>
					<xm-env-list v-if="infotype=='环境清单'" :sel-project="selProject"></xm-env-list> 
				</div>
			</div> 
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
				infotype:"任务",
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
			//在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
			 
      }); 
		}
	}
</script>

<style scoped>
.app-container{
	display: flex;
	padding: 10px;
	background: #e8edf7;
}
.project-handle{
	height: 820px;
	display: flex;
	align-items: center;
}
.project-list{
	padding-left: 10px;
	width: 310px;
	min-width: 310px;
	border-right: 1px solid #efefef;
	flex-grow: 1;
}
.project-search{
	display: flex;
	height: 50px;
	text-align: right;
	padding: 7px 20px;
	background: #fafbfc;
}
.search-btn{
	padding: 10px;
	border-radius: 0;
	border-left: 0;
}
.search-btn-show{
	color: #3a8ee6;
	background-color: #ecf5ff;
	outline: 0;
}
.project-show-end{
	height: 50px;
	background: skyblue;
}
.list{
	height: 720px;
	background: #fff;
	font-size: 14px;
	color: #666;
}
.list-item{
	padding: 8px 16px;
}
.list-item:hover{
	background: #f7f7f8;
}
.list-item:hover .project-btns{
	display:block;

}
.item-info{
	display: flex;
	align-items: center;
}
.item-info>.content{
	flex-grow: 1;
}
.item-info>.content>div:last-child{
	margin-top: 2px;
	color: #999;
	font-size:12px;
}
.project-btns{
	position: absolute;
	top: 0;
	right: 0;
	display:none;
	flex-grow: 1;
	font-size: 12px;
	text-align: right;
}
.project-btns>button{
	padding: 0;
	font-size: 12px;
}
.rate{
	width: 40px;
	text-align: right;
}


.show-project{
	width: 10px;
}
.show-project>button{
	padding-left: 0;
	padding-right: 0;
	width: 100%;
}
.show-project i{
	margin-left: -4px;
	font-size: 16px;
	font-weight: bold;
}
.project-info{
	width: 75%;
	flex-grow: 1;
	/* height: 820px; */
	background: #fff;
}
.info-type{
	background: #fafbfc;
	border-bottom: 1px solid #efefef; 
}
.info-type>div{
	padding-left: 10px;
	line-height: 50px;
}
.info-type >>> .el-radio-button__inner{
	background: transparent;
	border: 0;
	box-shadow: 0 0 0 0 !important;
}
.info-type .is-active >>> .el-radio-button__inner{
	color: #409EFF !important;
	border: 1px solid #409EFF;
}

/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>