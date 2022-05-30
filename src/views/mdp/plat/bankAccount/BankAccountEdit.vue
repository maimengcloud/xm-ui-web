<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main page-height-90">
		<!--编辑界面 BankAccount 平台收付款账户--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="银行名称" prop="bankName">
					<el-input v-model="editForm.bankName" placeholder="银行名称"></el-input>
				</el-form-item> 
				<el-form-item label="银行机构码" prop="bankCode">
					<el-input v-model="editForm.bankCode" placeholder="银行机构码"></el-input>
				</el-form-item> 
				<el-form-item label="银行卡账户编号" prop="cardAccountId">
					<el-input v-model="editForm.cardAccountId" placeholder="银行卡账户编号"></el-input>
				</el-form-item> 
				<el-form-item label="银行卡账户名称" prop="cardAccountName">
					<el-input v-model="editForm.cardAccountName" placeholder="银行卡账户名称"></el-input>
				</el-form-item> 
				<el-form-item label="银行分支机构名称" prop="subBankName">
					<el-input v-model="editForm.subBankName" placeholder="银行分支机构名称"></el-input>
				</el-form-item> 
				<el-form-item label="分支机构编码" prop="subBankCode">
					<el-input v-model="editForm.subBankCode" placeholder="分支机构编码"></el-input>
				</el-form-item> 
				<el-form-item label="新增时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="操作用户编号" prop="opUserid">
					<el-input v-model="editForm.opUserid" placeholder="操作用户编号"></el-input>
				</el-form-item> 
				<el-form-item label="操作用户名称" prop="opUsername">
					<el-input v-model="editForm.opUsername" placeholder="操作用户名称"></el-input>
				</el-form-item> 
				<el-form-item label="账户状态0无效1有效" prop="status">
					<el-input v-model="editForm.status" placeholder="账户状态0无效1有效"></el-input>
				</el-form-item> 
				<el-form-item label="账户性质0-平台收款" prop="type">
					<el-input v-model="editForm.type" placeholder="账户性质0-平台收款"></el-input>
				</el-form-item> 
				<el-form-item label="平台编号" prop="platformId">
					<el-input v-model="editForm.platformId" placeholder="平台编号"></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row  class="page-bottom">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editBankAccount } from '@/api/mdp/plat/bankAccount';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['bankAccount','visible'],
		watch: {
	      'bankAccount':function( bankAccount ) {
	        this.editForm = bankAccount;
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
					cardAccountId: [
						//{ required: true, message: '银行卡账户编号不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  BankAccount 平台收付款账户
				editForm: {
					bankName:'',bankCode:'',cardAccountId:'',cardAccountName:'',subBankName:'',subBankCode:'',ctime:'',ltime:'',opUserid:'',opUsername:'',status:'',type:'',platformId:''
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
			//编辑提交BankAccount 平台收付款账户父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editBankAccount(params).then((res) => {
								;
								this.load.edit=false
								var tips=res.data.tips;
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
								if(tips.isOk){ 
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'bank-account-edit':BankAccountEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.bankAccount);  
		}
	}

</script>

<style scoped>

</style>