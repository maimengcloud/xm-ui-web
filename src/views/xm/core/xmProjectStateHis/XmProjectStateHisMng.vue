<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectStateHiss">查询</el-button>
			<el-button type="primary" @click="showAdd">+xm_project_state_his</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="page-main page-main-height"> 
			<!--列表 XmProjectStateHis xm_project_state_his-->
			<el-table :data="xmProjectStateHiss" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="projectId" label="项目编号" min-width="80" ></el-table-column>
				<el-table-column prop="bizDate" label="统计日期yyyy-mm-dd类型" min-width="80" ></el-table-column>
				<el-table-column prop="totalFileCnt" label="文件数据" min-width="80" ></el-table-column>
				<el-table-column prop="totalBugCnt" label="bug数目" min-width="80" ></el-table-column>
				<el-table-column prop="totalTaskCnt" label="任务数" min-width="80" ></el-table-column>
				<el-table-column prop="totalBudgetNouserAmount" label="项目总非人力预算-来自项目表" min-width="80" ></el-table-column>
				<el-table-column prop="projectName" label="项目名称" min-width="80" ></el-table-column>
				<el-table-column prop="stateId" label="xm_project_state原表主键id" min-width="80" ></el-table-column>
				<el-table-column prop="totalStaffCnt" label="总参与人数" min-width="80" ></el-table-column>
				<el-table-column prop="calCtime" label="统计执行日期" min-width="80" ></el-table-column>
				<el-table-column prop="calStatus" label="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostNouserAmount" label="项目总非人力成本" min-width="80" ></el-table-column>
				<el-table-column prop="totalCloseBugCnt" label="已关闭bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalResolveBugCnt" label="已解决bug总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteTaskCnt" label="已完成任务总数-来自任务表" min-width="80" ></el-table-column>
				<el-table-column prop="totalPhaseCnt" label="项目阶段计划数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompletePhaseCnt" label="项目阶段计划已完成数" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedPayAmount" label="待付款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishPayAmount" label="已付款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalNeedColAmount" label="待收款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalFinishColAmount" label="已收款总金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalCostUserAmount" label="项目总人力成本" min-width="80" ></el-table-column>
				<el-table-column prop="totalBudgetInnerUserAmount" label="项目总内部人力预算-来自项目表" min-width="80" ></el-table-column>
				<el-table-column prop="totalPlanWorkload" label="项目总预算工作量-来自项目表" min-width="80" ></el-table-column>
				<el-table-column prop="totalRiskCnt" label="项目风险总数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteRiskCnt" label="已完成风险总数" min-width="80" ></el-table-column>
				<el-table-column prop="branchId" label="机构编号" min-width="80" ></el-table-column>
				<el-table-column prop="branchName" label="机构名称" min-width="80" ></el-table-column>
				<el-table-column prop="totalBudgetOutUserAmount" label="项目总外购人力预算-来自项目表" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteWorkload" label="已完成工作量-来自计划中实际完成工作量" min-width="80" ></el-table-column>
				<el-table-column prop="id" label="本表主键" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProjectStateHis xm_project_state_his界面-->
			<el-drawer title="编辑xm_project_state_his" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-state-his-edit :xm-project-state-his="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-state-his-edit>
			</el-drawer>
	
			<!--新增 XmProjectStateHis xm_project_state_his界面-->
			<el-drawer title="新增xm_project_state_his" :visible.sync="addFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				<xm-project-state-his-add :xm-project-state-his="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-state-his-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectStateHis, delXmProjectStateHis, batchDelXmProjectStateHis } from '@/api/xm/core/xmProjectStateHis';
	import  XmProjectStateHisAdd from './XmProjectStateHisAdd';//新增界面
	import  XmProjectStateHisEdit from './XmProjectStateHisEdit';//修改界面
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
				xmProjectStateHiss: [],//查询结果
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProjectStateHis界面是否显示
				//新增xmProjectStateHis界面初始化数据
				addForm: {
					projectId:'',bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',projectName:'',stateId:'',totalStaffCnt:'',calCtime:'',calStatus:'',totalCostNouserAmount:'',totalCloseBugCnt:'',totalResolveBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetInnerUserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOutUserAmount:'',totalCompleteWorkload:'',id:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectStateHis界面初始化数据
				editForm: {
					projectId:'',bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',projectName:'',stateId:'',totalStaffCnt:'',calCtime:'',calStatus:'',totalCostNouserAmount:'',totalCloseBugCnt:'',totalResolveBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetInnerUserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOutUserAmount:'',totalCompleteWorkload:'',id:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectStateHiss();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectStateHiss();
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
				this.getXmProjectStateHiss();
			},
			searchXmProjectStateHiss(){
				 this.pageInfo.count=true; 
				 this.getXmProjectStateHiss();
			},
			//获取列表 XmProjectStateHis xm_project_state_his
			getXmProjectStateHiss() {
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
				listXmProjectStateHis(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectStateHiss = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectStateHis xm_project_state_his
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectStateHis xm_project_state_his
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectStateHiss();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectStateHis
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectStateHis
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectStateHis(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectStateHiss();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectStateHis
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectStateHis(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectStateHiss(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-project-state-his-add':XmProjectStateHisAdd,
		    'xm-project-state-his-edit':XmProjectStateHisEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProjectStateHiss();
        	}); 
		}
	}

</script>

<style scoped>

</style>