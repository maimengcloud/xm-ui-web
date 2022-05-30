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
        
        <span v-if="phonenoUsers!=null && phonenoUsers.length>0"> 该手机号有{{phonenoUsers.length}}个账户,请选择需要重置密码的账户<font color="blue"></font>
        <br>
         <el-tag v-if="selectUser && selectUser.userid">已选择：{{selectUser.username}}</el-tag> <el-button type="text"  @click="phonenoUsersVisible=true">选择账户</el-button>
        </span>
      </el-form-item>
      <el-form-item prop="smsCode"  label="短信验证码"> 
        <el-input name="smsCode" type="text" v-model="loginForm.smsCode" autoComplete="on" placeholder="短信验证码">
           <template slot="append">六位验证码</template>
        </el-input>
      </el-form-item>  
      <el-form-item prop="password"  label="新密码"> 
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password">
           <span slot="append" class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-input>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleResetPasswordByPhoneno">重置密码</el-button> 
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
       <el-table-column label="操作">
         <template slot-scope="scope">
         <el-button type="primary" @click="onUserSelect(scope.row)">选中</el-button>
         </template>
       </el-table-column>
     </el-table>
	</el-dialog> 
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
import { checkPhoneno,resetPasswordByPhoneno,queryByUserloginid } from '@/api/login';

import LangSelect from '@/components/LangSelect';
import SocialSign from './socialsignin';
import BranchAdd from './BranchAdd';
import { mapGetters } from 'vuex'; 
import md5 from 'js-md5'; 

export default {
  components: { LangSelect, SocialSign, BranchAdd },
  name: 'login',
  data() { 
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
    return {
      loginForm: {  
        password: '',
        phoneno:'',//手机号码
        smsCode:'',//短信验证码
      },
      loginRules: { 
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
      phonenoUsersVisible:false,
      phonenoUsers:[],
      selectUser:null,//选中的账户
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
        scene:"changePassword"
      } 
       queryByUserloginid({userloginid:this.loginForm.phoneno,idType:"phoneno"}).then(res0=>{
          if(res0.data.tips.isOk){ 
            this.phonenoUsers=res0.data.data; 
            sendSmsCode(params).then(res=>{
              if(res.data.tips.isOk){
                this.$notify.success(res.data.tips.msg);
              }else{
                this.$notify.error(res.data.tips.msg);
              }
            })  
          }
        })  
    }, 
    
    handleResetPasswordByPhoneno() {
     
      this.$refs.loginForm.validate(valid => {
        if (valid) { 
          let params={
              newPassword:md5(this.loginForm.password),
              phoneno:this.loginForm.phoneno,
              smsCode:this.loginForm.smsCode
          } 
          if(this.phonenoUsers && this.phonenoUsers.length>0){
            if(!this.selectUser || !this.selectUser.userid){
              
              if(this.phonenoUsers.length==1){
                this.selectUser=this.phonenoUsers[0]
              }else{
                this.$notify({position:'bottom-left',showClose:true,message:'请选一个账户进行重置密码',type:'warning'})
                return;
              }
              
            }
          }
          if(this.selectUser && this.selectUser.userid){
             params.userid=this.selectUser.userid
          } 
           this.loading = true 
          resetPasswordByPhoneno(params).then(res=>{
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
    },
    onUserSelect(user){
      this.selectUser=user
      this.phonenoUsersVisible=false; 
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