<template>
    <div class="login_container">
        <div class="login_content">
            <div class="left">
            </div>
            <div class="right">
                <div class="logo">
                    <img src="@/assets/image/logo1.png">
                    <span>唛盟</span>
                </div>
                <div class="login_box">
                    <div class="login_box_content">
                        <div class="top">
                            <span class="title">平台{{status == 'register' ? '注册' : '登录' }}</span>
                            <span v-if="status == 'login'" >没有账号？<a style="color:#409EFF;" @click="status = 'register' ">点此注册</a> </span>
                            <span v-else>已有账号？<a style="color:#409EFF;" @click="status = 'login' ">点此登录</a> </span>
                        </div>
                        <login-form v-if="status == 'login'"></login-form>
                        <register-form v-else></register-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import loginForm from './components/login';
import registerForm from './components/register';

export default {
    name: 'login',
    components: {loginForm, registerForm},
    data() {
        return {
            status: "login",
        }
    },

    methods: {
    },


    created() {
    },
    destroyed() {
    },

}





</script>

<style lang="scss" scoped>
@import './index.scss';
</style>



