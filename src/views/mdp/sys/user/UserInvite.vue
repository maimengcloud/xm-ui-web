<template>
	<section>
		<el-dialog
			title="外邀新成员"
			:visible.sync="visible" 
			:close-on-click-modal="false"
			append-to-body
			:width="width?width:'70%'"
			> 
		<el-row>
			<el-col :span="12"> 
				<el-form label-position="top" label-width="150">
					<el-form-item label="邀请方式"> 
						<el-row> 
								<div class="img-box" @click="setInviteType('email')">
									<img class="img-item"  v-if="inviteType!=='email'" src="@/assets/image/sys/invite/email-0.png" />
									<img class="img-item"  v-if="inviteType==='email'" src="@/assets/image/sys/invite/email-1.png" />
									<p class="img-text">邮箱邀请</p>
								</div> 
								<div class="img-box"  @click="setInviteType('phone')">
									<img class="img-item" v-if="inviteType!=='phone'" src="@/assets/image/sys/invite/phone-0.png"/> 
									<img class="img-item" v-else-if="inviteType==='phone'" src="@/assets/image/sys/invite/phone-1.png"/> 
									<p class="img-text">手机邀请</p>
								</div>
								<div class="img-box"  @click="setInviteType('ewCode')" v-loading="load.ewCode">
									<img class="img-item" v-if="inviteType!=='ewCode'" src="@/assets/image/sys/invite/ew-code-0.png"/> 
									<img class="img-item" v-else-if="inviteType==='ewCode'" src="@/assets/image/sys/invite/ew-code-1.png"/> 
									<p class="img-text">二维码邀请</p>
								</div>	 
						</el-row>
					</el-form-item>
				</el-form>
				
			</el-col>
			<el-col :span="12">
				<el-form v-model="addForm" :rules="addFormRules" label-position="top">
					<el-form-item label="邮箱" v-if="inviteType==='email'" prop="emails">
						<el-input type="textarea" :rows="6" v-model="addForm.emails" placeholder="支持多邮箱，邮箱之间用逗号,分割"> 
						</el-input>
					</el-form-item>
					<el-form-item label="手机号码" v-if="inviteType==='phone'" prop="phonenos">
						<el-input type="textarea" :rows="6" v-model="addForm.phonenos" placeholder="支持多号码，号码之间用逗号,分割"> 
						</el-input>
					</el-form-item>
					<el-form-item label="二维码"  v-loading="load.ewCode">
						<div style="text-align:center;" v-show="inviteType==='ewCode'">
							<div>  
								<div id="login_container"></div> 
							</div>
							<p v-if="joinUsername"> {{joinUsername}}您好，【{{userInfo.branchName}}-{{userInfo.username}}】邀请您扫码登录</p>
							<p v-else> 【{{userInfo.branchName}}-{{userInfo.username}}】邀请您扫码登录</p>
						</div>
					</el-form-item>
					<el-form-item>
						<el-col :span="24" > 
							<el-col :span="4"> 
								<el-button type="primary" @click.native="addSubmit" :loading="load.add" v-if="inviteType!=='ewCode'">提交</el-button>  
								<el-button type="primary" @click.native="shareEwCode" :loading="load.add" v-if="inviteType=='ewCode'">分享链接</el-button>  

							</el-col>
						</el-col> 
					</el-form-item> 
				</el-form>
			</el-col>
		</el-row>
		</el-dialog>
	</section>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import { addUser,inviteUsersByEmails,inviteUsersByPhonenos } from '../../../../api/mdp/sys/user'; 
import * as UserTpaInviteApi from '@/api/mdp/sys/userTpaInvite';

