<template>
	<section>
		<el-row class="app-container" v-if="!xmProduct">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProductStates">查询</el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmProductState 功能状态表,无需前端维护，所有数据由汇总统计得出-->
			<el-table :data="xmProductStates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column sortable type="index" width="45"></el-table-column> 
 				<el-table-column prop="productName" label="产品名称" min-width="80" ></el-table-column> 
				<el-table-column prop="calcTime" label="汇总时间" min-width="80" ></el-table-column>
				<el-table-column prop="finishRate" label="总体进度" min-width="80" ></el-table-column> 
				<el-table-column prop="planWorkerCnt" label="总人数" min-width="80" ></el-table-column>
				<el-table-column prop="projectCnt" label="关联项目数" min-width="80" ></el-table-column>
				<el-table-column prop="iterationCnt" label="关联迭代数" min-width="80" ></el-table-column>
				<el-table-column prop="taskCnt" label="任务总数" min-width="80" ></el-table-column>
				<el-table-column prop="testCases" label="测试用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="finishTaskCnt" label="已完成的任务总数" min-width="80" ></el-table-column>  
				<el-table-column prop="actStartTime" label="实际开始时间" min-width="80" ></el-table-column>
				<el-table-column prop="actEndTime" label="实际结束时间" min-width="80" ></el-table-column>
				<el-table-column prop="planWorkload" label="计划工作量" min-width="80" ></el-table-column>
				<el-table-column prop="actWorkload" label="实际工作量" min-width="80" ></el-table-column>
				<el-table-column prop="planCostAmount" label="计划成本" min-width="80" ></el-table-column>
				<el-table-column prop="actCostAmount" label="实际成本" min-width="80" ></el-table-column>
				<el-table-column prop="planWorkhours" label="工时数" min-width="80" ></el-table-column>
				<el-table-column prop="closedBugs" label="总关闭bugs" min-width="80" ></el-table-column>
				<el-table-column prop="activeBugs" label="激活bugs" min-width="80" ></el-table-column>
				<el-table-column prop="confirmedBugs" label="已确认bugs总数" min-width="80" ></el-table-column>
				<el-table-column prop="resolvedBugs" label="已解决bugs总数" min-width="80" ></el-table-column>
				<el-table-column prop="execCases" label="测试中用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="designCases" label="设计中用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="finishCases" label="完成用例总数" min-width="80" ></el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProductState, delXmProductState, batchDelXmProductState } from '@/api/xm/core/xmProductState'; 
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['xmProduct'],
		data() {
			return {
				filters: {
					key: ''
				},
				xmProductStates: [],//查询结果
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
				
				addFormVisible: false,//新增xmProductState界面是否显示
				//新增xmProductState界面初始化数据
				addForm: {
					id:'',planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:'',planWorkhours:'',planWorkerCnt:'',closedBugs:'',activeBugs:'',confirmedBugs:'',resolvedBugs:'',productId:'',productName:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',iterationCnt:'',taskCnt:'',finishTaskCnt:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProductState界面初始化数据
				editForm: {
					id:'',planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:'',planWorkhours:'',planWorkerCnt:'',closedBugs:'',activeBugs:'',confirmedBugs:'',resolvedBugs:'',productId:'',productName:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',iterationCnt:'',taskCnt:'',finishTaskCnt:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProductStates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProductStates();
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
				this.getXmProductStates();
			},
			searchXmProductStates(){
				 this.pageInfo.count=true; 
				 this.getXmProductStates();
			},
			//获取列表 XmProductState 功能状态表,无需前端维护，所有数据由汇总统计得出
			getXmProductStates() {
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
				if(this.xmProduct){
					params.productId=this.xmProduct.id
				}
				this.load.list = true;
				listXmProductState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProductStates = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProductState 功能状态表,无需前端维护，所有数据由汇总统计得出
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProductState 功能状态表,无需前端维护，所有数据由汇总统计得出
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProductStates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProductState
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProductState
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProductState(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProductStates();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProductState
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProductState(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProductStates(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
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
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProductStates();
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