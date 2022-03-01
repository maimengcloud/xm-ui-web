<template>
	<section class="page-container page-full-height padding border">
		<el-row> 
		<!--编辑界面 XmProjectGroupUserCandidate xm_project_group_user_candidate--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="团队编号" prop="groupId">
					<el-input v-model="editForm.groupId" placeholder="团队编号"></el-input>
				</el-form-item> 
				<el-form-item label="团队成员编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="团队成员编号"></el-input>
				</el-form-item> 
				<el-form-item label="团队成员" prop="username">
					<el-input v-model="editForm.username" placeholder="团队成员"></el-input>
				</el-form-item> 
				<el-form-item label="是否组长，1是，0否" prop="isHead">
					<el-input v-model="editForm.isHead" placeholder="是否组长，1是，0否"></el-input>
				</el-form-item> 
				<el-form-item label="成为候选人时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="候选状态0候选排对中1已加入项目做2已退出候选名单" prop="candidateStatus">
					<el-input v-model="editForm.candidateStatus" placeholder="候选状态0候选排对中1已加入项目做2已退出候选名单"></el-input>
				</el-form-item> 
				<el-form-item label="退出时间" prop="outTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.outTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
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
	import { editXmProjectGroupUserCandidate } from '@/api/xm/core/xmProjectGroupUserCandidate';
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
	        this.editForm = xmProjectGroupUserCandidate;
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
				//编辑界面数据  XmProjectGroupUserCandidate xm_project_group_user_candidate
				editForm: {
					id:'',groupId:'',userid:'',username:'',isHead:'',createTime:'',candidateStatus:'',outTime:''
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
			//编辑提交XmProjectGroupUserCandidate xm_project_group_user_candidate父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProjectGroupUserCandidate(params).then((res) => {
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
		    //在下面添加其它组件 'xm-project-group-user-candidate-edit':XmProjectGroupUserCandidateEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProjectGroupUserCandidate);  
		}
	}

</script>

<style scoped>

</style>