<template>
  <div>
    <div class="login_form">
        <el-form  autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
          

            <el-form-item prop="displayUserid"  title="登录账号"> 
                <el-input  class="inp" name="displayUserid" type="text" v-model="loginForm.displayUserid" autoComplete="on" placeholder="登录账号" >
                </el-input>
            </el-form-item>

            <el-form-item prop="password"  title="登录密码"> 
                <el-input class="inp" show-password  name="password" :type="passwordType" v-model="loginForm.password" autoComplete="on" placeholder="密码">
                </el-input>
            </el-form-item>

            
            <el-form-item prop="username"  title="用户名称"> 
                <el-input class="inp" name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名称" >
                </el-input>
            </el-form-item>
            
            <el-form-item prop="phoneno" title="手机号码"> 
                <el-input class="inp" name="phoneno" type="text" v-model="loginForm.phoneno" autoComplete="on" placeholder="手机号码"> 
                </el-input>
            </el-form-item>

            <el-form-item prop="smsCode" title="短信验证码"> 
                <el-input class="inp smsCode" name="smsCode" type="text" v-model="loginForm.smsCode" autoComplete="on" placeholder="短信验证码">
                </el-input>
                <el-button class="sendCode" @click.prevent="sendPhonenoSmsCode"><span class="text">发送验证码</span></el-button> 
              <span v-if="phonenoUsers!=null && phonenoUsers.length>0"> 该手机号已注册有{{phonenoUsers.length}}个账户<font color="blue"></font>
                <el-button type="text"  @click="phonenoUsersVisible=true">查看明细</el-button>
              </span>
            </el-form-item>


            <el-button class="register" :loading="loading" @click.native.prevent="handleRegister">
                <span class="text">注 册</span>
            </el-button>




        </el-form>
        
        <el-dialog
          title="查看已有账户"
          :visible.sync="phonenoUsersVisible"
          width="600" append-to-body> 
          <el-table :data="phonenoUsers">
            <el-table-column prop="userid" label="编号">
            </el-table-column> 
            <el-table-column prop="displayUserid" label="登录账号">
            </el-table-column>
            <el-table-column prop="username" label="姓名">
            </el-table-column>
            
            <el-table-column prop="branchName" label="企业">
            </el-table-column>
          </el-table>
        </el-dialog> 
    </div>
  </div>

  
</template>

<script>
import { sendSmsCode } from '@/api/sms/sms';
import { checkPhoneno,checkDisplayUserid,doRegister,queryByUserloginid } from '@/api/login';
import LangSelect from '@/components/LangSelect';
import SocialSign from '../socialsignin';
import BranchAdd from '../BranchAdd';
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
      phonenoUsers:[],
      phonenoUsersVisible:false,
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
        this.$notify.error("手机号码不能为空");
        return;
      }
      if(this.loginForm.phoneno.length !=11 ){
        this.$notify.error("手机号码必须为11位");
        return;
      }
      var params={
        phoneno:this.loginForm.phoneno,
        scene:"register"
      } 
      queryByUserloginid({userloginid:this.loginForm.phoneno,idType:"phoneno"}).then(res0=>{  
        if(res0.data.tips.isOk){
          this.phonenoUsers=res0.data.data; 
          sendSmsCode(params).then(res=>{
            if(res.data.tips.isOk){
              this.$notify.success("发送成功");
            }else{
              this.$notify.error(res.data.tips.msg);
            }
          })
        }else{
          this.$notify.error(res0.data.tips.msg);
        }
      })
      
    },
    checkDisplayUserid(){
      if(!this.loginForm.displayUserid){
        this.$notify.error("账号不能为空");
        return;
      }
      checkDisplayUserid(this.loginForm.displayUserid).then(res0=>{
        if(res0.data.tips.isOk){
           this.$notify.success("该账户可以注册");
        }else{
          this.$notify.error("该账户已存在，不允许再注册！");
        }
      })
      
    },
    
    getQueryVariable(variable,url){
      var query =url;
      if(url==null || url==undefined || url==''){
        query=window.location.href;

      }
      //alert(query);
      var query2=query.split("?");
      if(query2.length>1){
        query=query2[1];
      }else{
        query=""
        return null;
      }

          var vars = query.split("&");
          for (var i=0;i<vars.length;i++) {
                  var pair = vars[i].split("=");
                  if(pair[0] == variable){return pair[1];}
          }
          return null;
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
          var branchId=this.getQueryVariable("branchId")
          if(branchId){
            params.branchId=branchId
          }
          doRegister(params).then(res=>{
            this.loading = false  
            if(res.data.tips.isOk){
              this.$notify.success(res.data.tips.msg);
            }else{
              this.$notify.error(res.data.tips.msg);
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
    		this.$notify.error("请选择登陆的部门")
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
    			this.$notify.info("欢迎登陆，超级管理员"); 
	  	}else if(this.userInfo.isPlatformAdmin){ 
			this.$router.push({ path: '/' });
			this.$notify.info("欢迎登陆，平台管理员"); 
  		}else{
  			this.$router.push({ path: '/' }); 
  			this.$notify.info("欢迎登陆"); 
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


<style lang="scss" scoped>
@import '../index.scss';
</style>