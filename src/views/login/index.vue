<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
 
      <div class="title-container">
        <div class="logo">
          <img src="../../assets/image/logo1.png" alt="" />  
          <div class="logo-text"> 
            <div class="main-title">{{$t('login.title')}}</div> 
          </div> 
        </div> 
        <lang-select class="set-language"></lang-select>
      </div>
      <el-form-item prop="authType">  
          <el-radio-group v-model="loginForm.authType">
            <el-radio label="password_display_userid">账户密码登录</el-radio>
            <el-radio label="sms">短信验证码快速登录</el-radio> 
          </el-radio-group>
      </el-form-item>
      <el-form-item prop="displayUserid" v-show="loginForm.authType=='password_display_userid'"> 
        <el-input name="displayUserid" type="text" v-model="loginForm.displayUserid" autoComplete="on" placeholder="用户编号" >
          <template slot="prepend">账号</template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password" v-show="loginForm.authType=='password_display_userid'"> 
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password">
          <template slot="prepend">密码</template>
          <span slot="append" class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-input>
      </el-form-item>
      <el-form-item prop="phoneno" v-show="loginForm.authType=='sms'"> 
        <el-input name="phoneno" type="text" v-model="loginForm.phoneno" autoComplete="on" placeholder="手机号码">
          <template slot="prepend">手机号码&nbsp;&nbsp;&nbsp;</template>
          <el-button slot="append" @click.prevent="sendPhonenoSmsCode">发送验证码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="smsCode" v-show="loginForm.authType=='sms'"> 
        <el-input name="smsCode" type="text" v-model="loginForm.smsCode" autoComplete="on" placeholder="短信验证码">
          <template slot="prepend">短信验证码</template>
          <template slot="append">六位验证码</template>
        </el-input>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
      <el-row> 
          <el-button type="success" plain round @click="showRegisterDialog=true">新用户注册</el-button> 
          <el-button type="warning" plain round @click="showResetPasswordDialog=true">忘记密码</el-button>  
          <el-button type="primary" plain round @click="showTpLoginDialog=true">{{$t('login.thirdparty')}}</el-button> 
      </el-row> 
    </el-form>
	<el-dialog
	  title="请选择一个部门进行登陆"
	  :visible.sync="deptSelectVisible"
	  width="screenWidth<500?'90%':'500px" append-to-body> 
	  <el-row class="app-container">
	  	<el-col :span=20   v-for="(d,index) in myDepts" :key="index">
		  <el-col :span=20><el-radio v-model="userDeptid" :label="d.deptid">{{d.deptName}}({{d.branchName}})   </el-radio> </el-col> 
		</el-col> 
	  </el-row >
	  <el-row class="app-container" style="text-align:right;">
		<el-col :span=20 >
			<el-button @click="deptSelectVisible = false">取 消</el-button>
   			<el-button type="primary" @click="deptChecked">确 定</el-button>
   		</el-col>
	  </el-row >
	</el-dialog> 
	
	<!-- 第三方登陆窗口 -->
    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showTpLoginDialog" append-to-body>
      {{$t('login.thirdpartyTips')}}
      <br/>
      <br/>
      <br/>
      <social-sign />
    </el-dialog>
    	<!-- 注册窗口 -->
    <el-dialog title="新用户注册" :visible.sync="showRegisterDialog" append-to-body>  
      <register />
    </el-dialog>
    	<!-- 重置密码窗口 -->
    <el-dialog title="重置密码" :visible.sync="showResetPasswordDialog" append-to-body>  
      <reset-password />
    </el-dialog>
	<!--新增 Branch 管理端机构表（机构下面若干部门）界面-->
	<el-dialog title="新增机构" :visible.sync="addBranchFormVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
		<branch-add  :visible="addBranchFormVisible" @cancel="addBranchFormVisible=false" @submit="afterAddBranchSubmit"></branch-add>
	</el-dialog> 
  </div>
</template>

<script> 
import { sendSmsCode } from '@/api/sms/sms';
import LangSelect from '@/components/LangSelect';
import SocialSign from './socialsignin';
import Register from './register';
import ResetPassword from './resetPassword';

import BranchAdd from './BranchAdd';
import { mapGetters } from 'vuex'; 
import md5 from 'js-md5';

