<template>
	<section class="page-container  padding border">
		<el-row> 
		<!--编辑界面 XmProjectMCostNouser xm_project_m_budget_cost_nouser--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm"> 
				<el-form-item label="预算金额" prop="budgetCost">
					<el-input v-model="addForm.budgetCost" placeholder="预算金额"></el-input>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注"></el-input>
				</el-form-item>   
				<el-form-item label="预算科目" prop="subjectId">
					<el-select   placeholder="预算科目编号" v-model="addForm.subjectId">
						<el-option
							v-for="(item,i) in options.projectSubject"
							:key="i"
							:label="item.optionName"
							:value="item.optionValue">
						</el-option>
					</el-select>
				</el-form-item>   
				<el-form-item label="费用归属月份" prop="bizzMonth">
					<el-input v-model="addForm.bizzMonth" placeholder="费用归属月份yyyy-mm"></el-input>
				</el-form-item> 
				<el-form-item label="成本类型" prop="costType">
					<template>
						<el-radio v-model="addForm.costType" label="0">非人力</el-radio>
						<el-radio v-model="addForm.costType" label="1">内部人力</el-radio>
						<el-radio v-model="addForm.costType" label="2">外购人力</el-radio>
					</template> 
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
	import { addXmProjectMCostNouser } from '@/api/xm/core/xmProjectMCostNouser';
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
	        this.addForm = xmProjectMCostNouser;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      },
	      'addForm.subjectId':function(subjectId) { 
	      	var options=this.options.projectSubject.filter(i=>i.optionValue==subjectId)
			if(options!=null && options.length>0){
				 this.addForm.subjectName=options[0].optionName
			}else{
				this.addForm.subjectName="";
			}
		 } 
	    },
		data() {
			return { 
				options:{
					projectSubject:[]
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
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
				//编辑界面数据  XmProjectMCostNouser xm_project_m_budget_cost_nouser
				addForm: {
					projectId:'',budgetCost:'',id:'',remark:'',subjectId:'',bizzStartDate:'',bizzEndDate:'',bizProcInstId:'',bizFlowState:'',phaseId:'',costType:'',bizzMonth:'',subjectName:''
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
			//编辑提交XmProjectMCostNouser xm_project_m_budget_cost_nouser父组件监听@submit="afterEditSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addXmProjectMCostNouser(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-m-budget-cost-nouser-add':XmProjectMCostNouserEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProjectMCostNouser);    				
			listOption([{categoryId:'all',itemCode:'projectSubject'}]).then(res=>{
				this.options=res.data.data;
			})	
		}
	}

</script>

<style scoped>

</style>