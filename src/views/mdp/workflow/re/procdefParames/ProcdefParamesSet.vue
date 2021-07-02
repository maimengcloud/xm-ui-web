<template>
	<section>
		<el-row class="app-container">  
			<!--新增界面 ProcinstParames 流程实例参数设置表--> 
			<el-col :span="24">
			<!--新增界面 ProcdefParames 流程定义参数设置表--> 
			<el-form :model="addForm"   label-width="120px" label-position="left" :rules="addFormRules" ref="addForm" v-loading="listLoading">  
				<el-form-item label="流程标题" prop="mainTitle">
					<el-input v-model="addForm.mainTitle" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="标签" prop="tagNames">
					<font v-if="addForm.tagNames">
					<el-tag  v-for="tag in (addForm.tagNames.split(','))" :key="tag"
						:type="'warning'"
						:disable-transitions="false" >
						{{tag}}
					</el-tag>
					</font>
						{{addForm.tagNames?'':'还没有标签，去打一个呗-->'}}
					<el-button   @click.native="tagSelectVisible=true" :loading="addLoading">打标签</el-button>
					<el-button  v-if="displayDiagram==false" @click="showDiagram()">流程图</el-button> 
				</el-form-item>
				<el-col :span="12"> 
					<el-form-item label="监控人" prop="monitors"> 
							<el-col :span="16">
								<el-select style="width:100%" v-model="monitors" multiple clearable filterable placeholder="请选择">
									<el-option
									v-for="item in baseUserList"
									:key="item.userid"
									:label="item.username"
									:value="item.userid">
									<span style="float: left">{{ item.username }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
									</el-option>
								</el-select>
							</el-col>
							<el-col :span="8">
								<el-button   @click.native="monitorsSelectVisible=true" :loading="addLoading">更多人员</el-button> 
							</el-col>
						
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="主办人" prop="sponsors">   
							<el-col :span="16">
								<el-select style="width:100%" v-model="sponsors" multiple  clearable filterable placeholder="请选择">
									<el-option
									v-for="item in baseUserList"
									:key="item.userid"
									:label="item.username"
									:value="item.userid">
									<span style="float: left">{{ item.username }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
									</el-option>
								</el-select>
							</el-col>
							<el-col :span="8">
								<el-button   @click.native="sponsorsSelectVisible=true" :loading="addLoading">更多人员</el-button> 
							</el-col> 
					</el-form-item> 
				</el-col> 
				<el-form-item label="流程归档分类" prop="categoryId"> 
					<el-col :span="14"> <category-tree  show-checkbox  :current-key="addForm.categoryId"  v-on:check-change="handleCategoryCheckChange" ></category-tree> 
					</el-col> 
				</el-form-item> 
				<el-form-item label="关联智能表单" prop="isRefForm">
					<el-col :span="10"> 
					   <el-select style="width:100%" v-model="addForm.formId" clearable filterable  placeholder="请选择">
					    <el-option
					      v-for="item in formDefs"
					      :key="item.id"
					      :label="item.formName"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</el-col>
					<el-col :span="10" style="padding-left:5px;"> 
						<el-radio v-model="addForm.formShowType" label="form">表单形式展现</el-radio>
  						<el-radio v-model="addForm.formShowType" label="table">表格形式展现</el-radio>
					</el-col>
				</el-form-item>  
				<form-data-mng-for-flow-form v-if="addForm.isRefForm=='1' && addForm.formId!=null && addForm.formId!=''" :formShowType="addForm.formShowType" :companyDepts="companyDepts" :companyEmployees="companyEmployees" :formId="addForm.formId" @formFieldsLoad="onFormFieldsLoad"><div></div></form-data-mng-for-flow-form> 
				<el-form-item  label="审批人设置" prop="assignees">  
					  <el-table
						:data="nodeInfosSelectOptions"
						border
						style="width: 100%">
						<el-table-column
						fixed
						prop="actName"
						label="节点名称"
						min-width="100">
						</el-table-column>
						<el-table-column
						fixed
						prop="showNextAssignees"
						label="已配置人员"
						min-width="250">
							<template slot-scope="scope">
								{{showAssigneeTips(scope.row)}} 
								<el-button round v-if="scope.row.candidate=='1'" type="warning" @click.native="showCandidateSelectDialog(scope.row,'')" :loading="addLoading">选候选人</el-button> 
								<el-button round v-if="scope.row.candidate!='1' " type="success" @click.native="showUserSelectDialog(scope.row,'')" :loading="addLoading">选人员</el-button>  
								<el-button round v-if="scope.row.toCreater!='1'" type="primary" @click.native="setAssigneeAsStartUser(scope.row)">转发起人</el-button>  
							</template>
						</el-table-column>
						<el-table-column
						fixed
						prop="showNextAssignees"
						label="手选执行人"
						width="150">
						
							<template slot-scope="scope">
								<el-checkbox v-model="scope.row.showNextAssignees" label="可手选" true-label="1" false-label="0" border></el-checkbox>   
							</template>
						</el-table-column>
						<el-table-column
						prop="candidate"
						label="候选任务"
						width="120"> 
							<template slot-scope="scope">
								<el-checkbox v-model="scope.row.candidate" label="候选" true-label="1" false-label="0" border></el-checkbox>  
							</template>
						</el-table-column> 
						
						<el-table-column
						prop="qxCode" 
						label="权限配置"
						min-width="100">
							<template slot-scope="scope">  
								<el-button   type="plain" @click.native="showQxDialog(scope.row)"  >配置权限</el-button>   
							</template>
						</el-table-column> 
						
						<el-table-column
						prop="formId" 
						label="表单配置"
						min-width="100">
							<template slot-scope="scope">  
								<el-button   type="plain" @click.native="showNodeForm(scope.row)"  >配置表单</el-button>   
							</template>
						</el-table-column> 
					</el-table> 
				</el-form-item>
				<el-form-item label="流程正文" prop="mainContext">
					<vue-editor :branch-id="userInfo.branchId" v-model="addForm.mainContext"></vue-editor>  
				</el-form-item>
				<el-form-item>
					<attachment-upload :branch-id="userInfo.branchId" :deptid="userInfo.deptid" :archive-id="procdef.id" :category-id="addForm.categoryId"></attachment-upload>

				</el-form-item>
				
				<el-form-item  label="流程权限" prop="mainQx">
					 <el-button @click="showMainQxDialog">点击查看/设置流程权限</el-button>
				</el-form-item>
				<el-form-item> 
							<el-button @click.native="handleCancel">取消</el-button>   
							<el-button type="primary" @click.native="templateVisible=true" :loading="addLoading">导入模板</el-button> 
							<el-button type="primary" @click.native="saveAsTemplate" :loading="addLoading">存为模板</el-button> 
							<el-button type="primary" @click.native="addOrEditSubmit" :loading="addLoading">提交</el-button>   
				</el-form-item> 
			</el-form>
			</el-col>	
			
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
				title="模板导入"
				:visible.sync="templateVisible"
				width="60%"> 
				<procdef-parames-template-mng :visible="templateVisible" :modelKey="procdef.key" :procDefId="procdef.id"  @cancel="templateVisible=false"   @confirm="onTemplateSelected"></procdef-parames-template-mng> 
			</el-dialog>
			<el-dialog append-to-body
				title="配置流程总体权限"
				:visible.sync="mainQxVisible"
				width="60%"> 
				<act-qx-code-set :qxType="'mainQx'" :formFields="formFields" :visible="mainQxVisible" :qxCode="addForm.mainQx" @cancel="onMainQxCancel"   @confirm="onMainQxSelected"></act-qx-code-set> 
			</el-dialog>
			<el-dialog append-to-body
				title="配置流程节点权限"
				:visible.sync="qxVisible"
				width="60%"> 
				<act-qx-code-set :formFields="formFields" :visible="qxVisible" :qxCode="actSelected ? actSelected.qxCode:''" @cancel="onQxCancel"   @confirm="onQxSelected"></act-qx-code-set> 
			</el-dialog>
			<el-dialog append-to-body
				title="选择监控人"
				:visible.sync="monitorsSelectVisible"
				width="60%"> 
				<users-select :select-userids="monitors.map(i=>i.userid)"   @confirm="onMonitorsSelected"></users-select> 
			</el-dialog>
			<el-dialog append-to-body
				title="设置标签"
				:visible.sync="tagSelectVisible"
				width="60%"> 
				<tag-mng :tagIds="addForm.tagIds==null?null:addForm.tagIds.split(',')"  :jump="true" @select-confirm="onTagSelected"></tag-mng> 
			</el-dialog>
			<el-dialog append-to-body
				title="选择候选人/候选部门/候选岗位"
				:visible.sync="candidateSelectVisible"
				width="60%"> 
				<act-candidate-set :actAssignee="actSelected"  @confirm="onCandidateSelected"></act-candidate-set> 
			</el-dialog>
			<el-dialog append-to-body
				title="选择主办员工"
				:visible.sync="sponsorsSelectVisible"
				width="60%"> 
				<users-select :select-userids="sponsors.map(i=>i.userid)"   @confirm="onSponsorsSelected"></users-select> 
			</el-dialog>
			<el-dialog append-to-body
				title="选择审批员工"
				:visible.sync="userSelectVisible"
				width="60%"> 
				<users-select :select-userids=" (actSelected && actSelected.nodeUsers)?actSelected.nodeUsers:[]"   @confirm="onUserSelected"></users-select> 
			</el-dialog>
			<el-dialog append-to-body
				title="配置表单"
				:visible.sync="nodeFormVisible"
				width="80%"> 
				<form-def-for-flow-node :visible="nodeFormVisible" :form-id=" (actSelected && actSelected.formId)?actSelected.formId:''" @cancel="onNodeFormCancel" :form-fields-json="actSelected?actSelected.formFieldsJson:null"  @submit="onFormDefForFlowNodeSubmit"></form-def-for-flow-node> 
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库import 
	//import { getCompanyEmployees,getCompanyDepts, selectCacheOptions,getDefaultValue,getCodeName } from '@/api/common/code';//下拉框数据查询
	import { editProcdefParames,listProcdefParames, addProcdefParames } from '@/api/mdp/workflow/re/procdefParames';
	import { listProcdefParamesTemplate, addOrUpdateTemplate } from '@/api/mdp/workflow/re/procdefParamesTemplate';
	import { getBpmnActAssignees } from '@/api/mdp/workflow/re/procdefNodeInfo';
	import  FormDataMngForFlowForm from '@/views/mdp/form/formData/FormDataMngForFlowForm';//新增界面
	import { listFormDef } from '@/api/mdp/form/formDef';
	import  CategoryTree from '@/views/mdp/arc/category/CategoryTree';//修改界面
	import { listUser,listUserNames } from '@/api/mdp/sys/user';
	import { listDept } from '@/api/mdp/sys/dept';
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { mapGetters } from 'vuex' 
	import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';  
	import VueEditor from '@/components/VueEditor/Index';
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect';  
	import FormDefForFlowNode from '@/views/mdp/form/formDef/FormDefForFlowNode';  
	
	import ProcdefParamesTemplateMng from '@/views/mdp/workflow/re/ProcdefParamesTemplate/ProcdefParamesTemplateMng';  
	
	import TagMng from '@/views/mdp/arc/tag/TagMng';  
	
	import ActCandidateSet from '@/views/mdp/workflow/re/procdefParames/ActCandidateSet';  
	import ActQxCodeSet from '@/views/mdp/workflow/re/procdefParames/ActQxCodeSet';  

	export default {
		name:'ProcdefParamesSet',
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['procdefParames','visible','procdef'],
		watch: {
	      'procdefParames':function( procdefParames ) {
	        this.addForm = procdefParames;
	      },
	      'addForm.formId':function( formId ) {
	    	  	if(formId=='' || formId==null){
	    	  		this.addForm.isRefForm="0"
	    	  	}else{
	    	  		this.addForm.isRefForm="1"
	    	  	} 
		      },
	      'procdef':function( procdef ) {
		        this.addForm.procDefId=procdef.id;
		        this.addForm.mainTitle=procdef.name;
		        this.addForm.mainContext=procdef.name;
		        this.addForm.id='';
		        this.addForm.formId='';
		        this.addForm.isRefForm='0';
		        this.nodeInfos=[];
		        this.monitors=[];
		        this.sponsors=[];
		        this.$nextTick(() => {
					this.getProcdefParamess();
					this.listBpmnActAssignees(); 
	        	});
		       
		  }, 
	      'visible':function(visible) {  
	      	if(visible==true){ 
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				addLoading: false,
				listLoading:false,
				addFormRules: {
					mainTitle: [
						{ required: true, message: '流程标题不能为空', trigger: 'blur' }
					],
					categoryId:[
						{ required: true, message: '流程归档分类不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 流程定义参数设置表
				addForm: {
					id:'',isRefForm:'',monitors:'',sponsors:'',formId:'',procDefId:'',userid:'',lastDate:'',mainContext:'',mainTitle:'',categoryId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				sponsors:[],//
				monitors:[],//
				companyEmployees:[],
				baseUserList:[],
				companyDepts:[],
				formDefs:[],
				diagramUrl:'',
				nodeInfos:[],//id:'',actId:'',actName:'',procDefId:'',assignees:'',isMultiple:'' ,
				nodeInfosSelectOptions:[],//id:'',actId:'',actName:'',procDefId:'',assignees:[],isMultiple:'' 
				candidateSelectVisible:false, 
				userSelectVisible:false, 
				actSelected:null,//选中的nodeInfos
				sponsorsSelectVisible:false,
				monitorsSelectVisible:false,
				displayDiagram:false,
				tagSelectVisible:false,
				qxVisible:false,
				mainQxVisible:false,
				formFields:[],
				templateVisible:false,
				nodeFormVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交ProcdefParames 流程定义参数设置表 父组件监听@submit="afterAddSubmit"
			addOrEditSubmit: function (saveAsTempalte) {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.addForm); 
							params.sponsors=this.sponsors.map(i=>i.userid).join(',');
							params.monitors=this.monitors.map(i=>i.userid).join(',');
							if(params.branchId==null || params.branchId==''){
								params.branchId=this.userInfo.branchId
							}
							if(params.formId!=''&& params.formId!=null){
								params.isRefForm='1'
							}else{
								params.isRefForm='0'
							}
							var nodeInfosNew=new Array();
							this.nodeInfosSelectOptions.forEach(i=>{
								let act=Object.assign({},i) 
								 if(act.showNextAssignees==null || act.showNextAssignees==''||!act.showNextAssignees){
									act.showNextAssignees="0"
								 }
								 if(act.candidate==null || act.candidate==''||!act.candidate){
									act.candidate="0"
								 } 
								 if(act.isMultiple==null || act.isMultiple==''||!act.isMultiple){
									act.isMultiple="0"
								 }
								 
								 if(act.instanceCount==null || act.instanceCount==''||!act.instanceCount){
									act.instanceCount="0"
								 }
								nodeInfosNew.push(act)
							})

							if(saveAsTempalte==true){
								params.modelKey=this.procdef.key
								addOrUpdateTemplate(params).then(res=>{
									var tips=res.data.tips;
									this.addLoading = false; 
									this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
								}).catch(e=>this.addLoading=false);
								return;
							}
							if(params.id==''){
								addProcdefParames({procdefParames:params,nodeInfos:nodeInfosNew}).then((res) => {
									this.addLoading = false; 
									var tips=res.data.tips;
									if(tips.isOk){
										this.$refs['addForm'].resetFields();
										this.$emit('submit');//  @submit="afterAddSubmit"
									}
									this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
								}).catch(() => {
									this.addLoading = false;
								});
							}else{
								var changeTags="0"
								var addFormTagIds=(params.tagIds?params.tagIds:"").split(",");
								var taskTagIds=(this.procdef.tagIds?this.procdef.tagIds:"").split(",");
								if(addFormTagIds.sort().join(",")==taskTagIds.sort().join(",")){//没修改过标签
									changeTags="0"
								}else{//修改过标签
									changeTags="1"
								} 
								editProcdefParames({changeTags:changeTags,procdefParames:params,nodeInfos:nodeInfosNew}).then((res) => {
									this.addLoading = false; 
									var tips=res.data.tips;
									if(tips.isOk){
										this.$refs['addForm'].resetFields();
										this.$emit('submit');//  @submit="afterAddSubmit"
									}
									this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
								}).catch(() => {
									this.addLoading = false;
								});
							}
							
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			//获取列表 ProcdefParames 流程定义参数设置表
			getProcdefParamess() {
				let params = {
					procDefId: this.procdef.id
				};
				 
				this.listLoading = true;
				listProcdefParames(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){  
						if(res.data.data.length>0){
							console.log(res.data);
							this.addForm=res.data.data[0]; 
							this.sponsors=this.addForm.sponsors==null?[]:this.addForm.sponsors.split(',').map(i=>{return {userid:i,username:i}});
							this.monitors=this.addForm.monitors==null?[]:this.addForm.monitors.split(',').map(i=>{return {userid:i,username:i}});
						}
						
						console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx");
						console.log(this.nodeInfosSelectOptions);
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					
				});
			},	 
			onCandidateSelected:function(actAssignee){
				this.candidateSelectVisible=false;
				console.log("actAssignee-----------"+JSON.stringify(actAssignee));
				 
				this.actSelected.nodeUsers=actAssignee.nodeUsers;
				this.actSelected.groupIds=actAssignee.groupIds
				this.actSelected.toCreater='0'

			},
			onUserSelected:function(users){
				this.userSelectVisible=false;
				console.log("posts-----------"+JSON.stringify(users));
				users.forEach(i=>{
					if(!this.baseUserList.some(k=>k.userid==i.userid)){
						this.baseUserList.push(i);
					}
				})
				this.actSelected.nodeUsers=users 
				this.actSelected.toCreater='0'

			}, 
			onTagSelected:function(tags){
				this.tagSelectVisible=false;
				console.log("tags"+JSON.stringify(tags));
				this.addForm.tagIds=tags.map(t=>t.tagId).join(",");  
				this.addForm.tagNames=tags.map(t=>t.tagName).join(",");  

			}, 
			
			onMonitorsSelected:function(users){
				this.monitorsSelectVisible=false;
				console.log("posts-----------"+JSON.stringify(users));
				users.forEach(i=>{
					if(!this.baseUserList.some(k=>k.userid==i.userid)){
						this.baseUserList.push(i);
					}
				})
				this.monitors=users;

			},
			
			onSponsorsSelected:function(users){
				this.sponsorsSelectVisible=false;
				users.forEach(i=>{
					if(!this.baseUserList.some(k=>k.userid==i.userid)){
						this.baseUserList.push(i);
					}
				})
				console.log("posts-----------"+JSON.stringify(users));  
				this.sponsors=users;
			},
			showMonitorsSelectDialog(){

			},
			showSponsorsSelectDialog(){

			}, 
			
			showUserSelectDialog:function(actSelected,index){
				console.log(actSelected);
				this.userSelectVisible=true;
				this.actSelected=actSelected;
			},
			showCandidateSelectDialog:function(actSelected,index){
				console.log(actSelected);
				this.candidateSelectVisible=true;
				this.actSelected=actSelected;
			},
			showAssigneeTips(actAssignee){
				var tips=[];
				if(actAssignee.toCreater=='1'){
					tips.push("流程发起人作为执行人")
				} else if(actAssignee.candidate=='1'){
					if(actAssignee.nodeUsers){
						var userCount=actAssignee.nodeUsers.length;
						tips.push(userCount+"个候选用户");
					} 
					if(actAssignee.groupIds){
						var groupCount=actAssignee.groupIds.split(",").length;
						tips.push(groupCount+"个候选部门/岗位");
					}
					if(tips.length==0){
						tips.push("未配置任何候选人/候选部门/候选岗位");
					}
					
				}else{
					if(actAssignee.nodeUsers){
 
							tips=tips.concat(actAssignee.nodeUsers.map(i=>i.username)); 
					}else{
						tips.push("未配置任何任务执行人");
					} 
				}
				return tips.join(",");
			},
			showDiagram(){
				this.diagramUrl=config.getBaseDomainUrl()+config.getWorkflowBasePath()+"/mdp/workflow/re/procdef/diagram/"+this.procdef.id;
				this.displayDiagram=true;
			},
			getFormDefs() {
				let params = {};
				params.branchId=this.userInfo.branchId
				this.listLoading = true;
				listFormDef(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.formDefs = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					this.$message({ message: '访问错误', type: 'error' });
				});
			},
			handleCategoryCheckChange(data, checked, indeterminate){
				console.log("555555555555555555555555555555555555555555"); 
				this.addForm.categoryId=checked?data.id:'';
				console.log(this.addForm.categoryId);
			},
			listBpmnActAssignees(){
				let params = {
					procDefId: this.procdef.id
				};
				this.nodeInfos=[];
				this.nodeInfosSelectOptions=[];
				this.listLoading = true;
				getBpmnActAssignees(params).then(res=>{
					var tips=res.data.tips;
					this.listLoading = false;
					if(tips.isOk){
						//this.nodeInfos=res.data.data
						this.nodeInfos=res.data.data;
						this.nodeInfosSelectOptions=this.nodeInfos; 
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
				});
			},
			/**end 在上面加自定义方法**/
			
			initBaseUserList(){
				var that=this;
				var sponsors=that.addForm.sponsors.split(',').map(i=>{return {userid:i,username:i}});
				var monitors=that.addForm.monitors.split(',').map(i=>{return {userid:i,username:i}});
				var userids=[].concat(sponsors.map(u=>u.userid)).concat(monitors.map(u=>u.userid));
				var currentUser={userid:this.userInfo.userid,username:this.userInfo.username}
				that.baseUserList=sponsors.concat(monitors.filter(m=>!sponsors.some(s=>s.userid==m.userid)))
				that.sponsors=sponsors;
				that.monitors=monitors; 
				if(!that.baseUserList.some(i=>i.userid==currentUser.userid)){
						that.baseUserList.push(currentUser);
				}
				if(this.baseUserList.filter(i=>i.userid!=currentUser.userid).length<=0){
					return;
				}
				listUserNames({userids:that.baseUserList.map(i=>i.userid),branchId:that.userInfo.branchId}).then(res=>{
					if(res.data.tips.isOk){
						that.baseUserList=res.data.data 
						that.baseUserList.forEach(u=>{
							that.monitors.forEach((m,index)=>{
								if(m.userid==u.userid){
									that.$set(that.monitors,index,u)
								}
							});
							that.sponsors.forEach((m,index)=>{
								if(m.userid==u.userid){
									that.$set(that.sponsors,index,u)
								}
							});
						})
					}
					
				});
			},
			onQxSelected:function(qxCode){
				this.qxVisible=false;
				this.actSelected.qxCode=qxCode;
			},
			
			onQxCancel:function(){
				this.qxVisible=false; 
			},
			showQxDialog:function(act){
				this.qxVisible=true;
				this.actSelected=act;
			},
			
			onMainQxSelected:function(qxCode){
				this.mainQxVisible=false;
				this.addForm.mainQx=qxCode;
			},
			
			onMainQxCancel:function(){
				this.mainQxVisible=false; 
			},
			showMainQxDialog:function(){
				this.mainQxVisible=true; 
			},
			onFormFieldsLoad:function(formFields){
				this.formFields=formFields;
			},
			saveAsTemplate(){
				 this.addOrEditSubmit(true);
			},
			onTemplateSelected(template){
				if(template!=null){
					this.addForm.mainContext=template.mainContext
					this.addForm.mainTitle=template.mainTitle
					this.addForm.mainQx=template.mainQx
					this.addForm.sponsors=template.sponsors
					this.addForm.monitors=template.monitors
					this.addForm.categoryId=template.categoryId
					this.addForm.isRefForm=template.isRefForm
					this.addForm.formShowType=template.formShowType
					this.addForm.formId=template.formId
					this.templateVisible=false;
				}else{
					this.$message.error("请选一个模板进行导入");
				}
			},
			onFormDefForFlowNodeSubmit:function(formDefAndFields){
				this.nodeFormVisible=false;
				this.actSelected.formId=formDefAndFields.formDef.id
				this.actSelected.formFieldsJson=JSON.stringify(formDefAndFields.formFields);
			},
			onNodeFormCancel:function(){
				this.nodeFormVisible=false;
			},
			showNodeForm:function(nodeInfo){ 
				this.actSelected=nodeInfo 
				this.nodeFormVisible=true
			},
			setAssigneeAsStartUser(nodeInfo){
				if(nodeInfo.allowOverUser=='0'){
					this.$message.error("该节点不允许改变执行人")
					return ;
				} 
				this.actSelected=nodeInfo
				this.actSelected.toCreater='1'
				this.actSelected.candidate='0'
				this.actSelected.showNextAssignees='0'
				
			}
		},//end method
		components: {  
		    //在下面添加其它组件 'procdef-parames-edit':ProcdefParamesEdit
		    'form-data-mng-for-flow-form':FormDataMngForFlowForm,
		    'vue-editor':VueEditor,
		    'category-tree':CategoryTree,
			'sticky': Sticky,
			AttachmentUpload,UsersSelect,ActCandidateSet,TagMng,ActQxCodeSet,ProcdefParamesTemplateMng,FormDefForFlowNode
		},
		mounted() { 
				this.addForm=Object.assign(this.addForm, this.procdefParames);
				this.addForm.procDefId=this.procdef.id;
				this.addForm.mainTitle=this.procdef.name;
				this.getProcdefParamess();
				this.listBpmnActAssignees();
				this.getFormDefs();
				this.initBaseUserList();
				 
					 
			
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>
<style scoped>

	.actConfig {
		margin-bottom: 14px;
	}
</style>