<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmBranchTaskTypeStates">查询</el-button>
			<el-button type="primary" @click="showAdd">+按机构编号任务类型汇总</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmBranchTaskTypeState 按机构编号任务类型汇总-->
			<el-table :data="xmBranchTaskTypeStates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="45"></el-table-column>
				<el-table-column sortable type="index" width="45"></el-table-column>
				<el-table-column prop="taskType" label="任务类型" min-width="80" ></el-table-column>
				<el-table-column prop="planWorkload" label="工作量" min-width="80" ></el-table-column>
				<el-table-column prop="planAmount" label="预算金额" min-width="80" ></el-table-column>
				<el-table-column prop="actWorkload" label="实际完成工作量" min-width="80" ></el-table-column>
				<el-table-column prop="actAmount" label="实际完成金额" min-width="80" ></el-table-column>
				<el-table-column prop="branchId" label="机构编号" min-width="80" ></el-table-column>
				<el-table-column prop="bizDate" label="业务日期yyyy-MM-dd型" min-width="80" ></el-table-column>
				<el-table-column prop="calcTime" label="计算日期" min-width="80" ></el-table-column>
				<el-table-column prop="planOutUserAt" label="外购资金预算" min-width="80" ></el-table-column>
				<el-table-column prop="planInnerUserAt" label="内购资金预算" min-width="80" ></el-table-column>
				<el-table-column prop="actOutUserAt" label="实际外购成本" min-width="80" ></el-table-column>
				<el-table-column prop="actInnerUserAt" label="实际内购成本" min-width="80" ></el-table-column>
				<el-table-column prop="planOutUserWorkload" label="计划外购工作量" min-width="80" ></el-table-column>
				<el-table-column prop="planInnerUserWorkload" label="计划内购工作量" min-width="80" ></el-table-column>
				<el-table-column prop="actOutUserWorkload" label="实际外购工作量" min-width="80" ></el-table-column>
				<el-table-column prop="actInnerUserWorkload" label="实际内购工作量" min-width="80" ></el-table-column>
				<el-table-column prop="planNouserAt" label="计划非人力成本" min-width="80" ></el-table-column>
				<el-table-column prop="actNouserAt" label="实际非人力成本" min-width="80" ></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="branchName" label="机构名称" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right">
					<template scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmBranchTaskTypeState 按机构编号任务类型汇总界面-->
			<el-drawer title="编辑按机构编号任务类型汇总" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-branch-task-type-state-edit :xm-branch-task-type-state="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-branch-task-type-state-edit>
			</el-drawer>
	
			<!--新增 XmBranchTaskTypeState 按机构编号任务类型汇总界面-->
			<el-drawer title="新增按机构编号任务类型汇总" :visible.sync="addFormVisible"  width="50%"  append-to-body  :close-on-click-modal="false">
				<xm-branch-task-type-state-add :xm-branch-task-type-state="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-branch-task-type-state-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmBranchTaskTypeState, delXmBranchTaskTypeState, batchDelXmBranchTaskTypeState } from '@/api/xm/core/xmBranchTaskTypeState';
	import  XmBranchTaskTypeStateAdd from './XmBranchTaskTypeStateAdd';//新增界面
	import  XmBranchTaskTypeStateEdit from './XmBranchTaskTypeStateEdit';//修改界面
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
				xmBranchTaskTypeStates: [],//查询结果
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
				
				addFormVisible: false,//新增xmBranchTaskTypeState界面是否显示
				//新增xmBranchTaskTypeState界面初始化数据
				addForm: {
					taskType:'',planWorkload:'',planAmount:'',actWorkload:'',actAmount:'',branchId:'',bizDate:'',calcTime:'',planOutUserAt:'',planInnerUserAt:'',actOutUserAt:'',actInnerUserAt:'',planOutUserWorkload:'',planInnerUserWorkload:'',actOutUserWorkload:'',actInnerUserWorkload:'',planNouserAt:'',actNouserAt:'',id:'',branchName:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmBranchTaskTypeState界面初始化数据
				editForm: {
					taskType:'',planWorkload:'',planAmount:'',actWorkload:'',actAmount:'',branchId:'',bizDate:'',calcTime:'',planOutUserAt:'',planInnerUserAt:'',actOutUserAt:'',actInnerUserAt:'',planOutUserWorkload:'',planInnerUserWorkload:'',actOutUserWorkload:'',actInnerUserWorkload:'',planNouserAt:'',actNouserAt:'',id:'',branchName:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmBranchTaskTypeStates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmBranchTaskTypeStates();
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
				this.getXmBranchTaskTypeStates();
			},
			searchXmBranchTaskTypeStates(){
				 this.pageInfo.count=true; 
				 this.getXmBranchTaskTypeStates();
			},
			//获取列表 XmBranchTaskTypeState 按机构编号任务类型汇总
			getXmBranchTaskTypeStates() {
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
				listXmBranchTaskTypeState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmBranchTaskTypeStates = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmBranchTaskTypeState 按机构编号任务类型汇总
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmBranchTaskTypeState 按机构编号任务类型汇总
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmBranchTaskTypeStates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmBranchTaskTypeState
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmBranchTaskTypeState
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmBranchTaskTypeState(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmBranchTaskTypeStates();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmBranchTaskTypeState
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmBranchTaskTypeState(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmBranchTaskTypeStates(); 
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
		    'xm-branch-task-type-state-add':XmBranchTaskTypeStateAdd,
		    'xm-branch-task-type-state-edit':XmBranchTaskTypeStateEdit, 
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmBranchTaskTypeStates();
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