<template>
	<section class="page-container  padding border">
		<el-row>
		<!--编辑界面 XmProjectTemplate xm_project-->
			<div ref="editFormDiv">
				<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm" class="editForm">


						<el-form-item label="项目名称" prop="name">
							<el-input v-model="editForm.name" placeholder="项目名称" ></el-input>
						</el-form-item>
						<el-form-item label="项目编号" prop="code">
							<el-input v-model="editForm.code" placeholder="项目编号，不可为空" ></el-input>
						</el-form-item>
						<el-form-item label="项目状态" prop="status">
							<el-radio-group v-model="editForm.status">
								<el-radio v-for="(i,index) in dicts['projectStatus']" :label="i.id" :key="index">{{i.name}}</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="项目类型" prop="xmType">
							<el-radio-group v-model="editForm.xmType">
								<el-radio v-for="(i,index) in dicts['projectType']" :label="i.id" :key="index">{{i.name}}</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="优先级" prop="priority">
							<el-radio-group v-model="editForm.priority">
								<el-radio v-for="(i,index) in dicts['priority']" :label="i.id" :key="index">{{i.name}}</el-radio>
							</el-radio-group>
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
								<el-input  style="width:150px;" type="number" v-model="editForm.planWorkingHours" :precision="2" :step="8" :min="0" placeholder="预计工时"></el-input><el-tag>参考工时{{autoParams.planWorkingHours}}小时,工作日{{autoParams.weekday}}天</el-tag> <el-button @click.native="fillPlanWorkingHoursToField" type="success">填充工时</el-button>

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
								<el-col :span="4"><el-input style="width:150px;"  type="number" v-model="editForm.planIuserCnt" :precision="0" :step="1" :min="0" placeholder="内购人数"></el-input>
								</el-col>
								<el-col :span="4">{{autoParams.planIuserWorkload}}人时</el-col>
								<el-col :span="4"><el-input  style="width:150px;" type="number" v-model="editForm.planIuserPrice" :precision="0" :step="1" :min="0" placeholder="预计内部人时单价"></el-input> </el-col>
								<el-col :span="8">{{this.toFixed(autoParams.planIuserAt)}}元,{{this.toFixed(autoParams.planIuserAt/10000)}} 万元</el-col>
							</el-row>
							<el-divider></el-divider>
							<el-row>
								<el-col :span="4">外购</el-col>
								<el-col :span="4"><el-input  style="width:150px;" type="number" v-model="editForm.planOuserCnt" :precision="0" :step="1" :min="0" placeholder="外购人数"></el-input>
								</el-col>
								<el-col :span="4">{{autoParams.planOuserWorkload}}人时</el-col>
								<el-col :span="4"><el-input  style="width:150px;" type="number" v-model="editForm.planOuserPrice" :precision="0" :step="1" :min="0" placeholder="预计外购人时单价"></el-input> </el-col>
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
						</el-form-item>
						<el-form-item label="成本总览">
							<el-row>
								内购：  <el-input style="width:150px;" type="number" v-model="editForm.planIuserAt" :precision="2" :step="1000" :min="0" placeholder="内部人力成本总预算"></el-input> <el-tag>参考{{this.toFixed(autoParams.planIuserAt)}}元，{{this.toFixed(autoParams.planIuserAt/10000)}}万元</el-tag>
								外购：  <el-input style="width:150px;" type="number" v-model="editForm.planOuserAt" :precision="2" :step="1000" :min="0" placeholder="外购人力成本总预算"></el-input> <el-tag>参考{{this.toFixed(autoParams.planOuserAt)}}元，{{this.toFixed(autoParams.planOuserAt/10000)}}万元</el-tag>
								非人力：<el-input style="width:150px;" type="number" v-model="editForm.planNouserAt" :precision="2" :step="1000" :min="0" placeholder="人力成本总预算"></el-input> <el-tag>参考{{this.toFixed(autoParams.planNouserAt)}}元，{{this.toFixed( autoParams.planNouserAt/10000)}}万元</el-tag>
							</el-row>
							<el-divider></el-divider>
							<el-row>
								合计： <el-input style="width:150px;" type="number" v-model="editForm.planTotalCost" :precision="2" :step="1000" :min="0" placeholder="总成本预算"></el-input> <el-tag>参考{{this.toFixed(autoParams.planTotalCost)}}元，{{this.toFixed(autoParams.planTotalCost/10000)}}万元</el-tag>
								<el-button @click.native="fillPlanCostAtToField" type="success">填充</el-button>
							</el-row>
						</el-form-item>
						<el-form-item label="收入及盈利水平预估">
							<el-row>
								预计收款总额：<el-input style="width:150px;" type="number" v-model="editForm.totalReceivables" :precision="2" :step="1000" :min="0" placeholder="预计总收款金额"></el-input> <el-tag>参考{{this.toFixed(autoParams.totalReceivables)}}元，{{this.toFixed(autoParams.totalReceivables/10000)}}万元</el-tag>
								合同总金额  ：<el-input style="width:150px;" type="number" v-model="editForm.contractAmt" :precision="2" :step="1000" :min="0" placeholder="合同总金额"></el-input> <el-tag>参考{{this.toFixed(autoParams.contractAmt)}}元，{{this.toFixed(autoParams.contractAmt/10000)}}万元</el-tag>
								<el-button @click.native="fillTotalReceivablesToField" type="success">填充</el-button>
							</el-row>
							<el-row>
								税率：<el-input style="width:150px;" type="number" v-model="editForm.taxRate" :precision="2" :step="0.01" :min="0" :max="0.99" placeholder="税率"></el-input>
								考核标准毛利率：<el-input style="width:150px;" type="number" v-model="editForm.budgetMarginRate" :precision="2" :step="0.01" :min="0" :max="0.99" placeholder="毛利率"></el-input>
								当前毛利率为：<el-tag>{{toFixed(parseFloat2(autoParams.currentBudgetMarginRate)*100,2)}}%</el-tag>
								<el-button @click.native="fillBudgetMarginRateToField" type="success">填充</el-button>
							</el-row>
						</el-form-item>
						<el-form-item label="项目描述" prop="description">
							<el-input type="textarea" :rows="6" v-model="editForm.description" placeholder="项目描述" ></el-input>
						</el-form-item>
						<el-form-item>
							<el-col :span="24">
								<el-button v-if="selProjectTemplate.status=='0'" v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
								<el-button icon="el-icon-watch" type="danger"  @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_baseinfo_change_approva'})">基本信息修改申请</el-button>
								<el-button icon="el-icon-watch" type="danger"  @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_delay_approva'})">延期申请</el-button>
								<el-button icon="el-icon-star-on"  type="success"  @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_start_approva'})">立项申请</el-button>
								<el-button icon="el-icon-success"  type="success" @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_over_approva'})">结项申请</el-button>
								<el-button icon="el-icon-edit" type="warning"  @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_budget_change_approva'})">预算变更申请</el-button>
								<el-button icon="el-icon-video-pause" type="danger"   @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_pause_approva'})">项目暂停申请</el-button>
								<el-button icon="el-icon-video-play"  type="primary" @click="handleCommand({type:'sendToProcessApprova',data:editForm,bizKey:'xm_project_restart_approva'})">项目重新启动申请</el-button>

							</el-col>
						</el-form-item>
				</el-form>
			</div>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {sn} from '@/common/js/sequence';//全局公共库

	import config from "@/common/config"; //全局公共库

	import { editXmProjectTemplate } from '@/api/xm/core/xmProjectTemplate';

	import { mapGetters } from 'vuex';


	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]),

			autoParams:function(){


				var planOuserPrice=this.toFixed(this.editForm.planOuserPrice)
				var planIuserPrice=this.toFixed(this.editForm.planIuserPrice)
				var planOuserCnt=this.toFixed(this.editForm.planOuserCnt)
				var planIuserCnt=this.toFixed(this.editForm.planIuserCnt)
				var planWorkingHours=this.toFixed(this.editForm.planWorkingHours )
				var planNouserAt=this.toFixed(this.editForm.planNouserAt )
				var budgetMarginRate=this.toFixed(this.editForm.budgetMarginRate,4 )
				var taxRate=this.toFixed(this.editForm.taxRate,4)
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
					if(this.editForm.planWorkingHours==null || this.editForm.planWorkingHours=='' || this.editForm.planWorkingHours<=0){
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
					planOuserAt:this.editForm.planOuserAt,
					planIuserAt:this.editForm.planIuserAt,
					planNouserAt:this.editForm.planNouserAt,
				}
			},

			totalReceivables:function(){
				 return this.editForm.totalReceivables
			},
		},
		props:['selProjectTemplate','visible'],
		watch: {
	      'visible':function(visible) {
	      	if(visible==true){
	      		this.editForm=Object.assign({},this.selProjectTemplate)
	      	}
		  },
		  'planTotalAt':{
			  handler(planTotalAt){
				this.editForm.planTotalCost=this.toFixed(this.parseFloat2(planTotalAt.planOuserAt)+this.parseFloat2(planTotalAt.planIuserAt)+this.parseFloat2(planTotalAt.planNouserAt))
				//this.editForm.totalReceivables=this.toFixed(this.parseFloat2(this.editForm.planTotalCost) * (1+0.3))
			  },
			  deep:true
		  },
		  'totalReceivables':function(){
			  //this.editForm.budgetMarginRate=this.toFixed((this.editForm.totalReceivables-this.editForm.planTotalCost)/this.editForm.totalReceivables,4)
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
				dicts:{
					projectType:[],
					priority:[],
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
					priority: [{
						required: true, message: '优先级不可为空', trigger: 'blur'
					}],
				},
				//编辑界面数据  XmProjectTemplate xm_project
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:0,bizProcInstId:'',bizFlowState:'',taxRate:0.06,planNouserAt:0,planIuserAt:0,planOuserAt:0,locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:0,totalReceivables:0,budgetMarginRate:0.13,contractAmt:0,planIuserPrice:85,planOuserPrice:100,planOuserCnt:1,planIuserCnt:1,planWorkingHours:0,planIuserWorkload:0,planOuserWorkload:0,
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				dateRanger: [ ],
				pickerOptions:  util.getPickerOptions('datarange'),
				activateName:'planWorkload',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交XmProjectTemplate xm_project父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				if("0" != this.selProjectTemplate.status){
					this.$notify({position:'bottom-left',showClose:true,message: "只有初始状态的项目可以修改，如确实需要修改，请进行项目变更审批", type: 'error' });
					return;
				}
				if (
					this.dateRanger != null &&
					this.dateRanger.length == 2
				) {
					this.editForm.startTime = this.dateRanger[0] ;
					this.editForm.endTime = this.dateRanger[1] ;
				}else{
					this.$notify({position:'bottom-left',showClose:true,message: "请输入开始日期和结束日期", type: 'error' });
					return;
				}

				if(!this.editForm.productId){
					this.$notify({position:'bottom-left',showClose:true,message: "请选择归属产品", type: 'error' });
					return;
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							params.planIuserWorkload=this.autoParams.planIuserWorkload
							params.planOuserWorkload=this.autoParams.planOuserWorkload
							params.planWorkload=this.autoParams.planWorkload
							editXmProjectTemplate(params).then((res) => {
								this.load.edit=false;
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit',params);//  @submit="afterEditSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err =>this.load.edit=false);
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
				this.editForm=Object.assign(this.editForm,this.autoParams);
			},
			fillPlanWorkingHoursToField:function(){
				this.editForm.planWorkingHours=this.toFixed(this.autoParams.planWorkingHours)
			},

			fillPlanCostAtToField:function(){
				this.editForm.planNouserAt=this.toFixed(this.autoParams.planNouserAt)
				this.editForm.planOuserAt=this.toFixed(this.autoParams.planOuserAt )
				this.editForm.planIuserAt=this.toFixed(this.autoParams.planIuserAt )
				this.editForm.planTotalCost=this.toFixed(this.autoParams.planTotalCost)

			},

			fillTotalReceivablesToField:function(){
				this.editForm.totalReceivables=this.toFixed(this.autoParams.totalReceivables )
				this.editForm.contractAmt=this.toFixed(this.autoParams.contractAmt  )
			},
			fillBudgetMarginRateToField:function(){
				this.editForm.budgetMarginRate=this.toFixed(this.autoParams.budgetMarginRate,4)
			},

			/**end 在上面加自定义方法**/
		},//end method
		components: {
 		    //在下面添加其它组件 'xm-project-add':XmProjectTemplateEdit
		},
		mounted() {
			 	this.editForm=Object.assign({},this.selProjectTemplate);

				initSimpleDicts('all',['projectType','priority','projectStatus']).then(res=>{
					this.dicts['projectType']=res.data.data.projectType
					this.dicts['priority']=res.data.data.priority
					this.dicts['priority']=res.data.data.priority
					this.dicts['projectStatus']=res.data.data.projectStatus
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
