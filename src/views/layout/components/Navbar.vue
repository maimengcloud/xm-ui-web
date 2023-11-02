<template>
  <el-menu class="navbar" mode="horizontal">

    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <!--<breadcrumb class="breadcrumb-container"></breadcrumb>-->
    <top-modules class="modules-container"></top-modules>

    <div class="right-menu">
      <!--
      <div class="hidden-sm-and-down" style="float:left;display:flex;align-items: center;height:100%;">
        <el-tooltip v-if="workShop.locationName" class="item" effect="dark" :content="workShop.branchId+' '+workShop.shopId+' '+workShop.locationId" placement="top-start">
				  <el-tag>{{workShop.branchName}} {{workShop.locationName}}</el-tag>
				</el-tooltip>
        <el-tooltip v-else class="item" effect="dark" :content="workShop.branchId+' '+workShop.deptid" placement="top-start">
				  <el-tag>{{workShop.branchName}} {{workShop.deptName}}</el-tag>
				</el-tooltip>
				<el-button @click="showSelectShopMethod" type="primary" v-if="workShop.isSuperAdmin||workShop.isPlatFormAdmin">切换商户</el-button>
			</div>
      -->

      <error-log v-if="false" class="errLog-container right-menu-item hidden-sm-and-down"></error-log>
      <screen-full v-if="false" class="screenfull right-menu-item"></screen-full>
      <lang-select v-if="false" class="international right-menu-item hidden-sm-and-down"></lang-select>

      <el-tooltip v-if="false" class="hidden-sm-and-down"  effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>


      <user-info />

      <!-- <el-dropdown class="avatar-container right-menu-item hidden-sm-and-down" trigger="hover"   @command="handleCommand">
          <div class="avatar-wrapper">
            <img v-if="userInfo && userInfo.headimgurl && userInfo.headimgurl!=null && userInfo.headimgurl!=='' " class="user-avatar" :src="userInfo.headimgurl">
            <img v-else class="user-avatar" src="../../../assets/image/user_img.gif">
            <span class="username">{{getTimeStatus}}，<b>{{userInfo.username}}</b></span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu  slot="dropdown" style="width:400px;">
              <el-dropdown-item divided command="updateUserInfo">
                <div>用户名：{{userInfo.username}}
                  <el-button style="float:right;"  type="text" icon="el-icon-setting">账户设置</el-button>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided>
                    公司：{{userInfo.branchName}}
              </el-dropdown-item>
              <el-dropdown-item  divided>
                <div style="height:250px;">
                  <el-row v-for="(item ,index) in deptPostsTree" :label="item.deptName" :key="index">
                    部门：{{item.deptName}}
                      <br>
                    岗位：

                    <div v-if="item.children!=null && item.children.length>0" style="padding-left:40px;">
                    <el-row  v-for="(post,idx) in item.children" :key="idx">
                        {{post.postName}}
                    </el-row>
                    </div>
                  </el-row>
                </div>
            </el-dropdown-item>

            <el-dropdown-item v-if="false" divided>
            <div style=" overflow-x:auto; height:250px;">
              商户及门店： <el-form>
                        <el-form-item label-width="300"  v-for="item in shopLocationsTree" :label="item.shopName" :key="item.shopId">
                            <el-row v-for="location in item.locations" :key="location.locationId">
                              <el-col :span="24"><el-tag>{{location.locationName}}</el-tag><i  v-if="location.locationId==userInfo.locationId" class="el-icon-check"></i>
                              </el-col>
                            </el-row>
                            <el-row v-if="item.locations==null || item.locations.length<=0">
                              <el-col :span="24"><el-tag> 无门店或者我不是该商户的门店管理员</el-tag> </el-col>
                            </el-row>
                        </el-form-item>
                  </el-form>
                  </div>
            </el-dropdown-item>
            <el-dropdown-item  divided>
            <div style=" overflow-x:auto; height:150px;">
              我拥有的角色：
                    <el-row style="padding-left:40px;" v-for="role in roles" :key="role.roleid">
                              <span v-if="role.roleid.indexOf('SCOPE')<0">{{role.rolename}}</span>
                            </el-row>
            </div>
            </el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown> -->



      <!-- <div class="notice">
        <i class="el-icon-bell"></i>
        <span>未读消息(3)</span>
      </div> -->

      <div class="notice">
        <notice-msg-bar class="avatar-container hidden-sm-and-down" ></notice-msg-bar>
      </div>

      <!--喇叭标记-->

      <!-- <el-link class="logout hidden-sm-and-down" @click="goToIndex" icon="el-icon-s-home">
        <span style="font-size: 17px">首页</span>
      </el-link> -->

      <div class="logout">
        <el-button size="mini" type="primary" round  @click="logout">退出</el-button>
      </div>

    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import TopModules from '../TopModules'
