<template>
	<section class="page-container  padding border">
		<el-row> 
		<!--编辑界面 XmProjectMCostNouser xm_project_m_cost_nouser--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号"></el-input>
				</el-form-item> 
				<el-form-item label="用户编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="用户编号"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="费用发放时间" prop="sendCostTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.sendCostTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="editForm.username" placeholder="用户名称"></el-input>
				</el-form-item> 
				<el-form-item label="项目名称" prop="projectName">
					<el-input v-model="editForm.projectName" placeholder="项目名称"></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注"></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="任务编号" prop="taskId">
					<el-input v-model="editForm.taskId" placeholder="任务编号"></el-input>
				</el-form-item> 
				<el-form-item label="任务名称" prop="taskName">
					<el-input v-model="editForm.taskName" placeholder="任务名称"></el-input>
				</el-form-item> 
				<el-form-item label="科目编号" prop="subjectId">
					<el-input v-model="editForm.subjectId" placeholder="科目编号"></el-input>
				</el-form-item> 
				<el-form-item label="费用归属周期开始日期" prop="bizzStartDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.bizzStartDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="费用归属周期结束日期" prop="bizzEndDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.bizzEndDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="当前流程实例编号" prop="bizProcInstId">
					<el-input v-model="editForm.bizProcInstId" placeholder="当前流程实例编号"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" prop="bizFlowState">
					<el-input v-model="editForm.bizFlowState" placeholder="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除"></el-input>
				</el-form-item> 
				<el-form-item label="项目计划计划编号" prop="projectPhaseId">
					<el-input v-model="editForm.projectPhaseId" placeholder="项目计划计划编号"></el-input>
				</el-form-item> 
				<el-form-item label="实际成本金额" prop="actCostAmount">
					<el-input v-model="editForm.actCostAmount" placeholder="实际成本金额"></el-input>
				</el-form-item> 
				<el-form-item label="成本类型0非人力1内部人力2外购人力" prop="costType">
					<el-input v-model="editForm.costType" placeholder="成本类型0非人力1内部人力2外购人力"></el-input>
				</el-form-item> 
				<el-form-item label="业务归属月份yyyy-mm" prop="bizMonth">
					<el-input v-model="editForm.bizMonth" placeholder="业务归属月份yyyy-mm"></el-input>
				</el-form-item> 
				<el-form-item label="业务归属日期yyyy-mm-dd" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="业务归属日期yyyy-mm-dd"></el-input>
				</el-form-item> 
				<el-form-item label="科目名称" prop="subjectName">
					<el-input v-model="editForm.subjectName" placeholder="科目名称"></el-input>
				</el-form-item> 
				<el-form-item label="计划名称" prop="projectPhaseName">
					<el-input v-model="editForm.projectPhaseName" placeholder="计划名称"></el-input>
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
	import { editXmProjectMCostNouser } from '@/api/xm/core/xmProjectMCostNouser';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectMCostNouser','visible'],
		watch: {
	      'xmProjectMCostNouser':function( xmProjectMCostNouser ) {
	        this.editForm = xmProjectMCostNouser;
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
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmProjectMCostNouser xm_project_m_cost_nouser
				editForm: {
					projectId:'',userid:'',createTime:'',sendCostTime:'',username:'',projectName:'',remark:'',id:'',taskId:'',taskName:'',subjectId:'',bizzStartDate:'',bizzEndDate:'',bizProcInstId:'',bizFlowState:'',projectPhaseId:'',actCostAmount:'',costType:'',bizMonth:'',bizDate:'',subjectName:'',projectPhaseName:''
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
			//编辑提交XmProjectMCostNouser xm_project_m_cost_nouser父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProjectMCostNouser(params).then((res) => {
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
		    //在下面添加其它组件 'xm-project-m-cost-nouser-edit':XmProjectMCostNouserEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProjectMCostNouser);  
		}
	}

</script>

<style scoped>

</style>