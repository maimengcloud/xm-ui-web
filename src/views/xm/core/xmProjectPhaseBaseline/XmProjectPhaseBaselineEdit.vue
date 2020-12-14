<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 XmProjectPhaseBaseline xm_project_phase_baseline--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="基线建立时间" prop="baseCtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.baseCtime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="阶段主键" prop="projectPhaseId">
					<el-input v-model="editForm.projectPhaseId" placeholder="阶段主键"></el-input>
				</el-form-item> 
				<el-form-item label="阶段名称" prop="phaseName">
					<el-input v-model="editForm.phaseName" placeholder="阶段名称"></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注"></el-input>
				</el-form-item> 
				<el-form-item label="上级阶段编号" prop="parentPhaseId">
					<el-input v-model="editForm.parentPhaseId" placeholder="上级阶段编号"></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="当前项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="当前项目编号"></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="beginDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.beginDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="endDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="工时" prop="planWorkingHours">
					<el-input v-model="editForm.planWorkingHours" placeholder="工时"></el-input>
				</el-form-item> 
				<el-form-item label="投入人员数" prop="planWorkingStaffNu">
					<el-input v-model="editForm.planWorkingStaffNu" placeholder="投入人员数"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="非人力成本总预算" prop="totalBudgetNouser">
					<el-input v-model="editForm.totalBudgetNouser" placeholder="非人力成本总预算"></el-input>
				</el-form-item> 
				<el-form-item label="内部人力成本总预算" prop="totalBudgetInnerUser">
					<el-input v-model="editForm.totalBudgetInnerUser" placeholder="内部人力成本总预算"></el-input>
				</el-form-item> 
				<el-form-item label="外购人力成本总预算" prop="totalBudgetOutUser">
					<el-input v-model="editForm.totalBudgetOutUser" placeholder="外购人力成本总预算"></el-input>
				</el-form-item> 
				<el-form-item label="基线主键" prop="id">
					<el-input v-model="editForm.id" placeholder="基线主键"></el-input>
				</el-form-item> 
				<el-form-item label="基线备注" prop="baseRemark">
					<el-input v-model="editForm.baseRemark" placeholder="基线备注"></el-input>
				</el-form-item> 
				<el-form-item label="项目级基线" prop="projectBaselineId">
					<el-input v-model="editForm.projectBaselineId" placeholder="项目级基线"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程实例编号" prop="bizProcInstId">
					<el-input v-model="editForm.bizProcInstId" placeholder="当前流程实例编号"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" prop="bizFlowState">
					<el-input v-model="editForm.bizFlowState" placeholder="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除"></el-input>
				</el-form-item> 
				<el-form-item label="总工作量单位人时" prop="totalBudgetWorkload">
					<el-input v-model="editForm.totalBudgetWorkload" placeholder="总工作量单位人时"></el-input>
				</el-form-item> 
				<el-form-item label="已完成工作量单位人时" prop="totalActWorkload">
					<el-input v-model="editForm.totalActWorkload" placeholder="已完成工作量单位人时"></el-input>
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
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editXmProjectPhaseBaseline } from '@/api/xm/core/xmProjectPhaseBaseline';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['xmProjectPhaseBaseline','visible'],
		watch: {
	      'xmProjectPhaseBaseline':function( xmProjectPhaseBaseline ) {
	        this.editForm = xmProjectPhaseBaseline;
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
						//{ required: true, message: '基线主键不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmProjectPhaseBaseline xm_project_phase_baseline
				editForm: {
					baseCtime:'',projectPhaseId:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',projectId:'',beginDate:'',endDate:'',planWorkingHours:'',planWorkingStaffNu:'',ctime:'',totalBudgetNouser:'',totalBudgetInnerUser:'',totalBudgetOutUser:'',id:'',baseRemark:'',projectBaselineId:'',bizProcInstId:'',bizFlowState:'',totalBudgetWorkload:'',totalActWorkload:''
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
			//编辑提交XmProjectPhaseBaseline xm_project_phase_baseline父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProjectPhaseBaseline(params).then((res) => {
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
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-phase-baseline-edit':XmProjectPhaseBaselineEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProjectPhaseBaseline);  
		}
	}

</script>

<style scoped>

</style>