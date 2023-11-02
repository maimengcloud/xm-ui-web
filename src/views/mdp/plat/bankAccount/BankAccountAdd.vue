<template>
	<section class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main page-height-90">
			<!--新增界面 BankAccount 平台收付款账户--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="银行名称" prop="bankName">
					<el-input v-model="addForm.bankName" placeholder="银行名称" ></el-input>
				</el-form-item> 
				<el-form-item label="银行机构码" prop="bankCode">
					<el-input v-model="addForm.bankCode" placeholder="银行机构码" ></el-input>
				</el-form-item> 
				<el-form-item label="银行卡账户编号" prop="cardAccountId">
					<el-input v-model="addForm.cardAccountId" placeholder="银行卡账户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="银行卡账户名称" prop="cardAccountName">
					<el-input v-model="addForm.cardAccountName" placeholder="银行卡账户名称" ></el-input>
				</el-form-item> 
				<el-form-item label="银行分支机构名称" prop="subBankName">
					<el-input v-model="addForm.subBankName" placeholder="银行分支机构名称" ></el-input>
				</el-form-item> 
				<el-form-item label="分支机构编码" prop="subBankCode">
					<el-input v-model="addForm.subBankCode" placeholder="分支机构编码" ></el-input>
				</el-form-item> 
				<el-form-item label="新增时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.ctime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.ltime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="操作用户编号" prop="opUserid">
					<el-input v-model="addForm.opUserid" placeholder="操作用户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="操作用户名称" prop="opUsername">
					<el-input v-model="addForm.opUsername" placeholder="操作用户名称" ></el-input>
				</el-form-item> 
				<el-form-item label="账户状态0无效1有效" prop="status">
					<el-input v-model="addForm.status" placeholder="账户状态0无效1有效" ></el-input>
				</el-form-item> 
				<el-form-item label="账户性质0-平台收款" prop="type">
					<el-input v-model="addForm.type" placeholder="账户性质0-平台收款" ></el-input>
				</el-form-item> 
				<el-form-item label="平台编号" prop="platformId">
					<el-input v-model="addForm.platformId" placeholder="平台编号" ></el-input>
				</el-form-item> 
			</el-form>
		</el-row>
		<el-row  class="page-bottom">
            <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addBankAccount } from '@/api/mdp/plat/bankAccount';
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
	        this.addForm = bankAccount;
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
					cardAccountId: [
						//{ required: true, message: '银行卡账户编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 平台收付款账户
				addForm: {
					bankName:'',bankCode:'',cardAccountId:'',cardAccountName:'',subBankName:'',subBankCode:'',ctime:'',ltime:'',opUserid:'',opUsername:'',status:'',type:'',platformId:''
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
			//新增提交BankAccount 平台收付款账户 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addBankAccount(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
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
			this.addForm=Object.assign(this.addForm, this.bankAccount);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>