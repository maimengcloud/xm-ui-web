<template>
	<section>
		<el-row class="page-container border">

			<!--新增界面 ProcinstParames 流程实例参数设置表-->
			<el-col :span="24">
				<el-form :model="addForm" size="small" :label-width="labelWidth()" :rules="addFormRules" ref="addForm" >
					<el-form-item label="流程标题" prop="mainTitle">
						  <el-input style="width:100%;" v-model="addForm.mainTitle" auto-complete="off"></el-input> 
					</el-form-item>
					<el-form-item label="标签" prop="tagNames">
							<font  v-if="addForm.tagNames">
							<el-tag v-for="tag in (addForm.tagNames.split(','))" :key="tag"
								:type="'warning'"
								:disable-transitions="false" >
								{{tag }}
							</el-tag>

							</font>
							{{addForm.tagNames?'':'还没有标签，去打一个呗--> '}}
								<el-button   @click.native="tagSelectVisible=true" :loading="addLoading">打标签</el-button>
									<el-button  v-if="displayDiagram==false" @click="showDiagram()">查看流程图</el-button>

					</el-form-item>
					<el-form-item label="计划完成时间" prop="planFinishTime">
						<el-col   :span="10">
							<el-date-picker style="width:100%;"
								v-model="addForm.planFinishTime"
								type="date" value-format="yyyy-MM-dd HH:mm:ss"
								:picker-options="pickerOptions"
								placeholder="选择计划完成日期" >
							</el-date-picker>
						</el-col> <font style="margin-left:5px;">主办可以调整</font>
					</el-form-item>
					<el-form-item label="发起部门" prop="deptid">
						<el-select  v-model="addForm.deptid"  clearable filterable placeholder="请选择">
							<el-option
							v-for="item in myDepts"
							:key="item.deptid"
							:label="item.deptName"
							:value="item.deptid">
							</el-option>
						</el-select>

						<el-popover
							placement="top-start"
							title="设置主办监控人"
							width="400"
							trigger="manual" v-model="sponsorsAndMonitorsVisible">
							<el-row>
								<el-col :span="24" style="padding-top:5px;">
									<font class="more-label-font">主办人:</font>
									<el-select disabled   value-key="userid"    v-model="sponsors" multiple placeholder="请选择">
										<el-option
										v-for="item in baseUserList"
										:key="item.userid"
										:label="item.username"
										:value="item">
										<span style="float: left">{{ item.username }}</span>
										<span style="float: right; color: #8492a6; font-size: 14px">{{ item.shortName }}</span>
										</el-option>
									</el-select>
								</el-col>
								<el-col :span="24" style="padding-top:5px;">
									<font class="more-label-font">监控人:</font>
									<el-select disabled   value-key="userid"   v-model="monitors" multiple placeholder="请选择">
										<el-option
										v-for="item in baseUserList"
										:key="item.userid"
										:label="item.username"
										:value="item">
										<span style="float: left">{{ item.username }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
										</el-option>
									</el-select>
								</el-col>
							</el-row>
							<el-button  slot="reference" icon="el-icon-s-check" @click="showSponsorsAndMonitors">主办人、监控人查询</el-button>
						</el-popover>
					</el-form-item>
				<div  v-if="addForm.isRefForm=='1' && addForm.formId!=null && addForm.formId!='' && addForm.formShowType!='table' ">
						<form-data-mng-for-flow-form :form-data-id="filters.formDataId" :qxCode="addForm.mainQx" :isFlowStart="true"    :form-id="addForm.formId" :submit-event="formDataSubmitEvent" @submit="startSubmit"><div></div></form-data-mng-for-flow-form>
				</div>
				<el-form-item label="流程正文" prop="mainContext" v-loading="listLoading">
					<vue-editor  v-if="screenWidth>=500" :branch-id="userInfo.branchId" v-model="addForm.mainContext"></vue-editor>
				</el-form-item>
				<vue-editor  v-if="screenWidth<500" :branch-id="userInfo.branchId" v-model="addForm.mainContext"></vue-editor>
				<el-form-item label="流程附件" prop="attachment">
					<el-button @click="showAttachment=!showAttachment">{{showAttachment==true?"隐藏附件":"显示附件"}}</el-button>
					<el-col v-if="showAttachment" :span="24">
						<el-col :xs="20" :sm="18" :md="16" :lg="14" :xl="12"><attachment-upload :branch-id="userInfo.branchId" :deptid="userInfo.deptid" :archive-id="addForm.id" :category-id="procdef.categoryId"></attachment-upload></el-col>
						<el-col :xs="4" :sm="6" :md="8" :lg="10" :xl="12">
							<el-popover
								placement="top"
								width="600"
								trigger="click"
								v-model="modelFilesVisible">
								<div style="text-align: right; margin: 0">
										<attachment-upload :branch-id="userInfo.branchId" :deptid="userInfo.deptid" :archive-id="procdef.id" :category-id="procdef.categoryId"></attachment-upload>
								</div>
								<el-button slot="reference"     class="hidden-sm-and-down"  v-on:click="modelFilesVisible=!modelFilesVisible">模板</el-button>
							</el-popover>
						</el-col>
					</el-col>
				</el-form-item>

				<el-form-item  label="流程权限" prop="mainQx">
					 <el-button @click="showMainQxDialog">点击查看/设置流程权限</el-button><el-button @click="showNodeInfoDialog">配置审批人</el-button>
				</el-form-item>
				<el-form-item v-show="needAssignee!=''"  label="下一步执行人" prop="needAssignee">
					<el-col :span="16">
						 <el-select style="width:60%" value-key="userid"    v-model="nextAssigneeList" multiple   placeholder="请选择">
					     <el-option
					      v-for="item in baseUserList"
					      :key="item.userid"
					      :label="item.username"
					      :value="item">
					      <span style="float: left">{{ item.username }}</span>
     					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
					    </el-option>
					  </el-select>
					  <el-button   @click.native="userSelectVisible=true" :loading="addLoading">更多人员</el-button>
					</el-col>
				</el-form-item>
				<el-form-item>
							<el-button @click.native="handleCancel" icon="el-icon-back">取消</el-button>
							<el-button type="primary" @click.native="startHandle" :loading="addLoading" icon="el-icon-finished">发起流程</el-button>
				</el-form-item>
			</el-form>
			</el-col>
			<el-dialog append-to-body
				title="配置流程总体权限"
				:visible.sync="mainQxVisible"
				width="60%">
				<act-qx-code-set :qxType="'mainQx'" :formFields="formFields" :visible="mainQxVisible" :qxCode="addForm.mainQx" @cancel="onMainQxCancel"   @confirm="onMainQxSelected"></act-qx-code-set>
			</el-dialog>

			<el-dialog append-to-body
				title="配置审批人"
				:visible.sync="nodeInfoVisible"
				fullscreen
				>
				<procinst-node-info-set   :node-infos="nodeInfos"   :visible="nodeInfoVisible"   @cancel="onNodeInfosCancel"   @confirm="onNodeInfosConfirm"></procinst-node-info-set>
			</el-dialog>
			<el-dialog
				title="流程图"
				:visible.sync="displayDiagram"
				width="80%" append-to-body	>
				<el-image   :fit="'contain'" :src="diagramUrl">
					<div slot="error" class="image-slot">
						<i class="el-icon-picture-outline"></i>
					</div>
					<div slot="placeholder" class="image-slot">
						正在全力加载中。。。。。。。。。。<i class="el-icon-loading"></i>
					</div>
				</el-image>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="displayDiagram = false">关闭</el-button>
				</span>
			</el-dialog>
			<el-dialog append-to-body
				title="设置标签"
				:visible.sync="tagSelectVisible"
				width="60%">
				<tag-mng :tagIds="addForm.tagIds==null?null:addForm.tagIds.split(',')"  :jump="true" @select-confirm="onTagSelected"></tag-mng>
			</el-dialog>
			<el-dialog append-to-body
				title="选择员工"
				:visible.sync="userSelectVisible"
				width="60%">
				<users-select :select-userids="nextAssigneeList.map(i=>i.userid)"   @confirm="onUserSelected"></users-select>
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import seq from '@/common/js/sequence';//全局公共库
	import util from '@/common/js/util';//全局公共库import
	import config from '@/common/config';//全局公共库import
	import { listUserNames } from '@/api/mdp/sys/user';
	import { startProc } from '@/api/mdp/workflow/ru/execution';
	import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
	import  FormDataMngForFlowForm from '@/views/mdp/form/formData/FormDataMngForFlowForm';//新增界面
	import VueEditor from '@/components/Tinymce/index';
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { mapGetters } from 'vuex'

	import TagMng from '@/views/mdp/arc/tag/TagMng';
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
	import ActQxCodeSet from '@/views/mdp/workflow/re/procdefParames/ActQxCodeSet';
	import ProcinstNodeInfoSet from '@/views/mdp/workflow/ru/procinstParames/ProcinstNodeInfoSet';
	import { getBpmnActAssignees } from '@/api/mdp/workflow/re/procdefNodeInfo';

	export default {
		name:'ProcinstParamesStartSet',
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
			]),

			screenWidth:function(){
				return screen.width;
			},
		},
		props:['visible','procdef','params'],//如果是事先录入了表单数据，则请将表单数据编号输入，否则不需要,如果是外部链接发起流程，传入params参数
		watch: {
			'visible':function(visible){
				this.modelFilesVisible=false;
				if(visible==true){
					if(!this.procdef){
						return;
					}
					this.initByProcdef();
					this.needAssignee=''
					this.needAssigneeNum=-1;
					this.needAssigneeMsg=''
					this.nextAssigneeList=[]
					this.initByParams();
					this.initBaseUserList();
				}
			},
			'nextAssigneeList':function(nextAssigneeList){
				this.$refs.addForm.validateField('needAssignee');
			}
	    },
		data() {
	        var validateNeedAssignee = (rule, value, callback) => {
				if(this.needAssignee=='need-mulit-assignee' && this.nextAssigneeList.length<this.needAssigneeNum){//need-mulit-assignee 需要一个或者多个 need-single-assignee 只需要一个
					 callback(new Error(this.needAssigneeMsg));
				}else if(this.needAssignee=='need-single-assignee' ){
					if(this.nextAssigneeList.length<=0 ){
						 callback(new Error(this.needAssigneeMsg));
					}else if(this.nextAssigneeList.length>1 ){
						callback(new Error('只允许指定一个执行人'));
					}
				}
	              callback();
	          };
			return {
				filters:{
					params:{
						mainTitle:'',
						mainContext:'',
						bizUrl:'',//前端跳转  //自带参数，建议只带主键
						bizKey:'company_regit',//用于选中流程模型并原样输出到restUrl
						restUrl:'',//后端接口同步
						formId:'',//form 表单编号
						bizPkId:'',//业务主键
						bizParentPkid:'',//如果是多级主键，指上级的主键，默认与bizPkid相同
						formDataId:'',//form表单对应的数据
						extVars:{ //不用提交给工作流的变量池
						},
						flowVars:{//提交进流程实例变量的变量池,flowVars所有变量将post方式推送回restUrl指定的地址

						}

					}
				},
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
				options:{},//下拉选择框的所有静态数据
				addLoading: false,
				listLoading:false,
				addFormRules: {
					mainTitle: [
						{ required: true, message: '流程标题不能为空', trigger: 'blur' }
					],
					needAssignee: [
						{ validator: validateNeedAssignee, trigger: 'blur'  }
					],
					deptid: [
						{  required: true, message: '发起部门不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 流程实例参数设置表
				addForm: {
					id:seq.sn(),isRefForm:'',monitors:'',sponsors:'',procInstId:'',formId:'',formDataId:'',procDefId:'',userid:'',startDate:util.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'),planFinishTime:'',mainQx:'',isTemplate:'',mainContext:'',mainTitle:'',deptid:'',categoryId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				procdefParamesForm: {
					id:'',isRefForm:'',monitors:'',sponsors:'',formId:'',procDefId:'',userid:'',lastDate:'',mainContext:'',mainTitle:'',categoryId:'',formShowType:''
				},
				sponsors:[],//
				monitors:[],//
				formDataSubmitEvent:false,
				needAssignee:'',//
				needAssigneeMsg:'',//
				needAssigneeNum:-1,
				nextAssigneeList: [],
		        activeTab:'flowinfoTab',
				diagramUrl:'',
				displayDiagram:false,
				modelFilesVisible:false,
				baseUserList:[],
				userSelectVisible:false,
				tagSelectVisible:false,
				mainQxVisible:false,
				formFields:[],
				showAttachment:false,
				nodeInfoVisible:false,
				nodeInfos:[],
				sponsorsAndMonitorsVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.modelFilesVisible=false;
				this.listLoading=false;
				this.addLoading=false;
				this.$emit('cancel');
			},
			//新增提交ProcinstParames 流程实例参数设置表 父组件监听@submit="afterAddSubmit"
			startSubmit: function (formData) {

				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {

							let params = {procinstParames:this.addForm,formData:formData};
							if(this.params){
								params.extVars=this.params.extVars
								params.flowVars=this.params.flowVars
							}

							this.addLoading = true;
							params.procinstParames.startDeptName=this.myDepts.filter(d=>d.deptid==this.addForm.deptid)[0].deptName;
							params.procinstParames.startUsername=this.userInfo.username
							params.procinstParames.userid=this.userInfo.userid
							params.procinstParames.monitors=this.monitors.map(i=>i.userid).join(",");
							params.procinstParames.sponsors=this.sponsors.map(i=>i.userid).join(",");
							params.nextAssigneeList=this.nextAssigneeList.map(i=>i.userid);
							params.tipscode=this.needAssignee
							params.nodeInfos=this.nodeInfos
							console.log(params);
							startProc(params).then((res) => {
								this.addLoading = false;
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.needAssigneeNum=-1;
									this.needAssignee='';
									this.needAssigneeMsg='';
									this.$emit('submit');//  @submit="afterAddSubmit"
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
									this.handleCancel();
								}else if(tips.tipscode=='need-mulit-assignee'){//need-mulit-assignee 需要一个或者多个 need-single-assignee 只需要一个
									this.needAssignee=tips.tipscode
									this.needAssigneeMsg=tips.msg
									this.needAssigneeNum=tips.needAssigneeNum;
									this.$refs.addForm.validateField('needAssignee');
								}else if(tips.tipscode=='need-single-assignee'){
									this.needAssignee=tips.tipscode
									this.needAssigneeMsg=tips.msg
									this.needAssigneeNum=1;
									this.$refs.addForm.validateField('needAssignee');
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
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			//获取列表 ProcdefParames 流程定义参数设置表
			getProcdefParamess() {

				//不需要再查后端

			},
			handleUploadChange(){
			},

			onUserSelected: function(users){
				users.forEach(u=>{
					if(!this.baseUserList.some(i=>i.userid==u.userid)){
						this.baseUserList.push(u);
					}
					this.userSelectVisible=false;
					this.nextAssigneeList=users;

				})
			},
			initBaseUserList(sponsorsAndMonitorsVisible){
				var that=this;
				var sponsors=[];
				var monitors=[];
				var currentUserid=this.userInfo.userid;
				var currentUsername=this.userInfo.username;
				if(that.addForm.sponsors==null||that.addForm.sponsors==''){
					sponsors=[{userid:currentUserid,username:currentUsername}]
				}else{
					sponsors=that.addForm.sponsors.split(',').map(i=>{return {userid:i,username:i==currentUserid?currentUsername:i}});
				}
				//console.log("monitors-----------"+this.addForm.monitors);
				//console.log("sponsors-----------"+this.addForm.sponsors);
				//console.log("userInfo.userid-----------"+this.userInfo.userid);
				if(that.addForm.monitors==null || that.addForm.monitors==''){
					monitors=[{userid:currentUserid,username:currentUsername}]
				}else{
					monitors=that.addForm.monitors.split(',').map(i=>{return {userid:i,username:i==currentUserid?currentUsername:i}});
				}
				var userids=[].concat(sponsors.map(u=>u.userid)).concat(monitors.map(u=>u.userid));
				var baseUserList=sponsors.concat(monitors.filter(m=>!sponsors.some(s=>s.userid==m.userid)))
				var baseUserListNoIncludeMe=baseUserList.filter(i=>i.userid!=currentUserid);

				if(baseUserListNoIncludeMe.length<=0){
					that.monitors=monitors
					that.sponsors=sponsors
					that.baseUserList=baseUserList
					this.sponsorsAndMonitorsVisible=sponsorsAndMonitorsVisible
					return;
				}else{
					listUserNames({userids:baseUserList.map(i=>i.userid),branchId:that.userInfo.branchId}).then(res=>{
						if(res.data.tips.isOk){
							baseUserList=res.data.data
							baseUserList.forEach(u=>{
								monitors.forEach((m,index)=>{
									if(m.userid==u.userid){
										 m.username=u.username
									}
								});
								sponsors.forEach((m,index)=>{
									if(m.userid==u.userid){
										 m.username=u.username
									}
								});
							})
							that.monitors=monitors
							that.sponsors=sponsors
							that.baseUserList=baseUserList
						}
						this.sponsorsAndMonitorsVisible=sponsorsAndMonitorsVisible
					});
				}



			},
			showDiagram(){
				this.diagramUrl=config.getBaseDomainUrl()+config.getWorkflowBasePath()+"/mdp/workflow/re/procdef/diagram/"+this.procdef.id;
				this.displayDiagram=true;
			},

			startHandle(){
				var date=new Date();
				if(!this.monitors || this.monitors.length==0){
					this.$message.error("监控人不能为空");
					return;
				}

				if(!this.sponsors || this.sponsors.length==0){
					this.$message.error("主办人不能为空");
					return;
				}
				this.formDataSubmitEvent=date.getTime();
				if(this.addForm.formId==''||this.addForm.formId==null || this.addForm.isRefForm!='1'){
					this.startSubmit()
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
			onTagSelected:function(tags){
				this.tagSelectVisible=false;
				console.log("tags"+JSON.stringify(tags));
				this.addForm.tagIds=tags.map(t=>t.tagId).join(",");
				this.addForm.tagNames=tags.map(t=>t.tagName).join(",");

			},

			onMainQxSelected:function(qxCode){
				this.mainQxVisible=false;
				this.addForm.mainQx=qxCode;
			},
			onNodeInfosCancel(){
				this.nodeInfoVisible=false;
			},
			onNodeInfosConfirm:function(nodeInfos){
				this.nodeInfoVisible=false;
				this.nodeInfos=nodeInfos
			},

			onMainQxCancel:function(){
				this.mainQxVisible=false;
			},
			showMainQxDialog:function(){
				this.mainQxVisible=true;
			},
			showNodeInfoDialog:function(){
				if(this.nodeInfos==null || this.nodeInfos.length==0){
					this.listBpmnActAssignees(true)
				}else{
					this.nodeInfoVisible=true;
				}
			},
			onFormFieldsLoad:function(formFields){
				this.formFields=formFields;
			},
			initByParams(){

				if(this.params){
					this.filters.params=this.params; 
					this.addForm.formId=this.params.formId
					this.filters.formDataId=this.params.formDataId 
					this.addForm.mainTitle=this.params.mainTitle  
					this.addForm.mainContext=this.params.mainContext 
					if(this.params.bizUrl!='' && this.params.bizUrl!=null ){
						this.addForm.mainContext=this.addForm.mainContext+'<br><p><a href='+this.params.bizUrl+' target="_blank">'+'点击查看业务数据'+'</a></p>'
					} 
					this.addForm.restUrl=this.params.restUrl 
					this.addForm.bizKey=this.params.bizKey 
					this.addForm.bizParentPkid=this.params.bizParentPkid
					this.addForm.bizPkid=this.params.bizPkid 
				}
			},
			initByProcdef(){
				//this.addForm=Object.assign(this.addForm, this.procdef);
				this.addForm.id=seq.sn();
				this.addForm.procDefId=this.procdef.id;
				this.addForm.modelKey=this.procdef.key;
				this.addForm.mainTitle=(this.procdef.mainTitle!=null && this.procdef.mainTitle!='')?this.procdef.mainTitle:this.procdef.name;
				this.addForm.mainContext=this.procdef.mainContext;
				this.addForm.deptid=this.userInfo.deptid;
				this.addForm.userid=this.userInfo.userid;
				this.addForm.branchId=this.userInfo.branchId;
				this.addForm.formId=this.procdef.formId;
				this.addForm.isRefForm=this.procdef.isRefForm;
				this.addForm.monitors=(this.procdef.monitors!=null && this.procdef.monitors!='')?this.procdef.monitors:this.userInfo.userid;
				this.addForm.sponsors=(this.procdef.sponsors!=null && this.procdef.sponsors!='')?this.procdef.sponsors:this.userInfo.userid;
				var planFinishTime = new Date();
				planFinishTime.setTime(planFinishTime.getTime() + 3600 * 1000 * 24 * 7);
				this.addForm.planFinishTime=util.formatDate(planFinishTime,'yyyy-MM-dd hh:mm:ss')
				this.addForm.tagIds=this.procdef.tagIds;
				this.addForm.tagNames=this.procdef.tagNames;
				this.addForm.mainQx=this.procdef.mainQx;
			},

			showSponsorsAndMonitors(){
				if( (this.monitors==null || this.monitors.length==0 || this.sponsors==null||this.sponsors.length==0) && this.sponsorsAndMonitorsVisible==false ){
					this.initBaseUserList(true)
				}else{
					this.sponsorsAndMonitorsVisible=!this.sponsorsAndMonitorsVisible;
				}
			},
			listBpmnActAssignees(nodeInfoVisible){
				this.nodeInfos=[];
				this.listLoading = true;
				let params = {  };
				params.procDefId=this.procdef.id
				getBpmnActAssignees(params).then(res=>{
					var tips=res.data.tips;
					this.listLoading = false;
					if(tips.isOk){

						this.nodeInfos=res.data.data;
						if(nodeInfoVisible==true){
							this.nodeInfoVisible=true
						}
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
				});
			},
			/**end 在上面加自定义方法**/

		},//end method
		components: {
		    //在下面添加其它组件 'procinst-parames-edit':ProcinstParamesEdit
			'form-data-mng-for-flow-form':FormDataMngForFlowForm,
		    'vue-editor':VueEditor,
		    'attachment-upload':AttachmentUpload,
		    'sticky': Sticky,UsersSelect,TagMng,ActQxCodeSet,ProcinstNodeInfoSet
		},
		mounted() {
			this.$nextTick(() => {
				this.initByProcdef();//先procdef
				this.initByParams();//再 params 以 如果有相同数据以params为准
				//this.listBpmnActAssignees();
				this.initBaseUserList();
        	});
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
