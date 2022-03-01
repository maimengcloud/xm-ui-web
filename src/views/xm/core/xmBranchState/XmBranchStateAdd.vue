<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<!--新增界面 XmBranchState 机构内所有项目指标汇总--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="统计日期yyyy-mm-dd类型" prop="bizDate">
					<el-input v-model="addForm.bizDate" placeholder="统计日期yyyy-mm-dd类型" ></el-input>
				</el-form-item> 
				<el-form-item label="文件数据" prop="totalFileCnt">
					<el-input-number v-model="addForm.totalFileCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="bug数目" prop="totalBugCnt">
					<el-input-number v-model="addForm.totalBugCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="任务数" prop="totalTaskCnt">
					<el-input-number v-model="addForm.totalTaskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="项目总非人力预算-来自项目表" prop="totalBudgetNouserAmount">
					<el-input v-model="addForm.totalBudgetNouserAmount" placeholder="项目总非人力预算-来自项目表"></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="总参与人数" prop="totalStaffCnt">
					<el-input-number v-model="addForm.totalStaffCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="统计执行日期" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.calcTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖" prop="calcStatus">
					<el-input v-model="addForm.calcStatus" placeholder="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖" ></el-input>
				</el-form-item> 
				<el-form-item label="项目总非人力成本" prop="totalCostNouserAmount">
					<el-input v-model="addForm.totalCostNouserAmount" placeholder="项目总非人力成本"></el-input>
				</el-form-item> 
				<el-form-item label="已关闭bug总数" prop="totalClosedBugCnt">
					<el-input-number v-model="addForm.totalClosedBugCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已解决bug总数" prop="totalResolvedBugCnt">
					<el-input-number v-model="addForm.totalResolvedBugCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已完成任务总数-来自任务表" prop="totalCompleteTaskCnt">
					<el-input-number v-model="addForm.totalCompleteTaskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="项目计划数" prop="totalPhaseCnt">
					<el-input-number v-model="addForm.totalPhaseCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="项目计划已完成数" prop="totalCompletePhaseCnt">
					<el-input-number v-model="addForm.totalCompletePhaseCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="待付款总金额" prop="totalNeedPayAmount">
					<el-input v-model="addForm.totalNeedPayAmount" placeholder="待付款总金额"></el-input>
				</el-form-item> 
				<el-form-item label="已付款总金额" prop="totalFinishPayAmount">
					<el-input v-model="addForm.totalFinishPayAmount" placeholder="已付款总金额"></el-input>
				</el-form-item> 
				<el-form-item label="待收款总金额" prop="totalNeedColAmount">
					<el-input v-model="addForm.totalNeedColAmount" placeholder="待收款总金额"></el-input>
				</el-form-item> 
				<el-form-item label="已收款总金额" prop="totalFinishColAmount">
					<el-input v-model="addForm.totalFinishColAmount" placeholder="已收款总金额"></el-input>
				</el-form-item> 
				<el-form-item label="项目总人力成本" prop="totalCostUserAmount">
					<el-input v-model="addForm.totalCostUserAmount" placeholder="项目总人力成本"></el-input>
				</el-form-item> 
				<el-form-item label="项目总内部人力预算-来自项目表" prop="totalBudgetInnerUserAmount">
					<el-input v-model="addForm.totalBudgetInnerUserAmount" placeholder="项目总内部人力预算-来自项目表"></el-input>
				</el-form-item> 
				<el-form-item label="项目总预算工作量-来自项目表" prop="totalPlanWorkload">
					<el-input v-model="addForm.totalPlanWorkload" placeholder="项目总预算工作量-来自项目表"></el-input>
				</el-form-item> 
				<el-form-item label="项目风险总数" prop="totalRiskCnt">
					<el-input-number v-model="addForm.totalRiskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已完成风险总数" prop="totalCompleteRiskCnt">
					<el-input-number v-model="addForm.totalCompleteRiskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构编号" ></el-input>
				</el-form-item> 
				<el-form-item label="机构名称" prop="branchName">
					<el-input v-model="addForm.branchName" placeholder="机构名称" ></el-input>
				</el-form-item> 
				<el-form-item label="项目总外购人力预算-来自项目表" prop="totalBudgetOutUserAmount">
					<el-input v-model="addForm.totalBudgetOutUserAmount" placeholder="项目总外购人力预算-来自项目表"></el-input>
				</el-form-item> 
				<el-form-item label="已完成工作量-来自计划中实际完成工作量" prop="totalCompleteWorkload">
					<el-input v-model="addForm.totalCompleteWorkload" placeholder="已完成工作量-来自计划中实际完成工作量"></el-input>
				</el-form-item> 
				<el-form-item label="项目总内部人力成本金额" prop="totalCostInnerUserAmount">
					<el-input v-model="addForm.totalCostInnerUserAmount" placeholder="项目总内部人力成本金额"></el-input>
				</el-form-item> 
				<el-form-item label="项目总外购人力成本金额" prop="totalCostOutUserAmount">
					<el-input v-model="addForm.totalCostOutUserAmount" placeholder="项目总外购人力成本金额"></el-input>
				</el-form-item> 
				<el-form-item label="项目进度0~100之间，来自任务表" prop="totalProgress">
					<el-input v-model="addForm.totalProgress" placeholder="项目进度0~100之间，来自任务表"></el-input>
				</el-form-item> 
				<el-form-item label="激活的bug总数" prop="totalActiveBugCnt">
					<el-input-number v-model="addForm.totalActiveBugCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已解决bug总数" prop="totalConfirmedBugCnt">
					<el-input-number v-model="addForm.totalConfirmedBugCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停" prop="projectStatus">
					<el-input v-model="addForm.projectStatus" placeholder="项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停" ></el-input>
				</el-form-item> 
				<el-form-item label="实际总工作量，来自任务表" prop="totalActWorkload">
					<el-input v-model="addForm.totalActWorkload" placeholder="实际总工作量，来自任务表"></el-input>
				</el-form-item> 
				<el-form-item label="实际外购总工作量，来自任务表" prop="totalActOutWorkload">
					<el-input v-model="addForm.totalActOutWorkload" placeholder="实际外购总工作量，来自任务表"></el-input>
				</el-form-item> 
				<el-form-item label="实际内部总工作量，来自任务表" prop="totalActInnerWorkload">
					<el-input v-model="addForm.totalActInnerWorkload" placeholder="实际内部总工作量，来自任务表"></el-input>
				</el-form-item> 
				<el-form-item label="已经分配到任务的总预算" prop="totalTaskBudgetCostAt">
					<el-input v-model="addForm.totalTaskBudgetCostAt" placeholder="已经分配到任务的总预算"></el-input>
				</el-form-item> 
				<el-form-item label="外购任务数，来自任务表" prop="totalTaskOutCnt">
					<el-input v-model="addForm.totalTaskOutCnt" placeholder="外购任务数，来自任务表"></el-input>
				</el-form-item> 
				<el-form-item label="待付款笔数" prop="totalNeedPayCnt">
					<el-input v-model="addForm.totalNeedPayCnt" placeholder="待付款笔数"></el-input>
				</el-form-item> 
				<el-form-item label="完成付款总比数" prop="totalFinishPayCnt">
					<el-input v-model="addForm.totalFinishPayCnt" placeholder="完成付款总比数"></el-input>
				</el-form-item> 
				<el-form-item label="已付款总人数" prop="totalFinishPayUserCnt">
					<el-input v-model="addForm.totalFinishPayUserCnt" placeholder="已付款总人数"></el-input>
				</el-form-item> 
				<el-form-item label="待付款总人数" prop="totalNeedPayUserCnt">
					<el-input v-model="addForm.totalNeedPayUserCnt" placeholder="待付款总人数"></el-input>
				</el-form-item> 
				<el-form-item label="内部人力总工作量-应该大于或等于计划内部人力总成本" prop="totalPlanInnerUserWorkload">
					<el-input v-model="addForm.totalPlanInnerUserWorkload" placeholder="内部人力总工作量-应该大于或等于计划内部人力总成本"></el-input>
				</el-form-item> 
				<el-form-item label="外购人力总工作量-应该大于或等于计划外购人力总成本" prop="totalPlanOutUserWorkload">
					<el-input v-model="addForm.totalPlanOutUserWorkload" placeholder="外购人力总工作量-应该大于或等于计划外购人力总成本"></el-input>
				</el-form-item> 
				<el-form-item label="测试案例总数" prop="testCases">
					<el-input-number v-model="addForm.testCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="测试中案例总数" prop="execCases">
					<el-input-number v-model="addForm.execCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="设计中案例总数" prop="designCases">
					<el-input-number v-model="addForm.designCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="完成案例总数" prop="finishCases">
					<el-input-number v-model="addForm.finishCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="迭代数" prop="iterationCnt">
					<el-input-number v-model="addForm.iterationCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="产品数" prop="productCnt">
					<el-input-number v-model="addForm.productCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="需求数" prop="menuCnt">
					<el-input-number v-model="addForm.menuCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addXmBranchState } from '@/api/xm/core/xmBranchState';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmBranchState','visible'],
		watch: {
	      'xmBranchState':function( xmBranchState ) {
	        this.addForm = xmBranchState;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 机构内所有项目指标汇总
				addForm: {
					bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',id:'',totalStaffCnt:'',calcTime:'',calcStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetInnerUserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOutUserAmount:'',totalCompleteWorkload:'',totalCostInnerUserAmount:'',totalCostOutUserAmount:'',totalProgress:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',totalPlanInnerUserWorkload:'',totalPlanOutUserWorkload:'',testCases:'',execCases:'',designCases:'',finishCases:'',iterationCnt:'',productCnt:'',menuCnt:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmBranchState 机构内所有项目指标汇总 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addXmBranchState(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-branch-state-edit':XmBranchStateEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmBranchState);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>