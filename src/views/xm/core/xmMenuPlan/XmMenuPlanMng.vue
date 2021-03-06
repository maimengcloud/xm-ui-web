<template>
	<section>
		<el-row class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenuPlans">查询</el-button>
			<el-button type="primary" @click="showAdd">+功能计划表,无需前端维护，所有数据由汇总统计得出</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmMenuPlan 功能计划表,无需前端维护，所有数据由汇总统计得出-->
			<el-table :data="xmMenuPlans" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="45"></el-table-column>
				<el-table-column sortable type="index" width="45"></el-table-column>
				<el-table-column prop="projectId" label="项目编号" min-width="80" ></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="projectName" label="项目名称" min-width="80" ></el-table-column>
				<el-table-column prop="menuId" label="功能编号" min-width="80" ></el-table-column>
				<el-table-column prop="planStartTime" label="开始时间" min-width="80" ></el-table-column>
				<el-table-column prop="planEndTime" label="结束时间" min-width="80" ></el-table-column>
				<el-table-column prop="actStartTime" label="实际开始时间" min-width="80" ></el-table-column>
				<el-table-column prop="actEndTime" label="实际结束时间" min-width="80" ></el-table-column>
				<el-table-column prop="planWorkload" label="计划工作量，根据关联任务汇总" min-width="80" ></el-table-column>
				<el-table-column prop="actWorkload" label="实际工作量，根据关联任务汇总" min-width="80" ></el-table-column>
				<el-table-column prop="planCostAmount" label="计划成本，根据关联任务汇总" min-width="80" ></el-table-column>
				<el-table-column prop="actCostAmount" label="实际成本金额根据关联任务汇总" min-width="80" ></el-table-column>
				<el-table-column prop="finishRate" label="总体完成比例0-100之间,根据taskType进行汇总" min-width="80" ></el-table-column>
				<el-table-column prop="demandRate" label="需求完成率0-100之间,根据taskType进行汇总" min-width="80" ></el-table-column>
				<el-table-column prop="designRate" label="设计完成率0-100之间,根据taskType进行汇总" min-width="80" ></el-table-column>
				<el-table-column prop="devRate" label="开发完成率0-100之间,根据taskType进行汇总" min-width="80" ></el-table-column>
				<el-table-column prop="uatRate" label="uat测试完成率0-100之间,根据taskType进行汇总" min-width="80" ></el-table-column>
				<el-table-column prop="sitRate" label="sit测试完成率0-100之间,根据taskType进行汇总" min-width="80" ></el-table-column>
				<el-table-column prop="onlineStatus" label="上线状态0未上线1上线成功" min-width="80" ></el-table-column>
				<el-table-column prop="onlineTime" label="上线时间" min-width="80" ></el-table-column>
				<el-table-column prop="planStatus" label="计划状态0初始1正常2暂停3延误4结束5关闭" min-width="80" ></el-table-column>
				<el-table-column prop="chargeUserid" label="负责人编号" min-width="80" ></el-table-column>
				<el-table-column prop="chargeUsername" label="负责人姓名" min-width="80" ></el-table-column>
				<el-table-column prop="menuStatus" label="状态0初始1设计中2开发中3测试中4uat测试2已上线3已下线4已删除" min-width="80" ></el-table-column>
				<el-table-column prop="ctime" label="创建时间" min-width="80" ></el-table-column>
				<el-table-column prop="ltime" label="更新时间" min-width="80" ></el-table-column>
				<el-table-column prop="cuserid" label="创建人编号" min-width="80" ></el-table-column>
				<el-table-column prop="cusername" label="创建人姓名" min-width="80" ></el-table-column>
				<el-table-column prop="calcTime" label="汇总时间" min-width="80" ></el-table-column>
				<el-table-column prop="menuName" label="菜单名字" min-width="80" ></el-table-column>
				<el-table-column prop="planWorkhours" label="工时数" min-width="80" ></el-table-column>
				<el-table-column prop="planWorkerCnt" label="总人数" min-width="80" ></el-table-column>
				<el-table-column prop="closedBugs" label="总关闭bugs" min-width="80" ></el-table-column>
				<el-table-column prop="activeBugs" label="激活bugs" min-width="80" ></el-table-column>
				<el-table-column prop="confirmedBugs" label="已确认bugs总数" min-width="80" ></el-table-column>
				<el-table-column prop="resolvedBugs" label="已解决bugs总数" min-width="80" ></el-table-column>
				<el-table-column prop="testCases" label="测试用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="execCases" label="测试中用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="designCases" label="设计中用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="finishCases" label="完成用例总数" min-width="80" ></el-table-column>
				<el-table-column prop="iterationCnt" label="关联迭代数" min-width="80" ></el-table-column>
				<el-table-column prop="taskCnt" label="任务数" min-width="80" ></el-table-column>
				<el-table-column prop="finishTaskCnt" label="完成的任务数" min-width="80" ></el-table-column>
				<el-table-column prop="productId" label="产品编号" min-width="80" ></el-table-column>
				<el-table-column prop="productName" label="产品名称" min-width="80" ></el-table-column>
				<el-table-column prop="bugCnt" label="bug总数" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right">
					<template scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmMenuPlan 功能计划表,无需前端维护，所有数据由汇总统计得出界面-->
			<el-dialog title="编辑功能计划表,无需前端维护，所有数据由汇总统计得出" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-menu-plan-edit :xm-menu-plan="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-menu-plan-edit>
			</el-dialog>
	
			<!--新增 XmMenuPlan 功能计划表,无需前端维护，所有数据由汇总统计得出界面-->
			<el-dialog title="新增功能计划表,无需前端维护，所有数据由汇总统计得出" :visible.sync="addFormVisible"  width="50%"  append-to-body  :close-on-click-modal="false">
				<xm-menu-plan-add :xm-menu-plan="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-menu-plan-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmMenuPlan, delXmMenuPlan, batchDelXmMenuPlan } from '@/api/xm/core/xmMenuPlan';
	import  XmMenuPlanAdd from './XmMenuPlanAdd';//新增界面
	import  XmMenuPlanEdit from './XmMenuPlanEdit';//修改界面
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
				xmMenuPlans: [],//查询结果
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
				
				addFormVisible: false,//新增xmMenuPlan界面是否显示
				//新增xmMenuPlan界面初始化数据
				addForm: {
					projectId:'',id:'',projectName:'',menuId:'',planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',onlineStatus:'',onlineTime:'',planStatus:'',chargeUserid:'',chargeUsername:'',menuStatus:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:'',menuName:'',planWorkhours:'',planWorkerCnt:'',closedBugs:'',activeBugs:'',confirmedBugs:'',resolvedBugs:'',testCases:'',execCases:'',designCases:'',finishCases:'',iterationCnt:'',taskCnt:'',finishTaskCnt:'',productId:'',productName:'',bugCnt:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenuPlan界面初始化数据
				editForm: {
					projectId:'',id:'',projectName:'',menuId:'',planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',onlineStatus:'',onlineTime:'',planStatus:'',chargeUserid:'',chargeUsername:'',menuStatus:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:'',menuName:'',planWorkhours:'',planWorkerCnt:'',closedBugs:'',activeBugs:'',confirmedBugs:'',resolvedBugs:'',testCases:'',execCases:'',designCases:'',finishCases:'',iterationCnt:'',taskCnt:'',finishTaskCnt:'',productId:'',productName:'',bugCnt:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmMenuPlans();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmMenuPlans();
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
				this.getXmMenuPlans();
			},
			searchXmMenuPlans(){
				 this.pageInfo.count=true; 
				 this.getXmMenuPlans();
			},
			//获取列表 XmMenuPlan 功能计划表,无需前端维护，所有数据由汇总统计得出
			getXmMenuPlans() {
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
				listXmMenuPlan(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenuPlans = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmMenuPlan 功能计划表,无需前端维护，所有数据由汇总统计得出
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmMenuPlan 功能计划表,无需前端维护，所有数据由汇总统计得出
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmMenuPlans();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmMenuPlan
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmMenuPlan
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmMenuPlan(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmMenuPlans();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmMenuPlan
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmMenuPlan(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmMenuPlans(); 
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
		    'xm-menu-plan-add':XmMenuPlanAdd,
		    'xm-menu-plan-edit':XmMenuPlanEdit, 
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmMenuPlans();
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