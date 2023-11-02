<template>
	<section class="page-container  padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectStates">查询</el-button>
			<el-button type="primary" @click="showAdd">+项目指标日统计表</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
		</el-row>
		<el-row class="page-main ">
			<!--列表 XmProjectState 项目指标日统计表-->
			<el-table :data="xmProjectStates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="45"></el-table-column>
				<el-table-column sortable type="index" width="45"></el-table-column>
				<el-table-column prop="projectId" label="项目编号" min-width="80" ></el-table-column>
				<el-table-column prop="bizDate" label="统计日期yyyy-mm-dd类型" min-width="80" ></el-table-column>
				<el-table-column prop="totalFileCnt" label="文件数据" min-width="80" ></el-table-column>
				<el-table-column prop="totalBugCnt" label="bug数目" min-width="80" ></el-table-column>
				<el-table-column prop="totalTaskCnt" label="任务数" min-width="80" ></el-table-column>
				<el-table-column prop="totalBudgetNouserAmount" label="项目总非人力预算-来自项目表" min-width="80" ></el-table-column>
				<el-table-column prop="projectName" label="项目名称" min-width="80" ></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="totalStaffCnt" label="总参与人数" min-width="80" ></el-table-column>
				<el-table-column prop="calCtime" label="统计执行日期" min-width="80" ></el-table-column>
				<el-table-column prop="calStatus" label="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostNouserAmount" label="项目总非人力成本" min-width="80" ></el-table-column>
				<el-table-column prop="totalClosedBugCnt" label="已关闭bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalResolvedBugCnt" label="已解决bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteTaskCnt" label="已完成任务总数-来自任务表" min-width="80" ></el-table-column>
				<el-table-column prop="totalPhaseCnt" label="项目计划数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompletePhaseCnt" label="项目计划已完成数" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedPayAmount" label="待付款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishPayAmount" label="已付款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedColAmount" label="待收款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishColAmount" label="已收款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostUserAmount" label="项目总人力成本" min-width="80" ></el-table-column>
				<el-table-column prop="totalBudgetIuserAmount" label="项目总内部人力预算-来自项目表" min-width="80" ></el-table-column>
				<el-table-column prop="totalPlanWorkload" label="项目总预算工作量-来自项目表" min-width="80" ></el-table-column>
				<el-table-column prop="totalRiskCnt" label="项目风险总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteRiskCnt" label="已完成风险总数" min-width="80" ></el-table-column>
				<el-table-column prop="branchId" label="机构编号" min-width="80" ></el-table-column>
				<el-table-column prop="branchName" label="机构名称" min-width="80" ></el-table-column>
				<el-table-column prop="totalBudgetOuserAmount" label="项目总外购人力预算-来自项目表" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteWorkload" label="已完成工作量-来自计划中实际完成工作量" min-width="80" ></el-table-column>
				<el-table-column prop="todayNewBugCnt" label="今日新增bug数目" min-width="80" ></el-table-column>
				<el-table-column prop="todayResolvedBugCnt" label="今日解决bug数目" min-width="80" ></el-table-column>
				<el-table-column prop="todayClosedBugCnt" label="今日关闭bug" min-width="80" ></el-table-column>
				<el-table-column prop="todayNewTaskCnt" label="今日新增任务数" min-width="80" ></el-table-column>
				<el-table-column prop="todayCompleteTaskCnt" label="今日完成任务数" min-width="80" ></el-table-column>
				<el-table-column prop="todayNewPhaseCnt" label="今日新增计划数目" min-width="80" ></el-table-column>
				<el-table-column prop="todayCompletePhaseCnt" label="今日完成计划数目" min-width="80" ></el-table-column>
				<el-table-column prop="todayNewStaffCnt" label="今日新增员工数" min-width="80" ></el-table-column>
				<el-table-column prop="todaySubStaffCnt" label="今日退出员工数" min-width="80" ></el-table-column>
				<el-table-column prop="todayNewPlanWorkload" label="今日新增预算工作量" min-width="80" ></el-table-column>
				<el-table-column prop="todayNewActWorkload" label="今日新增实际工作量" min-width="80" ></el-table-column>
				<el-table-column prop="todayNeedColAmount" label="今日需要收款金额" min-width="80" ></el-table-column>
				<el-table-column prop="todayFinishColAmount" label="今日完成收款金额" min-width="80" ></el-table-column>
				<el-table-column prop="todayCostUserAmount" label="今日人力成本金额" min-width="80" ></el-table-column>
				<el-table-column prop="todayCostIuserAmount" label="今日内部人力成本金额" min-width="80" ></el-table-column>
				<el-table-column prop="todayCostOuserAmount" label="今日外购人力成本金额" min-width="80" ></el-table-column>
				<el-table-column prop="todayCostNouserAmount" label="今日非人力成本金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostIuserAmount" label="项目总内部人力成本金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostOuserAmount" label="项目总外购人力成本金额" min-width="80" ></el-table-column>
				<el-table-column prop="todayNeedPayAmount" label="今日新增待付款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="todayFinishPayAmount" label="今日新增完成付款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="todayNewRiskCnt" label="今日新增项目风险总数" min-width="80" ></el-table-column>
				<el-table-column prop="todayCompleteRiskCnt" label="今日完成风险总数" min-width="80" ></el-table-column>
				<el-table-column prop="todayNewFileCnt" label="今日新增文档" min-width="80" ></el-table-column>
				<el-table-column prop="finishRate" label="项目进度0~100之间，来自任务表" min-width="80" ></el-table-column>
				<el-table-column prop="totalActiveBugCnt" label="激活的bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalConfirmedBugCnt" label="已解决bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="projectStatus" label="项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停" min-width="80" ></el-table-column>
				<el-table-column prop="totalActWorkload" label="实际总工作量，来自任务表" min-width="80" ></el-table-column>
				<el-table-column prop="totalActOutWorkload" label="实际外购总工作量，来自任务表" min-width="80" ></el-table-column>
				<el-table-column prop="totalActInnerWorkload" label="实际内部总工作量，来自任务表" min-width="80" ></el-table-column>
				<el-table-column prop="totalTaskBudgetCostAt" label="已经分配到任务的总预算" min-width="80" ></el-table-column>
				<el-table-column prop="totalTaskOutCnt" label="外购任务数，来自任务表" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedPayCnt" label="待付款笔数" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishPayCnt" label="完成付款总比数" min-width="80" ></el-table-column>
				<el-table-column prop="todayConfirmedBugCnt" label="今日确认bug" min-width="80" ></el-table-column>
				<el-table-column prop="todayActiveBugCnt" label="今日激活的bug" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishPayUserCnt" label="已付款总人数" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedPayUserCnt" label="待付款总人数" min-width="80" ></el-table-column>
				<el-table-column prop="todayNeedPayUserCnt" label="今日待付款总人数" min-width="80" ></el-table-column>
				<el-table-column prop="todayFinishPayUserCnt" label="今日已付款总人数" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right">
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

			<!--编辑 XmProjectState 项目指标日统计表界面-->
			<el-drawer title="编辑项目指标日统计表" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-state-edit :xm-project-state="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-state-edit>
			</el-drawer>

			<!--新增 XmProjectState 项目指标日统计表界面-->
			<el-drawer title="新增项目指标日统计表" :visible.sync="addFormVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-project-state-add :xm-project-state="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-state-add>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库

	import { listXmProjectState, delXmProjectState, batchDelXmProjectState } from '@/api/xm/core/xmProjectState';
	import  XmProjectStateAdd from './XmProjectStateAdd';//新增界面
	import  XmProjectStateEdit from './XmProjectStateEdit';//修改界面
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjectStates: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmProjectState界面是否显示
				//新增xmProjectState界面初始化数据
				addForm: {
					projectId:'',bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',projectName:'',id:'',totalStaffCnt:'',calCtime:'',calStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetIuserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOuserAmount:'',totalCompleteWorkload:'',todayNewBugCnt:'',todayResolvedBugCnt:'',todayClosedBugCnt:'',todayNewTaskCnt:'',todayCompleteTaskCnt:'',todayNewPhaseCnt:'',todayCompletePhaseCnt:'',todayNewStaffCnt:'',todaySubStaffCnt:'',todayNewPlanWorkload:'',todayNewActWorkload:'',todayNeedColAmount:'',todayFinishColAmount:'',todayCostUserAmount:'',todayCostIuserAmount:'',todayCostOuserAmount:'',todayCostNouserAmount:'',totalCostIuserAmount:'',totalCostOuserAmount:'',todayNeedPayAmount:'',todayFinishPayAmount:'',todayNewRiskCnt:'',todayCompleteRiskCnt:'',todayNewFileCnt:'',finishRate:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',todayConfirmedBugCnt:'',todayActiveBugCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',todayNeedPayUserCnt:'',todayFinishPayUserCnt:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectState界面初始化数据
				editForm: {
					projectId:'',bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',projectName:'',id:'',totalStaffCnt:'',calCtime:'',calStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetIuserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOuserAmount:'',totalCompleteWorkload:'',todayNewBugCnt:'',todayResolvedBugCnt:'',todayClosedBugCnt:'',todayNewTaskCnt:'',todayCompleteTaskCnt:'',todayNewPhaseCnt:'',todayCompletePhaseCnt:'',todayNewStaffCnt:'',todaySubStaffCnt:'',todayNewPlanWorkload:'',todayNewActWorkload:'',todayNeedColAmount:'',todayFinishColAmount:'',todayCostUserAmount:'',todayCostIuserAmount:'',todayCostOuserAmount:'',todayCostNouserAmount:'',totalCostIuserAmount:'',totalCostOuserAmount:'',todayNeedPayAmount:'',todayFinishPayAmount:'',todayNewRiskCnt:'',todayCompleteRiskCnt:'',todayNewFileCnt:'',finishRate:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',todayConfirmedBugCnt:'',todayActiveBugCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',todayNeedPayUserCnt:'',todayFinishPayUserCnt:''
				}
				/**begin 自定义属性请在下面加 请加备注**/

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmProjectStates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectStates();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmProjectStates();
			},
			searchXmProjectStates(){
				 this.pageInfo.count=true;
				 this.getXmProjectStates();
			},
			//获取列表 XmProjectState 项目指标日统计表
			getXmProjectStates() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listXmProjectState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectStates = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectState 项目指标日统计表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectState 项目指标日统计表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectStates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectState
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmProjectState
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectState(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmProjectStates();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectState
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmProjectState(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmProjectStates();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/


			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'xm-project-state-add':XmProjectStateAdd,
		    'xm-project-state-edit':XmProjectStateEdit,
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				this.getXmProjectStates();
        	});
        	/** 举例，
    		initSimpleDicts( "all",["sex","grade"] ).then(res=>{
				if(res.data.tips.isOk){
 					this.dicts=res.data.data
				}
			});
			**/
		}
	}

</script>

<style scoped>

</style>
