<template>
	<section>  
		<el-row>
			<!--新增界面 XmTask xm_task--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
						<el-row :gutter="10">
							<el-col :span="6">
								<el-form-item label="序号" prop="sortLevel" >  
									<template slot="label"> 
									<div    class="icon" :style="{backgroundColor:   editForm.ntype==='0'?'#409EFF':'#E6A23C'}">
										<i :class="  editForm.ntype==='0'?'el-icon-s-operation':'el-icon-odometer' " ></i>
									</div>  
									{{editForm.ntype==='0'?'序号/任务':'序号/计划'}}
									</template>
									<el-input  v-model="editForm.sortLevel"    placeholder="如1.0或者1.2.3等" title="序号，如1.0、1.1.1或者1，2，3等"></el-input> 
 
								</el-form-item>  
							</el-col>
							<el-col :span="18"> 
								<el-form-item label="" prop="name" label-width="0"> 
										<el-input v-model="editForm.name" placeholder="名称" ></el-input>   
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
									
									<el-select v-model="editForm.taskState">
											<el-option v-for="i in dicts.taskState" :label="i.name" :key="i.id" :value="i.id"></el-option> 
									</el-select>    
								</el-form-item> 
							</el-col>
							<el-col :span="8"> 
								<el-form-item label="当前进度" prop="rate">
									<el-progress   
										:percentage="editForm.rate?editForm.rate:0">
									</el-progress> 
								</el-form-item>  
							</el-col>  
							<el-col :span="8"> 
								<el-form-item label="预计时间"> 
											
										<el-date-picker  
										 style="display:inline;"
											v-model="budgetDateRanger"
											@change="onBudgetDateRangerChange" 
											type="daterange"
											align="right"
											unlink-panels
											range-separator="-"
											start-placeholder="开始日期"
											end-placeholder="完成日期"
											value-format="yyyy-MM-dd HH:mm:ss"
											:default-time="['00:00:00','23:59:59']"
											:picker-options="pickerOptions"
										></el-date-picker>
								</el-form-item>  
							</el-col> 

							
						</el-row>
					<el-tabs value="1" accordion>
						<el-tab-pane label="基础信息" name="1"> 	
						<el-row>  
							<el-col :span="10">
								<el-form-item  label="" prop="milestone">  
									<el-checkbox v-model="editForm.milestone" :true-label="1" :false-label="0">里程碑</el-checkbox>
									<el-checkbox v-model="editForm.taskOut" @change="onTaskOutChange" true-label="1" false-label="0">众包</el-checkbox>
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
									<el-select v-model="editForm.level">
											<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option> 
									</el-select>    
								</el-form-item>  
							</el-col>
							<el-col :span="12"> 
								<el-form-item label="工期类型"> 
								<el-select v-model=" editForm.planType">
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
									<el-select v-model="editForm.taskType">
										<el-option v-for="i in this.dicts.taskType" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>  
								</el-form-item>   
							</el-col>
						</el-row>  
					</el-tab-pane>
					<el-tab-pane label="概述" name="2">  
						<el-form-item  label="任务概述" prop="description">  
 							<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="editForm.description" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input> 
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
							 <xm-sub-work-item :parent-xm-task="editForm"  @sub-work-item-num="setSubWorkItemNum" @add-sub-task="onAddSubTask"></xm-sub-work-item>
					</el-tab-pane>
					<el-tab-pane label="工时" name="5"> 
						 <xm-task-workload-record :xm-task="editForm"></xm-task-workload-record>
					</el-tab-pane>
					<el-tab-pane label="成本" name="6"> 
						<el-form-item label="预估金额" prop="budgetCost">
							<el-row v-if="editForm.taskOut!=='1'">
								工时单价&nbsp;<el-input type="number" style="width:150px;"   v-model="editForm.uniInnerPrice" :precision="2" :step="10" :min="0" placeholder="工时单价"></el-input type="number">   元/h
							</el-row> 
							<el-row v-if="editForm.taskOut==='1'">
								工时单价&nbsp;<el-input type="number" style="width:150px;"   v-if="editForm.taskOut==='1'" v-model="editForm.uniOutPrice" :precision="2" :step="10" :min="0" placeholder="外发工时单价"></el-input type="number">   元/h
							</el-row>
							<el-row>
								预估金额&nbsp;<el-input type="number" style="width:150px;"    v-model="editForm.budgetCost" :precision="2" :step="100" :min="0" placeholder="预算金额"></el-input type="number">   元
							</el-row>
						</el-form-item> 

					</el-tab-pane>
					<el-tab-pane label="结算信息" name="7" v-if="editForm.ntype!='1'">
						<el-form-item label="" prop="taskClass">
							<el-checkbox v-model="editForm.taskClass" true-label="1" false-label="0">是否需要结算</el-checkbox>
						</el-form-item>
						<el-form-item v-if="editForm.taskClass=='1'" label="结算方案" prop="settlSchemel">
							<el-select v-model=" editForm.settleSchemel">
								<el-option v-for="i in dicts.xmTaskSettleSchemel" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="众包" name="8" v-if="editForm.ntype!='1' && editForm.taskOut=='1'">
					 
					<el-checkbox v-model="editForm.toTaskCenter" true-label="1" false-label="0" id="taskOut">发布到互联网任务大厅</el-checkbox>  
					 
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
				</el-tabs>   
			</el-form>
		</el-row>
		<el-row class="padding">
			<el-button @click.native="handleCancel">取消</el-button>  
			<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>   	
		</el-row>

		<!-- <el-drawer append-to-body :title="'技能要求'" :visible.sync="skillVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-skill-mng :visible="skillVisible" :task-id="editForm.id" @cancel="skillVisible=false" @getSkill="getSkill"></xm-skill-mng>
		</el-drawer> -->
		<el-drawer append-to-body title="选择执行人"  :visible.sync="execGroupUserSelectVisible" size="60%"    :close-on-click-modal="false">
			<xm-group-select :pgClass="editForm.ptype" :xm-product="editForm.productId?{id:editForm.productId,productName:''}:null" :visible="execGroupUserSelectVisible" :sel-project="xmProject" :isSelectSingleUser="1" @user-confirm="execGroupUserSelectConfirm"></xm-group-select>
		</el-drawer>
		<el-drawer append-to-body title="选择负责人"  :visible.sync="groupUserSelectVisible" size="60%"    :close-on-click-modal="false">
			<xm-group-select :pgClass="editForm.ptype" :xm-product="editForm.productId?{id:editForm.productId,productName:''}:null" :visible="groupUserSelectVisible" :sel-project="xmProject" :isSelectSingleUser="1" @user-confirm="groupUserSelectConfirm"></xm-group-select>
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
	import {editXmTask,setTaskCreateUser } from '@/api/xm/core/xmTask';
	import { mapGetters } from 'vuex';
 	import {sn} from '@/common/js/sequence';
 	import xmSkillMng from '../xmTaskSkill/XmTaskSkillMng';
	import skillMng from "@/views/xm/core/skill/skillMng";
	import {batchAddSkill } from '@/api/xm/core/xmTaskSkill';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmTaskList from '../xmTask/XmTaskList';
	import XmExecuserMng from '../xmTaskExecuser/XmTaskExecuserMng';
	import XmGroupSelect from '../xmGroup/XmGroupSelect.vue';
	import XmMenuRichDetail from '../xmMenu/XmMenuRichDetail';
	import TagMng from "@/views/mdp/arc/tag/TagMng";

	import XmSubWorkItem from "@/views/xm/core/xmTaskWorkItem/XmSubWorkItem";
	import XmTaskWorkloadRecord from "../xmTaskWorkload/XmTaskWorkloadRecord"
