<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 XmIterationState 迭代定义--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="迭代编码" prop="id">
					<el-input v-model="editForm.id" placeholder="迭代编码"></el-input>
				</el-form-item> 
				<el-form-item label="已分配到任务的预算从任务表汇总而来" prop="distBudgetCost">
					<el-input v-model="editForm.distBudgetCost" placeholder="已分配到任务的预算从任务表汇总而来"></el-input>
				</el-form-item> 
				<el-form-item label="已分配到任务的预算工作量从任务表汇总而来" prop="distBudgetWorkload">
					<el-input v-model="editForm.distBudgetWorkload" placeholder="已分配到任务的预算工作量从任务表汇总而来"></el-input>
				</el-form-item> 
				<el-form-item label="实际成本从任务表汇总而来" prop="actCost">
					<el-input v-model="editForm.actCost" placeholder="实际成本从任务表汇总而来"></el-input>
				</el-form-item> 
				<el-form-item label="实际工作量从任务表汇总而来" prop="actWorkload">
					<el-input v-model="editForm.actWorkload" placeholder="实际工作量从任务表汇总而来"></el-input>
				</el-form-item> 
				<el-form-item label="实际投入人员数" prop="actStaffNum">
					<el-input v-model="editForm.actStaffNum" placeholder="实际投入人员数"></el-input>
				</el-form-item> 
				<el-form-item label="进度" prop="finishRate">
					<el-input v-model="editForm.finishRate" placeholder="进度"></el-input>
				</el-form-item> 
				<el-form-item label="测试用例总数" prop="testCases">
					<el-input-number v-model="editForm.testCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="测试中用例总数" prop="execCases">
					<el-input-number v-model="editForm.execCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="设计中用例总数" prop="designCases">
					<el-input-number v-model="editForm.designCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="完成用例总数" prop="finishCases">
					<el-input-number v-model="editForm.finishCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="关联项目数" prop="projectCnt">
					<el-input-number v-model="editForm.projectCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="关联产品数" prop="productCnt">
					<el-input-number v-model="editForm.productCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="关联故事数" prop="menuCnt">
					<el-input-number v-model="editForm.menuCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="关联任务数" prop="taskCnt">
					<el-input-number v-model="editForm.taskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已完成的任务数" prop="finishTaskCnt">
					<el-input-number v-model="editForm.finishTaskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="计算日期" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.calcTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="迭代名称" prop="iterationName">
					<el-input v-model="editForm.iterationName" placeholder="迭代名称"></el-input>
				</el-form-item> 
				<el-form-item label="预算成本" prop="budgetCost">
					<el-input v-model="editForm.budgetCost" placeholder="预算成本"></el-input>
				</el-form-item> 
				<el-form-item label="预算工作量" prop="budgetWorkload">
					<el-input v-model="editForm.budgetWorkload" placeholder="预算工作量"></el-input>
				</el-form-item> 
				<el-form-item label="迭代编号" prop="iterationId">
					<el-input v-model="editForm.iterationId" placeholder="迭代编号"></el-input>
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
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editXmIterationState } from '@/api/xm/core/xmIterationState';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmIterationState','visible'],
		watch: {
	      'xmIterationState':function( xmIterationState ) {
	        this.editForm = xmIterationState;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '迭代编码不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmIterationState 迭代定义
				editForm: {
					id:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',finishRate:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',productCnt:'',menuCnt:'',taskCnt:'',finishTaskCnt:'',calcTime:'',iterationName:'',budgetCost:'',budgetWorkload:'',iterationId:''
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
			//编辑提交XmIterationState 迭代定义父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmIterationState(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-iteration-state-edit':XmIterationStateEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmIterationState);  
		}
	}

</script>

<style scoped>

</style>