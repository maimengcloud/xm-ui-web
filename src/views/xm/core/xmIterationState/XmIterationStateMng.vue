<template>
	<section>
		<el-row v-if="!xmIteration" class="page-main">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmIterationStates">查询</el-button>
  		</el-row>
		<el-row class="page-main page-main-height"> 
			<!--列表 XmIterationState 迭代定义-->
			<el-table :data="xmIterationStates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column sortable type="index" width="45"></el-table-column>
 				<el-table-column prop="iterationName" label="迭代名称" min-width="80" ></el-table-column>
				<el-table-column prop="finishRate" label="进度" min-width="80">
					<template  slot-scope="scope">
						{{scope.row.finishRate}} %
					</template>
				</el-table-column>
				<el-table-column prop="calcTime" label="计算日期" min-width="80" ></el-table-column> 
				<el-table-column prop="budgetCost" label="预算成本" min-width="80" ></el-table-column>
				<el-table-column prop="budgetWorkload" label="预算工作量" min-width="80" ></el-table-column>
				<el-table-column prop="distBudgetCost" label="已分配到任务的预算" min-width="80" ></el-table-column>
				<el-table-column prop="distBudgetWorkload" label="已分配到任务的预算工作量" min-width="80" ></el-table-column>
				<el-table-column prop="actCost" label="实际成本" min-width="80" ></el-table-column>
				<el-table-column prop="actWorkload" label="实际工作量" min-width="80" ></el-table-column>
				<el-table-column prop="actStaffNum" label="实际投入人员数" min-width="80" ></el-table-column>
				<el-table-column prop="testCases" label="测试用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="execCases" label="测试中用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="designCases" label="设计中用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="finishCases" label="完成用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="projectCnt" label="关联项目数" min-width="80" ></el-table-column>
				<el-table-column prop="productCnt" label="关联产品数" min-width="80" ></el-table-column>
				<el-table-column prop="menuCnt" label="关联故事数" min-width="80" ></el-table-column>
				<el-table-column prop="taskCnt" label="关联任务数" min-width="80" ></el-table-column>
				<el-table-column prop="finishTaskCnt" label="已完成的任务数" min-width="80" ></el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmIterationState 迭代定义界面-->
			<el-drawer title="编辑迭代定义" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-iteration-state-edit :xm-iteration-state="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-iteration-state-edit>
			</el-drawer>
	
			<!--新增 XmIterationState 迭代定义界面-->
			<el-drawer title="新增迭代定义" :visible.sync="addFormVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-iteration-state-add :xm-iteration-state="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-iteration-state-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmIterationState, delXmIterationState, batchDelXmIterationState } from '@/api/xm/core/xmIterationState';
	import  XmIterationStateAdd from './XmIterationStateAdd';//新增界面
	import  XmIterationStateEdit from './XmIterationStateEdit';//修改界面
	import { mapGetters } from 'vuex' 
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmIteration'],
		watch:{
			xmIteration(xmIteration){
				this.getXmIterationStates();
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmIterationStates: [],//查询结果
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
				
				addFormVisible: false,//新增xmIterationState界面是否显示
				//新增xmIterationState界面初始化数据
				addForm: {
					id:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',finishRate:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',productCnt:'',menuCnt:'',taskCnt:'',finishTaskCnt:'',calcTime:'',iterationName:'',budgetCost:'',budgetWorkload:'',iterationId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmIterationState界面初始化数据
				editForm: {
					id:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',finishRate:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',productCnt:'',menuCnt:'',taskCnt:'',finishTaskCnt:'',calcTime:'',iterationName:'',budgetCost:'',budgetWorkload:'',iterationId:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmIterationStates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmIterationStates();
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
				this.getXmIterationStates();
			},
			searchXmIterationStates(){
				 this.pageInfo.count=true; 
				 this.getXmIterationStates();
			},
			//获取列表 XmIterationState 迭代定义
			getXmIterationStates() {
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
				if(this.xmIteration){
					params.iterationId=this.xmIteration.id
				}
				this.load.list = true;
				listXmIterationState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmIterationStates = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmIterationState 迭代定义
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmIterationState 迭代定义
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmIterationStates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmIterationState
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmIterationState
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmIterationState(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmIterationStates();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmIterationState
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmIterationState(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmIterationStates(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
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
		    'xm-iteration-state-add':XmIterationStateAdd,
		    'xm-iteration-state-edit':XmIterationStateEdit
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmIterationStates();
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