export default {
  components: { LangSelect, SocialSign, BranchAdd,Register,ResetPassword},
  name: 'login',
  data() {
    const validateDisplayUserid = (rule, value, callback) => {
      if (this.loginForm.authType=='password_display_userid') {
        if(value.length<=6){
          callback(new Error('请输入6位以上用户账号'))
        }else{
          callback()
        } 
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (this.loginForm.authType=='password_display_userid') {
        if(value.length<6){
          callback(new Error('密码最少为六位'))
        }else{
          callback()
        } 
      } else {
        callback()
      } 
    }
    const validatePhoneno = (rule, value, callback) => {
      if (this.loginForm.authType=='sms') {
        if(value.length !=11 ){
          callback(new Error('手机号码必须为11位号码'))
        }else{
          callback()
        } 
      } else {
        callback()
      }  
    }
    const validateSmsCode = (rule, value, callback) => {
      if (this.loginForm.authType=='sms') {
        if(value.length !=6 ){
          callback(new Error('请输入6位短信验证码'))
        }else{
          callback()
        } 
      } else {
        callback()
      } 
    }
    return {
      loginForm: {
        displayUserid: '',
        password: '',
        authType:'password_display_userid',//password/sms/password_display_userid 分别为账户密码、短信验证码快捷登录
        phoneno:'',//手机号码
        smsCode:'',//短信验证码
      },
      loginRules: {
        displayUserid: [{ required: true, trigger: 'blur', validator: validateDisplayUserid }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        phoneno: [{ required: true, trigger: 'blur', validator: validatePhoneno }],
        smsCode: [{ required: true, trigger: 'blur', validator: validateSmsCode }],
      }, 
      passwordType: 'password',
      
      loading: false,
      showResetPasswordDialog:false,//显示忘记密码重置密码窗口
      showTpLoginDialog: false, //显示第三方登陆对话框
      showRegisterDialog: false,//显示注册窗口
	    deptSelectVisible:false,//显示选择部门对话框
	    userDeptid:'',//选中的部门编号 
	    addBranchFormVisible:false,  //显示添加机构对话框 
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    sendPhonenoSmsCode(){
      var params={
        phoneno:this.loginForm.phoneno,
        scene:"login"
      }
      sendSmsCode(params).then(res=>{
        if(res.data.tips.isOk){
          this.$message.info(res.data.tips.msg);
        }else{
          this.$message.error(res.data.tips.msg);
        }
      })
    },
    handleLogin() {

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params={
        		  displayUserid:this.loginForm.displayUserid,
              password:md5(this.loginForm.password),
              deptid:this.userDeptid,
              authType:this.loginForm.authType,
              phoneno:this.loginForm.phoneno,
              smsCode:this.loginForm.smsCode
          }
          var loginParams={ }
          if(params.authType=='password_display_userid'){
            loginParams.userloginid=params.displayUserid
            loginParams.password=params.password
            loginParams.grantType="password"
            loginParams.authType='password_display_userid' 
            loginParams.deptid=params.deptid
          }else if(params.authType=='sms'){
            loginParams.userloginid=params.phoneno
            loginParams.password=params.smsCode
            loginParams.grantType="password"
            loginParams.authType="sms"
            loginParams.deptid=params.deptid
          }
          this.$store.dispatch("LoginByUserloginid",loginParams).then(res => {
        	  this.loading = false
            if(res.data.tips.isOk==true){
            	console.log(this.$store);
            	 this.loading = true;
                this.$store.dispatch('GetUserInfo').then((res2)=>{
                	//this.userDeptid=res2.data.userInfo.deptid
                	this.loading = false
                	if(res2.data.tips.isOk==true){
                		    if(this.$store.state.user.myBranchs==null ||this.$store.state.user.myBranchs.length==0||this.$store.state.user.myDepts==null || this.$store.state.user.myDepts.length<=0){ 
                        //if(1==1){
                        	//this.$message.error("亲，您不在任何一个公司或者部门中，需要【先创建公司】\n 或者请【管理员加您进入公司】哦"); 
                        	this.addBranchFormVisible=true;
                        }else if(this.$store.state.user.myDepts.length>1 ){
                        	//this.$message.info("亲，您在多个部门中任职，我分不清您要登陆哪个部门，请选择一个部门登陆吧"); 
                          if( !this.userDeptid ){
                            this.userDeptid=res2.data.userInfo.deptid 
                            this.deptSelectVisible=true; 
                          }else{
                        	  this.rolesChecked();
                          }
                        	//this.$router.push({ path: 'mdp/sys/branch/BranchAdd' })
                        }else if(this.$store.state.user.myDepts.length==1){
                        	//进行角色身份验证
                          this.userDeptid=res2.data.userInfo.deptid
                        	this.rolesChecked();
                        }else{
                          this.rolesChecked();

                        }
                	}else{
                		this.$message.error(res2.data.tips.msg);
                	}
                	
                }).catch(err=>{
                	console.log(err); 
                	this.loading = false
                }); 
            }else{
            	this.$message.error(res.data.tips.msg);
            } 
          }).catch((e) => {
        	  console.log(e);
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deptChecked() {
    	if( !this.userDeptid){
    		this.$message.error("请选择登陆的部门")
    		return
    	}
    	
    	let depts=this.myDepts.filter(d=>d.deptid==this.userDeptid)   
    	if(this.$store.state.user.userInfo.deptid!=this.userDeptid){
        	this.handleLogin();
          return;
    	}else{
    		this.rolesChecked();
    	}

    },
    //角色身份验证
    rolesChecked(){ 
    	if(this.userInfo.isSuperAdmin){ 
    			this.$router.push({ path: '/' });
    			this.$message.info("欢迎登陆，超级管理员"); 
	  	}else if(this.userInfo.isPlatformAdmin){ 
			this.$router.push({ path: '/' });
			this.$message.info("欢迎登陆，平台管理员"); 
  		}else{
  			this.$router.push({ path: '/' }); 
  			this.$message.info("欢迎登陆"); 
	  	}
    },   
    
    afterAddBranchSubmit(branch){
    	this.addBranchFormVisible=false;
      this.handleLogin();
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  computed: {
    ...mapGetters([
      'myBranchs','myDepts','userInfo','roles'
    ]),
    
			screenWidth:function(){
				return screen.width;
			},
  }
}
</script>
 

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#ef1010;

.login-container { 
  position:absolute;
  height: 100%;
  width: 100%;
  background-color: $bg;
  background-size: 100%;
  background:url(../../assets/image/yxin_login_backgroup_pc.png) center center;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    max-width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 180px auto;
    border-radius: 20px; 
  	background-color:#f5f7faee;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: rgb(95, 41, 221);
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  .register-button {
    position: absolute; 
    bottom: 28px;
  }
}
.logo {
  height: 100px;
  width: 100%;
  // padding: 0 20px;
  display: flex;
  align-items: left;
  justify-content: center;
  img {
    height: 100%;
  }
  .logo-text {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $light_gray; 
    .main-title {
      font-size: 35px;
      font-weight: 400;
      color: $light_gray; 
      text-align: center;
      font-weight: bold;
    } 
  }
}
</style>