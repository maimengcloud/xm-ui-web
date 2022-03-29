<template>
	<section>  
		<el-row class="page-main ">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm"> 
			  	<el-form-item label="缺陷标题" prop="name">
					 <el-input   v-model="editForm.name"></el-input>
					 	<el-tag>{{editForm.createUsername}} 于 {{editForm.createTime}} 创建 </el-tag>
						<el-divider direction="vertical"></el-divider>
						<el-tag v-if="editForm.tagNames">{{editForm.tagNames?editForm.tagNames:''}} </el-tag>
						<el-button type="text" icon="el-icon-plus" @click="tagSelectVisible=true">标签</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" icon="el-icon-search" @click="flowInfoVisible=true">日志</el-button>  
				</el-form-item> 
						<el-row>
							<el-col :span="8">
								<el-form-item label="归属项目" prop="projectId">
									 {{editForm.projectId}}
								</el-form-item>
							</el-col>
							<el-col  :span="8">
								<el-form-item label="隶属需求" prop="menuId"> 
									<el-tag title="隶属需求" closable @click="showSelectMenu" @close.stop="handleCloseMenuTag">
									<div class="icon" :style="{backgroundColor:   'rgb(79, 140, 255)' }">
										<i :class="  'el-icon-document'  " ></i>
									</div> {{editForm.menuName?editForm.menuName:"未关联需求"}}</el-tag> 
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="负责人" prop="handlerUsername">
									{{editForm.handlerUsername}}  <el-button type="text"  @click="sendToCreater">指派给创建人</el-button><el-button type="text"  @click="showGroupUsers('handlerUsername')">其它人</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8">
								<el-form-item label="严重程度" prop="bugSeverity">
								<el-select v-model="editForm.bugSeverity" placeholder="请选择严重程度">
									<el-option v-for="(i,index) in dicts['bugSeverity']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
								</el-select> 
								</el-form-item>
							</el-col> 
							<el-col :span="8">
								<el-form-item label="优先级别" prop="priority">
									<el-select v-model="editForm.priority" placeholder="请选择优先级">
										<el-option v-for="(i,index) in dicts['priority']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
									</el-select> 
								</el-form-item> 
							</el-col>
							<el-col :span="8">
								<el-form-item label="结束时间" prop="endTime">
										<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="editForm.endTime"></el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-tabs value="1">
							<el-tab-pane name="1" label="基本信息">
								<el-row> 
									
										<el-col :span="8">
											<el-form-item label="提出人" prop="askUsername">
												<el-tag @click="showGroupUsers('askUsername')">{{editForm.askUsername?editForm.askUsername:'未关联提出人'}}</el-tag> 
											</el-form-item> 
										</el-col>
										<el-col :span="8">
											<el-form-item label="复现频率" prop="repRate">
												<el-select v-model="editForm.repRate" placeholder="请选择复现频率">
													<el-option v-for="(i,index) in dicts['bugRepRate']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
												</el-select> 
											</el-form-item>
											
										</el-col> 
										<el-col :span="8">
											<el-form-item label="复现版本" prop="verNum">
												<el-select v-model="editForm.verNum" placeholder="请选择版本">
													<el-option v-for="(i,index) in xmProductVersions" :label="i.name" :value="i.id" :key="index">{{i.id}}</el-option>
												</el-select> 
											</el-form-item>
										</el-col>  
								</el-row>
								<el-row>
									
								<el-col :span="8">
									<el-form-item label="原因分析" prop="bugReason">
										<el-select v-model="editForm.bugReason" placeholder="请选择原因">
											<el-option v-for="(i,index) in dicts['bugReason']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
										</el-select> 
									</el-form-item>
								</el-col>
								
								<el-col :span="6">
									<el-form-item label="解决方案" prop="solution">
										<el-select v-model="editForm.solution" placeholder="请选择解决方案">
											<el-option v-for="(i,index) in dicts['bugSolution']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
										</el-select> 
									</el-form-item>
								</el-col> 
								<el-col :span="6">
											<el-form-item label="缺陷类别" prop="bugType">
												<el-select v-model="editForm.bugType" placeholder="请选择缺陷类别">
													<el-option v-for="(i,index) in dicts['bugType']" :label="i.name" :value="i.id" :key="index">{{i.name}}</el-option>
												</el-select> 
											</el-form-item>
											
										</el-col> 
								</el-row>

								
								<el-form-item label="缺陷描述" prop="description">
									<el-tooltip content="点击切换为富文本编辑|普通文本">
										<el-button icon="el-icon-refresh" @click="descriptionEditorVisible=!descriptionEditorVisible" type="text"></el-button>
									</el-tooltip>
									<div v-if="descriptionEditorVisible==false">
										<el-input  style="width:100%;" v-model="editForm.description" type="textarea" :rows="6"> </el-input>
									</div>
									<div v-else>
										<vue-editor class="rich-context" :id="'description_'+editForm.id" :branch-id="userInfo.branchId" v-model="editForm.description"></vue-editor>
									</div>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="测试步骤" name="2">
								<el-form-item label="测试步骤" prop="opStep">
									<el-tooltip content="点击切换为富文本编辑|普通文本">
										<el-button icon="el-icon-refresh" @click="opStepEditorVisible=!opStepEditorVisible" type="text"></el-button>
									</el-tooltip>
									<div v-if="opStepEditorVisible==false">
										<el-input  style="width:100%;" v-model="editForm.opStep" type="textarea" :rows="6"> </el-input>
									</div>
									<div v-else>
										<vue-editor  :id="'opStep'+editForm.id" :branch-id="userInfo.branchId" v-model="editForm.opStep" ref="opStep"></vue-editor>
									</div>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="预期结果" name="3">
								<el-form-item label="预期结果" prop="expectResult">
									<el-tooltip content="点击切换为富文本编辑|普通文本">
										<el-button icon="el-icon-refresh" @click="expectResultEditorVisible=!expectResultEditorVisible" type="text"></el-button>
									</el-tooltip>
									<div v-if="expectResultEditorVisible==false">
										<el-input  style="width:100%;" v-model="editForm.expectResult" type="textarea" :rows="6"> </el-input>
									</div>
									<div v-else>
										<vue-editor v-if="expectResultEditorVisible==true" :id="'expectResult'+editForm.id" :branch-id="userInfo.branchId" v-model="editForm.expectResult"  ref="expectResult"></vue-editor>
									</div>
								</el-form-item>
							</el-tab-pane> 

							<el-tab-pane label="处理意见" name="4">
								<el-form-item v-if="!flowInfoVisible" label="流转意见" prop="remarks">
									<el-col v-if="editForm.remarks" :span="24" >
									<div class="wf-main-context-box"  >
										<div   class="wf-main-context rich-context" v-html="editForm.remarks"></div>
									</div>
									</el-col>
									<font v-else>无</font> 
								</el-form-item>
								<el-form-item label="处理意见" prop="receiptMessage"> 
									<el-tooltip content="点击切换为富文本编辑|普通文本">
										<el-button icon="el-icon-refresh" @click="receiptMessageEditorVisible=!receiptMessageEditorVisible" type="text"></el-button>
									</el-tooltip>
									<div v-if="receiptMessageEditorVisible==false">
										<el-input  style="width:100%;" v-model="editForm.receiptMessage" type="textarea" :rows="6"> </el-input>
									</div>
									<div v-else>
										<vue-editor :id="'receiptMessage_'+editForm.id" :branch-id="userInfo.branchId" v-model="editForm.receiptMessage"></vue-editor>

									</div>
								</el-form-item>
							</el-tab-pane> 

							
							
							
						</el-tabs> 
				</el-form>
				<el-drawer title="选中用户" :visible.sync="selectUserVisible"  size="70%"  append-to-body   :close-on-click-modal="false">
					<xm-group-mng  :sel-project="selProject" :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-mng>
				</el-drawer>
				<el-drawer title="选中任务" :visible.sync="selectTaskVisible"  size="70%"    append-to-body   :close-on-click-modal="false">
					<xm-task-list  :sel-project="selProject"   @task-selected="onSelectedTask"></xm-task-list>
				</el-drawer>

				<el-drawer append-to-body title="需求选择" :visible.sync="selectMenuVisible"   size="70%"   :close-on-click-modal="false">
					<xm-menu-select :is-select-menu="true" checkScope="0"  @selected="onSelectedMenu" :sel-project="selProject"></xm-menu-select>
				</el-drawer>
			</el-row>
		</el-row>
		<el-row class="page-bottom">
				<el-button @click.native="handleCancel">取消</el-button>
				<el-button v-loading="load.edit" type="primary" @click.native="handleQuestion(editForm.bugStatus)" :disabled="load.edit==true">保存</el-button> 
		</el-row>
		

			<!--新增 XmQuestion xm_question界面-->
			<el-drawer title="流转日志"  :visible.sync="flowInfoVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				<xm-question-handle-mng :bug="editForm" :visible="flowInfoVisible"></xm-question-handle-mng>
			</el-drawer>
			
			<el-drawer append-to-body title="标签" :visible.sync="tagSelectVisible" class="dialog-body" size="60%">
				<tag-mng :tagIds="editForm.tagIds?editForm.tagIds.split(','):[]" :jump="true" @select-confirm="onTagSelected">
				</tag-mng>
			</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { editXmQuestion } from '@/api/xm/core/xmQuestion'; 
	import { mapGetters } from 'vuex';
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import {sn} from '@/common/js/sequence';

	import XmGroupMng from '../xmGroup/XmGroupSelect';
	import VueEditor from '@/components/Tinymce/index';
	import XmTaskList from '../xmTask/XmTaskList';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import  XmQuestionHandleMng from '../xmQuestionHandle/XmQuestionHandleMng';//修改界面
  	import TagMng from "@/views/mdp/arc/tag/TagMng";
	  
	import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';

	export default {
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),

			calcBugStep(){
				if(this.dicts['bugStatus'] && this.editForm){
					var index=this.dicts['bugStatus'].findIndex(i=>{
						if(i.id==this.editForm.bugStatus){
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
				dicts:{
					priority:[],
					bugSeverity:[],
					bugSolution:[],
					bugStatus:[],
					bugType:[],
					bugRepRate:[],
					bugReason:[],
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
					id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',processTime:'',receiptMessage:'',receiptTime:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',receiptMessage:'',
					iterationId:'',iterationName:'',productId:'',
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
				xmQuestionHandles:[],
				selectTaskVisible:false,
				flowInfoVisible:false,
				selectMenuVisible:false,
				receiptMessageEditorVisible:false,
				tagSelectVisible:false,
				descriptionEditorVisible:false,
				descriptionEditorVisible:false,
				expectResultEditorVisible:false,
				opStepEditorVisible:false,
				xmProductVersions:[{id:"1.0.0" ,name:'1.0.0'}],
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
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							//解决了直接转会创建人
							if(tardgetBugStatus=='resolved'){
								this.editForm.handlerUserid=this.editForm.createUserid
								this.editForm.handlerUsername=this.editForm.createUsername;
							}
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
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
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
					key="priority"
				}else{
					return cellValue
				}
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return cellValue;
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					return list[0].name
				}else{
					return cellValue;
				}

			}, 
			showSelectTask:function(){
				if(this.selProject==null){
					this.$notify({showClose: true, message: "请先选项目", type: 'error' });
					return ;
				}
				this.selectTaskVisible=true;
			},
			onSelectedTask(task){
				if(task.ntype=='1'){
					this.$notify({showClose: true, message: "您选择的【"+task.name+"】属于任务集，请重新选择。建议选择树中叶子节点", type: 'error' });
					return;
				}
				this.editForm.taskId=task.id
				this.editForm.taskName=task.name
				if(!this.editForm.menuId){
					this.editForm.menuId=task.menuId
					this.editForm.menuName=task.menuName
					this.editForm.productId=task.productId
				} 
				this.editForm.handlerUserid=task.executorUserid
				this.editForm.handlerUsername=task.executorUsername
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
			/**end 在上面加自定义方法**/

			showSelectMenu:function(){
				if(this.selProject==null){
					this.$notify({showClose: true, message: "请先选项目", type: 'error' });
					return ;
				}
				this.selectMenuVisible=true;
			},
			onSelectedMenu(menu){
				if(menu.ntype=='1'){
					this.$notify({showClose: true, message: "您选择的【"+menu.menuName+"】属于需求池，请重新选择。建议选择树中叶子节点", type: 'error' });
					return;
				}
				this.editForm.menuId=menu.menuId
				this.editForm.menuName=menu.menuName
				this.editForm.productId=menu.productId
				this.editForm.iterationId=menu.iterationId
				this.editForm.iterationName=menu.iterationName
				this.selectMenuVisible=false;
			},
			handleCloseMenuTag:function(){
				this.editForm.menuId=''
				this.editForm.menuName=""
			},
			onTagSelected(tags) {
				this.tagSelectVisible = false; 
				if(tags && tags.length>0){ 
					this.editForm.tagIds=tags.map(i=>i.tagId).join(",")
					this.editForm.tagNames=tags.map(i=>i.tagName).join(",")
				}else{
					this.editForm.tagIds=""
					this.editForm.tagNames=""
				}
			},
			
			onPorjectConfirm:function(project){ 
				this.editForm.projectId=project.id
				this.editForm.projectName=project.name 
			},
			clearProject(){ 
				this.editForm.projectId=''
				this.editForm.projectName=''
			},
		},//end method
		components: {
				//在下面添加其它组件 'xm-question-edit':XmQuestionEdit
				'upload': AttachmentUpload,XmGroupMng,VueEditor,XmTaskList,xmMenuSelect,XmQuestionHandleMng,TagMng,XmProjectSelect,
		},
		mounted() {
			console.log("question_add");
			this.editForm=Object.assign(this.editForm, this.xmQuestion);
			initSimpleDicts('all',['bugSeverity','bugSolution','bugStatus','bugType','priority','bugRepRate','bugReason']).then(res=>{
				if(res.data.tips.isOk){
					 this.dicts=res.data.data
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
