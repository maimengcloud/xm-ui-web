<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 XmTestCaseExec xm_test_case_exec--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="执行人" prop="execUserid">
					<el-input v-model="editForm.execUserid" placeholder="执行人"></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="执行编号" prop="id">
					<el-input v-model="editForm.id" placeholder="执行编号"></el-input>
				</el-form-item> 
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号"></el-input>
				</el-form-item> 
				<el-form-item label="项目名称" prop="projectName">
					<el-input v-model="editForm.projectName" placeholder="项目名称"></el-input>
				</el-form-item> 
				<el-form-item label="测试用例编号" prop="caseId">
					<el-input v-model="editForm.caseId" placeholder="测试用例编号"></el-input>
				</el-form-item> 
				<el-form-item label="测试用例名称" prop="caseName">
					<el-input v-model="editForm.caseName" placeholder="测试用例名称"></el-input>
				</el-form-item> 
				<el-form-item label="到期时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="缺陷描述" prop="remark">
					<el-input v-model="editForm.remark" placeholder="缺陷描述"></el-input>
				</el-form-item> 
				<el-form-item label="缺陷创建人编号" prop="createUserid">
					<el-input v-model="editForm.createUserid" placeholder="缺陷创建人编号"></el-input>
				</el-form-item> 
				<el-form-item label="缺陷创建人" prop="createUsername">
					<el-input v-model="editForm.createUsername" placeholder="缺陷创建人"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="0新建1测试中2已完成" prop="execStatus">
					<el-input v-model="editForm.execStatus" placeholder="0新建1测试中2已完成"></el-input>
				</el-form-item> 
				<el-form-item label="迭代编号" prop="iterationId">
					<el-input v-model="editForm.iterationId" placeholder="迭代编号"></el-input>
				</el-form-item> 
				<el-form-item label="迭代名称" prop="iterationName">
					<el-input v-model="editForm.iterationName" placeholder="迭代名称"></el-input>
				</el-form-item> 
				<el-form-item label="执行人姓名" prop="execUsername">
					<el-input v-model="editForm.execUsername" placeholder="执行人姓名"></el-input>
				</el-form-item> 
				<el-form-item label="归属测试任务编号" prop="taskId">
					<el-input v-model="editForm.taskId" placeholder="归属测试任务编号"></el-input>
				</el-form-item> 
				<el-form-item label="归属测试任务名称" prop="taskName">
					<el-input v-model="editForm.taskName" placeholder="归属测试任务名称"></el-input>
				</el-form-item> 
				<el-form-item label="故事编号" prop="menuId">
					<el-input v-model="editForm.menuId" placeholder="故事编号"></el-input>
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
	import { editXmTestCaseExec } from '@/api/xm/core/xmTestCaseExec';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmTestCaseExec','visible'],
		watch: {
	      'xmTestCaseExec':function( xmTestCaseExec ) {
	        this.editForm = xmTestCaseExec;
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
						//{ required: true, message: '执行编号不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmTestCaseExec xm_test_case_exec
				editForm: {
					execUserid:'',startTime:'',id:'',projectId:'',projectName:'',caseId:'',caseName:'',endTime:'',remark:'',createUserid:'',createUsername:'',createTime:'',execStatus:'',iterationId:'',iterationName:'',execUsername:'',taskId:'',taskName:'',menuId:''
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
			//编辑提交XmTestCaseExec xm_test_case_exec父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmTestCaseExec(params).then((res) => {
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
		    //在下面添加其它组件 'xm-test-case-exec-edit':XmTestCaseExecEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmTestCaseExec);  
		}
	}

</script>

<style scoped>

</style>