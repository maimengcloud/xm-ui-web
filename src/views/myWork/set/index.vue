<template>
	<div class="set_container">
		<div class="set_content">
			<div class="m_msgcard">
				<el-avatar class="m_avater" :src="editForm.headimgurl" @click.native="$refs['imageDialog'].open()">
					<img src="../../../assets/image/user_img.gif"/> 
				</el-avatar>
				<div class="m_msg">
					<span class="m_name">{{userInfo.username}}
					
				 	<el-tag v-if="editForm.memType==='0'" type="primary">个人账户</el-tag>
					 <el-tag type="warning" v-else-if="editForm.memType=='1'">企业管理员账户</el-tag>
					<el-tag type="warning" v-else-if="editForm.memType=='2'">企业员工账户</el-tag> 
					 <el-button v-if="editForm.memType==='0'" type="text"   icon="el-icon-top" @click="upgradeToBranchAccount">升级为企业账户</el-button>
 					</span>
					<span class="m_dept">所属机构：{{userInfo.branchName}}</span> 
					<span class="m_dept">所在部门：{{userInfo.deptName}}</span> 
				</div>
			</div>
			<div class="m_opercard">
				<div class="m_base">
					<h3>基本信息</h3>
					<el-form class="m_f m_from1" :model="editForm"  label-width="120px" :rules="editFormRules"  ref="editForm">
						<el-form-item label="用户名称" prop="username" :rules="[{required:true,message:'用户名称不能为空'}]">
							<el-input style="width:400px;"  v-model="editForm.username" auto-complete="off"></el-input>
						</el-form-item> 
						<el-form-item label="登录账号" prop="displayUserid" :rules="[{required:true,message:'登录账号不能为空'}]">
							<el-input style="width:400px;" v-model="editForm.displayUserid" auto-complete="off"></el-input>
						</el-form-item>     
						<el-form-item label="邮箱" prop="email" >
							{{editForm.email?editForm.email:'暂无'}} 
						</el-form-item>     
						<el-form-item label="手机号码" prop="phoneno">
							{{editForm.phoneno?editForm.phoneno:'暂无'}} 
						</el-form-item>   
						<el-form-item> 
							<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>   
 						</el-form-item> 
					</el-form>
				</div> 
				<div class="m_setpwd" v-if="userInfo && userInfo.userid">
					<h3>绑定微信</h3>
					<el-form :model="scanCodeForm"  label-width="120px"  ref="scanCodeRef" v-loading="load.list">
						<el-form-item>
							<div style="text-align:center;">
								<div>  
									<div id="login_container"></div> 
								</div>
								<p>扫码登录，自动绑定个人微信号，接收重要信息通知(如果已绑定，可以重新绑定)</p>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</div> 
			<div class="m_opercard">
				<div class="m_base">
					<h3>密码设置</h3> 			 
					<el-form class="m_f m_from1" :model="passwordForm"  label-width="120px" ref="passwordForm">
						<el-form-item>
							<el-form-item label="原密码" prop="oldPassword" :rules="[{required:true,message:'原密码不能为空'}]">
								<el-input style="width:400px;" type="password" v-model="passwordForm.oldPassword" auto-complete="off"></el-input>
								<div>如果忘记原密码，请先绑定手机，再通过【首页】->【忘记密码】进行密码重置</div>

							</el-form-item>  
							<el-form-item label="新密码" prop="newPassword" :rules="[{required:true,message:'新密码不能为空'}]">
								<el-input style="width:400px;" type="password" v-model="passwordForm.newPassword" auto-complete="off"></el-input>
							</el-form-item> 
							<el-form-item>
								<el-button style="margin-left: 80px" type="primary" @click.native="doChangePassword" :loading="setLoading">保存</el-button>  
							</el-form-item> 
						</el-form-item>
					</el-form>
				</div> 
			</div>
			<div class="m_opercard">
				<div class="m_base" v-if="!userInfo.phoneno">
					<h3>绑定手机</h3>
					<el-form class="m_f m_from1" :model="phonenoForm"  label-width="120px" ref="phonenoForm">
						<el-form-item>
							<el-form-item label="手机号码" prop="phoneno" :rules="[{required:true,message:'手机号码不能为空'}]">
								<el-input style="width:400px;"  v-model="phonenoForm.phoneno" auto-complete="off"></el-input>
							</el-form-item>  
							<el-form-item label="验证码" prop="smsCode" :rules="[{required:true,message:'短信验证码不能为空'}]">
								<el-input style="width:400px;"   v-model="phonenoForm.smsCode" auto-complete="off"></el-input>&nbsp;&nbsp;<el-button @click="sendPhonenoSmsCode('userPhoneno')" :disabled="smsCodeTime>0">发送短信验证码{{smsCodeTime>0?'('+smsCodeTime+'秒)':''}}</el-button>
							</el-form-item> 
							<el-form-item>
								<el-button style="margin-left: 80px" type="primary" @click.native="registerPhoneno" :loading="setLoading">提交</el-button>  
							</el-form-item> 
						</el-form-item>
					</el-form>
				</div>
				<div class="m_base" v-if="userInfo.phoneno">
					<h3>更换手机</h3>
					<el-form class="m_f m_from1" :model="phonenoForm"  label-width="120px" ref="phonenoForm">
						<el-form-item>
							<el-form-item label="旧手机号码">
								<el-input style="width:400px;"  v-model="userInfo.phoneno" auto-complete="off"></el-input>
							</el-form-item>  
							<el-form-item label="手机号码" prop="phoneno" :rules="[{required:true,message:'手机号码不能为空'}]">
								<el-input style="width:400px;"  v-model="phonenoForm.phoneno" auto-complete="off"></el-input>
							</el-form-item>  
							<el-form-item label="验证码" prop="smsCode" :rules="[{required:true,message:'短信验证码不能为空'}]">
								<el-input style="width:400px;" v-model="phonenoForm.smsCode" auto-complete="off"></el-input>&nbsp;&nbsp;<el-button @click="sendPhonenoSmsCode('userPhoneno')" :disabled="smsCodeTime>0">发送短信验证码{{smsCodeTime>0?'('+smsCodeTime+'秒)':''}}</el-button>
							</el-form-item> 
							<el-form-item>
								<el-button style="margin-left: 80px" type="primary" @click.native="changePhoneno" :loading="setLoading">提交</el-button>  
							</el-form-item> 
						</el-form-item>
					</el-form>
				</div> 
			</div>
			<div class="m_opercard">
				<div class="m_base">
					<h3 v-if="!userInfo.email">绑定邮箱</h3>
					<h3 v-else>更换邮箱</h3>
					<el-form class="m_f m_from1" :model="editForm"  label-width="120px" ref="editForm2"> 
						<el-form-item label="邮箱" prop="email" :rules="[{required:true,message:'邮箱不能为空'},{validator:validateEmail}]">
							<el-input style="width:400px;" v-model="editForm.email" auto-complete="off"></el-input> 
							<el-button type="text" @click="registerEmail" v-if="!userInfo.email">绑定邮箱</el-button>
							<el-button type="text" @click="changeEmail" v-if="userInfo.email">更换邮箱</el-button>
						</el-form-item>     
 					</el-form>
				</div> 
			</div>
		</div>
		<mdp-dialog ref="imageDialog">
			<template v-slot="{visible,data,dialog}">
				<mdp-select-image :multiple="false" @select="(imgs)=>{if(imgs)headimgurl=imgs[0].url;dialog.close()}"></mdp-select-image>
			</template>
		</mdp-dialog>  
	  
        
        <el-dialog
          title="请选择一个账户进行登录"
          :visible.sync="phonenoUsersVisible"
          width="600" append-to-body> 
          <el-table :data="phonenoUsers"> 
            <el-table-column prop="displayUserid" label="登录账号">
            </el-table-column>
            <el-table-column prop="username" label="姓名">
            </el-table-column> 
            <el-table-column prop="branchName" label="企业">
            </el-table-column>
            <el-table-column  label="操作">
					<template slot-scope="scope"> 
						<el-button type="primary" @click="setDefaultLoginUser(scope.row)">默认账户</el-button> 
						<el-button type="primary" @click="toLogin(scope.row)">登录</el-button> 
					</template>
            </el-table-column>
          </el-table>
        </el-dialog> 
	</div>  
