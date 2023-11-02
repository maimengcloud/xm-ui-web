<template>
	<section>
		<el-row class="page-container">
			<el-col :span="6" class="page-height-90 border"> 
				<select-shop    @row-select="shopRowClick"></select-shop>
			</el-col>
			<el-col :span="18" class="page-height-90 border">
			
			<!--新增界面 AppShopConfig app_shop_config--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-card class="box-card  padding-top">
					<div slot="header" class="clearfix">
						<span>商户配置信息 </span>
					</div> 
					<el-row class="form-row">
						归属机构号【{{addForm.shopBranchId}}】 商户编号【{{addForm.shopId}}】结算商户编号【{{settleShopId}}】
					</el-row> 
					<el-row class="form-row">
						支付给第三方支付(支付宝/微信等)的费率为 <el-input type="number" v-model="addForm.tpServiceCharges" placeholder="" style="width:20%;"></el-input> 一般为0.003
					</el-row> 
					<el-row class="form-row">
						支付给平台的手续费费率为 <el-input  type="number"  v-model="addForm.platServiceCharges" placeholder="" style="width:20%;"></el-input>一般为0.003
					</el-row>
					<el-row class="form-row" label="门店手续费" prop="isShopSc">
						门店 <el-radio v-model="addForm.isShopSc" label="0">不需要</el-radio>
  						  <el-radio v-model="addForm.isShopSc" label="1">需要</el-radio> 向商户缴纳手续费   
					</el-row>  
					<el-row class="form-row" v-if="addForm.isShopSc=='1'" label="门店手续费费率 " prop="shopServiceCharges">
						门店需要支付给商户的手续费费率为 <el-input  type="number"  v-model="addForm.shopServiceCharges" placeholder="" style="width:20%;"></el-input> 一般为0
					</el-row> 
				</el-card>
				<el-card class="box-card  padding-top">
					<div slot="header" class="clearfix">
						<span>财务信息</span>
					</div>
					<el-row class="form-row">
						平台分配给商户的预存款账户为 <el-tag>{{addForm.platShopDepositAccountId}}</el-tag>,用于mdp平台与该商户的结算，商户向平台充值等 
					</el-row> 
					<el-row class="form-row" label="主营业务收入账户" prop="shopAssetAccountId">
						商户内部主营业务收入账户 <el-tag>{{addForm.shopAssetAccountId}}</el-tag>，在途资金到账后，转入主营业务收入
					</el-row>  
					<el-row class="form-row" label="支付结算方式" prop="paySetType">
						 支付结算方式为 <el-radio v-model="addForm.paySetType" label="platform">使用平台支付通道结算</el-radio>
  						  <el-radio v-model="addForm.paySetType" label="shop">使用商户结算通道</el-radio>
  						  <el-radio v-model="addForm.paySetType" label="location">使用门店独立结算通道</el-radio>  
					</el-row> 
					<el-row class="form-row" label="核算项目" prop="acctPrjType"> 
						 核算项目为 <el-radio v-model="addForm.acctPrjType" label="platform">由平台核算</el-radio>
  						  <el-radio v-model="addForm.acctPrjType" label="shop">由商户独立核算</el-radio>
  						  <el-radio v-model="addForm.acctPrjType" label="location">由门店独立核算</el-radio> 
					</el-row> 
					<el-row class="form-row" label="结算级别" prop="setLevel">
						结算到 <el-radio v-model="addForm.setLevel" label="1">商户</el-radio>
  						  <el-radio v-model="addForm.setLevel" label="2">门店</el-radio>，即将在途资金账户余额归入商户的预存款账户还是门店预存款账户 
					</el-row> 
					<el-row class="form-row" label="商户预存款账户" prop="shopDepositAccountId">
						客户预存款转入 <el-tag>{{addForm.shopDepositAccountId}}</el-tag> 账户中
					</el-row> 
				</el-card>
				<el-card class="box-card padding-top">
					<div slot="header" class="clearfix">
						<span>归属平台</span>  
					</div>
					<el-row class="form-row" label="平台资产账户 " prop="platAssetAccountId">
						<span v-if="!addForm.platShopId"><el-tag>未配置，请选中平台商户</el-tag> </span>
						<span v-else>归属平台机构号【{{addForm.platBranchId}}】,归属平台商户编号【{{addForm.platShopId}}】</span> 
						<el-button  type="success" @click="selectShopVisible=true">选平台</el-button> 
						<el-button  type="primary" @click="setCurrentShopAsPlatformShop">归属自己</el-button>
						 <el-tooltip
							class="item"
							effect="dark"
							content="第一个商户无法选中可以先选中自己作为平台机构，提高成功后再修改；平台商户归属自己；"
							placement="top"
						>
							<i class="el-icon-question"></i>
						</el-tooltip>
					</el-row> 
					<el-row class="form-row" label="平台资产账户 " prop="platAssetAccountId">
						平台资产账户为 {{addForm.platAssetAccountId?addForm.platAssetAccountId:'未配置'}}
						<el-tag>商户缴纳给平台手续费等，从商户预存款账户转出，转入该账户计入平台主营业务收入</el-tag>
					</el-row> 
					<el-row class="form-row" label="平台手续费" prop="isPlatSc">
						商户 <el-radio v-model="addForm.isPlatSc" label="0">不需要</el-radio>
  						  <el-radio v-model="addForm.isPlatSc" label="1">需要</el-radio> 向平台缴纳手续费  
					</el-row> 
					
					<el-row class="form-row" label="是否加入平台" prop="isJoinPlat">
						  <el-radio v-model="addForm.isJoinPlat" label="0">不在</el-radio>
  						  <el-radio v-model="addForm.isJoinPlat" label="1">在</el-radio> 平台的大商城展现商品 
					</el-row> 
				</el-card> 
			</el-form>
			</el-col>
			<el-drawer title="选中平台商户" :visible.sync="selectShopVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
				 <select-shop    @row-select="platformShopRowClick"></select-shop>
			</el-drawer>
		</el-row>
		
		<el-row class="padding bottom-fixed">
			<el-button @click.native="handleCancel">取消</el-button>  
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addAppShopConfig,editAppShopConfig,listAppShopConfig } from '@/api/mdp/app/appShopConfig';
	import { mapGetters } from 'vuex'
	
	
	import selectShop from '@/views/mdp/app/selectShop'; //新增界面
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			settleShopId:function(){
				var settleShopId="";
				var settleBranchId="";
				if(this.addForm.acctPrjType=='platform'){
					settleShopId=this.addForm.platShopId 
					settleBranchId=this.addForm.platBranchId 
				}else if(this.addForm.acctPrjType=='shop'){
					settleShopId=this.addForm.shopId 
					settleBranchId=this.addForm.shopBranchId 
				}else if(this.addForm.acctPrjType=='location'){
					settleShopId=this.addForm.shopId 
					settleBranchId=this.addForm.shopBranchId 
				} 
				this.addForm.settleShopId=settleShopId;
				this.addForm.settleBranchId=settleBranchId;
				return settleShopId;
			}
		},
		props:['appShopConfig','visible'],
		watch: {
	      'appShopConfig':function( appShopConfig ) {
	        this.addForm = appShopConfig;
		  },
		  'addForm.paySetType':function(val){
			  this.addForm.acctPrjType=val; 
		  },
		  'addForm.acctPrjType':function(val){ 
			  	var shopId=this.addForm.shopId;
				this.addForm.platShopDepositAccountId=this.addForm.acctPrjType+"-"+shopId+"-plat-deposit-0";
				this.addForm.shopDepositAccountId=this.addForm.acctPrjType+"-"+shopId+"-deposit-0";
				this.addForm.shopAssetAccountId=this.addForm.acctPrjType+"-"+shopId+"-asset-0";
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
				isAdd:false,
				//新增界面数据 app_shop_config
				addForm: {
					shopBranchId:'',shopId:'',tpServiceCharges:'',platServiceCharges:'',platShopDepositAccountId:'',platAssetAccountId:'',platShopId:'',shopServiceCharges:'',shopAssetAccountId:'',isPlatSc:'1',isShopSc:'1',acctPrjType:'platform',paySetType:'platform',setLevel:'1',allowLocationWithdraw:'',settleShopId:'',isJoinPlat:'0',shopDepositAccountId:'',settleBranchId:'',platBranchId:''
				},
				selectShopVisible:false,
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交AppShopConfig app_shop_config 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				if(!this.addForm.paySetType){
					this.$notify.error("付款渠道不能为空");
					return 
				}
				if(!this.addForm.acctPrjType){
					this.$notify.error("核算项目不能为空");
					return 
				} 
				if(this.addForm.acctPrjType=='platform'){

				}
				if(!this.addForm.platBranchId){
					this.$notify.error("平台机构号不能为空");
					return 
				}
				
				if(!this.addForm.platShopId){
					this.$notify.error("平台商户编号不能为空");
					return 
				}
				if(!this.addForm.settleBranchId){
					this.$notify.error("结算机构号不能为空");
					return 
				}
				
				if(!this.addForm.settleShopId){
					this.$notify.error("结算商户编号不能为空");
					return 
				}
				if(!this.addForm.shopId){
					this.$notify.error("商户编号不能为空");
					return 
				}
				if(!this.addForm.shopBranchId){
					this.$notify.error("机构编号不能为空");
					return 
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							if(this.isAdd==true){
								addAppShopConfig(params).then((res) => {
									this.load.add=false
									var tips=res.data.tips;
									if(tips.isOk){
										//this.$refs['addForm'].resetFields();
										this.$emit('submit');//  @submit="afterAddSubmit"
									}
									this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
								}).catch( err  => this.load.add=false);
							}else{
								editAppShopConfig(params).then((res) => {
									this.load.add=false
									var tips=res.data.tips;
									if(tips.isOk){
										//this.$refs['addForm'].resetFields();
										this.$emit('submit');//  @submit="afterAddSubmit"
									}
									this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
								}).catch( err  => this.load.add=false);
							}
							
						});
					}
				});
			},
			shopRowClick:function(shop){
				 
				var params={
					shopId:shop.id
				}
				listAppShopConfig(params).then(res=>{
					if(res.data.tips.isOk){
						if(res.data.data.length>0){
							this.isAdd=false;
							this.addForm=res.data.data[0]
						}else{
							this.isAdd=true;
						}
							this.addForm.shopId=shop.id 
							if(this.addForm.acctPrjType==null || this.addForm.acctPrjType==''){
								this.addForm.acctPrjType='platform';
							}
							
							if(this.addForm.paySetType==null || this.addForm.paySetType==''){
								this.addForm.paySetType='platform';
							}
							this.addForm.shopBranchId=shop.branchId
							this.addForm.platShopDepositAccountId=this.addForm.acctPrjType+"-"+shop.id+"-plat-deposit-0";
							this.addForm.shopDepositAccountId=this.addForm.acctPrjType+"-"+shop.id+"-deposit-0";
							this.addForm.shopAssetAccountId=this.addForm.acctPrjType+"-"+shop.id+"-asset-0";
					}else{
						this.$notify.error(res.data.tips.msg);
					}
				});
			},
			platformShopRowClick:function(shop){ 
				this.selectShopVisible=false;
				var params={
					shopId:shop.id
				}
				listAppShopConfig(params).then(res=>{
					if(res.data.tips.isOk){
						if(res.data.data.length>0){ 
							var platformConfig=res.data.data[0];
							this.addForm.platBranchId=platformConfig.shopBranchId
							this.addForm.platShopId=platformConfig.shopId
							this.addForm.platAssetAccountId=platformConfig.shopAssetAccountId; 
						}else{
							this.$notify.error("选中商户未配置基础信息");
						}
					}else{
						this.$notify.error(res.data.tips.msg);
					}
				});
			},
			setCurrentShopAsPlatformShop:function(){
				this.addForm.platBranchId=this.addForm.shopBranchId
				this.addForm.platShopId=this.addForm.shopId
				this.addForm.settleShopId=this.addForm.platShopId
				this.addForm.settleBranchId=this.addForm.platBranchId
				this.addForm.platAssetAccountId=this.addForm.shopAssetAccountId
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'app-shop-config-edit':AppShopConfigEdit
			selectShop
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.appShopConfig);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
.form-row {
	margin-top:10px;
}
</style>