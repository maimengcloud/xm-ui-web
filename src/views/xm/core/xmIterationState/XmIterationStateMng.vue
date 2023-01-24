<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmIterationStates" icon="el-icon-search">查询</el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus"> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmIterationState 迭代定义-->
			<el-table ref="xmIterationStateTable" :data="xmIterationStates" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column prop="distBudgetCost" label="已分配到任务的预算从任务表汇总而来" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="distBudgetWorkload" label="已分配到任务的预算工作量从任务表汇总而来" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="actCost" label="实际成本从任务表汇总而来" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="actWorkload" label="实际工作量从任务表汇总而来" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="actStaffNum" label="实际投入人员数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="finishRate" label="进度" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="testCases" label="测试用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="execCases" label="测试中用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="designCases" label="设计中用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="finishCases" label="完成用例总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="projectCnt" label="关联项目数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="productCnt" label="关联产品数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="menuCnt" label="关联故事数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskCnt" label="关联任务数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskFinishCnt" label="已完成的任务数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="calcTime" label="计算日期" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="iterationName" label="迭代名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="budgetCost" label="预算成本" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="budgetWorkload" label="预算工作量" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="iterationId" label="迭代编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="业务日期yyyy-MM-dd字符串" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="closedBugCnt" label="已关闭bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="resolvedBugCnt" label="已解决bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="activeBugCnt" label="激活的bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="confirmedBugCnt" label="已解决bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bugCnt" label="bug总数" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="estimateWorkload" label="预估工时=计划结束时间在计算当日前完成的任务的预算工时总和" min-width="80" show-overflow-tooltip></el-table-column>
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
			<!--编辑 XmIterationState 迭代定义界面-->
			<el-drawer title="编辑迭代定义" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-iteration-state-edit op-type="edit" :xm-iteration-state="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-iteration-state-edit>
			</el-drawer>

			<!--新增 XmIterationState 迭代定义界面-->
			<el-drawer title="新增迭代定义" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-iteration-state-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-iteration-state-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmIterationState, delXmIterationState, batchDelXmIterationState } from '@/api/xm/core/xmIterationState';
	import  XmIterationStateEdit from './XmIterationStateEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmIterationStateMng',
		components: {
		    XmIterationStateEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmIterationStates()
                }
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
				addFormVisible: false,//新增xmIterationState界面是否显示
				addForm: {
					distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',finishRate:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',productCnt:'',menuCnt:'',taskCnt:'',taskFinishCnt:'',calcTime:'',iterationName:'',budgetCost:'',budgetWorkload:'',iterationId:'',bizDate:'',closedBugCnt:'',resolvedBugCnt:'',activeBugCnt:'',confirmedBugCnt:'',bugCnt:'',estimateWorkload:'',minStartTime:'',maxEndTime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',finishRate:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',productCnt:'',menuCnt:'',taskCnt:'',taskFinishCnt:'',calcTime:'',iterationName:'',budgetCost:'',budgetWorkload:'',iterationId:'',bizDate:'',closedBugCnt:'',resolvedBugCnt:'',activeBugCnt:'',confirmedBugCnt:'',bugCnt:'',estimateWorkload:'',minStartTime:'',maxEndTime:''
				},
				maxTableHeight:300,
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
				if(this.filters.key){
					params.key=this.filters.key
				}

				this.load.list = true;
				listXmIterationState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmIterationStates = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
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
					let params = {  iterationId:row.iterationId };
					delXmIterationState(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmIterationStates();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmIterationState
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { iterationId:i.iterationId}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmIterationState(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmIterationStates(); 
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
				this.searchXmIterationStates();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmIterationStateTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>