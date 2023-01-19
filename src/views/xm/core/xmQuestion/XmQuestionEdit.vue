<template>
	<section>  
		<el-row>
			<el-form :model="editForm" label-width="120px"  :rules="editFormRules" ref="editForm" label-position="left"> 
				<el-row>
					<el-col :span="6" >
						<el-row class="padding border">
							<el-form-item label="归属项目" prop="projectId">
								{{editForm.projectId}}
							</el-form-item>
							<el-form-item label="归属产品" prop="productId">
								<span v-if="editForm.productId">{{editForm.productId}}</span> 
								<span v-if="!xmProductCpd || !xmProductCpd.id">						
									<xm-product-select ref="xmProductSelect1"   style="display:inline;"  :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected" @clear="onProductClearSelect" ></xm-product-select>
								</span>
							</el-form-item>
							<span v-if="editForm.productId">
								<el-form-item label="关联用例" prop="caseId">
									<span>{{editForm.caseName?editForm.caseName:'无'}} <el-button type="text" @click="caseVisible=true">选择用例</el-button></span>
								</el-form-item>
								<el-form-item label="归属模块" prop="funcId">
									<span>{{editForm.funcName?editForm.funcName:'无'}} <el-button type="text" @click="funcVisible=true">选择模块</el-button></span>
								</el-form-item>
								<el-form-item label="归属需求" prop="menuId">  
									<el-tag title="隶属需求" style="width:100%;" closable @click="showSelectMenu" @close.stop="handleCloseMenuTag">
									<div class="icon" :style="{backgroundColor:   'rgb(79, 140, 255)' }">
										<i :class="  'el-icon-document'  " ></i>
									</div> {{editForm.menuName?editForm.menuName:"未关联需求"}}</el-tag> 
								</el-form-item>
							</span>
						</el-row>
						
						<el-row class="padding border">
							<el-form-item label="最新意见" prop="remarks" class="field">
								<div class="field-text">
									{{editForm.remarks||'暂无'}}
								</div>
								<div class="field-bar">
									<el-input type="textarea" :rows="3"  v-model="editForm.remarks" placeholder="处理意见" @change="editXmQuestionSomeFields(editForm,'remarks',$event)"></el-input>
								</div>
							</el-form-item>
							 
						</el-row>
						</el-col>
					<el-col :span="18" class="border padding"> 
					
						<el-form-item label="缺陷标题" prop="name">
							<el-input   v-model="editForm.name" placeholder="缺陷标题" @change="editXmQuestionSomeFields(editForm,'name',$event)"></el-input>
								<span v-if="opType!=='add'">
								<span class="label-font-color">缺陷编号：{{editForm.id}} </span>
								<el-divider direction="vertical"></el-divider>
								<span class="label-font-color">{{editForm.createUsername}} 于 {{editForm.createTime}} 创建 </span>
								<el-divider direction="vertical"></el-divider>
								<el-tag v-if="editForm.tagNames">{{editForm.tagNames?editForm.tagNames:''}} </el-tag>
								<el-button type="text" icon="el-icon-plus" @click="tagSelectVisible=true">标签</el-button>
								<el-divider direction="vertical"></el-divider> 
								<el-button type="text" icon="el-icon-copy" @click="copyLink">拷贝链接(快速分享)</el-button>
								</span>
						</el-form-item>  
								<el-row class="padding"> 
									<el-col :span="6"> 
											<mdp-select-user-xm :project-id="editForm.projectId" :product-id="editForm.productId" label="责任人" v-model="editForm" userid-key="handlerUserid" username-key="handlerUsername" @change="editXmQuestionSomeFields(editForm,'handlerUserid',$event)">
												<el-row slot="extOper">
														指派给 <el-button type="text" @click="sendToAsk"> 提出人</el-button>  <el-button type="text"  @click="sendToCreater"> 创建人</el-button>  
													</el-row> 
											</mdp-select-user-xm>
 
													
									</el-col>
									
									<el-col :span="6">
										<mdp-select-dict-x label="状态" :dict="dicts['bugStatus']" v-model="editForm.bugStatus" @change="editXmQuestionSomeFields(editForm,'bugStatus',$event)"></mdp-select-dict-x> 
									</el-col> 

									<el-col :span="6">
										<mdp-select-dict-x label="优先级" :dict="dicts['priority']" v-model="editForm.priority" @change="editXmQuestionSomeFields(editForm,'priority',$event)"></mdp-select-dict-x> 
									</el-col>
									
									<el-col :span="6"> 
												<mdp-date-x label="结束时间" style="max-width:100%;" value-format="yyyy-MM-dd HH:mm:ss" v-model="editForm.endTime" @change="editXmQuestionSomeFields(editForm,'endTime',$event)"></mdp-date-x>
 									</el-col>
								</el-row>
								<el-tabs v-model="activateTabPaneName">
								
									<el-tab-pane label="缺陷描述" name="12">
										<el-form-item label="" prop="description" label-width="0px">  
												<vue-editor v-if="visible && activateTabPaneName=='12'" class="rich-context" :id="'description_'+editForm.id" :branch-id="userInfo.branchId" v-model="editForm.description"></vue-editor> 
										</el-form-item>
										<el-row style="float:right;" v-if="opType!=='add'">
												<el-button @click.native="handleCancel">取消</el-button>
												<el-button v-loading="load.edit"  v-if="editForm.description!==editFormBak.description" type="primary" @click.native="editXmQuestionSomeFields(editForm,'description',editForm.description)" :disabled="load.edit==true">保存</el-button> 
										</el-row>
									</el-tab-pane>
									<el-tab-pane name="1" label="基本信息">
										<el-row> 
											
												<el-col :span="8">
													<el-form-item label="提出人" prop="askUsername">
														<mdp-select-user-xm :project-id="editForm.projectId" :product-id="editForm.productId" label="提出人" v-model="editForm" userid-key="askUserid" username-key="askUsername" @change="editXmQuestionSomeFields(editForm,'askUserid',$event)"></mdp-select-user-xm>
 													</el-form-item> 
												</el-col>
												<el-col :span="8">
													<el-form-item label="复现频率" prop="repRate"> 
														<mdp-select-dict-tag  :dict="dicts['bugRepRate']" v-model="editForm.repRate" @change="editXmQuestionSomeFields(editForm,'repRate',$event)"></mdp-select-dict-tag>
													</el-form-item>
													
												</el-col> 
												<el-col :span="8"> 
													<el-form-item label="复现版本" prop="verNum">
														<el-input v-model="editForm.verNum" placeholder="请填写版本号" @change="editXmQuestionSomeFields(editForm,'verNum',$event)"> 
														</el-input> 
													</el-form-item>
												</el-col>  
										</el-row>
										<el-row>
										
										<el-col :span="8">
											<el-form-item label="严重程度" prop="bugSeverity">
												<mdp-select-dict-tag  :dict="dicts['bugSeverity']" v-model="editForm.bugSeverity" @change="editXmQuestionSomeFields(editForm,'bugSeverity',$event)"></mdp-select-dict-tag>
											 
											</el-form-item>
										</el-col> 	
										<el-col :span="8">
											<el-form-item label="原因分析" prop="bugReason">
												<mdp-select-dict-tag  :dict="dicts['bugReason']" v-model="editForm.bugReason" @change="editXmQuestionSomeFields(editForm,'bugReason',$event)"></mdp-select-dict-tag>
												 
											</el-form-item>
										</el-col>
										
										<el-col :span="8">
											<el-form-item label="解决方案" prop="solution">
												<mdp-select-dict-tag  :dict="dicts['bugSolution']" v-model="editForm.solution" @change="editXmQuestionSomeFields(editForm,'solution',$event)"></mdp-select-dict-tag>
 
											</el-form-item>
										</el-col> 
										<el-col :span="8">
													<el-form-item label="缺陷类别" prop="bugType">
														<mdp-select-dict-tag  :dict="dicts['bugType']" v-model="editForm.bugType" @change="editXmQuestionSomeFields(editForm,'bugType',$event)"></mdp-select-dict-tag>
 
													</el-form-item>
													
												</el-col> 
										</el-row> 
									</el-tab-pane>
									
									<el-tab-pane label="测试步骤" name="2">
										<el-form-item label="" prop="opStep"  label-width="0px" v-if="stepConfigVisible==false">
											<test-step-result v-model="editForm.opStep"></test-step-result> 
										</el-form-item>
										
										<el-form-item label="" prop="opStep"  label-width="0px" v-if="stepConfigVisible==true">
											<test-step-config v-model="editForm.opStep"></test-step-config> 
										</el-form-item>
										<el-row class="page-bottom">
												<el-button @click.native="handleCancel">取消</el-button>
												<el-button @click="stepConfigVisible=!stepConfigVisible">{{stepConfigVisible?'完成步骤配置':'去配置步骤'}}</el-button>
												<el-button v-loading="load.edit" v-if="editForm.opStep!=editFormBak.opStep" type="primary" @click.native="editXmQuestionSomeFields(editForm,'opStep',editForm.opStep)" :disabled="load.edit==true">保存</el-button> 
										</el-row>
									</el-tab-pane> 
									
					
									<el-tab-pane :label="'工时( '+(editForm.actWorkload?editForm.actWorkload:0)+' / '+(editForm.budgetWorkload?editForm.budgetWorkload:0)+' h )'" name="55"> 
										<xm-workload-record v-if="activateTabPaneName=='55'" biz-type="2" :xm-question="editForm" ></xm-workload-record>
									</el-tab-pane>
									<el-tab-pane label="流转记录" name="4" v-if="opType!='add'">  
										<xm-question-handle-mng v-if="activateTabPaneName=='4'" :bug="editForm" :visible="activateTabPaneName=='4'"></xm-question-handle-mng>
 									</el-tab-pane>  
									<el-tab-pane label="关注" name="91" v-if="opType!='add'"> 
										<xm-my-do-focus v-if="activateTabPaneName=='91'" :biz-id="editForm.id" :pbiz-id="editForm.projectId" :biz-name="editForm.name" focus-type="5"></xm-my-do-focus>
									</el-tab-pane>
									
									
									
								</el-tabs> 
						</el-col>
						
					</el-row>
					<el-row style="float:right;" v-if="opType==='add'">
						<el-button type="primary" @click="saveSubmit">保存</el-button>
					</el-row>
				</el-form>
				<el-drawer title="选中任务" :visible.sync="selectTaskVisible"  size="70%"    append-to-body   :close-on-click-modal="false">
					<xm-task-list  v-if="selectTaskVisible"   :sel-project="selProject"   @task-selected="onSelectedTask"></xm-task-list>
				</el-drawer>

				<el-drawer append-to-body title="需求选择" :visible.sync="selectMenuVisible"   size="60%"   :close-on-click-modal="false">
					<xm-menu-select v-if="selectMenuVisible" :xm-product="editForm.productId?{id:editForm.productId,productName:editForm.productName}:xmProductCpd" :xm-iteration="xmIteration" :visible="selectMenuVisible" :is-select-menu="true" checkScope="3"  @selected="onSelectedMenu" :sel-project="selProject"></xm-menu-select>
				</el-drawer>
			</el-row>  
			<el-drawer append-to-body title="标签" :visible.sync="tagSelectVisible" class="dialog-body" size="60%">
				<tag-mng :tagIds="editForm.tagIds?editForm.tagIds.split(','):[]" :jump="true" @select-confirm="onTagSelected">
				</tag-mng>
			</el-drawer>
			
			<el-dialog append-to-body title="模块选择"  :visible.sync="funcVisible" width="60%" top="20px"  :close-on-click-modal="false">
				<xm-func-select v-if="funcVisible"  @row-click="onFuncSelected" :xm-product="editForm.productId?{id:editForm.productId,productName:editForm.productName}:xmProductCpd"></xm-func-select>
			</el-dialog>
			
			<el-dialog append-to-body title="执行用例选择"  :visible.sync="caseVisible" width="80%" top="20px"  :close-on-click-modal="false">
				<xm-test-plan-case-mng  v-if="caseVisible" :select="true" :visible="caseVisible" :xm-test-plan="xmTestPlan" :xm-product="editForm.productId?{id:editForm.productId,productName:editForm.productName}:xmProductCpd" @select="onTestPlanCaseSelected" ></xm-test-plan-case-mng>
			</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { addXmQuestion,editXmQuestionSomeFields } from '@/api/xm/core/xmQuestion'; 
	import { mapGetters } from 'vuex';
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import {sn} from '@/common/js/sequence';
	import VueEditor from '@/components/Tinymce/index';
	import XmTaskList from '../xmTask/XmTaskList';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import  XmQuestionHandleMng from '../xmQuestionHandle/XmQuestionHandleMng';//修改界面
  	import TagMng from "@/views/mdp/arc/tag/TagMng";
	  
	import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';
	import XmMyDoFocus from '@/views/myWork/my/components/DoFocus';

	import XmFuncSelect from '../xmFunc/XmFuncSelect'
	import MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm/index'
	import TestStepConfig from '../xmTestCase/TestStepConfig.vue';
	import TestStepResult from '../xmTestPlanCase/TestStepResult.vue';
	import XmProductSelect from '@/views/xm/core/components/XmProductSelect'
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
				 
			},
			xmProductCpd(){ 
				if(this.xmQuestion && this.xmQuestion.id && this.xmQuestion.productId){
					return {id:this.xmQuestion.productId,productName:this.xmQuestion.productName}
				}
				if(this.xmProduct&& this.xmProduct.id){
					return this.xmProduct
				} 
				if(this.xmTestPlan && this.xmTestPlan.id){
					return {id:this.xmTestPlan.productId,productName:this.xmTestPlan.productName}
				}
				if(this.xmTestPlanCase && this.xmTestPlanCase.id && this.xmTestPlanCase.productId){
					return {id:this.xmTestPlanCase.productId,productName:this.xmTestPlanCase.productName}
				}
				if(this.xmTestCase && this.xmTestCase.id){
					return {id:this.xmTestCase.productId,productName:this.xmTestCase.productName}
				}
				if(this.xmMenu && this.xmMenu.menuId){
					return {id:this.xmMenu.productId,productName:this.xmMenu.productName}
				}
				
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
				return null
        }
		},
		props:['xmQuestion','visible',"selProject",'opType','xmProduct','xmTestCase','xmTestPlanCase','xmMenu','xmIteration','xmTestPlan'],
		watch: {
	      'xmQuestion':function( xmQuestion ) {
	        this.editForm = {...xmQuestion};
	      },
	      'visible':function(visible) {
	      	if(visible==true){
				this.initData(); 
	      	}
			this.activateTabPaneName='12'
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
						{required: true, message: '缺陷标题不可为空', trigger: 'change' },
						{ min: 5, max: 250, message: '长度在 5 到 250 个字符', trigger: 'change' },//长度
					],
					askUsername: [
						{required: true, message: '提出人不可为空', trigger: 'change' }
					],
					handlerUsername: [
						{required: true, message: '请指派给一个人', trigger: 'change' }
					],
					description: [ 
						{ min: 0, max: 1000, message: '缺陷描述长度在 0 到 1000 个字符', trigger: 'change' },//长度
					],
					opStep: [ 
						{ min: 0, max: 1000, message: '测试步骤长度在 0 到 1000 个字符', trigger: 'change' },//长度
					],
					expectResult: [ 
						{ min: 0, max: 1000, message: '预期结果长度在 0 到 1000 个字符', trigger: 'change' },//长度
					],
					remarks: [ 
						{ min: 0, max: 1000, message: '处理意见长度在 0 到 1000 个字符', trigger: 'change' },//长度
					],
					
				},
				//新增界面数据 xm_question
				editForm: {
					id:'',name:'',projectId:'',projectName:'',caseId:'',caseName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',bizProcInstId:'',bizFlowState:'',menuId:'',menuName:'',budgetWorkload:'',budgetAt:'',actWorkload:'',actAt:'',expectResult:'',opStep:'',currResult:'',refRequire:'',bugSeverity:'',bugType:'',tagIds:'',tagNames:'',urls:'',ltime:'',qtype:'',caseExecId:'',remarks:'',productId:'',repRate:'',verNum:'',vpath:'',pverNum:'',bugReason:'',rate:'',initWorkload:'',taskOut:'',taskId:'',funcId:'',funcName:'',funcPnames:'',planId:'',casedbId:'',
					attachment: [],  
					productName:''
				},
				//新增界面数据 xm_question
				editFormInit: {
					id:'',name:'',projectId:'',projectName:'',caseId:'',caseName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',bizProcInstId:'',bizFlowState:'',menuId:'',menuName:'',budgetWorkload:'',budgetAt:'',actWorkload:'',actAt:'',expectResult:'',opStep:'',currResult:'',refRequire:'',bugSeverity:'',bugType:'',tagIds:'',tagNames:'',urls:'',ltime:'',qtype:'',caseExecId:'',remarks:'',productId:'',repRate:'',verNum:'',vpath:'',pverNum:'',bugReason:'',rate:'',initWorkload:'',taskOut:'',taskId:'',funcId:'',funcName:'',funcPnames:'',planId:'',casedbId:'',
					attachment: [],  
					productName:''
				},
				editFormBak: {
					id:'',name:'',projectId:'',projectName:'',caseId:'',caseName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',bizProcInstId:'',bizFlowState:'',menuId:'',menuName:'',budgetWorkload:'',budgetAt:'',actWorkload:'',actAt:'',expectResult:'',opStep:'',currResult:'',refRequire:'',bugSeverity:'',bugType:'',tagIds:'',tagNames:'',urls:'',ltime:'',qtype:'',caseExecId:'',remarks:'',productId:'',repRate:'',verNum:'',vpath:'',pverNum:'',bugReason:'',rate:'',initWorkload:'',taskOut:'',taskId:'',funcId:'',funcName:'',funcPnames:'',planId:'',casedbId:'',
					attachment: [],  
					productName:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				fileVisible: true,
				userFieldName:'',
				xmQuestionHandles:[],
				selectTaskVisible:false, 
				selectMenuVisible:false, 
				tagSelectVisible:false, 
				xmProductVersions:[{id:"1.0.0" ,name:'1.0.0'}],
				activateTabPaneName:'12',
				funcVisible:false,
				stepConfigVisible:false,
				caseVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交XmQuestion xm_question 父组件监听@submit="afterAddSubmit"
			saveSubmit: function (tardgetBugStatus) {
				
				if(this.xmIteration && this.xmIteration.id){
					if(!this.editForm.menuId){
						this.$notify({position:'bottom-left',showClose:true,message: '迭代视图中，新增缺陷必须关联需求，您可以通过设置【测试用例】或者【用户故事】达到关联需求目的。', type:  'error' });
						return ;
					}
				}
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
 
							if(params.description){
								params.description=params.description.replace(/<p>\n<br>\n<\/p>/g,"");
								params.description=params.description.replace(/<p><br><\/p>/g,"");
							}
							addXmQuestion(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit');//  @submit="afterAddSubmit" 
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
						});
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: "表单验证不通过", type: 'error' });
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
			handleQuestion:function(tardgetBugStatus){ 
				this.editSubmit(tardgetBugStatus);
			}, 
			showSelectTask:function(){
				if(this.selProject==null){
					this.$notify({position:'bottom-left',showClose:true,message: "请先选项目", type: 'error' });
					return ;
				}
				this.selectTaskVisible=true;
			},
			onSelectedTask(task){
				if(task.ntype=='1'){
					this.$notify({position:'bottom-left',showClose:true,message: "您选择的【"+task.name+"】属于任务集，请重新选择。建议选择树中叶子节点", type: 'error' });
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
				this.editXmQuestionSomeFields(this.editForm,"handlerUserid",[{userid:this.editForm.createUserid,username:this.editForm.createUsername}])

			},
			sendToAsk(){ 
				this.editForm.handlerUsername=this.editForm.askUsername
				this.editForm.handlerUserid=this.editForm.askUserid
				this.editXmQuestionSomeFields(this.editForm,"handlerUserid",[{userid:this.editForm.askUserid,username:this.editForm.askUsername}])
			}, 
			/**end 在上面加自定义方法**/

			showSelectMenu:function(){
				if(this.selProject==null){
					this.$notify({position:'bottom-left',showClose:true,message: "请先选项目", type: 'error' });
					return ;
				}
				this.selectMenuVisible=true;
			},
			onSelectedMenu(menu){
				if(menu.dclass<'3'){
					this.$notify({position:'bottom-left',showClose:true,message: "您选择的【"+menu.menuName+"】不属于用户故事,请重新选择。", type: 'error' });
					return;
				}
				this.editForm.menuId=menu.menuId
				this.editForm.menuName=menu.menuName
				this.editForm.productId=menu.productId
				this.selectMenuVisible=false;
				this.editXmQuestionSomeFields(this.editForm,'menuId',menu)
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
			
			editXmQuestionSomeFields(row,fieldName,$event){
				var params={ids:[row.id]}; 
				if(fieldName==='handlerUserid'){
					if($event){ 	
						params[fieldName]=$event[0].userid;
						params.handlerUsername=$event[0].username 
					}else{
						return;
					}
				}else if(fieldName==='askUserid'){
					if($event){ 	
						params[fieldName]=$event[0].userid;
						params.askUsername=$event[0].username 
					}else{
						return;
					}
				}else if(fieldName==='tagIds'){
					if($event){ 	
						params[fieldName]=$event.map(i=>i.tagId).join(",");
						params.tagNames=$event.map(i=>i.tagName).join(","); 
					}else{
						return;
					}
				}else if(fieldName==='workload'){
					params={...params,...$event}
				}else if(fieldName==='projectId'){
					params.projectId=$event.id
				}else if(fieldName==='productId'){
					params.productId=$event.id
				}else if(fieldName==='menuId'){
					params.productId=$event.productId
					params.menuId=$event.menuId
					params.menuName=$event.menuName
					if($event.funcId){
						params.funcId=$event.funcId
						params.funcName=$event.funcName
					}
				}else if(fieldName==='funcId'){
					params.productId=$event.productId
					params.funcId=$event.id
					params.funcName=$event.name 
				}else if(fieldName==='caseId'){
					 params=Object.assign(params,$event)
				}else{
					params[fieldName]=$event
				}
				
				editXmQuestionSomeFields(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){ 
						 this.editFormBak={...this.editForm}
						 this.$emit('edit-fields',this.editForm)
					}else{
						Object.assign(this.editForm,this.editFormBak)
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},
			copyLink(){
				var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
				var link=curlDomain+"/"+process.env.CONTEXT+"/"+process.env.VERSION+"/#/xm/core/xmQuestion/XmQuestionDetailRoute?id="+this.editForm.id
				this.$copyText(link).then(e => {
					this.$notify({position:'bottom-left',showClose:true,message:"拷贝成果",type:'success'})
				});
			}, 
			onFuncSelected(row){
				this.editForm.funcId=row.id
				this.editForm.funcName=row.name
				this.funcVisible=false;
				if(this.opType!=='add'){
					this.editXmQuestionSomeFields(this.editForm,'funcId',row)
				}
			},
			initData(){
				this.editForm=Object.assign(this.editForm,this.editFormInit)
				this.editForm=Object.assign(this.editForm, this.xmQuestion);
				if(this.opType==='add'){ 
					this.editForm.askUserid=this.userInfo.userid
					this.editForm.askUsername=this.userInfo.username
					this.editForm.handlerUserid=this.userInfo.userid
					this.editForm.handlerUsername=this.userInfo.username  
					this.editForm.bugReason="0"
					this.editForm.bugReason="0"
					this.editForm.qtype="1"
					this.editForm.bugSeverity="1"
					this.editForm.priority="3"
					this.editForm.bugStatus="0"
					if(this.selProject && this.selProject.id){
						this.editForm.projectId=this.selProject.id
						this.editForm.projectName=this.selProject.name
					}
					if(this.xmProduct && this.xmProduct.id){
						this.editForm.productId=this.xmProduct.id
						this.editForm.productName=this.xmProduct.productName
					}
					if(this.xmTestCase && this.xmTestCase.id){
						this.editForm.productId=this.xmTestCase.productId
						this.editForm.productName=this.xmTestCase.productName
						this.editForm.caseId=this.xmTestCase.caseId
						this.editForm.caseName=this.xmTestCase.caseName
						this.editForm.casedbId=this.xmTestCase.casedbId  
						this.editForm.funcId=this.xmTestCase.funcId
						this.editForm.funcName=this.xmTestCase.funcName 
						this.editForm.menuId=this.xmTestCase.menuId
						this.editForm.menuName=this.xmTestCase.menuName 
						this.editForm.opStep=this.xmTestCase.testStep 
						this.editForm.name=this.xmTestCase.caseName
					} 
					if(this.xmTestPlanCase  && this.xmTestPlanCase.planId){
						this.editForm.planId=this.xmTestPlanCase.planId
						this.editForm.productId=this.xmTestPlanCase.productId
						this.editForm.productName=this.xmTestPlanCase.productName
						this.editForm.caseId=this.xmTestPlanCase.caseId
						this.editForm.caseName=this.xmTestPlanCase.caseName
						this.editForm.casedbId=this.xmTestPlanCase.casedbId  
						this.editForm.funcId=this.xmTestPlanCase.funcId
						this.editForm.funcName=this.xmTestPlanCase.funcName 
						this.editForm.menuId=this.xmTestPlanCase.menuId
						this.editForm.menuName=this.xmTestPlanCase.menuName  
						this.editForm.opStep=this.xmTestPlanCase.testStep
						this.editForm.name=this.xmTestPlanCase.caseName
						this.editForm.projectId=this.xmTestPlanCase.projectId
					}
					if(this.xmMenu && this.xmMenu.menuId){
						this.editForm.menuId=this.xmMenu.menuId
						this.editForm.menuName=this.xmMenu.menuName
						if(this.xmMenu.productId){
							this.editForm.productId=this.xmMenu.productId
							this.editForm.productName=this.xmMenu.productName
						}
						if(this.xmMenu.funcId){ 
							this.editForm.funcId=this.xmMenu.funcId
							this.editForm.funcName=this.xmMenu.funcName 
						}
					}
				}else{

				}
				this.editFormBak={...this.editForm}
			},
			onTestPlanCaseSelected(xmTestPlanCase){ 
				var params={};
				params.planId=xmTestPlanCase.planId
				params.productId=xmTestPlanCase.productId
				params.productName=xmTestPlanCase.productName
				params.caseId=xmTestPlanCase.caseId
				params.caseName=xmTestPlanCase.caseName
				params.casedbId=xmTestPlanCase.casedbId  
				params.funcId=xmTestPlanCase.funcId
				params.funcName=xmTestPlanCase.funcName 
				params.menuId=xmTestPlanCase.menuId
				params.menuName=xmTestPlanCase.menuName  
				params.opStep=xmTestPlanCase.testStep
				params.name=xmTestPlanCase.caseName
				params.projectId=xmTestPlanCase.projectId 
				Object.assign(this.editForm,params)
				this.editXmQuestionSomeFields(this.editForm,"caseId",params)
				this.caseVisible=false;
			},
			onProductSelected(product){
				this.editForm.productId=product.id
				this.editForm.productName=product.productName
			},
			onProductClearSelect(){ 
				this.editForm.productId=""
				this.editForm.productName=""
			} 
		},//end method
		components: {
				//在下面添加其它组件 'xm-question-edit':XmQuestionEdit
				'upload': AttachmentUpload,VueEditor,XmTaskList,xmMenuSelect,XmQuestionHandleMng,TagMng,XmProjectSelect,XmProductSelect,
			XmMyDoFocus,XmFuncSelect,MdpSelectUserXm,TestStepConfig,TestStepResult,
			xmTestPlanCaseMng:()=>import('../xmTestPlanCase/XmTestPlanCaseSelect'),
			'xm-workload-record':()=>import("../xmWorkload/XmWorkloadRecord"),
		},
		mounted() { 
			this.initData();
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

/**
超宽度换行
**/
.el-tag{
  white-space: normal !important;;
  height:auto !important;;
}

.field-bar{
    display:none;
  }
.field-text{
    display:inline;
  }
.field:hover{ 
  cursor: pointer;
	.field-bar{
		display: inline;  
	}
  .field-text{
    display:none;
  }
}

</style>
