<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened=='1'"></hamburger>

    <breadcrumb class="breadcrumb-container hidden-sm-and-down"></breadcrumb>

    <div class="right-menu">

      <div class="hidden-sm-and-down" style="float:left;display:flex;align-items: center;height:100%;">
        <!-- <el-tooltip class="itemt" effect="dark" content="跳转到组织" placement="bottom-start">
          <div target="_blank" @click="jumpToOtherSystem('sys')">
            <div v-if="screenWidth<500">
              <i class="iconfont icon-zuzhi" style="margin-right:10px;" data-title="组织"></i>
            </div>
            <div v-if="screenWidth>500" class="big">
              <i class="iconfont icon-zuzhi" style="font-size:25px;" data-title="组织"></i>
              <span style="position:absolute;bottom:-18px;">组织</span>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="itemt" effect="dark" content="跳转到内容" placement="bottom-start">
          <div target="_blank" @click="jumpToOtherSystem('arc')">
            <div v-if="screenWidth<500">
              <i class="iconfont icon-neirong-copy" style="margin-right:10px;" data-title="内容"></i>
            </div>
            <div v-if="screenWidth>500" class="big">
              <i class="iconfont icon-neirong-copy" style="font-size:25px" data-title="内容"></i>
              <span style="position:absolute;bottom:-18px;">内容</span>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="itemt" effect="dark" content="跳转到流程" placement="bottom-start">
          <div target="_blank" @click="jumpToOtherSystem('oa')">
            <div v-if="screenWidth<500">
              <i class="iconfont icon-icon-liucheng" style="margin-right:10px;" data-title="流程"></i>
            </div>
            <div v-if="screenWidth>500" class="big">
              <i class="iconfont icon-icon-liucheng" style="font-size:25px" data-title="流程"></i>
              <span style="position:absolute;bottom:-18px;">流程</span>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="itemt" effect="dark" content="跳转到商城" placement="bottom-start">
          <div target="_blank" @click="jumpToOtherSystem('mallm')">
            <div v-if="screenWidth<500">
              <i class="iconfont icon-shangcheng" style="margin-right:10px;" data-title="商城"></i>
            </div>
            <div v-if="screenWidth>500" class="big">
              <i class="iconfont icon-shangcheng" style="font-size:25px" data-title="商城"></i>
              <span style="position:absolute;bottom:-18px;">商城</span>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="itemt" effect="dark" content="跳转到营销" placement="bottom-start">
          <div target="_blank" @click="jumpToOtherSystem('mk')">
            <div v-if="screenWidth<500">
              <i class="iconfont icon-yingxiao" style="margin-right:10px;" data-title="营销"></i>
            </div>
            <div v-if="screenWidth>500" class="big">
              <i class="iconfont icon-yingxiao" style="font-size:25px" data-title="营销"></i>
              <span style="position:absolute;bottom:-18px;">营销</span>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="itemt" effect="dark" content="跳转到财务" placement="bottom-start">
          <div target="_blank" @click="jumpToOtherSystem('ac')">
            <div v-if="screenWidth<500">
              <i class="iconfont icon-caiwuguanli" style="margin-right:10px;" data-title="财务"></i>
            </div>
            <div v-if="screenWidth>500" class="big">
              <i class="iconfont icon-caiwuguanli" style="font-size:25px" data-title="财务"></i>
              <span style="position:absolute;bottom:-18px;">财务</span>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="itemt" effect="dark" content="跳转到短信" placement="bottom-start">
          <div target="_blank" @click="jumpToOtherSystem('sms')">
            <div v-if="screenWidth<500">
              <i class="iconfont icon-sms" style="margin-right:10px;" data-title="短信"></i>
            </div>
            <div v-if="screenWidth>500" class="big">
              <i class="iconfont icon-sms" style="font-size:25px" data-title="短信"></i>
              <span style="position:absolute;bottom:-18px;">短信</span>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip class="itemt" effect="dark" content="跳转到聊天" placement="bottom-start">
          <div target="_blank" @click="jumpToOtherSystem('im')">
            <div v-if="screenWidth<500">
              <i class="iconfont icon-liaotian1" style="margin-right:10px;" data-title="聊天oa"></i>
            </div>
            <div v-if="screenWidth>500" class="big">
              <i class="iconfont icon-liaotian1" style="font-size:25px" data-title="聊天"></i>
              <span style="position:absolute;bottom:-18px;">聊天</span>
            </div>
          </div>
        </el-tooltip> -->


        <el-tooltip class="itemt hidden-sm-and-down" effect="dark" :content="workShop.branchId+'-'+workShop.shopId+'-'+workShop.locationId"
          placement="top-start">
          <el-tag>{{workShop.branchName}}-{{workShop.locationName}}</el-tag>
        </el-tooltip>
        <el-button @click="showSelectShopMethod" type="primary" v-if="workShop.isSuperAdmin||workShop.isPlatFormAdmin">切换商户</el-button>
      </div>

      <error-log class="errLog-container right-menu-item hidden-sm-and-down"></error-log>

      <el-tooltip class="hidden-sm-and-down" effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <lang-select class="international right-menu-item hidden-sm-and-down"></lang-select>

      <el-tooltip class="hidden-sm-and-down" effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="userInfo && userInfo.headimgurl && userInfo.headimgurl!=null && userInfo.headimgurl!=='' " class="user-avatar"
            :src="userInfo.headimgurl">
          <img v-else class="user-avatar" src="../../../assets/image/user_img.gif">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            用户名：{{userInfo.username}}
          </el-dropdown-item>
          <el-dropdown-item divided>
            公司：{{userInfo.branchName}}
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div style=" overflow-x:auto; height:150px;">
              部门及岗位： <el-form>
                <el-form-item v-for="item in deptPostsTree" :label="item.deptName">
                  <el-row v-if="item.children!=null && item.children.length>0" v-for="post in item.children">
                    <el-tag>{{post.postName}}</el-tag>
                  </el-row>
                </el-form-item>
              </el-form>

            </div>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div style=" overflow-x:auto; height:150px;">
              商户及门店： <el-form>
                <el-form-item label-width="300" v-for="item in shopLocationsTree" :label="item.shopName">
                  <el-row v-for="location in item.locations">
                    <el-col :span="24">
                      <el-tag>{{location.locationName}}</el-tag><i v-if="location.locationId==userInfo.locationId"
                        class="el-icon-check"></i>
                    </el-col>
                  </el-row>
                  <el-row v-if="item.locations==null || item.locations.length<=0">
                    <el-col :span="24">
                      <el-tag> 无门店或者我不是该商户的门店管理员</el-tag>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div style=" overflow-x:auto; height:150px;">
              我拥有的角色： <el-form>
                <el-form-item label="">
                  <el-row v-for="role in roles">
                    <el-tag>{{role.rolename}}</el-tag>
                  </el-row>
                </el-form-item>
              </el-form>
            </div>
          </el-dropdown-item>

          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="选择商户" :visible.sync="selectShopVisible" width="70%" append-to-body>
      <select-shop-location-by-sys-dept @sure="sureMethod"></select-shop-location-by-sys-dept>
    </el-dialog>

  </el-menu>
