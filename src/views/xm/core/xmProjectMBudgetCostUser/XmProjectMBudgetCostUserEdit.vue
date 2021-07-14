<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 XmProjectMBudgetCostUser xm_project_m_budget_cost_user--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				<el-form-item label="项目成员编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="项目成员编号"></el-input>
				</el-form-item> 
				<el-form-item label="用户名" prop="username">
					<el-input v-model="editForm.username" placeholder="用户名"></el-input>
				</el-form-item>  
				<el-form-item label="预算金额/每月" prop="budgetCost">
					<el-input v-model="editForm.budgetCost" placeholder="预算金额/每月"></el-input>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注"></el-input>
				</el-form-item>   
				<el-form-item label="预算科目" prop="subjectId">
					<el-select   placeholder="预算科目编号" v-model="editForm.subjectId">
						<el-option
							v-for="(item,i) in options.projectSubject"
							:key="i"
							:label="item.optionName"
							:value="item.optionValue">
						</el-option>
					</el-select>
				</el-form-item>  
				<el-form-item label="费用归属月份" prop="bizzMonth">
					<el-input v-model="editForm.bizzMonth" placeholder="费用归属月份yyyy-mm"></el-input>
				</el-form-item>   
				<el-form-item label="成本类型" prop="costType">
					<template> 
						<el-radio v-model="editForm.costType" label="1">内部人力</el-radio>
						<el-radio v-model="editForm.costType" label="2">外购人力</el-radio>
					</template> 
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
	import { editXmProjectMBudgetCostUser } from '@/api/xm/core/xmProjectMBudgetCostUser';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectMBudgetCostUser','visible'],
		watch: {
	      'xmProjectMBudgetCostUser':function( xmProjectMBudgetCostUser ) {
	        this.editForm = xmProjectMBudgetCostUser;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } ,
	      'editForm.subjectId':function(subjectId) { 
			  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxlg" + subjectId);
	      	var options=this.options.projectSubject.filter(i=>i.optionValue==subjectId)
			if(options!=null && options.length>0){
				 this.editForm.subjectName=options[0].optionName
			}else{
				this.editForm.subjectName="";
			}
		 } 
	    },
		data() {
			return { 
				options:{
					projectSubject:[]
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					subjectId: [
						{ required: true, message: '科目不能为空', trigger: 'blur' }
					],
					username: [
						{ required: true, message: '姓名不能为空', trigger: 'blur' }
					],
					budgetCost: [
						{ required: true, message: '金额不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmProjectMBudgetCostUser xm_project_m_budget_cost_user
				editForm: {
					projectId:'',userid:'',budgetCost:'',id:'',remark:'',username:'',subjectId:'',bizzStartDate:'',bizzEndDate:'',bizzMonth:'',bizProcInstId:'',bizFlowState:'',projectPhaseId:'',costType:'',subjectName:''
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
			//编辑提交XmProjectMBudgetCostUser xm_project_m_budget_cost_user父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProjectMBudgetCostUser(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-m-budget-cost-user-edit':XmProjectMBudgetCostUserEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProjectMBudgetCostUser);  				
			listOption([{categoryId:'all',itemCode:'projectSubject'}]).then(res=>{
				this.options=res.data.data;
			})	
		}
	}

</script>

<style scoped>

</style>