import NoticeMsgBar from '../NoticeMsgBar'
import UserInfo from '../UserInfo'

import dayjs from 'dayjs'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker,
    TopModules,
    NoticeMsgBar,
    UserInfo
  },
  data:function(){
	return {
		selectShopVisible: false,
		postChecked:''
	}
  },
  computed: {
      screenWidth: function() {
        return screen.width;
      },
    ...mapGetters([
      'sidebar',
      'userInfo',
      'roles',
      'myPosts',
      'myLocations',
      'myShops',
    ]),
    'deptPostsTree':function(){
    	var deptPostsTree=[]
    	if(this.myPosts==null ||this.myPosts.length<=0){
    		return deptPostsTree
    	}
    	var checkedPostId=this.myPosts.length>0?this.myPosts[0].postId:''
    	this.postChecked=checkedPostId
    	this.myPosts.forEach(post=>{
    		if(post.postId==checkedPostId){
    			post.checked='1'
    		}
    		var deptPostArray=deptPostsTree.filter(dp=>dp.deptid==post.deptid)
 			if(deptPostArray!=null && deptPostArray.length>0){
 				if(deptPostArray[0].children && deptPostArray[0].children.length>0){
 					if(!deptPostArray[0].children.some(i=>i.postId==post.postId)){
 						deptPostArray[0].children.push(post)
 					}
 				}else{
 					deptPostArray[0].children=[]
 					deptPostArray[0].children.push(post)
 				}
 			}else{
 				let deptPostsNode={deptid:post.deptid,deptName:post.deptName}
 				deptPostsNode.children=[post]
 				deptPostsTree.push(deptPostsNode)
 			}
    	})
    	return deptPostsTree
    },
    'shopLocationsTree':function(){
    	let myShops=this.myShops;
    	if(myShops==null||myShops.length<=0){
    		return []
    	}
    	let myLocations=this.myLocations;
    	myShops.forEach(shop=>{
    		shop.locations=[];
    		if(shop.shopId==this.userInfo.shopId){
    			shop.checked=true
    		}
    		if(myLocations!=null && myLocations.length>0){
    			myLocations.forEach(l=>{
    				if(l.shopId==shop.shopId){

    					if(l.locationId==this.userInfo.locationId){
    						l.checked=true
    					}
    					shop.locations.push(l)
    				}
    			})
    		}
    	})
    	return myShops
    },
    getTimeStatus() {
      let hour = dayjs().hour();
      let msg = '早上好';
      if(hour >= 13 || hour <= 18) {
        msg = '下午好';
      }else if (hour >= 19 || hour <= 24){
        msg = '晚上好';
      }
      return msg;
    }
  },
  methods: {
    toggleSideBar(toOpen) {
      this.$store.dispatch('toggleSideBar', toOpen)
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        //location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        //this.$router.replace({path:'/login'})
        location.replace('/'+process.env.CONTEXT+'/'+process.env.VERSION+'/');
      })
    },
    jumpToOtherSystem(name) {
      let href = window.location.protocol + "//" + window.location.host + "/" + name + "/" + process.env.VERSION;
      if(name=='im'){
        href=window.location.protocol + "//" + window.location.host + "/" + name + "/" + process.env.VERSION+"/#/mdp/im/messages/messageChat";
      }
      console.log(href);
      window.open(href, '_blank');
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it

    },
    handleCommand(command){
      if(command=='updateUserInfo'){
        this.$router.push({path:'/updateUserInfo'})
      }
    },
    goToIndex(){
      this.$router.push({path:'/'})
    }
  },
  mounted() {
    if (screen.width <= 500) {
      this.toggleSideBar(false);
    } else {
      this.toggleSideBar(true);
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import './iconfont.css';
.navbar {
  height: 50px;
  border-radius: 0px !important;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  background-color: #fff;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 99;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
    margin-right: 24px;
    color: #9D9D9E !important;
  }

  .modules-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    height: 50px;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    &:focus{
     outline: none;
    }

    .logout{
      display: flex;
      align-items: center;
      height: 50px;
      color: #fff;
      font-size: 30px;
      margin-right: 28px;
    }

    .avatar-container {
      height: 50px;
      display: flex;
      align-items: center;
      .avatar-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
          height: 34px;
          width: 34px;
          border-radius: 50%;
          margin-right: 12px;
        }
        .username{
          color: #7D7D7D;
          font-size: 18px;
          margin-right: 2px;
        }
        .el-icon-caret-bottom {
          font-size: 22px;
        }
      }
    }

    .notice {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 18px;
      color: #827E7E;
      font-size: 16px;
    }


  }
}

  .iconfont {
    position: relative
  }


  .itemt:hover{
    cursor: pointer;
    color: rgb(52, 152, 219);
  }

  .big{
    display:flex;
    flex-direction:column;
    align-items:center;
    margin-right: 20px;
  }

</style>
