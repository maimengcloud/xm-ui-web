<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
				<template slot="append">
					<el-button  v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectStates" icon="el-icon-search"></el-button>
				</template>
			</el-input> 
			<el-tag v-if="!this.selProject && this.filters.selProject " closable  @close="closeSelectProject">{{this.filters.selProject.name}}</el-tag><el-button v-if="!this.selProject"  @click="showProjectList" type="plian">选项目</el-button>
			
 			<el-button type="success" @click="loadTasksToXmProjectState" icon="el-icon-s-data">刷新数据</el-button> 
			<el-button type="success" @click="loadTasksSettleToXmProjectState" icon="el-icon-s-data">刷新结算数据</el-button>  
		</el-row> 
		<el-row class="app-container"> 
			<!--列表 XmProjectState 项目指标日统计表-->
			<el-table ref="table" :height="tableHeight" :data="xmProjectStates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="45"></el-table-column>
				<el-table-column sortable type="index" width="45">  </el-table-column> 
				<el-table-column   type="expand" width="45">
					<template slot-scope="scope">
					<el-form   label-width="120px" >  
						<el-form-item label="总预算金额" prop="totalFileCnt">
							<span style="margin-left:10px;font-size:14px;">项目总预算：</span><el-tag type='success'> {{(scope.row.totalBudgetNouserAmount+scope.row.totalBudgetInnerUserAmount+scope.row.totalBudgetOutUserAmount)/10000}}万</el-tag> 
							<span style="margin-left:10px;font-size:14px;">非人力总预算：</span><el-tag :type="scope.row.totalBudgetNouserAmount>0?'warning':'danger'">{{scope.row.totalBudgetNouserAmount/10000}}万</el-tag>  
							<span style="margin-left:10px;font-size:14px;">内部人力总预算：</span><el-tag  :type="scope.row.totalBudgetInnerUserAmount>0?'warning':'danger'">{{scope.row.totalBudgetInnerUserAmount/10000}}万</el-tag>  
							<span style="margin-left:10px;font-size:14px;">外购人力总预算：</span><el-tag  :type="scope.row.totalBudgetOutUserAmount>0?'warning':'danger'">{{scope.row.totalBudgetOutUserAmount/10000}}万</el-tag> 
							<span style="margin-left:10px;font-size:14px;">已分配到任务的总预算：</span><el-tag  :type="scope.row.totalTaskBudgetCostAt>0?'warning':'danger'">{{scope.row.totalTaskBudgetCostAt/10000}}万</el-tag>   
						</el-form-item> 
						<el-form-item label="bug数目" prop="totalBugCnt">
							 总数：<el-tag type="primary">{{scope.row.totalBugCnt?scope.row.totalBugCnt:0}}</el-tag> 
							 激活:<el-tag type="warning">{{scope.row.totalActiveBugCnt?scope.row.totalActiveBugCnt:0}}</el-tag>       
							 已确认：<el-tag type="danger">{{scope.row.totalConfirmedBugCnt?scope.row.totalConfirmedBugCnt:0}}</el-tag>  
							已解决： <el-tag type="success">{{scope.row.totalResolvedBugCnt?scope.row.totalResolvedBugCnt:0}}</el-tag>    
							已关闭：<el-tag type="info">{{scope.row.totalClosedBugCnt?scope.row.totalClosedBugCnt:0}}</el-tag>
						</el-form-item> 
						<el-form-item label="任务数" prop="totalTaskCnt">
							任务总数：：<el-tag type="primary">{{scope.row.totalTaskCnt?scope.row.totalTaskCnt:0}}</el-tag> 
							 已完成 :<el-tag type="warning">{{scope.row.totalCompleteTaskCnt?scope.row.totalCompleteTaskCnt:0}}</el-tag>       
							 未完成：<el-tag type="danger">{{scope.row.totalCompleteTaskCnt?scope.row.totalTaskCnt-scope.row.totalCompleteTaskCnt:scope.row.totalTaskCnt}}</el-tag>    
							 外购任务数：<el-tag type="danger">{{scope.row.totalTaskOutCnt?scope.row.totalTaskOutCnt:0}}</el-tag>    
						</el-form-item>  
						<el-form-item label="工作量" prop="projectName">
							预算： 
							 总工作量：：<el-tag type="primary">{{scope.row.totalPlanWorkload?scope.row.totalPlanWorkload:0}}</el-tag> 
 							 内购：<el-tag type="danger">{{scope.row.totalPlanInnerWorkload?scope.row.totalPlanInnerWorkload:0}}</el-tag>    
							 外购：<el-tag type="danger">{{scope.row.totalPlanOutWorkload?scope.row.totalPlanOutWorkload:0}}</el-tag>  
							 <br/>
						   实际：  
						   	 总工作量：：<el-tag type="primary">{{scope.row.totalActWorkload?scope.row.totalActWorkload:0}}</el-tag>  
							 内购：<el-tag type="danger">{{scope.row.totalActInnerWorkload?scope.row.totalActInnerWorkload:0}}</el-tag>    
							 外购：<el-tag type="danger">{{scope.row.totalActOutWorkload?scope.row.totalActOutWorkload:0}}</el-tag>  
						</el-form-item>   
						<el-form-item label="实际成本" prop="projectName">
							 总成本：：<el-tag type="primary">{{ scope.row.totalCostNouserAmount+scope.row.totalCostInnerUserAmount+scope.row.totalCostOutUserAmount}}</el-tag> 
							 非人力成本 :<el-tag type="warning">{{scope.row.totalCostNouserAmount?scope.row.totalCostNouserAmount:0}}</el-tag>       
							 内购人力成本：<el-tag type="danger">{{scope.row.totalCostInnerUserAmount?scope.row.totalCostInnerUserAmount:0}}</el-tag>    
							 外购人力成本：<el-tag type="danger">{{scope.row.totalCostOutUserAmount?scope.row.totalCostOutUserAmount:0}}</el-tag>    
						</el-form-item>  
						
						<el-form-item label="结算" prop="projectName">
							 待付款人数.金额.笔数：<el-tag type="primary">{{scope.row.totalNeedPayUserCnt?scope.row.totalNeedPayUserCnt:0}}</el-tag>人, <el-tag type="primary">{{scope.row.totalNeedPayAmount?scope.row.totalNeedPayAmount:0}}</el-tag>元,<el-tag type="warning">  {{scope.row.totalNeedPayCnt?scope.row.totalNeedPayCnt:0}}笔</el-tag>
							 <br/>
							 已付款人数.金额.笔数: <el-tag type="primary">{{scope.row.totalFinishPayUserCnt?scope.row.totalFinishPayUserCnt:0}}</el-tag>人,  <el-tag type="warning">{{scope.row.totalFinishPayAmount?scope.row.totalFinishPayAmount:0}}</el-tag>元,    <el-tag type="warning"> {{scope.row.totalFinishPayCnt?scope.row.totalFinishPayCnt:0}}笔</el-tag>      
						</el-form-item>   
						<el-form-item label="收款" prop="projectName">
							 待收款金额：<el-tag type="primary">{{scope.row.totalNeedColAmount?scope.row.totalNeedColAmount:0}}</el-tag>  
							 已收款金额: <el-tag type="primary">{{scope.row.totalFinishColAmount?scope.row.totalFinishColAmount:0}}</el-tag> 
						</el-form-item>   
						<el-form-item label="项目风险" prop="totalRiskCnt">
							 总数：{{scope.row.totalRiskCnt}}个,已解决：{{scope.row.totalCompleteRiskCnt}}个，待解决{{scope.row.totalRiskCnt-scope.row.totalCompleteRiskCnt}}个
						</el-form-item>  
					</el-form>
					</template>
				</el-table-column> 
				<el-table-column prop="projectName" label="项目名称" min-width="250" > 
				</el-table-column>
				<el-table-column prop="bizDate" label="统计日期" min-width="120" ></el-table-column>
				<el-table-column prop="totalProgress" label="项目进度" min-width="80" >
					<template slot-scope="scope">
						{{scope.row.totalProgress}}%
					</template>
				</el-table-column>
				<el-table-column prop="projectStatus" label="项目状态" min-width="80" :formatter="formatterOption"></el-table-column> 
				<el-table-column prop="totalFileCnt" label="文档数量" min-width="80" ></el-table-column>
				<el-table-column prop="totalBugCnt" label="bug数目" min-width="80" ></el-table-column>
				<el-table-column prop="totalTaskCnt" label="任务数" min-width="80" ></el-table-column>				  
 				<el-table-column prop="totalStaffCnt" label="总参与人数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostUserAmount" label="人力成本" min-width="80" ></el-table-column>
  				<el-table-column prop="totalCostNouserAmount" label="非人力成本" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishPayAmount" label="已付款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishColAmount" label="已收款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalPlanWorkload" label="项目总预算工作量" min-width="80" ></el-table-column>
				<el-table-column prop="totalActWorkload" label="实际总工作量" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right">
					<template scope="scope">
						<el-button  @click="showXmProjectDatav( scope.row,scope.$index)">大屏展示</el-button> 
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
					<el-drawer title="选中项目" :visible.sync="selectProjectVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-project-list    @project-confirm="onPorjectConfirm"></xm-project-list>
		</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectState,loadProjectToXmProjectState, loadBugsToXmProjectState, loadTasksToXmProjectState , loadTasksSettleToXmProjectState} from '@/api/xm/core/xmProjectState';
	import  XmProjectStateAdd from './XmProjectStateAdd';//新增界面
	import  XmProjectStateEdit from './XmProjectStateEdit';//修改界面
	import { mapGetters } from 'vuex'
	import XmProjectList from '../xmProject/XmProjectList';
 
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['selProject'],
		watch:{
			selProject:function(selProject,old){
				this.filters.selProject=this.selProject
				this.getXmProjectStates()
			}
		},
		data() {
			return {
				filters: {
					key: '',
					selProject:null,
				},
				xmProjectStates: [],//查询结果
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
					projectStatus:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProjectState界面是否显示
				//新增xmProjectState界面初始化数据
				addForm: {
					projectId:'',bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',projectName:'',id:'',totalStaffCnt:'',calCtime:'',calStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetInnerUserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOutUserAmount:'',totalCompleteWorkload:'',todayNewBugCnt:'',todayResolvedBugCnt:'',todayClosedBugCnt:'',todayNewTaskCnt:'',todayCompleteTaskCnt:'',todayNewPhaseCnt:'',todayCompletePhaseCnt:'',todayNewStaffCnt:'',todaySubStaffCnt:'',todayNewPlanWorkload:'',todayNewActWorkload:'',todayNeedColAmount:'',todayFinishColAmount:'',todayCostUserAmount:'',todayCostInnerUserAmount:'',todayCostOutUserAmount:'',todayCostNouserAmount:'',totalCostInnerUserAmount:'',totalCostOutUserAmount:'',todayNeedPayAmount:'',todayFinishPayAmount:'',todayNewRiskCnt:'',todayCompleteRiskCnt:'',todayNewFileCnt:'',totalProgress:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',todayConfirmedBugCnt:'',todayActiveBugCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',todayNeedPayUserCnt:'',todayFinishPayUserCnt:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectState界面初始化数据
				editForm: {
					projectId:'',bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',projectName:'',id:'',totalStaffCnt:'',calCtime:'',calStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetInnerUserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOutUserAmount:'',totalCompleteWorkload:'',todayNewBugCnt:'',todayResolvedBugCnt:'',todayClosedBugCnt:'',todayNewTaskCnt:'',todayCompleteTaskCnt:'',todayNewPhaseCnt:'',todayCompletePhaseCnt:'',todayNewStaffCnt:'',todaySubStaffCnt:'',todayNewPlanWorkload:'',todayNewActWorkload:'',todayNeedColAmount:'',todayFinishColAmount:'',todayCostUserAmount:'',todayCostInnerUserAmount:'',todayCostOutUserAmount:'',todayCostNouserAmount:'',totalCostInnerUserAmount:'',totalCostOutUserAmount:'',todayNeedPayAmount:'',todayFinishPayAmount:'',todayNewRiskCnt:'',todayCompleteRiskCnt:'',todayNewFileCnt:'',totalProgress:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',todayConfirmedBugCnt:'',todayActiveBugCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',todayNeedPayUserCnt:'',todayFinishPayUserCnt:''
				},
				selectProjectVisible:false,
				/**begin 自定义属性请在下面加 请加备注**/
				tableHeight:300,
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
				if(this.filters.selProject){
					params.projectId=this.filters.selProject.id
				}else{
					params.branchId=this.userInfo.branchId
				}
				this.load.list = true;
				listXmProjectState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectStates = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
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
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
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
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			}, 
			loadProjectToXmProjectState: function () {
				 	if(!this.filters.selProject){
						 this.$message({showClose: true, message: '请选择一个项目', type: 'error'});
						 return;
					 } 
					 
					this.load.edit=true;
					var params={projectId:this.filters.selProject.id}
					loadProjectToXmProjectState(params).then((res) => {
						this.load.edit=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectStates(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.edit=false ); 
			}, 
			loadBugsToXmProjectState: function () {
				 	if(!this.filters.selProject){
						 this.$message({showClose: true, message: '请选择一个项目', type: 'error'});
						 return;
					 } 
					 
					this.load.edit=true;
					var params={projectId:this.filters.selProject.id}
					loadBugsToXmProjectState(params).then((res) => {
						this.load.edit=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectStates(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.edit=false ); 
			},
			loadTasksToXmProjectState: function () {
				 	if(!this.filters.selProject){
						 this.$message({showClose: true, message: '请选择一个项目', type: 'error'});
						 return;
					 } 
					 
					this.load.edit=true;
					var params={projectId:this.filters.selProject.id}
					loadTasksToXmProjectState(params).then((res) => {
						this.load.edit=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectStates(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.edit=false ); 
			},
			loadTasksSettleToXmProjectState: function () {
				 	if(!this.filters.selProject){
						 this.$message({showClose: true, message: '请选择一个项目', type: 'error'});
						 return;
					 } 
					 
					this.load.edit=true;
					var params={projectId:this.filters.selProject.id}
					loadTasksSettleToXmProjectState(params).then((res) => {
						this.load.edit=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectStates(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.edit=false ); 
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			
			onPorjectConfirm:function(project){
				this.filters.selProject=project
				this.selectProjectVisible=false;
				this.getXmProjectStates();
			},
			showProjectList:function(){ 
				this.selectProjectVisible=true; 
			},
			closeSelectProject:function(){
				this.filters.selProject=null
			},
			
			formatterOption: function(row,column,cellValue, index){ 
				var columnName=column.property;
				var key="";
				if(columnName=='projectStatus'){
					key="projectStatus"
				}else{
					return cellValue
				}
				if(this.options[key]==undefined || this.options[key]==null || this.options[key].length==0   ){
					return cellValue;
				}
				var list=this.options[key].filter(i=>i.optionValue==cellValue)
				if(list.length>0){
					return list[0].optionName
				}else{
					return cellValue;
				}

			},
			
			showXmProjectDatav(row){
				this.$router.push({
					name: "projectDatavFullScreen",
					params:{projectId:row.projectId}
				});
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-project-state-add':XmProjectStateAdd,
		    'xm-project-state-edit':XmProjectStateEdit, XmProjectList
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				if(this.selProject){
					this.filters.selProject=this.selProject
				}
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=50/1000 * window.innerHeight; 
				if(this.selProject){
					subHeight=100/1000 * window.innerHeight;
				}
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
				this.getXmProjectStates();
				listOption([{categoryId:'all',itemCode:'projectStatus'}] ).then(res=>{
					if(res.data.tips.isOk){  
						this.options['projectStatus']=res.data.data.projectStatus 
						//this.editForm.projectStatus=this.options['projectStatus'][0].optionValue
					}
				});
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