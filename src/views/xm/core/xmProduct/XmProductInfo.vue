<template>
	<section  class="page-container ">
		<el-row>
			<el-menu :default-active="infotype"   mode="horizontal"  @select="setInfotype"   class="menus" background-color="rgb(48, 65, 86)" text-color="rgb(191, 203, 217)" active-text-color="#409eff">
				<el-menu-item  index="返回" > 
					<span slot="title" @click.stop="goBack"><i class="el-icon-back" ></i></span>  
				</el-menu-item>
				<el-menu-item  index="产品概览" > 
					<span slot="title" style="font-size:18px;color:#409eff;" class="hidden-md-and-down">
  						<font v-if="xmProduct.productName.length>=15"> <strong> 产品:&nbsp;{{xmProduct.productName.substring(0,15)}}</strong></font>
						<font type="danger" v-else> <strong>产品:&nbsp;{{xmProduct.productName}}</strong></font> 
					</span> 
					<span slot="title" style="color:#409eff;" class="hidden-lg-and-up">
  						<font v-if="xmProduct.productName.length>=15"> 产品:&nbsp;{{xmProduct.productName.substring(0,15)}}</font>
						<font type="danger" v-else> 产品:&nbsp;{{xmProduct.productName}}</font> 
					</span> 
				</el-menu-item>
				<el-menu-item   index="迭代" class="hidden-sm-and-down">
					 <span slot="title" ><i class="el-icon-document-copy"  ></i>迭代</span> 
				</el-menu-item> 
				
				<el-menu-item label="项目" index="项目" class="hidden-sm-and-down">
					 <span slot="title"><i class="el-icon-document"  ></i>项目</span> 
				</el-menu-item>
				<el-menu-item label="需求" index="需求">
					 <span slot="title"><i class="el-icon-document"  ></i>需求</span>
				</el-menu-item>
				<el-submenu index="任务">
					<template slot="title">任务</template>
						<el-menu-item   index="产品任务">
							<span slot="title"><i class="el-icon-view"></i>产品任务</span> 
						</el-menu-item>
						<el-menu-item index="项目任务">
							<span slot="title"><i class="el-icon-video-camera"></i>项目任务</span>
						</el-menu-item> 
				</el-submenu > 
				<el-menu-item  index="缺陷">
					 <span slot="title"><i class="el-icon-question"  ></i>缺陷</span>
				</el-menu-item> 
				<el-submenu index="团队">
					<template slot="title">团队</template>
						<el-menu-item   index="产品团队">
							<span slot="title"><i class="el-icon-solid"></i>产品团队</span> 
						</el-menu-item>
						<el-menu-item index="项目团队">
							<span slot="title"><i class="el-icon-solid"></i>项目团队</span>
						</el-menu-item> 
				</el-submenu >
				<el-submenu index="计划">
					<template slot="title">计划</template>
						<el-menu-item   index="产品计划">
							<span slot="title"><i class="el-icon-view"></i>产品计划</span> 
						</el-menu-item>
						<el-menu-item index="项目计划">
							<span slot="title"><i class="el-icon-video-camera"></i>项目计划</span>
						</el-menu-item> 
				</el-submenu >
				<el-submenu index="财务" class="hidden-sm-and-down">
					<template slot="title">财务</template> 
						<el-menu-item   index="合同管理">
							<span slot="title"><i class="el-icon-s-data"></i>合同管理</span>
						</el-menu-item>
						<el-menu-item   index="预算">
							<span slot="title"><i class="el-icon-coin"></i>预算</span> 
						</el-menu-item>
						<el-menu-item  index="费用">
							<span slot="title"><i class="el-icon-coin"></i>费用</span> 
						</el-menu-item>
				</el-submenu >
				<el-submenu index="监控" class="hidden-sm-and-down">
					<template slot="title">监控</template>
						<el-menu-item   index="考核">
							<span slot="title"><i class="el-icon-view"></i>考核</span> 
						</el-menu-item>
						<el-menu-item index="项目监控">
							<span slot="title"><i class="el-icon-video-camera"></i>项目监控</span>
						</el-menu-item>
						<el-menu-item   index="需求监控">
							<span slot="title"><i class="el-icon-video-camera"></i>需求监控</span>
						</el-menu-item> 
						<el-menu-item   index="风险">
							<span slot="title"><i class="el-icon-question"></i>风险</span>
						</el-menu-item>
				</el-submenu >
				<el-submenu index="知识" class="hidden-md-and-down">
					<template slot="title">知识</template>
						<el-menu-item  index="文档" >
							<span slot="title"><i class="el-icon-document"></i>文档</span>
						</el-menu-item> 
						<el-menu-item   index="环境清单" >
							<span slot="title"><i class="el-icon-setting"></i>环境清单</span> 
						</el-menu-item>
						<el-menu-item   index="日志">
							<span slot="title"><i class="el-icon-edit-outline"></i>日志</span> 
						</el-menu-item> 
				</el-submenu > 
				<el-submenu index="更多">
					<template slot="title">更多 </template>
					<el-menu-item  index="需求监控" >
						<span slot="title"><i class="el-icon-video-camera"  ></i>需求监控</span>
					</el-menu-item>
					<el-menu-item   index="项目监控">
						<span slot="title"><i class="el-icon-video-camera"  ></i>项目监控</span>
					</el-menu-item> 
					<el-menu-item   index="合同管理">
						<span slot="title"><i class="el-icon-s-data"  ></i>合同管理</span>
					</el-menu-item>
					<el-menu-item   index="预算">
						<span slot="title"><i class="el-icon-coin"  ></i>预算</span>


					</el-menu-item>
					<el-menu-item   index="费用">
						<span slot="title"><i class="el-icon-coin"  ></i>费用</span>


					</el-menu-item>
					<el-menu-item   index="考核">
						<span slot="title"><i class="el-icon-view"  ></i>考核</span>


					</el-menu-item>
					<el-menu-item   index="日志">
						<span slot="title"><i class="el-icon-edit-outline"  ></i>日志</span>


					</el-menu-item>
					<el-menu-item   index="合同管理">
						<span slot="title"><i class="el-icon-s-data"  ></i>合同管理</span>


					</el-menu-item>
					<el-menu-item  index="环境清单">
						<span slot="title"><i class="el-icon-setting"  ></i>环境清单</span>

					</el-menu-item>
					<el-menu-item   index="风险">
						<span slot="title"><i class="el-icon-question"  ></i>风险</span>
					</el-menu-item>
					<el-menu-item   index="论坛">
						<span slot="title"><i class="el-icon-date"  ></i>论坛</span>
					</el-menu-item>
					<el-menu-item   index="即聊">
						<span slot="title"><i class="el-icon-date"  ></i>即聊</span>
					</el-menu-item>
					<el-menu-item  index="客服">
						<span slot="title"><i class="el-icon-date"  ></i>客服</span>

					</el-menu-item>
				</el-submenu>
			</el-menu>
		   
		  	<xm-product-overview-complex v-if="infotype=='产品概览'" :xm-product="xmProduct"></xm-product-overview-complex>  
			 <xm-iteration-for-link-complex  v-if="infotype=='迭代'" ref="xmIterationMng" :xm-product="xmProduct"></xm-iteration-for-link-complex>
 			 <xm-project-complex v-if="infotype=='项目'" ref="xmProjectForLink" :xm-product="xmProduct"></xm-project-complex> 
			  <xm-menu-mng v-if="infotype=='需求'" :xm-product="xmProduct"></xm-menu-mng>
			  <xm-task-mng v-if="infotype=='产品任务'" ptype="1" queryScope="task"  ref="productXmTaskMng" :xm-product="xmProduct" key="productXmTaskMng"></xm-task-mng>
			 <xm-task-mng v-if="infotype=='项目任务'" ptype="0" queryScope="task"  ref="projectXmTaskMng" :xm-product="xmProduct" key="projectXmTaskMng"></xm-task-mng>
			  <xm-question v-if="infotype=='缺陷'" :qtype="'bug'" :xm-product='xmProduct' ref="xmQuestion"></xm-question>
			  <xm-group-mng v-if="infotype=='项目团队'" pgClass="0" :xm-product="xmProduct" key="projectGroup"></xm-group-mng>
			  <xm-group-mng v-if="infotype=='产品团队'" pgClass="1" :xm-product="xmProduct" key="productGroup"></xm-group-mng>
			  <xm-file-mng v-if="infotype=='文档'" :xm-product="xmProduct"></xm-file-mng>
			  <xm-task-mng v-if="infotype=='产品计划'" ref="productPlan" ptype="1" queryScope="planTask"  :xm-product="xmProduct" key="productPlan"></xm-task-mng> 

			  <xm-task-mng v-if="infotype=='项目计划'" ref="projectPlan" ptype="0" queryScope="planTask"  :xm-product="xmProduct" key="projectPlan"></xm-task-mng> 
			  <!--<xm-phase-for-product v-if="infotype=='计划'" ref="xmPhaseMng" :xm-product="xmProduct" ></xm-phase-for-product> -->
			  <xm-test-case-exec-mng v-if="infotype=='测试计划'" :visible="infotype=='测试计划'"  :xm-product='xmProduct' ref="xmQuestion"></xm-test-case-exec-mng>
			<xm-menu-with-plan v-if="infotype=='需求监控'" ref="xmMenuWithPlan" :xm-product="xmProduct"></xm-menu-with-plan>
			<xm-project-state-mng v-if="infotype=='项目监控'" :xm-product="xmProduct"></xm-project-state-mng>
			<xm-budget v-if="infotype=='预算'" :xm-product="xmProduct"></xm-budget>
			 <xm-cost v-if="infotype=='费用'" :xm-product="xmProduct"></xm-cost>
			<xm-project-kpi v-if="infotype=='考核'"  :xm-product="xmProduct"></xm-project-kpi>
			<xm-record v-if="infotype=='日志'" :visible="infotype=='日志'" :xm-product="xmProduct"></xm-record>
			<xm-contract v-if="infotype=='合同管理'" :xm-product="xmProduct"></xm-contract>
			<xm-env-list v-if="infotype=='环境清单'" :xm-product="xmProduct"></xm-env-list>
			<xm-question v-if="infotype=='风险'" :qtype="'risk'" :xm-product='xmProduct' ref="xmRisk"></xm-question>
			<el-drawer title="选中团队成员" :visible.sync="groupUserVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				<xm-group-select :xm-product="xmProduct" :visible="groupUserVisible" is-select-multi-user="1" @user-confirm="onUserSelected"></xm-group-select>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProject,editStatus , delXmProject, batchDelXmProject } from '@/api/xm/core/xmProject';
	import  XmProjectAdd from '../xmProject/XmProjectAdd';//新增界面
	import  XmProjectEdit from '../xmProject/XmProjectEdit';//修改界面
	import  XmProjectComplex from '../xmProject/XmProjectComplex';//修改界面

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
	import xmPhaseForProduct from '../xmPhase/xmPhaseForProduct';
	import xmMenuMng from '../xmMenu/XmMenuMng';
	import xmMenuWithPlan from '../xmMenu/XmMenuWithPlan';
	import xmProjectStateMng from '../xmProjectState/XmProjectStateMng';
	import xmTestCaseExecMng from '../xmTestCaseExec/XmTestCaseExecMng';  
	import XmIterationForLinkComplex from '../xmIteration/XmIterationForLinkComplex.vue'; 
	import XmProductOverviewComplex from '../xmProduct/XmProductOverviewComplex.vue';
	import XmProductForProjectComplex from './XmProductForProjectComplex.vue';
import XmProjectForLink from '../xmProject/XmProjectForLink.vue';



	export default {
		props: ["xmProduct","visible"],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]),
		},
		watch:{
			xmProduct:function(xmProduct){
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
				infotype:"产品概览",
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
        const filename = `${this.xmProduct.productName}_${this.infotype}_第${pageNum}页`;
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
              const dicts = this.$refs.xmMenuWithPlan.dicts;
              if(dicts[key]==undefined || dicts[key]==null || dicts[key].length==0   ){
                return v[j];
              }
              var rowData=dicts[key].filter(i=>i.id==v[j])
              if(rowData.length>0){
                return rowData[0].name
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
			xmPhaseForProduct,
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
			XmIterationForLinkComplex, 
			XmProductOverviewComplex,
			XmProductForProjectComplex,
			XmProjectComplex,
XmProjectForLink,
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
