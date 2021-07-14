<template>
	<section class="page-container page-full-height padding border">
		<el-row> 
		<!--编辑界面 XmTaskExecuser xm_task_execuser--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="执行人姓名" prop="username">
					<el-select style="width:100%;" placeholder="选择执行人" v-model="execUser" value-key="userid">
						<el-option
							v-for="(item,i) in execUserList"
							:key="i"
							:label="item.username"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="执行人状态" prop="status">
					<el-select :disabled="editForm.status == '2'" style="width:100%;" placeholder="选择状态" v-model="editForm.status">
						<el-option
							v-for="(item,i) in options.projectTaskExecuserStatus"
							:key="i"
							:label="item.optionName"
							:value="item.optionValue">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="加入时间" prop="startTime">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.startTime" :clearable="false" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item> 
				<el-form-item label="离开时间" prop="endTime">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.endTime" :clearable="false" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="备注" prop="remarks">
					<el-input v-model="editForm.remarks" placeholder="备注"></el-input>
				</el-form-item> 
				<el-form-item label="结算金额" prop="settleAmount">
					<el-input v-model="editForm.settleAmount" type="number" placeholder="结算金额"></el-input>
				</el-form-item> 
				<el-form-item label="结算工时" prop="settleHour">
					<el-input v-model="editForm.settleHour" type="number" placeholder="结算工时"></el-input>
				</el-form-item> 
				<el-form-item label="结算状态" prop="settleStatus">
					<el-select style="width:100%;" placeholder="选择结算状态" v-model="editForm.settleStatus">
						<el-option
							v-for="(item,i) in options.projectTaskSettleStatus"
							:key="i"
							:label="item.optionName"
							:value="item.optionValue">
						</el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="结算时间" prop="settleTime">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.settleTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="匹配指数" prop="remarks">
					<el-input v-model="editForm.matchScore" type="number" placeholder="匹配指数" ></el-input>
				</el-form-item>
				<el-form-item label="创建人姓名" prop="createUsername">
					{{userInfo.username}}
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
	import { editXmTaskExecuser } from '@/api/xm/core/xmTaskExecuser';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmTaskExecuser','visible',"execUserList","xmTask"],
		watch: {
	      'xmTaskExecuser':function( xmTaskExecuser ) {
	        this.editForm = xmTaskExecuser;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
						this.execUser.userid = this.editForm.userid;
						this.execUser.username = this.editForm.username;
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
						//{ required: true, message: '编号不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmTaskExecuser xm_task_execuser
				editForm: {
					createTime:'',id:'',taskId:'',userid:'',startTime:'',endTime:'',status:'',remarks:'',settleAmount:'',settleWorkload:'',settleStatus:'',settleTime:'',createUserid:'',createUsername:'',username:'',matchScore:'',quoteWeekday:'',quoteAmount:'',quoteTime:'',bizProcInstId:'',bizFlowState:'',projectId:'',projectPhaseId:'',skillRemark:'',quoteWorkload:'',quoteStartTime:'',quoteEndTime:'',branchId:'',projectPhaseName:'',taskName:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				execUser: {}, 
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交XmTaskExecuser xm_task_execuser父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							// this.load.edit=true
							let params = Object.assign({}, this.editForm);
							editXmTaskExecuser(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){ 
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
		    //在下面添加其它组件 'xm-task-execuser-edit':XmTaskExecuserEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmTaskExecuser);
			this.execUser.userid = this.editForm.userid;
			this.execUser.username = this.editForm.username;
			listOption([{categoryId:'all',itemCode:'projectTaskExecuserStatus'},{categoryId:'all',itemCode:'projectTaskSettleStatus'}]).then(res=>{
				this.options=res.data.data;
			})	
		}
	}

</script>

<style scoped>

</style>