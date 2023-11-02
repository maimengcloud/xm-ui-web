<template>
	<div>
		<div class="container">
			<div class="item">
				<div class="left">短信模板名称</div>
				<div style="width: 70%;">
					<el-select v-model="smsTemplatesSelectValue" placeholder="请选择短信模板" style="width:500px;" @change="smsTemplateSelectChangeMethod">
						<el-option v-for="item in smsTemplatesOptions" :key="item.id" :label="item.title" :value="item">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="item">
				<div class="left">签名名称</div>
				<div style="width: 70%;">
					<el-select v-model="smsSignsSelectValue" placeholder="请选择签名" style="width:500px;">
						<el-option v-for="item in smsSignsOptions" :key="item.id" :label="item.text" :value="item.text">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="item">
				<div class="left">短信预览</div>
				<div style="width: 70%;">
					<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="finallyShowContent" style="width:500px;" disabled>
					</el-input><br />
					<p class="explain">当前发送内容{{smsTemplatesSelectValue.text?smsPreview?smsPreview.length:smsTemplatesSelectValue.text.length:0}}个字，预计发送条数约为
						{{smsTemplatesSelectValue.text?Math.ceil(smsPreview?smsPreview.length/67:smsTemplatesSelectValue.text.length/67):0}}条短信</p>
					<p class="example">（实际发送时，如有模板变量会影响计费条数，请特别关注）</p>
					<p style="font-size: 16px;">短信计费的条数，计费规则请参考 <a href="https://cloud.tencent.com/document/product/382/18058#.E7.9F.AD.E4.BF.A1.E5.86.85.E5.AE.B9.E9.95.BF.E5.BA.A6.E8.AE.A1.E7.AE.97.E8.A7.84.E5.88.99"
						 target="_blank" style="color:#00a4ff">国内短信内容长度计算规则</a> 或 国<a href="https://cloud.tencent.com/document/product/382/18052#.E5.9B.BD.E9.99.85.E7.9F.AD.E4.BF.A1.E5.86.85.E5.AE.B9.E9.95.BF.E5.BA.A6.E8.AE.A1.E7.AE.97.E8.A7.84.E5.88.99"
						 target="_blank" style="color:#00a4ff">国际/港澳台短信内容长度计算规则</a></p>
				</div>
			</div>
			<div class="item">
				<div class="left">短信模板参数</div>
				<div style="width: 70%;">
					<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="templateParams" style="width:500px;" @change="smsPreviewMethod">
					</el-input>
					<p class="explain">多个参数之间用英文逗号(<span style="color:#e54545">,</span>)隔开例如：</p>
					<p class="example auto-typing">xx公司,xx元,xx服务器</p>
				</div>
			</div>
			<div class="item">
				<div class="left">发送对象</div>
				<div style="width: 70%;">
					<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="mobilesStr" style="width:500px;">
					</el-input>
					<p class="explain">发送的对象不能超过<span style="color:#e54545">10</span>个,多个手机号码之间用英文逗号(<span style="color:#e54545">,</span>)隔开，例如：</p>
					<p class="example auto-typing ">135xxxxxxxx,138xxxxxxxx,159xxxxxxxx</p>
				</div>
			</div>
			<div class="item">
				<div class="left">用户是否需要回复该短信</div>
				<div style="width: 70%;">
					<el-radio v-model="userNeedReplySmsRadio" label="0">不需要</el-radio>
					<el-radio v-model="userNeedReplySmsRadio" label="1">需要</el-radio>
				</div>
			</div>
			<div class="item" v-if="userNeedReplySmsRadio==='1'">
				<div class="left">回复截至天数</div>
				<div style="width: 20%;">
					<el-input placeholder="请输入天数" v-model="replyEndDay">
						<template slot="append">天内</template>
					</el-input>
				</div>
			</div>
		</div>
		<div style="display:flex; flex-direction:row-reverse">
			<el-button @click="handleCancel" style="margin-left:30px;">取 消</el-button>
			<el-button type="primary" @click="sendSmsMethod" v-loading="showSendDialogVisibleLoading">确 定</el-button>
		</div>
		<el-dialog title="发送结果" :append-to-body='true' :visible.sync="sendResultVisible" width="30%" :close-on-click-modal="false">
			<el-table :data="sendResult" style="width: 100%">
				<el-table-column prop="username" label="用户" width="180">
				</el-table-column>
				<el-table-column prop="mobile" label="手机号" width="180">
				</el-table-column>
				<el-table-column prop="" label="状态">
					<template slot-scope="scope">
						<div style="display:flex;align-items: center;">
							<el-tag type="success" v-if="scope.row.sendStatus=='0'">成功</el-tag>
							<el-tag type="info" v-if="scope.row.sendStatus=='1'">待审核</el-tag>
							<el-tag type="danger" v-if="scope.row.sendStatus=='2'">失败</el-tag>
							<el-tag type="danger" v-if="scope.row.sendStatus=='3'">发送中</el-tag>
							<el-tag type="danger" v-if="scope.row.sendStatus=='4'">结束</el-tag>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
	import util from '@/components/mdp-ui/js/util'; //全局公共库
	import Sticky from '@/components/Sticky' // 粘性header组件
	import {
		mapGetters
	} from 'vuex'; 
	import {
		listSmsTemplate
	} from '@/api/mdp/sms/smsTemplate';
	import {
		groupSendSmsApi,
		listSmsSign
	} from '@/api/mdp/sms/smsSign';
	export default {
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		props: ['visible', 'smsBodyParams','smsUserList','loadPhonenoByUserid'],
		watch: {
			'visible': function(visible) {
				if (visible == true) {
					this.getMobilesStr();
					this.getSmsTemplates();
					this.getSmsSigns();
					if(this.smsBodyParams){
						this.templateParams=this.smsBodyParams.join(",");
					}
				}
			}
		},
		data() {
			return {
				sendResultVisible: false,
				sendResult: [],
				replyEndDay: '',
				userNeedReplySmsRadio: '0',
				activeName: 'first',
				showSendDialogVisibleLoading: false,
				finallyShowContent: '',
				smsPreview: '',
				templateParams: '',
				mobilesStr: '',
				smsSignsSelectValue: '',
				smsTemplatesSelectValue: '',
				smsSignsOptions: [],
				smsTemplatesOptions: [],
				selectShopVisible: false,
				shopId: '',
				locationId: '',
				branchId: '',
				sendSmsVisible: false,
				textarea: '',
				value: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			};
		},
		methods: {
			//展示选择门店的方法
			showSelectShopMethod() {
				this.selectShopVisible = true;
			},
			sureMethod(row) {
				this.selectShopVisible = false;
				this.branchId = row.branchId;
				this.shopId = row.shopId;
				this.locationId = row.id;
				this.getSmsTemplates();
			},
			showSendDialogVisibleMethod() {
				this.shopId = this.userInfo.shopId;
				this.locationId = this.userInfo.locationId;
				this.branchId = this.userInfo.branchId;
				this.sendSmsVisible = true;
				//获取短信签名
				this.getSmsSigns();
				//this.sendSmsVisible=!this.sendSmsVisible;
			},

			handleCancel:function(){
				this.$emit('cancel');
			},
			sendSmsMethod() {
				let that = this;
				if (!this.smsTemplatesSelectValue) {
					this.$notify({position:'bottom-left',showClose: true,
						message: "请选择某个模板",
						type: 'error'
					});
					return;
				}
				if (!this.smsSignsSelectValue) {
					this.$notify({position:'bottom-left',showClose: true,
						message: "请选择某个签名",
						type: 'error'
					});
					return;
				}
				if (!this.mobilesStr) {
					this.$notify({position:'bottom-left',showClose: true,
						message: "发送对象不能为空",
						type: 'error'
					});
					return;
				}
				/* var mobilesStr = '';
				for (let i = 0; i < this.sels.length; i++) {
					if (i != 0) {
						mobilesStr = mobilesStr + "," + this.sels[i].phoneno;
					} else {
						mobilesStr += this.sels[i].phoneno;
					}
				} */
			
				var mobileArr = this.mobilesStr.split(",");
				if (mobileArr.length > 10) {
					this.$notify({position:'bottom-left',showClose: true,
						message: "发送的对象不能超过10个",
						type: 'error'
					});
					return;
				}
				for (let i = 0; i < mobileArr.length; i++) {
					if (!/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(
							mobileArr[i])) {
						this.$notify({position:'bottom-left',showClose: true,
							message: mobileArr[i] + "手机号码不对",
							type: 'error'
						});
						return;
					}
					if (this.mobilesStr.lastIndexOf(mobileArr[i]) != this.mobilesStr.indexOf(mobileArr[i])) {
						this.$notify({position:'bottom-left',showClose: true,
							message: "请填写不同的手机号码进行发送",
							type: 'error'
						});
						return;
					}
				}
				var templateParamsArr = this.templateParams.split(",");
				//统计短信模板变量出现的次数
				var reg = /\{\d\}/;
				let smsTemplateVariableCount = this.smsTemplatesSelectValue.text.split(reg).length - 1;
				if (templateParamsArr.length != smsTemplateVariableCount) {
					this.$notify({position:'bottom-left',showClose: true,
						message: "输入的短信模板参数与短信模板的变量的数目不一致",
						type: 'error'
					});
					return;
				}
				if (this.userNeedReplySmsRadio === '1' && !this.replyEndDay) {
					this.$notify({position:'bottom-left',showClose: true,
						message: "如果勾选需要用户回复，必须填写天数",
						type: 'error'
					});
					return;
				}
				if (this.userNeedReplySmsRadio === '1' && !/^\d+$/.test(this.replyEndDay)) {
					this.$notify({position:'bottom-left',showClose: true,
						message: "天数必须是正整数",
						type: 'error'
					});
					return;
				}
				let params = {
					"smsTemplateParams": this.templateParams,
					"mobiles": this.mobilesStr,
					"smsSign": this.smsSignsSelectValue,
					"smsTemplateId": this.smsTemplatesSelectValue.id,
					"smsTtemplateText": this.smsTemplatesSelectValue.text,
					"nationCode": "86",
					"userid": this.userInfo.userid,
					"branchId": this.smsTemplatesSelectValue.branchId,
					"shopId": this.smsTemplatesSelectValue.shopId,
					"locationId": this.smsTemplatesSelectValue.locationId,
					"replyEndDay": this.replyEndDay,
					"userNeedReplySms": this.userNeedReplySmsRadio
				};
				this.showSendDialogVisibleLoading = true;
				that.sendResult = [];
				groupSendSmsApi(params).then((res) => {
					this.showSendDialogVisibleLoading = false;
					var tips = res.data.tips;
					if (tips.isOk) {
						for (let i = 0; i < res.data.data.length; i++) {
							for (let j = 0; j < that.sels.length; j++) {
								if (res.data.data[i].mobile == that.sels[j].phoneno) {
									res.data.data[i].username = that.sels[j].username
								}
							}
						}
						this.sendResultVisible = true;
						that.sendResult = res.data.data;
					};
					this.$notify({position:'bottom-left',showClose: true,
						message: tips.msg,
						type: tips.isOk ? 'success' : 'error'
					});
				}).catch(err => {
					this.sendSmsVisible = false
				});
			},
			//查询短信模板
			getSmsTemplates() {
				let params = {
					"shopId": this.userInfo.shopId,
					"locationId": this.userInfo.locationId,
					"branchId": this.userInfo.branchId,
					"status": "0"
				};
				this.finallyShowContent = '';
				this.smsPreview = '';
				this.smsTemplatesSelectValue = '';
				this.smsTemplatesOptions = [];
				listSmsTemplate(params).then((res) => {
					var tips = res.data.tips;
					if (tips.isOk) {
						this.smsTemplatesOptions = res.data.data;
					} else {
						this.$notify({position:'bottom-left',showClose: true,
							message: tips.msg,
							type: 'error'
						});
					}

				}).catch();
			},
			//查询短信签名
			getSmsSigns() {
				let params = {
					"status": "0",
					"shopId": this.userInfo.shopId
				};
				this.smsSignsOptions = [];
				listSmsSign(params).then((res) => {
					var tips = res.data.tips;
					if (tips.isOk) {
						this.smsSignsOptions = res.data.data;
					} else {
						this.$notify({position:'bottom-left',showClose: true,
							message: tips.msg,
							type: 'error'
						});
					}
				}).catch();
			},
			smsTemplateSelectChangeMethod() {
				this.finallyShowContent = this.smsTemplatesSelectValue.text;
			},
			//短信预览的方法
			smsPreviewMethod(value) {
				//求出模板中的变量的数量
				var reg = /\{\d\}/;
				this.smsPreview = '';
				if (!this.smsTemplatesSelectValue.text) {
					return;
				}
				this.finallyShowContent = this.smsTemplatesSelectValue.text;
				let smsTemplateVariableCount = this.smsTemplatesSelectValue.text.split(reg).length - 1;
				let valueArr = value.split(",");
				let finallyStr = this.smsTemplatesSelectValue.text;
				for (let i = 0; i < smsTemplateVariableCount; i++) {
					if (i < valueArr.length) {
						let k = i + 1;
						var regex = new RegExp('\\{' + k + '\\}');
						finallyStr = finallyStr.replace(regex, valueArr[i])
					}
				};
				this.smsPreview = finallyStr;
				this.finallyShowContent = this.smsPreview;
			},
			getMobilesStr(){
				this.mobilesStr = '';
				if(this.loadPhonenoByUserid==true){
					let userids=this.smsUserList.map(user=>user.userid);
					this.$mdp.listUser({userids:userids,branchId:this.userInfo.branchId}).then(res=>{
						if(res.data.tips.isOk){
							let users=res.data.data;
							 let phonenoList=users.map(user=>user.phoneno);
							 this.mobilesStr=phonenoList.join(",");
						}
					});
				}else{
					let phonenoList=this.smsUserList.map(user=>user.phoneno);
					 this.mobilesStr=phonenoList.join(",");
				}
				
			},
			//初始化数据
			initData() {
				this.templateParams = '',
				this.mobilesStr = '';
				this.smsTemplatesSelectValue = '';
				this.smsSignsSelectValue = '';
			}

		},
		components: {

		},
		mounted() {
			this.$nextTick(() => {
				this.getSmsTemplates();
				this.getSmsSigns();
				this.getMobilesStr();
				if(this.smsBodyParams){
					this.templateParams=this.smsBodyParams.join(",");
				}
			});
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		width: 80%;
		margin: 0 auto;
	}

	.item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 30px;
	}

	.item .left {
		width: 200px;
		font-size: 20px;
		color: #888;
		padding-right: 60px;
		align-self: flex-start;
		margin-top: 10px;
	}

	.item .explain {
		font-size: 16px;
		width: 500px;
	}

	.item .example {
		font-size: 16px;
		color: #e54545
	}

	.auto-typing {
		font-weight: bold;
		overflow: hidden;
		width: 53ch;
		border-right: 1px solid transparent;
		white-space: nowrap;
		animation: typing 5s steps(53) 5s forwards;
	}

	@keyframes typing {
		from {
			width: 0;
		}
	}
</style>
