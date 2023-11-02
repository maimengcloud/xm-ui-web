<template>
	<section>
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmWorkloads" icon="el-icon-search">已登记工时查询</el-button>
			<span style="float:right;">
			<el-button type="primary" @click="showAdd" icon="el-icon-plus" v-if="bizType!='5'"> 登记工时</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
			</span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmWorkload 工时登记表-->
			<el-table ref="xmWorkloadTable" :data="xmWorkloads"  @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="username" label="姓名" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-link @click="queryUserWorkload(scope.row)">{{scope.row.username}}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="bizDate" label="报送日期" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="workload" label="报送工时" min-width="80" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="wstatus" label="状态" min-width="80" show-overflow-tooltip>
					 <template slot-scope="scope">
						 {{scope.row.wstatus==='1'?'已确认':'待确认'}}
					 </template>
				 </el-table-column>

				<el-table-column prop="bizType" label="报工类型" width="120" show-overflow-tooltip>
					<template slot-scope="scope">
						<mdp-select show-style="tag" :disabled="true" v-model="scope.row.bizType" item-code="wlBizType"></mdp-select>
					</template>
				</el-table-column>
				<el-table-column prop="bizName" label="报工业务" width="120" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-link @click="openDialog(scope.row)">{{scope.row.bizName}}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="报工备注" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="ttype" label="任务类型" min-width="80" show-overflow-tooltip :formatter="formatterOption"></el-table-column>

			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>

			<!--新增 XmWorkload 工时登记表界面-->
			<el-dialog :title="'【'+editForm.name+'】新增工时'" :visible.sync="addFormVisible"  width="60%" top="20px"  append-to-body  :close-on-click-modal="false">
				<xm-workload-edit op-type="add" :biz-type="bizType" :xm-task="xmTask" :xm-menu="xmMenu" :xm-test-case="xmTestCase" :xm-test-plan-case="xmTestPlanCase" :xm-question="xmQuestion" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-workload-edit>
			</el-dialog>

		<el-dialog title="任务明细" :visible.sync="taskDetailVisible" width="90%" top="20px" append-to-body>
			<xm-task-detail :visible="taskDetailVisible" :xm-task="{id:editForm.taskId,name:editForm.bizName}" :reload="true"></xm-task-detail>
		</el-dialog>

		<el-dialog title="缺陷明细" :visible.sync="bugDetailVisible" width="90%" top="20px" append-to-body>
			<xm-question-detail :visible="bugDetailVisible" :xm-question="{id:editForm.bugId,name:editForm.bizName}" :reload="true"></xm-question-detail>
		</el-dialog>

		<el-dialog title="测试用例明细" :visible.sync="caseDetailVisible" width="90%" top="20px" append-to-body>
			<xm-test-case-detail :visible="caseDetailVisible" :xm-test-case="{id:editForm.caseId,name:editForm.bizName}" :reload="true"></xm-test-case-detail>
		</el-dialog>

		<el-dialog title="执行用例明细" :visible.sync="planCaseDetailVisible" width="90%" top="20px" append-to-body>
			<xm-test-plan-case-detail :visible="planCaseDetailVisible" :xm-plan-test-case="{planId:editForm.planId,caseId:editForm.caseId,name:editForm.bizName}" :reload="true"></xm-test-plan-case-detail>
		</el-dialog>

		<el-dialog title="需求明细" :visible.sync="menuDetailVisible" width="90%" top="20px" append-to-body>
			<xm-menu-detail :visible="menuDetailVisible" :xm-menu="{id:editForm.menuId,name:editForm.bizName}" :reload="true"></xm-menu-detail>
		</el-dialog>

		<el-dialog :title="'【'+editForm.username+'】在项目【'+editForm.projectId+'】的工时记录情况'" :visible.sync="userWorkloadDayListVisible" width="90%" top="20px" append-to-body>
				<workload-set-day-list :xm-project="{id:editForm.projectId}" :user="{userid:editForm.userid,username:editForm.username}"></workload-set-day-list>
			</el-dialog>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmWorkload, delXmWorkload, batchDelXmWorkload } from '@/api/xm/core/xmWorkload';
	import  XmWorkloadEdit from './XmWorkloadEdit';//新增修改界面
	import { mapGetters } from 'vuex'

	export default {
	    name:'xmWorkloadMng',
		components: {
		    XmWorkloadEdit,

			"xm-task-detail":()=>import("../xmTask/XmTaskDetail"),
			"xm-question-detail":()=>import("../xmQuestion/XmQuestionDetail"),
			"xm-test-case-detail":()=>import("../xmTestCase/XmTestCaseDetail"),
			"xm-test-plan-case-detail":()=>import("../xmTestPlanCase/XmTestPlanCaseDetail"),
			"xm-menu-detail":()=>import("../xmMenu/XmMenuDetail"),
			"workload-set-day-list":()=>import("./WorkloadSetDayList")
		},
		props:['xmTask','visible','bizType'/*报工类型1-任务，2-缺陷，3-测试用例设计，4-测试执行 */,
		'xmMenu','xmTestCase','xmQuestion','xmTestPlanCase'],
		computed: {
		    ...mapGetters(['userInfo']),
			val(){
				var params={}
				if( this.xmTask && this.xmTask.id){
					params.id=this.xmTask.id
					params.initWorkload=this.xmTask.initWorkload
					params.budgetWorkload=this.xmTask.budgetWorkload
					params.actWorkload=this.xmTask.actWorkload
					params.ntype=this.xmTask.ntype
					params.name=this.xmTask.name
				}
				if( this.xmMenu && this.xmMenu.menuId){
					params.menuId=this.xmMenu.menuId
					params.initWorkload=this.xmMenu.initWorkload
					params.budgetWorkload=this.xmMenu.budgetWorkload
					params.actWorkload=this.xmMenu.actWorkload
					params.ntype=this.xmMenu.ntype
					params.dclass=this.xmMenu.dclass
					params.name=this.xmMenu.name
					params.menuName=this.xmMenu.menuName
				}
				if( this.xmQuestion && this.xmQuestion.id){
					params.id=this.xmQuestion.id
					params.initWorkload=this.xmQuestion.initWorkload
					params.budgetWorkload=this.xmQuestion.budgetWorkload
					params.actWorkload=this.xmQuestion.actWorkload
					params.name=this.xmQuestion.name
				}
				if( this.xmTestCase && this.xmTestCase.id){
					params.id=this.xmTestCase.id
					params.initWorkload=this.xmTestCase.initWorkload
					params.budgetWorkload=this.xmTestCase.budgetWorkload
					params.actWorkload=this.xmTestCase.actWorkload
					params.name=this.xmTestCase.caseName
					params.caseName=this.xmTestCase.caseName
				}
				if( this.xmTestPlanCase && this.xmTestPlanCase.planId){
					params.planId=this.xmTestPlanCase.planId
					params.caseId=this.xmTestPlanCase.caseId
					params.initWorkload=this.xmTestPlanCase.initWorkload
					params.budgetWorkload=this.xmTestPlanCase.budgetWorkload
					params.actWorkload=this.xmTestPlanCase.actWorkload
					params.name=this.xmTestPlanCase.caseName
					params.caseName=this.xmTestPlanCase.caseName
				}
				return params
			}

		},
		watch:{
            visible(val){
                if(val==true){
                    this.searchXmWorkloads()
                }
            },
			val:{
				handler(){
					this.initData();
				},
				deep:true,
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmWorkloads: [],//查询结果
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
					taskType:[],
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmWorkload界面是否显示
				addForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
				},
				maxTableHeight:300,


				taskDetailVisible:false,
				bugDetailVisible:false,
				caseDetailVisible:false,
				planCaseDetailVisible:false,
				menuDetailVisible:false,

				userWorkloadDayListVisible:false,
			}
		},//end data
		methods: {

			formatterOption: function (row, column, cellValue, index) {
				var columnName = column.property;
				var key = columnName;
				if(columnName==='ttype'){
					key="taskType"
				}
				if (
					this.dicts[key] == undefined ||
					this.dicts[key] == null ||
					this.dicts[key].length == 0
				) {
					return cellValue;
				}
				var list = this.dicts[key].filter((i) => i.id == cellValue);
				if (list.length > 0) {
					return list[0].name;
				} else {
					return cellValue;
				}
			},
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmWorkloads();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmWorkloads();
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
				this.getXmWorkloads();
			},
			searchXmWorkloads(){
				 this.pageInfo.count=true;
				 this.getXmWorkloads();
			},
			//获取列表 XmWorkload 工时登记表
			getXmWorkloads() {
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
				if( this.xmTask && this.xmTask.id){
					params.taskId=this.xmTask.id
				}
				if( this.xmMenu && this.xmMenu.menuId){
					params.menuId=this.xmMenu.menuId
				}
				if( this.xmQuestion && this.xmQuestion.id){
					params.bugId=this.xmQuestion.id
				}
				if( this.xmTestCase && this.xmTestCase.id){
					params.caseId=this.xmTestCase.id
				}
				if( this.xmTestPlanCase && this.xmTestPlanCase.planId){
					params.planId=this.xmTestPlanCase.planId
					params.caseId=this.xmTestPlanCase.caseId
				}
				if(this.bizType!=='all'&&!params.planId&&!params.caseId&&!params.caseId &&!params.bugId&&!params.taskId&&!params.menuId){
					return;
				}

				this.load.list = true;
				listXmWorkload(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmWorkloads = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmWorkload 工时登记表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmWorkload 工时登记表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmWorkloads();
				this.$emit('submit',this.editForm)
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.$emit('submit',this.editForm)
			},
			//选择行xmWorkload
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmWorkload
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = {  id:row.id };
					delXmWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmWorkloads();
							this.$emit('submit',this.editForm)
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmWorkload
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { id:i.id}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmWorkloads();
							this.$emit('submit')
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
				this.editForm=Object.assign(this.editForm,this.val)
				this.editFormBak={...this.editForm}
            },
			goToBizDetail(row){
				this.editForm=row
				if(row.bizType=='1'){
					this.taskDetailVisible=true
				}else if(row.bizType=='2'){
					this.bugDetailVisible=true
				}else if(this.bizType=='3'){
					this.caseDetailVisible=true
				}else if(this.bizType=='4'){
					this.planCaseDetailVisible=true
				}else if(this.bizType=='5'){
					this.menuDetailVisible=true
				}
			},
			queryUserWorkload(row){
				this.editForm=row
				this.userWorkloadDayListVisible=true;
			},
			openDialog(row){
				this.editForm=row
				if(row.bizType=='1'){
					this.taskDetailVisible=true
				}else if(row.bizType=='2'){
					this.bugDetailVisible=true
				}else if(this.bizType=='3'){
					this.caseDetailVisible=true
				}else if(this.bizType=='4'){
					this.planCaseDetailVisible=true
				}else if(this.bizType=='5'){
					this.menuDetailVisible=true
				}
			},

		},//end methods
		mounted() {
			this.$nextTick(() => {

				initSimpleDicts('all',[ 'taskType' ]).then(res=>{
					this.dicts=res.data.data;
				})
			    this.initData()
				this.searchXmWorkloads();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmWorkloadTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>
