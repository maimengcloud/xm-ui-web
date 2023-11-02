<template>
  <div class="errPage-container">
    <el-button @click="goIndex" icon='arrow-left' class="pan-back-btn">首页</el-button>
    <el-row>
      <el-col :span="18">
        <h1 class="text-jumbo text-ginormous">tips:</h1>
        您好,以下为您在本系统的登录账号信息，请妥善保管！
        <h2>名称:{{decodeURIComponent(tips.username)}}   账号:{{ tips.userid }}   {{tips.password?'密码:'+tips.password:'' }}</h2>
        <h6>您可以：</h6>
         <ul class="list-unstyled"> 
          <li class="link-type">
            <router-link to="/updateUserInfo">我的信息详情</router-link>
          </li>   
          <li class="link-type">
            <router-link to="/dashboard">首页</router-link>
          </li>   
          <li class="link-type">
             <a @click="LogOut">账户密码登录</a>
          </li>   
          <li class="link-type">
            <a @click="LogOut">微信扫码登录</a>
          </li>   
        </ul>
      </el-col>
      <el-col :span="6">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
    <el-dialog title="随便看" :visible.sync="dialogVisible">
      <img class="pan-img" :src="ewizardClap">
    </el-dialog>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'page401',
  watch:{
    $route(to){ 
      this.tips=to.query
    }
  },
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false,
      tips:{
        tipscode:'',
        isOk:'',
        msg:'',
        password:'',
        userid:'',
        username:''
      }
    }
  },
  methods: {
    goIndex(){
      this.$router.push({path:"/"})
    },
    
    LogOut(){ 
      this.$store.dispatch('LogOut').then(res=>{
        this.$router.push({ path: '/' })
      })
    },
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    }
  },
  mounted(){ 
      this.tips=this.$route.query  
      sessionStorage.removeItem("index-path")
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 800px;
    margin: 100px auto;
    .pan-back-btn {
      background: #008489;
      color: #fff;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