import XmMenuEdit from '../xmMenu/XmMenuEdit.vue';
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
		props:['xmTask','visible','xmProject','projectPhase',"parentTask"],
		watch: {
			'xmTask':function( xmTask ) {  
			},
			'visible':function(visible) { 
				this.fileVisible = visible;
				if(visible==true){ 
					this.editForm=Object.assign(this.editForm, this.xmTask);     
					if(this.editForm.startTime && this.editForm.endTime){
						this.budgetDateRanger=[this.editForm.startTime,this.editForm.endTime] 
					}else{
						this.budgetDateRanger=[]
					}
					if(this.editForm.actStartTime && this.editForm.actEndTime){
						this.actDateRanger=[this.editForm.actStartTime,this.editForm.actEndTime] 
					}else{
						this.actDateRanger=[]
					}
					 
					
					this.setSkills()
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
						{ required: true, message: '任务名称不能为空', trigger: 'blur' }
					],
					taskState: [
						{ required: true, message: '请选择任务状态', trigger: 'blur' }
					],  
					// execuser:[{
					// 	validator: validateExec, trigger: 'blur'
					// }],
				},
				//新增界面数据 xm_task
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'3',sortLevel:'0',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',taskOut:'0',
					rate:0,budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'0',taskClass:'0',toTaskCenter:'0',actStartTime:'',actEndTime:'',taskType:'4',planType:'w2',settleSchemel:'1',ntype:'0',childrenCnt:0,wtype:'',
  
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
				budgetDateRanger: [
					util.formatDate.format(beginDate, "yyyy-MM-dd HH:mm:ss"),
					util.formatDate.format(endDate, "yyyy-MM-dd HH:mm:ss")
				], 
				actDateRanger: [
				],  
				pickerOptions:  util.pickerOptions('datarange'),
				tagSelectVisible:false,
				subWorkItemNum:0,
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
							if(this.budgetDateRanger.length>=2){
								params.startTime=this.budgetDateRanger[0]
								params.endTime=this.budgetDateRanger[1] 
							}
							if(this.actDateRanger.length>=2){
								params.actStartTime=this.actDateRanger[0]
								params.actEndTime=this.actDateRanger[1]
							} 
							editXmTask(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['editForm'].resetFields();
									this.$emit('submit',res.data.data);//  @submit="aftereditSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}else{
						this.$notify({showClose: true, message: "表单验证不通过，请修改后提交", type: 'error' }); 
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
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
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
				var start= new Date(this.budgetDateRanger[0]);
				var end= new Date(this.budgetDateRanger[1]);
				var weekday=this.getWeekday(start,end);
				 
				this.editForm.budgetWorkload=weekday * 8
				var price=80;
				if(this.editForm.taskOut=='1'){
					if(this.projectPhase.budgetOuserPrice){ 
						price=this.projectPhase.budgetOuserPrice
					} 
				}else{
					if(this.projectPhase.budgetIuserPrice){ 
						price=this.projectPhase.budgetIuserPrice
					} 
				}
				this.editForm.budgetCost=this.editForm.budgetWorkload * price 
			},
			onBudgetWorkloadChange(){
 				var price=80;
				if(this.editForm.taskOut=='1'){
					if(	this.projectPhase && this.projectPhase.budgetOuserPrice){ 
						price=this.projectPhase.budgetOuserPrice
					}else if( this.xmProject && this.xmProject.planOuserPrice){
						price=this.xmProject.planOuserPrice
					}
				}else{
					if(	this.projectPhase && this.projectPhase.budgetIuserPrice){ 
						price=this.projectPhase.budgetIuserPrice
					}else if( this.xmProject && this.xmProject.planIuserPrice){
						price=this.xmProject.planIuserPrice
					} 
				}
				this.editForm.budgetCost=this.editForm.budgetWorkload * price 
			},
			onTaskOutChange(){
				this.onBudgetWorkloadChange();
			},
			onSelectedTask(task){
				this.selectTaskVisible=false;
				if(task){  
					this.editForm.preTaskid=task.id
					this.editForm.preTaskname=task.name
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
			},
			
			execGroupUserSelectConfirm:function(users){
				if( users==null || users.length==0 ){
					this.execGroupUserSelectVisible=false; 
					this.editForm.executorUserid='';
					this.editForm.executorUsername=''
					return
				}
				this.editForm.executorUserid=users[0].userid
				this.editForm.executorUsername=users[0].username 
				this.execGroupUserSelectVisible=false; 
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
			},
			onAddSubTask(val){

			}
		},//end method
		components: { 
 			xmSkillMng,
			skillMng,xmMenuSelect,XmTaskList,XmExecuserMng,XmGroupSelect,XmMenuRichDetail,TagMng,XmSubWorkItem,XmTaskWorkloadRecord,XmMenuEdit,
			//在下面添加其它组件 'xm-task-edit':XmTaskEdit
		},
		mounted() { 
			this.editForm=Object.assign(this.editForm, this.xmTask);   
			if(this.editForm.startTime && this.editForm.endTime){
				this.budgetDateRanger=[this.editForm.startTime,this.editForm.endTime] 
			}else{
				this.budgetDateRanger=[]
			}
			if(this.editForm.actStartTime && this.editForm.actEndTime){
				this.actDateRanger=[this.editForm.actStartTime,this.editForm.actEndTime] 
			}else{
				this.actDateRanger=[]
			}
			
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