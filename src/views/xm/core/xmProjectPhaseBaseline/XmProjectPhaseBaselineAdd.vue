<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<!--新增界面 XmProjectPhaseBaseline xm_project_phase_baseline--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="基线建立时间" prop="baseCtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.baseCtime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="计划主键" prop="projectPhaseId">
					<el-input v-model="addForm.projectPhaseId" placeholder="计划主键" ></el-input>
				</el-form-item> 
				<el-form-item label="计划名称" prop="phaseName">
					<el-input v-model="addForm.phaseName" placeholder="计划名称" ></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item label="上级计划编号" prop="parentPhaseId">
					<el-input v-model="addForm.parentPhaseId" placeholder="上级计划编号" ></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构编号" ></el-input>
				</el-form-item> 
				<el-form-item label="当前项目编号" prop="projectId">
					<el-input v-model="addForm.projectId" placeholder="当前项目编号" ></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="beginDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.beginDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="endDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.endDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="工时" prop="planWorkingHours">
					<el-input v-model="addForm.planWorkingHours" placeholder="工时"></el-input>
				</el-form-item> 
				<el-form-item label="投入人员数" prop="planWorkingStaffNu">
					<el-input v-model="addForm.planWorkingStaffNu" placeholder="投入人员数"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.ctime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="非人力成本总预算" prop="totalBudgetNouser">
					<el-input v-model="addForm.totalBudgetNouser" placeholder="非人力成本总预算"></el-input>
				</el-form-item> 
				<el-form-item label="内部人力成本总预算" prop="totalBudgetInnerUser">
					<el-input v-model="addForm.totalBudgetInnerUser" placeholder="内部人力成本总预算"></el-input>
				</el-form-item> 
				<el-form-item label="外购人力成本总预算" prop="totalBudgetOutUser">
					<el-input v-model="addForm.totalBudgetOutUser" placeholder="外购人力成本总预算"></el-input>
				</el-form-item> 
				<el-form-item label="基线主键" prop="id">
					<el-input v-model="addForm.id" placeholder="基线主键" ></el-input>
				</el-form-item> 
				<el-form-item label="基线备注" prop="baseRemark">
					<el-input v-model="addForm.baseRemark" placeholder="基线备注" ></el-input>
				</el-form-item> 
				<el-form-item label="项目级基线" prop="projectBaselineId">
					<el-input v-model="addForm.projectBaselineId" placeholder="项目级基线" ></el-input>
				</el-form-item> 
				<el-form-item label="当前流程实例编号" prop="bizProcInstId">
					<el-input v-model="addForm.bizProcInstId" placeholder="当前流程实例编号" ></el-input>
				</el-form-item> 
				<el-form-item label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" prop="bizFlowState">
					<el-input v-model="addForm.bizFlowState" placeholder="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" ></el-input>
				</el-form-item> 
				<el-form-item label="总工作量单位人时" prop="totalBudgetWorkload">
					<el-input v-model="addForm.totalBudgetWorkload" placeholder="总工作量单位人时"></el-input>
				</el-form-item> 
				<el-form-item label="已完成工作量单位人时" prop="totalActWorkload">
					<el-input v-model="addForm.totalActWorkload" placeholder="已完成工作量单位人时"></el-input>
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
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addXmProjectPhaseBaseline } from '@/api/xm/core/xmProjectPhaseBaseline';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectPhaseBaseline','visible'],
		watch: {
	      'xmProjectPhaseBaseline':function( xmProjectPhaseBaseline ) {
	        this.addForm = xmProjectPhaseBaseline;
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
						//{ required: true, message: '基线主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 xm_project_phase_baseline
				addForm: {
					baseCtime:'',projectPhaseId:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',projectId:'',beginDate:'',endDate:'',planWorkingHours:'',planWorkingStaffNu:'',ctime:'',totalBudgetNouser:'',totalBudgetInnerUser:'',totalBudgetOutUser:'',id:'',baseRemark:'',projectBaselineId:'',bizProcInstId:'',bizFlowState:'',totalBudgetWorkload:'',totalActWorkload:''
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
			//新增提交XmProjectPhaseBaseline xm_project_phase_baseline 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addXmProjectPhaseBaseline(params).then((res) => {
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
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-phase-baseline-edit':XmProjectPhaseBaselineEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProjectPhaseBaseline);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>