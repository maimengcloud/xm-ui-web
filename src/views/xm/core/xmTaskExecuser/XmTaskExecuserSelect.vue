<template>
	<section class="padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 10em;" placeholder="任务名称" clearable></el-input>
			<el-input v-model="filters.taskId" style="width:10em;" placeholder="任务编号" clearable></el-input>
			<span v-if="!selProject || !selProject.id">
				<el-input  v-model="filters.projectId" style="width: 10em;" placeholder="项目编号" clearable></el-input>
				<el-input v-model="filters.branchId" style="width: 10em;" placeholder="项目公司编号" clearable></el-input>
			</span>
			<el-input v-model="filters.execUserBranchId" style="width: 10em;" placeholder="用户公司编号" clearable></el-input>
 			<el-select v-model="filters.status" style="width:6em;"  placeholder="候选状态" clearable>
				 <el-option v-for="(item,index) in dicts.projectTaskExecuserStatus" :value="item.id" :label="item.name" :key="index"></el-option>
			 </el-select>
 			<el-select v-model="filters.taskState" style="width:6em;"  placeholder="任务状态" clearable>
				 <el-option v-for="(item,index) in dicts.taskState" :value="item.id" :label="item.name" :key="index"></el-option>
			 </el-select>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmTaskExecusers">查询</el-button>
			<span style="float:right;">
			<el-button  type="primary" @click="select">确认选择</el-button>
			</span>
			<!-- <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>  -->
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTaskExecuser xm_task_execuser-->
			<el-table ref="table" v-adaptive="{bottomOffset:30}" :data="xmTaskExecusers" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">

				 <el-table-column  label="" type="selection" width="60"  fixed="left">
				</el-table-column>
				 <el-table-column  label="序号" type="index" width="60"  fixed="left">
				</el-table-column>
					 <el-table-column prop="username" label="用户姓名"  width="150" sortable  show-overflow-tooltip fixed="left">
						 <template slot-scope="scope">
							<mdp-select-user-xm :key="scope.row.id" v-model="scope.row" userid-key="userid" username-key="username" :project-id="scope.row.projectId" :disabled="true"></mdp-select-user-xm>
						 </template>
					</el-table-column>
					<el-table-column prop="execUserBranchId" label="用户归属公司" width="150" sortable  show-overflow-tooltip fixed="left">
					</el-table-column>
					<el-table-column prop="status" label="候选状态"  width="100" sortable fixed="left">
						<template slot-scope="scope">
							<el-link type="primary" v-if="scope.row.status=='0'">候选中</el-link>
							<el-link type="success" v-else-if="scope.row.status=='1'">执行中 </el-link>
							<el-link type="info" v-else-if="scope.row.status=='7'">已放弃  </el-link>
							<el-link type="danger" v-else-if="scope.row.status=='8'">黑名单 </el-link>
						</template>
					</el-table-column>
					<el-table-column prop="taskName" label="任务名称" width="150" sortable  show-overflow-tooltip fixed="left">
					</el-table-column>
					<el-table-column prop="taskName" label="任务状态" width="100" sortable  show-overflow-tooltip >
						<template slot-scope="scope">
							<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'taskState',scope.row.taskState)" :key="index" :type="item.className">{{item.name}}</el-tag>
 						</template>
					</el-table-column>
					<el-table-column prop="projectId" label="项目编号" width="100" sortable show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="startTime" label="加入时间"  width="150" sortable>
					</el-table-column>
					<el-table-column prop="endTime" label="离开时间"  width="150" sortable>
					</el-table-column>
					<el-table-column prop="skillRemark" label="技能" min-width="150" sortable  show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="remarks" label="备注" min-width="150" sortable  show-overflow-tooltip>
					</el-table-column>
				<el-table-column  label="报价信息" min-width="150">

					 <el-table-column prop="createTime" label="报价时间" width="150" sortable>
					</el-table-column>
					 <el-table-column prop="quoteWorkload" label="报价工作量" width="100" sortable>
						<template slot-scope="scope">
							{{scope.row.quoteWorkload?scope.row.quoteWorkload:'-'}}h
						</template>
					</el-table-column>
					<el-table-column prop="quotePrice" label="报价金额" width="100" sortable>

						<template slot-scope="scope">
							￥{{scope.row.quotePrice?scope.row.quotePrice:'-'}}元
						</template>
					</el-table-column>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库
	import MdpSelectUserXm from "@/views/xm/core/components/MdpSelectUserXm/index";
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmTaskExecuserWithTask,editXmTaskExecuser,leaveTask,beExecutor,settleExec, delXmTaskExecuser, batchDelXmTaskExecuser,quotePrice,becomeCandidate,toTest,testSuccess,testFail } from '@/api/xm/core/xmTaskExecuser';
   	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]),
			xmTask:function(){
				var xmTask={...this.editForm}
				xmTask.id=this.editForm.taskId;
				return xmTask;
			}
		},
		props: ["visible",'selProject'],
		watch: {
			'visible': function(val) {
				if(val == true){
					this.searchXmTaskExecusers();
				}
			},
		},
		data() {
			return {
				filters: {
					key: '',
					execUserBranchId:'',
					taskId:'',
					projectId:'',
					status:'',
					taskState:'',
					branchId:'',
				},
				xmTaskExecusers: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['res.create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					projectTaskExecuserStatus:[],
					projectTaskSettleStatus:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmTaskExecuser界面是否显示
				//新增xmTaskExecuser界面初始化数据
				addForm: {
					createTime:'',id:'',taskId:'',userid:'',startTime:'',endTime:'',status:'',remarks:'',settleAmount:'',settleWorkload:'',settleStatus:'',settleTime:'',createUserid:'',createUsername:'',username:'',matchScore:'',quoteWeekday:'',quoteAmount:'',quoteTime:'',bizProcInstId:'',bizFlowState:'',projectId:'',phaseId:'',skillRemark:'',quoteWorkload:'',quoteStartTime:'',quoteEndTime:'',branchId:'',projectPhaseName:'',taskName:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmTaskExecuser界面初始化数据
				editForm: {
					createTime:'',id:'',taskId:'',userid:'',startTime:'',endTime:'',status:'',remarks:'',settleAmount:'',settleWorkload:'',settleStatus:'',settleTime:'',createUserid:'',createUsername:'',username:'',matchScore:'',quoteWeekday:'',quoteAmount:'',quoteTime:'',bizProcInstId:'',bizFlowState:'',projectId:'',phaseId:'',skillRemark:'',quoteWorkload:'',quoteStartTime:'',quoteEndTime:'',branchId:'',projectPhaseName:'',taskName:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
 				pickerOptions:  util.getPickerOptions('datarange'),
				tableHeight:300,

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			...util,
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmTaskExecusers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTaskExecusers();
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
				this.getXmTaskExecusers();
			},
			searchXmTaskExecusers(){
				 this.pageInfo.count=true;
				 this.getXmTaskExecusers();
			},
			//获取列表 XmTaskExecuser xm_task_execuser
			getXmTaskExecusers() {
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
					 params.key=this.filters.key
				}
				this.load.list = true;
				if(this.filters.taskId){
					params.taskId=this.filters.taskId
				}
				if(this.filters.projectId){
					params.projectId=this.filters.projectId
				}
				if(this.selProject && this.selProject.id){
					params.projectId=this.selProject.id
				}
				if(this.filters.execUserBranchId){
					params.execUserBranchId=this.filters.execUserBranchId
				}

				if(this.filters.taskState){
					params.taskState=this.filters.taskState
				}
				if(this.filters.status){
					params.status=this.filters.status
				}
				listXmTaskExecuserWithTask(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTaskExecusers = res.data.data;
						this.$emit("loadExecUserList",this.xmTaskExecusers);
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//选择行xmTaskExecuser
			selsChange: function (sels) {
				this.sels = sels;
			},
			rowClick: function(row, event, column){
				this.editForm=row;
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**end 自定义函数请在上面加**/
			select: function(){
				this.$emit('select',this.sels);//  @row-click="rowClick"
			},
		},//end methods
		components: {
		    //在下面添加其它组件
			MdpSelectUserXm
		},
		mounted() {
			this.$nextTick(() => {
				this.tableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
				this.getXmTaskExecusers();
				});


		}
	}

</script>

<style scoped>
.exec-navbar{
	background: #fafbfc;
	padding: 0 20px;
	height: 50px;
	overflow: auto hidden;
	line-height: 50px;
}
.badge {
  margin-top: 7px;
  padding-bottom: 10px;
}
</style>
