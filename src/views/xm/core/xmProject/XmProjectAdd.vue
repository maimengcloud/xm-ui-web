<template>
	<section class="page-container padding border">
		<el-row class="page-main " :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table"> 
		<!--编辑界面 XmProject xm_project--> 
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">    
					<el-form-item label="项目代号" prop="code">
							<el-input v-model="addForm.code"  placeholder="项目代号，不可为空" >
								<template slot="append">
									<el-button type="text" @click="createProjectCode">自动生成</el-button>
								</template>
							</el-input>
							 <font color="blue" style="font-size:10px;">项目代号为合同上的项目代号，甲乙方共享;项目内部编号为 &nbsp;代号-四位随机码</font>
					</el-form-item>  					
					<el-form-item label="名称" prop="name">  
							<el-input  v-model="addForm.name" placeholder="项目名称" ></el-input> 
					</el-form-item>    
					
					<el-row>
						<el-col :span="12">
							<el-form-item label="项目类型" prop="xmType"> 
								<el-select v-model="addForm.xmType">
									<el-option v-for="(i,index) in dicts['projectType']" :label="i.name" :value="i.id" :key="index"></el-option> 
								</el-select>      
							</el-form-item>   
						</el-col>
						<el-col :span="12">
							<el-form-item label="紧急程度" prop="priority">   
								<el-select v-model="addForm.priority">
									<el-option v-for="(i,index) in dicts['priority']" :label="i.name" :value="i.id" :key="index"></el-option> 
								</el-select> 
							</el-form-item>  
						</el-col> 
					</el-row>
					<el-form-item label="预算控制"> 
						<el-form-item prop="budgetCtrl">
							<el-checkbox  v-model="addForm.budgetCtrl"  true-label="1" false-label="0" >总预算控制</el-checkbox>  
							<font style="font-size:12px;" color="blue">项目计划总预算不能大于项目总预算</font> 
						</el-form-item>  
						<el-form-item label="" prop="phaseBudgetCtrl">
							<el-checkbox  v-model="addForm.phaseBudgetCtrl"  true-label="1" false-label="0" >项目计划预算控制</el-checkbox> 
							<font style="font-size:12px;" color="blue">下级计划总预算不能大于上级计划总预算；每条计划的预算金额必须大于其关联任务的预算合计。</font> 
						</el-form-item> 
						<el-form-item label="" prop="phaseActCtrl">
							<el-checkbox  v-model="addForm.phaseActCtrl"  true-label="1" false-label="0" >实际金额控制</el-checkbox>  
							<font style="font-size:12px;" color="blue">每条计划实际金额不能大于预算金额;每条计划的预算金额必须大于其关联的任务的实际金额合计。</font> 
						</el-form-item> 
					
					</el-form-item>	 
						<el-row>
							<el-col :span="8">
						<el-form-item label="总控"  prop="admUserid">
							<el-input readonly v-model="addForm.admUsername" @click.native="showUserVisible('admUserid')"></el-input>
							<font style="font-size:12px;" color="blue"></font> 
						</el-form-item>  
							</el-col>
							<el-col :span="8">
						<el-form-item label="项目经理" prop="pmUserid"> 
							<el-input readonly v-model="addForm.pmUsername" @click.native="showUserVisible('pmUserid')"></el-input>
							<font style="font-size:12px;" color="blue"></font> 
						</el-form-item> 
							</el-col>
							<el-col :span="8">
						<el-form-item label="副经理、助理" prop="assUserid"> 
							<el-input readonly v-model="addForm.assUsername" @click.native="showUserVisible('assUserid')"></el-input>
							<font style="font-size:12px;" color="blue"></font> 
						</el-form-item>  
							</el-col>
						</el-row>
					<el-form-item label="项目预估" >
						   <el-tabs>
								<el-tab-pane label="工作量及人力成本" name="planWorkload">
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
										<el-input  style="width:150px;" type="number" v-model="addForm.planWorkingHours" :precision="2" :step="8" :min="0" placeholder="预计工时"></el-input><el-tag>参考工时{{autoParams.planWorkingHours}}小时,工作日{{autoParams.weekday}}天</el-tag>  
										
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
										<el-col :span="4"><el-input style="width:120px;"  type="number" v-model="addForm.planIuserCnt" :precision="0" :step="1" :min="0" placeholder="内购人数"></el-input>  
										</el-col>
										<el-col :span="4">{{autoParams.planIuserWorkload}}人时</el-col>
										<el-col :span="4"><el-input  style="width:120px;" type="number" v-model="addForm.planIuserPrice" :precision="0" :step="1" :min="0" placeholder="预计内部人时单价"></el-input> </el-col>
										<el-col :span="8">{{this.toFixed(autoParams.planIuserAt)}}元,{{this.toFixed(autoParams.planIuserAt/10000)}} 万元</el-col>
									</el-row>
									<el-divider></el-divider>
									<el-row>
										<el-col :span="4">外购</el-col>
										<el-col :span="4"><el-input  style="width:120px;" type="number" v-model="addForm.planOuserCnt" :precision="0" :step="1" :min="0" placeholder="外购人数"></el-input>  
										</el-col>
										<el-col :span="4">{{autoParams.planOuserWorkload}}人时</el-col>
										<el-col :span="4"><el-input  style="width:120px;" type="number" v-model="addForm.planOuserPrice" :precision="0" :step="1" :min="0" placeholder="预计外购人时单价"></el-input> </el-col>
										<el-col :span="4">{{autoParams.planOuserAt }} 元 {{autoParams.planOuserAt/10000 }}万元</el-col>
									
									</el-row>
									<el-divider></el-divider>
									<el-row>
										<el-col :span="4">合计</el-col>
										<el-col :span="4"> {{autoParams.planOuserCnt+autoParams.planIuserCnt}}
										</el-col>
										<el-col :span="4">{{autoParams.planOuserWorkload+autoParams.planIuserWorkload  }}人时,{{ (autoParams.planOuserWorkload+autoParams.planIuserWorkload)/8/20  }}人月 </el-col>
										<el-col :span="4">平均：{{ (parseFloat2(autoParams.planOuserPrice) + parseFloat2(autoParams.planIuserPrice))/2}}元/人时</el-col>
										<el-col :span="8">{{autoParams.planTotalCost}} 元，{{(autoParams.planTotalCost)/10000}} 万元</el-col>
									</el-row> 
								 	 
								</el-tab-pane>
								<el-tab-pane label="成本总览" name="planTotalCost">
									<el-row>
										内购：  <el-input style="width:120px;" type="number" v-model="addForm.planIuserAt" :precision="2" :step="1000" :min="0" placeholder="内部人力成本总预算"></el-input> <el-tag> {{this.toFixed(autoParams.planIuserAt/10000)}}万元</el-tag>
										外购：  <el-input style="width:120px;" type="number" v-model="addForm.planOuserAt" :precision="2" :step="1000" :min="0" placeholder="外购人力成本总预算"></el-input> <el-tag> {{this.toFixed(autoParams.planOuserAt/10000)}}万元</el-tag>
										非人力：<el-input style="width:120px;" type="number" v-model="addForm.planNouserAt" :precision="2" :step="1000" :min="0" placeholder="人力成本总预算"></el-input> <el-tag> {{this.toFixed( autoParams.planNouserAt/10000)}}万元</el-tag>
									</el-row>
									<el-divider></el-divider>
									<el-row>
										合计： <el-input style="width:150px;" type="number" v-model="addForm.planTotalCost" :precision="2" :step="1000" :min="0" placeholder="总成本预算"></el-input> <el-tag> {{this.toFixed(autoParams.planTotalCost/10000)}}万元</el-tag>
 									</el-row>
								</el-tab-pane> 
								<el-tab-pane label="合同收入" name="contractAmt">
									<el-row> 
										预计收款总额：<el-input style="width:150px;" type="number" v-model="addForm.totalReceivables" :precision="2" :step="1000" :min="0" placeholder="预计总收款金额"></el-input> <el-tag> {{this.toFixed(autoParams.totalReceivables/10000)}}万</el-tag>
										合同总金额  ：<el-input style="width:150px;" type="number" v-model="addForm.contractAmt" :precision="2" :step="1000" :min="0" placeholder="合同总金额"></el-input> <el-tag> {{this.toFixed(autoParams.contractAmt/10000)}}万</el-tag>
 									</el-row>
								</el-tab-pane>  
								<el-tab-pane label="毛利水平" name="budgetTaxRate">
									<el-row> 
										税率：<el-input style="width:120px;" type="number" v-model="addForm.taxRate" :precision="2" :step="0.01" :min="0" :max="0.99" placeholder="税率"></el-input> 
										考核标准毛利率：<el-input style="width:120px;" type="number" v-model="addForm.budgetMarginRate" :precision="2" :step="0.01" :min="0" :max="0.99" placeholder="毛利率"></el-input> 
										当前毛利率为：<el-tag>{{toFixed(parseFloat2(autoParams.currentBudgetMarginRate)*100,2)}}%</el-tag>
 									</el-row>
								</el-tab-pane>  
								
							</el-tabs>
					</el-form-item>  
					 
					<el-form-item label="项目描述" prop="description">
						<el-input type="textarea" :rows="6" v-model="addForm.description" placeholder="项目描述" ></el-input>
					</el-form-item>     
			</el-form>  

		</el-row>
		<el-row>
			<el-button @click.native="handleCancel">取消</el-button>  
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
		</el-row>  
		<el-drawer append-to-body title="选择员工" :visible.sync="userSelectVisible" size="60%">
			<users-select isSingleUser=true   @confirm="onUserSelected" ref="usersSelect"></users-select>
		</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {sn} from '@/common/js/sequence';//全局公共库

	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { addXmProject,createProjectCode } from '@/api/xm/core/xmProject'; 
	import { mapGetters } from 'vuex';  
	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
			
			autoParams:function(){
				
				 
				var planOuserPrice=this.toFixed(this.addForm.planOuserPrice)
				var planIuserPrice=this.toFixed(this.addForm.planIuserPrice)
				var planOuserCnt=this.toFixed(this.addForm.planOuserCnt)
				var planIuserCnt=this.toFixed(this.addForm.planIuserCnt)
				var planWorkingHours=this.toFixed(this.addForm.planWorkingHours )
				var planNouserAt=this.toFixed(this.addForm.planNouserAt ) 
				var budgetMarginRate=this.toFixed(this.addForm.budgetMarginRate,4 ) 
				var taxRate=this.toFixed(this.addForm.taxRate,4)
				if(planOuserPrice==null || planOuserPrice==''){
					planOuserPrice=100
				}
				if(planIuserPrice==null || planIuserPrice==''){
					planIuserPrice=80
				}
				if(planOuserCnt==null || planOuserCnt==''){
					planOuserCnt=0.0
				}
				if(planIuserCnt==null || planIuserCnt==''){
					planIuserCnt=0.0
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
					if(this.addForm.planWorkingHours==null || this.addForm.planWorkingHours=='' || this.addForm.planWorkingHours<=0){
						planWorkingHours=weekday * 8
					}
					
			 	} 
				autoParams.weekday=weekday
				autoParams.planWorkingHours=planWorkingHours
				autoParams.planOuserPrice=planOuserPrice
				autoParams.planIuserPrice=planIuserPrice
				autoParams.planOuserCnt=planOuserCnt
				autoParams.planIuserCnt=planIuserCnt 
				autoParams.taxRate=taxRate 
				autoParams.planIuserWorkload= planIuserCnt*planWorkingHours
				autoParams.planOuserWorkload= planOuserCnt*planWorkingHours
				autoParams.planWorkload=  planIuserCnt*planWorkingHours + planOuserCnt*planWorkingHours
				autoParams.planOuserAt= planOuserCnt * planWorkingHours * planOuserPrice
				autoParams.planIuserAt=  planIuserCnt * planWorkingHours * planIuserPrice
				autoParams.planNouserAt= planNouserAt
				autoParams.budgetMarginRate=budgetMarginRate
				autoParams.planTotalCost=  autoParams.planOuserAt + autoParams.planIuserAt + autoParams.planNouserAt
				autoParams.totalReceivables=autoParams.planTotalCost/(1-budgetMarginRate)/ (1-taxRate)
				autoParams.contractAmt =autoParams.totalReceivables
				var totalReceivables=this.addForm.totalReceivables
				if(totalReceivables==null || totalReceivables=='' || isNaN(totalReceivables)){
					autoParams.currentBudgetMarginRate=-99
				}else{ 
					autoParams.currentBudgetMarginRate= this.toFixed(1-this.addForm.planTotalCost/(this.addForm.totalReceivables* (1-taxRate)),4)
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
					planOuserAt:this.addForm.planOuserAt,
					planIuserAt:this.addForm.planIuserAt,
					planNouserAt:this.addForm.planNouserAt,  
				}
			},
			
			totalReceivables:function(){
				 return this.addForm.totalReceivables
			}
		},
		props:['visible','xmProduct'],
		watch: { 
	      'visible':function(visible) { 
	      	if(visible==true){  
	      	}
		  },
		  'planTotalAt':{
			  handler(planTotalAt){  
				this.addForm.planTotalCost=this.toFixed(this.parseFloat2(planTotalAt.planOuserAt)+this.parseFloat2(planTotalAt.planIuserAt)+this.parseFloat2(planTotalAt.planNouserAt))
				//this.addForm.totalReceivables=this.toFixed(this.parseFloat2(this.addForm.planTotalCost) * (1+0.3)) 
			  },
			  deep:true
		  },
		  'totalReceivables':function(){
			  //this.addForm.budgetMarginRate=this.toFixed((this.addForm.totalReceivables-this.addForm.planTotalCost)/this.addForm.totalReceivables,4)
		  },
		  
		  autoParams(){ 
			  this.fillPlanWorkingHoursToField()
			  this.fillPlanCostAtToField();
			  this.fillTotalReceivablesToField();
			  this.fillBudgetMarginRateToField()
		  },
	    },
		data() { 
			 const beginDate = new Date();
			const endDate = new Date();
			endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
			return {
				filters: {
					ids: [],
				},
				dicts:{ 
					projectType:[],
					urgencyLevel:[],
					priority:[],
					projectStatus:[], 
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				addFormRules: {
					name: [{
						required: true, message: '项目名称不可为空' , trigger: 'change'
					}], 
					
					code: [{
						required: true, message: '项目代号不可为空', trigger: 'change'
					}],
					xmType: [{
						required: true, message: '项目类型不可为空', trigger: 'change'
					}],
					urgent: [{
						required: true, message: '紧急程度不可为空', trigger: 'change'
					}],
					priority: [{
						required: true, message: '优先程度不可为空', trigger: 'change'
					}], 
					admUserid: [{
						required: true, message: '项目总控不能为空', trigger: 'change'
					}], 
					pmUserid: [{
						required: true, message: '项目经理不能为空', trigger: 'change'
					}], 
				},
				//编辑界面数据  XmProject xm_project
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:0,bizProcInstId:'',bizFlowState:'',taxRate:0.06,planNouserAt:0,planIuserAt:0,planOuserAt:0,locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:0,totalReceivables:0,budgetMarginRate:0.13,contractAmt:0,planIuserPrice:85,planOuserPrice:100,planOuserCnt:1,planIuserCnt:1,planWorkingHours:0,planIuserWorkload:0,planOuserWorkload:0,budgetCtrl:'0',admUserid:'',admUsername:'',pmUserid:'',pmUsername:'',assUserid:'',assUsername:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				xmGroups:[],
				userSelectType: "",
				userSelectVisible: false,
				groupSelectVisible:false,
 				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				dateRanger: [ ],  
				 pickerOptions:  util.pickerOptions('datarange'),
				 
				currUserType:'',
				userSelectVisible:false,
				maxTableHeight:300,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: { 
			//打开用户选择 
			//选择接收人 
 
			showProjectGroups:function(){ 
				this.groupSelectVisible=true;
			},
			//项目团队选择
			onGroupSelected(groups){
				this.xmGroups=groups;
				this.groupSelectVisible=false;
			},

			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){ 
				this.$emit('cancel');
			},
			//编辑提交XmProject xm_project父组件监听@submit="afterEditSubmit"
			addSubmit: function () { 
				if (
					this.dateRanger != null &&
					this.dateRanger.length == 2
				) {
					this.addForm.startTime = this.dateRanger[0]  
					this.addForm.endTime = this.dateRanger[1]  
				}else{
					this.$notify({showClose: true, message: "请输入开始日期和结束日期", type: 'error' }); 
					return;
				} 
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						var msg=this.xmProduct&&this.xmProduct.id?'将自动关联产品【'+this.xmProduct.productName+'】':'';
						this.$confirm('确认提交吗？'+msg, '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm);  
							if(this.xmProduct && this.xmProduct.id){
								params.links=[{productId:this.xmProduct.id}]
							}
							params.planIuserWorkload=this.autoParams.planIuserWorkload 
							params.planOuserWorkload=this.autoParams.planOuserWorkload
							params.planWorkload=this.autoParams.planWorkload
							addXmProject(params).then((res) => {
								this.load.add=false;
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit',res.data.data);//  @submit="afterEditSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.add=false);
						});
					}else{
						this.$notify({showClose: true, message: "表单检查不通过，请修改后提交", type:'error'}); 
					}
				});
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
				this.addForm=Object.assign(this.addForm,this.autoParams);
			},
			fillPlanWorkingHoursToField:function(){
				this.addForm.planWorkingHours=this.toFixed(this.autoParams.planWorkingHours)
			},
			
			fillPlanCostAtToField:function(){
				this.addForm.planNouserAt=this.toFixed(this.autoParams.planNouserAt)
				this.addForm.planOuserAt=this.toFixed(this.autoParams.planOuserAt )
				this.addForm.planIuserAt=this.toFixed(this.autoParams.planIuserAt )
				this.addForm.planTotalCost=this.toFixed(this.autoParams.planTotalCost)

			},
			
			fillTotalReceivablesToField:function(){
				this.addForm.totalReceivables=this.toFixed(this.autoParams.totalReceivables )
				this.addForm.contractAmt=this.toFixed(this.autoParams.contractAmt  )
			},
			fillBudgetMarginRateToField:function(){
				this.addForm.budgetMarginRate=this.toFixed(this.autoParams.budgetMarginRate,4) 
			}, 
			createProjectCode(){
				createProjectCode({}).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.addForm.code=res.data.data
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
			},
			showUserVisible(userType){
				this.currUserType=userType
				this.userSelectVisible=true;
			},
			//选择人员
			onUserSelected: function(users) {  
				this.userSelectVisible = false;
				var user={userid:'',username:''}; 
				if(users && users.length>0){
					user=users[0]
				}
				 
				if(this.currUserType=='admUserid'){ 
					this.addForm.admUserid=user.userid
					this.addForm.admUsername=user.username
				}else if(this.currUserType=='assUserid'){ 
					this.addForm.assUserid=user.userid
					this.addForm.assUsername=user.username
				}else if(this.currUserType=='pmUserid'){ 
					this.addForm.pmUserid=user.userid
					this.addForm.pmUsername=user.username
				}
				this.currUserType="";
				
			}, 
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    UsersSelect,
		},
		mounted() {  
			
			this.maxTableHeight=util.calcTableMaxHeight(this.$refs.table.$el); 
			this.addForm.pmUserid=this.userInfo.userid
			this.addForm.pmUsername=this.userInfo.username
			this.addForm.admUserid=this.userInfo.userid
			this.addForm.admUsername=this.userInfo.username
			this.addForm.assUserid=this.userInfo.userid
			this.addForm.assUsername=this.userInfo.username
			initSimpleDicts('all',['projectType','urgencyLevel','priority','projectStatus']).then(res=>{
				this.dicts=res.data.data;
			})
			
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