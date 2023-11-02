<template>
	<section>
		 <el-row class="border padding"> 
			<!--新增界面 ProcdefParames 流程定义参数设置表-->
			<el-form :model="addForm"   label-width="120px" label-position="left" :rules="addFormRules" ref="addForm" v-loading="listLoading">
				<el-form-item label="流程标题" prop="mainTitle">
					<el-input v-model="addForm.mainTitle" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="流程标签" prop="tagNames">
					<mdp-select-tag placeholder="标签" show-style="tag" multiple split="," v-model="addForm.tagIds" @change2="(tags)=>{
						if(tags && tags.length>0){
							addForm.tagNames=tags.map(k=>k.tagName).join(',') 
						}else{
							addForm.tagNames=''
						}
					}"></mdp-select-tag>
					<el-button  @click="showDiagram(procdef)" icon="el-icon-view">流程图</el-button>
				</el-form-item> 
				<el-form-item label="发布到发起中心" prop="fp">
					<el-checkbox v-model="addForm.fp" true-label="1" false-label="0">发布到发起中心,可以直接启动流程，无须关联任何其它模块</el-checkbox>
				</el-form-item> 

				<el-form-item label="流程归档" prop="categoryId">
					<mdp-select-cate show-style="tag" v-model="addForm['categoryId']" width="8em" clearable filterable placeholder="选择归档" />   
				</el-form-item> 

				<el-form-item label="流程监控" prop="monitors">
					<mdp-select-user  :multiple="true" v-model="addForm.monitors" split=","></mdp-select-user>
				</el-form-item> 
				<el-form-item label="流程主办" prop="sponsors">
						<mdp-select-user :multiple="true" v-model="addForm.sponsors" split=","></mdp-select-user>
				</el-form-item> 
				<el-form-item label="关联表单" prop="isRefForm">
					<el-row type="flex">
						<el-checkbox v-model="addForm.isRefForm" :true-label="'1'" :false-label="'0'">关联表单？</el-checkbox> 
						<span v-if="addForm.isRefForm=='1'">
							<mdp-select v-model="addForm.formId" :load-fun="listFormDef" :props="{id:'id',name:'formName'}"></mdp-select> 
							<el-radio v-model="addForm.formShowType" label="form">表单形式展现</el-radio>
							<el-radio v-model="addForm.formShowType" label="table">表格形式展现</el-radio> 
						</span>
					</el-row>
				</el-form-item>
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
								<mdp-select-user v-if="scope.row.candidate!='1'" :placeholder="'负责人'" @change2="users=>{
									if(!users){
										scope.row.nodeUsers=[]
									}else{
										scope.row.nodeUsers=[{userid:users.userid,username:users.username}]
									} 
								}"/> 
								<el-button round v-if="scope.row.candidate=='1'" size="mini" @click.native="$refs['hxSetDialog'].open({actAssignee:scope.row})" :loading="addLoading">选候选人</el-button>
 								<el-button round v-if="scope.row.toCreater!='1'" size="mini" @click.native="setAssigneeAsStartUser(scope.row)">转发起人</el-button>
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
			</el-form>  

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
			<mdp-dialog ref="hxSetDialog"
				title="选择候选人/候选部门/候选岗位" >
				<template v-slot="{visible,data,dialog}">
					<act-candidate-set :visible="visible" :actAssignee="data.actAssignee"  @confirm="(act)=>{
						Object.assign(data.actAssignee,act);dialog.close();
					}" @close="dialog.close()"></act-candidate-set>
				</template>
				
			</mdp-dialog>
			<mdp-dialog ref="formDialog"
				title="配置表单"
				width="80%">
				<template v-slot="{visible,data,dialog}">
					<form-def-for-flow-node :visible="visible" :form-id=" data.formId " @cancel="dialog.close()" :form-fields-json="data.formFieldsJson"  @submit="(formFieldsJson)=>{data.formFieldsJson=JSON.stringify(formFieldsJson);dialog.close();}"></form-def-for-flow-node>
				</template>
			</mdp-dialog>
		</el-row>
		
		<el-row class="footer">
			<el-button type="primary" @click.native="addOrEditSubmit" :loading="addLoading">提交</el-button>
			<el-button @click.native="handleCancel">取消</el-button>
			<el-button @click.native="templateVisible=true" :loading="addLoading">导入模板</el-button>
			<el-button @click.native="saveAsTemplate" :loading="addLoading">存为模板</el-button>
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
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from '@/api/mdp_pub/mdp_config';//全局公共库import
	//import { getCompanyEmployees,getCompanyDepts, selectCacheOptions,getDefaultValue,getCodeName } from '@/api/common/code';//下拉框数据查询
	import { editProcdefParames,listProcdefParames, addProcdefParames } from '@/api/mdp/workflow/re/procdefParames';
	import { listProcdefParamesTemplate, addOrUpdateTemplate } from '@/api/mdp/workflow/re/procdefParamesTemplate';
	import { getBpmnActAssignees } from '@/api/mdp/workflow/re/procdefNodeInfo';
	import { listFormDef } from '@/api/mdp/lcode/formDef'; 
	import { mapGetters } from 'vuex' 
	import VueEditor from '@/components/Tinymce/index'; 
	import FormDefForFlowNode from '@/views/mdp/lcode/formDef/FormDefForFlowNode';

	import ProcdefParamesTemplateMng from '@/views/mdp/workflow/re/ProcdefParamesTemplate/ProcdefParamesTemplateMng';

 
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
					id:'',isRefForm:'0',monitors:'',sponsors:'',formId:'',procDefId:'',userid:'',lastDate:'',mainContext:'',mainTitle:'',categoryId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
 
				baseUserList:[],
				companyDepts:[],
				formDefs:[],
				diagramUrl:'',
				nodeInfos:[],//id:'',actId:'',actName:'',procDefId:'',assignees:'',isMultiple:'' ,
				nodeInfosSelectOptions:[],//id:'',actId:'',actName:'',procDefId:'',assignees:[],isMultiple:''
				candidateSelectVisible:false, 
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
			listFormDef,
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
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
									this.handleCancel();
								}).catch(e=>this.addLoading=false);
								return;
							}
							if(params.id==''){
								addProcdefParames({procdefParames:params,nodeInfos:nodeInfosNew}).then((res) => {
									this.addLoading = false;
									var tips=res.data.tips;
									if(tips.isOk){ 
										this.$emit('submit');//  @submit="afterAddSubmit"
										this.handleCancel();
									}
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
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
										this.$emit('submit');//  @submit="afterAddSubmit"
										this.handleCancel();
									}
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
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
							this.addForm=res.data.data[0]; 
						} 
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
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
			showDiagram: function(row) {
             var diagramUrl =
                "/" +
                process.env.BASE_API +
                "/" +
                process.env.VERSION +
                "/" +
                config.getWorkflowContext() +
                "/mdp/workflow/re/procdef/diagram/" +
                row.id;
            	this.$refs['diagramDialog'].open({diagramUrl:diagramUrl})
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
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
				});
			},
			/**end 在上面加自定义方法**/
 
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
					this.$notify.error("请选一个模板进行导入");
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
				if(this.addForm.isRefForm=='1' && this.addForm.formId){
					nodeInfo.formId=this.addForm.formId
					this.$refs['formDialog'].open(nodeInfo)
				}else{
					this.$notify.error("该流程还未关联表单"); 
					nodeInfo.formId=''
					nodeInfo.formFieldsJson=""
					return;
				}
				
			},
			setAssigneeAsStartUser(nodeInfo){
				if(nodeInfo.allowOverUser=='0'){
					this.$notify.error("该节点不允许改变执行人")
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
		    'vue-editor':VueEditor,
			ActCandidateSet,ActQxCodeSet,ProcdefParamesTemplateMng,FormDefForFlowNode
		},
		mounted() {
				this.addForm=Object.assign(this.addForm, this.procdefParames);
				this.addForm.procDefId=this.procdef.id;
				this.addForm.mainTitle=this.procdef.name;
				this.getProcdefParamess();
				this.listBpmnActAssignees();



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
