<template>
	<section class="page-container padding border">
		<el-row>
			<font class="font">{{editForm.name}}</font>
		</el-row>
		<el-row class="padding-bottom">
			<el-tooltip content="项目"><el-tag type="warning">{{selProject.name}} </el-tag></el-tooltip>
			<el-divider direction="vertical"></el-divider>
			<el-tag>{{editForm.createUsername}} 于 {{editForm.createTime}} 创建 </el-tag>
			<el-divider direction="vertical"></el-divider>
			<el-date-picker :clearable="false" style="width:150px;" type="date" placeholder="到期日期" v-model="editForm.endTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
		</el-row>
		<el-row class="padding-bottom">
			<el-steps :active="calcBugStep" simple finish-status="success">
				<el-step title="已激活,待确认" description="创建后自动激活、关闭后重新激活)"></el-step>
				<el-step title="已确认,待解决" description="业务确认缺陷后变为已确认"></el-step>
				<el-step title="已解决,待关闭" description="开发修复缺陷后，变成已解决"></el-step>
				<el-step title="已关闭(可重新激活)" description="测试通过后变为已关闭，已关闭缺陷可以重新激活"></el-step>
			</el-steps>
		</el-row>
		<el-row class="page-main page-height-70">
			<el-form :model="editForm"  :rules="editFormRules" ref="editForm">
					<el-form-item label="隶属任务\故事" prop="taskName">
							 <el-tooltip content="隶属任务"><el-tag  closable @click="showSelectTask" @close.stop="handleCloseTaskTag">{{editForm.taskName?editForm.taskName:'未关联任务'}}</el-tag> </el-tooltip>
							<el-divider direction="vertical"></el-divider>
							<el-tooltip content="隶属故事"><el-tag  closable @click="showSelectMenu" @close.stop="handleCloseMenuTag">{{editForm.menuName?editForm.menuName:"未关联故事"}}</el-tag></el-tooltip>
						</el-form-item>
					<el-form-item label="缺陷属性" prop="priority">
						<el-col :span="24">
						<el-select v-model="editForm.priority" placeholder="请选择紧急程度">
							<el-option v-for="(i,index) in options['urgencyLevel']" :label="i.optionName" :value="i.optionValue" :key="i.optionValue">{{i.optionName}}</el-option>
						</el-select>

						<el-select v-model="editForm.bugSeverity" placeholder="请选择严重程度">
							<el-option v-for="(i,index) in options['bugSeverity']" :label="i.optionName" :value="i.optionValue" :key="i.optionValue">{{i.optionName}}</el-option>
						</el-select>

						<el-select v-model="editForm.solution" placeholder="请选择解决方案">
							<el-option v-for="(i,index) in options['bugSolution']" :label="i.optionName" :value="i.optionValue" :key="i.optionValue">{{i.optionName}}</el-option>
						</el-select>
						</el-col>
					</el-form-item>
					<el-form-item label="指派给" prop="handlerUsername">
						{{editForm.handlerUsername}}   <el-button @click="sendToCreater">指派给创建人</el-button><el-button @click="showGroupUsers('handlerUsername')">选其它人</el-button>
					</el-form-item>
				<el-form-item label="测试步骤" prop="opStep">
					<el-col :span="24" v-if="editForm.expectResult">
						<div class="wf-main-context-box" v-if="editForm.opStep">
							<div    class="wf-main-context"  v-html="editForm.opStep"></div>
						</div>
					</el-col>
					<font v-else>无</font>
				</el-form-item>
				<el-form-item label="预期结果" prop="expectResult">
					<el-col :span="24" v-if="editForm.expectResult">
						<div class="wf-main-context-box" >
							<div     class="wf-main-context" v-html="editForm.expectResult"></div>
						</div>

					</el-col>
					<font v-else>无</font>
				</el-form-item>
				<el-form-item label="流转信息">
						<el-button icon="el-icon-search" v-if="flowInfoVisible==false" @click="showFlowInfo" >查询流转信息</el-button>
						<el-button icon="el-icon-search" v-else @click="flowInfoVisible=false" >隐藏流转信息</el-button>

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
				</el-form-item>
				<el-form-item label="缺陷描述" prop="description">
					<el-col v-if="editForm.description" :span="24" >
					<div class="wf-main-context-box" >
						<div  class="wf-main-context" v-html="editForm.description"></div>
					</div>
					</el-col>
					<font v-else>无</font>
				</el-form-item>
				<el-form-item label="上次处理意见" prop="lremark">
					<el-col v-if="editForm.lremark" :span="24" >
					<div class="wf-main-context-box"  >
						<div   class="wf-main-context" v-html="editForm.lremark"></div>
					</div>
					</el-col>
					<font v-else>无</font>

				</el-form-item>
				<el-form-item label="处理意见" prop="receiptMessage">

					<el-tooltip content="点击切换为富文本编辑|普通文本">
						<el-button icon="el-icon-refresh" @click="receiptMessageEditorVisible=!receiptMessageEditorVisible" type="text"></el-button>
					</el-tooltip>
					<div v-if="receiptMessageEditorVisible==false">
						<el-input  style="width:100%;" v-model="editForm.receiptMessage" type="textarea" :rows="2"> </el-input>
					</div>
					<div v-else>
						<vue-editor :id="'receiptMessage_'+editForm.id" :branch-id="userInfo.branchId" v-model="editForm.receiptMessage"></vue-editor>

					</div>
				</el-form-item>
			</el-form>
			<el-drawer title="选中用户" :visible.sync="selectUserVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
				<xm-group-mng  :sel-project="selProject" :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-mng>
			</el-drawer>
			<el-drawer title="选中任务" :visible.sync="selectTaskVisible"  size="80%" fullscreen  append-to-body   :close-on-click-modal="false">
				<xm-task-list  :sel-project="selProject"   @task-selected="onSelectedTask"></xm-task-list>
			</el-drawer>

			<el-drawer append-to-body title="故事选择" :visible.sync="selectMenuVisible"   fullscreen   :close-on-click-modal="false">
				<xm-menu-select :is-select-menu="true"  @selected="onSelectedMenu" :sel-project="selProject"></xm-menu-select>
			</el-drawer>
		</el-row>
		<el-row class="padding">
				<el-button @click.native="handleCancel">取消</el-button>
				<el-button v-if="editForm.bugStatus !='closed'" v-loading="load.edit" type="primary" @click.native="handleQuestion(editForm.bugStatus)" :disabled="load.edit==true">暂存</el-button>
				<el-button v-if="editForm.bugStatus=='active'" v-loading="load.edit" type="primary" @click.native="handleQuestion('confirmed')" :disabled="load.edit==true">确认</el-button>
				<el-button v-if="editForm.bugStatus=='active'" v-loading="load.edit" type="primary" @click.native="handleQuestion('active')" :disabled="load.edit==true">不是缺陷</el-button>
				<el-button v-if="editForm.bugStatus=='active'" v-loading="load.edit" type="primary" @click.native="handleQuestion('resolved')" :disabled="load.edit==true">直接解决</el-button>
				<el-button v-if="editForm.bugStatus=='active'" v-loading="load.edit" type="primary" @click.native="handleQuestion('closed')" :disabled="load.edit==true">直接关闭</el-button>
				<el-button v-if="editForm.bugStatus=='confirmed'" v-loading="load.edit" type="primary" @click.native="handleQuestion('resolved')" :disabled="load.edit==true">解决</el-button>
				<el-button v-if="editForm.bugStatus=='confirmed'" v-loading="load.edit" type="primary" @click.native="handleQuestion('closed')" :disabled="load.edit==true">关闭</el-button>
				<el-button v-if="editForm.bugStatus=='resolved'" v-loading="load.edit" type="primary" @click.native="handleQuestion('closed')" :disabled="load.edit==true">关闭</el-button>
				<el-button v-if="editForm.bugStatus=='resolved'" v-loading="load.edit" type="primary" @click.native="handleQuestion('active')" :disabled="load.edit==true">重新激活</el-button>
				<el-button v-if="editForm.bugStatus=='closed'" v-loading="load.edit" type="primary" @click.native="handleQuestion('active')" :disabled="load.edit==true">重新激活</el-button>
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
	import VueEditor from '@/components/Tinymce/index';
	import XmTaskList from '../xmTask/XmTaskList';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';

	export default {
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),

			calcBugStep(){
				if(this.editForm.bugStatus=='active'){
					return 1
				}else if(this.editForm.bugStatus=='confirmed'){
					return 2
				}else if(this.editForm.bugStatus=='resolved'){
					return 3
				}else if(this.editForm.bugStatus=='closed'){
					return 4
				}else{
					return 1;
				}
			}
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
				receiptMessageEditorVisible:false,
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

							if(params.expectResult){
								params.expectResult=params.expectResult.replace(/<p>\n<br>\n<\p>/g,"");
								params.expectResult=params.expectResult.replace(/<p><br><\/p>/g,"");
							}
							if(params.opStep){
								params.opStep=params.opStep.replace(/<p>\n<br>\n<\/p>/g,"");
								params.opStep=params.opStep.replace(/<p><br><\/p>/g,"");
							}
							if(params.description){
								params.description=params.description.replace(/<p>\n<br>\n<\/p>/g,"");
								params.description=params.description.replace(/<p><br><\/p>/g,"");
							}
							editXmQuestion(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit');//  @submit="afterAddSubmit"
									this.handleCancel();
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
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
						this.$message({showClose: true,message:"只有测试经理、测试组长、测试员可以关闭bug",type:"error"});
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
					this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.list=false);
			},
			showSelectTask:function(){
				if(this.selProject==null){
					this.$message({showClose: true, message: "请先选项目", type: 'error' });
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
					this.$message({showClose: true, message: "请先选项目", type: 'error' });
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

<style lang="scss" scoped>
  .wf-main-context-box {
	border:1px dashed #000;
	padding:10px;
}
 .wf-main-context p {
	color: #585858;
	display: block;
    margin-block-start: 0em !important;
    margin-block-end: 0em !important;
    margin-inline-start: 0px !important;
    margin-inline-end: 0px !important;
}

.wf-main-context   p  > img {
	max-width: 100%;
}
</style>
