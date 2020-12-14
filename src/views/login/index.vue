<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
        <lang-select class="set-language"></lang-select>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text"   v-model="loginForm.username" autoComplete="on" placeholder="用户编号" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>

      <div class="tips">
        <span> </span>
        <span> </span>
      </div>
      <div class="tips">
        <span style="margin-right:18px;"> </span>
        <span> </span>
      </div>

      <el-button class="thirdparty-button" type="primary" @click="showTpLoginDialog=true">{{$t('login.thirdparty')}}</el-button>
    </el-form>
	<el-dialog
	  title="请选择一个部门进行登陆"
	  :visible.sync="deptSelectVisible"
	  :width="screenWidth<500?'90%':'500px'" append-to-body> 
	  <el-row class="app-container">
	  	<el-col :span=20   v-for="d in myDepts">
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
import { isvalidUsername } from '@/utils/validate';
import LangSelect from '@/components/LangSelect';
import SocialSign from './socialsignin';
import BranchAdd from './BranchAdd';
import { mapGetters } from 'vuex'; 
import md5 from 'js-md5';

export default {
  components: { LangSelect, SocialSign, BranchAdd },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码必须大于六位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params={
        		  username:this.loginForm.username,
        		  password:md5(this.loginForm.password)
          }
          this.$store.dispatch('LoginByUsername',params).then(res => {
        	  this.loading = false
            if(res.data.tips.isOk==true){
            	console.log(this.$store);
            	 this.loading = true;
                this.$store.dispatch('GetUserInfo').then((res2)=>{
                	this.userDeptid=res2.data.userInfo.deptid
                	this.loading = false
                	if(res2.data.tips.isOk==true){
                		if(this.$store.state.user.myBranchs==null ||this.$store.state.user.myBranchs.length==0||this.$store.state.user.myDepts==null || this.$store.state.user.myDepts.length<=0){ 
                        	//this.$message.error("亲，您不在任何一个公司或者部门中，需要【先创建公司】\n 或者请【管理员加您进入公司】哦"); 
                        	this.addBranchFormVisible=true;
                        }else if(this.$store.state.user.myDepts.length>1){
                        	//this.$message.info("亲，您在多个部门中任职，我分不清您要登陆哪个部门，请选择一个部门登陆吧");  
                        	this.deptSelectVisible=true;
                        	//this.$router.push({ path: 'mdp/sys/branch/BranchAdd' })
                        }else{
                        	//进行角色身份验证
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
    	if(this.userDeptid==''){
    		this.$message.error("亲，请选择登陆的部门")
    		return
    	}
    	
    	let depts=this.myDepts.filter(d=>d.deptid==this.userDeptid)   
    	if(this.$store.state.user.userInfo.deptid!=this.userDeptid){
        	this.$store.dispatch('SwitchDept', depts[0]).then(() => {
        		this.deptSelectVisible = false
        		//进行角色身份验证
      			this.rolesChecked();
        	})
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

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px; 
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#ef1010;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  background:url(../../assets/image/yxin_login_backgroup_pc.png) no-repeat;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    max-width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 180px auto;
    border-radius: 20px;
  	opacity: 0.9;
  	background-color:#f5f7faa3;
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
      color: #fff;
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
}
</style>