<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmProjectMBudgetCostUser xm_project_m_budget_cost_user--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				 
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username" placeholder="用户名" ></el-input>
				</el-form-item> 
				<el-form-item label="预算总金额" prop="totalBudgetCost">
					<el-input v-model="totalBudgetCost" placeholder="预算金额"></el-input>
				</el-form-item>  
				<el-form-item label="预算金额/月" prop="budgetCost">
					<el-input v-model="addForm.budgetCost" placeholder="预算金额/月"></el-input>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item>  
				<el-form-item label="预算科目" prop="subjectId">
					<el-select   placeholder="预算科目编号" v-model="addForm.subjectId">
						<el-option
							v-for="(item,i) in dicts.projectSubject"
							:key="i"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>  
				<el-form-item label="总预算平摊到下面月份" prop="bizzMonth">
					  <el-date-picker
						v-model="bizzYear"
						type="year"
						value-format="yyyy"
						placeholder="选择年">
					 </el-date-picker>
					 <div style="margin-top: 20px">
						<el-checkbox-group v-model="bizzMonths" size="medium">
							<el-checkbox-button v-for="i in bizzMonthList" :label="i" :key="i">{{i}}</el-checkbox-button>
						</el-checkbox-group>
					</div>  
					下一年：{{secBizzYear}}
					 <div style="margin-top: 20px">
						<el-checkbox-group v-model="secBizzMonths" size="medium">
							<el-checkbox-button v-for="i in bizzMonthList" :label="i" :key="i">{{i}}</el-checkbox-button>
						</el-checkbox-group>
					</div> 
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
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import { addXmProjectMBudgetCostUser,batchAddXmProjectMBudgetCostUser } from '@/api/xm/core/xmProjectMBudgetCostUser';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
		  'allMonths': function(){
			  var bizzMonths=this.bizzMonths.map(i=>this.bizzYear+"-"+i);
				var secBizzMonths=this.secBizzMonths.map(i=>this.secBizzYear+"-"+i); 
				var bizzMonthAll=bizzMonths.concat(secBizzMonths);
				return bizzMonthAll;
		  } 
		},
		props:['xmProjectMBudgetCostUser','visible','selProject'],
		watch: {
	      'xmProjectMBudgetCostUser':function( xmProjectMBudgetCostUser ) {
	        //this.addForm = xmProjectMBudgetCostUser;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
		  },
		  'bizzYear': function(year){
			  this.secBizzYear=parseInt(year)+1+"";
		  } ,
		  'totalBudgetCost': function(totalBudgetCost){
			  if(this.allMonths.length==0){
				  return ;
			  }
			  this.addForm.budgetCost=totalBudgetCost/this.allMonths.length;
		  },
	      'addForm.subjectId':function(subjectId) { 
	      	var dicts=this.dicts.projectSubject.filter(i=>i.id==subjectId)
			if(options!=null && dicts.length>0){
				 this.addForm.subjectName=dicts[0].name
			}else{
				this.addForm.subjectName="";
			}
		 }  
	    },
		data() {
			var year=new Date().getFullYear(); 
			var secYear=parseInt(year)+1;
			return { 
				dicts:{
					projectSubject:[],
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
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
				totalBudgetCost:0,
				bizzYear:year+'',
				secBizzYear:secYear+'',
				bizzMonths:[],
				secBizzMonths:[],
				bizzMonthList:['01','02','03','04','05','06','07','08','09','10','11','12'],
				//新增界面数据 xm_project_m_budget_cost_user
				addForm: {
					projectId:'',userid:'',budgetCost:'',id:'',remark:'',username:'',subjectId:'',bizzStartDate:'',bizzEndDate:'',bizzMonth:'',bizProcInstId:'',bizFlowState:'0',phaseId:'',costType:'1',subjectName:''
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
			//新增提交XmProjectMBudgetCostUser xm_project_m_budget_cost_user 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				if(this.bizzYear==null || this.bizzYear==''){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择需要分摊的年份", type: 'error' }); 
					return;
				}
				
				var list=this.allMonths.map(i=>{
					let params = Object.assign({}, this.addForm); 
					params.projectId=this.selProject.id
					params.bizzMonth=i
					return params;

				});
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true 
							batchAddXmProjectMBudgetCostUser(list).then((res) => {
								this.load.add=false
								var tips=res.data.tips; 
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
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
			//this.addForm=Object.assign(this.addForm, this.xmProjectMBudgetCostUser);  
			/**在下面写其它函数***/
			
				initSimpleDicts('all',['projectSubject']).then(res=>{
					this.dicts=res.data.data;
				})	
		}//end mounted
	}

</script>

<style scoped>

</style>