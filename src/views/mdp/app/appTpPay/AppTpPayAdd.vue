<template>
	<section>
		<el-row class="page-container page-height-80">
			<!--新增界面 AppTpPay MDP平台应用与第三方应用关系-->
			<el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>Mdp应用设置</span>
					</div>
					<el-form-item label="授权编号" prop="payAuthId">
						<el-input v-model="addForm.payAuthId" placeholder="授权编号 不填则后台自动生成"></el-input>
					</el-form-item>
					<el-form-item label="授权名称" prop="name">
						<el-input v-model="addForm.name" placeholder="授权名称"></el-input>
					</el-form-item>
					<el-form-item label="备注" prop="remark">
						<el-input v-model="addForm.remark" placeholder="备注"></el-input>
					</el-form-item>
					<el-form-item label=" " prop="openPay">
						<el-checkbox v-model="addForm.openPay" true-label='1' false-label='0'>是否开通支付</el-checkbox>
					</el-form-item>
				</el-card>
				<el-card class="box-card" v-if="addForm.openPay=='1'">
					<div slot="header" class="clearfix">
						<span>第三方支付渠道商户设置</span>
					</div>
					<el-form-item label="支付渠道" prop="payType">
						<el-select v-model="addForm.payType" placeholder="请选择支付渠道">
							<el-option v-for="item in options.tpAppPayType" :key="item.optionValue" :label="item.optionName" :value="item.optionValue">
							</el-option>
						</el-select>
						<el-tag>如下拉为空，请到元数据中配置通用参数 itemCode=tpAppPayType,支付渠道：0余额1微信2V麦3支付宝4银行5网银6其他</el-tag>
					</el-form-item>
					<el-form-item label="第三方应用编号" prop="appid">
						<el-input v-model="addForm.appid" placeholder="第三方应用编号"></el-input>
						<el-tag>对应微信的appid，或者支付宝的appid</el-tag>
					</el-form-item>
					<el-form-item label="商户编号" prop="payMchid">
						<el-input v-model="addForm.payMchid" placeholder="商户编号"></el-input>
					</el-form-item>
					<el-form-item label="付款成功通知地址" prop="payNotifyUrl">
						<el-input v-model="addForm.payNotifyUrl" placeholder="付款成功通知地址"></el-input>
					</el-form-item>
					<el-form-item label="支付加密秘钥" prop="payKey">
						<el-input v-model="addForm.payKey" placeholder="支付加密秘钥"></el-input>
					</el-form-item>

					<el-form-item label="支付加密公钥" prop="payPubKey">
						<el-input v-model="addForm.payPubKey" placeholder="支付加密公钥"></el-input>
					</el-form-item>

					<el-form-item label="渠道手续费" prop="tpServiceCharges">
						<el-input v-model="addForm.tpServiceCharges" placeholder="渠道手续费"></el-input>
						<el-tag>指该渠道交易手续费，比如0.004 表示每次交易，需要支付给该渠道的手续费=交易金额*0.004</el-tag>
					</el-form-item>
				</el-card>
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>绑定MDP平台店铺，设置平台手续费 需要先从商城后台创建店铺 </span>
					</div>
					<!-- <el-form-item label="绑定商户编号" prop="shopId"> -->
					<!-- {{addForm.shopId}} -->
					<!-- <el-input v-model="addForm.shopId" placeholder="绑定商户编号" ></el-input> -->


					<!-- <el-tag>指mdp平台的商户编号，从商城商户管理中查出商户编号，填写在此</el-tag> -->

					<!-- </el-form-item> -->
					<el-form-item label="绑定商户及门店编号" prop="locationId">
						<!-- {{addForm.locationId}} -->
						<div style="display:flex;">
							<el-input v-model="addForm.shopId" placeholder="绑定商户编号"></el-input>
							<el-input v-model="addForm.locationId" placeholder="绑定商户门店编号"></el-input>
							<el-button @click="showSelectShopMethod" v-if="!addForm.shopId">请选择</el-button>
							<el-button @click="showSelectShopMethod" v-else>更改</el-button>
						</div>
						<!-- <el-tag>mdp平台商户{{addForm.shopId}}下的门店、如果为单店或者总部店，请填0，可从商城门店管理中查询出具体门店填写在此</el-tag> -->
					</el-form-item>

					<el-form-item label="默认开通mdp平台的余额账户编号" prop="mdpPayAccountId">
						<!-- shop_id-locationid-01 -->
						<el-input v-model="addForm.mdpPayAccountId" placeholder="默认开通mdp平台的余额账户"></el-input>
						<el-tag>指该商户、门店在mdp平台开立的余额账户、可提现、充值、支付手续费等，默认为商户编号-门店编号-01</el-tag>
					</el-form-item>

					<el-form-item label="MDP平台手续费" prop="mdpServiceCharges">
						<el-input v-model="addForm.mdpServiceCharges" placeholder="MDP平台手续费"></el-input>
						<el-tag>指MDP平台交易手续费，比如0.003 表示每次交易，需要支付给mdp平台的手续费=交易金额*0.003</el-tag>
					</el-form-item>
					<el-form-item label="mdp平台手续费收取账户默认1001账户无论是门店交易还是商户交易，均要向平台缴纳一部分手续费" prop="mdpScAccountId">
						<el-input v-model="addForm.mdpScAccountId" placeholder="mdp平台手续费收取账户默认1001账户无论是门店交易还是商户交易，均要向平台缴纳一部分手续费" ></el-input>
					</el-form-item> 
					<el-form-item label="mdp平台商户手续费费率一般为门店订单交易需要支付一定的手续费给商户" prop="mdpShopServiceCharges">
						<el-input v-model="addForm.mdpShopServiceCharges" placeholder="mdp平台商户手续费费率一般为门店订单交易需要支付一定的手续费给商户"></el-input>
					</el-form-item> 
				</el-card>
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>ip白名单</span>
					</div>
					<el-form-item label="ip白名单" prop="ips">
						<el-input type="textarea" rows="3" v-model="addForm.ips" placeholder="ip列表，多个ip以逗号隔开， 如  192.168.0.1,192.168.0.2 "></el-input>
					</el-form-item>
				</el-card> 
			</el-form>
		</el-row>
		
		<el-row class="page-bottom bottom-fixed padding"> 
			<el-button @click.native="handleCancel">取消</el-button> 
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" >提交</el-button>  
		</el-row>
		<el-drawer title="选择商户" :visible.sync="selectShopVisible" size="70%" append-to-body>
			<select-shop-location-by-sys-dept @sure="sureMethod"></select-shop-location-by-sys-dept>
		</el-drawer>
	</section>
