<template>
	<section class="padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 10em;" placeholder="任务名称" clearable></el-input>
			<el-input v-model="filters.taskId" style="width:10em;;" placeholder="任务编号" clearable></el-input>
			<el-input v-model="filters.projectId" style="width: 10em;;" placeholder="项目编号" clearable></el-input>
 			<el-input v-model="filters.execUserBranchId" style="width: 10em;;" placeholder="用户公司编号" clearable></el-input>
 			<el-input v-model="filters.branchId" style="width: 10em;;" placeholder="项目公司编号" clearable></el-input>
 			<el-select v-model="filters.status" style="width:6em;"  placeholder="候选状态" clearable>
				 <el-option v-for="(item,index) in dicts.projectTaskExecuserStatus" :value="item.id" :label="item.name" :key="index"></el-option>
			 </el-select>
 			<el-select v-model="filters.taskState" style="width:6em;"  placeholder="任务状态" clearable>
				 <el-option v-for="(item,index) in dicts.taskState" :value="item.id" :label="item.name" :key="index"></el-option>
			 </el-select>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmTaskExecusers">查询</el-button>
			<!-- <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>  -->
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTaskExecuser xm_task_execuser-->
			<el-table ref="table" v-adaptive="{bottomOffset:30}" :data="xmTaskExecusers" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
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
						<el-popover trigger="hover"
							width="500" >
							<el-row>
  									<!--结算状态0未结算1已部分结算2无需结算4已申请结算5结算失败6已全部结算-->
									<el-button type="primary" v-if="scope.row.status=='7' " @click="becomeCandidate(scope.row)">成为候选人</el-button>
									<el-button type="danger" v-if="scope.row.status=='7' " @click="handleDel(scope.row)">删除</el-button>
									<el-button type="warning" v-if="scope.row.status=='0'"  @click="showQuotePrice(scope.row)">修改报价信息</el-button>
									<el-button type="primary" v-if="scope.row.status=='0'"   @click="execute(scope.row)">成为执行人</el-button>
									<el-button type="primary" v-if="scope.row.status=='1' " @click="showWorkload(scope.row)">填报工时进度</el-button>
									<el-button type="warning" v-if="scope.row.status!='7' " @click="leave(scope.row)">离开任务</el-button>
									<br><font color="blue">{{formatToDoByStatus(scope.row)}}</font>
							</el-row>
								<font slot="reference">
										<el-link type="primary" v-if="scope.row.status=='0'">候选中</el-link>
										<el-link type="success" v-else-if="scope.row.status=='1'">执行中 </el-link>
										<el-link type="info" v-else-if="scope.row.status=='7'">已放弃  </el-link>
										<el-link type="danger" v-else-if="scope.row.status=='8'">黑名单 </el-link>
								</font>

						</el-popover>
						</template>
					</el-table-column>

					<el-table-column prop="taskName" label="任务名称" width="150" sortable  show-overflow-tooltip fixed="left">
					</el-table-column>
					<el-table-column sortable prop="rate" label="进度" width="100">
						<template slot-scope="scope">
						<el-link :disabled="scope.row.ntype=='1'"
							style="border-radius: 30px"
							:type="scope.row.rate >= 100 ? 'success' : 'warning'"
							@click="showWorkload(scope.row)"
						>
							{{ (scope.row.rate != null ? scope.row.rate : 0) + "%" }}
						</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="taskName" label="任务状态" width="100" sortable  show-overflow-tooltip >
						<template slot-scope="scope">
							<el-button style="display:block;" :type="item.className" plain round v-for="(item,index) in formatterTaskStateDicts(scope.row.taskState)" :key="index">{{item.name}}</el-button>
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

					 <el-table-column prop="createTime" label="报价时间" width="150" sortable>
					</el-table-column>
					 <el-table-column prop="quoteWorkload" label="报价工时" width="100" sortable>
						<template slot-scope="scope">
							{{scope.row.quoteWorkload?scope.row.quoteWorkload:'-'}}h
						</template>
					</el-table-column>
					<el-table-column prop="quotePrice" label="报价金额" width="100" sortable>

						<template slot-scope="scope">
							￥{{scope.row.quotePrice?scope.row.quotePrice:'-'}}元
						</template>
					</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

			<el-drawer append-to-body title="报价" :visible.sync="quotePriceVisible" size="60%" :close-on-click-modal="false">
				<el-form :model="quotePriceForm" label-width="100px" ref="quotePriceForm">
					<el-form-item label="候选人名称">
						<span>{{ quotePriceForm.username }}</span>
					</el-form-item>
					<el-form-item label="报价工期" prop="quoteWeekday">
						<div>
						<el-input v-model="quotePriceForm.quoteWeekday" style="width:30%;" type="number" placeholder="报价工期（不包括周六日）" ></el-input>工作日
						<el-date-picker
							v-model="quoteDateRanger"
							class="hidden-sm-and-down"
							type="daterange"
							align="right"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="完成日期"
							value-format="yyyy-MM-dd HH:mm:ss"
							:default-time="['00:00:00','23:59:59']"
							:picker-options="pickerOptions"
						></el-date-picker>
						</div>
						<el-tag>原来{{editForm.quoteWeekday}},任务要求{{xmTask.startTime}}~{{xmTask.endTime}}</el-tag>
					</el-form-item>
					<el-form-item label="报价工作量" prop="quoteWorkload">
						<el-input v-model="quotePriceForm.quoteWorkload" type="number" placeholder="报价工作量（人时）" ></el-input>
						<el-tag>原来{{editForm.quoteWorkload}},任务预估{{xmTask.budgetWorkload}}</el-tag>
					</el-form-item>
					<el-form-item label="报价金额" prop="quoteAmount">
						<el-input v-model="quotePriceForm.quoteAmount" type="number" placeholder="报价金额" ></el-input>
						<el-tag>原来{{editForm.quoteAmount}},任务预算{{xmTask.budgetCost}}</el-tag>
					</el-form-item>
					<el-form-item label="擅长技能" prop="skillRemark">
						<el-input type="textarea" :row="3" v-model="quotePriceForm.skillRemark" placeholder="擅长技能" ></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click.native="quotePriceVisible=false">取消</el-button>
						<el-button v-loading="load.edit"   @click.native="fillTaskBudgetInfoToQuotePriceForm" :disabled="load.edit==true">按任务预算填充</el-button>
 						<el-button v-loading="load.edit" type="primary" @click.native="handleQuotePrice" :disabled="load.edit==true">提交</el-button>
					</el-form-item>
				</el-form>
			</el-drawer>

			<!--编辑 XmTaskExecuser xm_task_execuser界面-->
			<el-drawer append-to-body title="编辑任务执行人" :visible.sync="editFormVisible"  size="50%"  :close-on-click-modal="false">
				<xm-task-execuser-edit :exec-user-list="xmTaskExecusers" :xm-task="xmTask"   :xm-task-execuser="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-execuser-edit>
			</el-drawer>

			<!--新增 XmTaskExecuser xm_task_execuser界面-->
			<el-drawer append-to-body title="新增任务执行人" :visible.sync="addFormVisible"  size="50%"  :close-on-click-modal="false">
				<xm-task-execuser-add :exec-user-list="xmTaskExecusers" :xm-task="xmTask" :execuser-add-type="execuserAddType"  :xm-task-execuser="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-execuser-add>
			</el-drawer>
			<el-dialog
				:title="'【'+xmTask.name+'】登记工时'"
				:visible.sync="taskWorkloadVisible"
				width="60%"
				top="20px"
				append-to-body
				:close-on-click-modal="false"
				>
				<xm-workload-edit
					:xm-task="xmTask"
					:visible="taskWorkloadVisible"
					op-type="add"
					@cancel="taskWorkloadVisible=false"
					@submit="onTaskWorkloadSubmit"
				></xm-workload-edit>
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库

	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmTaskExecuserWithTask,editXmTaskExecuser,leaveTask,beExecutor,settleExec, delXmTaskExecuser, batchDelXmTaskExecuser,quotePrice,becomeCandidate,toTest,testSuccess,testFail } from '@/api/xm/core/xmTaskExecuser';
	import  XmTaskExecuserAdd from './XmTaskExecuserAdd';//新增界面
	import  XmTaskExecuserEdit from './XmTaskExecuserEdit';//修改界面
	import { mapGetters } from 'vuex'
	import html2canvas from 'html2canvas'
	import { uploadBase64 } from '@/api/mdp/arc/image';
  	import XmWorkloadEdit from "@/views/xm/core/xmWorkload/XmWorkloadEdit";
	import MdpSelectUserXm from "@/views/xm/core/components/MdpSelectUserXm/index";

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
		props: ["visible","isMy"],
		watch: {
			'visible': function(val) {
				if(val == true){
					console.log("visible");
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

				settleVisible: false,
				settleForm: {
					settleAmount: '',settleWorkload: '', settleStatus: '',
				},
				settleListVisible:false,
				quotePriceForm: {
					quoteAmount: '',quoteWorkload: '', skillRemark: '',quoteStartTime:'',quoteEndTime:'',id:'',userid:'',usernane:'',taskId:'',
				},
				quotePriceVisible:false,
				readyAdd: [],
				quoteDateRanger: [
				],
				execuserAddType:'add',//add为新增 join为当前登陆者加入
				pickerOptions:  util.getPickerOptions('datarange'),
				tableHeight:300,
				taskWorkloadVisible:false,

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
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
				if(this.isMy=='1'){
					params.isMy='1'
				}
				this.load.list = true;
				if(this.isMy=='1'){
					params.userid=this.userInfo.userid
				}
				if(this.filters.taskId){
					params.taskId=this.filters.taskId
				}
				if(this.filters.projectId){
					params.projectId=this.filters.projectId
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

			//显示编辑界面 XmTaskExecuser xm_task_execuser
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTaskExecuser xm_task_execuser
			showAdd: function () {
				this.execuserAddType="";
				this.addFormVisible = true;

				//this.addForm=Object.assign({}, this.editForm);
			},
			toJoin(){
				this.execuserAddType="join"
				this.addFormVisible = true;
			},
			getWeekday(first, last) {
				//计算工作日方法：遍历这两个日期区间的每一个日期，获取他的getDay()

				//分别获取first和last的毫秒数(时间戳)
				first = first.getTime();
				last = last.getTime();

				var count = 0;
				for (var i = first; i <= last; i += 24 * 3600 * 1000) {
					var d = new Date(i);
					if (d.getDay() >= 1 && d.getDay() <= 5) {
						count++;
					}
				}
				return count;
			},
			showQuotePrice(row){
				this.editForm=row
				this.quotePriceForm=Object.assign({},row);
				this.quoteDateRanger=[];
				this.quoteDateRanger.push(this.quotePriceForm.quoteStartTime);
				this.quoteDateRanger.push(this.quotePriceForm.quoteEndTime);
				this.quotePriceVisible=true;
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.$emit("after-add-submit",this.addForm);

				this.getXmTaskExecusers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmTaskExecusers();
				this.$emit("after-edit-submit",this.editForm);
			},
			afterDeleteSubmit(){
				this.getXmTaskExecusers();
				this.$emit("after-delete-submit");
			},
			//选择行xmTaskExecuser
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmTaskExecuser
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = row;
					params.taskName=this.xmTask.name;
					delXmTaskExecuser(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.afterDeleteSubmit();
 						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTaskExecuser
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmTaskExecuser(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.afterDeleteSubmit();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.editForm=row;
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/

			checkSelectable(row,index){
				return row.status != 2;
			},
			leave(row) {
				row.taskName=this.xmTask.name
				var selExec = [row].filter(i=>i.status !="7");
				if(selExec.length > 0){
					this.$confirm('确定离开任务吗？', '提示', {}).then(() => {
						this.load.edit=true;
						leaveTask(selExec).then((res) => {
							this.load.edit=false
							var tips=res.data.tips;
							if(tips.isOk){
								this.afterEditSubmit();
 							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						}).catch( err =>this.load.edit=false);
					});
				}
			},
			execute(row) {
				row.taskName=this.xmTask.name
 				if( row && row.status=="0"){
					this.$confirm('确定变更为执行人吗？', '提示', {}).then(() => {
						this.load.edit=true;
						beExecutor(row).then((res) => {
							this.load.edit=false
							var tips=res.data.tips;
							if(tips.isOk){
								this.afterEditSubmit();
							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						}).catch( err =>this.load.edit=false);
					});
				}else if(row.status=="1"){
					 this.$notify.error("已是执行人，无需变更");
				}else if(row.status=="7"){
					 this.$notify.error("已离开任务，不允许变更执行人");
				}else if(row.status=="8"){
					 this.$notify.error("黑名单，不允许参与该任务");
				}else{
					 this.$notify.error("已是执行人，无需变更");
				}
			},
			settle(row) {
				this.editForm=row
				this.settleVisible = true;
			},

			handleSettle() {
				var selExec=this.sels;
				selExec.forEach(l=>{
					l = Object.assign(l,this.settleForm);
				});
				this.$confirm('确定结算吗？', '提示', {}).then(() => {
					this.load.edit=true;
					settleExec(selExec).then((res) => {
						this.load.edit=false
						var tips=res.data.tips;
						if(tips.isOk){
							this.settleVisible = false;
							this.$refs['settleForm'].resetFields();
							this.afterEditSubmit();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err =>this.load.edit=false);
				});
			},

			handleQuotePrice() {
				if(this.quoteDateRanger.length==2){
					this.quotePriceForm.quoteStartTime=this.quoteDateRanger[0]
					this.quotePriceForm.quoteEndTime=this.quoteDateRanger[1]
				}
				this.$confirm('确定提交报价吗？', '提示', {}).then(() => {
					this.load.edit=true;
					quotePrice(this.quotePriceForm).then((res) => {
						this.load.edit=false
						var tips=res.data.tips;
						if(tips.isOk){
							this.quotePriceVisible = false;
							this.afterEditSubmit();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err =>this.load.edit=false);
				});
			},
			fillTaskBudgetInfoToQuotePriceForm(){
				this.quotePriceForm.quoteAmount=this.xmTask.budgetCost
				this.quotePriceForm.quoteWorkload=this.xmTask.budgetWorkload
				this.quotePriceForm.quoteStartTime=this.xmTask.startTime
				this.quotePriceForm.quoteEndTime=this.xmTask.endTime
				this.quoteDateRanger=[];
				this.quoteDateRanger.push(this.quotePriceForm.quoteStartTime);
				this.quoteDateRanger.push(this.quotePriceForm.quoteEndTime);
				if(!this.quotePriceForm.quoteWeekday){
					this.quotePriceForm.quoteWeekday=this.getWeekday(new Date(this.quotePriceForm.quoteStartTime),new Date(this.quotePriceForm.quoteEndTime));
				}

			},
			fillQuotePriceToSettleForm(){
				this.settleForm.settleAmount=this.editForm.quoteAmount
				this.settleForm.settleWorkload=this.editForm.quoteWorkload
			},
			handleSettleCancel() {
				this.settleVisible = false;
				this.$refs['settleForm'].resetFields();
			},
			formatterOption: function(row,column,cellValue, index){
				var columnName=column.property;
				var key="";
				if(columnName=='status'){
					key="projectTaskExecuserStatus"
				}else if(columnName=='settleStatus'){
					key="projectTaskSettleStatus"
				}else{
					return cellValue
				}
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return cellValue;
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					return list[0].name
				}else{
					return cellValue;
				}

			},
			toAcceptance:function(){

			},
			toTest:function(row){
				var params=row;
				toTest(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.getXmTaskExecusers();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},

			testSuccess:function(row){
				var params=row;
				testSuccess(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.getXmTaskExecusers();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},

			testFail:function(row){
				var params=row;
				testFail(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.getXmTaskExecusers();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},
			showSettleList: function(row){
				this.editForm=row;
				this.settleListVisible=true;
			},
			showApprovaInfo:function(row){
				var msgFields=[];
				if(row.mainTitle!=null && row.mainTitle!=""){
					msgFields.push("流程【"+row.mainTitle+"】");
				}

				if(row.taskName!=null && row.taskName!=""){
					msgFields.push("当前环节【"+row.taskName+"】");
				}

				if(row.assigneeName!=null && row.assigneeName!=""){
					msgFields.push("执行人【"+row.assigneeName+"】");
				}

				if(row.commentMsg!=null && row.commentMsg!=""){
					msgFields.push("审批意见【"+row.commentMsg+"】");
				}
				var msg=msgFields.join(",");
				return msg;
			},
			sendToProcessApprova:function(row,bizKey){
				// 传过来的参数格式
        if(this.settleForm.settleAmount==0||this.settleForm.settleAmount==''){
          this.$notify.error("结算金额为空/0，不允许发审");
          return;
        }
				if(row.flowState=='1'){
					this.$notify.error("审核中，不允许重复发审");
					return;
				}

				var taskName=this.xmTask.name
				var projectId=this.xmTask.projectId
				var projectName=this.xmTask.projectName
				var taskId=this.xmTask.id
				var branchId=this.userInfo.branchId

				let extVars={projectId:projectId,taskId,taskExecuserId:row.id}
				let jsonExtVars=JSON.stringify(extVars);

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;
				var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars


				let params={
					bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'',
					bizPkid:row.id,
					bizParentPkid:projectId,
					mainContext:'',
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
						data:{
							projectId:projectId,
							taskId:taskId,
							userid:row.userid,
							settleAmount:this.settleForm.settleAmount,
							settleWorkload:this.settleForm.settleWorkload,
							id:row.id,
							branchId:branchId,
							username:row.username
						}
					},
				}

				if(bizKey=="xm_task_execuser_settle_approva"){
					//延期审核
					params.mainTitle='['+row.username+']发起关于任务【'+projectName+'-'+taskName+"】结算申请";
					params.mainContext='项目编号：'+projectId+','+'项目名称：'+projectName+',任务名称:'+taskName+',结算金额为:'+this.settleForm.settleAmount+',结算工作量为：'+this.settleForm.settleWorkload;
					params.restUrl=config.getXmBasePath()+"/xm/core/xmTaskExecuser/processApprova";
					this.$router.push({name:'ProcdefListForBizStart',params:params});
					//this.html2canvas(document.querySelector(".settleForm"),row,params);
				}else {
					this.$notify.error("不支持的审批事项");
					return;
				}

				//this.$store.dispatch('addVisitedViews', {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},
			handleCommand(command) {
				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.data,command.bizKey);
				}else if(command.type=='showQuotePrice'){
					this.showQuotePrice(command.data);
				}else if(command.type=='becomeCandidate'){
					this.becomeCandidate(command.data);
				}else if(command.type=='setNoLeader'){
					this.setNoLeader(command.data);
				}else if(command.type=='execute'){
					this.execute(command.data);
				}else if(command.type=='leave'){
					this.leave(command.data);
				}else if(command.type=='showSettleList'){
					this.showSettleList(command.data);
				}else if(command.type=='handleDel'){
					this.handleDel(command.data);
				}else if(command.type=='toJoin'){
					this.editForm=command.data
					this.toJoin();
				}
			},
			html2canvas(doc,row,params){
				this.load.edit=true;
				this.hideAllBtn(doc,true);
				html2canvas(doc).then(canvas => {

					let dataURL = canvas.toDataURL("image/png");
					uploadBase64({fileData:dataURL,categoryId:'workflow',storedb:'0',branchId:row.branchId,name:row.name+'.png'}).then(res=>{
						this.hideAllBtn(doc,false);
						params.mainContext=params.mainContext+'<br><img style="max-width:100%;" src="'+res.data.data.url+'"/>'
						this.$router.push({name:'ProcdefListForBizStart',params:params});
						this.load.edit=false;
					});

				});
			},
			hideAllBtn:function(doc,hide) {
                var btns = doc.getElementsByTagName('button');
                for (var i = 0; i < btns.length; i++) {
					if(hide==true){
                    	btns[i].style.display='none'
					}else{
						btns[i].style.display=''
					}
                 }
			},
			becomeCandidate(row){
					this.editForm=row
					 var params=JSON.parse(JSON.stringify(row));
					 params.status="0"
 					becomeCandidate(params).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.afterEditSubmit();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

					})
			},

			setNoLeader(row){
					this.editForm=row
					 var params=JSON.parse(JSON.stringify(row));
					 params.isLeader="0"
					becomeCandidate(params).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.afterEditSubmit();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

					})
			},
			formatToDoByStatus(row){
				var status=row.status;
				var msg="点我操作"
				if(status=='1' && row.taskState=='1'){
					msg="请及时填报工时";
				}else if(status=='7' && ( row.taskState=='0' || row.taskState=='1')){
					msg="申请成为候选人";
				}else if(status=='0' && ( row.taskState=='0' || row.taskState=='1')){
					msg="申请成为执行人";
				}else if(  status=='1' && (row.taskState=='2' || row.taskState=='3'|| row.taskState=='4' )){
					msg="查看结算清单";
				}
				return msg;
			},

			formatterTaskStateDicts: function(cellValue){
				if(!cellValue && cellValue!=='0'){
					return []
				}
				var key="taskState";
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return [{id:cellValue,name:cellValue,className:'primary'}];
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					var data= {...list[0],className:'primary'}
					if(data.id=='0'){
						data.className='primary'
					}else if(data.id=='1'){
						data.className='warning'
					}else if(data.id=='2'){
						data.className='success'
					}else if(data.id=='3'){
						data.className='info'
					} else{
						data.className='danger'
					}
					return [data];
				}else{
					return [{id:cellValue,name:cellValue,className:'primary'}]
				}

			},
			onTaskWorkloadSubmit(){
				this.searchXmTaskExecusers();
			},

			showWorkload(row){
				this.taskWorkloadVisible=true;
			}
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'xm-task-execuser-add':XmTaskExecuserAdd,
		    'xm-task-execuser-edit':XmTaskExecuserEdit, XmWorkloadEdit,MdpSelectUserXm
		    //在下面添加其它组件
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