import Vue from "vue";
import VueClipboard from "vue-clipboard2";
VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard);
import { mapGetters } from 'vuex'   
import md5 from 'js-md5';  
import VueQr from 'vue-qr'	
import logoSrc from "@/assets/image/logo_cicle.png"

	export default {
		props:{
			width:{
				type:String,
				default:'70%'
			},
			
		},
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ]),

		},
		watch: { 
	    },	
		data() { 
			var validatePhoneno = (rule, value, callback) => {
				if (!value) {
				//callback(new Error('请输入密码'));
				callback();
				} else {
				if (value) {
					if(value.length<11 || value.length>11){
						callback(new Error('手机号码必须11位'));
					}
					if(!(/^1[3456789]\d{9}$/.test(value))){ 
						callback(new Error('手机号码格式不正确'));
					}

				}
				callback();
				}
			};
			
			var validateEmail = (rule, value, callback) => {
				if (!value) {
				//callback(nPhonenoew Error('请输入密码'));
					callback();
				} else {
				if (value) {
					var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
					if(!reg.test(value)){
						 callback(new Error('邮箱格式不正确'));
					}  
				}
				callback();
				}
			}; 
			return {
				load:{add: false,ewCode:false},
				visible:false,
				addFormRules: { 
					 
				},
				//新增界面数据 sys_user
				addForm: {
					phonenos:'',emails:''
				},
				inviteType:'email',//email|phone|ewCode
				logoSrc:logoSrc,
				joinUserid: '',
				joinUsername:'',
				/**end 在上面加自定义变量**/
			}//end return
		},//end data
		methods: {
			weixinLogin(){ 
				var curlDomain=window.location.protocol+"//"+window.location.host; //  
				var mdpRedirectUri=	`${curlDomain}/${process.env.CONTEXT}/${process.env.VERSION}/`
				var tpaContext=this.$mdp.getTpaContext();
				var domain=this.$mdp.getFixedDomain();
				var appType=this.$mdp.getWxpubConfig().appType;
				var scope=this.$mdp.getWxpubConfig().scope
				this.load.ewCode=true; 
				var params={}
				if(this.joinUserid){
					params={joinUserid:this.joinUserid,joinUsername:this.joinUsername,inviteScene:'2',inviteType:'1'}
				}else{
					params={inviteScene:'3',inviteType:'1'}

				}
				var appType=this.$mdp.getWxpubConfig().appType
				UserTpaInviteApi.createInviteId(params).then(res=>{
					this.load.ewCode=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.inviteType='ewCode' 
						this.inviteId=res.data.data.inviteId
						var state=this.inviteId
						var obj = new WxLogin({
							self_redirect:false,
							id:"login_container", 
							appid: this.$mdp.getWxpubConfig().appid, 
							scope: scope, 
							redirect_uri: encodeURIComponent(`${domain}/api/${process.env.VERSION}/${tpaContext}/login/token?authType=wechat_wxpub&appType=${appType}&redirectUri=${mdpRedirectUri}`),
							state: state,
							style: "",
							href: ""
						}); 
					}else{
						this.$notify.error(tips.msg)
					}
				})
			
			},
			show(res){
				
				this.visible=true;
				if(res!=null && res.inviteType){
					if(res.joinUserid){
						this.joinUserid=res.joinUserid
						this.joinUsername=res.joinUsername
					}else{
						this.joinUserid=''
						this.joinUsername=''
					}
					if(res.inviteType){
						this.setInviteType(res.inviteType)
					}
					
				}else{
					this.joinUserid=''
					this.joinUsername=''
					this.setInviteType('email')
					

				}

			},
			getEwCodeCallbackUri(){ 
				//var ewCodeCallbackUri=window.location.protocol+"//"+window.location.host; 
				var ewCodeCallbackUri=window.location.protocol+"//"+window.location.host;
				ewCodeCallbackUri=ewCodeCallbackUri+"/xm/"+process.env.VERSION+"/#/login?branchId="+this.userInfo.branchId 
				return ewCodeCallbackUri;
			},
			setInviteType(inviteType){
				if(inviteType=='ewCode'){
					this.weixinLogin()
				}else{
					this.inviteType=inviteType
				}
				
			},
			clear(){

			},
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交User sys_user 父组件监听@submit="afterAddSubmit"
			addSubmit: function () { 
				var func=inviteUsersByEmails
				var params={}
				if(this.inviteType==='phone'){
					if(!this.addForm.phonenos){
						this.$notify({ message:"请输入手机号码列表", type: 'error' }); 
						return;
					}
					this.addForm.phonenos=this.addForm.phonenos.replace("，",",");
					func = inviteUsersByPhonenos
					params.phonenos=this.addForm.phonenos.split(",")
				}
				
				if(this.inviteType==='email'){
					if(!this.addForm.emails){
						this.$notify({ message:"请输入邮箱号码列表", type: 'error' }); 
						return;
					} 
					params.emails=this.addForm.emails.split(",")
					var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
					params.callbackUri=curlDomain+"/xm/"+process.env.VERSION+"/"
				}
				this.load.add=true;
				func(params).then(res=>{
					this.load.add=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.$notify({ message:tips.msg, type: 'success' }); 
					}else{
						this.$notify({ message:tips.msg, type: 'error' }); 
					}
				}).catch(e=>this.load.add=false)

			},
			shareEwCode(){ 
				var remark=""
				if(this.joinUsername){
					remark=this.userInfo.branchName+'-'+this.userInfo.username+'邀请【'+this.joinUsername+'】微信扫码登录'
				}else{
					remark=this.userInfo.branchName+'-'+this.userInfo.username+'邀请您微信扫码登录'
				}
 				const href =
				window.location.protocol +
				"//" +
				window.location.host +
				"/"+process.env.CONTEXT+"/" +
				process.env.VERSION +
				"/#/mdp/tpa/invite/code/"+this.inviteId+'?r='+remark;

				this.$copyText(href).then(e => {
					this.$message.success("分享链接已复制，您可直接黏贴到微信、浏览器地址栏等")
				}); 
			}
			/**begin 在下面加自定义方法**/
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {   
			VueQr
		},
		mounted() {
			var s1 = document.createElement('script');
			s1.type = 'text/javascript';
			s1.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
			document.body.appendChild(s1);
			
			this.addForm.deptid=this.userInfo.deptid; 
			
		}//end mounted
	}

