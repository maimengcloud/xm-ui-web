<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 XmTask xm_task--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="项目名称">
					<span>{{addForm.projectName}}</span>
				</el-form-item>
				<el-form-item v-if="parentTask!=null" label="父任务名称">
					<span>{{parentTask.sortLevel}}</span>&nbsp;&nbsp;<span>{{parentTask.name}}</span>
				</el-form-item>
				
				<el-form-item v-else label="父任务名称">
					无上级
				</el-form-item>
				<el-form-item label="任务名称" prop="name">
					<el-input v-model="addForm.name" placeholder="任务名称" ></el-input>
				</el-form-item>
				
				<el-form-item label="排序号" prop="sortLevel">
					<el-input  v-model="addForm.sortLevel"    placeholder="如1.0或者1.2.3等" ></el-input><span v-if="parentTask" style="color:red">建议：{{parentTask.sortLevel}}.1</span>
				</el-form-item>
				<el-form-item  label="计划类型" prop="planType"> 
					<el-select v-model=" addForm.planType">
						<el-option v-for="i in this.options.planType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item  label="任务类型" prop="taskType"> 
					<el-select v-model=" addForm.taskType">
						<el-option v-for="i in this.options.taskType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item  label="所属故事" prop="menuId"> 
					 {{addForm.menuId}}:{{addForm.menuName}} <el-button @click="menuVisible=true" round>选择归属故事</el-button>
				</el-form-item>
				
				<el-form-item label="紧急程度" prop="level">
					<el-radio-group v-model="addForm.level">
						<el-radio v-for="i in options.urgencyLevel" :label="i.optionValue" :key="i.optionValue">{{i.optionName}}</el-radio> 
					</el-radio-group> 
				</el-form-item> 
				<el-form-item label="里程碑" prop="milestone">
					<el-checkbox v-model="addForm.milestone" :true-label="1" :false-label="0">标记为里程碑</el-checkbox>
				</el-form-item>  
				<el-form-item prop="skill" label="技能要求">
					<el-button class="useradd-icon" type="text" @click.stop="showSkill()" icon="el-icon-circle-plus-outline">增加</el-button>
					<el-tag class="fs-ft" style="margin-right:10px" v-for="(item,i) in taskSkills" :key="i">{{item.taskSkillName}}</el-tag>
				</el-form-item>
				<el-form-item label="前置任务名称"> 
					<el-tag v-if="addForm.preTaskid"  @close="clearPreTask" closable >{{addForm.preTaskname}}</el-tag>
					<el-button    @click.stop="selectTaskVisible=true"  >选前置任务</el-button>

				</el-form-item>
				<el-form-item label="预计时间"> 
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
				
				<el-form-item label="预估工作量" prop="budgetWorkload">
					<el-input-number v-model="addForm.budgetWorkload" @change="onBudgetWorkloadChange" :precision="2" :step="8" :min="0" placeholder="预计总工作量(人时,不包括下一级)"></el-input-number> <el-tag>人时，{{this.toFixed(addForm.budgetWorkload/8/20)}}人月</el-tag> 
				</el-form-item>  
				<el-form-item label="预估金额" prop="taskOut">
					<el-checkbox v-model="addForm.taskOut" @change="onTaskOutChange" true-label="1" false-label="0">外包任务</el-checkbox> 
					<el-input-number v-model="addForm.budgetCost" :precision="2" :step="1000" :min="0" placeholder="预算金额"></el-input-number>   元
				</el-form-item>  
				<!-- 
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

				--->
				<el-form-item label="任务描述" prop="description">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="addForm.description" placeholder="任务描述" ></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remarks">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="addForm.remarks" placeholder="备注" ></el-input>
				</el-form-item> 
				<!-- 
				<el-form-item label="实际工作量" prop="actWorkload">
					<el-input-number v-model="addForm.actWorkload" :precision="2" :step="8" :min="0" placeholder="实际工作量"></el-input-number>  <el-tag>参考{{refActWorkload}}人时，{{this.toFixed(refActWorkload/8/20)}}人月</el-tag>     
				</el-form-item> 
				<el-form-item label="实际金额" prop="actCost">
					<el-input-number v-model="addForm.actCost" :precision="2" :step="1000" :min="0" placeholder="实际金额"></el-input-number>    
				</el-form-item> 
				-->
				<!-- 
				<el-form-item label="任务状态" prop="taskState">
					<el-radio-group v-model="addForm.taskState">
						<el-radio label="0">待领取</el-radio>
						<el-radio label="1">已领取执行中</el-radio>
						<el-radio label="2">已完工</el-radio>
						<el-radio label="3">已结算</el-radio>
					</el-radio-group>
				</el-form-item> 
				-->
				<el-form-item label="其它配置" prop="taskClass">
					<el-checkbox v-model="addForm.taskClass" true-label="1" false-label="0">是否需要结算</el-checkbox>
					<el-checkbox v-model="addForm.toTaskCenter" true-label="1" false-label="0">发布到互联网任务大厅</el-checkbox>  
				</el-form-item>  
				<el-form-item v-if="addForm.taskClass=='1'" label="结算方案" prop="settlSchemel"> 
					<el-select v-model=" addForm.settleSchemel">
						<el-option v-for="i in options.xmTaskSettleSchemel" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
					</el-select>
				</el-form-item>  
				<!-- 
				<el-form-item label="任务创建人">
					<span>{{userInfo.username}}</span>
				</el-form-item>
				-->
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
 

		<!-- <el-dialog append-to-body :title="'技能要求'" :visible.sync="skillVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
			<xm-skill-mng :visible="skillVisible" :task-id="addForm.id" @cancel="skillVisible=false" @getSkill="getSkill"></xm-skill-mng>
		</el-dialog> -->

		<el-dialog append-to-body title="新增技能" :visible.sync="skillVisible" width="50%"    :close-on-click-modal="false">
			<skill-mng :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected"></skill-mng>
		</el-dialog>

		<el-dialog append-to-body title="故事选择" :visible.sync="menuVisible" fullscreen    :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true"  @selected="onMenuSelected" :sel-project="xmProject"></xm-menu-select>
		</el-dialog>
		
		<el-dialog title="选中任务" :visible.sync="selectTaskVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
			<xm-task-list  :sel-project="xmProject"   @task-selected="onSelectedTask"></xm-task-list>
		</el-dialog> 	
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import {addTask, addXmTask } from '@/api/xm/core/xmTask';
	import { mapGetters } from 'vuex';
 	import {sn} from '@/common/js/sequence';
 	import xmSkillMng from '../xmTaskSkill/XmTaskSkillMng';
	import skillMng from "@/views/xm/core/skill/skillMng";
	import {batchAddSkill } from '@/api/xm/core/xmTaskSkill';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmTaskList from '../xmTask/XmTaskList';

	export default { 
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),   
		},
		props:['xmTask','visible','xmProject','projectPhase',"parentTask"],
		watch: {
			'xmTask':function( xmTask ) {  
			},
			'visible':function(visible) { 
				this.fileVisible = visible;
				if(visible==true){
					if(this.parentTask){
						this.addForm=Object.assign(this.addForm, this.parentTask); 
						this.addForm.parentTaskid=this.parentTask.id
						this.addForm.parentTaskname=this.parentTask.name;  
					} else{
						this.addForm.taskType=this.projectPhase.taskType 
					}
					this.addForm.projectId=this.xmProject.id
					this.addForm.projectName=this.xmProject.name
					this.addForm.projectPhaseId=this.projectPhase.id
					this.addForm.projectPhaseName=this.projectPhase.phaseName   
					if(this.parentTask ){
						if(this.parentTask.children){
							this.addForm.sortLevel=this.parentTask.sortLevel+"."+(this.parentTask.children.length+1)
						}else{
							this.addForm.sortLevel=this.parentTask.sortLevel+"."+1
						}
					}
					this.addForm.id = sn(); 
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
				addFormRules: {
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
				addForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'3',sortLevel:'0',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',taskOut:'0',
					rate:'0',budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'0',taskClass:'0',toTaskCenter:'0',actStartTime:'',actEndTime:'',taskType:'kf',planType:'w2',settleSchemel:'quotePrice',
 
					skill: [],
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
 				menuVisible:false,
				skillVisible: false,
				taskSkills: [],
				selectTaskVisible:false,
				budgetDateRanger: [
					util.formatDate.format(beginDate, "yyyy-MM-dd HH:mm:ss"),
					util.formatDate.format(endDate, "yyyy-MM-dd HH:mm:ss")
				], 
				actDateRanger: [
				],  
				pickerOptions:  util.pickerOptions('datarange'),
				 /**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {  
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
 				this.$emit('cancel');
			},
			//新增提交XmTask xm_task 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							let params = Object.assign({}, this.addForm); 
							params.projectPhaseId=this.projectPhase.id
							params.projectPhaseName=this.projectPhase.phaseName
							if(this.budgetDateRanger.length>=2){
								params.startTime=this.budgetDateRanger[0]
								params.endTime=this.budgetDateRanger[1] 
							}
							if(this.actDateRanger.length>=2){
								params.actStartTime=this.actDateRanger[0]
								params.actEndTime=this.actDateRanger[1]
							} 
							addTask(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
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
				this.addForm.menuId=menu.menuId
				this.addForm.menuName=menu.menuName
				this.menuVisible=false;
			},
			onTaskSkillsSelected(skills) {
				let taskSkill = [];
				skills.forEach(i=>{ 
					let obj = {
						taskId: this.addForm.id,
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
					}
					this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
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
				 
				this.addForm.budgetWorkload=weekday * 8
				var price=80;
				if(this.addForm.taskOut=='1'){
					if(this.projectPhase.phaseBudgetOutUserPrice){ 
						price=this.projectPhase.phaseBudgetOutUserPrice
					} 
				}else{
					if(this.projectPhase.phaseBudgetInnerUserPrice){ 
						price=this.projectPhase.phaseBudgetInnerUserPrice
					} 
				}
				this.addForm.budgetCost=this.addForm.budgetWorkload * price 
			},
			onBudgetWorkloadChange(){
 				var price=80;
				if(this.addForm.taskOut=='1'){
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
				this.addForm.budgetCost=this.addForm.budgetWorkload * price 
			},
			onTaskOutChange(){
				this.onBudgetWorkloadChange();
			},
			onSelectedTask(task){
				this.selectTaskVisible=false;
				if(task){  
					this.addForm.preTaskid=task.id
					this.addForm.preTaskname=task.name
				}
			},
			clearPreTask(){
					this.addForm.preTaskid=''
					this.addForm.preTaskname=''
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: { 
 			xmSkillMng,
			skillMng,xmMenuSelect,XmTaskList
			//在下面添加其它组件 'xm-task-edit':XmTaskEdit
		},
		mounted() {
			console.log("taskAdd_mount");
 			if(this.parentTask){
				this.addForm=Object.assign(this.addForm, this.parentTask); 
				this.addForm.parentTaskid=this.parentTask.id
				this.addForm.parentTaskname=this.parentTask.name;
				this.addForm.taskType=this.parentTask.taskType 
				this.addForm.planType=this.parentTask.planType  
			}else{
				this.addForm.taskType=this.projectPhase.taskType 
 			}
			this.addForm.projectId=this.xmProject.id
			this.addForm.projectName=this.xmProject.name 
			this.addForm.projectPhaseId=this.projectPhase.id
			this.addForm.projectPhaseName=this.projectPhase.phaseName
			if(this.parentTask ){
				if(this.parentTask.children){
					this.addForm.sortLevel=this.parentTask.sortLevel+"."+(this.parentTask.children.length+1)
				}else{
					this.addForm.sortLevel=this.parentTask.sortLevel+"."+1
				}
			}
			this.addForm.id = sn();
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