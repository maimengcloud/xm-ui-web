<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmProductStates" icon="el-icon-search">查询</el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus"> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmProductState 功能状态表,无需前端维护，所有数据由汇总统计得出-->
			<el-table ref="xmProductStateTable" :data="xmProductStates" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planStartTime" label="开始时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planEndTime" label="结束时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="actStartTime" label="实际开始时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="actEndTime" label="实际结束时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planWorkload" label="计划工作量，根据关联任务汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="actWorkload" label="实际工作量，根据关联任务汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planCostAmount" label="计划成本，根据关联任务汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="actCostAmount" label="实际成本金额根据关联任务汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="finishRate" label="总体完成比例0-100之间,根据taskType进行汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="demandRate" label="需求完成率0-100之间,根据taskType进行汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="designRate" label="设计完成率0-100之间,根据taskType进行汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="devRate" label="开发完成率0-100之间,根据taskType进行汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="uatRate" label="uat测试完成率0-100之间,根据taskType进行汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sitRate" label="sit测试完成率0-100之间,根据taskType进行汇总" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="ctime" label="创建时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="ltime" label="更新时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cuserid" label="创建人编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cusername" label="创建人姓名" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="calcTime" label="汇总时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planWorkhours" label="工时数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="planWorkerCnt" label="总人数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="closedBugs" label="总关闭bugs" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="activeBugs" label="激活bugs" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="confirmedBugs" label="已确认bugs总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="resolvedBugs" label="已解决bugs总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="productId" label="产品编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="productName" label="产品名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="testCases" label="测试用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="execCases" label="测试中用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="designCases" label="设计中用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="finishCases" label="完成用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="projectCnt" label="关联项目数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="iterationCnt" label="关联迭代数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskCnt" label="任务总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskFinishCnt" label="已完成的任务总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="业务日期yyyy-MM-dd字符串" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="branchId" label="机构号码" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bugCnt" label="bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="menuCnt" label="故事数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="menuFinishCnt" label="需求完成数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="estimateWorkload" label="预估工时=计划结束时间在计算当日前完成的任务的预算工时总和" min-width="80" show-overflow-tooltip></el-table-column>
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
			<!--编辑 XmProductState 功能状态表,无需前端维护，所有数据由汇总统计得出界面-->
			<el-drawer title="编辑功能状态表,无需前端维护，所有数据由汇总统计得出" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-product-state-edit op-type="edit" :xm-product-state="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-product-state-edit>
			</el-drawer>

			<!--新增 XmProductState 功能状态表,无需前端维护，所有数据由汇总统计得出界面-->
			<el-drawer title="新增功能状态表,无需前端维护，所有数据由汇总统计得出" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-product-state-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-product-state-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库

	import { listXmProductState, delXmProductState, batchDelXmProductState } from '@/api/xm/core/xmProductState';
	import  XmProductStateEdit from './XmProductStateEdit';//新增修改界面
	import { mapGetters } from 'vuex'

	export default {
	    name:'xmProductStateMng',
		components: {
		    XmProductStateEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmProductStates()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProductStates: [],//查询结果
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
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmProductState界面是否显示
				addForm: {
					planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:'',planWorkhours:'',planWorkerCnt:'',closedBugs:'',activeBugs:'',confirmedBugs:'',resolvedBugs:'',productId:'',productName:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',iterationCnt:'',taskCnt:'',taskFinishCnt:'',bizDate:'',branchId:'',bugCnt:'',menuCnt:'',menuFinishCnt:'',estimateWorkload:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:'',planWorkhours:'',planWorkerCnt:'',closedBugs:'',activeBugs:'',confirmedBugs:'',resolvedBugs:'',productId:'',productName:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',iterationCnt:'',taskCnt:'',taskFinishCnt:'',bizDate:'',branchId:'',bugCnt:'',menuCnt:'',menuFinishCnt:'',estimateWorkload:''
				},
				maxTableHeight:300,
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
				if(this.filters.key){
					params.key=this.filters.key
				}

				this.load.list = true;
				listXmProductState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProductStates = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
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
					let params = {  productId:row.productId };
					delXmProductState(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmProductStates();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProductState
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { productId:i.productId}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmProductState(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmProductStates();
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

			    this.initData()
				this.searchXmProductStates();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmProductStateTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>
