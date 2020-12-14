<template>
	<section>
		<sticky  :className="'sub-navbar draft'">  
			<el-row>
			<el-col :xs="22" :sm="22" :md="23" :lg="23" :xl="23"> 
				<el-col :xs="8" :sm="8" :md="14" :lg="16" :xl="16">
					<el-button      v-on:click="searchExecutions">查询</el-button>   
					<el-button   @click.native="showTagSelect(true)"  >打标签</el-button>
				 
					
					<el-popover 
						placement="top"
						width="375"
						trigger="manual"
						v-model="weixinContentVisible">
						<p>{{weixinContent}}</p>
						<div style="text-align: right; margin: 0"> 
							<el-button size="mini" type="text" @click="doCopyWeixinUrl">拷贝链接</el-button>
							<el-button type="primary" size="mini" @click="doCopyWeixinContent">拷贝内容</el-button>
						</div> 
						<el-button slot="reference"     class="hidden-sm-and-down"  v-on:click="showWeixin">微信催办</el-button>
					</el-popover>
					<el-button     class="hidden-sm-and-down"  v-on:click="showSendSms">短信催办</el-button>
					
					<el-button    class="hidden-sm-and-down"  v-on:click="showOaMsg">OAMSG催办</el-button>	
				</el-col> 
			</el-col>
			
			<el-col :xs="2" :sm="2" :md="1" :lg="1" :xl="1">
				<el-button   @click="drawer = true" type="text" >
					更多
				</el-button>

				<el-drawer
				title="更多查询条件"
				:visible.sync="drawer"
				:with-header="false" append-to-body> 
					<el-row class="more-filter-item">
					<el-col :span="24"  > 
						<el-button    @click.native="showTagSelect(true)"  >打标签</el-button> 
						<el-button       v-on:click="showWeixinTask">微信催办</el-button> 
						<el-button      v-on:click="showSendSms">短信催办</el-button> 
						<el-button       v-on:click="showOaMsg">OAMSG催办</el-button>	
					</el-col> 
					</el-row> 
				</el-drawer> 
			</el-col>
			</el-row>
	    </sticky>  
		<el-row class="app-container"> 
			<el-col   :span="24" v-if="executions.length==0"> 
				<el-button  type="primary"  v-if="executions.length==0" v-loading="listLoading"  v-on:click="startProc">还没有发起审核或者流程已结束，点击发起流程</el-button> 
			</el-col>
			<el-col   :span="24" v-if="executions.length>0"> 
				
				<!--列表 Execution act_ru_execution-->
				<el-table :data="executions"    highlight-current-row v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column type="selection" width="40"></el-table-column>
					<el-table-column type="index" width="40"></el-table-column>
					<el-table-column sortable prop="mainTitle" label="流程名称" min-width="200" ></el-table-column>
					<el-table-column sortable prop="taskName" label="当前任务" min-width="150"></el-table-column>
					<el-table-column sortable prop="tagNames" label="标签" min-width="80">
						<template slot-scope="scope">
							<el-tag v-for="tagName in (scope.row.tagNames?scope.row.tagNames.split(','):[])" :key="tagName">{{tagName}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column sortable prop="assigneeName" label="当前执行人" min-width="100" ></el-table-column>
					<el-table-column sortable prop="startUsername" label="发起人" min-width="100"  ></el-table-column> 
					<el-table-column sortable prop="startTime" label="发起时间" min-width="120" ></el-table-column> 
					<el-table-column sortable prop="planFinishTime" label="计划完成时间" min-width="120"  ></el-table-column> 
					<el-table-column sortable prop="startDeptName" label="发起部门" min-width="150"  ></el-table-column> 
					<el-table-column sortable prop="suspensionState" label="状态" min-width="80"  :formatter="formatterSuspensionState"></el-table-column> 
					<el-table-column label="操作" :min-width="screenWidth>=500?200:80"  fixed="right" >
						<template slot-scope="scope">
							<el-button  type="primary" @click="showTasksInfo( scope.row,scope.$index)">详情</el-button> 
						</template>
					</el-table-column>
				</el-table>
				
				<el-pagination  layout="total,  prev,  next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
				
			</el-col> 
			
			<el-dialog append-to-body
				title="标签条件"
				:visible.sync="tagSelectVisible"
				width="60%"> 
				<tag-mng :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]"  :jump="true" @select-confirm="onTagSelected"></tag-mng> 
			</el-dialog>

			
			<el-dialog title="短信催办" :visible.sync="sendSmsVisible"  :width="dialogWidth()"  :close-on-click-modal="false">
				<send-sms :sms-body-params="smsBodyParams" :sms-user-list="smsUserList" :load-phoneno-by-userid='true' :visible="sendSmsVisible" @cancel="sendSmsVisible=false" ></send-sms>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { getCompanyEmployees,getCompanyDepts,selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
	import { listExecution, activiteExecution, suspendExecution,delExecution } from '@/api/mdp/workflow/ru/execution';
	import  ProcinstParamesExecutionSet from '../procinstParames/ProcinstParamesExecutionSet';//流程参数加载
	import { listCategorys } from '@/api/mdp/workflow/re/procdef';
	import { batchInsertOrDeleteTags } from '@/api/mdp/workflow/ru/procinstTag';
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { listUser } from '@/api/mdp/sys/user';//下拉框数据查询
	import { listDept } from '@/api/mdp/sys/dept';//下拉框数据查询
	import { mapGetters } from 'vuex'
	import { createShortToken } from '@/api/login';//下拉框数据查询  
	import  SendSms from '@/views/mdp/sms/SendSms';//流程参数加载 
	import VueClipboard from 'vue-clipboard2'
	import Vue from 'vue' 
	import TagMng from '@/views/mdp/arc/tag/TagMng';   

	VueClipboard.config.autoSetContainer = true // add this line
	Vue.use(VueClipboard)

	export default {
		name:'ExecutionMngForFormData',
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ]),
			screenWidth:function(){
				return screen.width;
			},
		},
		activated:function(){
			if(this.$route.query && this.$route.query.params){
				let paramsJsonStr=this.$route.query.params;
				let params= JSON.parse(decodeURIComponent(paramsJsonStr)) 
				this.paramsJsonStr=paramsJsonStr;
				/** 传过来的参数格式
				let extVars={formDataIds:[row.id],formId:row.formId}
				let jsonExtVars=JSON.stringify(extVars); 
				let params={ 
						mainContext:'',
						mainTitle:'',
						bizUrl:process.env.BASE_API+config.getFormBasePath()+'/#/mdp/form/formData/FormDataMng?extVars='+jsonExtVars,
						extVars:extVars
				}
				let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
				this.$router.push({path:'/mdp/workflow/ru/execution/ExecutionMngForFormData',query:{params:jsonParmas}});
				 */ 
				this.filters.params=params;
				this.searchExecutions(); 
			}else if(this.$route.params){
				this.filters.params=this.$route.params;
				this.searchExecutions(); 
			}
			
		}, 
		data() { 
			return {
				paramsStr:null,
				filters: { 
					tags:[],  
					

					params:{
						mainTitle:'',
						mainContext:'',
						bizUrl:'',//前端跳转  //自带参数，建议只带主键
						bizKey:'',//用于选中流程模型并原样输出到restUrl
						restUrl:'',//后端接口同步
						formId:'',//form 表单编号
						formDataId:'',//form表单对应的数据
						extVars:{ //不用提交给工作流的变量池 
						},
						flowVars:{//提交进流程实例变量的变量池,flowVars所有变量将post方式推送回restUrl指定的地址

						}

					}
				}, 
				executions: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:20,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:['start_time_'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc'],//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
					count:true
				},
				listLoading: false,//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				smsBodyParams:[],//需要发短信的短信内容参数[assigneeName,taskName,createTime,starter]
				smsUserList:[{userid:'',phoneno:'',username:''}],//接受短信的人
				sendSmsVisible:false,//是否显示发短信对话框 
				weixinContentVisible:false,//微信内容面板是否显示
				weixinContent:'',//微信消息体
				addFormVisible: false,//新增execution界面是否显示
				drawer:false,
				//新增execution界面初始化数据
				addForm: {
					id:'',rev:'',procInstId:'',businessKey:'',parentId:'',procDefId:'',superExec:'',actId:'',isActive:'',isConcurrent:'',isScope:'',isEventScope:'',suspensionState:'',cachedEntState:'',tenantId:'',name:'',lockTime:'',rootProcInstId:'',isMiRoot:'',startTime:'',startUserId:'',deptid:'',isCountEnabled:'',evtSubscrCount:'',taskCount:'',jobCount:'',timerJobCount:'',suspJobCount:'',deadletterJobCount:'',varCount:'',idLinkCount:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑execution界面初始化数据
				editForm: {
					id:'',rev:'',procInstId:'',businessKey:'',parentId:'',procDefId:'',superExec:'',actId:'',isActive:'',isConcurrent:'',isScope:'',isEventScope:'',suspensionState:'',cachedEntState:'',tenantId:'',name:'',lockTime:'',rootProcInstId:'',isMiRoot:'',startTime:'',startUserId:'',deptid:'',isCountEnabled:'',evtSubscrCount:'',taskCount:'',jobCount:'',timerJobCount:'',suspJobCount:'',deadletterJobCount:'',varCount:'',idLinkCount:''
				},
				tagSelectVisible:false,
				isBatchSetProcTags:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			//获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.total=0;
				 this.pageInfo.count=true; 
				this.pageInfo.pageNum=1;
				this.getExecutions();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getExecutions();
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
				this.getExecutions();
			},
			searchExecutions(){
				 this.pageInfo.pageNum=1;
				 this.pageInfo.total=0; 
				 this.pageInfo.count=true;
				 //this.filters.otherParames={};
				 this.getExecutions();
				 
			},
			//获取列表 Execution act_ru_execution
			getExecutions() {
				if(!this.filters.params||!this.filters.params.extVars||!this.filters.params.extVars.formId){
					return;
				}
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

				params.formId=this.filters.params.formId
				params.formDataIds=[this.filters.params.formDataId]
				params.tenantId=this.userInfo.branchId
				this.listLoading = true;
				listExecution(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total  
						this.pageInfo.count=false;
						this.executions = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					
				});
			},
			//显示编辑界面 Execution act_ru_execution
			showTasksInfo: function ( row,index ) {
				//this.editFormVisible = true;
				console.log("xxxxxxxxxxxxxx进来了");
				var task= Object.assign({}, row);  
				this.editForm =task; 
				this.$router.push({name:'ProcinstParamesExecutionSetRoute',params:{taskInfo:task}});
			},
			//显示新增界面 Execution act_ru_execution
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0; 
				 this.pageInfo.count=true;
				this.getExecutions();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//删除流程实例
			handleDel: function (row,index) {
				this.$confirm('确认删除该流程实例吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { procInstId: row.procInstId };
					delExecution(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getTasks();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					
				});
			},
			
			dialogWidth:function(){
				if(screen.width>500){
					return "80%";
				}else{
					return "100%";
				}
			},
			//选择行execution
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//激活流程
			handleActivite: function (row,index) {
				this.$confirm('确认要激活该流程吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { procInstId: row.procInstId };
					activiteExecution(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getExecutions();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					
				});
			},
			//挂起流程
			handleSuspend: function (row,index) {
				this.$confirm('确认要挂起该流程吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { procInstId: row.procInstId };
					suspendExecution(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getExecutions();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					
				});
			}, 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			 
			
			onTagSelected(tags){
				this.tagSelectVisible=false;
				if(this.isBatchSetProcTags==true){
					//TOD 批量更新后台数据标签
					if(!tags || tags.length==0){
						 this.$message.error("最少选中一个标签");
						  this.isBatchSetProcTags=false;
						 return;
					}
					var procinstTagsVos=[];
					this.sels.forEach(row=>{
						 
						var procinstTags={
							procDefId:row.procDefId,
							procInstId:row.procInstId,
							branchId:row.branchId,
							userid:this.userInfo.userid,
							tags:tags.map(i=>{return {tagId:i.tagId,tagName:i.tagName}})
						}
						procinstTagsVos.push(procinstTags);
					})
					var params= procinstTagsVos
					
					 batchInsertOrDeleteTags(params).then(res=>{
						 this.isBatchSetProcTags=false;
						 if(res.data.tips.isOk){
							 var tagIds=tags.map(i=>i.tagId).join(",");
							 var tagNames=tags.map(i=>i.tagName).join(",");
							this.sels.forEach(row=>{
								row.tagIds=tagIds
								row.tagNames=tagNames
						 	})
							 this.$message.success("打标签成功");
						 }else{
							  this.$message.error(res.data.tips.msg);
						 }
					 }).catch(e=>this.isBatchSetProcTags=false);
				}else{
					if(tags==null){
						this.filters.tags=null 
					}else{
						this.filters.tags=tags 
					} 
				}
				
				
			}, 
			showTagSelect:function(isBatchSetProcTags){
				if(isBatchSetProcTags==true){
					if(this.sels.length==0){
						this.$message.error("请选中流程任务");
						return false;
					}
					this.tagSelectVisible=true;
				}else{
					this.tagSelectVisible=true;
				}
				this.isBatchSetProcTags=isBatchSetProcTags;
			}, 
			 
			formatterSuspensionState(row, column, cellValue){
				return cellValue==1?"激活的":"挂起的"
			},
			
			showSendSms:function(){
				if(this.sels.length>1){
 					this.$message({ message: '一次只能给一个人发短信', type: 'error' });
				}else if(this.sels.length<1){
					this.$message({ message: '请选择一条任务', type: 'error' });
				}else{
					let task=this.sels[0];
					this.smsBodyParams=[task.assigneeName,task.mainTitle+"-"+task.taskName,task.createTime,task.userid]
					this.smsUserList=[{userid:task.assignee}];
					this.sendSmsVisible=true;
				}
				
			},
			showWeixinTask:function(){
				if(this.sels.length>1){
					 this.$message({ message: '一次只能给一个人发信', type: 'error' });
					 this.weixinContentVisible=false;
					 return false;
				}else if(this.sels.length<1){
					this.$message({ message: '请选择一条任务', type: 'error' });
					this.weixinContentVisible=false;
					return false;
				}else{
					let task=this.sels[0];
					//var url=window.location.href;
					let url=window.location.protocol+"//"+window.location.host+"/oa/"+process.env.VERSION+"/#/mdp/workflow/ru/task/TaskListAssigneeToMe";
					
					createShortToken({userid:task.assignee,branchId:this.userInfo.branchId}).then(res=>{
						if(res.data.tips.isOk){
							var userToken=res.data.userToken; 
							this.weixinContent=task.assigneeName+"您好，您有任务【"+task.mainTitle+"-"+task.taskName +"】待处理，请登陆OA系统或者点击以下链接处理。"+url+"?userToken="+userToken;
							this.$copyText(this.weixinContent).then(e=>{ 
								this.$message({ message: '已拷贝内容，您可黏贴到微信中', type: 'success' });
							});
						}
					});
					 
				}
			},
			showWeixin:function(){
				if(this.sels.length>1){
					 this.$message({ message: '一次只能给一个人发信', type: 'error' });
					 this.weixinContentVisible=false;
					 return false;
				}else if(this.sels.length<1){
					this.$message({ message: '请选择一条任务', type: 'error' });
					this.weixinContentVisible=false;
					return false;
				}else{
					let task=this.sels[0];
					//var url=window.location.href;
					let url=window.location.protocol+"//"+window.location.host+"/oa/"+process.env.VERSION+"/#/mdp/workflow/ru/task/TaskListAssigneeToMe";
					
					createShortToken({userid:task.assignee,branchId:this.userInfo.branchId}).then(res=>{
						if(res.data.tips.isOk){
							var userToken=res.data.userToken;
							this.weixinContentVisible=true;
							this.weixinContent=task.assigneeName+"您好，您有任务【"+task.mainTitle+"-"+task.taskName +"】待处理，请登陆OA系统或者点击以下链接处理。"+url+"?userToken="+userToken;
							 
						}
					});
					 
				}
				
			},
			showOaMsg:function(){ 
				if(this.sels.length>1){
					 this.$message({ message: '一次只能给一个人发信', type: 'error' });
					 return false;
				}else if(this.sels.length<1){
					this.$message({ message: '请选择一条任务', type: 'error' });
					return false;
				}else{
					let task=this.sels[0];
					var msgBody=task.assigneeName+"您好，您有任务【"+task.mainTitle+"-"+task.taskName +"】待处理，请登陆OA系统处理";
							 
					let href=window.location.protocol+"//"+window.location.host+"/im/"+process.env.VERSION+"/#/mdp/im/messages/messageChat?toUserid="+task.assignee+"&msgBody="+msgBody
					window.open(href, '_blank');
				}
			},
			doCopyWeixinUrl:function(){
				this.weixinContentVisible=false;
				let href=window.location.protocol+"//"+window.location.host+"/oa/"+process.env.VERSION+"/#/mdp/workflow/ru/task/TaskListAssigneeToMe";
					
				this.$copyText(href).then(e=>{

				});
			},
			doCopyWeixinContent:function(){
				this.weixinContentVisible=false;
				this.$copyText(this.weixinContent).then(e=>{

				});
			}, 
			startProc:function(){
				
				let filtersParams=this.filters.params; 
				let params=filtersParams
				let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
				this.$router.replace({path:'/mdp/workflow/re/procdef/ProcdefListForFormDataStart',query:{params:jsonParmas}});
				
			}, 
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'procinst-parames-execution-set':ProcinstParamesExecutionSet,
			'sticky': Sticky,
			'send-sms':SendSms,
			TagMng,
		   //在下面添加其它组件
		},
		mounted() {
			  
 
			//加载下拉列表 如有需要去年注释
			
			
			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  
.filters-show {
	margin-left: 20px;
	margin-top: 10px;
	margin-bottom: 0px;
}
.filters-label { 
	font-size: 14px;
	color:black;
	font-weight: bold;
}
.more-filter-item { 
	margin: 20px 20px;
	
}

.more-filter-item .el-col {  
	margin: 2px 2px;
	
}
.more-filter-item button { 
		margin: 2px 2px; 
}
</style>