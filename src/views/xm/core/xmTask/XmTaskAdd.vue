<template>
	<section>
		<el-row>
			<!--新增界面 XmTask xm_task-->
			<el-form :model="addForm"  label-width="125px" label-position="left" :rules="addFormRules" ref="addForm">

					<el-form-item  prop="name">
						<template slot="label">
						<div    class="big-icon" :style="{backgroundColor:   addForm.ntype==='0'?'#409EFF':'#E6A23C'}">
							<i :class="  addForm.ntype==='0'?'el-icon-s-operation':'el-icon-time' " ></i>
						</div>
						{{addForm.ntype==='0'?'任务名称':'计划名称'}}
						</template>
							<el-input v-model="addForm.name" placeholder="名称" ></el-input>
							<span class="label-font-color" v-if="xmProjectCpd && xmProjectCpd.id">
  									<span>归属项目：{{addForm.projectName?addForm.projectName:''}}{{addForm.projectId?'('+addForm.projectId+')':''}} &nbsp;&nbsp;</span>
 									<span v-if="addForm.productId">归属产品：{{addForm.productId?addForm.productId:''}}  </span>
							</span>

							<span class="label-font-color" v-if="!xmProjectCpd || !xmProjectCpd.id">
								<span>归属项目：</span><xm-project-select style="display:inline;"  :auto-select="false"  :link-iteration-id="xmIteration?xmIteration.id:null" :link-product-id="xmProduct?xmProduct.id:null"  @row-click="onProjectRowClick" @clear="onProjectClear" ></xm-project-select>
								<span v-if="addForm.productId">归属产品：{{addForm.productId?addForm.productId:''}}  </span>
							</span>
					</el-form-item>


						<el-row class="padding-left padding-right">
							<el-col :span="8">
								<mdp-field show-style="x" size="medium" v-model="addForm.parentTaskname" label="上级计划" icon="el-icon-time" color="#E6A23C">
									<el-button slot="oper"
										@click="toSelectParent"
										title="更换任务的上级，实现任务搬家功能"
										icon="el-icon-upload2"
									> 选择新的上级</el-button>
								</mdp-field>
							</el-col>

							<el-col :span="8">
 									<mdp-select  show-style="x" size="medium"  :label="addForm.ntype=='0'?'任务状态':'计划状态'" item-code="taskState" v-model="addForm.taskState" @change="editXmTaskSomeFields(addForm,'taskState',$event)"></mdp-select>
							</el-col>

							<el-col :span="8">
 									<mdp-select  show-style="x" size="medium" label="优先级别" item-code="priority" v-model="addForm.level" @change="editXmTaskSomeFields(addForm,'level',$event)"></mdp-select>
							</el-col>

						</el-row>
						<el-row class="padding">

							<el-col :span="8">
									<mdp-select-user show-style="x" size="medium"  label="负责人" v-model="addForm.createUserid" @change2="editXmTaskSomeFields(addForm,'createUserid',$event)"></mdp-select-user>
 							</el-col>
							<el-col :span="8">
										<mdp-date-range
											:style-obj="{maxWidth:'100%'}"
											v-model="addForm"
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
										></mdp-date-range>
							</el-col>

						</el-row>
					<el-tabs v-model="activateTabPaneName">

						<el-tab-pane label="概述" name="2">
							<el-form-item prop="description" label-width="0px">
								<el-input type="textarea" :autosize="{ minRows:12, maxRows: 20}" v-model="addForm.description" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="基础信息" name="1">
						<el-row>
							<el-col :span="10">
								<el-form-item  label="" prop="milestone">
									<el-checkbox v-model="addForm.milestone" :true-label="1" :false-label="0">里程碑</el-checkbox>
									<el-checkbox v-model="addForm.taskOut" @change="onTaskOutChange" true-label="1" false-label="0">众包</el-checkbox>
								</el-form-item>
							</el-col>
							<el-col :span="14">
								<el-form-item prop="skill" label=""  v-if="addForm.ntype!='1'"  label-width="0">
									<el-tag class="fs-ft" style="margin-right:10px" v-for="(item,i) in taskSkills" :key="i">{{item.taskSkillName}}</el-tag>
									<el-button   type="text" @click.stop="showSkill()" icon="el-icon-plus">技能要求</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>

							<el-col :span="12">
								<el-form-item label="排序序号" prop="sortLevel" >
									<el-input  v-model="addForm.sortLevel" style="max-width:90%;"   placeholder="如1.0或者1.2.3等" title="序号，如1.0、1.1.1或者1，2，3等" ></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="工期类型">
								<mdp-select item-code="planType" v-model=" addForm.planType">
 								</mdp-select>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item :label="addForm.ntype=='0'?'任务前置':'计划前置'">
									<el-tag v-if="addForm.preTaskid"  @close="clearPreTask" closable >{{addForm.preTaskname}}</el-tag>
									<el-button  type="text"  @click.stop="selectTaskVisible=true"  >选前置</el-button>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  :label="addForm.ntype=='0'?'任务类型':'计划类型'" prop="taskType">
									<mdp-select item-code="taskType" v-model="addForm.taskType">
 									</mdp-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label="工时" name="5">
								<el-form-item label="报工方式" prop="wtype" >
									<el-select v-model="addForm.wtype">
										<el-option label="无须报工"  value="0"></el-option>
										<el-option label="强制每日报工"  value="1"></el-option>
										<el-option label="工期内报工"  value="2"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="原始预估工时" prop="initWorkload">
									<el-input type="number"   style="width:250px;"   v-model="addForm.initWorkload" @change="onBudgetWorkloadChange" :precision="2" :step="8" :min="0" placeholder="原始预估总工时(人时)"></el-input> <el-tag>h</el-tag>
									<br><font color="blue">原始预估工时，一旦填写，后续一般不做修改。</font>
									<br><font color="blue">计划执行过程中，用于识别出当前进度与原始预估值之间的偏离幅度，偏离过大需要进一步分析原因。</font>

								</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="成本" name="6666">
						<el-form-item label="自研工时单价" prop="uniInnerPrice">
							 <el-input type="number" style="width:150px;"   v-model="addForm.uniInnerPrice" :precision="2" :step="10" :min="0" placeholder="自研工时单价"  ></el-input  >   元/h

						</el-form-item>
						<el-form-item label="外包、众包单价" prop="uniOutPrice">
								 <el-input type="number" style="width:150px;"   v-model="addForm.uniOutPrice" :precision="2" :step="10" :min="0" placeholder="外发工时单价"  ></el-input  >   元/h

						</el-form-item>
						<el-form-item label="预算金额" prop="budgetAt">
						 	<el-input type="number" style="width:150px;"    v-model="addForm.budgetAt" :precision="2" :step="100" :min="0" placeholder="预算金额"  ></el-input  >   元
							<br><font color="blue">预算金额至上而下逐级分解，下级预算总和不能超出上级预算金额。实际金额不能超出预算金额。</font>

						</el-form-item>

					</el-tab-pane>
					<el-tab-pane label="需求" name="3" v-if="addForm.ntype!='1'">
						<el-row>
							<el-col :span="12">
								<el-form-item  label="归属产品" prop="productId">
									 {{addForm.productId}}
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="用户故事" prop="menuId" id="menuInfo" v-if="addForm.ntype!='1'">
									{{addForm.menuName}} &nbsp;&nbsp;&nbsp; <el-link @click="menuVisible=true" type="primary">{{addForm.menuName?'更改':'设置'}}</el-link>&nbsp;&nbsp;&nbsp;
									<el-link v-if="addForm.menuName" @click="toMenu" type="primary">查看需求</el-link>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label="结算信息" name="7" v-if="addForm.ntype!='1'">
						<el-form-item label="" prop="taskClass">
							<el-checkbox v-model="addForm.taskClass" true-label="1" false-label="0">是否需要结算</el-checkbox>
						</el-form-item>
						<el-form-item v-if="addForm.taskClass=='1'" label="结算方案" prop="settlSchemel">
							<mdp-select item-code="xmTaskSettleSchemel" v-model=" addForm.settleSchemel">
 							</mdp-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="外包、众包、互联网" name="8" v-if="addForm.ntype!='1' ">
					 	<el-form-item>
							 <el-checkbox v-model="addForm.taskOut" true-label="1" false-label="0" id="taskOut" >外包</el-checkbox>

							 <el-checkbox v-model="addForm.crowd" true-label="1" false-label="0" id="crowd"  v-if="addForm.taskOut==='1'">开通众包</el-checkbox>

							<el-checkbox v-model="addForm.toTaskCenter" true-label="1" false-label="0" id="toTaskCenter"  v-if="addForm.taskOut==='1'">发布到互联网任务大厅</el-checkbox>
						</el-form-item>
						<el-form-item label="分享赚" prop="oshare" v-if="addForm.taskOut==='1'">
 							<el-checkbox v-model="addForm.oshare" true-label="1" false-label="0" id="oshare"  >开通分享赚</el-checkbox>
						</el-form-item>
						<el-form-item label="分享佣金" prop="shareFee" v-if="addForm.oshare==='1' && addForm.taskOut==='1'">
 							<el-input type="number" style="width:150px;"    v-model="addForm.shareFee" :precision="2" :step="100" :min="0" placeholder="分享赚佣金"  ></el-input  >   元
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
				</el-tabs>
				<el-row class="padding" style="float:right;">
					<el-button @click.native="handleCancel">取消</el-button>
					<el-button v-loading="load.add" type="primary" @click.native="addSubmit(1)" :disabled="load.add==true">提交(关闭窗口)</el-button>
					<el-button v-loading="load.add" type="primary" @click.native="addSubmit(2)" :disabled="load.add==true">提交(继续新增)</el-button>
				</el-row>
			</el-form>
		</el-row>
		<el-drawer append-to-body title="新增技能" :visible.sync="skillVisible" size="60%"    :close-on-click-modal="false">
			<skill-mng  v-if="skillVisible" :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected"></skill-mng>
		</el-drawer>

		<el-drawer append-to-body title="需求选择" :visible.sync="menuVisible" size="60%"   :close-on-click-modal="false">
			<xm-menu-select v-if="menuVisible" :is-select-menu="true"  @selected="onMenuSelected" :sel-project="addForm.projectId?{id:addForm.projectId,name:addForm.projectName}:xmProjectCpd" :xm-product="xmProductCpd" :xm-iteration="xmIteration"></xm-menu-select>
		</el-drawer>

		<el-drawer title="选中任务" :visible.sync="selectTaskVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
			<xm-task-list  v-if="selectTaskVisible"  check-scope="task" query-scope="planTask" :sel-project="addForm.projectId?{id:addForm.projectId,name:addForm.projectName}:xmProjectCpd" :xm-product="xmProductCpd" :ptype="addForm.ptype"  @task-selected="onSelectedTask"></xm-task-list>
		</el-drawer>

		<el-drawer title="选中上级" :visible.sync="selectParentTaskVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
			<xm-phase-select v-if="selectParentTaskVisible" check-scope="plan" query-scope="plan" :sel-project="addForm.projectId?{id:addForm.projectId,name:addForm.projectName}:xmProjectCpd" :xm-product="xmProductCpd" :ptype="addForm.ptype"   @select="onSelectedParentTask"></xm-phase-select>
		</el-drawer>
		<el-drawer append-to-body title="需求明细" :visible.sync="menuDetailVisible" size="60%"    :close-on-click-modal="false">
			<xm-menu-rich-detail v-if="menuDetailVisible" :visible="menuDetailVisible"  :reload="true" :xm-menu="{menuId:addForm.menuId,menuName:addForm.menuName}" ></xm-menu-rich-detail>
		</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库

	import {initDicts,addTask,addXmTask } from '@/api/xm/core/xmTask';
	import { mapGetters } from 'vuex';
 	import {sn} from '@/common/js/sequence';
 	import xmSkillMng from '../xmTaskSkill/XmTaskSkillMng';
	import skillMng from "@/views/xm/core/skill/skillMng";
	import {batchAddSkill } from '@/api/xm/core/xmTaskSkill';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmPhaseSelect from './XmPhaseSelect';
	import XmTaskList from '../xmTask/XmTaskList';
 	import MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm'
	import XmProjectSelect from "@/views/xm/core/components/XmProjectSelect";
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
			},
			xmProjectCpd(){
				if(this.xmProject && this.xmProject.id){
					return this.xmProject
				}
				if(this.parentTask && this.parentTask.id && this.parentTask.projectId){
					 return {id:this.parentTask.projectId,name:this.parentTask.projectName}
				}
				if(this.xmTask.projectId){
					return {id:this.xmTask.projectId,name:this.xmTask.projectName}
				}
				return null;
			},

			xmProductCpd(){
				if(this.xmProduct && this.xmProduct.id){
					return this.xmProduct
				}
				if(this.xmIteration && this.xmIteration.id){
					 return {id:this.xmIteration.productName,productName:this.xmIteration.productName}
				}

				if(this.xmTask.productId){
					return {id:this.xmTask.productId,productName:this.xmTask.productName}
				}
				return null;
			}
		},
		props:['xmTask','visible','xmProject','xmProduct',"parentTask","ptype",'xmIteration'],
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

			return {
				dicts:{
					priority:[],
					taskType:[],
					planType:[],
					priority:[],
					xmTaskSettleSchemel:[],
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
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

				addForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',rate:0,budgetAt:0,budgetWorkload:0,actAt:0,actWorkload:0,taskState:'0',taskType:'4',taskClass:'',toTaskCenter:'0',actStartTime:'',actEndTime:'',bizProcInstId:'',bizFlowState:'',phaseId:'',phaseName:'',taskSkillNames:'',exeUsernames:'',taskSkillIds:'',exeUserids:'',taskOut:'0',planType:'w2',settleSchemel:'1',menuId:'',menuName:'',productId:'',cbranchId:'',cdeptid:'',tagIds:'',tagNames:'',ntype:'',childrenCnt:'',ltime:'',pidPaths:'',lvl:'',isTpl:'',keyPath:'',uniInnerPrice:80,uniOutPrice:100,calcType:'',ptype:'',wtype:'',bctrl:'',initWorkload:'',shareFee:'',oshare:'',crowd:'',browseUsers:'',execUsers:'',cityId:'',cityName:'',regionType:'',browseTimes:'',capaLvls:'',tranMode:'',supRequires:'',hot:'0',top:'0',urgent:'0',crmSup:'0',bidStep:'0',interestLvls:'',filePaths:'',estate:'0',efunds:0,etoPlatTime:'',etoDevTime:'',ebackTime:'',topStime:'',topEtime:'',hotStime:'',hotEtime:'',urgentStime:'',urgentEtime:''
				},
				addFormInit: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',rate:0,budgetAt:0,budgetWorkload:0,actAt:0,actWorkload:0,taskState:'0',taskType:'4',taskClass:'',toTaskCenter:'0',actStartTime:'',actEndTime:'',bizProcInstId:'',bizFlowState:'',phaseId:'',phaseName:'',taskSkillNames:'',exeUsernames:'',taskSkillIds:'',exeUserids:'',taskOut:'0',planType:'w2',settleSchemel:'1',menuId:'',menuName:'',productId:'',cbranchId:'',cdeptid:'',tagIds:'',tagNames:'',ntype:'',childrenCnt:'',ltime:'',pidPaths:'',lvl:'',isTpl:'',keyPath:'',uniInnerPrice:80,uniOutPrice:100,calcType:'',ptype:'',wtype:'',bctrl:'',initWorkload:'',shareFee:'',oshare:'',crowd:'',browseUsers:'',execUsers:'',cityId:'',cityName:'',regionType:'',browseTimes:'',capaLvls:'',tranMode:'',supRequires:'',hot:'0',top:'0',urgent:'0',crmSup:'0',bidStep:'0',interestLvls:'',filePaths:'',estate:'0',efunds:0,etoPlatTime:'',etoDevTime:'',ebackTime:'',topStime:'',topEtime:'',hotStime:'',hotEtime:'',urgentStime:'',urgentEtime:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
 				menuVisible:false,
				menuDetailVisible:false,
				skillVisible: false,
				taskSkills: [],
				selectTaskVisible:false,
				selectParentTaskVisible:false,
				execUserVisible:false,
				groupUserSelectVisible:false,
				execGroupUserSelectVisible:false,
				pickerOptions:  util.getPickerOptions('datarange'),
				activateTabPaneName:'1'
				 /**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
 				this.$emit('cancel');
			},
			//新增提交XmTask xm_task 父组件监听@submit="afterAddSubmit"
			addSubmit: function (submitType) {
				if(this.addForm.ntype!='1'){
					if(this.xmIteration && this.xmIteration.id){
						if(!this.addForm.menuId){
							this.$notify({position:'bottom-left',showClose:true,message:'在迭代视图中添加任务需要关联需求！请选择需求',type: 'error'})
							this.activateTabPaneName="3"
							this.menuVisible=true;
							return;
						}
					}
					/**
					if(!this.addForm.parentTaskid){
						this.$notify({position:'bottom-left',showClose:true,message:'请选择上级计划',type: 'error'})
						return;
					}
					 */
				}
				if(!this.addForm.projectId){
					this.$notify({position:'bottom-left',showClose:true,message:'请选择项目',type: 'error'})
					return;
				}



				this.$refs.addForm.validate((valid) => {
					if (valid) {
						if(this.addForm.oshare==='1'){
							if(this.addForm.shareFee>1000){
								this.$notify({position:'bottom-left',showClose:true,message:'分享佣金不能超过1000元',type: 'error'})
								return;
							}else if( !this.addForm.budgetAt){
								this.$notify({position:'bottom-left',showClose:true,message:'请先设置预算金额',type: 'error'})
								return;
							}else if(this.addForm.shareFee/this.addForm.budgetAt>0.05){
								this.$notify({position:'bottom-left',showClose:true,message:'分享佣金不能超过预算金额的5%',type: 'error'})
								return;
							}
						}
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							let params = Object.assign({}, this.addForm);
							addTask(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
									if(submitType==1){
										this.handleCancel()
									}else{
										var sortLevels=this.addForm.sortLevel.split(".")
										sortLevels[sortLevels.length-1]=parseInt(sortLevels[sortLevels.length-1])+1
 										this.addForm.sortLevel=sortLevels.join(".");
									}
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

							}).catch( err  => this.load.add=false);
						});
					}else{
						this.$notify({position:'bottom-left',showClose:true,message:"表单检查不通过，请修改后提交", type: 'error' });
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

			toSelectParent(){
				if(!this.addForm.projectId && !this.xmProjectCpd){
					this.$notify({position:'bottom-left',showClose:true,message:"请先选择归属项目", type: 'error' });
					return;
				}
				this.selectParentTaskVisible=true
			},
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
				var start= new Date(this.addForm.startTime);
				var end= new Date(this.addForm.endTime);
				var weekday=this.getWeekday(start,end);

				this.addForm.budgetWorkload=weekday * 8
				this.addForm.initWorkload=this.addForm.budgetWorkload
				var price=80;
				if(this.addForm.taskOut=='1'){
					if(this.addForm.uniOuserPrice){
						price=this.addForm.uniOuserPrice
					}else{
						price=this.xmProject.planOuserPrice
					}
				}else{
					if(this.addForm.uniIuserPrice){
						price=this.addForm.uniIuserPrice
					}else{
						price=this.addForm.planIuserPrice
					}
				}
				this.addForm.budgetAt=this.addForm.budgetWorkload * price
			},
			onBudgetWorkloadChange(){

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
			onSelectedParentTask(parentTask){
				this.selectParentTaskVisible=false;
				if(parentTask && parentTask.id){
					this.addForm.parentTaskid=parentTask.id
					this.addForm.parentTaskname=parentTask.name;
					this.addForm.taskType=parentTask.taskType
					this.addForm.planType=parentTask.planType

					if(parentTask.childrenCnt && parentTask.sortLevel){
						this.addForm.sortLevel=parentTask.sortLevel+"."+(parentTask.childrenCnt+1)
					}else if(parentTask.sortLevel){
						this.addForm.sortLevel=parentTask.sortLevel+"."+1
					}else{
						this.addForm.sortLevel=""+1
					}
				}
			},
			clearParentTask(){
					this.addForm.parentTaskid=''
					this.addForm.parentTaskname=''
					this.addForm.sortLevel=""
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
			initData(){
				this.addForm={...this.addFormInit}
				if(this.parentTask && this.parentTask.id){
					this.addForm=Object.assign(this.addForm, this.parentTask);
					this.addForm.parentTaskid=this.parentTask.id
					this.addForm.parentTaskname=this.parentTask.name;
					this.addForm.taskType=this.parentTask.taskType
					this.addForm.planType=this.parentTask.planType
					this.addForm.ptype=this.parentTask.ptype
					this.addForm.name=this.parentTask.name+"-请修改"
					this.addForm.budgetAt=0
					this.addForm.budgetWorkload=0
					this.addForm.actAt=0
					this.addForm.actWorkload=0
					this.addForm.rate=0
					this.addForm.actStartTime=null
					this.addForm.actEndTime=null
					this.addForm.exeUserids=null
					this.addForm.exeUsernames=null
					this.addForm.executorUserid=null
					this.addForm.executorUsername=null
					this.addForm.shareFee=0
					this.addForm.taskOut="0"
					this.addForm.toTaskCenter="0"
					this.addForm.crowd="0"
				}else{
					this.addForm.parentTaskid=''
					this.addForm.parentTaskname='';
				}
				if(this.xmProject){
					this.addForm.projectId=this.xmProject.id
					this.addForm.projectName=this.xmProject.name
				}
				if(this.xmProduct){
					this.addForm.productId=this.xmProduct.id
					this.addForm.productName=this.xmProduct.productName
				}

				if(this.xmIteration && !this.xmProduct && !this.addForm.productId){
					this.addForm.productId=this.xmIteration.productId
					this.addForm.productName=this.xmIteration.productName
				}
				if(this.parentTask && this.parentTask.id){
					if(this.parentTask.childrenCnt && this.parentTask.sortLevel){
						this.addForm.sortLevel=this.parentTask.sortLevel+"."+(this.parentTask.childrenCnt+1)
					}else if(this.parentTask.sortLevel){
						this.addForm.sortLevel=this.parentTask.sortLevel+"."+1
					}else{
						this.addForm.sortLevel=""+1
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
				if(!this.parentTask || !this.parentTask.id){
						this.addForm.ptype=this.ptype
				}
				this.addForm.createUserid=this.userInfo.userid
				this.addForm.createUsername=this.userInfo.username;
				this.addForm.ntype=this.xmTask.ntype
				this.addForm.wtype="2"
				if(!this.addForm.startTime){
					const beginDate = new Date();
					const endDate = new Date();
					endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
					this.addForm.startTime=util.formatDate(beginDate, "yyyy-MM-dd HH:mm:ss"),
					this.addForm.endTime=util.formatDate(endDate, "yyyy-MM-dd HH:mm:ss")
					this.onBudgetDateRangerChange();
				}

				this.addForm.id=null;
				this.activateTabPaneName="1"
			},
			toMenu(){
				this.menuDetailVisible=true
			},

			onProjectRowClick: function (project) {
				this.addForm.projectId=project.id
				this.addForm.projectName=project.name
			},
			onProjectClear(){
				this.addForm.projectId=""
				this.addForm.projectName=""
			},
		},//end method
		components: {
 			xmSkillMng,
			skillMng,xmMenuSelect,XmTaskList,MdpSelectUserXm,XmPhaseSelect,XmProjectSelect
			//在下面添加其它组件 'xm-task-edit':XmTaskEdit
		},
		mounted() {
 			this.initData();
			initDicts(this)
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
