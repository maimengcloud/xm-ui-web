<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmBranchStates">查询</el-button>
			<el-button type="warning" v-loading="load.edit" @click="loadProjectStateToXmBranchState">刷新数据</el-button>
 		</el-row>
		<el-row class="page-main page-height-90"> 
			<!--列表 XmBranchState 机构内所有项目指标汇总-->
			<el-table :data="xmBranchStates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column sortable type="index" width="45"></el-table-column> 
				<el-table-column prop="branchId" label="机构" min-width="120" >
					<template scope="scope">
						{{scope.row.branchId}} {{scope.row.branchName?"-"+scope.row.branchName:""}}
					</template>
				</el-table-column>
				<el-table-column prop="calcTime" label="统计日期" width="160" ></el-table-column>
				<el-table-column prop="totalProgress" label="总进度%" min-width="80" >
					<template scope="scope">
						{{scope.row.totalProgress}}%
					</template>
				</el-table-column> 
				<el-table-column prop="projectCnt" label="项目数" min-width="80" ></el-table-column>

				<el-table-column prop="totalPlanWorkload" label="预估总工作量" min-width="80" ></el-table-column> 
				<el-table-column prop="totalActWorkload" label="实际总工作量" min-width="80" ></el-table-column> 
				<el-table-column prop="totalTaskBudgetCostAt" label="落实总预算" min-width="80" ></el-table-column>

				<el-table-column prop="totalTaskCnt" label="任务数" min-width="80" ></el-table-column>  
				<el-table-column prop="totalStaffCnt" label="总参与人数" min-width="80" ></el-table-column> 

				<el-table-column prop="productCnt" label="产品数" min-width="80" ></el-table-column>
				<el-table-column prop="menuCnt" label="需求数" min-width="80" ></el-table-column>
				<el-table-column prop="iterationCnt" label="迭代数" min-width="80" ></el-table-column>
				<el-table-column prop="testCases" label="测试案例总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalBugCnt" label="bug数目" min-width="80" ></el-table-column>  
				<el-table-column prop="totalFinishPayAmount" label="已付款总金额" min-width="80" ></el-table-column>
 				<el-table-column prop="totalBudgetNouserAmount" label="总非人力预算" min-width="80" ></el-table-column>
 				<el-table-column prop="totalCostNouserAmount" label="总非人力成本" min-width="80" ></el-table-column>
				<el-table-column prop="totalClosedBugCnt" label="已关闭bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalResolvedBugCnt" label="已解决bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteTaskCnt" label="已完成任务总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedPayAmount" label="待付款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedColAmount" label="待收款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishColAmount" label="已收款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostUserAmount" label="项目总人力成本" min-width="80" ></el-table-column>
				<el-table-column prop="totalBudgetInnerUserAmount" label="项目总内部人力预算" min-width="80" ></el-table-column>
				<el-table-column prop="totalRiskCnt" label="项目风险总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteRiskCnt" label="已完成风险总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalBudgetOutUserAmount" label="项目总外购人力预算" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteWorkload" label="已完成工作量" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostInnerUserAmount" label="项目总内部人力成本金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostOutUserAmount" label="项目总外购人力成本金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalActiveBugCnt" label="激活的bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalConfirmedBugCnt" label="已解决bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalActOutWorkload" label="实际外购总工作量" min-width="80" ></el-table-column>
				<el-table-column prop="totalActInnerWorkload" label="实际内部总工作量" min-width="80" ></el-table-column>
				<el-table-column prop="totalTaskOutCnt" label="外购任务数" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedPayCnt" label="待付款笔数" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishPayCnt" label="完成付款总比数" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishPayUserCnt" label="已付款总人数" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedPayUserCnt" label="待付款总人数" min-width="80" ></el-table-column>
				<el-table-column prop="totalPlanInnerUserWorkload" label="内部人力总工作量" min-width="80" ></el-table-column>
				<el-table-column prop="totalPlanOutUserWorkload" label="外购人力总工作量" min-width="80" ></el-table-column>
				<el-table-column prop="designCases" label="设计中案例总数" min-width="80" ></el-table-column>
				<el-table-column prop="finishCases" label="完成案例总数" min-width="80" ></el-table-column> 
				<el-table-column prop="totalPhaseCnt" label="项目计划数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompletePhaseCnt" label="项目计划已完成数" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right">
					<template scope="scope">
						<el-button  @click="showXmBranchDatav( scope.row,scope.$index)">大屏展示</el-button> 
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmBranchState 机构内所有项目指标汇总界面-->
			<el-drawer title="编辑机构内所有项目指标汇总" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-branch-state-edit :xm-branch-state="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-branch-state-edit>
			</el-drawer>
	
			<!--新增 XmBranchState 机构内所有项目指标汇总界面-->
			<el-drawer title="新增机构内所有项目指标汇总" :visible.sync="addFormVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-branch-state-add :xm-branch-state="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-branch-state-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmBranchState, delXmBranchState, batchDelXmBranchState,loadProjectStateToXmBranchState } from '@/api/xm/core/xmBranchState';
	import  XmBranchStateAdd from './XmBranchStateAdd';//新增界面
	import  XmBranchStateEdit from './XmBranchStateEdit';//修改界面
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
				xmBranchStates: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmBranchState界面是否显示
				//新增xmBranchState界面初始化数据
				addForm: {
					bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',id:'',totalStaffCnt:'',calcTime:'',calcStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetInnerUserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOutUserAmount:'',totalCompleteWorkload:'',totalCostInnerUserAmount:'',totalCostOutUserAmount:'',totalProgress:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',totalPlanInnerUserWorkload:'',totalPlanOutUserWorkload:'',testCases:'',execCases:'',designCases:'',finishCases:'',iterationCnt:'',productCnt:'',menuCnt:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmBranchState界面初始化数据
				editForm: {
					bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',id:'',totalStaffCnt:'',calcTime:'',calcStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetInnerUserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOutUserAmount:'',totalCompleteWorkload:'',totalCostInnerUserAmount:'',totalCostOutUserAmount:'',totalProgress:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',totalPlanInnerUserWorkload:'',totalPlanOutUserWorkload:'',testCases:'',execCases:'',designCases:'',finishCases:'',iterationCnt:'',productCnt:'',menuCnt:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmBranchStates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmBranchStates();
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
				this.getXmBranchStates();
			},
			searchXmBranchStates(){
				 this.pageInfo.count=true; 
				 this.getXmBranchStates();
			},
			//获取列表 XmBranchState 机构内所有项目指标汇总
			getXmBranchStates() {
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
				params.branchId=this.userInfo.branchId
				this.load.list = true;
				listXmBranchState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmBranchStates = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmBranchState 机构内所有项目指标汇总
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmBranchState 机构内所有项目指标汇总
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmBranchStates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmBranchState
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmBranchState
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmBranchState(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmBranchStates();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmBranchState
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmBranchState(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmBranchStates(); 
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			loadProjectStateToXmBranchState(){
				this.load.edit=true;
				loadProjectStateToXmBranchState({branchId:this.userInfo.branchId}).then(res=>{
					this.load.edit=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.getXmBranchStates()
					} 
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});

				}).catch( err  => this.load.edit=false )
			},
			/**begin 自定义函数请在下面加**/
			showXmBranchDatav(){
				this.$router.push({
					name: "branchDatavFullScreen"
				});
			}
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-branch-state-add':XmBranchStateAdd,
		    'xm-branch-state-edit':XmBranchStateEdit, 
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmBranchStates();
        	}); 
        	/** 举例，
    		listOption([{categoryId:'all',itemCode:'sex'},{categoryId:'all',itemCode:'grade'}] ).then(res=>{
				if(res.data.tips.isOk){ 
 					this.options=res.data.data
				}
			});
			**/
		}
	}

</script>

<style scoped>

</style>