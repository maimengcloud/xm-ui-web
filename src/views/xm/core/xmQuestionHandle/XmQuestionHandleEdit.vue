<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 XmQuestionHandle xm_question_handle--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="处理人编号" prop="handlerUserid">
					<el-input v-model="editForm.handlerUserid" placeholder="处理人编号"></el-input>
				</el-form-item> 
				<el-form-item label="处理人" prop="handlerUsername">
					<el-input v-model="editForm.handlerUsername" placeholder="处理人"></el-input>
				</el-form-item> 
				<el-form-item label="解决方案:" prop="handleSolution">
					<el-input v-model="editForm.handleSolution" placeholder="解决方案:"></el-input>
				</el-form-item> 
				<el-form-item label="回执信息" prop="receiptMessage">
					<el-input v-model="editForm.receiptMessage" placeholder="回执信息"></el-input>
				</el-form-item> 
				<el-form-item label="回执时间" prop="receiptTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.receiptTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="create创建（active激活）–confirm确认（confirmed已确认）–solve解决（resolved已解决）–close关闭（closed已关闭）" prop="handleStatus">
					<el-input v-model="editForm.handleStatus" placeholder="create创建（active激活）–confirm确认（confirmed已确认）–solve解决（resolved已解决）–close关闭（closed已关闭）"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程实例编号" prop="bizProcInstId">
					<el-input v-model="editForm.bizProcInstId" placeholder="当前流程实例编号"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" prop="bizFlowState">
					<el-input v-model="editForm.bizFlowState" placeholder="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除"></el-input>
				</el-form-item> 
				<el-form-item label="问题编号" prop="questionId">
					<el-input v-model="editForm.questionId" placeholder="问题编号"></el-input>
				</el-form-item> 
				<el-form-item label="最后更新日期" prop="lastUpdateTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.lastUpdateTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="创建时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="实际工时" prop="actWorkload">
					<el-input v-model="editForm.actWorkload" placeholder="实际工时"></el-input>
				</el-form-item> 
				<el-form-item label="实际金额" prop="actCostAmount">
					<el-input v-model="editForm.actCostAmount" placeholder="实际金额"></el-input>
				</el-form-item> 
				<el-form-item label="链接地址列表逗号分隔" prop="urls">
					<el-input v-model="editForm.urls" placeholder="链接地址列表逗号分隔"></el-input>
				</el-form-item> 
				<el-form-item label="指派给谁" prop="targetUserid">
					<el-input v-model="editForm.targetUserid" placeholder="指派给谁"></el-input>
				</el-form-item> 
				<el-form-item label="指派给谁" prop="targetUsername">
					<el-input v-model="editForm.targetUsername" placeholder="指派给谁"></el-input>
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
	import { editXmQuestionHandle } from '@/api/xm/core/xmQuestionHandle';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmQuestionHandle','visible'],
		watch: {
	      'xmQuestionHandle':function( xmQuestionHandle ) {
	        this.editForm = xmQuestionHandle;
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
				//编辑界面数据  XmQuestionHandle xm_question_handle
				editForm: {
					id:'',handlerUserid:'',handlerUsername:'',handleSolution:'',receiptMessage:'',receiptTime:'',handleStatus:'',bizProcInstId:'',bizFlowState:'',questionId:'',lastUpdateTime:'',createTime:'',actWorkload:'',actCostAmount:'',urls:'',targetUserid:'',targetUsername:''
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
			//编辑提交XmQuestionHandle xm_question_handle父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmQuestionHandle(params).then((res) => {
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
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-question-handle-edit':XmQuestionHandleEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmQuestionHandle);  
		}
	}

</script>

<style scoped>

</style>