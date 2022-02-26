<template>
	<section class="page-container padding border">
		<el-row class="page-main page-height-90"> 
		<!--编辑界面 XmProject xm_project--> 
			<el-form :model="addForm"  :rules="addFormRules" ref="addForm">   
					<el-form-item label="项目编号|名称" prop="name">
						<el-row>
							<el-input v-model="addForm.code" style="width:20%;" placeholder="项目编号，不可为空" ></el-input>
							<el-input style="width:50%;" v-model="addForm.name" placeholder="项目名称" ></el-input>
						</el-row>
					</el-form-item>  
					<el-form-item label="项目类型" prop="xmType"> 
					 	 <el-radio-group v-model="addForm.xmType">
							<el-radio v-for="(i,index) in options['projectType']" :label="i.optionValue" :key="index">{{i.optionName}}</el-radio> 
						</el-radio-group>  
					</el-form-item> 
					<el-form-item label="紧急程度" prop="urgent">
					 	 <el-radio-group v-model="addForm.urgent">
							<el-radio v-for="(i,index) in options['urgencyLevel']" :label="i.optionValue" :key="index">{{i.optionName}}</el-radio> 
						</el-radio-group>   
					</el-form-item>  
					<el-form-item label="优先程度" prop="priority">
					 	 <el-radio-group v-model="addForm.priority">
							<el-radio v-for="(i,index) in options['priority']" :label="i.optionValue" :key="index">{{i.optionName}}</el-radio> 
						</el-radio-group> 
					</el-form-item>   
					<el-form-item label="预算控制" prop="priority">
					 	<el-checkbox  v-model="addForm.budgetCtrl"  true-label="1" false-label="0" >严格控制预算</el-checkbox> 注：在项目->计划->任务 每个环节进行严格的预算控制
					</el-form-item>     
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
										<el-col :span="4"><el-input style="width:120px;"  type="number" v-model="addForm.planInnerUserCnt" :precision="0" :step="1" :min="0" placeholder="内购人数"></el-input>  
										</el-col>
										<el-col :span="4">{{autoParams.planInnerUserWorkload}}人时</el-col>
										<el-col :span="4"><el-input  style="width:120px;" type="number" v-model="addForm.planInnerUserPrice" :precision="0" :step="1" :min="0" placeholder="预计内部人时单价"></el-input> </el-col>
										<el-col :span="8">{{this.toFixed(autoParams.planInnerUserAt)}}元,{{this.toFixed(autoParams.planInnerUserAt/10000)}} 万元</el-col>
									</el-row>
									<el-divider></el-divider>
									<el-row>
										<el-col :span="4">外购</el-col>
										<el-col :span="4"><el-input  style="width:120px;" type="number" v-model="addForm.planOutUserCnt" :precision="0" :step="1" :min="0" placeholder="外购人数"></el-input>  
										</el-col>
										<el-col :span="4">{{autoParams.planOutUserWorkload}}人时</el-col>
										<el-col :span="4"><el-input  style="width:120px;" type="number" v-model="addForm.planOutUserPrice" :precision="0" :step="1" :min="0" placeholder="预计外购人时单价"></el-input> </el-col>
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
								 	 
								</el-tab-pane>
								<el-tab-pane label="成本总览" name="planTotalCost">
									<el-row>
										内购：  <el-input style="width:120px;" type="number" v-model="addForm.planInnerUserAt" :precision="2" :step="1000" :min="0" placeholder="内部人力成本总预算"></el-input> <el-tag> {{this.toFixed(autoParams.planInnerUserAt/10000)}}万元</el-tag>
										外购：  <el-input style="width:120px;" type="number" v-model="addForm.planOutUserAt" :precision="2" :step="1000" :min="0" placeholder="外购人力成本总预算"></el-input> <el-tag> {{this.toFixed(autoParams.planOutUserAt/10000)}}万元</el-tag>
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
			<el-drawer
				append-to-body
				title="项目分组"
				:visible.sync="groupSelectVisible"
				width="80%">
				<xm-project-group-formwork :sel-groups="xmProjectGroups" @select-confirm="onGroupSelected"></xm-project-group-formwork> 
			</el-drawer> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {sn} from '@/common/js/sequence';//全局公共库

	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addXmProject } from '@/api/xm/core/xmProject'; 
	import { mapGetters } from 'vuex'; 
	 
	import { getGroups } from '@/api/xm/core/xmProjectGroup';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
			
			autoParams:function(){
				
				 
				var planOutUserPrice=this.toFixed(this.addForm.planOutUserPrice)
				var planInnerUserPrice=this.toFixed(this.addForm.planInnerUserPrice)
				var planOutUserCnt=this.toFixed(this.addForm.planOutUserCnt)
				var planInnerUserCnt=this.toFixed(this.addForm.planInnerUserCnt)
				var planWorkingHours=this.toFixed(this.addForm.planWorkingHours )
				var planNouserAt=this.toFixed(this.addForm.planNouserAt ) 
				var budgetMarginRate=this.toFixed(this.addForm.budgetMarginRate,4 ) 
				var taxRate=this.toFixed(this.addForm.taxRate,4)
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
					if(this.addForm.planWorkingHours==null || this.addForm.planWorkingHours=='' || this.addForm.planWorkingHours<=0){
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
					planOutUserAt:this.addForm.planOutUserAt,
					planInnerUserAt:this.addForm.planInnerUserAt,
					planNouserAt:this.addForm.planNouserAt,  
				}
			},
			
			totalReceivables:function(){
				 return this.addForm.totalReceivables
			}
		},
		props:['visible'],
		watch: { 
	      'visible':function(visible) { 
	      	if(visible==true){  
	      	}
		  },
		  'planTotalAt':{
			  handler(planTotalAt){  
				this.addForm.planTotalCost=this.toFixed(this.parseFloat2(planTotalAt.planOutUserAt)+this.parseFloat2(planTotalAt.planInnerUserAt)+this.parseFloat2(planTotalAt.planNouserAt))
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
				options:{ 
					projectType:[],
					urgencyLevel:[],
					priority:[],
					projectStatus:[], 
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				addFormRules: {
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
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:0,bizProcInstId:'',bizFlowState:'',taxRate:0.06,planNouserAt:0,planInnerUserAt:0,planOutUserAt:0,locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:0,totalReceivables:0,budgetMarginRate:0.13,contractAmt:0,planInnerUserPrice:85,planOutUserPrice:100,planOutUserCnt:1,planInnerUserCnt:1,planWorkingHours:0,planInnerUserWorkload:0,planOutUserWorkload:0,budgetCtrl:'0',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				xmProjectGroups:[],
				userSelectType: "",
				userSelectVisible: false,
				groupSelectVisible:false,
 				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				dateRanger: [ ],  
				 pickerOptions:  util.pickerOptions('datarange'),
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
				this.xmProjectGroups=groups;
				this.groupSelectVisible=false;
			},

			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){ 
				this.$emit('cancel');
			},
			//编辑提交XmProject xm_project父组件监听@submit="afterEditSubmit"
			addSubmit: function () {
				if(!this.roles.some(i=>i.roleid=='projectAdmin')){
					this.$message({showClose: true, message: "只有项目经理可以建立项目", type: 'error' }); 
					return;
				}
				if (
					this.dateRanger != null &&
					this.dateRanger.length == 2
				) {
					this.addForm.startTime = this.dateRanger[0]  
					this.addForm.endTime = this.dateRanger[1]  
				}else{
					this.$message({showClose: true, message: "请输入开始日期和结束日期", type: 'error' }); 
					return;
				} 
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.groups=this.xmProjectGroups;
							params.planInnerUserWorkload=this.autoParams.planInnerUserWorkload
							
							params.planOutUserWorkload=this.autoParams.planOutUserWorkload
							params.planWorkload=this.autoParams.planWorkload
							addXmProject(params).then((res) => {
								this.load.add=false;
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit',params);//  @submit="afterEditSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.add=false);
						});
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
				this.addForm.planOutUserAt=this.toFixed(this.autoParams.planOutUserAt )
				this.addForm.planInnerUserAt=this.toFixed(this.autoParams.planInnerUserAt )
				this.addForm.planTotalCost=this.toFixed(this.autoParams.planTotalCost)

			},
			
			fillTotalReceivablesToField:function(){
				this.addForm.totalReceivables=this.toFixed(this.autoParams.totalReceivables )
				this.addForm.contractAmt=this.toFixed(this.autoParams.contractAmt  )
			},
			fillBudgetMarginRateToField:function(){
				this.addForm.budgetMarginRate=this.toFixed(this.autoParams.budgetMarginRate,4) 
			}, 

			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-add':XmProjectEdit
		},
		mounted() { 
			this.addForm.id=sn();
				listOption([{categoryId:'all',itemCode:'projectType'},{categoryId:'all',itemCode:'urgencyLevel'},{categoryId:'all',itemCode:'priority'},{categoryId:'all',itemCode:'projectStatus'}] ).then(res=>{
					if(res.data.tips.isOk){ 
						this.options['projectType']=res.data.data.projectType
						this.options['urgencyLevel']=res.data.data.urgencyLevel
						this.options['priority']=res.data.data.priority
						this.options['projectStatus']=res.data.data.projectStatus

						this.addForm.xmType=this.options['projectType'][0].optionValue
						this.addForm.urgent=this.options['urgencyLevel'][0].optionValue
						this.addForm.priority=this.options['priority'][0].optionValue
						//this.addForm.projectStatus=this.options['projectStatus'][0].optionValue
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