<template>
	<section class="page-container padding border">
		<el-row class="padding-bottom">
			<el-steps :active="calcProjectStatusStep" simple finish-status="success">
 				<el-step  v-for="(i,index) in options['projectStatus']" :title="i.optionName" :key="index">
					 <el-row slot="title" @click.native.stop="editForm.status=i.optionValue">
						 {{i.optionName}} 
					 </el-row>
				</el-step> 
			</el-steps>
		</el-row>
		<el-row class="page-main page-height-70"> 
		<!--编辑界面 XmProject xm_project-->  
			<div ref="editFormDiv">
				<el-form :model="editForm"  label-width="150px" :rules="editFormRules" ref="editForm" class="editForm">   
						<el-form-item label="项目编号|名称" prop="name">
							<el-input v-model="editForm.code" placeholder="项目编号，不可为空" style="width:20%;" ></el-input><el-input style="width:80%;" v-model="editForm.name" placeholder="项目名称" ></el-input>
						</el-form-item>  
						<el-form-item label="项目属性" prop="xmType"> 
							<el-select v-model="editForm.xmType">
								<el-option v-for="(i,index) in options['projectType']" :label="i.optionName" :value="i.optionValue" :key="index"></el-option> 
							</el-select>   
							<el-select v-model="editForm.urgent">
								<el-option v-for="(i,index) in options['urgencyLevel']" :label="i.optionName" :value="i.optionValue" :key="index"></el-option> 
							</el-select>    
							<el-select v-model="editForm.priority">
								<el-option v-for="(i,index) in options['priority']" :label="i.optionName" :value="i.optionValue" :key="index"></el-option> 
							</el-select> 
						</el-form-item>   
						<el-form-item label="预算控制" prop="priority">
							<el-checkbox  v-model="editForm.budgetCtrl"  true-label="1" false-label="0" >严格控制预算</el-checkbox> 注：在项目->计划->任务 每个环节进行严格的预算控制
						</el-form-item>  
						<el-form-item label="工期及成本预估" >  
							<el-row>
								<el-date-picker
									v-model="dateRanger"
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
								<el-input  style="width:150px;" type="number" v-model="editForm.planWorkingHours" :precision="2" :step="8" :min="0" placeholder="预计工时"></el-input><el-tag>参考工时{{autoParams.weekday*8}}小时,工作日{{autoParams.weekday}}天</el-tag>  
								
							</el-row>
							<el-divider></el-divider>
							<el-row>
								<el-col :span="4">人员类型</el-col>
								<el-col :span="4">人数</el-col>
								<el-col :span="4">工作量</el-col>
								<el-col :span="4">单价</el-col>
								<el-col :span="8">总价</el-col>
								
							</el-row>
							<el-divider></el-divider>
							<el-row>
								<el-col :span="4">内购</el-col>
								<el-col :span="4"><el-input style="width:150px;"  type="number" v-model="editForm.planInnerUserCnt" :precision="0" :step="1" :min="0" placeholder="内购人数"></el-input>  
								</el-col>
								<el-col :span="4">{{autoParams.planInnerUserWorkload}}人时</el-col>
								<el-col :span="4"><el-input  style="width:150px;" type="number" v-model="editForm.planInnerUserPrice" :precision="0" :step="1" :min="0" placeholder="预计内部人时单价"></el-input> </el-col>
								<el-col :span="8">{{this.toFixed(autoParams.planInnerUserAt)}}元,{{this.toFixed(autoParams.planInnerUserAt/10000)}} 万元</el-col>
							</el-row>
							<el-divider></el-divider>
							<el-row>
								<el-col :span="4">外购</el-col>
								<el-col :span="4"><el-input  style="width:150px;" type="number" v-model="editForm.planOutUserCnt" :precision="0" :step="1" :min="0" placeholder="外购人数"></el-input>  
								</el-col>
								<el-col :span="4">{{autoParams.planOutUserWorkload}}人时</el-col>
								<el-col :span="4"><el-input  style="width:150px;" type="number" v-model="editForm.planOutUserPrice" :precision="0" :step="1" :min="0" placeholder="预计外购人时单价"></el-input> </el-col>
								<el-col :span="4">{{autoParams.planOutUserAt }} 元 {{autoParams.planOutUserAt/10000 }}万元</el-col>
							
							</el-row>
							<el-divider></el-divider>
							<el-row>
								<el-col :span="4">合计</el-col>
								<el-col :span="4"> {{autoParams.planOutUserCnt+autoParams.planInnerUserCnt}}
								</el-col>
								<el-col :span="4">{{autoParams.planOutUserWorkload+autoParams.planInnerUserWorkload  }}人时,{{ (autoParams.planOutUserWorkload+autoParams.planInnerUserWorkload)/8/20  }}人月 </el-col>
								<el-col :span="4">平均：{{ (parseFloat2(autoParams.planOutUserPrice) + parseFloat2(autoParams.planInnerUserPrice))/2}}元/人时</el-col>
								<el-col :span="8">{{autoParams.planTotalCost}} 元，{{(autoParams.planTotalCost)/10000}} 万元</el-col>
							</el-row> 
						</el-form-item>
						<el-form-item label="成本总览"> 
							<el-row>
								内购：  <el-input style="width:150px;" type="number" disabled v-model="editForm.planInnerUserAt" :precision="2" :step="1000" :min="0" placeholder="内部人力成本总预算"></el-input> <el-tag> {{this.toFixed(autoParams.planInnerUserAt/10000)}}万元</el-tag>
								外购：  <el-input style="width:150px;" type="number" disabled v-model="editForm.planOutUserAt" :precision="2" :step="1000" :min="0" placeholder="外购人力成本总预算"></el-input> <el-tag> {{this.toFixed(autoParams.planOutUserAt/10000)}}万元</el-tag>
								非人力：<el-input style="width:150px;" type="number" v-model="editForm.planNouserAt" :precision="2" :step="1000" :min="0" placeholder="人力成本总预算"></el-input> <el-tag> {{this.toFixed( autoParams.planNouserAt/10000)}}万元</el-tag>
							</el-row>
							<el-divider></el-divider>
							<el-row>
								合计： <el-input style="width:150px;" disabled type="number" v-model="editForm.planTotalCost" :precision="2" :step="1000" :min="0" placeholder="总成本预算"></el-input> <el-tag> {{this.toFixed(autoParams.planTotalCost/10000)}}万元</el-tag>
 							</el-row>
						</el-form-item>
						<el-form-item label="收入及盈利水平预估"> 
							<el-row> 
								预计收款总额：<el-input style="width:150px;" type="number" v-model="editForm.totalReceivables" :precision="2" :step="1000" :min="0" disabled placeholder="预计总收款金额"></el-input> <el-tag> {{this.toFixed(autoParams.totalReceivables/10000)}}万元</el-tag>
								合同总金额  ：<el-input style="width:150px;" type="number" v-model="editForm.contractAmt" :precision="2" :step="1000" :min="0" placeholder="合同总金额"></el-input> <el-tag>{{this.toFixed(autoParams.contractAmt/10000)}}万元</el-tag>
 							</el-row> 
							<el-row> 
								税率：<el-input style="width:150px;" type="number" v-model="editForm.taxRate" :precision="2" :step="0.01" :min="0" :max="0.99" placeholder="税率"></el-input> 
								考核标准毛利率：<el-input style="width:150px;" type="number" v-model="editForm.budgetMarginRate" :precision="2" :step="0.01" :min="0" :max="0.99" placeholder="毛利率"></el-input> 
								当前毛利率为：<el-tag>{{toFixed(parseFloat2(autoParams.currentBudgetMarginRate)*100,2)}}%</el-tag>
 							</el-row>  
						</el-form-item>  
						<el-form-item label="项目描述" prop="description">
							<el-input type="textarea" :rows="6" v-model="editForm.description" placeholder="项目描述" ></el-input>
						</el-form-item>     
				</el-form>   
			</div>
		</el-row>
		<el-row>  
				<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
				<el-button icon="el-icon-watch" type="danger"  @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_baseinfo_change_approva'})">基本信息修改申请</el-button>  
				<el-button icon="el-icon-watch" type="danger"  @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_delay_approva'})">延期申请</el-button> 
				<el-button icon="el-icon-star-on"  type="success"  @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_start_approva'})">立项申请</el-button>
				<el-button icon="el-icon-success"  type="success" @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_over_approva'})">结项申请</el-button>
				<el-button icon="el-icon-edit" type="warning"  @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_budget_change_approva'})">预算变更申请</el-button>
				<el-button icon="el-icon-video-pause" type="danger"   @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_pause_approva'})">项目暂停申请</el-button> 
				<el-button icon="el-icon-video-play"  type="primary" @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_restart_approva'})">项目重新启动申请</el-button>
	 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {sn} from '@/common/js/sequence';//全局公共库

	import config from "@/common/config"; //全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editXmProject } from '@/api/xm/core/xmProject'; 
	import { uploadBase64 } from '@/api/mdp/arc/image'; 
	
	import { mapGetters } from 'vuex';  
	import { getGroups } from '@/api/xm/core/xmProjectGroup';
	import html2canvas from 'html2canvas'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
			
			autoParams:function(){
				
				 
				var planOutUserPrice=this.toFixed(this.editForm.planOutUserPrice)
				var planInnerUserPrice=this.toFixed(this.editForm.planInnerUserPrice)
				var planOutUserCnt=this.toFixed(this.editForm.planOutUserCnt)
				var planInnerUserCnt=this.toFixed(this.editForm.planInnerUserCnt)
				var planWorkingHours=this.toFixed(this.editForm.planWorkingHours )
				var planNouserAt=this.toFixed(this.editForm.planNouserAt ) 
				var budgetMarginRate=this.toFixed(this.editForm.budgetMarginRate,4 ) 
				var taxRate=this.toFixed(this.editForm.taxRate,4)
				if(planOutUserPrice==null || planOutUserPrice==''){
					planOutUserPrice=100
				}
				if(planInnerUserPrice==null || planInnerUserPrice==''){
					planInnerUserPrice=80
				}
				if(planOutUserCnt==null || planOutUserCnt==''){
					planOutUserCnt=0.0
				}
				if(planInnerUserCnt==null || planInnerUserCnt==''){
					planInnerUserCnt=0.0
				}
				
				if(planNouserAt==null || planNouserAt==''){
					planNouserAt=0.0
				}
				if(budgetMarginRate==null || budgetMarginRate==''){
					budgetMarginRate=0.4
				}
				
				if(planWorkingHours==null || planWorkingHours==''){
					planWorkingHours=0.0
				}
				if(taxRate==null || taxRate==''){
					taxRate=0.03
				}
				var autoParams={   

				} 
				 var weekday=1;
				if(this.dateRanger!=null && this.dateRanger.length>=2 ){
					weekday=this.getWeekday(new Date(this.dateRanger[0]),new Date(this.dateRanger[1]));
					if(this.editForm.planWorkingHours==null || this.editForm.planWorkingHours=='' || this.editForm.planWorkingHours<=0){
						planWorkingHours=weekday * 8
					}
					
			 	} 
				autoParams.weekday=weekday
				autoParams.planWorkingHours=planWorkingHours
				autoParams.planOutUserPrice=planOutUserPrice
				autoParams.planInnerUserPrice=planInnerUserPrice
				autoParams.planOutUserCnt=planOutUserCnt
				autoParams.planInnerUserCnt=planInnerUserCnt 
				autoParams.taxRate=taxRate 
				autoParams.planInnerUserWorkload= planInnerUserCnt*planWorkingHours
				autoParams.planOutUserWorkload= planOutUserCnt*planWorkingHours
				autoParams.planWorkload=  planInnerUserCnt*planWorkingHours + planOutUserCnt*planWorkingHours
				autoParams.planOutUserAt= planOutUserCnt * planWorkingHours * planOutUserPrice
				autoParams.planInnerUserAt=  planInnerUserCnt * planWorkingHours * planInnerUserPrice
				autoParams.planNouserAt= planNouserAt
				autoParams.budgetMarginRate=budgetMarginRate
				autoParams.planTotalCost=  autoParams.planOutUserAt + autoParams.planInnerUserAt + autoParams.planNouserAt
				autoParams.totalReceivables=autoParams.planTotalCost/(1-budgetMarginRate)/ (1-taxRate)
				autoParams.contractAmt =autoParams.totalReceivables
				var totalReceivables=this.editForm.totalReceivables
				if(totalReceivables==null || totalReceivables=='' || isNaN(totalReceivables)){
					autoParams.currentBudgetMarginRate=-99
				}else{ 
					autoParams.currentBudgetMarginRate= this.toFixed(1-this.editForm.planTotalCost/(this.editForm.totalReceivables* (1-taxRate)),4)
				}

				// 1.毛利率=（销售收入-销售成本）/销售收入×100%=（不含税售价－不含税进价）/不含税售价×100%
				// 2.毛利率=（1－不含税进价/不含税售价）×100%
				//totalReceivables=budgetMarginRate * 
				//budgetMarginRate=(totalReceivables* (1-taxRate)-planTotalCost)/totalReceivables* (1-taxRate)=1-planTotalCost/(totalReceivables* (1-taxRate))
				//1-budgetMarginRate = planTotalCost/(totalReceivables* (1-taxRate)) 
				// planTotalCost/(1-budgetMarginRate) =totalReceivables* (1-taxRate)
				// totalReceivables=planTotalCost/(1-budgetMarginRate)/ (1-taxRate)
				return autoParams
			},
			planTotalAt:function(){
				return {
					planOutUserAt:this.editForm.planOutUserAt,
					planInnerUserAt:this.editForm.planInnerUserAt,
					planNouserAt:this.editForm.planNouserAt,  
				}
			},
			
			totalReceivables:function(){
				 return this.editForm.totalReceivables
			},
			calcProjectStatusStep(){
				if(this.options['projectStatus'] && this.editForm){
					var index=this.options['projectStatus'].findIndex(i=>{
						if(i.optionValue==this.editForm.status){
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
		},
		props:['selProject','visible'],
		watch: { 
	      'visible':function(visible) { 
	      	if(visible==true){ 
				this.editForm=Object.assign({},this.selProject) 
				this.dateRanger=[this.editForm.startTime,this.editForm.endTime]
	      	}
		  },
		  'planTotalAt':{
			  handler(planTotalAt){  
				this.editForm.planTotalCost=this.toFixed(this.parseFloat2(planTotalAt.planOutUserAt)+this.parseFloat2(planTotalAt.planInnerUserAt)+this.parseFloat2(planTotalAt.planNouserAt))
				//this.editForm.totalReceivables=this.toFixed(this.parseFloat2(this.editForm.planTotalCost) * (1+0.3)) 
			  },
			  deep:true
		  },
		  'totalReceivables':function(){
			  //this.editForm.budgetMarginRate=this.toFixed((this.editForm.totalReceivables-this.editForm.planTotalCost)/this.editForm.totalReceivables,4)
		  },
		  autoParams(){ 
			  this.fillPlanWorkingHoursToField()
			  this.fillPlanCostAtToField();
			  this.fillTotalReceivablesToField();
			  this.fillBudgetMarginRateToField()
		  },
		  
		  editForm:{  
				handler(newValue, oldValue) {
					this.$notify.closeAll();
					this.changeTips=[];
					if(this.selProject.planWorkingHours!=this.editForm.planWorkingHours){ 
						var distance=this.selProject.planWorkingHours-this.editForm.planWorkingHours
						var operType=distance>0?"-":"+";
						this.changeTips.push("预计总工期: "+ this.selProject.planWorkingHours+" > " +this.editForm.planWorkingHours+"&nbsp;&nbsp;&nbsp;<strong>"+operType+Math.abs(distance)+"</strong>小时");
					}
					if(this.selProject.planTotalCost!=this.editForm.planTotalCost){ 
						var distance=this.selProject.planTotalCost-this.editForm.planTotalCost
						var operType=distance>0?"-":"+";
						this.changeTips.push("预计总成本: "+ this.selProject.planTotalCost+" > " +this.editForm.planTotalCost+"&nbsp;&nbsp;&nbsp;<strong>"+operType+Math.abs(distance)+"</strong>元");
					}
					if(this.selProject.budgetMarginRate!=this.editForm.budgetMarginRate){  
						var distance=this.selProject.budgetMarginRate-this.editForm.budgetMarginRate
						var operType=distance>0?"-":"+";
						this.changeTips.push("毛利率: "+ this.selProject.budgetMarginRate+" > " +this.editForm.budgetMarginRate+"&nbsp;&nbsp;&nbsp;<strong>"+operType+Math.abs(distance)+"</strong>%");
					}
					if(this.selProject.totalReceivables!=this.editForm.totalReceivables){  
						var distance=this.selProject.totalReceivables-this.editForm.totalReceivables
						var operType=distance>0?"-":"+";
						this.changeTips.push("预计总收款: "+ this.selProject.totalReceivables+" > " +this.editForm.totalReceivables+"&nbsp;&nbsp;&nbsp;<strong>"+operType+Math.abs(distance)+"</strong>元");
					}
					if(this.selProject.contractAmt!=this.editForm.contractAmt){  
						var distance=this.selProject.contractAmt-this.editForm.contractAmt
						var operType=distance>0?"-":"+";
						this.changeTips.push("合同金额: "+ this.selProject.contractAmt+" > " +this.editForm.contractAmt+"&nbsp;&nbsp;&nbsp;<strong>"+operType+Math.abs(distance)+"</strong>元");
					}
					
					if(this.changeTips.length==0){
						return;
					}
		　　　　　　this.$notify({
						title: '修改过的数据',
						dangerouslyUseHTMLString: true,
						message: ''+this.changeTips.join("<br>"),
						duration: 0
					}); 
		　　　　},
		　　　　deep: true 
		  }
	    },
		data() { 
			 const beginDate = new Date();
			const endDate = new Date();
			endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
			return {
				filters: {
					ids: [],
				},
				options:{ 
					projectType:[],
					urgencyLevel:[],
					priority:[],
					projectStatus:[], 
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					name: [{
						required: true, message: '项目名称不可为空' , trigger: 'blur'
					}], 
					
					code: [{
						required: true, message: '项目编号不可为空', trigger: 'blur'
					}],
					xmType: [{
						required: true, message: '项目类型不可为空', trigger: 'blur'
					}],
					urgent: [{
						required: true, message: '紧急程度不可为空', trigger: 'blur'
					}],
					priority: [{
						required: true, message: '优先程度不可为空', trigger: 'blur'
					}], 
				},
				//编辑界面数据  XmProject xm_project
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:0,bizProcInstId:'',bizFlowState:'',taxRate:0.06,planNouserAt:0,planInnerUserAt:0,planOutUserAt:0,locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:0,totalReceivables:0,budgetMarginRate:0.13,contractAmt:0,planInnerUserPrice:85,planOutUserPrice:100,planOutUserCnt:1,planInnerUserCnt:1,planWorkingHours:0,planInnerUserWorkload:0,planOutUserWorkload:0,budgetCtrl:'0',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				xmProjectGroups:[],
				userSelectType: "",
				userSelectVisible: false,
				groupSelectVisible:false,
 				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				dateRanger: [ 
				],  
				pickerOptions:  util.pickerOptions('datarange'),
				activateName:'planWorkload',
				changeTips:[],//变化日志列表
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: { 
			//打开用户选择 
			//选择接收人 
 
			showProjectGroups:function(){
				this.getXmProjectGroups();
				this.groupSelectVisible=true;
			},
			//项目团队选择
			onGroupSelected(groups){
				this.groupSelectVisible=false;
			},

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交XmProject xm_project父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				if(!this.roles.some(i=>i.roleid=='projectAdmin')){
					this.$message({showClose: true, message: "只有项目经理可以修改项目", type: 'error' }); 
					return;
				}
				if("0" != this.selProject.status){
					this.$message({showClose: true, message: "只有初始状态的项目可以修改，如确实需要修改，请进行项目变更审批", type: 'error' }); 
					return;
				}
				if (
					this.dateRanger != null &&
					this.dateRanger.length == 2
				) {
					this.editForm.startTime = this.dateRanger[0] ;
					this.editForm.endTime = this.dateRanger[1] ;
				}else{
					this.$message({showClose: true, message: "请输入开始日期和结束日期", type: 'error' }); 
					return;
				} 
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);  
							params.planInnerUserWorkload=this.autoParams.planInnerUserWorkload 
							params.planOutUserWorkload=this.autoParams.planOutUserWorkload
							params.planWorkload=this.autoParams.planWorkload
							editXmProject(params).then((res) => {
								this.load.edit=false;
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit',params);//  @submit="afterEditSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}, 
			getXmProjectGroups() {
				this.load.list = true;
				let params = {};
				params.projectId = this.editForm.id;
				params.branchId = this.userInfo.branchId;
				getGroups(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.xmProjectGroups = res.data.data; 
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
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
			toFixed(floatValue,num){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					if(!num){
						num=2
					}
					return parseFloat(parseFloat(floatValue).toFixed(num));
				}
			},
			parseFloat2(floatValue){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					return parseFloat(floatValue);
				}
			},
			fillToField:function(){
				this.editForm=Object.assign(this.editForm,this.autoParams);
			},
			fillPlanWorkingHoursToField:function(){
				this.editForm.planWorkingHours=this.toFixed(this.autoParams.planWorkingHours)
			},
			
			fillPlanCostAtToField:function(){
				this.editForm.planNouserAt=this.toFixed(this.autoParams.planNouserAt)
				this.editForm.planOutUserAt=this.toFixed(this.autoParams.planOutUserAt )
				this.editForm.planInnerUserAt=this.toFixed(this.autoParams.planInnerUserAt )
				this.editForm.planTotalCost=this.toFixed(this.autoParams.planTotalCost)

			},
			
			fillTotalReceivablesToField:function(){
				this.editForm.totalReceivables=this.toFixed(this.autoParams.totalReceivables )
				this.editForm.contractAmt=this.toFixed(this.autoParams.contractAmt  )
			},
			fillBudgetMarginRateToField:function(){
				this.editForm.budgetMarginRate=this.toFixed(this.autoParams.budgetMarginRate,4) 
			}, 
			showApprovaInfo:function(row){
				var msgFields=[];
				if(row.mainTitle!=null && row.mainTitle!=""){
					msgFields.push("流程【"+row.mainTitle+"】");
				}
				
				if(row.taskName!=null && row.taskName!=""){
					msgFields.push("当前环节【"+row.taskName+"】");
				}
				
				if(row.assigneeName!=null && row.assigneeName!=""){
					msgFields.push("执行人【"+row.assigneeName+"】");
				}
				
				if(row.commentMsg!=null && row.commentMsg!=""){
					msgFields.push("审批意见【"+row.commentMsg+"】");
				}
				var msg=msgFields.join(",");
				return msg;
			},
			sendToProcessApprova:function(row,bizKey){ 
				if(!this.roles.some(i=>i.roleid=='projectAdmin')){
					this.$message({showClose: true, message: "只有项目经理可以发起流程", type: 'error' }); 
					return;
				}
				// 传过来的参数格式
				if(row.flowState=='1'){
					this.$message.error("审核中，不允许重复发审");
					return;
				}
				
				row.planInnerUserWorkload=this.autoParams.planInnerUserWorkload 
				row.planOutUserWorkload=this.autoParams.planOutUserWorkload
				row.planWorkload=this.autoParams.planWorkload
				let extVars={projectId:row.id}
				let jsonExtVars=JSON.stringify(extVars); 

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath; 
				var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

				let params={
					bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'',
					bizPkid:row.id,
					bizParentPkid:row.id,
					mainContext:'',
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
						data:{
							id:row.id,
							branchId:row.branchId
						}
					}, 
				}

				if(bizKey=="xm_project_baseinfo_change_approva"){
					//延期审核
					params.mainTitle='关于项目【'+row.name+"】修改基本信息的申请";
					params.mainContext='项目编号：'+row.code+','+'项目名称：'+row.name+',此次变更不涉及预算调整';
					params.restUrl=config.getXmBasePath()+"/xm/core/xmProject/processApprova"; 
					params.flowVars.data=row
					//this.html2canvas(document.querySelector(".editForm"),row,params);
					this.$router.push({name:'ProcdefListForBizStart',params:params}); 
				}else if(bizKey=="xm_project_delay_approva"){
					//延期审核
					params.mainTitle='关于项目【'+row.name+"】延期的审批申请";
					params.mainContext='项目编号：'+row.code+','+'项目名称：'+row.name+',项目结束时间由'+this.selProject.endTime+'变更为:'+row.endTime+',此次变更不涉及预算调整';
					params.restUrl=config.getXmBasePath()+"/xm/core/xmProject/processApprova"; 
					params.flowVars.data.endTime=row.endTime
					//this.html2canvas(document.querySelector(".editForm"),row,params);
					this.$router.push({name:'ProcdefListForBizStart',params:params}); 
				}else if(bizKey=="xm_project_start_approva"){
					//立项审核
					params.mainTitle='关于项目【'+row.name+"】立项的审批申请";
					params.mainContext='项目编号：'+row.code+','+'项目名称：'+row.name+',项目周期：'+row.startTime+'~'+row.endTime
										+',预估及考核毛利率:'+row.budgetMarginRate+',预估总成本:'+row.planTotalCost+',总收入:'+row.totalReceivables
										+',合同金额:'+row.contractAmt+'详细如下(截图)：'; 
					params.restUrl=config.getXmBasePath()+"/xm/core/xmProject/processApprova"; 
					params.flowVars.data=row
					//this.html2canvas(document.querySelector(".editForm"),row,params);
					this.$router.push({name:'ProcdefListForBizStart',params:params}); 
				}else if(bizKey=="xm_project_over_approva"){
					//结项审核
					params.mainTitle='关于项目【'+row.name+"】结项的审批申请";
					params.mainContext='项目编号：'+row.code+','+'项目名称：'+row.name+',项目周期：'+row.startTime+'~'+row.endTime
										+',预估及考核毛利率:'+row.budgetMarginRate+',预估总成本:'+row.planTotalCost+',总收入:'+row.totalReceivables
										+',合同金额:'+row.contractAmt+'详细如下(截图)：';
					params.restUrl=config.getXmBasePath()+"/xm/core/xmProject/processApprova"; 
					//this.html2canvas(document.querySelector(".editForm"),row,params);
					this.$router.push({name:'ProcdefListForBizStart',params:params}); 
				}else if(bizKey=="xm_project_pause_approva"){
					//结项审核
					params.mainTitle='关于项目【'+row.name+"】暂停的审批申请";
					params.mainContext='项目编号：'+row.code+','+'项目名称：'+row.name+',项目周期：'+row.startTime+'~'+row.endTime
										+',预估及考核毛利率:'+row.budgetMarginRate+',预估总成本:'+row.planTotalCost+',总收入:'+row.totalReceivables
										+',合同金额:'+row.contractAmt+'详细如下(截图)：';
					params.restUrl=config.getXmBasePath()+"/xm/core/xmProject/processApprova"; 
					this.$router.push({name:'ProcdefListForBizStart',params:params}); 
					//this.html2canvas(document.querySelector(".editForm"),row,params);
				}else if(bizKey=="xm_project_restart_approva"){
					//结项审核
					params.mainTitle='关于项目【'+row.name+"】重新启动的审批申请";
					params.mainContext='项目编号：'+row.code+','+'项目名称：'+row.name+',项目周期：'+row.startTime+'~'+row.endTime
										+',预估及考核毛利率:'+row.budgetMarginRate+',预估总成本:'+row.planTotalCost+',总收入:'+row.totalReceivables
										+',合同金额:'+row.contractAmt+'详细如下(截图)：';
					params.restUrl=config.getXmBasePath()+"/xm/core/xmProject/processApprova"; 
					//this.html2canvas(document.querySelector(".editForm"),row,params);
					this.$router.push({name:'ProcdefListForBizStart',params:params}); 
				}else if(bizKey=="xm_project_budget_change_approva"){
					//预算变更审核
					params.mainTitle='关于项目【'+row.name+"】预算变更的审批申请";
					params.mainContext='项目编号：'+row.code+','+'项目名称：'+row.name+'项目周期：'+row.startTime+'~'+row.endTime
										+',<br>变更前数据:预估及考核毛利率:'+this.selProject.budgetMarginRate+',预估总成本:'+this.selProject.planTotalCost+',总收入:'+this.selProject.totalReceivables
										+',合同金额:'+this.selProject.contractAmt
										+',<br>变更后数据:预估及考核毛利率:'+row.budgetMarginRate+',预估总成本:'+row.planTotalCost+',总收入:'+row.totalReceivables
										+',合同金额:'+row.contractAmt;
					params.restUrl=config.getXmBasePath()+"/xm/core/xmProject/processApprova"; 
					params.flowVars.data=row
					//this.html2canvas(document.querySelector(".editForm"),row,params);
					this.$router.push({name:'ProcdefListForBizStart',params:params}); 
				}else {
					this.$message.error("不支持的审批事项");
					return;
				} 
				
				//this.$store.dispatch('addVisitedViews', {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},
			handleCommand(command) { 
				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.data,command.bizKey);
				}
			},
			html2canvas(doc,row,params){
				this.load.edit=true;
				this.hideAllBtn(doc,true);
				html2canvas(doc).then(canvas => {
					
					let dataURL = canvas.toDataURL("image/png"); 
					uploadBase64({fileData:dataURL,categoryId:'workflow',storedb:'0',branchId:row.branchId,name:row.name+'.png'}).then(res=>{ 
						this.hideAllBtn(doc,false);
						params.mainContext=params.mainContext+'<br><img  style="max-width:100%;" src="'+res.data.data.url+'"/>' 
						this.$router.push({name:'ProcdefListForBizStart',params:params}); 
						this.load.edit=false;
					});

				});
			},
			hideAllBtn:function(doc,hide) {
                var btns = doc.getElementsByTagName('button');
                for (var i = 0; i < btns.length; i++) {
					if(hide==true){ 
                    	btns[i].style.display='none'
					}else{
						btns[i].style.display=''
					}
                 }
            }
			
			/**end 在上面加自定义方法**/
		},//end method
		components: {  html2canvas
		    //在下面添加其它组件 'xm-project-add':XmProjectEdit
		},
		mounted() { 
				 this.editForm=Object.assign({},this.selProject);
				 this.dateRanger=[this.editForm.startTime,this.editForm.endTime]
				listOption([{categoryId:'all',itemCode:'projectType'},{categoryId:'all',itemCode:'urgencyLevel'},{categoryId:'all',itemCode:'priority'},{categoryId:'all',itemCode:'projectStatus'}] ).then(res=>{
					if(res.data.tips.isOk){ 
						
						this.options['projectType']=res.data.data.projectType
						this.options['urgencyLevel']=res.data.data.urgencyLevel
						this.options['priority']=res.data.data.priority
						this.options['projectStatus']=res.data.data.projectStatus 
						//this.editForm.projectStatus=this.options['projectStatus'][0].optionValue
					}
				});
			
		}
	}

</script>

<style scoped>
.line{
  float:right;
  width: 100%;
  height: 1px;
  margin-top: -0.5em;
  background:#d4c4c4;
  position: relative;
  text-align: center;
}
</style>