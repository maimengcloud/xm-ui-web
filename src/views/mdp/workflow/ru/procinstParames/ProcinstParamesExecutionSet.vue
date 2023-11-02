<template>
	<section class="page-container padding">
		<el-row class="page-header">    
				<el-button class="hidden-md-and-down"   type="text"  @click.native="handleCancel" icon="el-icon-back">取消</el-button>  
				<el-button   type="text"  v-if="screenWidth>=500"  @click.native="handlePrint" icon="el-icon-printer">打印</el-button>    
				<el-button   type="text"  v-if="isArchive"  @click.native="handleArchive"  icon="el-icon-s-grid">归档</el-button>   
 				<el-button  type="text"  @click="showDiagram()" icon="el-icon-picture-outline">流程图</el-button>   
				<el-button  type="text"  @click="showNodeInfoDialog()"  icon="el-icon-s-check">审批人</el-button>
				<el-button class="hidden-md-and-down"  type="text"  @click="showComment=!showComment"  icon="el-icon-document">{{showComment==false?"显示流转信息":"隐藏流转信息"}}</el-button>
				<el-button   type="text"  @click="showMainContext=!showMainContext"  icon="el-icon-document" class=" hidden-md-and-down">{{showMainContext==false?"显示正文":"隐藏正文"}}</el-button>
				<el-button   type="text"  @click="showMainContextOnly=!showMainContextOnly"  icon="el-icon-finished" class=" hidden-sm-and-down">{{showMainContextOnly==false?"只看正文":"显示全部"}}</el-button>
 
				<el-button  type="text"    v-on:click="$refs['attTplDialog'].open({})"  icon="el-icon-document-copy">附件模板</el-button>

				<el-button type="text"    v-on:click="$refs['attDialog'].open({})"  icon="el-icon-document-copy">流程附件</el-button>
 	    </el-row> 
		<el-row class="page-title padding-top"> 
			<el-row  class="hidden-md-and-down"> 
				<el-col class="wf-sub-title"> {{addForm.mainTitle}}</el-col> 
			</el-row>   
			<el-row  class="hidden-lg-and-up">
				<el-col class="wf-title" v-if="addForm.mainTitle.length<30"> {{addForm.mainTitle}}</el-col> 
				<el-col class="wf-sub-title" v-if="addForm.mainTitle.length>30"> {{addForm.mainTitle}}</el-col> 
			</el-row>  
			<el-row style="padding-top:10px;"> 
				<el-col :span="24" class="wf-sub-sub-title">   
					<mdp-select-tag placeholder="标签" empty-text="标签" show-style="tag" v-model="addForm.tagIds" multiple split="," @change2=" onTagSelected "></mdp-select-tag>
					发起部门: <font class="name-font">{{addForm.startDeptName}} </font>&nbsp;&nbsp;&nbsp;
					由&nbsp; <font class="name-font">{{addForm.startUsername}}</font>&nbsp;于&nbsp;
					 <font class="name-font">{{addForm.startDate}}</font> &nbsp;发起
					</el-col>   
			</el-row> 
		</el-row>
		<el-row class="page-main padding-top">
			<el-row v-show="showMainContextOnly==true">
				<div style="padding: 20px;" v-html="addForm.mainContext"></div>
			</el-row>
			<el-row v-show="showMainContextOnly==false">
				
				<el-row> 
					<!--新增界面 ProcinstParames 流程实例参数设置表-->  
						<el-form :model="addForm"  :label-width="labelWidth()" :rules="addFormRules" ref="addForm" >  
							<el-row>   
									预计
									<el-date-picker style="width:20%;"
										v-model="addForm.planFinishTime"
										type="date" value-format="yyyy-MM-dd HH:mm:ss" 
										:picker-options="pickerOptions"
										placeholder="选择计划完成日期" >
									</el-date-picker>
									&nbsp;&nbsp;完成&nbsp;&nbsp;  <el-button   @click.native="updateFlowPlanFinishTime" :loading="addLoading" icon="el-icon-finished">保存日期</el-button>  
									 
									  &nbsp;&nbsp;主办&nbsp;&nbsp;  <mdp-select-user placeholder="主办人" v-model="addForm.sponsors" :multiple="true" split="," title="主办人"/>
									  &nbsp;&nbsp;监控&nbsp;&nbsp;  <mdp-select-user placeholder="监控人" v-model="addForm.monitors" :multiple="true" split=","  title="监控人"/> 
							</el-row>   
							<el-row  v-if="addForm.isRefForm=='1' && addForm.formId && addForm.formShowType!='table'" style="padding-top:10px;">
								<flow-form ref="flowFormRef" :formShowType="addForm.formShowType"  :formId="addForm.formId"  :qxCode="qxCode"  :procInstId="procInstId" :flowStartUserid="addForm.userid"  @submit="startSubmit" @change="onFormDataChange"><div></div></flow-form> 
							</el-row>		
							<el-row  v-if="addForm.mainContext && addForm.mainContext.length>0 && showMainContext"> 
									<div  class="wf-main-context-box" v-if="screenWidth>=500">
										<div style="padding: 20px;" class="wf-main-context" v-html="addForm.mainContext"></div>
									</div>  
								<div   class="wf-main-context-box" v-if="screenWidth<500">
										<div style="padding: 20px;" v-html="addForm.mainContext"></div>
								</div> 
							</el-row>   
							<el-row v-show="showComment">
								<comment-step v-if="procInstId" ref="commentStepRef" :task="task"  :procInstId="procInstId"  @get-comments="getComments"></comment-step>  
							</el-row> 
							<div v-if="task.taskId"> 
								<el-form-item :label="'办理意见'" prop="commentMsg">
									<el-row class=" hidden-md-and-down">
										<el-radio-group v-model="task.action">
											<div v-if="task.action!='claim'">
												<el-radio min-width="60px" v-show="taskInfo && taskInfo.delegation!='PENDING'" label="agree">同意&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
												<el-radio v-show="taskInfo && taskInfo.delegation!='PENDING'" label="disAgree">不同意&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
												<el-radio label="rejectToActivity">驳回&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
												<el-radio label="sponsors">转主办&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
												<el-radio label="rejectToStartUser">转发起人</el-radio>
												<el-radio v-show="taskInfo && taskInfo.delegation!='RESOLVED'" label="transfer">请人代办</el-radio>
												<el-radio label="delegate">请人协办,完成后返回给我</el-radio>
												<el-radio v-show="taskInfo && taskInfo.delegation!='RESOLVED' && taskInfo.delegation=='PENDING'" label="resolve">返回给原执行人</el-radio>
												<el-radio label="over">结束流程</el-radio>
											</div>
											<div v-else>
												<el-radio label="claim">领取任务</el-radio>
											</div>
										</el-radio-group>
									</el-row>
									<el-row class=" hidden-lg-and-up"> 
										<el-select   v-model="task.action" placeholder="请选择办理意见" >
											<div v-if="task.action!='claim'">
												<el-option  v-show="taskInfo && taskInfo.delegation!='PENDING'" label="同意" value="agree">  </el-option>
												<el-option  v-show="taskInfo && taskInfo.delegation!='PENDING'" label="不同意" value="disAgree">  </el-option>
												<el-option  label="驳回" value="rejectToActivity">  </el-option>
												<el-option label="转主办" value="sponsors">  </el-option>
												<el-option   label="转发起人" value="rejectToStartUser">  </el-option>
												<el-option  v-show="taskInfo && taskInfo.delegation!='RESOLVED'" label="请人代办" value="transfer">  </el-option>
												<el-option   label="请人协办,完成后返回给我" value="delegate">  </el-option>
												<el-option v-show="taskInfo && taskInfo.delegation!='RESOLVED' && taskInfo.delegation=='PENDING'"  label="返回给原执行人" value="resolve">  </el-option>
												<el-option label="结束流程" value="over">  </el-option>
											</div>
											<div v-else>
												<el-radio label="claim">领取任务</el-radio>
											</div>
										</el-select> 
									</el-row>
									<el-row style="padding-top:10px;">
										<el-input  type="textarea" :rows="3" v-model="task.commentMsg" auto-complete="off" ></el-input>
									</el-row> 
								</el-form-item>   
								<el-form-item v-show="task.action=='rejectToActivity'" label="驳回节点" prop="rejectToActivity"> 
									<el-col :span="10">
										<el-select   style="width:100%" value-key="taskId" v-model="task.rejectActivity" @change="rejectToActivitySelectChange" placeholder="请选择">
										<el-option
										v-for="item in comments"
										:key="item.taskId"
										:label="item.name"
										:value="item">
										<span style="float: left">{{ item.name }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}-{{item.message}}</span>
										</el-option>
									</el-select>
									</el-col>
								</el-form-item> 
								<el-form-item v-show="task.action=='transfer'||task.action=='delegate'||needAssignee!=''||(actAssignee&&actAssignee.showNextAssignees=='1')"  :label="nextAssigneeListLabel" prop="needAssignee"> 
									<el-col :xs="24" :sm="18" :md="16" :lg="14" :xl="12"> 
									<mdp-select-user :multiple="false" @change2="(user)=>{
										task.nextAssigneeList=[user];
										nextAssigneeListSelectChange();
									}"></mdp-select-user>
									</el-col>
								</el-form-item> 
							</div> 
						</el-form> 
				</el-row> 
				<mdp-dialog  ref="nodeInfosSetDialog"
					title="查看审批人" 
					width="70%"> 
					<template v-slot="{visible,data,dialog}">
						<procinst-node-info-set   :node-infos="data.nodeInfos"   :visible="visible"   @cancel="dialog.close();"   @confirm="onNodeInfosConfirm"></procinst-node-info-set> 

					</template>
				</mdp-dialog> 
			</el-row>
		</el-row>
		<el-row class="footer">  
			<el-button    @click.native="handleCancel" icon="el-icon-back">关闭</el-button>  
			<el-button   v-if="screenWidth>=500"  @click.native="handlePrint" icon="el-icon-printer">打印</el-button>    
			<el-button   v-if="isArchive"  @click.native="handleArchive" icon="el-icon-s-grid">归档</el-button> 
			<el-button   v-if="task.taskId"   @click.native="addComment" :loading="addLoading" icon="el-icon-finished">只存办理意见</el-button>  
			<el-button   v-if="task.action!='claim' && task.taskId" type="primary" @click.native="completeHandle" :loading="addLoading"  icon="el-icon-finished">提交任务</el-button>  
			<el-button  v-if="task.action=='claim' && task.taskId"  @click.native="completeHandle" :loading="addLoading"  icon="el-icon-finished">领取任务</el-button>  
			<el-button  v-if="task.action=='claim' && task.taskId  && task.sponsors && task.sponsors.indexOf(userInfo.userid)>=0"  @click.native="showTaskCandidateSet" :loading="addLoading"  icon="el-icon-s-check">添加候选人</el-button> 
 
		</el-row>
		
		<mdp-dialog ref="diagramDialog">
            <template v-slot="{visible,data,dialog}">
                <el-image v-if="visible" :fit="'contain'" :src="data.diagramUrl">
                <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                </div>
                <div slot="placeholder" class="image-slot">
                    正在全力加载中。。。。。。。。。。
                    <i class="el-icon-loading"></i>
                </div>
                </el-image>
            </template>
          </mdp-dialog>
		  <mdp-dialog ref="attTplDialog">
            <template v-slot="{visible,data,dialog}">
				<mdp-select-att  sub-op-type="mng" crely-type="procDefId" :crely-id="addForm.procDefId"></mdp-select-att>
            </template>
          </mdp-dialog> 
		  <mdp-dialog ref="attDialog">
            <template v-slot="{visible,data,dialog}">
				<mdp-select-att  sub-op-type="mng" crely-type="procDefId" :crely-id="addForm.procDefId" crely-stype="procInstId" :crely-sid="addForm.procInstId"></mdp-select-att>
            </template>
          </mdp-dialog> 
	</section>
