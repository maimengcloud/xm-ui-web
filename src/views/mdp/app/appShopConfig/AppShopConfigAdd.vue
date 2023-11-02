<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 AppShopConfig app_shop_config--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="商户自身归属机构号" prop="shopBranchId">
					<el-input v-model="addForm.shopBranchId" placeholder="商户自身归属机构号" ></el-input>
				</el-form-item> 
				<el-form-item label="商户编号" prop="shopId">
					<el-input v-model="addForm.shopId" placeholder="商户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="第三方手续费费率如支付宝/微信支付的费率比如0.003" prop="tpServiceCharges">
					<el-input v-model="addForm.tpServiceCharges" placeholder="第三方手续费费率如支付宝/微信支付的费率比如0.003"></el-input>
				</el-form-item> 
				<el-form-item label="mdp平台附加手续费费率比如0.002,即该商户下所有交易需要支付给平台的手续费费率" prop="platServiceCharges">
					<el-input v-model="addForm.platServiceCharges" placeholder="mdp平台附加手续费费率比如0.002,即该商户下所有交易需要支付给平台的手续费费率"></el-input>
				</el-form-item> 
				<el-form-item label="mdp平台分配给该商户（门店）预存款账户（一般商户编号-门店编号-01，用于mdp平台与该商户的结算，商户充值等），如果是总部店，为一般商户编号-0-01" prop="platShopDepositAccountId">
					<el-input v-model="addForm.platShopDepositAccountId" placeholder="mdp平台分配给该商户（门店）预存款账户（一般商户编号-门店编号-01，用于mdp平台与该商户的结算，商户充值等），如果是总部店，为一般商户编号-0-01" ></el-input>
				</el-form-item> 
				<el-form-item label="平台资产账户，商户缴纳给平台手续费等，从商户预存款账户转出，转入该账户计入平台主营业务收入" prop="platAssetAccountId">
					<el-input v-model="addForm.platAssetAccountId" placeholder="平台资产账户，商户缴纳给平台手续费等，从商户预存款账户转出，转入该账户计入平台主营业务收入" ></el-input>
				</el-form-item> 
				<el-form-item label="归属平台商户编号" prop="platShopId">
					<el-input v-model="addForm.platShopId" placeholder="归属平台商户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="mdp平台商户手续费费率一般为门店订单交易需要支付一定的手续费给商户" prop="shopServiceCharges">
					<el-input v-model="addForm.shopServiceCharges" placeholder="mdp平台商户手续费费率一般为门店订单交易需要支付一定的手续费给商户"></el-input>
				</el-form-item> 
				<el-form-item label="商户内部主营业务收入账户，在途资金到账后，转入主营业务收入" prop="shopAssetAccountId">
					<el-input v-model="addForm.shopAssetAccountId" placeholder="商户内部主营业务收入账户，在途资金到账后，转入主营业务收入" ></el-input>
				</el-form-item> 
				<el-form-item label="商户是否需要向平台缴纳手续费" prop="isPlatSc">
					<el-input v-model="addForm.isPlatSc" placeholder="商户是否需要向平台缴纳手续费" ></el-input>
				</el-form-item> 
				<el-form-item label="门店是否需要向商户缴纳手续费" prop="isShopSc">
					<el-input v-model="addForm.isShopSc" placeholder="门店是否需要向商户缴纳手续费" ></el-input>
				</el-form-item> 
				<el-form-item label="核算项目platform-由平台结算，shop-由商户独立结算，location-由门店独立结算" prop="acctPrjType">
					<el-input v-model="addForm.acctPrjType" placeholder="核算项目platform-由平台结算，shop-由商户独立结算，location-由门店独立结算" ></el-input>
				</el-form-item> 
				<el-form-item label="支付结算方式platform-使用平台支付通道结算，shop-使用商户结算通道，location-使用门店独立结算通道" prop="paySetType">
					<el-input v-model="addForm.paySetType" placeholder="支付结算方式platform-使用平台支付通道结算，shop-使用商户结算通道，location-使用门店独立结算通道" ></el-input>
				</el-form-item> 
				<el-form-item label="结算级别1-商户2-门店，将在途资金账户余额归入商户的预存款账户还是门店预存款账户" prop="setLevel">
					<el-input v-model="addForm.setLevel" placeholder="结算级别1-商户2-门店，将在途资金账户余额归入商户的预存款账户还是门店预存款账户" ></el-input>
				</el-form-item> 
				<el-form-item label="是否允许门店提现0否1允许3按门店配置自定义" prop="allowLocationWithdraw">
					<el-input v-model="addForm.allowLocationWithdraw" placeholder="是否允许门店提现0否1允许3按门店配置自定义" ></el-input>
				</el-form-item> 
				<el-form-item label="归属计算商户pay_set_type=platform时，指向平台商户编号platform_shop_id，pay_set_type=shop时指向本商户编号shop_id" prop="settleShopId">
					<el-input v-model="addForm.settleShopId" placeholder="归属计算商户pay_set_type=platform时，指向平台商户编号platform_shop_id，pay_set_type=shop时指向本商户编号shop_id" ></el-input>
				</el-form-item> 
				<el-form-item label="是否加入平台，如果加入平台将在平台的大商城可以展现数据-同步到shop表，避免多表关联" prop="isJoinPlat">
					<el-input v-model="addForm.isJoinPlat" placeholder="是否加入平台，如果加入平台将在平台的大商城可以展现数据-同步到shop表，避免多表关联" ></el-input>
				</el-form-item> 
				<el-form-item label="商户预存款账户，shop模式下，作为客户" prop="shopDepositAccountId">
					<el-input v-model="addForm.shopDepositAccountId" placeholder="商户预存款账户，shop模式下，作为客户" ></el-input>
				</el-form-item> 
				<el-form-item label="结算商户对应的机构号" prop="settleBranchId">
					<el-input v-model="addForm.settleBranchId" placeholder="结算商户对应的机构号" ></el-input>
				</el-form-item> 
				<el-form-item label="商户归属的平台机构号" prop="platBranchId">
					<el-input v-model="addForm.platBranchId" placeholder="商户归属的平台机构号" ></el-input>
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
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addAppShopConfig } from '@/api/mdp/app/appShopConfig';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['appShopConfig','visible'],
		watch: {
	      'appShopConfig':function( appShopConfig ) {
	        this.addForm = appShopConfig;
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
					shopId: [
						//{ required: true, message: '商户编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 app_shop_config
				addForm: {
					shopBranchId:'',shopId:'',tpServiceCharges:'',platServiceCharges:'',platShopDepositAccountId:'',platAssetAccountId:'',platShopId:'',shopServiceCharges:'',shopAssetAccountId:'',isPlatSc:'',isShopSc:'',acctPrjType:'',paySetType:'',setLevel:'',allowLocationWithdraw:'',settleShopId:'',isJoinPlat:'',shopDepositAccountId:'',settleBranchId:'',platBranchId:''
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
			//新增提交AppShopConfig app_shop_config 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addAppShopConfig(params).then((res) => {
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
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'app-shop-config-edit':AppShopConfigEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.appShopConfig);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>