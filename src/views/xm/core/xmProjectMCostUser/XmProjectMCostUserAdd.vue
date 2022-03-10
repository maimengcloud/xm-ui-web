<template>
	<section class="page-container  padding border">
		<el-row> 
		<!--编辑界面 XmProjectMCostUser xm_project_m_budget_cost_user--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm"> 
				<el-form-item label="项目成员编号" prop="userid">
					<el-input v-model="addForm.userid" placeholder="项目成员编号"></el-input>
				</el-form-item> 
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username" placeholder="用户名"></el-input>
				</el-form-item> 
				<el-form-item label="成本科目" prop="subjectId">
					<el-select   placeholder="成本科目编号" v-model="addForm.subjectId">
						<el-option
							v-for="(item,i) in options.projectSubject"
							:key="i"
							:label="item.optionName"
							:value="item.optionValue">
						</el-option>
					</el-select>
				</el-form-item>  
				<el-form-item label="任务" prop="taskId">
					<el-input v-model="addForm.taskId" placeholder="用户名"></el-input>
				</el-form-item>  
				<el-form-item label="实际工作量" prop="actWorkload">
					<el-input v-model="addForm.actWorkload" placeholder="用户名"></el-input>
				</el-form-item>   
				<el-form-item label="成本金额" prop="actCostAmount">
					<el-input v-model="addForm.actCostAmount" placeholder="成本金额"></el-input>
				</el-form-item>   
				<el-form-item label="费用归属日期" prop="bizDate">
					<el-input v-model="addForm.bizDate" placeholder="费用归属日期yyyy-mm-dd"></el-input>
				</el-form-item>   
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注"></el-input>
				</el-form-item>   

				<el-form-item label="成本类型" prop="costType">
					<template> 
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
	import { addXmProjectMCostUser } from '@/api/xm/core/xmProjectMCostUser';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectMCostUser','visible'],
		watch: {
	      'xmProjectMCostUser':function( xmProjectMCostUser ) {
	        this.addForm = xmProjectMCostUser;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } ,
	      'addForm.subjectId':function(subjectId) { 
			  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxlg" + subjectId);
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
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				addFormRules: {
					subjectId: [
						{ required: true, message: '科目不能为空', trigger: 'blur' }
					],
					username: [
						{ required: true, message: '姓名不能为空', trigger: 'blur' }
					],
					actWorkload: [
						{ required: true, message: '实际工作量不能为空', trigger: 'blur' }
					],
					taskId: [
						{ required: true, message: '归属任务不能为空', trigger: 'blur' }
					],
					actCostAmount: [
						{ required: true, message: '实际金额不能为空', trigger: 'blur' }
					],
					projectId: [
						{ required: true, message: '归属项目不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmProjectMCostUser xm_project_m_budget_cost_user
				addForm: {
					subjectId:'',projectId:'',userid:'',createTime:'',sendCostTime:'',username:'',projectName:'',remark:'',id:'',taskId:'',taskName:'',actWorkload:'',bizzStartDate:'',bizzEndDate:'',bizProcInstId:'',bizFlowState:'',phaseId:'',actCostAmount:'',costType:'',bizMonth:'',bizDate:'',subjectName:'',projectPhaseName:''
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
			//编辑提交XmProjectMCostUser xm_project_m_budget_cost_user父组件监听@submit="afterEditSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addXmProjectMCostUser(params).then((res) => {
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
		    //在下面添加其它组件 'xm-project-m-budget-cost-user-add':XmProjectMCostUserEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProjectMCostUser);  				
			listOption([{categoryId:'all',itemCode:'projectSubject'}]).then(res=>{
				this.options=res.data.data;
			})	
		}
	}

</script>

<style scoped>

</style>