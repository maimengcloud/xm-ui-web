<template>
	<section>
		<el-row class="xm-question">
			<!--新增界面 XmQuestion xm_question--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="隶属项目" prop="projectName">
							<el-tag :closable="!selProject" @close="clearProject">{{this.filters.selProject?this.filters.selProject.name:'未选项目'}}</el-tag><el-button v-if="!selProject" @click="showProjectList" type="plian">选项目</el-button> 
						</el-form-item>
						<el-form-item label="隶属任务" prop="taskName">
							<el-tag v-if="addForm.taskId!='' && addForm.taskId!=null " closable @close="handleCloseTaskTag">{{addForm.taskName}}</el-tag><el-button @click="showSelectTask">选任务</el-button>
						</el-form-item>
						<el-form-item label="隶属故事" prop="menuName">
							<el-tag v-if="addForm.menuId!='' && addForm.menuId!=null " closable @close="handleCloseMenuTag">{{addForm.menuName}}</el-tag><el-button @click="showSelectMenu">选故事</el-button>
						</el-form-item>   
						<el-form-item label="问题标题" prop="name">
							<el-input v-model="addForm.name" placeholder="问题标题" ></el-input>
						</el-form-item>  
						<el-form-item label="优先级别" prop="priority">
							<el-radio-group v-model="addForm.priority">
								<el-radio v-for="(i,index) in options['urgencyLevel']" :label="i.optionValue" :key="index">{{i.optionName}}</el-radio> 
							</el-radio-group> 
						</el-form-item> 
						<el-form-item label="严重程度" prop="bugSeverity">
							<el-radio-group v-model="addForm.bugSeverity">
								<el-radio v-for="(i,index) in options['bugSeverity']" :label="i.optionValue" :key="index">{{i.optionName}}</el-radio> 
							</el-radio-group>  
						</el-form-item> 
						<!--
						<el-form-item label="解决方案" prop="solution">
							<el-radio-group v-model="addForm.solution">
								<el-radio v-for="(i,index) in options['bugSolution']" :label="i.optionValue" :key="index">{{i.optionName}}</el-radio> 
							</el-radio-group>   
						</el-form-item> 
						-->
						<el-form-item label="到期时间" prop="endTime">
							<el-date-picker :clearable="false" style="width:100%;" type="date" placeholder="选择日期" v-model="addForm.endTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
						</el-form-item> 
						<el-form-item label="提出人" prop="askUsername">
							{{addForm.askUsername}} <el-button @click="showGroupUsers('askUsername')">选提出人</el-button>
						</el-form-item> 
						<el-form-item label="指派给" prop="handlerUsername">
							{{addForm.handlerUsername}} <el-button @click="sendToAsk">指派给提出人</el-button><el-button @click="sendToCreater">指派给创建人</el-button><el-button @click="showGroupUsers('handlerUsername')">选其它人</el-button>
						</el-form-item>  
					</el-col>
					<el-col :span="12">
											
						<el-form-item>
							<el-col :span="24">测试步骤</el-col>
							<el-col :span="24">
									<vue-editor :id="'opStep'+addForm.id" :branch-id="userInfo.branchId" v-model="addForm.opStep" ref="opStep"></vue-editor>  
							</el-col>
							<el-col :span="24"  >预期结果</el-col>

							<el-col :span="24"  >  
									<vue-editor :id="'expectResult'+addForm.id" :branch-id="userInfo.branchId" v-model="addForm.expectResult"  ref="expectResult"></vue-editor>  
							</el-col> 
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="问题描述" prop="description"> 
        			<vue-editor :id="'description_'+addForm.id" :branch-id="userInfo.branchId" v-model="addForm.description"></vue-editor>
				</el-form-item>   
				<el-form-item class="add-btns">
					<el-col style="text-align:center;" :span="24"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">保存</el-button> 
					</el-col>
				</el-form-item> 
			</el-form>
			<el-dialog title="选中用户" :visible.sync="selectUserVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-group-mng  :sel-project="filters.selProject" :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-mng>
			</el-dialog> 
			
			<el-dialog title="选中任务" :visible.sync="selectTaskVisible" fullscreen  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-task-list  :sel-project="filters.selProject"   @task-selected="onSelectedTask"></xm-task-list>
			</el-dialog> 	
			
			<el-dialog append-to-body title="故事选择" :visible.sync="selectMenuVisible" width="80%" fullscreen   :close-on-click-modal="false">
				<xm-menu-select :is-select-menu="true"  @selected="onSelectedMenu" :sel-project="filters.selProject"></xm-menu-select>
			</el-dialog>
			
			<el-dialog title="选中项目" :visible.sync="selectProjectVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-project-list    @project-confirm="onPorjectConfirm"></xm-project-list>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addXmQuestion } from '@/api/xm/core/xmQuestion';
	import { mapGetters } from 'vuex';
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import {sn} from '@/common/js/sequence';
	import VueEditor from '@/components/VueEditor';

	import XmGroupMng from '../xmProjectGroup/XmProjectGroupMng';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';	
	import XmProjectList from '../xmProject/XmProjectList';

	
	import XmTaskList from '../xmTask/XmTaskList';

	export default { 
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),  
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
				options:{ 
					urgencyLevel:[],
					bugSeverity:[],
					bugSolution:[],
					bugStatus:[],
					bugType:[],
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					name: [
						{required: true, message: '问题标题不可为空', trigger: 'blur' }
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
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/ 
				fileVisible: true, 
				selectUserVisible: false,
				userFieldName:'',
				selectTaskVisible:false,
				selectMenuVisible:false,
				selectProjectVisible:false,
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
							addXmQuestion(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit');//  @submit="afterAddSubmit"
									this.handleCancel();
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
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
					this.$message({ message: "请先选项目", type: 'error' }); 
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
				}
			},
			handleCloseTaskTag:function(){
				this.addForm.taskId=''
				this.addForm.taskName=""
			},
			showSelectMenu:function(){
				if(this.filters.selProject==null){
					this.$message({ message: "请先选项目", type: 'error' }); 
					return ;
				}
				this.selectMenuVisible=true;
			},
			onSelectedMenu(menu){
				this.addForm.menuId=menu.menuId
				this.addForm.menuName=menu.menuName
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
			showProjectList:function(){
				this.selectProjectVisible=true;
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
				'upload': AttachmentUpload,XmGroupMng,VueEditor,XmTaskList,xmMenuSelect,XmProjectList
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
			listOption([{categoryId:'all',itemCode:'bugSeverity'},{categoryId:'all',itemCode:'bugSolution'},{categoryId:'all',itemCode:'bugStatus'},{categoryId:'all',itemCode:'bugType'},{categoryId:'all',itemCode:'urgencyLevel'}] ).then(res=>{
				if(res.data.tips.isOk){ 
					this.options['bugSeverity']=res.data.data.bugSeverity
					this.options['bugSolution']=res.data.data.bugSolution
					this.options['bugStatus']=res.data.data.bugStatus
					this.options['bugType']=res.data.data.bugType
					this.options['urgencyLevel']=res.data.data.urgencyLevel
				}
			});
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
.xm-question{
	padding: 10px;
}
.el-form-item{
	margin-bottom: 15px;
}
.el-form-item__content{
	margin-left: 0;
}
.el-form-item__content{
	margin-left: 0;
}
.add-btns >>> .el-form-item__content{
	margin-left: 0 !important;
}
</style>