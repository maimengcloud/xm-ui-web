<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmBranchStateHiss" icon="el-icon-search">查询</el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus"> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmBranchStateHis 机构内所有项目指标汇总-->
			<el-table ref="xmBranchStateHisTable" :data="xmBranchStateHiss" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="统计日期yyyy-mm-dd类型" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalFileCnt" label="文件数据" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalBugCnt" label="bug数目" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalTaskCnt" label="任务数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalBudgetNouserAmount" label="项目总非人力预算-来自项目表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalStaffCnt" label="总参与人数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="calcTime" label="统计执行日期" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="calcStatus" label="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalCostNouserAmount" label="项目总非人力成本" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalClosedBugCnt" label="已关闭bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalResolvedBugCnt" label="已解决bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalCompleteTaskCnt" label="已完成任务总数-来自任务表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalPhaseCnt" label="项目阶段计划数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalCompletePhaseCnt" label="项目阶段计划已完成数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalNeedPayAmount" label="待付款总金额" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalFinishPayAmount" label="已付款总金额" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalNeedColAmount" label="待收款总金额" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalFinishColAmount" label="已收款总金额" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalCostUserAmount" label="项目总人力成本" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalBudgetIuserAmount" label="项目总内部人力预算-来自项目表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalPlanWorkload" label="项目总预算工作量-来自项目表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalRiskCnt" label="项目风险总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalCompleteRiskCnt" label="已完成风险总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="branchId" label="机构编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="branchName" label="机构名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalBudgetOuserAmount" label="项目总外购人力预算-来自项目表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalCompleteWorkload" label="已完成工作量-来自计划中实际完成工作量" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalCostIuserAmount" label="项目总内部人力成本金额" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalCostOuserAmount" label="项目总外购人力成本金额" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="finishRate" label="项目进度0~100之间，来自任务表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalActiveBugCnt" label="激活的bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalConfirmedBugCnt" label="已解决bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="projectStatus" label="项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalActWorkload" label="实际总工作量，来自任务表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalActOutWorkload" label="实际外购总工作量，来自任务表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalActInnerWorkload" label="实际内部总工作量，来自任务表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalTaskBudgetCostAt" label="已经分配到任务的总预算" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalTaskOutCnt" label="外购任务数，来自任务表" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalNeedPayCnt" label="待付款笔数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalFinishPayCnt" label="完成付款总比数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalFinishPayUserCnt" label="已付款总人数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalNeedPayUserCnt" label="待付款总人数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalPlanIuserWorkload" label="内部人力总工作量-应该大于或等于阶段计划内部人力总成本" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalPlanOuserWorkload" label="外购人力总工作量-应该大于或等于阶段计划外购人力总成本" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="testCases" label="测试用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="execCases" label="测试中用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="designCases" label="设计中用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="finishCases" label="完成用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="iterationCnt" label="迭代数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="productCnt" label="产品数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="menuCnt" label="故事数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="projectCnt" label="项目数量" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="productBudgetWorkload" label="产品总工时" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="productActWorkload" label="产品实际完成总工作量" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="estimateWorkload" label="预估完成工作量" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="execTaskCnt" label="执行中任务数=任务表开始日期小于当前日期，进度<100的任务" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="toStartTaskCnt" label="待开始的任务数=任务表中开始日期大于当前日期的任务数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="execMenuCnt" label="执行中需求=需求表中开始日期小于小于当前日期，进度<100的需求" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="toStartMenuCnt" label="待开始需求数=需求表中开始日期大于当前日期的需求数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="minStartTime" label="最早开始日期" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="maxEndTime" label="最晚结束时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmBranchStateHis 机构内所有项目指标汇总界面-->
			<el-drawer title="编辑机构内所有项目指标汇总" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-branch-state-his-edit op-type="edit" :xm-branch-state-his="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-branch-state-his-edit>
			</el-drawer>

			<!--新增 XmBranchStateHis 机构内所有项目指标汇总界面-->
			<el-drawer title="新增机构内所有项目指标汇总" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-branch-state-his-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-branch-state-his-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmBranchStateHis, delXmBranchStateHis, batchDelXmBranchStateHis } from '@/api/xm/core/xmBranchStateHis';
	import  XmBranchStateHisEdit from './XmBranchStateHisEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmBranchStateHisMng',
		components: {
		    XmBranchStateHisEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmBranchStateHiss()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmBranchStateHiss: [],//查询结果
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
				dicts:{
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmBranchStateHis界面是否显示
				addForm: {
					bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',totalStaffCnt:'',calcTime:'',calcStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetIuserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOuserAmount:'',totalCompleteWorkload:'',totalCostIuserAmount:'',totalCostOuserAmount:'',finishRate:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',totalPlanIuserWorkload:'',totalPlanOuserWorkload:'',testCases:'',execCases:'',designCases:'',finishCases:'',iterationCnt:'',productCnt:'',menuCnt:'',projectCnt:'',productBudgetWorkload:'',productActWorkload:'',estimateWorkload:'',execTaskCnt:'',toStartTaskCnt:'',execMenuCnt:'',toStartMenuCnt:'',minStartTime:'',maxEndTime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',totalStaffCnt:'',calcTime:'',calcStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetIuserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOuserAmount:'',totalCompleteWorkload:'',totalCostIuserAmount:'',totalCostOuserAmount:'',finishRate:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',totalPlanIuserWorkload:'',totalPlanOuserWorkload:'',testCases:'',execCases:'',designCases:'',finishCases:'',iterationCnt:'',productCnt:'',menuCnt:'',projectCnt:'',productBudgetWorkload:'',productActWorkload:'',estimateWorkload:'',execTaskCnt:'',toStartTaskCnt:'',execMenuCnt:'',toStartMenuCnt:'',minStartTime:'',maxEndTime:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmBranchStateHiss();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmBranchStateHiss();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[]; 
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}
					 
					this.pageInfo.orderFields=[util.toLine(obj.prop)]; 
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmBranchStateHiss();
			},
			searchXmBranchStateHiss(){
				 this.pageInfo.count=true; 
				 this.getXmBranchStateHiss();
			},
			//获取列表 XmBranchStateHis 机构内所有项目指标汇总
			getXmBranchStateHiss() {
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
				if(this.filters.key){
					params.key=this.filters.key
				}

				this.load.list = true;
				listXmBranchStateHis(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmBranchStateHiss = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmBranchStateHis 机构内所有项目指标汇总
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmBranchStateHis 机构内所有项目指标汇总
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmBranchStateHiss();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmBranchStateHis
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmBranchStateHis
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  bizDate:row.bizDate,  branchId:row.branchId };
					delXmBranchStateHis(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmBranchStateHiss();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmBranchStateHis
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { bizDate:i.bizDate,  branchId:i.branchId}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmBranchStateHis(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmBranchStateHiss(); 
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
			    this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
			    this.initData()
				this.searchXmBranchStateHiss();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmBranchStateHisTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>