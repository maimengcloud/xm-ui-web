<template>
	<section>
		<el-row class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectMBudgetCostNousers">查询</el-button>
			<el-button type="primary" v-if="batchEditVisible==false"  @click="showAdd">+新增预算明细</el-button> 
			<el-button type="primary" v-if="batchEditVisible==false" @click="batchEditVisible=true">批量修改</el-button> 
			<el-button type="primary" v-if="batchEditVisible==true" @click="batchSave">批量保存</el-button>  
			<el-button type="primary" v-if="batchEditVisible==true" @click="noBatchEdit">返回</el-button>  
			<el-button type="danger"  v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
			<span style="margin-left:10px;font-size:14px;">项目总预算：</span><el-tag type='success'> {{selProject.planTotalCost}}</el-tag> 
			<span style="margin-left:10px;font-size:14px;">非人力总预算：</span><el-tag type='warning'>{{selProject.planNouserAt}}</el-tag>  
			<span style="margin-left:10px;font-size:14px;">内部人力总预算：</span><el-tag type='warning'>{{selProject.planInnerUserAt}}</el-tag>  
			<span style="margin-left:10px;font-size:14px;">外购人力总预算：</span><el-tag type='warning'>{{selProject.planOutUserAt}}</el-tag>  
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmProjectMBudgetCostNouser xm_project_m_budget_cost_nouser-->
			<el-table :data="xmProjectMBudgetCostNousers"     show-summary @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>   
				<el-table-column prop="subjectId" label="预算科目编号" min-width="80" >
					<template slot-scope="scope">
						<el-select :disabled="batchEditVisible==false"  placeholder="预算科目编号" v-model="scope.row.subjectId"  @change="fieldChange(scope.row)">
						<el-option
							v-for="(item,i) in options.projectSubject"
							:key="i"
							:label="item.optionName"
							:value="item.optionValue">
						</el-option>
					</el-select> 
					</template>
					
				</el-table-column> 
				<el-table-column prop="budgetCost" label="预算金额" min-width="80" >
					<template slot-scope="scope">
						<el-input  v-if="batchEditVisible==true" v-model="scope.row.budgetCost" type="number" placeholder="预算金额" @change="fieldChange(scope.row)"></el-input>
						<div v-else>{{scope.row.budgetCost}}</div>
					</template>

				</el-table-column>  
				<el-table-column prop="bizzMonth" label="费用月份" min-width="80" >
					<template slot-scope="scope">
						<el-date-picker v-if="batchEditVisible==true" 
							@change="fieldChange(scope.row)"
							v-model="scope.row.bizzMonth"
							type="month"
							value-format="yyyy-MM"
							placeholder="选择年月">
						</el-date-picker> 
						<div v-else>{{scope.row.bizzMonth}}</div>
					</template> 
				</el-table-column> 
				<el-table-column prop="costType" label="成本类型" min-width="80" >
					<template slot-scope="scope"> 
						<el-radio :disabled="batchEditVisible==false" @change="fieldChange(scope.row)"  v-model="scope.row.costType" label="1">内部人力</el-radio>
						<el-radio :disabled="batchEditVisible==false" @change="fieldChange(scope.row)" v-model="scope.row.costType" label="2">外购人力</el-radio>
					</template>
					
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" >
					<template slot-scope="scope">
						<el-input  v-if="batchEditVisible==true" v-model="scope.row.remark" placeholder="备注" @change="fieldChange(scope.row)" ></el-input> 
						<div v-else>{{scope.row.remark}}</div>
					</template>

				</el-table-column>
				<el-table-column prop="bizFlowState" label="当前审批状态" min-width="80" ></el-table-column>  
				<el-table-column label="操作" width="160" fixed="right"    v-if="batchEditVisible==false">
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProjectMBudgetCostNouser xm_project_m_budget_cost_nouser界面-->
			<el-dialog title="编辑非人力预算明细" :visible.sync="editFormVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-m-budget-cost-nouser-edit :xm-project-m-budget-cost-nouser="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-m-budget-cost-nouser-edit>
			</el-dialog>
	
			<!--新增 XmProjectMBudgetCostNouser xm_project_m_budget_cost_nouser界面-->
			<el-dialog title="新增非人力预算明细" :visible.sync="addFormVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-project-m-budget-cost-nouser-add :sel-project="selProject" :xm-project-m-budget-cost-nouser="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-m-budget-cost-nouser-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectMBudgetCostNouser, delXmProjectMBudgetCostNouser, batchDelXmProjectMBudgetCostNouser,batchEdit  } from '@/api/xm/core/xmProjectMBudgetCostNouser';
	import  XmProjectMBudgetCostNouserAdd from './XmProjectMBudgetCostNouserAdd';//新增界面
	import  XmProjectMBudgetCostNouserEdit from './XmProjectMBudgetCostNouserEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		}, 
		props:["selProject",'budgetCostNouser','fieldName','queryType','visible'],
		watch:{
			visible:function(visible){
				if(visible==true){
					this.getXmProjectMBudgetCostNousers();
				}
				
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjectMBudgetCostNousers: [],//查询结果
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
					projectSubject:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProjectMBudgetCostNouser界面是否显示
				//新增xmProjectMBudgetCostNouser界面初始化数据
				addForm: {
					projectId:'',budgetCost:'',id:'',remark:'',subjectId:'',bizzStartDate:'',bizzEndDate:'',bizProcInstId:'',bizFlowState:'',projectPhaseId:'',costType:'',bizzMonth:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectMBudgetCostNouser界面初始化数据
				editForm: {
					projectId:'',budgetCost:'',id:'',remark:'',subjectId:'',bizzStartDate:'',bizzEndDate:'',bizProcInstId:'',bizFlowState:'',projectPhaseId:'',costType:'',bizzMonth:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				
				batchEditVisible:false,	
				valueChangeRows:[],	
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectMBudgetCostNousers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectMBudgetCostNousers();
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
				this.getXmProjectMBudgetCostNousers();
			},
			searchXmProjectMBudgetCostNousers(){
				 this.pageInfo.count=true; 
				 this.getXmProjectMBudgetCostNousers();
			},
			//获取列表 XmProjectMBudgetCostNouser xm_project_m_budget_cost_nouser
			getXmProjectMBudgetCostNousers() {
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
				if(this.queryType=='queryByBizzMonth'){
					params.bizzMonth=this.fieldName 
					params.username=this.budgetCostNouser.username 
					params.subjectId=this.budgetCostNouser.subjectId
				}else if(this.queryType=='queryByUsername'){
					params.username=this.budgetCostNouser.username 
					params.subjectId=this.budgetCostNouser.subjectId
				}else if(this.queryType=='queryBySubjectId'){ 
					params.subjectId=this.budgetCostNouser.subjectId
				} 
				if(this.selProject!=null && this.selProject !=undefined){
					params.projectId=this.selProject.id
				}
				this.load.list = true;
				listXmProjectMBudgetCostNouser(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectMBudgetCostNousers = res.data.data;
						this.valueChangeRows=[];
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectMBudgetCostNouser xm_project_m_budget_cost_nouser
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectMBudgetCostNouser xm_project_m_budget_cost_nouser
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectMBudgetCostNousers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectMBudgetCostNouser
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectMBudgetCostNouser
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectMBudgetCostNouser(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectMBudgetCostNousers();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectMBudgetCostNouser
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectMBudgetCostNouser(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectMBudgetCostNousers(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			
			batchSave:function(){
				
				if(this.valueChangeRows.length==0){
					this.$message({ message:"没有改变任何数据，无需保存", type: 'success'});
					return;
				}else {  
					this.load.edit=true;
					batchEdit(this.valueChangeRows).then(res=>{ 
						this.load.edit=false;
						var tips =res.data.tips;
						if(tips.isOk){
							this.valueChangeRows=[]
							this.getXmProjectMBudgetCostNousers();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'}); 
						
					}).catch(e=>this.load.edit=false);
				}
				
			},
			noBatchEdit: function(){
				this.batchEditVisible=false;
				this.valueChangeRows=[];
				this.getXmProjectMBudgetCostNousers();
			}, 
			getFloatValue(value,digit){
				if(value==null ||  value=='' || value==undefined){
					value=0;
				}
				return parseFloat(value);
			}, 
			fieldChange:function(row,fieldName){
				if(this.valueChangeRows.some(i=>i.id==row.id)){
					return;
				}else{
					this.valueChangeRows.push(row)
				}
				console.log(JSON.stringify(row));
			},
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-project-m-budget-cost-nouser-add':XmProjectMBudgetCostNouserAdd,
		    'xm-project-m-budget-cost-nouser-edit':XmProjectMBudgetCostNouserEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProjectMBudgetCostNousers();
			}); 
			
				listOption([{categoryId:'all',itemCode:'projectSubject'}]).then(res=>{
					this.options=res.data.data;
				})	
		}
	}

</script>

<style scoped>

</style>