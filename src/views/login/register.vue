<template>
  <div>
    <el-form  autoComplete="on" label-width="120px" :model="loginForm" :rules="loginRules" ref="loginForm"> 
      <div>
        <div class="logo">
          <img src="../../assets/image/logo1.png" alt="" />  
          <div class="logo-text"> 
            <div class="systemName">{{$t('login.title')}}</div> 
          </div> 
        </div>  
      </div>  
      <el-form-item prop="phoneno" label="手机号码"> 
        <el-input name="phoneno" type="text" v-model="loginForm.phoneno" autoComplete="on" placeholder="手机号码"> 
          <el-button slot="append" @click.prevent="sendPhonenoSmsCode">发送验证码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="smsCode"  label="短信验证码"> 
        <el-input name="smsCode" type="text" v-model="loginForm.smsCode" autoComplete="on" placeholder="短信验证码">
           <template slot="append">六位验证码</template>
        </el-input>
      </el-form-item> 
      <el-form-item prop="username"  label="用户名称"> 
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名称" >
         </el-input>
      </el-form-item>
      <el-form-item prop="displayUserid"  label="账号"> 
        <el-input name="displayUserid" type="text" v-model="loginForm.displayUserid" autoComplete="on" placeholder="用户编号" >
           <el-button slot="append" @click.prevent="checkDisplayUserid">检测是否已注册</el-button> 
        </el-input>
      </el-form-item>

      <el-form-item prop="password"  label="密码"> 
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password">
           <span slot="append" class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-input>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleRegister">注册</el-button> 
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
    
	<!--新增 Branch 管理端机构表（机构下面若干部门）界面-->
	<el-dialog title="新增机构" :visible.sync="addBranchFormVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
		<branch-add  :visible="addBranchFormVisible" @cancel="addBranchFormVisible=false" @submit="afterAddBranchSubmit"></branch-add>
	</el-dialog> 
  </div>
</template>

<script> 
import { sendSmsCode } from '@/api/sms/sms';
import { checkPhoneno,checkDisplayUserid,doRegister } from '@/api/login';

import LangSelect from '@/components/LangSelect';
import SocialSign from './socialsignin';
import BranchAdd from './BranchAdd';
import { mapGetters } from 'vuex'; 
import md5 from 'js-md5';

export default {
  components: { LangSelect, SocialSign, BranchAdd },
  name: 'login',
  data() {
    const validateDisplayUserid = (rule, value, callback) => { 
        if( !value || value.length<=6){
          callback(new Error('请输入6位以上用户账号'))
        }else{
          callback()
        }  
    }
    const validatePassword = (rule, value, callback) => { 
        if( !value || value.length<6){
          callback(new Error('密码最少为六位'))
        }else{
          callback()
        }  
    }
    const validatePhoneno = (rule, value, callback) => { 
        if( !value || value.length !=11 ){
          callback(new Error('手机号码必须为11位号码'))
        }else{
          callback()
        }  
    }
    const validateSmsCode = (rule, value, callback) => { 
        if( !value || value.length !=6 ){
          callback(new Error('请输入6位短信验证码'))
        }else{
          callback()
        }  
    }
    const validateUsername = (rule, value, callback) => { 
        if( !value || value.length <2 ){
          callback(new Error('请输入用户名称'))
        }else{
          callback()
        }  
    }
    return {
      loginForm: {
        username:'', 
        displayUserid: '',
        password: '',
        authType:'password_display_userid',//password/sms/password_display_userid 分别为账户密码、短信验证码快捷登录
        phoneno:'',//手机号码
        smsCode:'',//短信验证码
      },
      loginRules: {
        
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        displayUserid: [{ required: true, trigger: 'blur', validator: validateDisplayUserid }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        phoneno: [{ required: true, trigger: 'blur', validator: validatePhoneno }],
        smsCode: [{ required: true, trigger: 'blur', validator: validateSmsCode }],
      }, 
      passwordType: 'password',
      
      loading: false,
      showTpLoginDialog: false, //显示第三方登陆对话框
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
      if(!this.loginForm.phoneno){
        this.$message.error("手机号码不能为空");
        return;
      }
      if(this.loginForm.phoneno.length !=11 ){
        this.$message.error("手机号码必须为11位");
        return;
      }
      var params={
        phoneno:this.loginForm.phoneno,
        scene:"register"
      } 
      checkPhoneno(this.loginForm.phoneno).then(res0=>{
        if(res0.data.tips.isOk){
          sendSmsCode(params).then(res=>{
            if(res.data.tips.isOk){
              this.$message.success(res.data.tips.msg);
            }else{
              this.$message.error(res.data.tips.msg);
            }
          })
        }else{
          this.$message.error("手机号码已存在，不允许注册，请直接登录");
        }
      })
      
    },
    checkDisplayUserid(){
      if(!this.loginForm.displayUserid){
        this.$message.error("账号不能为空");
        return;
      }
      checkDisplayUserid(this.loginForm.displayUserid).then(res0=>{
        if(res0.data.tips.isOk){
           this.$message.success("该账户可以注册");
        }else{
          this.$message.error("该账户已存在，不允许再注册！");
        }
      })
      
    },
    
    handleRegister() {
      this.loading = true 
      this.$refs.loginForm.validate(valid => {
        if (valid) { 
          let params={
        		  displayUserid:this.loginForm.displayUserid,
              password:md5(this.loginForm.password),
              deptid:this.userDeptid,
              phoneno:this.loginForm.phoneno,
              smsCode:this.loginForm.smsCode,
              username:this.loginForm.username,
          } 
          doRegister(params).then(res=>{
            this.loading = false  
            if(res.data.tips.isOk){
              this.$message.success(res.data.tips.msg);
            }else{
              this.$message.error(res.data.tips.msg);
            }
          })
        } else {
            this.loading = false  
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
    	this.loading=true
        this.$store.dispatch('GetUserInfo').then((res)=>{
        	this.userDeptid=res.data.userInfo.deptid 
        	this.loading = false;
        	//角色身份验证
    		this.rolesChecked();
        }); 
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
    .systemName {
      font-size: 35px;
      font-weight: 400;
      color: $light_gray; 
      text-align: center;
      font-weight: bold;
    } 
  }
}
</style>