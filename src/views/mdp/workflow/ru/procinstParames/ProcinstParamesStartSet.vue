<template>
	<section>
		<el-row> 
				<el-form :model="addForm" size="small" :label-width="labelWidth()" :rules="addFormRules" ref="addForm" >
					<el-form-item label="流程标题" prop="mainTitle">
						  <el-input style="width:100%;" v-model="addForm.mainTitle" auto-complete="off"></el-input> 
					</el-form-item>
					<el-form-item label="标签" prop="tagNames">
						<mdp-select-tag placeholder="标签" show-style="tag" multiple split="," v-model="addForm.tagIds" @change2="(tags)=>{
							if(tags && tags.length>0){
								addForm.tagNames=tags.map(k=>k.tagName).join(',') 
							}else{
								addForm.tagNames=''
							}
						}"></mdp-select-tag>
 						<el-button  @click="showDiagram(procdef)">查看流程图</el-button>

					</el-form-item>
					<el-form-item label="计划完成时间" prop="planFinishTime">
 							<el-date-picker
								v-model="addForm.planFinishTime"
								type="date" value-format="yyyy-MM-dd HH:mm:ss"
								:picker-options="pickerOptions"
								placeholder="选择计划完成日期" >
							</el-date-picker>
						 <font style="margin-left:5px;">主办可以调整</font>
					</el-form-item>
					<el-form-item label="主办" prop="sponsors">
						 <mdp-select-user placeholder="主办人" v-model="addForm.sponsors" :multiple="true" split=","/>
						 <mdp-select-user placeholder="监控人" v-model="addForm.monitors" :multiple="true" split=","/> 
					</el-form-item>
				<div  v-if="addForm.isRefForm=='1' && addForm.formId!=null && addForm.formId!='' && addForm.formShowType!='table' ">
						<flow-form ref="flowFormRef" :form-data-id="filters.formDataId" :qxCode="addForm.mainQx" :isFlowStart="true"    :form-id="addForm.formId" @submit="startSubmit"><div></div></flow-form>
				</div>
				<el-form-item label="流程正文" prop="mainContext" v-loading="listLoading">
					<vue-editor v-if="addForm && addForm.procDefId" :key="addForm.procDefId+addForm.id" :branch-id="userInfo.branchId" v-model="addForm.mainContext"></vue-editor>
				</el-form-item>
				<vue-editor  v-if="screenWidth<500" :branch-id="userInfo.branchId" v-model="addForm.mainContext"></vue-editor>
				<el-form-item label="流程附件" prop="attachment">
					<el-button  type="text"    v-on:click="$refs['attTplDialog'].open({})"  icon="el-icon-document-copy">附件模板</el-button> 
				</el-form-item>

				<el-form-item  label="流程权限" prop="mainQx">
					 <el-button @click="$refs['qxSetDialog'].open({addForm})">设置权限</el-button><el-button @click="showNodeInfoDialog">配置审批人</el-button>
				</el-form-item>
				<el-form-item v-show="needAssignee!=''"  label="下一步执行人" prop="needAssignee"> 
					<mdp-select-user v-model="nextAssigneeList"></mdp-select-user>
				</el-form-item>
			</el-form> 
			<mdp-dialog ref="qxSetDialog"
				title="配置流程总体权限" 
				width="60%">
				<template v-slot="{visible,data,dialog}">
					<act-qx-code-set :qxType="'mainQx'" :formFields="formFields" :visible="visible" :qxCode="data.mainQx" @cancel="dialog.close()"   @confirm="(mainQx)=>{data.mainQx=mainQx;dialog.close()}"></act-qx-code-set>
				</template>
			</mdp-dialog>

			<mdp-dialog ref="nodeInfoSetDialog"
				title="配置审批人" 
				fullscreen
				>
				<template v-slot="{visible,data,dialog}">
					<procinst-node-info-set   :node-infos="data"   :visible="visible"   @cancel="dialog.close()"   @confirm="(nf)=>{nodeInfos=nf;dialog.close();}"></procinst-node-info-set>
				</template>
			</mdp-dialog>
			
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
					<mdp-select-att  sub-op-type="mng" crely-type="procDefId" :crely-id="addForm.procDefId" crely-stype="procInstId" :crely-sid="addForm.procInstId"></mdp-select-att>
				</template>
			</mdp-dialog> 
		</el-row>
		<el-row class="footer">
			 
			<el-button @click.native="handleCancel" icon="el-icon-back">关闭</el-button>
			<el-button type="primary" @click.native="startHandle" :loading="addLoading" icon="el-icon-finished">发起流程</el-button>
 		</el-row>
	</section>
</template>

<script>
	import seq from '@/components/mdp-ui/js/sequence';//全局公共库
	import util from '@/components/mdp-ui/js/util';//全局公共库import
	import config from '@/api/mdp_pub/mdp_config';//全局公共库import 
	import { startProc } from '@/api/mdp/workflow/ru/execution';
	import  FlowForm from '@/views/mdp/lcode/formData/FlowForm';//新增界面
	import VueEditor from '@/components/Tinymce/index';
 	import { mapGetters } from 'vuex'
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
				needAssignee:'',//
				needAssigneeMsg:'',//
				needAssigneeNum:-1,
				nextAssigneeList: [],
				modelFilesVisible:false, 
				formFields:[], 
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
							params.procinstParames.startUsername=this.userInfo.username
							params.procinstParames.userid=this.userInfo.userid 
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

			startHandle(){
				var date=new Date();
				if(!this.addForm.monitors || this.addForm.monitors.length==0){
					this.$notify.error("监控人不能为空");
					return;
				}

				if(!this.addForm.sponsors || this.addForm.sponsors.length==0){
					this.$notify.error("主办人不能为空");
					return;
				} 
				if(this.addForm.formId==''||this.addForm.formId==null || this.addForm.isRefForm!='1'){
					this.startSubmit()
				}else{
					this.$refs['flowFormRef'].editSubmit();
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
			showNodeInfoDialog:function(){
				if(this.nodeInfos==null || this.nodeInfos.length==0){
					this.listBpmnActAssignees(true)
				}else{
					 this.$refs['nodeInfoSetDialog'].open(this.nodeInfos)
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
							this.$refs['nodeInfoSetDialog'].open(this.nodeInfos)
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
			FlowForm,
		    'vue-editor':VueEditor,
		    ActQxCodeSet,ProcinstNodeInfoSet
		},
		mounted() {
			this.$nextTick(() => {
				this.initByProcdef();//先procdef
				this.initByParams();//再 params 以 如果有相同数据以params为准
        	});
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
