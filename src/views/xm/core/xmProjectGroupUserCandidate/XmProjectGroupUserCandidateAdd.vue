<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<!--新增界面 XmProjectGroupUserCandidate xm_project_group_user_candidate--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="团队编号" prop="groupId">
					<el-input v-model="addForm.groupId" placeholder="团队编号" ></el-input>
				</el-form-item> 
				<el-form-item label="团队成员编号" prop="userid">
					<el-input v-model="addForm.userid" placeholder="团队成员编号" ></el-input>
				</el-form-item> 
				<el-form-item label="团队成员" prop="username">
					<el-input v-model="addForm.username" placeholder="团队成员" ></el-input>
				</el-form-item> 
				<el-form-item label="是否组长，1是，0否" prop="isHead">
					<el-input v-model="addForm.isHead" placeholder="是否组长，1是，0否" ></el-input>
				</el-form-item> 
				<el-form-item label="成为候选人时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="候选状态0候选排对中1已加入项目做2已退出候选名单" prop="candidateStatus">
					<el-input v-model="addForm.candidateStatus" placeholder="候选状态0候选排对中1已加入项目做2已退出候选名单" ></el-input>
				</el-form-item> 
				<el-form-item label="退出时间" prop="outTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.outTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
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
	import { addXmProjectGroupUserCandidate } from '@/api/xm/core/xmProjectGroupUserCandidate';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectGroupUserCandidate','visible'],
		watch: {
	      'xmProjectGroupUserCandidate':function( xmProjectGroupUserCandidate ) {
	        this.addForm = xmProjectGroupUserCandidate;
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
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 xm_project_group_user_candidate
				addForm: {
					id:'',groupId:'',userid:'',username:'',isHead:'',createTime:'',candidateStatus:'',outTime:''
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
			//新增提交XmProjectGroupUserCandidate xm_project_group_user_candidate 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addXmProjectGroupUserCandidate(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-group-user-candidate-edit':XmProjectGroupUserCandidateEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProjectGroupUserCandidate);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>