</template>

<script>
	import seq from '@/components/mdp-ui/js/sequence';//全局公共库
	import util from '@/components/mdp-ui/js/util';//全局公共库import 
	import config from '@/api/mdp_pub/mdp_config';//全局公共库import 
 	import { listProcinstParames,editPlanFinishTime } from '@/api/mdp/workflow/ru/procinstParames';
	import { completeTask,addComment } from '@/api/mdp/workflow/ru/task';
	import  FlowForm from '@/views/mdp/lcode/formData/FlowForm';//新增界面
	import  CommentStep from '@/views/mdp/workflow/hi/comment/CommentStep';//评论
	import html2canvas from 'html2canvas' 
	import { getNodeInfos,updateNodeInfos } from '@/api/mdp/workflow/ru/procinstNodeInfo';  
	import { mapGetters } from 'vuex'  
	import { batchInsertOrDeleteTags } from '@/api/mdp/workflow/ru/procinstTag';
	import ProcinstNodeInfoSet from '@/views/mdp/workflow/ru/procinstParames/ProcinstNodeInfoSet';  

	export default {
		name:'ProcinstParamesExecutionSet',
	    computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			screenWidth:function(){
				return screen.width;
			},
		    nextAssigneeListLabel: function(){
		    		let action=this.task.action;
		      	 	 if(action=='disAgree'){
			      	 	 return "下一步办理人"
			      	 }else if(action=='agree'){
			      		 return "下一步办理人"
			      	 } else if(action=='transfer'){
			      		 return "代办人"
			      	 }else if(action=='delegate'){
			      		 return "协办人"
			      	 } 
		      	 	 return "下一步办理人"
		    }
		},
		props:['procDefId','procInstId','taskInfo','visible','isArchive'],
		watch: {
	      'procInstId':function( procInstId ) { 
	    	  
	      },
	      'taskInfo':function( taskInfo ) {  
	    	  this.$nextTick(() => {
					this.comments=[]
				})
				
			this.task.taskId=taskInfo.taskId
			this.task.taskName=taskInfo.taskName
			this.task.assigneeName=taskInfo.assigneeName
	      	this.task.procInstId=this.taskInfo.procInstId; 
	      	this.task.assignee=this.taskInfo.assignee;
	      	this.task.nextAssigneeList=[];
			  this.needAssignee='';
			this.needAssigneeNum=-1;
			this.task.rejectActivity.taskId=''
			this.task.rejectActivity.taskDefKey='';
			this.addForm.formId=this.taskInfo.formId;
			this.addForm.isRefForm=this.taskInfo.isRefForm;
			this.addForm.monitors=this.taskInfo.monitors;
			this.addForm.sponsors=this.taskInfo.sponsors;
			this.addForm.mainTitle=this.taskInfo.mainTitle;
			this.addForm.tagIds=this.taskInfo.tagIds;
			this.addForm.tagNames=this.taskInfo.tagNames;
			this.addForm.mainQx=this.taskInfo.mainQx;
			this.qxCode= this.addForm.mainQx
	      	console.log("watchxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
	      	console.log(this.taskInfo)
	      	if(this.taskInfo.assignee==null || this.taskInfo.assignee==''){
				this.task.action='claim'
			}else if(taskInfo.delegation!='PENDING'){
	      		this.task.action='agree'
	      	}else if(taskInfo.delegation!='RESOLVED' && taskInfo.delegation=='PENDING'){
	      		this.task.action='resolve';
			}
	      	
	      },
	      'task.action':function( action ) { 
	    	  this.needAssignee=""
	    	  this.task.nextAssigneeList=[]
	    	  this.task.rejectActivity.taskId=''
			  this.tranActionComments( this.task.nextAssigneeList);
			  this.$refs.addForm.validateField('action');

		  },
		  
	      'task.nextAssigneeList':function( nextAssigneeList ) { 
			  this.tranActionComments( nextAssigneeList);
	      },
	      'visible':function(visible){
			  if(visible==false){
				  return;
			  }
			  var date=new Date()
			  this.modelFilesVisible=false; 
	    	  this.needAssignee=""
		      this.task.nextAssigneeList=[]
		      this.task.rejectActivity.taskId='' 
	    	  this.$nextTick(() => {
				  this.getProcinstParamess();  
				}); 
	      }
	    },	
		data() {
	        var validateNeedAssignee = (rule, value, callback) => { 
	        		if(this.task.action=='rejectToActivity'){
	        			callback(); 
	        		}
					if(this.needAssignee=='need-mulit-assignee' && this.task.nextAssigneeList.length<this.needAssigneeNum){//need-mulit-assignee 需要一个或者多个 need-single-assignee 只需要一个
						callback(new Error(this.needAssigneeMsg)); 
					}else if(this.needAssignee=='need-single-assignee' ){
						if(this.task.nextAssigneeList.length<=0 ){
							 callback(new Error(this.needAssigneeMsg)); 
						}else if(this.task.nextAssigneeList.length>1 ){
							callback(new Error('只允许指定一个执行人')); 
						} 
					} else if(this.task.action=='transfer'){
						if(this.task.nextAssigneeList.length<=0 ){ 
							callback(new Error('请选择一个代办人')); 
						}else if(this.task.nextAssigneeList.length>1 ){ 
							callback(new Error('只允许指定一个待办人')); 
						}  
					}else if(this.task.action=='claim'){
						if(this.task.nextAssigneeList.length<=0 ){ 
							callback(new Error('请选择一个领取人')); 
						}else if(this.task.nextAssigneeList.length>1 ){ 
							callback(new Error('只允许指定一个领取人')); 
						}  
					}  else if(this.task.action=='delegate'){
						if(this.task.nextAssigneeList.length<=0 ){ 
							callback(new Error('请选择一个协办人')); 
						}else if(this.task.nextAssigneeList.length>1 ){ 
							callback(new Error('只允许指定一个协办人')); 
						}   
					}
					callback(); 
			  };
			  var validateAction = (rule, value, callback) => {
					var userid=this.userInfo.userid;
					var taskId=this.taskInfo.taskId;
					var assignee=this.taskInfo.assignee;
					var action=this.task.action;
					if(taskId==null || taskId==''){
						callback(new Error('该任务已经完成或者过时，不能进行任何提交操作'))
					} else if((assignee==null || assignee=='') && action !='claim'){
						callback(new Error('该任务属于候选任务，需要候选人先领取'))
					}else if(action=='agree'||action=='disAgree'||action=='rejectToActivity'){
						if(assignee==null||assignee==''){
							callback(new Error('该任务未指派给任何人,您不能进行【同意/不同意/驳回】 操作'))
						}if(assignee!=userid){
							callback(new Error('该任务属于【'+this.taskInfo.assigneeName+'】,您不能进行【同意/不同意/驳回】 操作')); 
						}
					}else if(action=='transfer'){
						if(userid!=assignee && !this.sponsors.some(i=>i.userid==userid)){
							callback(new Error('任务执行人【'+this.taskInfo.assigneeName+'】及主办才可以指派给他人代办')); 
						}
					}else if(action=='claim'){
						if(assignee!=null && assignee!=''){
							callback(new Error('该任务已经由'+assigneeName+'领取，您不能再领取')); 
						}
					}else if(action=='delegate'){
						if(this.taskInfo.delegation=='PENDING'){
							callback(new Error('该任务已属于协办任务，不能再进行协办操作')); 
						}
						if(assignee!=userid && !this.sponsors.some(i=>i.userid==userid)){
							callback(new Error('只有执行人及主办可以委托他人办理')); 
						}
					}else if(action=='resolve'){ 
						if(this.taskInfo.delegation!='PENDING'){
							callback(new Error('该任务不属于协办任务，不能完成此操作')); 
						}
						if(assignee!=userid && !this.sponsors.some(i=>i.userid==userid)){
							callback(new Error('只有执行人及主办可以进行该操作')); 
						}
					}else if(action=='over'){ 
						 if(assignee!=this.taskInfo.userid && !this.sponsors.some(i=>i.userid==userid)){
							callback(new Error('只有发起人及主办可以将流程强制结束')); 
						}
					}
		              callback(); 
				  };
		        var validateRejectToActivity = (rule, value, callback) => {
					if(this.task.action=='rejectToActivity'){
						if((this.task.rejectActivity.taskId==''|| this.task.rejectActivity.taskId==null) && (this.task.rejectActivity.taskDefKey==''|| this.task.rejectActivity.taskDefKey==null)){
							callback(new Error('请选择要驳回的目标节点')); 
						}
					}
		              callback(); 
				  };
				  
		        var validatePlanFinishTime = (rule, value, callback) => {
					if(this.taskInfo.planFinishTime!=value){
						 if(!this.sponsors.some(i=>i.userid==this.userInfo.userid)){
							 //this.addForm.planFinishTime=this.taskInfo.planFinishTime
							 //this.$notify.error("只有主办可以修改计划完成时间"); 
							// return;
						 }
					}
					//callback(); 
					
		            callback(); 
				  };
				  
			return {
				options:{},//下拉选择框的所有静态数据
				
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now();
					},
					shortcuts: [{
						text: '今天',
						onClick(picker) {
						picker.$emit('pick', new Date());
						}
					}, {
						text: '明天',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24);
						picker.$emit('pick', date);
						}
					}, {
						text: '后天',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24 *  2);
						picker.$emit('pick', date);
						}
					}, {
						text: '一周后',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
						picker.$emit('pick', date);
						}
					}, {
						text: '两周后',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24 * 7 * 2);
						picker.$emit('pick', date);
						}
					}, {
						text: '三周后',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24 * 7 * 3);
						picker.$emit('pick', date);
						}
					}, {
						text: '一个月后',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24 *  30);
						picker.$emit('pick', date);
						}
					}, {
						text: '两个月后',
						onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24  * 60);
						picker.$emit('pick', date);
						}
					}]
					},
				addLoading: false,
				listLoading:false,
				addFormRules: {
					id: [
						//{ required: true, message: '主键', trigger: 'blur' }
					],
					needAssignee: [
						{ validator: validateNeedAssignee, trigger: 'blur'  }
					],
					rejectToActivity: [
						{ validator: validateRejectToActivity, trigger: 'blur'  }
					],
					action: [
						{ validator: validateAction, trigger: 'blur'  }
					],
					planFinishTime:[
						{ validator: validatePlanFinishTime, trigger: 'blur' }
					]

					
				},
				comments: [],//评论
				userSelectVisible:false,
				//新增界面数据 流程实例参数设置表
				addForm: {
					id:seq.sn(),isRefForm:'',monitors:'',sponsors:'',procInstId:'',planFinishTime:'',formId:'',formShowType:'',procDefId:'',userid:'',startDate:'',isTemplate:'',mainContext:'',mainTitle:'',deptid:'',categoryId:'',lastTaskId:'',lastComment:'',lastTaskDefId:'',flowState:'',lastUserid:''
				},
				defaultAddForm: {
					id:seq.sn(),isRefForm:'',monitors:'',sponsors:'',procInstId:'',formId:'',formShowType:'',procDefId:'',userid:'',startDate:'',isTemplate:'',mainContext:'',mainTitle:'',deptid:'',categoryId:'',lastTaskId:'',lastComment:'',lastTaskDefId:'',flowState:'',lastUserid:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				sponsors:[],//
				monitors:[],//  
		        //上传服务器的任务参数
		        task:{taskId:'',commentMsg:'同意',procInstId:this.procInstId,assignee:'',action:'complete',nextAssigneeList:[],rejectActivity:{taskId:'',taskDefKey:''}},
		        /**从父组件传过来的任务信息
		        taskInfo:{id:'',rev:'',executionId:'',procInstId:'',procDefId:'',name:'',parentTaskId:'',description:'',taskDefKey:'',owner:'',assignee:'',delegation:'',priority:'',createTime:'',dueDate:'',category:'',suspensionState:'',tenantId:'',formKey:'',claimTime:'',
					mainTitle:'',sponsors:'',userid:'',deptid:''
				}
				**/ 
				needAssignee:'',//need-mulit-assignee 需要一个或者多个 need-single-assignee 只需要一个
				needAssigneeMsg: '',
				needAssigneeNum:0,//需要多少个会签人员
				modelFilesVisible:false,
				actAssignee:null,
				qxCode:'',
				showAttachment:false,
				showComment:true,
				showMainContext:true,
				showMainContextOnly:false,
				nodeInfos:[],
				nodeInfoVisible:false,
				formDataChangeLogs:[],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			onFormDataChange(formData,changeLogs){ 
				this.formDataChangeLogs=changeLogs
			},
			nextAssigneeListSelectChange: function(value){
				 this.$refs.addForm.validateField('needAssignee');
				 this.$refs.addForm.validateField('action');
			},
			rejectToActivitySelectChange: function(value){
				 this.$refs.addForm.validateField('rejectToActivity');
				 if(this.comments!=null && this.comments.length>0){
					 let tempComments=this.comments.filter(i=>i.taskId==value.taskId)
					 if(tempComments.length>0){
						 var comment=tempComments[0];
						 this.task.nextAssigneeList=[{userid:comment.userid,username:comment.username}]
					 }
				 }
			},
			tranActionComments(nextAssigneeList){
				  //var nextAssigneeList
				 console.log('nextAssigneeList----'+JSON.stringify(nextAssigneeList));
					var action=this.task.action;
					var currentUsername=this.userInfo.username;
					var usernames=nextAssigneeList.map(i=>i.username).join(",");
					if(action=='sponsors'){ 
						this.task.commentMsg='请主办'+this.sponsors.map(i=>i.username).join(",")+'处理';
					}else if(action=='disAgree'){ 
						this.task.commentMsg='不同意';
					}else if(action=='agree'){ 
						this.task.commentMsg='同意';
					}else if(action=='rejectToStartUser'){
						this.task.commentMsg='请发起人'+this.taskInfo.startUsername+'处理';
					}else if(action=='transfer'){
						this.task.commentMsg='请'+usernames+'代办';
					}else if(action=='claim'){
						this.task.commentMsg=currentUsername+"领取了任务";
					}else if(action=='delegate'){
						this.task.commentMsg='请'+usernames+'协办,完成后返回给'+currentUsername;
					}else if(action=='resolve'){
						this.task.commentMsg=currentUsername+'已协办完成';
					}else if(action=='over'){
						this.task.commentMsg=currentUsername+'将流程结束';
					}else if(action=='rejectToActivity'){
						this.$refs.addForm.validateField('rejectToActivity');
						this.task.commentMsg=currentUsername+'将流程驳回';
					}
					this.$refs.addForm.validateField('needAssignee');
			},
			getComments: function(comments){
				 
				let temp=comments.filter(i=>i.taskDefKey!=this.taskInfo.taskDefKey);
				let commentsTemp=[];
				temp.forEach(i=>{
					if(!commentsTemp.some(item=>item.taskDefKey==i.taskDefKey)){
						commentsTemp.push(i)
					}
				})
				this.$nextTick(() => {
					this.comments=commentsTemp
				})
				
			}, 
			 
			addComment:function(){
				if(this.task.commentMsg==''){
					this.$notify({position:'bottom-left',showClose:true,message: "办理意见不能为空", type:'error' }); 
					return;
				}
				this.addLoading = true;  
				var comment={userid:this.userInfo.userid,taskId:this.task.taskId,procInstId:this.task.procInstId,commentMsg:this.task.commentMsg};
				addComment(comment).then(res=>{
					if(res.data.tips.isOk){
						this.$refs['commentStepRef'].getComments();
						this.addLoading=false;
						this.addForm.commentMsg=""
						this.$notify({position:'bottom-left',showClose:true,message:'保存办理意见成功', type:'success' }); 
					}else{ 
						this.addLoading=false;
						this.$notify({position:'bottom-left',showClose:true,message: res.data.tips.msg, type:'error' }); 
					}
				}).catch(e=>{
					this.addLoading = false; 
				})
			},
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				
				this.modelFilesVisible=false; 
				this.addLoading=false;
				this.listLoading=false;
				this.$emit('cancel');
			},
			//新增提交ProcinstParames 流程实例参数设置表 父组件监听@submit="afterAddSubmit"
			startSubmit: function (formData) { 
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;  
							if(this.formDataChangeLogs && this.formDataChangeLogs.length>0){  
								formData.changeLogs=this.userInfo.username+" 更新数据："+this.formDataChangeLogs.map(k=>{

									return k.fieldTitle+":"+(k.oldValue?(k.oldValue+" --> "):"")+(k.currVal?k.currVal:'')
								}).join(';')
								formData.changeData=true 
							}
							let procinstParames=Object.assign({},this.addForm) 
							procinstParames.lastTaskId=this.taskInfo.id
							procinstParames.lastTaskName=this.taskInfo.name
							procinstParames.lastTaskDefId=this.taskInfo.taskDefKey
							procinstParames.lastComment=this.task.commentMsg 
							let params = {procinstParames:procinstParames,formData:formData};  
							params=Object.assign(params,this.task);
							params.actId=this.taskInfo.taskDefKey
							if(!params.actId || params.actId==null || params.actId==''){
								params.actId=this.taskInfo.actId
							}
							params.nextAssigneeList=params.nextAssigneeList.map(i=>i.userid)
							params.tipscode=this.needAssignee;
							console.log(params);
						 
							var addFormTagIds=(this.addForm.tagIds?this.addForm.tagIds:"").split(",");
							var taskTagIds=(this.taskInfo.tagIds?this.taskInfo.tagIds:"").split(",");
							if(addFormTagIds.sort().join(",")==taskTagIds.sort().join(",")){//没修改过标签
								params.changeTags="0"
							}else{//修改过标签
								params.changeTags="1"
							}
							

							completeTask(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){ 
									this.$emit('submit',res,tips.isOk,'add');//  @submit="afterAddSubmit"
									this.needAssignee=''
									this.needAssigneeMsg=''
									this.needAssigneeNum=-1
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
									this.handleCancel();
								}else if(tips.tipscode=='need-mulit-assignee'){//need-mulit-assignee 需要一个或者多个 need-single-assignee 只需要一个
									this.needAssignee=tips.tipscode
									this.needAssigneeMsg=tips.msg
									this.needAssigneeNum=tips.needAssigneeNum;
									this.$refs.addForm.validateField('needAssignee');
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 

								}else if(tips.tipscode=='need-single-assignee'){
									this.needAssignee=tips.tipscode
									this.needAssigneeMsg=tips.msg 
									this.needAssigneeNum=1;
									this.$refs.addForm.validateField('needAssignee');
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 

								}else{
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
								}
								
							}).catch(() => {
								this.addLoading = false;
							});
						});
					}
				});
			},
			 imgWidth:function(){
				if (screen.width <=375){
					return "370"
				}else  if (screen.width <= 500){
						return screen.width
				}else if (screen.width<=1024){
						return screen.width*0.8
				}else {
						return screen.width*0.8
				}
			 },
			 labelWidth:function(){
				if (screen.width <=375){
					return "80px"
				}else  if (screen.width <= 500){
						return "80px"
				}else if (screen.width<=1024){
						return "100px"
				}else {
						return "120px"
				}
			} ,
			
			showCommonUserSelectDialog:function(){  
					this.userSelectVisible=true; 
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			//获取列表 ProcdefParames 流程定义参数设置表
			getProcinstParamess() {
				var that=this;
				let params = {
					procInstId: this.procInstId
				};
				 
				this.listLoading = true;
				listProcinstParames(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){  
						if(res.data.data.length>0){  
							that.addForm=Object.assign(this.addForm,res.data.data[0]); 
						}else{
							this.addForm=Object.assign(this.addForm,this.defaultAddForm);
						}
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					
				});
			},
			
			showDiagram(){

				var diagramUrl =
                "/" +
                process.env.BASE_API +
                "/" +
                process.env.VERSION +
                "/" +
                config.getWorkflowContext() +
                "/mdp/workflow/ru/diagram/"+this.procDefId+'/'+this.procInstId
            	this.$refs['diagramDialog'].open({diagramUrl:diagramUrl}) 
			},
			 
			handleUploadChange(){
			},
			completeHandle(){
				if(this.task.action=='claim'){
					this.task.nextAssigneeList=[{userid:this.userInfo.userid,username:this.userInfo.username}];
				}
				if(this.addForm.formId==''||this.addForm.formId==null || this.addForm.isRefForm!='1'){
					this.startSubmit()
				}else{ 
					this.$refs['flowFormRef'].editSubmit();
				}
				
			},
		    handlePrint() {
				this.$nextTick(() => {
		        html2canvas(document.getElementById("flowinfoTab")).then(canvas=>{
		                //生成base64图片数据  
		                var dataUrl = canvas.toDataURL();  
		               
		                var newImg = document.createElement("img");  
		                newImg.src = dataUrl;  
		                var printWindow=window.open(newImg.src,"_blank");  
		               if(printWindow==null){
		            	   this.$notify({position:'bottom-left',showClose:true,message: '无法打开打印窗口，请检查是否浏览器阻止弹出框', type: 'error' });
		               }else{
		                     
		            	   this.$nextTick(() => {
		                    	 printWindow.document.write('<img src="'+newImg.src+'" />');
		                    	 printWindow.print();
		                      
		            	   });  
		               } 
		        	});  
				});  
			},
			
			
			onTagSelected(tags){ 
				var procinstTagsVos=[]; 
				var procinstTags={
					procDefId:this.taskInfo.procDefId,
					procInstId:this.taskInfo.procInstId,
					branchId:this.taskInfo.branchId,
					userid:this.userInfo.userid,
					tags:tags.map(i=>{return {tagId:i.tagId,tagName:i.tagName}})
				}
				procinstTagsVos.push(procinstTags);
				var params= procinstTagsVos 
					batchInsertOrDeleteTags(params).then(res=>{ 
						if(res.data.tips.isOk){
							var tagIds=tags.map(i=>i.tagId).join(",");
							var tagNames=tags.map(i=>i.tagName).join(","); 
							this.addForm.tagIds=tags.map(t=>t.tagId).join(",");  
							this.addForm.tagNames=tags.map(t=>t.tagName).join(",");  
							this.$notify.success("打标签成功");
						}else{
							this.$notify.error(res.data.tips.msg);
						}
					}).catch(e=>{});
				
				
				
			},
		    //流程归档
		    handleArchive() {
				this.$nextTick(() => {
		        html2canvas(document.getElementById("flowinfoTab")).then(canvas=>{
		                //生成base64图片数据  
		                var fileData = canvas.toDataURL(); 
		                let params={
		                	fileName:this.addForm.id+".png",
		                	fileData:fileData,
		                	archiveId:this.addForm.id,
		                	categoryId:this.addForm.categoryId
		                }  
		                this.$mdp.uploadBase64ArchiveAttachment(params).then(res=>{
		                	if(res.data.tips.isOk){ 
		   			    	  this.fileList.push(res.data.data);
		   			      	}else{
		   			    	  this.$notify.warning(res.data.tips.msg); 
		   			    	  return false;
		   			      	}
		                });
		                var userid=sessionStorage.getItem("userid");
		                var archive={
		                		id:this.addForm.id,
		                		categoryId:this.addForm.categoryId,
		                		tagNames:'工作流,归档',
		                		deptid:sessionStorage.getItem("deptid"),
		                		userid:userid,
		                		isShare:'1',
		                		url:'',
		                		archiveAbstract:'',
		                		archiveContext:this.addForm.mainContext,
		                		archiveTitle:this.addForm.mainTitle,
		                		archivingUserid:userid,
		                		isFromArchiving:'1',
		                		archivingDate:null,
		                		createDate:null,
		                		authorUserid:userid,
		                		authorName:'',
		                		canDel:'0',
		                		canEdit:'0',
		                		canRead:'1',
		                		bizKey:this.addForm.procInstId,
		                		encryptType:'0'
		                }
		                addWorkflowArchive(archive).then(res=>{
		                	if(res.data.tips.isOk){  
		                		this.$notify.success(res.data.tips.msg); 
		   			      	}else{
		   			    	  this.$notify.error(res.data.tips.msg); 
		   			      	}
		                });  
					}); 
				});
			}, 
			showNodeInfoDialog:function(){
				if(this.nodeInfos && this.nodeInfos.length>0){
					this.nodeInfoVisible=true;
				}else{
					this.listNodeInfos(true)
				}
				
			},
			listNodeInfos(showNodeInfoDialog){
				var params={procInstId:this.taskInfo.procInstId}
				getNodeInfos(params).then(res=>{
					if(res.data.tips.isOk){
						this.nodeInfos=res.data.data;
						if(res.data.data.length>0){
							var actId=this.taskInfo.actId
							if(!actId || actId==''){
								actId=this.taskInfo.taskDefKey
							}
							var data=res.data.data.filter(i=>i.actId==actId);
							if(data.length>0){
								this.actAssignee=data[0]
								if(this.qxCode && this.qxCode.endsWith("1") && this.actAssignee.qxCode){ 
									this.qxCode=this.actAssignee.qxCode
								}
							}else{
								this.actAssignee=null;
							}   
							if(showNodeInfoDialog){
								this.$refs['nodeInfosSetDialog'].open({nodeInfos:this.nodeInfos})
							}
						}
					}
				});
			},
			updateFlowPlanFinishTime:function(){
				 if(this.addForm.planFinishTime==null || this.addForm.planFinishTime==''){
					this.$notify.error("计划完成时间不能为空"); 
					returnn;
				 }
				this.addLoading=true; 
					var params={
						id:this.taskInfo.paramsId,
						procInstId:this.taskInfo.procInstId,
						taskId:this.taskInfo.taskId,
						commentMsg:'',
						oldPlanFinishTime:this.taskInfo.planFinishTime,
						planFinishTime:this.addForm.planFinishTime
					}
					 
					editPlanFinishTime(params).then(res=>{
						this.addLoading=false
						if(res.data.tips.isOk){  
							this.$refs['commentStepRef'].getComments();
							this.$notify.success("更新成功"); 
						}else{
							this.$notify.error(res.data.tips.msg); 
						}
					}) 
			},
			onNodeInfosCancel:function(){
				this.nodeInfoVisible=false;
			},
			onNodeInfosConfirm:function(nodeInfos){
				updateNodeInfos(nodeInfos).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.nodeInfos=res.data.data;
						this.nodeInfoVisible=false;
					} 
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
				
			},
			 
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'procinst-parames-edit':ProcinstParamesEdit
		    FlowForm,
		    'comment-step':CommentStep,  ProcinstNodeInfoSet
		},
		mounted() { 
			console.log("mountedxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
	      	console.log(this.taskInfo)
	      	var date=new Date();
	      	
			    if(this.taskInfo){
					
					this.task.taskId=this.taskInfo.taskId
					this.task.taskName=this.taskInfo.taskName
					this.task.assigneeName=this.taskInfo.assigneeName 
			      	this.task.procInstId=this.taskInfo.procInstId; 
			      	this.task.assignee=this.taskInfo.assignee;
					this.task.nextAssigneeList=[]; 
					this.task.procInstId=this.taskInfo.procInstId; 
					this.task.assignee=this.taskInfo.assignee;
					this.task.nextAssigneeList=[];
					this.needAssignee='';
					this.task.rejectActivity.taskId=''
					this.task.rejectActivity.taskDefKey='';
					this.addForm.formId=this.taskInfo.formId;
					this.addForm.isRefForm=this.taskInfo.isRefForm;
					this.addForm.monitors=this.taskInfo.monitors;
					this.addForm.sponsors=this.taskInfo.sponsors;
					this.addForm.mainTitle=this.taskInfo.mainTitle;
					
					
					this.addForm.tagIds=this.taskInfo.tagIds;
					this.addForm.tagNames=this.taskInfo.tagNames;
					this.addForm.mainQx=this.taskInfo.mainQx;
					this.qxCode= this.addForm.mainQx

			      	console.log("mountedxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
					  console.log(this.taskInfo)
					if(this.taskInfo.assignee==null || this.taskInfo.assignee==''){
						this.task.action='claim'
					}else if(this.taskInfo.delegation!='PENDING'){
			      		this.task.action='agree'
			      	}else if(this.taskInfo.delegation!='RESOLVED' && this.taskInfo.delegation=='PENDING'){
			      		this.task.action='resolve';
			      	}
				}
			    if(this.procInstId){
			    	  this.$nextTick(() => {
			    		  this.getProcinstParamess();
						});
					//this.listNodeInfos();
			    }
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped> 
.wf-title {
	text-align: center; 
	font-size:1.2em;  
	overflow-x:auto;
	overflow-y:auto;
	
}
.wf-sub-title {
	text-align: center;  
	font-size:1.1em;  
	overflow-x:auto;
	overflow-y:auto;
}  
.wf-sub-sub-title{ 
	font-size:0.6em;  
	text-align: center;  
}
 .wf-main-context-box {  
	border:1px dashed #000;
	margin-bottom: 10px;
	margin-top: 10px; 
}
 .wf-main-context p { 
	color: #585858;  
}
	
.wf-main-context   p  > img {
	max-width: 100%; 
}
.more-label-font{
	text-align:center;
	float:left;
	padding-top:5px;
}  
.page-bottom{
	height: calc(5vh); 
}
.name-font{
	color:lightseagreen;
}
</style>