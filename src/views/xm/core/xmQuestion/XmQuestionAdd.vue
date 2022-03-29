<template>
	<section> 
		<el-row class="page-main">
			<el-form :model="addForm" label-width="120px"  :rules="addFormRules" ref="addForm">
						<el-form-item label="缺陷标题" prop="name">
							<el-input v-model="addForm.name" placeholder="缺陷标题" ></el-input> 
						</el-form-item>
						<el-row>
							<el-col :span="8">
								<el-form-item label="归属项目" prop="projectId">
									<font v-if="filters.selProject">{{this.filters.selProject?this.filters.selProject.name:''}}</font>
 									 <xm-project-select ref="xmProjectSelect" v-if="!selProject" @row-click="onPorjectConfirm"></xm-project-select>
								</el-form-item>
							</el-col>
							<el-col  :span="8">
								<el-form-item label="隶属需求" prop="menuId"> 
									<el-tag title="隶属需求" closable @click="showSelectMenu" @close.stop="handleCloseMenuTag">
									<div class="icon" :style="{backgroundColor:   'rgb(79, 140, 255)' }">
										<i :class="  'el-icon-document'  " ></i>
									</div> {{addForm.menuName?addForm.menuName:"未关联需求"}}</el-tag> 
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="负责人" prop="handlerUsername">
									{{addForm.handlerUsername}} <el-button type="text" @click="sendToAsk">指派给提出人</el-button><el-button type="text"  @click="sendToCreater">指派给创建人</el-button><el-button type="text"  @click="showGroupUsers('handlerUsername')">指派给其它人</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8">
								<el-form-item label="严重程度" prop="bugSeverity">
								<el-select v-model="addForm.bugSeverity" placeholder="请选择严重程度">
									<el-option v-for="(i,index) in dicts['bugSeverity']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
								</el-select> 
								</el-form-item>
							</el-col> 
							<el-col :span="8">
								<el-form-item label="优先级别" prop="priority">
									<el-select v-model="addForm.priority" placeholder="请选择优先级">
										<el-option v-for="(i,index) in dicts['priority']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
									</el-select> 
								</el-form-item> 
							</el-col>
							<el-col :span="8">
								<el-form-item label="结束时间" prop="endTime">
										<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="addForm.endTime"></el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-tabs value="1">
							<el-tab-pane name="1" label="基本信息">
								<el-row> 
										<el-col :span="6">
											<el-form-item label="复现频率" prop="repRate">
												<el-select v-model="addForm.repRate" placeholder="请选择复现频率">
													<el-option v-for="(i,index) in dicts['bugRepRate']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
												</el-select> 
											</el-form-item>
											
										</el-col> 
										<el-col :span="6">
											<el-form-item label="复现版本" prop="verNum">
												<el-select v-model="addForm.verNum" placeholder="请选择版本">
													<el-option v-for="(i,index) in xmProductVersions" :label="i.name" :value="i.id" :key="index">{{i.id}}</el-option>
												</el-select> 
											</el-form-item>
										</el-col> 
										<el-col :span="6">
											<el-form-item label="缺陷类别" prop="bugType">
												<el-select v-model="addForm.bugType" placeholder="请选择缺陷类别">
													<el-option v-for="(i,index) in dicts['bugType']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
												</el-select> 
											</el-form-item>
											
										</el-col> 
										<el-col :span="6">
											<el-form-item label="提出人" prop="askUsername">
												<el-tag @click="showGroupUsers('askUsername')">{{addForm.askUsername?addForm.askUsername:'未关联提出人'}}</el-tag>
 											</el-form-item> 
										</el-col>
								</el-row>

								
								<el-form-item label="缺陷描述" prop="description">
									<el-tooltip content="点击切换为富文本编辑|普通文本">
										<el-button icon="el-icon-refresh" @click="descriptionEditorVisible=!descriptionEditorVisible" type="text"></el-button>
									</el-tooltip>
									<div v-if="descriptionEditorVisible==false">
										<el-input  style="width:100%;" v-model="addForm.description" type="textarea" :rows="6"> </el-input>
									</div>
									<div v-else>
										<vue-editor class="rich-context" :id="'description_'+addForm.id" :branch-id="userInfo.branchId" v-model="addForm.description"></vue-editor>
									</div>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="测试步骤" name="2">
								<el-form-item label="测试步骤" prop="opStep">
									<el-tooltip content="点击切换为富文本编辑|普通文本">
										<el-button icon="el-icon-refresh" @click="opStepEditorVisible=!opStepEditorVisible" type="text"></el-button>
									</el-tooltip>
									<div v-if="opStepEditorVisible==false">
										<el-input  style="width:100%;" v-model="addForm.opStep" type="textarea" :rows="6"> </el-input>
									</div>
									<div v-else>
										<vue-editor  :id="'opStep'+addForm.id" :branch-id="userInfo.branchId" v-model="addForm.opStep" ref="opStep"></vue-editor>
									</div>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="预期结果" name="3">
								<el-form-item label="预期结果" prop="expectResult">
									<el-tooltip content="点击切换为富文本编辑|普通文本">
										<el-button icon="el-icon-refresh" @click="expectResultEditorVisible=!expectResultEditorVisible" type="text"></el-button>
									</el-tooltip>
									<div v-if="expectResultEditorVisible==false">
										<el-input  style="width:100%;" v-model="addForm.expectResult" type="textarea" :rows="6"> </el-input>
									</div>
									<div v-else>
										<vue-editor v-if="expectResultEditorVisible==true" :id="'expectResult'+addForm.id" :branch-id="userInfo.branchId" v-model="addForm.expectResult"  ref="expectResult"></vue-editor>
									</div>
								</el-form-item>
							</el-tab-pane> 
						</el-tabs> 
			</el-form>
			<el-drawer title="选中用户" :visible.sync="selectUserVisible"  size="70%"  append-to-body   :close-on-click-modal="false">
				<xm-group-mng  :sel-project="filters.selProject" :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-mng>
			</el-drawer>

			<el-drawer title="选中任务" :visible.sync="selectTaskVisible" fullscreen  size="70%"  append-to-body   :close-on-click-modal="false">
				<xm-task-list  :sel-project="filters.selProject"   @task-selected="onSelectedTask"></xm-task-list>
			</el-drawer>

			<el-drawer append-to-body title="需求选择" :visible.sync="selectMenuVisible"   size="70%"   :close-on-click-modal="false">
				<xm-menu-select :is-select-menu="true" checkScope="0"  @selected="onSelectedMenu" :sel-project="filters.selProject"></xm-menu-select>
			</el-drawer> 
		</el-row>
		<el-row>
			<el-button @click.native="handleCancel">取消</el-button>
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">保存</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { addXmQuestion } from '@/api/xm/core/xmQuestion';
	import { mapGetters } from 'vuex';
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import {sn} from '@/common/js/sequence';
	import VueEditor from '@/components/Tinymce/index';

	import XmGroupMng from '../xmGroup/XmGroupSelect';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';


	import XmTaskList from '../xmTask/XmTaskList';

	export default {
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),
			calcBugStep(){
				if(this.dicts['bugStatus'] && this.addForm){
					var index=this.dicts['bugStatus'].findIndex(i=>{
						if(i.id==this.addForm.bugStatus){
							return true;
						}else{
							return false;
						}
					})
					return index+1;
				}else{
					return 0;
				}
				 
			}
		},
		props:['xmQuestion','visible',"selProject",'qtype','xmTestCaseExec','xmTestCase'],
		watch: {
	      'xmQuestion':function( xmQuestion ) {
		   this.addForm=Object.assign(this.addForm, this.xmQuestion);
		   this.addForm.qtype=this.qtype
	      },
	      'visible':function(visible) {
	      	if(visible==true){
				  //从新打开页面时某些数据需要重新加载，可以在这里添加
				   this.addForm.qtype=this.qtype
				   this.addForm.id=sn('bug_')
				   this.initByExec();

	      	}
		  },
		  selProject:function(selProject){
			  if(!selProject){
				  this.filters.selProject=null;
				  this.addForm.projectId=''
				  this.addForm.projectName=''
			  }else{
				  this.filters.selProject=selProject
				  this.addForm.projectId=selProject.id
				  this.addForm.projectName=selProject.name
			  }
		  }
	    },
		data() {
			return {
				filters:{
					selProject:null,
				},
				dicts:{
					priority:[],
					bugSeverity:[],
					bugSolution:[],
					bugStatus:[],
					bugType:[],
					bugRepRate:[],
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					name: [
						{required: true, message: '缺陷标题不可为空', trigger: 'blur' }
					],
					askUsername: [
						{required: true, message: '提出人不可为空', trigger: 'blur' }
					],
					handlerUsername: [
						{required: true, message: '请指派给一个人', trigger: 'blur' }
					],
				},
				//新增界面数据 xm_question
				addForm: {
					id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'3',solution:'',processTime:'',receiptMessage:'',receiptTime:'',description:'',createUserid:'',createUsername:'',createTime:'',status:'',bugSeverity:'3',
					qtype:'',
					attachment: [],
					repRate:'',
					verNum:'',
					bugReason:'',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				fileVisible: true,
				selectUserVisible: false,
				userFieldName:'',
				selectTaskVisible:false,
				selectMenuVisible:false,
				selectProjectVisible:false,
				opStepEditorVisible:false,
				expectResultEditorVisible:false,
				descriptionEditorVisible:false,
				xmProductVersions:[{id:"1.0.0" ,name:'1.0.0'}],

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.setDefaultData();
				this.$emit('cancel');
			},
			//新增提交XmQuestion xm_question 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					console.log(this.addForm.handlerUserid);
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);

							if(params.expectResult){
								params.expectResult=params.expectResult.replace(/<p>\n<br>\n<\p>/g,"");
								params.expectResult=params.expectResult.replace(/<p><br><\p>/g,"");
							}
							if(params.opStep){
								params.opStep=params.opStep.replace(/<p>\n<br>\n<\p>/g,"");
								params.opStep=params.opStep.replace("<p><br><\p>","");
							}
							if(params.description){
								params.description=params.description.replace(/<p>\n<br>\n<\p>/g,"");
								params.description=params.description.replace("<p><br><\p>","");
							}
							addXmQuestion(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit');//  @submit="afterAddSubmit"
									this.handleCancel();
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			//上传附件
			onChange : function(file,fileList){
				let list = [];
				if(fileList != null && fileList.length > 0){
					fileList.forEach( (item)=>{
						let fileOne = {
							id: item.id,
							name: item.name,
							addr: item.url,
							type: item.fileSuffix,
							remark: item.remark,
						}
						list.push(fileOne);
					} );
					this.addForm.attachment = list;
					console.log(list);
				}
			},

			setDefaultData() {
				this.addForm.id = sn('bug_');
				if(this.filters.selProject){

					this.addForm.projectId = this.filters.selProject.id;
					this.addForm.projectName = this.filters.selProject.name;
				}
				this.addForm.createUserid = this.userInfo.userid;
				this.addForm.createUsername = this.userInfo.username;
				this.addForm.askUserid = this.userInfo.userid;
				this.addForm.askUsername = this.userInfo.username;
				this.addForm.handlerUserid = this.userInfo.userid;
				this.addForm.handlerUsername = this.userInfo.username;
				this.addForm.endTime = this.formateDate(new Date().getTime() + 7*24*3600*1000);
				this.fileVisible = this.visible;
				console.log("set default data success");
			},
			formateDate(time) {
				const date = new Date(time);
				const m = date.getMonth()+1;
				const d = date.getDate();
				return date.getFullYear()+"-"+(m < 10 ? "0"+m : m)+"-"+ (d < 10 ? "0"+d : d) + " 00:00:00";
			},
			showGroupUsers:function(fieldName){
				this.userFieldName=fieldName;
				this.selectUserVisible=true;
			},
			onUserConfirm:function(groupUsers){
				if(groupUsers==null || groupUsers.length==0){
					if(this.userFieldName=='askUsername'){
						this.addForm.askUserid=''
						this.addForm.askUsername=''
					}else if(this.userFieldName=='handlerUsername'){
						this.addForm.handlerUserid=''
						this.addForm.handlerUsername='';
					}
				}else{
					var user=groupUsers[0]
					if(this.userFieldName=='askUsername'){
						this.addForm.askUserid=user.userid
						this.addForm.askUsername=user.username
					}else if(this.userFieldName=='handlerUsername'){
						this.addForm.handlerUserid=user.userid
						this.addForm.handlerUsername=user.username
					}
				}
				this.selectUserVisible=false
			},
			showSelectTask:function(){
				if(this.filters.selProject==null){
					this.$notify({showClose: true, message: "请先选项目", type: 'error' });
					return ;
				}
				this.selectTaskVisible=true;
			},
			onSelectedTask(task){
				this.addForm.taskId=task.id
				this.addForm.taskName=task.name
				this.selectTaskVisible=false;
				if(task.menuId){
					this.addForm.menuId=task.menuId
					this.addForm.menuName=task.menuName
					this.addForm.productId=task.productId
				}
				
				this.addForm.handlerUserid=task.executorUserid
				this.addForm.handlerUsername=task.executorUsername 
			},
			handleCloseTaskTag:function(){
				this.addForm.taskId=''
				this.addForm.taskName=""
			},
			showSelectMenu:function(){
				if(this.filters.selProject==null){
					this.$notify({showClose: true, message: "请先选项目", type: 'error' });
					this.$refs.xmProjectSelect.projectVisible=true;
					return ;
				}
				this.selectMenuVisible=true;
			},
			onSelectedMenu(menu){
				this.addForm.menuId=menu.menuId
				this.addForm.menuName=menu.menuName
				this.addForm.iterationId=menu.iterationId
				this.addForm.iterationName=menu.iterationName
				this.addForm.productId=menu.productId
				this.selectMenuVisible=false;
			},
			handleCloseMenuTag:function(){
				this.addForm.menuId=''
				this.addForm.menuName=""
			},
			sendToCreater(){
				this.addForm.handlerUsername=this.addForm.createUsername
				this.addForm.handlerUserid=this.addForm.createUserid
			},
			sendToAsk(){
				this.addForm.handlerUsername=this.addForm.askUsername
				this.addForm.handlerUserid=this.addForm.askUserid
			}, 
			onPorjectConfirm:function(project){
				this.filters.selProject=project
				this.addForm.projectId=project.id
				this.addForm.projectName=project.name
				this.selectProjectVisible=false;
			},
			clearProject(){
				this.filters.selProject=null
				this.addForm.projectId=''
				this.addForm.projectName=''
			},
			initByExec(){
				if(this.xmTestCaseExec){
					this.addForm.caseExecId=this.xmTestCaseExec.id
					this.addForm.caseName=this.xmTestCaseExec.caseName
					this.addForm.caseId=this.xmTestCaseExec.caseId
					this.addForm.opStep=this.xmTestCase.testStep
					this.addForm.expectResult=this.xmTestCase.expectResult
					this.addForm.menuId=this.xmTestCaseExec.menuId
					this.addForm.menuName=this.xmTestCaseExec.menuName
					this.addForm.taskId=this.xmTestCaseExec.taskId
					this.addForm.taskName=this.xmTestCaseExec.taskName
					this.addForm.name=this.xmTestCaseExec.caseName

				}
			}
			/**end 在上面加自定义方法**/

		},//end method
		components: {
				//在下面添加其它组件 'xm-question-edit':XmQuestionEdit
				'upload': AttachmentUpload,XmGroupMng,VueEditor,XmTaskList,xmMenuSelect,XmProjectSelect
		},
		mounted() {
			console.log("question_add");
			this.addForm=Object.assign(this.addForm, this.xmQuestion);
			if(!this.selProject){
				this.filters.selProject=null
			}else{
				this.filters.selProject=this.selProject
			}
			this.addForm.qtype=this.qtype
			this.setDefaultData();
			this.initByExec();
			initSimpleDicts('all',['bugSeverity','bugSolution','bugStatus','bugType','priority','bugRepRate']).then(res=>{
				if(res.data.tips.isOk){
					this.dicts['bugSeverity']=res.data.data.bugSeverity
					this.dicts['bugSolution']=res.data.data.bugSolution
					this.dicts['bugStatus']=res.data.data.bugStatus
					this.dicts['bugType']=res.data.data.bugType
					this.dicts['priority']=res.data.data.priority
					this.dicts['bugRepRate']=res.data.data.bugRepRate
				}
			});
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style lang="scss" scoped>

  .wf-main-context-box {
	border:1px dashed #000;
	margin-bottom: 10px;
	margin-top: 30px;
	padding:10px;
}
 .wf-main-context p {
	color: #585858;
}

.wf-main-context   p  > img {
	max-width: 100%;
}
</style>