</template>

<script>
  import {
    mapGetters 
  } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'
  import selectShopLocationBySysDept from '@/components/selectShopLocation/selectShopLocationBySysDept';

  export default {
    components: {
      'select-shop-location-by-sys-dept': selectShopLocationBySysDept,
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      LangSelect,
      ThemePicker
    },
    data: function() {
      return {
        selectShopVisible: false,
        postChecked: '',

        envVersion: ''
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
        'workShop'
      ]),
      'deptPostsTree': function() {
        var deptPostsTree = []
        if (this.myPosts == null || this.myPosts.length <= 0) {
          return deptPostsTree
        }
        var checkedPostId = this.myPosts.length > 0 ? this.myPosts[0].postId : ''
        this.postChecked = checkedPostId
        this.myPosts.forEach(post => {
          if (post.postId == checkedPostId) {
            post.checked = '1'
          }
          var deptPostArray = deptPostsTree.filter(dp => dp.deptid == post.deptid)
          if (deptPostArray != null && deptPostArray.length > 0) {
            if (deptPostArray[0].children && deptPostArray[0].children.length > 0) {
              if (!deptPostArray[0].children.some(i => i.postId == post.postId)) {
                deptPostArray[0].children.push(post)
              }
            } else {
              deptPostArray[0].children = []
              deptPostArray[0].children.push(post)
            }
          } else {
            let deptPostsNode = {
              deptid: post.deptid,
              deptName: post.deptName
            }
            deptPostsNode.children = [post]
            deptPostsTree.push(deptPostsNode)
          }
        })
        return deptPostsTree
      },
      'shopLocationsTree': function() {
        let myShops = this.myShops;
        if (myShops == null || myShops.length <= 0) {
          return []
        }
        let myLocations = this.myLocations;
        myShops.forEach(shop => {
          shop.locations = [];
          if (shop.shopId == this.userInfo.shopId) {
            shop.checked = true
          }
          if (myLocations != null && myLocations.length > 0) {
            myLocations.forEach(l => {
              if (l.shopId == shop.shopId) {

                if (l.locationId == this.userInfo.locationId) {
                  l.checked = true
                }
                shop.locations.push(l)
              }
            })
          }
        })
        return myShops
      }
    },
    methods: {
      toggleSideBar(toOpen) {
        this.$store.dispatch('toggleSideBar', toOpen)
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      showSelectShopMethod() {
        this.selectShopVisible = true;
      },
      sureMethod(row) {
        this.selectShopVisible = false;
        this.workShop.shopId = row.shopId;
        this.workShop.branchId = row.branchId;
        this.workShop.branchName = row.sysBranchName;
        this.workShop.locationId = row.id;
        this.workShop.deptid = row.deptid;
        this.workShop.locationName = row.businessName;
        this.$store.commit('SET_WORK_SHOP', this.workShop);
      },
      jumpToOtherSystem(name) {
        let href = window.location.protocol + "//" + window.location.host + "/" + name + "/" + process.env.VERSION;
        if(name=='im'){
          href=window.location.protocol + "//" + window.location.host + "/" + name + "/" + process.env.VERSION+"/#/mdp/im/messages/messageChat";
        }
        console.log(href);
        window.open(href, '_blank');
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it

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
    line-height: 50px;
    border-radius: 0px !important;

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }

      .screenfull {
        height: 20px;
      }

      .international {
        vertical-align: top;
      }

      .theme-switch {
        vertical-align: 15px;
      }

      .avatar-container {
        height: 50px;
        margin-right: 30px;

        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;

          .user-avatar {
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
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
