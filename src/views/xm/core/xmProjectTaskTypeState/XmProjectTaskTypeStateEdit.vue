<template>
	<section class="page-container  padding border">
		<el-row> 
		<!--编辑界面 XmProjectTaskTypeState 按任务类型汇总--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号"></el-input>
				</el-form-item> 
				<el-form-item label="项目名称" prop="projectName">
					<el-input v-model="editForm.projectName" placeholder="项目名称"></el-input>
				</el-form-item> 
				<el-form-item label="任务类型" prop="taskType">
					<el-input v-model="editForm.taskType" placeholder="任务类型"></el-input>
				</el-form-item> 
				<el-form-item label="工作量" prop="planWorkload">
					<el-input v-model="editForm.planWorkload" placeholder="工作量"></el-input>
				</el-form-item> 
				<el-form-item label="预算金额" prop="planAmount">
					<el-input v-model="editForm.planAmount" placeholder="预算金额"></el-input>
				</el-form-item> 
				<el-form-item label="实际完成工作量" prop="actWorkload">
					<el-input v-model="editForm.actWorkload" placeholder="实际完成工作量"></el-input>
				</el-form-item> 
				<el-form-item label="实际完成金额" prop="actAmount">
					<el-input v-model="editForm.actAmount" placeholder="实际完成金额"></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="业务日期yyyy-MM-dd型" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="业务日期yyyy-MM-dd型"></el-input>
				</el-form-item> 
				<el-form-item label="计算日期" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.calcTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="外购资金预算" prop="planOuserAt">
					<el-input v-model="editForm.planOuserAt" placeholder="外购资金预算"></el-input>
				</el-form-item> 
				<el-form-item label="内购资金预算" prop="planIuserAt">
					<el-input v-model="editForm.planIuserAt" placeholder="内购资金预算"></el-input>
				</el-form-item> 
				<el-form-item label="实际外购成本" prop="actOuserAt">
					<el-input v-model="editForm.actOuserAt" placeholder="实际外购成本"></el-input>
				</el-form-item> 
				<el-form-item label="实际内购成本" prop="actIuserAt">
					<el-input v-model="editForm.actIuserAt" placeholder="实际内购成本"></el-input>
				</el-form-item> 
				<el-form-item label="计划外购工作量" prop="planOuserWorkload">
					<el-input v-model="editForm.planOuserWorkload" placeholder="计划外购工作量"></el-input>
				</el-form-item> 
				<el-form-item label="计划内购工作量" prop="planIuserWorkload">
					<el-input v-model="editForm.planIuserWorkload" placeholder="计划内购工作量"></el-input>
				</el-form-item> 
				<el-form-item label="实际外购工作量" prop="actOuserWorkload">
					<el-input v-model="editForm.actOuserWorkload" placeholder="实际外购工作量"></el-input>
				</el-form-item> 
				<el-form-item label="实际内购工作量" prop="actIuserWorkload">
					<el-input v-model="editForm.actIuserWorkload" placeholder="实际内购工作量"></el-input>
				</el-form-item> 
				<el-form-item label="计划非人力成本" prop="planNouserAt">
					<el-input v-model="editForm.planNouserAt" placeholder="计划非人力成本"></el-input>
				</el-form-item> 
				<el-form-item label="实际非人力成本" prop="actNouserAt">
					<el-input v-model="editForm.actNouserAt" placeholder="实际非人力成本"></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
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
	import { editXmProjectTaskTypeState } from '@/api/xm/core/xmProjectTaskTypeState';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectTaskTypeState','visible'],
		watch: {
	      'xmProjectTaskTypeState':function( xmProjectTaskTypeState ) {
	        this.editForm = xmProjectTaskTypeState;
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
				//编辑界面数据  XmProjectTaskTypeState 按任务类型汇总
				editForm: {
					projectId:'',projectName:'',taskType:'',planWorkload:'',planAmount:'',actWorkload:'',actAmount:'',branchId:'',bizDate:'',calcTime:'',planOuserAt:'',planIuserAt:'',actOuserAt:'',actIuserAt:'',planOuserWorkload:'',planIuserWorkload:'',actOuserWorkload:'',actIuserWorkload:'',planNouserAt:'',actNouserAt:'',id:''
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
			//编辑提交XmProjectTaskTypeState 按任务类型汇总父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProjectTaskTypeState(params).then((res) => {
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
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-task-type-state-edit':XmProjectTaskTypeStateEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProjectTaskTypeState);  
		}
	}

</script>

<style scoped>

</style>