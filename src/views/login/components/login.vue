<template>
    <div>
        
        <div v-if="!isRestPwd">
            <div class="login_form">
                <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
                    <el-form-item prop="displayUserid" v-show="loginForm.authType=='password_display_userid'">
                        <el-input class="inp"  type="text" v-model="loginForm.displayUserid" autoComplete="on"  placeholder="账号"></el-input>
                    </el-form-item>
                    <el-form-item  prop="password" v-show="loginForm.authType=='password_display_userid'">
                        <el-input class="inp" show-password v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="phoneno" v-show="loginForm.authType=='sms'"> 
                        <el-input class="inp" name="phoneno" type="text" v-model="loginForm.phoneno" autoComplete="on" placeholder="手机号码">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="smsCode" v-show="loginForm.authType=='sms'"> 
                        <el-input class="inp smsCode" name="smsCode" type="text" v-model="loginForm.smsCode" autoComplete="on" placeholder="短信验证码">
                        </el-input>
                        <el-button class="sendCode" :disabled="abledBut" @click.prevent="sendPhonenoSmsCode">
                            <span class="text" v-if="!abledBut">发送验证码</span>
                            <span class="text" v-else>({{setTimeNum}}s)</span>
                        </el-button>
                    
                    </el-form-item>
                </el-form>
                <div class="oper">
                    <a @click="isRestPwd = true">忘记密码</a>
                    <a v-if="loginForm.authType == 'password_display_userid' " @click="loginForm.authType = 'sms'">手机号登录</a>
                    <a v-if="loginForm.authType == 'sms' " @click="loginForm.authType = 'password_display_userid' ">密码登录</a>
                </div>

                <el-button class="login" :loading="loading" @click.native.prevent="handleLogin">
                    <span class="text">登 录</span>
                </el-button>
            </div>
            <div class="bottom">
                <el-divider content-position="center">第三方登录方式</el-divider>
                <div class="other"> 
                    <el-popover trigger="manual" v-model="wxLoginCodeVisible" placement="top-start"> <div id="login_container"></div>
                        <img  slot="reference"  src="@/assets/image/module/weixin.png" @click="weixinLogin">
                        <el-button type="text" @click="wxLoginCodeVisible=false">关闭</el-button>
                    </el-popover> 
                </div>
            </div>
        </div>

        <div v-if="isRestPwd">
            <div class="login_form">
                <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
                    <el-form-item prop="phoneno" > 
                        <el-input class="inp" name="phoneno" type="text" v-model="loginForm.phoneno" autoComplete="on" placeholder="手机号码">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="smsCode"> 
                        <el-input class="inp smsCode" name="smsCode" type="text" v-model="loginForm.smsCode" autoComplete="on" placeholder="短信验证码">
                        </el-input>
                        <el-button :disabled="abledBut" class="sendCode" @click.prevent="sendPhonenoSmsCode">
                            <span class="text" v-if="!abledBut">发送验证码</span>
                            <span class="text" v-else>({{setTimeNum}}s)</span>
                        </el-button>
                    </el-form-item>
 
                     <el-form-item prop="password" > 
                        <el-input class="inp" show-password name="password" :type="passwordType" v-model="loginForm.password" autoComplete="on" placeholder="新密码">
                        </el-input>
                    </el-form-item>
                </el-form>
                 <div class="oper">
                    <a @click="isRestPwd = false" style="color:#409EFF;">《 返回</a>
                </div>
                <el-button class="login" :loading="loading" @click.native.prevent="handleResetPasswordByPhoneno">
                    <span class="text">重置密码</span>
                </el-button>
            </div>
        </div>
       
    </div>

</template>

<script>
import { sendSmsCode } from '@/api/sms/sms';
import { mapGetters } from 'vuex'; 
import md5 from 'js-md5';
import { resetPasswordByPhoneno,getTpaState } from '@/api/login'; 

