<template>
	<section class="page-container padding">  
		<el-row class="page-main ">
			<!--新增界面 XmTask xm_task--> 
			<el-form :model="editForm"  label-width="100px" :rules="editFormRules" ref="editForm">     
				<el-card class="box-card" header="基础信息" id="baseInfo" shadow="hover">  
					<el-form-item label="" prop="ntype">
						 <el-radio v-model="editForm.ntype" label="1">计划项</el-radio>
						 <el-radio v-model="editForm.ntype" label="0">任务</el-radio>
					</el-form-item>
					<el-form-item label="名称" prop="name">
						<el-row>
						<el-col :span="24" style="padding-left:10px;">
							<el-input v-model="editForm.name" placeholder="名称" ></el-input>
							<el-tooltip content="归属项目"><el-tag>{{editForm.projectName}}</el-tag></el-tooltip>
							<el-divider direction="vertical"></el-divider>
							<el-tooltip content="上级" ><el-tag>{{editForm.parentTaskid?(editForm.parentTaskname?editForm.parentTaskname:editForm.parentTaskid):"无上级"}}</el-tag></el-tooltip>
						</el-col>
						</el-row>
					</el-form-item> 
					<el-form-item label="序号" prop="sortLevel"> 
						<el-input  v-model="editForm.sortLevel" style="width:30%;"   placeholder="如1.0或者1.2.3等" ></el-input> <font style="color:red;">如1.0或者1.2.3等</font>
						<br/><el-checkbox v-model="editForm.milestone" :true-label="1" :false-label="0">标记为里程碑</el-checkbox>
					</el-form-item>  
					<el-form-item label="前置"> 
						<el-tag v-if="editForm.preTaskid"  @close="clearPreTask" closable >{{editForm.preTaskname}}</el-tag>
						<el-button    @click.stop="selectTaskVisible=true"  >选前置</el-button> 
					</el-form-item>  
					<el-row>
						<el-col :span="8">
							<el-form-item label="状态">  
								<el-select v-model="editForm.taskState">
									<el-option value="0" label="待领取"></el-option>
									<el-option value="1" label="已领取执行中"></el-option>
									<el-option value="2" label="已完工"></el-option>
									<el-option value="3" label="已结算"></el-option>
								</el-select>   
							</el-form-item> 
						</el-col>
						<el-col :span="8">
							<el-form-item  label="紧急程度" prop="level">  
								<el-select v-model="editForm.level">
										<el-option v-for="i in options.urgencyLevel" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option> 
								</el-select>    
							</el-form-item>  
						</el-col>
						<el-col :span="8">
							<el-form-item  label="类型" prop="taskType">   
								<el-select v-model="editForm.taskType">
									<el-option v-for="i in this.options.taskType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
								</el-select>  
							</el-form-item>   
						</el-col>
					</el-row>
					 
					<el-form-item  label="所属需求" prop="menuId" id="menuInfo" v-if="editForm.ntype!='1'"> 
						{{editForm.menuName}} &nbsp;&nbsp;&nbsp; <el-link @click="menuVisible=true" type="primary">{{editForm.menuName?'更改':'设置'}}</el-link>&nbsp;&nbsp;&nbsp;
						<el-link v-if="editForm.menuName" @click="toMenu" type="primary">查看需求</el-link>
					</el-form-item> 
					<el-row>  
						<el-col :span="12"> 
							<el-form-item prop="skill" label="技能要求"  v-if="editForm.ntype!='1'">
								<el-button class="useradd-icon" type="text" @click.stop="showSkill()" icon="el-icon-circle-plus-outline">增加</el-button>
								<el-tag class="fs-ft" style="margin-right:10px" v-for="(item,i) in taskSkills" :key="i">{{item.taskSkillName}}</el-tag>
							</el-form-item> 
						</el-col>
						<el-col :span="12">
							<el-form-item  label="标签" prop="tagNames">   
								<el-tag v-if="editForm.tagNames">{{editForm.tagNames?editForm.tagNames:''}} </el-tag>
								<el-button type="text" icon="el-icon-plus" @click="tagSelectVisible=true">标签</el-button> 
							</el-form-item>   
						</el-col>
					</el-row> 

					<el-form-item :label="editForm.ntype=='1'?'计划描述':'任务描述'" prop="description">
						<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="editForm.description" :placeholder="editForm.ntype=='1'?'计划描述':'任务描述'" ></el-input>
					</el-form-item>   
				</el-card>  
 				<el-card class="box-card" id="planInfo" header="进度预测" shadow="hover"> 
					<el-form-item label="负责人"> 
						<el-tag  v-if="editForm.createUserid" style="margin-left:10px;border-radius:30px;"  >{{editForm.createUsername}}</el-tag>
 						<el-button  @click="showGroupUserSelect(editForm)" icon="el-icon-setting">设置负责人</el-button>
					</el-form-item> 
					<el-form-item label="执行人" prop="executorUsername">
						<el-tag  v-if="editForm.executorUserid" style="margin-left:10px;border-radius:30px;"  >{{editForm.executorUsername}}</el-tag>
 						<el-button  @click="execGroupUserSelectVisible=true" icon="el-icon-setting">设置执行人</el-button>
					</el-form-item>
					<el-form-item label="预计时间"> 
							<el-tooltip content="计划类型">
								<el-select v-model=" editForm.planType" style="width:20%;">
									<el-option v-for="i in this.options.planType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
								</el-select> 
							</el-tooltip>
							<el-date-picker
								v-model="budgetDateRanger"
								@change="onBudgetDateRangerChange"
								class="hidden-sm-and-down"
								type="daterange"
								align="right"
								unlink-panels
								range-separator="至"
								start-placeholder="计划开始日期"
								end-placeholder="计划完成日期"
								value-format="yyyy-MM-dd HH:mm:ss"
								:default-time="['00:00:00','23:59:59']"
								:picker-options="pickerOptions"
							></el-date-picker> 
					</el-form-item>   
					<el-form-item label="实际时间" prop="actStartTime">
							<el-date-picker
								v-model="actDateRanger"
								class="hidden-sm-and-down"
								type="daterange"
								align="right"
								unlink-panels
								range-separator="至"
								start-placeholder="实际开始日期"
								end-placeholder="实际完成日期"
								value-format="yyyy-MM-dd HH:mm:ss"
								:default-time="['00:00:00','23:59:59']"
								:picker-options="pickerOptions"
							></el-date-picker> 
					</el-form-item>  
					<el-form-item label="实际进度" prop="rate">
						<el-slider
							v-model="editForm.rate"
							show-input>
						</el-slider> 
					</el-form-item>  
							
				</el-card>

 				<el-card class="box-card" header="工作量、成本" id="costInfo"> 
					<el-form-item label="预估工作量" prop="budgetWorkload">
						<el-input-number style="width:200px;"  v-model="editForm.budgetWorkload" @change="onBudgetWorkloadChange" :precision="2" :step="8" :min="0" placeholder="预计总工作量(人时,不包括下一级)"></el-input-number> <el-tag>人时，{{this.toFixed(editForm.budgetWorkload/8/20)}}人月</el-tag> 
						 <br>
						 <el-checkbox v-model="editForm.taskOut" @change="onTaskOutChange" true-label="1" false-label="0">是否为众包任务</el-checkbox> 
					</el-form-item>  
					<el-form-item label="预估金额" prop="taskOut">
						<el-row v-if="editForm.taskOut!=='1'">
							工时单价&nbsp;<el-input-number style="width:200px;"  v-model="editForm.uniInnerPrice" :precision="2" :step="10" :min="0" placeholder="工时单价"></el-input-number>   元/人时
 						</el-row> 
						<el-row v-if="editForm.taskOut==='1'">
 							工时单价&nbsp;<el-input-number style="width:200px;" v-if="editForm.taskOut==='1'" v-model="editForm.uniOutPrice" :precision="2" :step="10" :min="0" placeholder="外发工时单价"></el-input-number>   元/人时
						</el-row>
						
						预估金额&nbsp;<el-input-number style="width:200px;"  v-model="editForm.budgetCost" :precision="2" :step="1000" :min="0" placeholder="预算金额"></el-input-number>   元
					</el-form-item>  
					<el-form-item  label="实际工作量" prop="actWorkload" shadow="hover">
						<el-input-number style="width:200px;"  disabled v-model="editForm.actWorkload" :precision="2" :step="8" :min="0" placeholder="实际工作量"></el-input-number>  <el-tag>由后台自动计算，无需填写</el-tag>     
					</el-form-item> 
					<el-form-item label="实际金额" prop="actCost">
						<el-input-number  style="width:200px;"  disabled v-model="editForm.actCost" :precision="2" :step="1000" :min="0" placeholder="实际金额"></el-input-number>    <el-tag>由后台自动计算，无需填写</el-tag>  
					</el-form-item>   
				 </el-card>  
 				<el-card class="box-card" header="结算信息" id="settleInfo" shadow="hover" v-if="editForm.ntype!='1'">   
					<el-form-item label="" prop="taskClass">
						<el-checkbox v-model="editForm.taskClass" true-label="1" false-label="0">是否需要结算</el-checkbox> 
					</el-form-item>  
					<el-form-item v-if="editForm.taskClass=='1'" label="结算方案" prop="settlSchemel"> 
						<el-select v-model=" editForm.settleSchemel">
							<el-option v-for="i in options.xmTaskSettleSchemel" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
						</el-select>
					</el-form-item>   
				 </el-card>
				 
				<el-card class="box-card" header="众包" id="taskOut" v-if="editForm.ntype!='1'">  
					<el-form-item label="" prop="toTaskCenter"> 
						<el-checkbox v-model="editForm.toTaskCenter" true-label="1" false-label="0" id="toTaskCenter">发布到互联网任务大厅</el-checkbox>  
					</el-form-item>   
					<el-form-item label="众包流程" prop="taskOut" v-if="editForm.taskOut=='1'">
						 <el-steps :active="calcTaskStep" align-center finish-status="success" simple>
							<el-step title="发布" description="任务创建成功后即发布"></el-step>
							<el-step title="竞标" description="候选人参与竞标，或者由责任人主动设置候选人"></el-step>
							<el-step title="执行" description="候选人中标后，成为执行人，执行任务"></el-step>
							<el-step title="验收" description="任务完成后提交验收，验收通过，即可进行结算"></el-step>
							<el-step title="结算" description="提交结算申请审批流程，审批过程自动根据审批结果进行结算"></el-step>
							<el-step title="企业付款" description="结算流程审批通过，自动付款到个人钱包"></el-step> 
							<el-step title="提现" description="企业付款完成后，个人对钱包中余额进行提现"></el-step> 
						</el-steps>
					</el-form-item> 
				 </el-card>   
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
			<xm-group-select :visible="execGroupUserSelectVisible" :sel-project="xmProject" :isSelectSingleUser="1" @user-confirm="execGroupUserSelectConfirm"></xm-group-select>
		</el-drawer>
		<el-drawer append-to-body title="选择负责人"  :visible.sync="groupUserSelectVisible" size="60%"    :close-on-click-modal="false">
			<xm-group-select :visible="groupUserSelectVisible" :sel-project="xmProject" :isSelectSingleUser="1" @user-confirm="groupUserSelectConfirm"></xm-group-select>
		</el-drawer>
		<el-drawer append-to-body title="新增技能"  :visible.sync="skillVisible" size="60%"    :close-on-click-modal="false">
			<skill-mng :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected"></skill-mng>
		</el-drawer>

		<el-drawer append-to-body title="需求选择"  :visible.sync="menuVisible" size="80%"   :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true"  @selected="onMenuSelected" :sel-project="xmProject"></xm-menu-select>
		</el-drawer>
		
		<el-drawer title="选中任务"  :visible.sync="selectTaskVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-task-list  :sel-project="xmProject"   @task-selected="onSelectedTask"></xm-task-list>
		</el-drawer> 	
		
		<el-drawer :title="'任务'+editForm.name+'的候选人'"  :visible.sync="execUserVisible" fullscreen size="60%" append-to-body  :close-on-click-modal="false">
			<xm-execuser-mng :visible="execUserVisible" :xm-task="editForm"   @after-add-submit="afterAddExecSubmit" @after-edit-submit="afterEditExecSubmit" @after-delete-submit="afterEditExecSubmit" ref="execuserMng"></xm-execuser-mng>
		</el-drawer>

		<el-drawer append-to-body title="需求明细"  :visible.sync="menuDetailVisible" size="80%"    :close-on-click-modal="false">
			<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="true" :xm-menu="{menuId:editForm.menuId,menuName:editForm.menuName}" ></xm-menu-rich-detail>
		</el-drawer>
			
		<el-drawer append-to-body title="标签"  :visible.sync="tagSelectVisible" size="60%">
			<tag-mng :tagIds="editForm.tagIds?editForm.tagIds.split(','):[]" :jump="true" @select-confirm="onTagSelected">
			</tag-mng>
		</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
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
				options:{
					urgencyLevel:[],
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
					taskType: [
						{ required: true, message: '请选择任务类型', trigger: 'blur' }
					],
					taskClass: [
						{ required: true, message: '请选择是否结算', trigger: 'blur' }
					],
					toTaskCenter: [
						{ required: true, message: '请选择是否发布', trigger: 'blur' }
					],   
					sortLevel: [
						{ required: true, message: '排序号不能为空', trigger: 'blur' }
					],   
					// execuser:[{
					// 	validator: validateExec, trigger: 'blur'
					// }],
				},
				//新增界面数据 xm_task
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'3',sortLevel:'0',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',taskOut:'0',
					rate:0,budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'0',taskClass:'0',toTaskCenter:'0',actStartTime:'',actEndTime:'',taskType:'kf',planType:'w2',settleSchemel:'quotePrice',ntype:'0',childrenCnt:0
  
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
				 /**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {  
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
					if(this.projectPhase.phaseBudgetOutUserPrice){ 
						price=this.projectPhase.phaseBudgetOutUserPrice
					} 
				}else{
					if(this.projectPhase.phaseBudgetInnerUserPrice){ 
						price=this.projectPhase.phaseBudgetInnerUserPrice
					} 
				}
				this.editForm.budgetCost=this.editForm.budgetWorkload * price 
			},
			onBudgetWorkloadChange(){
 				var price=80;
				if(this.editForm.taskOut=='1'){
					if(	this.projectPhase && this.projectPhase.phaseBudgetOutUserPrice){ 
						price=this.projectPhase.phaseBudgetOutUserPrice
					}else if( this.xmProject && this.xmProject.planOutUserPrice){
						price=this.xmProject.planOutUserPrice
					}
				}else{
					if(	this.projectPhase && this.projectPhase.phaseBudgetInnerUserPrice){ 
						price=this.projectPhase.phaseBudgetInnerUserPrice
					}else if( this.xmProject && this.xmProject.planInnerUserPrice){
						price=this.xmProject.planInnerUserPrice
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
		},//end method
		components: { 
 			xmSkillMng,
			skillMng,xmMenuSelect,XmTaskList,XmExecuserMng,XmGroupSelect,XmMenuRichDetail,TagMng,
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
			listOption([{categoryId:'all',itemCode:'planType'},{categoryId:'all',itemCode:'taskType'},{categoryId:'all',itemCode:'urgencyLevel'},{categoryId:'all',itemCode:'priority'},{categoryId:'all',itemCode:'xmTaskSettleSchemel'}]).then(res=>{
				this.options=res.data.data;
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
</style>