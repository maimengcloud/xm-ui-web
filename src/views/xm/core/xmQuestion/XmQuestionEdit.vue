<template>
	<section>
		<el-row class="xm-question">
			<!--新增界面 XmQuestion xm_question--> 
			<el-row>
				
					<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
						<el-col :span="12"> 
								<el-form-item label="问题标题" prop="name">
									{{editForm.name}} 
								</el-form-item>  
								<el-form-item label="隶属项目" prop="projectName">
									{{selProject.name}}
								</el-form-item> 
								<el-form-item label="隶属任务" prop="taskName">
									<el-tag v-if="editForm.taskId!='' && editForm.taskId!=null " closable @close="handleCloseTaskTag">{{editForm.taskName}}</el-tag><el-button @click="showSelectTask">选任务</el-button>
								</el-form-item>   
								<el-form-item label="隶属故事" prop="menuName">
									<el-tag v-if="editForm.menuId!='' && editForm.menuId!=null " closable @close="handleCloseMenuTag">{{editForm.menuName}}</el-tag><el-button @click="showSelectMenu">选故事</el-button>
								</el-form-item>   
								<el-form-item label="优先级别" prop="priority">
									<el-radio-group v-model="editForm.priority">
										<el-radio v-for="(i,index) in options['urgencyLevel']" :label="i.optionValue" :key="index">{{i.optionName}}</el-radio> 
									</el-radio-group> 
								</el-form-item> 
								<el-form-item label="严重程度" prop="bugSeverity">
									<el-radio-group v-model="editForm.bugSeverity">
										<el-radio v-for="(i,index) in options['bugSeverity']" :label="i.optionValue" :key="index">{{i.optionName}}</el-radio> 
									</el-radio-group>  
								</el-form-item> 
								<el-form-item label="解决方案" prop="solution">
									<el-radio-group v-model="editForm.solution">
										<el-radio v-for="(i,index) in options['bugSolution']" :label="i.optionValue" :key="index">{{i.optionName}}</el-radio> 
									</el-radio-group>   
								</el-form-item> 
								<el-form-item label="到期时间" prop="endTime">
									<el-date-picker :clearable="false" style="width:100%;" type="date" placeholder="选择日期" v-model="editForm.endTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
								</el-form-item> 
								<el-form-item label="提出人" prop="askUsername">
									提出： {{editForm.askUsername}}  创建人：	{{editForm.createUsername}}  创建时间：{{editForm.createTime}}
								</el-form-item> 
								<el-form-item label="指派给" prop="handlerUsername">
									{{editForm.handlerUsername}}  <el-button @click="sendToAsk">指派给提出人</el-button><el-button @click="sendToCreater">指派给创建人</el-button><el-button @click="showGroupUsers('handlerUsername')">选其它人</el-button>
								</el-form-item> 
						</el-col>	
						<el-col :span="12">
							<el-row class="app-container">
								<el-col :span="24" class="label-font">测试步骤</el-col>
								<el-col :span="24" >
									<div class="wf-main-context-box" v-if="editForm.opStep">
										<div style="padding:10px;"  class="wf-main-context"  v-html="editForm.opStep"></div> 
									</div>
									<font v-else>无</font>
								</el-col>
							</el-row>
							<el-row class="app-container">
								<el-col :span="24"  class="label-font" >预期结果</el-col> 
								<el-col :span="24" >  
									<div class="wf-main-context-box" v-if="editForm.expectResult">
										<div  style="padding:10px;"  class="wf-main-context" v-html="editForm.expectResult"></div> 
									</div>
									<font v-else>无</font>
								</el-col> 
							</el-row>
							<el-row class="app-container">
								<el-col :span="24"  class="label-font">流转信息 
									<el-button icon="el-icon-search" v-if="flowInfoVisible==false" @click="showFlowInfo" >查询流转信息</el-button>
									<el-button icon="el-icon-search" v-else @click="flowInfoVisible=false" >隐藏流转信息</el-button>
								</el-col> 
								<el-col :span="24" style="padding-top:12px;">  
								<!--列表 XmQuestionHandle xm_question_handle--> 
									
									<el-table v-show="flowInfoVisible" max-height="300" :data="xmQuestionHandles"   highlight-current-row v-loading="load.list" border   style="width: 100%;">
										<el-table-column sortable type="index" width="40"></el-table-column>  
										<el-table-column  label="处理意见"  prop="receiptMessage"  min-width="200" >
											<template slot-scope="scope">
												<div v-html="scope.row.receiptMessage"></div>
											</template>
										</el-table-column> 
										<el-table-column prop="handlerUsername" label="指派动作" width="250"  >
											<template slot-scope="scope">
												<el-tag>{{scope.row.handlerUsername}}</el-tag> 指派给 <el-tag> {{scope.row.targetUsername}}  </el-tag><br><span style="font-size:8px;">{{scope.row.receiptTime}}</span>
											</template>
										</el-table-column>				
										<el-table-column prop="handleStatus" label="状态"  width="80"   :formatter="formatterOption"></el-table-column>  
										<el-table-column prop="handleSolution" label="解决方案"  width="100"   :formatter="formatterOption"></el-table-column>

									</el-table> 
								</el-col>
							</el-row> 
						</el-col>
						<el-col :span="24">
							<el-form-item label="问题描述" prop="description">
								<div class="wf-main-context-box" v-if="editForm.description">
									<div style="padding:10px;" class="wf-main-context" v-html="editForm.description"></div>
								</div>
								<font v-else>无</font>
							</el-form-item> 
						</el-col>
						
						<el-col :span="24">
							<el-form-item label="上次处理意见" prop="lremark">
								<div class="wf-main-context-box"  v-if="editForm.lremark">
									<div style="padding:10px;"  class="wf-main-context" v-html="editForm.lremark"></div>
								</div>
								<font v-else>无</font>
								
							</el-form-item> 
						</el-col>
						<el-col :span="24"> 
							<el-form-item label="处理意见" prop="description">
								<vue-editor :id="'description_'+editForm.id" :branch-id="userInfo.branchId" v-model="editForm.receiptMessage"></vue-editor>
							</el-form-item>  
						</el-col>		  
					</el-form>  
			</el-row>
			
			
			
			<el-row class="app-container">
				<el-col style="text-align:center;" :span="24"> 
					<el-button @click.native="handleCancel">取消</el-button>  
					<el-button v-if="editForm.bugStatus !='closed'" v-loading="load.edit" type="primary" @click.native="handleQuestion(editForm.bugStatus)" :disabled="load.edit==true">暂存</el-button>
					<el-button v-if="editForm.bugStatus=='active'" v-loading="load.edit" type="primary" @click.native="handleQuestion('confirmed')" :disabled="load.edit==true">确认</el-button>  
					<el-button v-if="editForm.bugStatus=='active'" v-loading="load.edit" type="primary" @click.native="handleQuestion('active')" :disabled="load.edit==true">不是问题</el-button>  
					<el-button v-if="editForm.bugStatus=='active'" v-loading="load.edit" type="primary" @click.native="handleQuestion('resolved')" :disabled="load.edit==true">直接解决</el-button>  
					<el-button v-if="editForm.bugStatus=='active'" v-loading="load.edit" type="primary" @click.native="handleQuestion('closed')" :disabled="load.edit==true">直接关闭</el-button>  
					<el-button v-if="editForm.bugStatus=='confirmed'" v-loading="load.edit" type="primary" @click.native="handleQuestion('resolved')" :disabled="load.edit==true">解决</el-button> 
					<el-button v-if="editForm.bugStatus=='confirmed'" v-loading="load.edit" type="primary" @click.native="handleQuestion('closed')" :disabled="load.edit==true">关闭</el-button>  
					<el-button v-if="editForm.bugStatus=='resolved'" v-loading="load.edit" type="primary" @click.native="handleQuestion('closed')" :disabled="load.edit==true">关闭</el-button>    
					<el-button v-if="editForm.bugStatus=='resolved'" v-loading="load.edit" type="primary" @click.native="handleQuestion('active')" :disabled="load.edit==true">重新激活</el-button>   
					<el-button v-if="editForm.bugStatus=='closed'" v-loading="load.edit" type="primary" @click.native="handleQuestion('active')" :disabled="load.edit==true">重新激活</el-button>    
				</el-col>
			</el-row> 
			<el-dialog title="选中用户" :visible.sync="selectUserVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-group-mng  :sel-project="selProject" :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-mng>
			</el-dialog> 
			<el-dialog title="选中任务" :visible.sync="selectTaskVisible"  width="80%" fullscreen  append-to-body   :close-on-click-modal="false">
				<xm-task-list  :sel-project="selProject"   @task-selected="onSelectedTask"></xm-task-list>
			</el-dialog> 	
			
			<el-dialog append-to-body title="故事选择" :visible.sync="selectMenuVisible"   fullscreen   :close-on-click-modal="false">
				<xm-menu-select :is-select-menu="true"  @selected="onSelectedMenu" :sel-project="selProject"></xm-menu-select>
			</el-dialog>			
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { editXmQuestion } from '@/api/xm/core/xmQuestion'; 
	import { listXmQuestionHandle } from '@/api/xm/core/xmQuestionHandle';
	import { mapGetters } from 'vuex';
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import {sn} from '@/common/js/sequence';

	import XmGroupMng from '../xmProjectGroup/XmProjectGroupMng';
	import VueEditor from '@/components/VueEditor';
	import XmTaskList from '../xmTask/XmTaskList';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';	

	export default { 
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),  
		},
		props:['xmQuestion','visible',"selProject"],
		watch: {
	      'xmQuestion':function( xmQuestion ) {
	        this.editForm = xmQuestion;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
				  //this.getXmQuestionHandle();
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}else{
			  this.flowInfoVisible=false;
			}
	      } 
	    },
		data() {
			return {
				options:{ 
					urgencyLevel:[],
					bugSeverity:[],
					bugSolution:[],
					bugStatus:[],
					bugType:[],
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
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
				editForm: {
					id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',processTime:'',receiptMessage:'',receiptTime:'',description:'',createUserid:'',createUsername:'',createTime:'',status:'',receiptMessage:'',
					attachment: [],
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/ 
				fileVisible: true, 
				selectUserVisible: false,
				userFieldName:'',
				xmQuestionHandles:[],
				selectTaskVisible:false,
				flowInfoVisible:false,
				selectMenuVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){  
				this.$emit('cancel');
			},
			//新增提交XmQuestion xm_question 父组件监听@submit="afterAddSubmit"
			editSubmit: function (tardgetBugStatus) {
				this.$refs.editForm.validate((valid) => {
					console.log(this.editForm.handlerUserid);
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {  
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							params.tardgetBugStatus=tardgetBugStatus;
							editXmQuestion(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit');//  @submit="afterAddSubmit"
									this.handleCancel();
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
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
					this.editForm.attachment = list;
					console.log(list);
				}
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
						this.editForm.askUserid=''
						this.editForm.askUsername=''
					}else if(this.userFieldName=='handlerUsername'){
						this.editForm.handlerUserid=''
						this.editForm.handlerUsername='';
					}
				}else{
					var user=groupUsers[0]
					if(this.userFieldName=='askUsername'){
						this.editForm.askUserid=user.userid
						this.editForm.askUsername=user.username
					}else if(this.userFieldName=='handlerUsername'){
						this.editForm.handlerUserid=user.userid
						this.editForm.handlerUsername=user.username
					}
				} 
				this.selectUserVisible=false
			}, 
			handleQuestion:function(tardgetBugStatus){
				var oldBugStatus=this.editForm.bugStatus;  
				if(tardgetBugStatus=="closed"){ 
					if( !this.roles.some(i=>i.roleid=='testAdmin') && !this.roles.some(i=>i.roleid=='tester') && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
						this.$message({message:"只有测试经理、测试组长、测试员可以关闭bug",type:"error"});
						return ;
					}
				}
				//解决了直接转会创建人
				if(tardgetBugStatus=='resolved'){
					this.editForm.handlerUserid=this.editForm.createUserid
					this.editForm.handlerUsername=this.editForm.createUsername;
				}
				this.editSubmit(tardgetBugStatus);
			},
			formatterOption: function(row,column,cellValue, index){ 
				var columnName=column.property;
				var key="";
				if(columnName=='handleStatus'){
					key="bugStatus"
				}else if(columnName=='bugType'){
					key="bugType"
				}else if(columnName=='handleSolution'){
					key="bugSolution"
				}else if(columnName=='bugSeverity'){
					key="bugSeverity"
				}else if(columnName=='priority'){
					key="urgencyLevel"
				}else{
					return cellValue
				}
				if(this.options[key]==undefined || this.options[key]==null || this.options[key].length==0   ){
					return cellValue;
				}
				var list=this.options[key].filter(i=>i.optionValue==cellValue)
				if(list.length>0){
					return list[0].optionName
				}else{
					return cellValue;
				}

			},
			getXmQuestionHandle:function(){
				var params={
					questionId:this.editForm.id 
				}
				this.load.list=true
				listXmQuestionHandle(params).then(res=>{
					this.load.list=false
					var tips = res.data.tips;
					if(tips.isOk){
						this.xmQuestionHandles=res.data.data;
					}
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });  
				}).catch( err  => this.load.list=false);
			},
			showSelectTask:function(){
				if(this.selProject==null){
					this.$message({ message: "请先选项目", type: 'error' }); 
					return ;
				}
				this.selectTaskVisible=true;
			},
			onSelectedTask(task){
				this.editForm.taskId=task.id
				this.editForm.taskName=task.name 
				this.selectTaskVisible=false;
			},
			handleCloseTaskTag:function(){
				this.editForm.taskId=''
				this.editForm.taskName=""
			},
			sendToCreater(){
				this.editForm.handlerUsername=this.editForm.createUsername
				this.editForm.handlerUserid=this.editForm.createUserid
			},
			sendToAsk(){

				this.editForm.handlerUsername=this.editForm.askUsername
				this.editForm.handlerUserid=this.editForm.askUserid
			},
			showFlowInfo:function(){
				this.flowInfoVisible=true;
				this.getXmQuestionHandle();
			},
			/**end 在上面加自定义方法**/
			
			showSelectMenu:function(){
				if(this.selProject==null){
					this.$message({ message: "请先选项目", type: 'error' }); 
					return ;
				}
				this.selectMenuVisible=true;
			},
			onSelectedMenu(menu){
				this.editForm.menuId=menu.menuId
				this.editForm.menuName=menu.menuName
				this.selectMenuVisible=false;
			},
			handleCloseMenuTag:function(){
				this.editForm.menuId=''
				this.editForm.menuName=""
			}, 
		},//end method
		components: {  
				//在下面添加其它组件 'xm-question-edit':XmQuestionEdit
				'upload': AttachmentUpload,XmGroupMng,VueEditor,XmTaskList,xmMenuSelect
		},
		mounted() {
			console.log("question_add");
			this.editForm=Object.assign(this.editForm, this.xmQuestion); 
			listOption([{categoryId:'all',itemCode:'bugSeverity'},{categoryId:'all',itemCode:'bugSolution'},{categoryId:'all',itemCode:'bugStatus'},{categoryId:'all',itemCode:'bugType'},{categoryId:'all',itemCode:'urgencyLevel'}] ).then(res=>{
				if(res.data.tips.isOk){ 
					this.options['bugSeverity']=res.data.data.bugSeverity
					this.options['bugSolution']=res.data.data.bugSolution
					this.options['bugStatus']=res.data.data.bugStatus
					this.options['bugType']=res.data.data.bugType
					this.options['urgencyLevel']=res.data.data.urgencyLevel
				}
			});
			//this.getXmQuestionHandle();
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
.label-font{
	font-weight: 700;
	font-size: 14px;
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
</style>