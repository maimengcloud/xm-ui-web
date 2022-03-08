<template>
	<section class="page-container  padding"> 
		<el-row>  
			<el-steps :active="calcTaskStep" finish-status="success" simple>
			<el-step title="发布" description="任务创建成功后即发布"></el-step>
			<el-step title="竞标" description="候选人参与竞标，或者由责任人主动设置候选人"></el-step>
			<el-step title="执行" description="候选人中标后，成为执行人，执行任务"></el-step>
			<el-step title="验收" description="任务完成后提交验收，验收通过，即可进行结算"></el-step>
			<el-step title="结算" description="提交结算申请审批流程，审批过程自动根据审批结果进行结算"></el-step>
			<el-step title="企业付款" description="结算流程审批通过，自动付款到个人钱包"></el-step> 
			<el-step title="提现" description="企业付款完成后，个人对钱包中余额进行提现"></el-step> 
		</el-steps>
		</el-row>
		<el-row class="page-main ">
			<!--新增界面 XmTask xm_task-->
			<el-form :model="addForm"  label-width="100px" :rules="addFormRules" ref="addForm">
				<el-card class="box-card" header="基础信息" id="baseInfoAdd" shadow="hover">  
					<el-form-item label="类型" prop="ntype">
						 <el-radio :disabled="parentTask&&parentTask.id&&parentTask.ntype==='0'" v-model="addForm.ntype" label="1">计划项</el-radio>
						 <el-radio v-model="addForm.ntype" label="0">任务</el-radio>
					</el-form-item>
					<el-form-item label="名称" prop="name">
						<el-row>
						<el-col :span="24" style="padding-left:10px;"> 
							<el-input style="width:100%;" v-model="addForm.name" placeholder="名称" ></el-input>
							<br>
							<el-divider direction="vertical"></el-divider>
							<el-tooltip content="归属项目"><el-tag>{{addForm.projectName}}</el-tag></el-tooltip>
							<el-divider direction="vertical"></el-divider>
							<el-tooltip content="上级" >
								<el-tag v-if="parentTask!=null"><span >{{parentTask.sortLevel}}</span>&nbsp;&nbsp;<span>{{parentTask.name}}</span></el-tag>
								<el-tag v-else>无上级</el-tag>
							</el-tooltip>
						</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="序号" prop="sortLevel"> 
						<el-input  v-model="addForm.sortLevel" style="width:30%;"   placeholder="如1.0或者1.2.3等" ></el-input> <el-checkbox v-model="addForm.milestone" :true-label="1" :false-label="0">里程碑</el-checkbox>
					</el-form-item>
					<div>
					<el-form-item label="前置任务">
						<el-tag v-if="addForm.preTaskid"  @close="clearPreTask" closable >{{addForm.preTaskname}}</el-tag>
						<el-button    @click.stop="selectTaskVisible=true"  >选前置任务</el-button>
					</el-form-item>
					
					<el-form-item  label="紧急程度" prop="planType">
						<el-select v-model="addForm.level">
								<el-option v-for="i in options.urgencyLevel" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
						</el-select>
						<el-tooltip content="任务类型"><el-select v-model=" addForm.taskType">
							<el-option v-for="i in this.options.taskType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
						</el-select>
						</el-tooltip>
					</el-form-item>
					<el-form-item  label="所属需求" prop="menuId" id="menuInfoAdd">
						{{addForm.menuName}} <el-button @click="menuVisible=true" round>选择归属需求</el-button>
					</el-form-item>
					<el-form-item prop="skill" label="技能要求">
						<el-button class="useradd-icon" type="text" @click.stop="showSkill()" icon="el-icon-circle-plus-outline">增加</el-button>
						<el-tag class="fs-ft" style="margin-right:10px" v-for="(item,i) in taskSkills" :key="i">{{item.taskSkillName}}</el-tag>
					</el-form-item>
					<el-form-item label="任务描述" prop="description">
						<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="addForm.description" placeholder="任务描述" ></el-input>
					</el-form-item>
					</div>
				</el-card> 
 				<el-card class="box-card" id="planInfoAdd" header="进度计划" shadow="hover" v-if="addForm.ntype!='1'">
					<el-form-item label="任务负责人">
						<el-tag  v-if="addForm.createUserid" style="margin-left:10px;border-radius:30px;"  >{{addForm.createUsername}}</el-tag>
						<el-tag  v-else style="margin-left:10px;border-radius:30px;"  icon="el-icon-right" >未设置</el-tag>
						<el-button  @click="showGroupUserSelect(addForm)" icon="el-icon-setting">设置负责人</el-button>
					</el-form-item> 
					<el-form-item label="预计时间">
							<el-tooltip content="计划类型">
								<el-select v-model=" addForm.planType" style="width:20%;">
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
				</el-card>

 				<el-card class="box-card" header="工作量、成本" id="costInfoAdd">
					<el-form-item label="预估工作量" prop="budgetWorkload">
						<el-input-number style="width:200px;"  v-model="addForm.budgetWorkload" @change="onBudgetWorkloadChange" :precision="2" :step="8" :min="0" placeholder="预计总工作量(人时,不包括下一级)"></el-input-number> <el-tag>人时，{{this.toFixed(addForm.budgetWorkload/8/20)}}人月</el-tag>
		 				<br/>
						<el-checkbox v-model="addForm.taskOut" @change="onTaskOutChange" true-label="1" false-label="0">是否为众包任务</el-checkbox>
 
					</el-form-item> 
					<el-form-item label="预估金额" prop="taskOut">
						<el-row v-if="addForm.taskOut!=='1'">
							工时单价&nbsp;<el-input-number style="width:200px;"  v-model="addForm.uniInnerPrice" :precision="2" :step="10" :min="0" placeholder="工时单价"></el-input-number>   元/人时
 						</el-row> 
						<el-row v-if="addForm.taskOut==='1'">
 							工时单价&nbsp;<el-input-number style="width:200px;" v-if="addForm.taskOut==='1'" v-model="addForm.uniOutPrice" :precision="2" :step="10" :min="0" placeholder="外发工时单价"></el-input-number>   元/人时
						</el-row>
						<el-row>
							预估金额&nbsp;<el-input-number style="width:200px;"  v-model="addForm.budgetCost" :precision="2" :step="100" :min="0" placeholder="预算金额"></el-input-number>   元
						</el-row>
					</el-form-item> 
				 </el-card>
 				<el-card class="box-card" header="结算信息" id="settleInfoAdd" shadow="hover" v-if="addForm.ntype!='1'">
					<el-form-item label="" prop="taskClass">
						<el-checkbox v-model="addForm.taskClass" true-label="1" false-label="0">是否需要结算</el-checkbox>
					</el-form-item>
					<el-form-item v-if="addForm.taskClass=='1'" label="结算方案" prop="settlSchemel">
						<el-select v-model=" addForm.settleSchemel">
							<el-option v-for="i in options.xmTaskSettleSchemel" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
						</el-select>
					</el-form-item>
				 </el-card>

				<el-card class="box-card" header="众包" id="taskOutAdd" v-if="addForm.ntype!='1'">
					 
					<el-checkbox v-model="addForm.toTaskCenter" true-label="1" false-label="0" id="taskOut">发布到互联网任务大厅</el-checkbox>  
					<el-form-item label="众包流程" prop="taskOut">
						 <el-steps :active="calcTaskStep" align-center>
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
		<el-row class="page-bottom padding">
			<el-button @click.native="handleCancel">取消</el-button>
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
		</el-row> 
		<el-drawer append-to-body title="选择负责人" :visible.sync="groupUserSelectVisible" size="60%"    :close-on-click-modal="false">
			<xm-group-select :visible="groupUserSelectVisible" :sel-project="xmProject" :isSelectSingleUser="1" @user-confirm="groupUserSelectConfirm"></xm-group-select>
		</el-drawer>
		<el-drawer append-to-body title="新增技能" :visible.sync="skillVisible" size="60%"    :close-on-click-modal="false">
			<skill-mng :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected"></skill-mng>
		</el-drawer>

		<el-drawer append-to-body title="需求选择" :visible.sync="menuVisible" fullscreen   :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true"  @selected="onMenuSelected" :sel-project="xmProject"></xm-menu-select>
		</el-drawer>

		<el-drawer title="选中任务" :visible.sync="selectTaskVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-task-list  :sel-project="xmProject"   @task-selected="onSelectedTask"></xm-task-list>
		</el-drawer>

		<el-drawer append-to-body title="需求明细" :visible.sync="menuDetailVisible" size="80%"    :close-on-click-modal="false">
			<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="true" :xm-menu="{menuId:addForm.menuId,menuName:addForm.menuName}" ></xm-menu-rich-detail>
		</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import {addTask,addXmTask } from '@/api/xm/core/xmTask';
	import { mapGetters } from 'vuex';
 	import {sn} from '@/common/js/sequence';
 	import xmSkillMng from '../xmTaskSkill/XmTaskSkillMng';
	import skillMng from "@/views/xm/core/skill/skillMng";
	import {batchAddSkill } from '@/api/xm/core/xmTaskSkill';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmTaskList from '../xmTask/XmTaskList';
	import XmGroupSelect from '../xmGroup/XmGroupSelect.vue';

	export default {
		computed: {
			...mapGetters([
				'userInfo','roles'
			]), 
			calcTaskStep(){
				if(!this.addForm.executorUserid){
					return 1
				}else if(this.addForm.exeUsernames) {
					
					if(this.addForm.exeUsernames.indexOf('执行中')>=0){
						return 3
					}else if(this.addForm.exeUsernames.indexOf('已验收')>=0){
						return 4
					}else if(this.addForm.exeUsernames.indexOf('已验收')>=0){
						return 4
					}else if(this.addForm.exeUsernames.indexOf('已验收')>=0){
						return 4
					} if(this.addForm.exeUsernames.indexOf('已结算')>=0){
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
					 this.initData();
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
						{ required: true, message: '任务名称不能为空', trigger: 'change' }
					],
					taskState: [
						{ required: true, message: '请选择任务状态', trigger: 'change' }
					],
					taskType: [
						{ required: true, message: '请选择任务类型', trigger: 'change' }
					],
					taskClass: [
						{ required: true, message: '请选择是否结算', trigger: 'change' }
					],
					toTaskCenter: [
						{ required: true, message: '请选择是否发布', trigger: 'change' }
					],
					sortLevel: [
						{ required: true, message: '排序号不能为空', trigger: 'change' }
					],
					// execuser:[{
					// 	validator: validateExec, trigger: 'blur'
					// }],
				},
				//新增界面数据 xm_task
				addForm: {
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
									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}else{
						this.$notify({showClose: true, message:"表单检查不通过，请修改后提交", type: 'error' });
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
						taskSkillId: i.skillId,
						taskSkillName: i.skillName,
						skillRemarks: '',
					};
					taskSkill.push(obj);
				});
				this.taskSkills = taskSkill; 
				this.skillVisible=false;
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

 				var price=this.addForm.uniInnerPrice?this.addForm.uniInnerPrice:80;
				if(this.addForm.taskOut=='1'){ 
						price=this.addForm.uniOutPrice? this.addForm.uniOutPrice:80;
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
			},
			goAnchor :function(id){
       			document.querySelector("#"+id).scrollIntoView(true);
    		},
			setSkills(){
				if(this.addForm.taskSkillIds && this.addForm.taskSkillNames){
					var skillNames=this.addForm.taskSkillNames.split(",");
					this.taskSkills=this.addForm.taskSkillIds.split(",").map((item,index)=>{
						return {
							taskId:this.addForm.id,
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
				if(this.addForm.exeUserids && this.addForm.exeUserids.indexOf(this.userInfo.userid)>=0){
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
					this.addForm.createUserid=""
					this.createUsername=""
					this.groupUserSelectVisible=false;
					return
				}
				this.addForm.createUserid=users[0].userid
				this.addForm.createUsername=users[0].username 
				this.groupUserSelectVisible=false;
				 
			},
			initData(){
				if(this.parentTask){
					this.addForm=Object.assign(this.addForm, this.parentTask);
					this.addForm.parentTaskid=this.parentTask.id
					this.addForm.parentTaskname=this.parentTask.name;
					this.addForm.taskType=this.parentTask.taskType
					this.addForm.planType=this.parentTask.planType 
				} 
				if(this.xmProject){
					this.addForm.projectId=this.xmProject.id
					this.addForm.projectName=this.xmProject.name
				} 
				
				if(this.parentTask ){
					if(this.parentTask.childrenCnt){
						this.addForm.sortLevel=this.parentTask.sortLevel+"."+(this.parentTask.childrenCnt+1)
					}else{
						this.addForm.sortLevel=this.parentTask.sortLevel+"."+1
					}
				}
				if(!this.addForm.uniInnerPrice){
					this.addForm.uniInnerPrice=80
				} 
				if(this.addForm.taskOut!='1'){
					this.addForm.taskOut='0'
				}
				if(!this.addForm.uniOutPrice){
					this.addForm.uniOutPrice=100
				} 
				this.addForm.id=null;
			},
			toMenu(){
				this.menuDetailVisible=true
			},
		},//end method
		components: {
 			xmSkillMng,
			skillMng,xmMenuSelect,XmTaskList,XmGroupSelect
			//在下面添加其它组件 'xm-task-edit':XmTaskEdit
		},
		mounted() { 
 			this.initData();
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