</template>

<script>

import { sendSmsCode } from '@/api/sms/sms';
 import { mapGetters } from 'vuex' 
import { sendEmail,validEmailCode,queryMyUsers,switchUser,updatePhoneno,setDefaultLoginUser } from '@/api/login'; 
 
import {  setToken,removeCacheUserInfo} from '@/utils/auth'
import md5 from "js-md5";

	export default {
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['user'],
		watch: {
	      'user':function(data) {
	        this.editForm=data;
	      },
		  'headimgurl':function(val){
			this.$mdp.editHeadimgurl({userid:this.userInfo.userid,headimgurl:val}).then(res=>{
				  var tips = res.data.tips
				  if(tips.isOk){
					  this.$notify({ message: "修改头像成功，重新登录起效", type: 'success'}); 
					  this.editForm.headimgurl=val
				  }else{
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				  }
			  })
		  }
	    },
		data() {
			var validatePhoneno = (rule, value, callback) => {
				if (!value) {
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
				if (value=='') {
					callback();
				} else {
				if (value !== '') {
					var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
					if(!reg.test(value)){
						 callback(new Error('邮箱格式不正确'));
					}  
				}
				callback();
				}
			};
			
			var validateIdCardNo = (rule, value, callback) => {
				if (value === ''|| value==null) {
				//callback(nPhonenoew Error('请输入密码'));
					callback();
				}else {
					if (value !== '' && value.length>15) {
						var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
						if(!reg.test(value)){
							callback(new Error('身份证号码格式不正确'));
						}else{
							callback();
						}
					}else if(value !== '' && value.length<15){
						callback(new Error('请输入15位或者18位长度身份证号码'));
					}else{
						callback();
					}
				
				}
			}; 
			return {
				load:{list:false},
				validateEmail:validateEmail,
				uploadHeadimgVisible:false,
				changePasswordVisible:false,
				options:{},//下拉选择框的所有静态数据
				editLoading: false,
				setLoading: false, 
				editFormRules: {
					displayUserid: [
						{ required: true, message: '账号必填', trigger: 'blur' }
					],
					username: [
						{ required: true, message: '用户名称必填', trigger: 'blur' }
					]
				},
				//编辑界面数据  User sys_user
				editForm: {
					unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',fingerpassword1:'',fingerpassword2:'',fingerpassword3:'',fingerpassword4:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',userid:'',userAccount:'',userPwd:'',userName:'',userDesc:'',officePhoneno:'',idCardNo:'',email:''
				},
				passwordForm:{
					newPassword:'',oldPassword:''
				},
				phonenoForm:{
					phoneno:'',smsCode:''
				},
 				valiCode:'',//验证码
				showPanel:'',//bindMainAccount
				phonenoUsers:[],
				phonenoUsersVisible:false,
				headimgurl:'',
				currDomainUrl:'',
				smsCodeTime:0,
				timeWrap:0,
				scanCodeForm: {
					joinUserid:'',sendBranchId:'',sendUserid:'',inviteId:'',sendBranchName:'',sendUsername:'',sendTime:'',inviteState:'',inviteScene:'',inviteType:'',objType:'',joinUsername:''
				},
			}
		},
		methods: {
			initScanCode(){
				if(!this.userInfo || !this.userInfo.userid){
					return;
				}
				this.load.list=true;
 				this.$mdp.createInviteId({inviteScene:'2',inviteType:'1',joinUserid:this.userInfo.userid,joinUsername:this.userInfo.username}).then(res=>{
 					var tips = res.data.tips
					 this.load.list=false;
					if(tips.isOk){
						this.scanCodeForm=Object.assign({},res.data.data)
						this.weixinLogin();
					}else{
						this.$notify.error(tips.msg);
					}
					
				})
			},
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//编辑提交User sys_user父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true; 
							let params = Object.assign({}, this.editForm); 
							this.$mdp.editUser(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){ 
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.editLoading = false;
							});
						});
					}
				});
			},
			changePhoneno(){
				if(!this.phonenoForm.phoneno){
					this.$notify({ message: "请输入手机号码", type: 'error' }); 
					return;
				}
				updatePhoneno(this.phonenoForm).then(res=>{
					var tips = res.data.tips;
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
			},
			doChangePassword(){ 
				this.$refs.passwordForm.validate((valid) => {
					if (valid) {
						this.setLoading = true
						this.$mdp.changePassword({oldPassword:md5(this.passwordForm.oldPassword),newPassword:md5(this.passwordForm.newPassword)}).then(res=>{
							var tips = res.data.tips;
							this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						}).finally(r => this.setLoading = false)
					}else{
						this.$notify({ message: "新旧密码检验不通过", type: 'error' }); 
					}
				})
			},
			registerPhoneno(){
				if(!this.phonenoForm.phoneno){
					this.$notify({ message: "请输入手机号码", type: 'error' }); 
					return;
				}
				updatePhoneno(this.phonenoForm).then(res=>{
					var tips = res.data.tips;
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
			}, 
			upgradeToBranchAccount(){
				var page="/my/order/index"
 				if(this.$mdp.getSysContext().indexOf(process.env.CONTEXT)>=0){
					this.$router.push(page)
				}else{
					var curlDomain=window.location.protocol+"//"+window.location.host+this.$mdp.getSysContext()+"/"+process.env.VERSION;  
					this.$mdp.openWin(curlDomain+page)
				}
 			}, 
			registerEmail(){
				if(this.editForm.email){
					var curlDomain=window.location.protocol+"//"+window.location.host+"/"+this.$mdp.getSysContext()+"/"+process.env.VERSION;  
					sendEmail({codeScene:'1',codeEmail:this.editForm.email,userType:'staff',callbackUri:curlDomain+'/#/updateUserInfo'}).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.$notify({ message: "邮件已发送，请到收件箱收取邮件，并点击其链接进行自动验证。", type: 'success' }); 
						}else{
							this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						}
						
					})
				}else{
					this.$notify({ message: "请输入邮箱号码", type: 'error' }); 
				}
			},
			changeEmail(){
				if(this.editForm.email){
					
					var curlDomain=window.location.protocol+"//"+window.location.host+"/"+this.$mdp.getSysContext()+"/"+process.env.VERSION;  
					sendEmail({codeScene:'2',codeEmail:this.editForm.email,userType:'staff',callbackUri:curlDomain+'/#/changeEmailStepOne'}).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.$notify({ message: "邮件已发送，请到收件箱收取邮件，并点击其链接进行验证原邮箱。", type: 'success' }); 
						}else{
							this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						}
					})
				}else{ 
					this.$notify({ message: "请输入邮箱号码", type: 'error' }); 
				}
			},
			validEmailCode(){ 
				validEmailCode({valiCode:this.valiCode,userType:'staff'}).then(res=>{
					var tips = res.data.tips;
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}) 
			},
			switchUser(){   
				queryMyUsers().then(res0=>{  
					if(res0.data.tips.isOk){
						this.phonenoUsers=res0.data.data; 
						if(res0.data.data.length<=1){
							this.$notify.warning("当前没有关联的账户，无须切换");
						}else{
							this.phonenoUsersVisible=true;
						}
					}else{
						this.$notify.error(res0.data.tips.msg);
					}
				})
			},
			
        
			sendPhonenoSmsCode(scene){
				if(!this.phonenoForm.phoneno){
					this.$notify({ message: "请输入手机号码", type: 'error' }); 
					return;
				}
				var params={
					phoneno:this.phonenoForm.phoneno,
					scene:scene
				}
				sendSmsCode(params).then(res=>{
					if(res.data.tips.isOk){
						this.$notify.success("发送成功");
						this.smsCodeTime=60;
						if (this.smsCodeTime > 0) { 
							this.timeWrap = setInterval(() => {
								this.smsCodeTime -= 1
							}, 1000)
						}
					}else{
						this.$notify.error(res.data.tips.msg);
					}
				})
			},
			setDefaultLoginUser(user){
				setDefaultLoginUser({userid:user.userid})
			},
			toLogin(user) {
				 
				let params={ 
					password:md5('nopassword'),  
					userloginid:user.userid,
					authType:'switch_user_by_token' ,
					grantType:"password"
				} 
				//userloginid, password,grantType,authType,deptid,userid
				switchUser(params.userloginid,params.password,params.grantType,params.authType,'',params.userloginid).then(res => {
					this.phonenoUsersVisible=false;
					if(res.data.tips.isOk==true){  
						setToken( res.data.data.accessToken.tokenValue)
						removeCacheUserInfo();
						this.$store.dispatch('GetUserInfo').then((res2)=>{  
							this.$router.push({ path: '/' });
						}).catch(err=>{
								
						}); 
					}else{
						this.$notify.error(res.data.tips.msg);
					} 
				}).catch((e) => {
						
				})  
			},
			afterAddSubmit(){

			},
			weixinLogin(){
				var curlDomain=window.location.protocol+"//"+window.location.host; //  
 				var mdpRedirectUri=	`${curlDomain}/${process.env.CONTEXT}/${process.env.VERSION}/` 
				var tpaContext=this.$mdp.getTpaContext();
				var domain=this.$mdp.getFixedDomain();
				var appType=this.$mdp.getWxpubConfig().appType;
				var scope=this.$mdp.getWxpubConfig().scope
				var state=this.scanCodeForm.inviteId
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
			},
		},
		components: {   
		},
		mounted() { 


			this.editForm=Object.assign(this.editForm, this.userInfo); 
			var valiCode=this.$route.query.valiCode;
			this.currDomainUrl=this.$mdp.getBaseDomainUrl()
			//var valiCode=util.getQueryStringByName('valiCode'); 
			if(valiCode){
				this.valiCode=valiCode;
				this.validEmailCode();
			}
			this.initScanCode();

			var s1 = document.createElement('script');
			s1.type = 'text/javascript';
			s1.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
			document.body.appendChild(s1); 
		}
	}

</script>

<style lang="scss" scoped>
@import './index.scss';
@import '../common.scss';
</style>