</template>

<script> 
	import {
		listOption
	} from '@/api/mdp/meta/itemOption'; //下拉框数据查询
	import {
		mapGetters
	} from 'vuex'
	import {
		addAppTpPay
	} from '@/api/mdp/app/appTpPay';
	import {
		listSimpleLocation
	} from '@/api/mdp/app/shopLocation';
	import {
		listAppBizType
	} from '@/api/mdp/app/appBizType';
	import selectShopLocationBySysDept from '../selectShopLocationBySysDept/selectShopLocationBySysDept.vue';

	export default {
		props: ['appTpPay', 'visible', 'appMdpDef'],
		watch: {
			'appTpPay': function(appTpPay) {
				this.addForm = appTpPay;
			},
			'visible': function(visible) {
				if (visible == true) {
					this.addForm.logUrl = this.appMdpDef.logUrl
					this.addForm.mdpAppid = this.appMdpDef.mdpAppid
					this.addForm.name = this.appMdpDef.name
					this.addForm.remark = this.appMdpDef.remark
				}
			},
			'addForm.shopId': {
				handler: function() {
					if (this.addForm.shopId) {
						this.addForm.mdpPayAccountId = this.addForm.shopId + "-" + this.addForm.locationId + "-01"
					}
				}
			},
			'addForm.locationId': {
				handler: function() {
					if (this.addForm.locationId) {
						this.addForm.mdpPayAccountId = this.addForm.shopId + "-" + this.addForm.locationId + "-01"
					}
				}
			}
		},
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		data() {
			return {
				selectShopVisible: false,
				options: {}, //下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load: {
					list: false,
					edit: false,
					del: false,
					add: false,
					location: false
				}, //查询中...
				addFormRules: {
					appid: [{
						required: true,
						message: '第三方应用编号不能为空',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '第三方应用名称不能为空',
						trigger: 'blur'
					}],
					payType: [{
						required: true,
						message: '支付渠道不能为空',
						trigger: 'blur'
					}]
				},
				//新增界面数据 MDP平台应用与第三方应用关系
				addForm: {
					mdpAppid: '',
					name: '',
					logoUrl: '',
					remark: '',
					payType: '',
					deptid: '',
					branchId: '',
					cdate: '',
					cuserid: '',
					enabled: '',
					appid: '',
					payMchid: '',
					payNotifyUrl: '',
					openPay: '1',
					payKey: '',
					payPubKey: '',
					ips: '',
					locationId: '0',
					shopId: '',
					locationName: '',
					shopName: '',
					multiLoca: '',
					tpServiceCharges: '',
					mdpServiceCharges: '0.003',
					mdpPayAccountId: '',
					mdpScAccountId:'1001',
					mdpShopServiceCharges:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				appBizTypes: [],
				locations: [], //门店列表[{id, shopId, businessName,districtId,branchName,title,shopBrand}]
				location: null, //选中的门店 {id, shopId, businessName,districtId,branchName,title,shopBrand}
				/**end 在上面加自定义属性**/
			} //end return
		}, //end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel: function() {
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交AppTpAuth MDP平台应用与第三方应用关系 父组件监听@submit="afterAddSubmit"
			addSubmit: function() {

				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add = true
							let params = Object.assign({}, this.addForm);
							params.deptid = this.userInfo.deptid
							params.branchId = this.userInfo.branchId
							params.cuserid = this.userInfo.userid
							params.cdate = this.$mdp.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
							if (this.location != null) {
								params.locationId = this.location.id
								params.locationName = this.location.businessName
								params.shopId = this.location.shopId
								params.shopName = this.location.shopBrand
								params.deptid = this.location.deptid
								params.branchId = this.location.branchId
							}
							params.mdpScAccountId=params.mdpScAccountId?params.mdpScAccountId:'1001';
							addAppTpPay(params).then((res) => {
								this.load.add = false
								var tips = res.data.tips;
								if (tips.isOk) {
									this.$refs['addForm'].resetFields();
									this.$emit('submit'); //  @submit="afterAddSubmit"
								}
								this.$notify({
									message: tips.msg,
									type: tips.isOk ? 'success' : 'error'
								});
							}).catch(() => this.load.add = false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			searchLocations: function(query) {
				let per = /[\u4E00-\u9FA5\uF900-\uFA2D]+/u
				if (!per.test(query)) {
					this.$notify({
						message: '请输入中文模糊匹配',
						type: 'info'
					});
					return;
				}
				if (query == '' || query == null || query.length < 2) {
					return;
				}
				let params = {
					key: '%' + query + '%'
				}
				if (!this.userInfo.isSuperAdmin && !this.userInfo.isPlatformAdmin) {
					params.branchId = this.userInfo.branchId
				}
				this.load.location = true
				listSimpleLocation(params).then(res => {
					this.load.location = false
					this.locations = res.data.data
				})
			},
			showSelectShopMethod() {
				this.selectShopVisible = true;
			},
			sureMethod(row) {
				this.selectShopVisible = false;
				this.addForm.shopId = row.shopId;
				this.addForm.locationId = row.id;
			}
			/**end 在上面加自定义方法**/

		}, //end method
		components: {
			'select-shop-location-by-sys-dept': selectShopLocationBySysDept
			//在下面添加其它组件 'app-tp-auth-edit':AppTpAuthEdit
		},
		mounted() {
			if (this.appTpPay) {
				this.addForm = Object.assign(this.addForm, this.appTpPay);
				if (this.addForm.openPay == '') {
					this.addForm.openPay = '1'
				}
				if (this.addForm.mdpServiceCharges == '') {
					this.addForm.mdpServiceCharges = '0.003';
				}

			}

			if (this.appMdpDef) {
				this.addForm.logUrl = this.appMdpDef.logUrl
				this.addForm.mdpAppid = this.appMdpDef.mdpAppid
				this.addForm.name = this.appMdpDef.name
				this.addForm.remark = this.appMdpDef.remark
			}

			listOption([{
				categoryId: 'all',
				itemCode: 'tpAppPayType'
			}]).then(res => {
				this.options = res.data.data
			});
			/**在下面写其它函数***/

		} //end mounted
	}
</script>

<style scoped>

</style>
