<template>
	<section>
		<el-row  class="padding border">
		<!--编辑界面 XmTaskExecuser xm_task_execuser-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="执行人姓名" prop="bidUserid"> 
					<mdp-select-user v-model="editForm.bidUserid" :init-name="editForm.bidUsername" show-style="tag" @change2="u=>{editForm.bidUsername=u.username;editForm.bidBranchId=u.branchId}"/>
				</el-form-item>
				<el-form-item label="执行人状态" prop="status">
					<mdp-select item-code="projectTaskExecuserStatus" :disabled="editForm.status == '2'"  placeholder="选择状态" v-model="editForm.status"> 
					</mdp-select>
				
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
					<mdp-select show-style="tag" item-code="projectTaskSettleStatus" style="width:100%;" placeholder="选择结算状态" v-model="editForm.settleStatus"> 
					</mdp-select>
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

	import { editXmTaskExecuser } from '@/api/xm/core/xmTaskExecuser';
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmTaskExecuser','visible',"xmTask"],
		watch: {
	      'xmTaskExecuser':function( xmTaskExecuser ) {
	        this.editForm = xmTaskExecuser;
	      },
	      'visible':function(visible) { 
	      }
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '编号不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmTaskExecuser xm_task_execuser
				editForm: {
					createTime:'',id:'',taskId:'',userid:'',startTime:'',endTime:'',status:'',remarks:'',settleAmount:'',settleWorkload:'',settleStatus:'',settleTime:'',createUserid:'',createUsername:'',username:'',matchScore:'',quoteWeekday:'',quoteAmount:'',quoteTime:'',bizProcInstId:'',bizFlowState:'',projectId:'',phaseId:'',skillRemark:'',quoteWorkload:'',quoteStartTime:'',quoteEndTime:'',branchId:'',projectPhaseName:'',taskName:''
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
		    //在下面添加其它组件 'xm-task-execuser-edit':XmTaskExecuserEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmTaskExecuser); 

		}
	}

</script>

<style scoped>

</style>
