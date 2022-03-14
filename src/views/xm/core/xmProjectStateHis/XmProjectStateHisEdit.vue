<template>
	<section class="page-container  padding border">
		<el-row> 
		<!--编辑界面 XmProjectStateHis xm_project_state_his--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号"></el-input>
				</el-form-item> 
				<el-form-item label="统计日期yyyy-mm-dd类型" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="统计日期yyyy-mm-dd类型"></el-input>
				</el-form-item> 
				<el-form-item label="文件数据" prop="totalFileCnt">
					<el-input-number v-model="editForm.totalFileCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="bug数目" prop="totalBugCnt">
					<el-input-number v-model="editForm.totalBugCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="任务数" prop="totalTaskCnt">
					<el-input-number v-model="editForm.totalTaskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="项目总非人力预算-来自项目表" prop="totalBudgetNouserAmount">
					<el-input v-model="editForm.totalBudgetNouserAmount" placeholder="项目总非人力预算-来自项目表"></el-input>
				</el-form-item> 
				<el-form-item label="项目名称" prop="projectName">
					<el-input v-model="editForm.projectName" placeholder="项目名称"></el-input>
				</el-form-item> 
				<el-form-item label="xm_project_state原表主键id" prop="stateId">
					<el-input v-model="editForm.stateId" placeholder="xm_project_state原表主键id"></el-input>
				</el-form-item> 
				<el-form-item label="总参与人数" prop="totalStaffCnt">
					<el-input-number v-model="editForm.totalStaffCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="统计执行日期" prop="calCtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.calCtime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖" prop="calStatus">
					<el-input v-model="editForm.calStatus" placeholder="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖"></el-input>
				</el-form-item> 
				<el-form-item label="项目总非人力成本" prop="totalCostNouserAmount">
					<el-input v-model="editForm.totalCostNouserAmount" placeholder="项目总非人力成本"></el-input>
				</el-form-item> 
				<el-form-item label="已关闭bug总数" prop="totalCloseBugCnt">
					<el-input-number v-model="editForm.totalCloseBugCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已解决bug总数" prop="totalResolveBugCnt">
					<el-input-number v-model="editForm.totalResolveBugCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已完成任务总数-来自任务表" prop="totalCompleteTaskCnt">
					<el-input-number v-model="editForm.totalCompleteTaskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="项目计划数" prop="totalPhaseCnt">
					<el-input-number v-model="editForm.totalPhaseCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="项目计划已完成数" prop="totalCompletePhaseCnt">
					<el-input-number v-model="editForm.totalCompletePhaseCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="待付款总金额" prop="totalNeedPayAmount">
					<el-input v-model="editForm.totalNeedPayAmount" placeholder="待付款总金额"></el-input>
				</el-form-item> 
				<el-form-item label="已付款总金额" prop="totalFinishPayAmount">
					<el-input v-model="editForm.totalFinishPayAmount" placeholder="已付款总金额"></el-input>
				</el-form-item> 
				<el-form-item label="待收款总金额" prop="totalNeedColAmount">
					<el-input v-model="editForm.totalNeedColAmount" placeholder="待收款总金额"></el-input>
				</el-form-item> 
				<el-form-item label="已收款总金额" prop="totalFinishColAmount">
					<el-input v-model="editForm.totalFinishColAmount" placeholder="已收款总金额"></el-input>
				</el-form-item> 
				<el-form-item label="项目总人力成本" prop="totalCostUserAmount">
					<el-input v-model="editForm.totalCostUserAmount" placeholder="项目总人力成本"></el-input>
				</el-form-item> 
				<el-form-item label="项目总内部人力预算-来自项目表" prop="totalBudgetIuserAmount">
					<el-input v-model="editForm.totalBudgetIuserAmount" placeholder="项目总内部人力预算-来自项目表"></el-input>
				</el-form-item> 
				<el-form-item label="项目总预算工作量-来自项目表" prop="totalPlanWorkload">
					<el-input v-model="editForm.totalPlanWorkload" placeholder="项目总预算工作量-来自项目表"></el-input>
				</el-form-item> 
				<el-form-item label="项目风险总数" prop="totalRiskCnt">
					<el-input-number v-model="editForm.totalRiskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已完成风险总数" prop="totalCompleteRiskCnt">
					<el-input-number v-model="editForm.totalCompleteRiskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="机构名称" prop="branchName">
					<el-input v-model="editForm.branchName" placeholder="机构名称"></el-input>
				</el-form-item> 
				<el-form-item label="项目总外购人力预算-来自项目表" prop="totalBudgetOuserAmount">
					<el-input v-model="editForm.totalBudgetOuserAmount" placeholder="项目总外购人力预算-来自项目表"></el-input>
				</el-form-item> 
				<el-form-item label="已完成工作量-来自计划中实际完成工作量" prop="totalCompleteWorkload">
					<el-input v-model="editForm.totalCompleteWorkload" placeholder="已完成工作量-来自计划中实际完成工作量"></el-input>
				</el-form-item> 
				<el-form-item label="本表主键" prop="id">
					<el-input v-model="editForm.id" placeholder="本表主键"></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { editXmProjectStateHis } from '@/api/xm/core/xmProjectStateHis';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectStateHis','visible'],
		watch: {
	      'xmProjectStateHis':function( xmProjectStateHis ) {
	        this.editForm = xmProjectStateHis;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '本表主键不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmProjectStateHis xm_project_state_his
				editForm: {
					projectId:'',bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',projectName:'',stateId:'',totalStaffCnt:'',calCtime:'',calStatus:'',totalCostNouserAmount:'',totalCloseBugCnt:'',totalResolveBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetIuserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOuserAmount:'',totalCompleteWorkload:'',id:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交XmProjectStateHis xm_project_state_his父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProjectStateHis(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-state-his-edit':XmProjectStateHisEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProjectStateHis);  
		}
	}

</script>

<style scoped>

</style>