export default {
    name: 'login',
    computed: {
        ...mapGetters([
            'myBranchs','myDepts','userInfo','roles'
        ]),
        screenWidth:function(){
            return screen.width;
        }
    },

    watch: {
        /* 使用watch来响应数据的变化 */
	    //监听倒计时数据的变化，小于0的时候，清除定时器，解开按钮，重置倒计时
        setTimeNum(newVal, oldVal) {
            if(newVal < 0){
                clearInterval(this.timeWrap)
                this.abledBut = false
                this.setTimeNum = 60
            }
        }
    },

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
            userBranchId:'',//选中的部门对应的机构号
            addBranchFormVisible:false,  //显示添加机构对话框 
            isRestPwd: false,
            abledBut: false, //是否禁止
		    setTimeNum: 60,  // 倒计时时间
            timeWrap: null,  // 定时器标识
            wxLoginCodeVisible:false,
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
                    this.$message.success("发送成功");
                    if (this.setTimeNum > 0) {
                        this.abledBut = true
                        this.timeWrap = setInterval(() => {
                            this.setTimeNum -= 1
                        }, 1000)
                    }
                }else{
                    this.$message.error(res.data.tips.msg);
                }
            })
        },

        handleResetPasswordByPhoneno() {
            this.loading = true 
            this.$refs.loginForm.validate(valid => {
                if (valid) { 
                let params={
                    newPassword:md5(this.loginForm.password),
                    phoneno:this.loginForm.phoneno,
                    smsCode:this.loginForm.smsCode
                } 
                resetPasswordByPhoneno(params).then(res=>{
                    this.loading = false  
                    if(res.data.tips.isOk){
                        this.$message.success(res.data.tips.msg);
                        this.isRestPwd = false;
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
                        smsCode:this.loginForm.smsCode,
                        branchId:this.userBranchId,
                    }
                var loginParams={ }
                if(params.authType=='password_display_userid'){
                    loginParams.userloginid=params.displayUserid
                    loginParams.password=params.password
                    loginParams.grantType="password"
                    loginParams.authType='password_display_userid' 
                    //loginParams.deptid=params.deptid
                    loginParams.branchId=params.branchId
                }else if(params.authType=='sms'){
                    loginParams.userloginid=params.phoneno
                    loginParams.password=params.smsCode
                    loginParams.grantType="password"
                    loginParams.authType="sms"
                    //loginParams.deptid=params.deptid
                    loginParams.branchId=params.branchId
                }
                this.$store.dispatch("LoginByUserloginid",loginParams).then(res => {
                    this.loading = false 
                    if(res.data.tips.isOk==true){
                        this.loading = true;
                        this.$store.dispatch('GetUserInfo').then((res2)=>{ 
                            this.loading = false
                            if(res2.data.tips.isOk==true){ 
                                this.userDeptid=res2.data.userInfo.deptid
                                this.rolesChecked(); 
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
                    this.loading = false
                })
                } else {
                    return false
                }
            })
        },
        deptChecked() {
            if( !this.userDeptid){
                this.$message.error("请选择登陆的部门")
                return
            }
            if(this.$store.state.user.userInfo.deptid!=this.userDeptid){
            let depts=this.myDepts.filter(d=>d.deptid==this.userDeptid)
            this.userBranchId=depts[0].branchId
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
        weixinLogin(){
            var mdpRedirectUri="https://www.qingqinkj.com/xm/m1/"
            getTpaState().then(res=>{
                var tips = res.data.tips;
                if(tips.isOk){
                    this.wxLoginCodeVisible=true;
                     var state=res.data.data
                    var obj = new WxLogin({
                        self_redirect:false,
                        id:"login_container", 
                        appid: "wx2671d5db8346b6fc", 
                        scope: "snsapi_login", 
                        redirect_uri: encodeURIComponent("https://www.maimengcloud.com/api/m1/tpa/login/token?authType=wechat_wxpub&authId=mmxmcloud_wxopen_pc&redirectUri="+mdpRedirectUri),
                        state: state,
                        style: "",
                        href: ""
                    }); 
                }
            })
           
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
    mounted(){
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
        document.body.appendChild(s);
    }

}





</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>