</script>

<style scoped>
	.img-box{  
		margin: 2px;
		float:left;
		width: 164px;
		height: 180px;
		background-color: aliceblue;
		text-align: center; 
		cursor: pointer;
		padding: 40px;
	}
	.img-text{
		text-align: center;
	}
	.img-item{
		object-fit:scale-down;
		height: 50px;
		max-width: 80px;
		background-position: 50%;
	}


.ew-code {
  position: relative; 
  display: inline-block;
  height: 200px;
  width: 200px; 
  padding: 20px;
  border: 1px solid rgba(19, 16, 229, 0.17);  
}
.ew-code::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 40px;
  height: 40px;
  border-top: 7px solid rgba(71, 121, 246, 1);
  border-left: 7px solid rgba(71, 121, 246, 1);
}
.ew-code-img{  
	object-fit: scale-down;
	height: 100%;
	background-position: 50%;
}
.ew-code::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  width: 40px;
  height: 40px;
  border-top: 7px solid rgba(71, 121, 246, 1);
  border-right: 7px solid rgba(71, 121, 246, 1);
}
.ew-code .ew-code-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.ew-code .ew-code-footer::before {
  position: absolute;
  bottom: 0;
  left: 0;
  content: "";
  width: 40px;
  height: 40px;
  border-bottom: 7px solid rgba(71, 121, 246, 1);
  border-left: 7px solid rgba(71, 121, 246, 1);
}
.ew-code .ew-code-footer::after {
  position: absolute;
  bottom: 0;
  right: 0;
  content: "";
  width: 40px;
  height: 40px;
  border-bottom: 7px solid rgba(71, 121, 246, 1);
  border-right: 7px solid rgba(71, 121, 246, 1);
  }
</style>