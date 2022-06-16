<template>
	<section>  
		<el-row>
			<!--新增界面 XmTask xm_task--> 
			<el-form :model="editForm"  label-width="120px" label-position="left" :rules="editFormRules" ref="editForm"> 
						<el-row :gutter="10">
							<el-col :span="6">
								<el-form-item label="序号" prop="sortLevel" >  
									<template slot="label"> 
									<div    class="icon" :style="{backgroundColor:   editForm.ntype==='0'?'#409EFF':'#E6A23C'}">
										<i :class="  editForm.ntype==='0'?'el-icon-s-operation':'el-icon-odometer' " ></i>
									</div>  
									{{editForm.ntype==='0'?'序号/任务':'序号/计划'}}
									</template>
									<el-input  v-model="editForm.sortLevel"    placeholder="如1.0或者1.2.3等" title="序号，如1.0、1.1.1或者1，2，3等"  @change="editXmTaskSomeFields(editForm,'sortLevel',$event)"></el-input> 
 
								</el-form-item>  
							</el-col>
							<el-col :span="18"> 
								<el-form-item label="" prop="name" label-width="0"> 
										<el-input v-model="editForm.name" placeholder="名称" @change="editXmTaskSomeFields(editForm,'name',$event)"></el-input>   
								</el-form-item> 
							</el-col>
							
						</el-row>
						
						
						<el-row>
							<el-col :span="8"> 
								 <el-form-item v-if="editForm.ptype==='0'" label="归属项目" prop="projectId"> 
									{{editForm.projectName?editForm.projectName:editForm.projectId}}
								</el-form-item>
								
								<el-form-item v-if="editForm.ptype==='1'" label="归属产品" prop="productId">
									{{editForm.productName?editForm.productName:editForm.productId}}
								</el-form-item>
							</el-col>
							<el-col :span="8"> 
								 <el-form-item label="上级计划" prop="parentTaskname">  
									<template slot="label"> 
										<div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
										<i :class=" 'el-icon-odometer' " ></i>
										</div> 
										上级计划
									</template>
									<font v-if="editForm.parentTaskid" >{{editForm.parentTaskname?editForm.parentTaskname:editForm.parentTaskid}}</font> 
									<font v-else>无上级(视为顶级)</font> 
								</el-form-item>
							</el-col> 
							<el-col :span="8"> 
								<el-form-item label="总负责人"> 
									<el-tag  v-if="editForm.createUserid" style="margin-left:10px;border-radius:30px;"  >{{editForm.createUsername}}</el-tag>
									<el-button type="text" @click="showGroupUserSelect(editForm)" icon="el-icon-setting">设置负责人</el-button>
								</el-form-item> 
							</el-col>  
						</el-row>
						<el-row>
							<el-col :span="8"> 
								<el-form-item :label="editForm.ntype=='0'?'任务状态':'计划状态'">  
									
									<el-select v-model="editForm.taskState" @change="editXmTaskSomeFields(editForm,'taskState',$event)">
											<el-option v-for="i in dicts.taskState" :label="i.name" :key="i.id" :value="i.id"></el-option> 
									</el-select>    
								</el-form-item> 
							</el-col> 
							<el-col :span="16"> 
								<el-form-item label="时间进度">  
										<date-range 
											v-model="editForm"
											start-key="startTime"
											end-key="endTime"
											@change="onBudgetDateRangerChange" 
											type="daterange"
											:auto-default="false" 
											unlink-panels
											range-separator="-"
											start-placeholder="开始日期"
											end-placeholder="完成日期"
											value-format="yyyy-MM-dd HH:mm:ss"
											:default-time="['00:00:00','23:59:59']"
											:picker-options="pickerOptions"
										></date-range>
										{{editForm.rate?editForm.rate:0}}%
								</el-form-item>  
							</el-col> 

							
						</el-row>
					<el-tabs v-model="activateTabPaneName" >
						<el-tab-pane label="基础信息" name="1"> 	
						<el-row>  
							<el-col :span="10">
								<el-form-item  label="" prop="milestone">  
									<el-checkbox v-model="editForm.milestone" true-label="1" false-label="0" @change="editXmTaskSomeFields(editForm,'milestone',$event)">里程碑</el-checkbox>
								</el-form-item> 
							</el-col> 
							<el-col :span="14"> 
								<el-form-item prop="skill" label=""  v-if="editForm.ntype!='1'"  label-width="0"> 
									<el-tag class="fs-ft" style="margin-right:10px" v-for="(item,i) in taskSkills" :key="i">{{item.taskSkillName}}</el-tag>
									<el-button   type="text" @click.stop="showSkill()" icon="el-icon-plus">技能要求</el-button>
								</el-form-item> 
							</el-col>  
						</el-row> 
						<el-row> 
							
							<el-col :span="12">
								<el-form-item  label="优先级别" prop="level">  
									<el-select v-model="editForm.level" @change="editXmTaskSomeFields(editForm,'planType',$event)">
											<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option> 
									</el-select>    
								</el-form-item>  
							</el-col>
							<el-col :span="12"> 
								<el-form-item label="工期类型"> 
								<el-select v-model=" editForm.planType" @change="editXmTaskSomeFields(editForm,'planType',$event)">
									<el-option v-for="i in this.dicts.planType" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select> 
								</el-form-item>
							</el-col>
						</el-row> 
						
						<el-row>
							<el-col :span="12"> 
								<el-form-item :label="editForm.ntype=='0'?'任务前置':'计划前置'"> 
									<el-tag v-if="editForm.preTaskid"  @close="clearPreTask" closable >{{editForm.preTaskname}}</el-tag>
									<el-button  type="text"  @click.stop="selectTaskVisible=true"  >选前置</el-button> 
								</el-form-item>  
							</el-col>  
							<el-col :span="12">
								<el-form-item  :label="editForm.ntype=='0'?'任务类型':'计划类型'" prop="taskType">   
									<el-select v-model="editForm.taskType" @change="editXmTaskSomeFields(editForm,'taskType',$event)">
										<el-option v-for="i in this.dicts.taskType" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>  
								</el-form-item>   
							</el-col>
						</el-row>  
					</el-tab-pane>
					<el-tab-pane label="概述" name="2">  
						<el-form-item  label="任务概述" prop="description">  
 							<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="editForm.description" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划"  @change="editXmTaskSomeFields(editForm,'description',$event)"></el-input> 
						</el-form-item> 
					</el-tab-pane>
					
					<el-tab-pane label="需求" name="3">  
						
						<el-row>
							<el-col :span="12"> 
								<el-form-item  label="归属产品" prop="productId"> 
									 {{editForm.productId}}
								</el-form-item>  
							</el-col>
							<el-col :span="12"> 
								<el-form-item  label="用户故事" prop="menuId" id="menuInfo" v-if="editForm.ntype!='1'"> 
									{{editForm.menuName}} &nbsp;&nbsp;&nbsp; <el-link @click="menuVisible=true" type="primary">{{editForm.menuName?'更改':'设置'}}</el-link>&nbsp;&nbsp;&nbsp;
									<el-link v-if="editForm.menuName" @click="toMenu" type="primary">查看需求</el-link>
								</el-form-item> 
							</el-col> 
						</el-row>
					</el-tab-pane>
					<el-tab-pane :label="'子工作项('+subWorkItemNum+')'" name="4" v-if="editForm.ntype==='1'">  
							 <xm-sub-work-item v-if="activateTabPaneName=='4'" :parent-xm-task="editForm"  @sub-work-item-num="setSubWorkItemNum" @add-sub-task="onAddSubTask"></xm-sub-work-item>
					</el-tab-pane>
					<el-tab-pane label="缺陷" name="41" v-if="editForm.ntype!='1'">  
						<xm-question-for-task v-if="activateTabPaneName=='41'"  :xm-task="editForm" :sel-project="xmProject"></xm-question-for-task>
					</el-tab-pane>
					
					<el-tab-pane label="执行人" name="42" v-if="editForm.ntype!='1'"> 
						<xm-task-execuser-for-task v-if="activateTabPaneName=='42'" :xm-task="editForm" ></xm-task-execuser-for-task>
					</el-tab-pane>
					<el-tab-pane label="工时" name="5"> 
						 <xm-task-workload-record v-if="activateTabPaneName=='5'" :xm-task="editForm" ></xm-task-workload-record>
					</el-tab-pane>
					<el-tab-pane label="预算金额" name="6"> 
						<el-form-item label="自研工时单价" prop="uniInnerPrice">
							 <el-input type="number" style="width:150px;"   v-model="editForm.uniInnerPrice" :precision="2" :step="10" :min="0" placeholder="自研工时单价" @change="editXmTaskSomeFields(editForm,'uniInnerPrice',$event)"></el-input  >   元/h
							 
						</el-form-item> 
						<el-form-item label="外包、众包单价" prop="uniOutPrice"> 
								 <el-input type="number" style="width:150px;"   v-model="editForm.uniOutPrice" :precision="2" :step="10" :min="0" placeholder="外发工时单价" @change="editXmTaskSomeFields(editForm,'uniOutPrice',$event)"></el-input  >   元/h
						 
						</el-form-item> 
						<el-form-item label="预估金额" prop="budgetAt">
						 	<el-input type="number" style="width:150px;"    v-model="editForm.budgetAt" :precision="2" :step="100" :min="0" placeholder="预算金额" @change="editXmTaskSomeFields(editForm,'budgetAt',$event)"></el-input  >   元 
						</el-form-item> 

					</el-tab-pane>
					<el-tab-pane label="结算信息" name="7" v-if="editForm.ntype!='1'">
						<el-form-item label="" prop="taskClass">
							<el-checkbox v-model="editForm.taskClass" true-label="1" false-label="0"  @change="editXmTaskSomeFields(editForm,'taskClass',$event)">是否需要结算</el-checkbox>
						</el-form-item>
						<el-form-item v-if="editForm.taskClass=='1'" label="结算方案" prop="settlSchemel">
							<el-select v-model=" editForm.settleSchemel"  @change="editXmTaskSomeFields(editForm,'settleSchemel',$event)">
								<el-option v-for="i in dicts.xmTaskSettleSchemel" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="众包、互联网访问" name="8" v-if="editForm.ntype!='1'">
					 	<el-form-item> 
							 <el-checkbox v-model="editForm.taskOut" true-label="1" false-label="0" id="taskOut" @change="editXmTaskSomeFields(editForm,'taskOut',$event)">外购</el-checkbox>   
 						 
							 <el-checkbox v-model="editForm.crowd"  v-if="editForm.taskOut==='1'" true-label="1" false-label="0" id="crowd" @change="editXmTaskSomeFields(editForm,'crowd',$event)">开通众包</el-checkbox>   
						 
							<el-checkbox v-model="editForm.toTaskCenter" v-if="editForm.taskOut==='1'" true-label="1" false-label="0" id="toTaskCenter" @change="editXmTaskSomeFields(editForm,'toTaskCenter',$event)">发布到互联网任务大厅</el-checkbox> 
						</el-form-item>
						<el-form-item label="分享赚" prop="oshare"  v-if="editForm.taskOut==='1'">
 							<el-checkbox v-model="editForm.oshare" true-label="1" false-label="0" id="oshare" @change="editXmTaskSomeFields(editForm,'oshare',$event)">开通分享赚</el-checkbox>  
						</el-form-item> 
						<el-form-item label="分享佣金" prop="shareFee" v-if="editForm.oshare==='1' && editForm.taskOut==='1'">
 							<el-input type="number" style="width:150px;"    v-model="editForm.shareFee" :precision="2" :step="100" :min="0" placeholder="分享赚佣金" @change="editXmTaskSomeFields(editForm,'shareFee',$event)"></el-input  >   元
							 <font color="blue">开通分享赚后起效，佣金从任务预算中扣除，如果未发生分享佣金，则不扣除。一般建议为任务佣金的1%-5%</font>
						</el-form-item>
						<el-steps :active="calcTaskStep" align-center simple>
							<el-step title="发布" description="任务创建成功后即发布"></el-step>
							<el-step title="竞标" description="候选人参与竞标，或者由责任人主动设置候选人"></el-step>
							<el-step title="执行" description="候选人中标后，成为执行人，执行任务"></el-step>
							<el-step title="验收" description="任务完成后提交验收，验收通过，即可进行结算"></el-step>
							<el-step title="结算" description="提交结算申请审批流程，审批过程自动根据审批结果进行结算"></el-step>
							<el-step title="企业付款" description="结算流程审批通过，自动付款到个人钱包"></el-step>
							<el-step title="提现" description="企业付款完成后，个人对钱包中余额进行提现"></el-step>
						</el-steps> 
					</el-tab-pane>
					<el-tab-pane label="关注" name="91"> 
						<xm-my-do-focus v-if="activateTabPaneName=='91'" :biz-id="editForm.id" :pbiz-id="editForm.projectId" :biz-name="editForm.name" focus-type="2"></xm-my-do-focus>
					</el-tab-pane>
					<el-tab-pane label="日志" name="9">
						 <xm-record v-if="activateTabPaneName=='9'"  :biz-id="editForm.id" :obj-type="'task'"></xm-record>
					</el-tab-pane>
				</el-tabs>   
			</el-form>
		</el-row> 

		<!-- <el-drawer append-to-body :title="'技能要求'" :visible.sync="skillVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-skill-mng :visible="skillVisible" :task-id="editForm.id" @cancel="skillVisible=false" @getSkill="getSkill"></xm-skill-mng>
		</el-drawer> -->
		<el-drawer append-to-body title="选择执行人"  :visible.sync="execGroupUserSelectVisible" size="60%"    :close-on-click-modal="false">
			<xm-group-select :pgClass="editForm.ptype" :xm-product="editForm.productId?{id:editForm.productId,productName:''}:null" :visible="execGroupUserSelectVisible" :sel-project="xmProject" :isSelectSingleUser="1" @user-confirm="execGroupUserSelectConfirm"></xm-group-select>
		</el-drawer>
		<el-drawer append-to-body title="选择负责人"  :visible.sync="groupUserSelectVisible" size="60%"    :close-on-click-modal="false">
			<xm-group-select :xm-product="editForm.productId?{id:editForm.productId,productName:''}:null" :visible="groupUserSelectVisible" :sel-project="xmProject" :isSelectSingleUser="1" @user-confirm="groupUserSelectConfirm"></xm-group-select>
		</el-drawer>
		<el-drawer append-to-body title="新增技能"  :visible.sync="skillVisible" size="60%"    :close-on-click-modal="false">
			<skill-mng :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected"></skill-mng>
		</el-drawer>

		<el-drawer append-to-body title="需求选择"  :visible.sync="menuVisible" size="80%"   :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true" checkScope="3"  @selected="onMenuSelected" :sel-project="xmProject"></xm-menu-select>
		</el-drawer>
		
		<el-drawer title="选中任务"  :visible.sync="selectTaskVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-task-list :ptype="editForm.ptype" :xm-product="{id:editForm.productId,productName:''}" :sel-project="xmProject"   @task-selected="onSelectedTask"></xm-task-list>
		</el-drawer> 	
		
		<el-drawer :title="'任务'+editForm.name+'的候选人'"  :visible.sync="execUserVisible" fullscreen size="60%" append-to-body  :close-on-click-modal="false">
			<xm-execuser-mng :visible="execUserVisible" :xm-task="editForm"   @after-add-submit="afterAddExecSubmit" @after-edit-submit="afterEditExecSubmit" @after-delete-submit="afterEditExecSubmit" ref="execuserMng"></xm-execuser-mng>
		</el-drawer>

		<el-dialog append-to-body title="需求明细"  :visible.sync="menuDetailVisible" width="80%"  top="20px"  :close-on-click-modal="false">
			<xm-menu-edit :visible="menuDetailVisible"  :reload="true" :xm-menu="{menuId:editForm.menuId,menuName:editForm.menuName}" ></xm-menu-edit>
		</el-dialog>
			
		<el-drawer append-to-body title="标签"  :visible.sync="tagSelectVisible" size="60%">
			<tag-mng :tagIds="editForm.tagIds?editForm.tagIds.split(','):[]" :jump="true" @select-confirm="onTagSelected">
			</tag-mng>
		</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import {editXmTask,setTaskCreateUser,editXmTaskSomeFields } from '@/api/xm/core/xmTask';
	import { mapGetters } from 'vuex';
 	import {sn} from '@/common/js/sequence';
 	import xmSkillMng from '../xmTaskSkill/XmTaskSkillMng';
	import skillMng from "@/views/xm/core/skill/skillMng";
	import {batchAddSkill } from '@/api/xm/core/xmTaskSkill';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmTaskList from '../xmTask/XmTaskList';
	import XmExecuserMng from '../xmTaskExecuser/XmTaskExecuserForTask';
	import XmGroupSelect from '../xmGroup/XmGroupSelect.vue';
	import XmMenuRichDetail from '../xmMenu/XmMenuRichDetail';
	import TagMng from "@/views/mdp/arc/tag/TagMng";
	import XmRecord from '../xmRecord/XmRecord' 

	import XmSubWorkItem from "@/views/xm/core/xmTaskWorkItem/XmSubWorkItem";
	import xmQuestionForTask from "@/views/xm/core/xmQuestion/XmQuestionForTask";
	import XmTaskWorkloadRecord from "../xmTaskWorkload/XmTaskWorkloadRecord"
	import XmMenuEdit from '../xmMenu/XmMenuEdit.vue';
	import XmMyDoFocus from '../xmMyFocus/XmMyDoFocus.vue';
	import XmTaskExecuserForTask from '../xmTaskExecuser/XmTaskExecuserForTask.vue';
	export default { 
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),   
			calcTaskStep(){
				if(!this.editForm.executorUserid){
					return 1
				}else if(this.editForm.exeUsernames) {
					
					if(this.editForm.exeUsernames.indexOf('执行中')>=0){
						return 3
					}else if(this.editForm.exeUsernames.indexOf('已验收')>=0){
						return 4
					}else if(this.editForm.exeUsernames.indexOf('已验收')>=0){
						return 4
					}else if(this.editForm.exeUsernames.indexOf('已验收')>=0){
						return 4
					} if(this.editForm.exeUsernames.indexOf('已结算')>=0){
						return 5
					}
				}
			}
		},
		props:['xmTask','visible','xmProject',"parentTask"],
		watch: {
			'xmTask':function( xmTask ) {  
			},
			'visible':function(visible) { 
				this.fileVisible = visible;
				if(visible==true){ 
					this.editForm=Object.assign(this.editForm, this.xmTask);      
					this.editFormBak=Object.assign({},this.editForm)
					this.setSkills()
					this.activateTabPaneName="1"
					//从新打开页面时某些数据需要重新加载，可以在这里添加
				}
			}, 
		},
		data() { 
			const beginDate = new Date();
			const endDate = new Date();
			endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
			return {
				dicts:{
					priority:[],
					taskType:[],
					planType:[],
					priority:[],
					xmTaskSettleSchemel:[],
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					name: [
						{ required: true, message: '任务名称不能为空', trigger: 'change' },
						{ min: 2, max: 150, message: '长度在 2 到 150 个字符', trigger: 'change' },//长度

					],
					description: [ 
						{ max: 1000, message: '长度在 0 到 1000 个字符', trigger: 'change' },//长度 
					],
					taskState: [
						{ required: true, message: '请选择任务状态', trigger: 'change' }
					],  
					// execuser:[{
					// 	validator: validateExec, trigger: 'blur'
					// }],
				},
				//新增界面数据 xm_task
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'3',sortLevel:'0',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',taskOut:'0',
					rate:0,budgetAt:'',budgetWorkload:'',actAt:'',actWorkload:'',taskState:'0',taskClass:'0',toTaskCenter:'0',actStartTime:'',actEndTime:'',taskType:'4',planType:'w2',settleSchemel:'1',ntype:'0',childrenCnt:0,wtype:'',rworkload:0,
					uniInnerPrice:80,uniOutPrice:100,crowd:'0',oshare:'0',shareFee:0,menuName:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
 				menuVisible:false,
				menuDetailVisible:false,
				skillVisible: false,
				taskSkills: [],
				selectTaskVisible:false,
				execUserVisible:false,
				groupUserSelectVisible:false,
				execGroupUserSelectVisible:false,  
				pickerOptions:  util.getPickerOptions('datarange'),
				tagSelectVisible:false,
				subWorkItemNum:0,
				activateTabPaneName:'1'
				 /**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {  
			setSubWorkItemNum(val){
				this.subWorkItemNum=val;
			},
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
 				this.$emit('cancel');
			},
			//新增提交XmTask xm_task 父组件监听@submit="afterAddSubmit"
			editSubmit: function () { 
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							let params = Object.assign({}, this.editForm);   
							editXmTask(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['editForm'].resetFields();
									this.$emit('submit',res.data.data);//  @submit="aftereditSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: "表单验证不通过，请修改后提交", type: 'error' }); 
					}
				});
			}, 
			formatDate: function(time) {
				const date = new Date(time);
				const m = date.getMonth()+1;
				const d = date.getDate();
				return date.getFullYear()+"-"+(m < 10 ? "0"+m : m)+"-"+ (d < 10 ? "0"+d : d) + " 00:00:00";
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
 

			showSkill(){  
				this.skillVisible = true;
			},
			onMenuSelected:function(menu){
				this.editForm.menuId=menu.menuId
				this.editForm.menuName=menu.menuName
				this.editForm.productId=menu.productId
				this.editForm.productName=menu.productName
				this.editXmTaskSomeFields(this.editForm,'menuId',menu);
				this.menuVisible=false;
			},
			onTaskSkillsSelected(skills) {
				let taskSkill = [];
				skills.forEach(i=>{ 
					let obj = {
						taskId: this.editForm.id,
						taskSkillId: i.skillId,
						taskSkillName: i.skillName,
						skillRemarks: '',
					};
					taskSkill.push(obj);
				});
				this.taskSkills = taskSkill;
				batchAddSkill(taskSkill).then((res) => {
					this.load.add=false
					var tips=res.data.tips;
					if(tips.isOk){
						this.skillVisible = false; 
						// this.getXmTasks();
						this.$emit("submit",this.editForm)
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.add=false);
			}, 
			
			getWeekday(first, last) {
				//计算工作日方法：遍历这两个日期区间的每一个日期，获取他的getDay()

				//分别获取first和last的毫秒数(时间戳)
				first = first.getTime();
				last = last.getTime();

				var count = 0;
				for (var i = first; i <= last; i += 24 * 3600 * 1000) {
					var d = new Date(i);
					if (d.getDay() >= 1 && d.getDay() <= 5) {
						count++;
					}
				}
				return count;
			},
			toFixed(floatValue){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					return parseFloat(floatValue).toFixed(2);
				}
			},

			onBudgetDateRangerChange(){ 
				this.editXmTaskSomeFields(this.editForm,'dateRange',{startTime:this.editForm.startTime,endTime:this.editForm.endTime});
			},  
			onSelectedTask(task){
				this.selectTaskVisible=false;
				if(task){  
					this.editForm.preTaskid=task.id
					this.editForm.preTaskname=task.name
					
					this.editXmTaskSomeFields(this.editForm,'preTaskid',task);
				}
			},
			clearPreTask(){
					this.editForm.preTaskid=''
					this.editForm.preTaskname=''
			},
			goAnchor :function(id){  
       			document.querySelector("#"+id).scrollIntoView(true);
    		},
			setSkills(){
				if(this.editForm.taskSkillIds && this.editForm.taskSkillNames){
					var skillNames=this.editForm.taskSkillNames.split(","); 
					this.taskSkills=this.editForm.taskSkillIds.split(",").map((item,index)=>{
						return {
							taskId:this.editForm.id,
							taskSkillId:item,
							taskSkillName:skillNames[index]
						}
					})
				}
			},
			
			showExecusers() {
				this.execUserVisible = true;
			},
			
			toJoin(){
				if(this.editForm.exeUserids && this.editForm.exeUserids.indexOf(this.userInfo.userid)>=0){
					this.$notify.success("你已经加入该任务了");
					return;
				}
				this.execUserVisible=true;
				this.$nextTick(()=>{
					this.$refs.execuserMng.toJoin();

				})
			},
			/**end 在上面加自定义方法**/
			
			showGroupUserSelect:function(){
				this.groupUserSelectVisible=true;
			},
			groupUserSelectConfirm:function(users){
				if( users==null || users.length==0 ){
					this.groupUserSelectVisible=false; 
					return
				}   
				this.editForm.createUserid=users[0].userid
				this.editForm.createUsername=users[0].username 
				this.groupUserSelectVisible=false; 
				
				this.editXmTaskSomeFields(this.editForm,'createUserid',users[0] );
			},
			
			execGroupUserSelectConfirm:function(users){
				if( users==null || users.length==0 ){
					this.execGroupUserSelectVisible=false; 
					return
				} 
				this.editForm.executorUserid=users[0].userid
				this.editForm.executorUsername=users[0].username 
				this.execGroupUserSelectVisible=false; 
				this.editXmTaskSomeFields(this.editForm,'executorUserid',users[0]);
			},
			
			toMenu(){
				this.menuDetailVisible=true
			},
			
			afterAddExecSubmit(execForm){ 
				this.$emit("after-add-submit",execForm);
			},
			afterEditExecSubmit(execForm){  
				this.$emit("after-edit-submit",execForm);
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
				
				this.editXmTaskSomeFields(this.editForm,'tagIds',tags );
			},
			onAddSubTask(val){

			},
			
			editXmTaskSomeFields(row,fieldName,$event){
				var that=this;
				var func=(params)=>{
					editXmTaskSomeFields(params).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.$emit('edit-fields',params)
							Object.assign(row,params) 
							this.editFormBak=Object.assign({},row)
						}else{   
							Object.assign(this.editForm,this.editFormBak)
							this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
						}
					})
				}
				var params={ids:[row.id]}; 
				if(fieldName==='menuId'){
					if($event){
						params[fieldName]=$event.menuId;
						params.menuName=$event.menuName
            			params.productId=$event.productId
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
				}else if(fieldName==='executorUserid'){
					params.executorUserid=$event[0].userid
					params.executorUsername=$event[0].username
				}else if(fieldName==='createUserid'){
					params.createUserid=$event.userid
					params.createUsername=$event.username
				}else if(fieldName==='dateRange'){
					params.startTime=$event.startTime
					params.endTime=$event.endTime
				}else if(fieldName==='shareFee'){ 
					if($event>1000){
						this.editForm.shareFee=this.xmTask.shareFee
						this.$notify({position:'bottom-left',showClose:true,message:'分享佣金不能超过1000元',type: 'error'})
						return;
					}else if(!this.editForm.budgetAt){
						this.editForm.shareFee=this.xmTask.shareFee
						this.$notify({position:'bottom-left',showClose:true,message:'请先设置预算金额',type: 'error'})
						return;
					}else if(this.editForm.shareFee/this.editForm.budgetAt>0.05){
						this.editForm.shareFee=this.xmTask.shareFee
						this.$notify({position:'bottom-left',showClose:true,message:'分享佣金不能超过预算金额的5%',type: 'error'})
						return;
					}
					params.shareFee=$event
				}else{
					params[fieldName]=$event
				}
				
				
				if(fieldName=='description'){
					this.$refs.editForm.validateField('description',err=>{
						if(err){ 
							this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
							return;
						}else{
							func(params)
						}
					})
				}else if(fieldName=='name'){  
					this.$refs.editForm.validateField('name',err=>{
						if(err){
							this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
							return;
						}else{
							func(params)
						}
					})
				}else{
					func(params)
				}
			},
		},//end method
		components: { 
 			xmSkillMng,
			skillMng,xmMenuSelect,XmTaskList,XmExecuserMng,XmGroupSelect,XmMenuRichDetail,TagMng,XmSubWorkItem,XmTaskWorkloadRecord,XmMenuEdit,
			XmRecord,xmQuestionForTask,XmMyDoFocus,XmTaskExecuserForTask
			//在下面添加其它组件 'xm-task-edit':XmTaskEdit
		},
		mounted() { 
			this.editForm=Object.assign(this.editForm, this.xmTask);    
			this.editFormBak=Object.assign({},this.editForm)
			this.setSkills();
			initSimpleDicts('all',['planType','taskType','priority','xmTaskSettleSchemel','taskState']).then(res=>{
				this.dicts=res.data.data;
			})
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
.el-form-item{
	margin-bottom: 15px;
}
.el-form-item__content{
	margin-left: 0;
}

.icon {
  color: #fff;
  height: 20px;
  width: 20px;
  border-radius: 15px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  display: inline-block;
  margin-right: 5px;
} 
</style>