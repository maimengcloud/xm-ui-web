<template>
	<section class="page-container  padding border">
		<el-row> 
		<!--编辑界面 XmProjectMBudgetCostNouser xm_project_m_budget_cost_nouser--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				<el-form-item label="预算金额" prop="budgetCost">
					<el-input v-model="editForm.budgetCost" placeholder="预算金额"></el-input>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注"></el-input>
				</el-form-item>   
				<el-form-item label="预算科目" prop="subjectId">
					<el-select   placeholder="预算科目编号" v-model="editForm.subjectId">
						<el-option
							v-for="(item,i) in dicts.projectSubject"
							:key="i"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>   
				<el-form-item label="费用归属月份" prop="bizzMonth">
					<el-input v-model="editForm.bizzMonth" placeholder="费用归属月份yyyy-mm"></el-input>
				</el-form-item> 
				<el-form-item label="成本类型" prop="costType">
					<template>
						<el-radio v-model="editForm.costType" label="0">非人力</el-radio>
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
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { editXmProjectMBudgetCostNouser } from '@/api/xm/core/xmProjectMBudgetCostNouser';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectMBudgetCostNouser','visible'],
		watch: {
	      'xmProjectMBudgetCostNouser':function( xmProjectMBudgetCostNouser ) {
	        this.editForm = xmProjectMBudgetCostNouser;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      },
	      'editForm.subjectId':function(subjectId) { 
	      	var dicts=this.dicts.projectSubject.filter(i=>i.id==subjectId)
			if(options!=null && dicts.length>0){
				 this.editForm.subjectName=dicts[0].name
			}else{
				this.editForm.subjectName="";
			}
		 } 
	    },
		data() {
			return { 
				dicts:{
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
				//编辑界面数据  XmProjectMBudgetCostNouser xm_project_m_budget_cost_nouser
				editForm: {
					projectId:'',budgetCost:'',id:'',remark:'',subjectId:'',bizzStartDate:'',bizzEndDate:'',bizProcInstId:'',bizFlowState:'',phaseId:'',costType:'',bizzMonth:'',subjectName:''
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
			//编辑提交XmProjectMBudgetCostNouser xm_project_m_budget_cost_nouser父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProjectMBudgetCostNouser(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-m-budget-cost-nouser-edit':XmProjectMBudgetCostNouserEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProjectMBudgetCostNouser);    
			
			initSimpleDicts('all',['projectSubject']).then(res=>{
				this.dicts=res.data.data;
			})
		}
	}

</script>

<style scoped>

</style>