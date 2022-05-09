<template>
  <div>
    <el-dropdown class="avatar-container right-menu-item hidden-sm-and-down" trigger="click"  @command="handleCommand">
        <div class="avatar-wrapper">
            <img v-if="userInfo && userInfo.headimgurl && userInfo.headimgurl!=null && userInfo.headimgurl!=='' " class="user-avatar" :src="userInfo.headimgurl">
            <img v-else class="user-avatar" src="../../../assets/image/user_img.gif">
            <span class="username">{{getTimeStatus}}，<b>{{userInfo.username}}</b></span>
            <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu  slot="dropdown" style="width:360px;">
            <div class="dropdown">
                <div class="topBox">
                    <div class="topBox_logo">
                        <img src="../../../assets/image/qqlogo_yuan.png" alt="">
                    </div>
                    <div class="topBox_desc">
                        <p class="topBox_branch">{{userInfo.branchName}}</p>
                        <div class="topBox_version">
                            <span>当前版本 / <b class="version">免费基础版</b></span>
                            <span class="level">
                                <i></i>
                                升级
                            </span>
                        </div>    
                        <div class="topBox_num">
                            <span>账号数量（1 / 25）个</span>    
                        </div>                    
                    </div>
                </div>

                <div class="middleBox">
                    <p class="middleBox_username">我的用户名：<b>{{userInfo.username}}</b> </p>
                    <div class="middleBox_role">
                        <span>我的角色：</span>
                        <span class="middleBox_role_name" v-for="role in roles" :key="role.roleid">
                            <a v-if="role.roleid.indexOf('SCOPE')< 0 "> {{role.rolename}} , </a>
                        </span>
                    </div>
                </div>

                <div class="bottomBox2">
                    <p>团队管理</p>
                    <p @click="logout">退出登录</p>
                </div>

            </div>


            <!-- <el-dropdown-item  divided>
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
            </el-dropdown-item> -->

            <!-- <el-dropdown-item v-if="false" divided>
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
            </el-dropdown-item> -->
            
            <!-- <el-dropdown-item  divided>
                <div style=" overflow-x:auto; height:150px;">
                    我拥有的角色：
                    <el-row style="padding-left:40px;" v-for="role in roles" :key="role.roleid">
                        <span v-if="role.roleid.indexOf('SCOPE')<0">{{role.rolename}}</span>
                    </el-row>
                </div>
            </el-dropdown-item> -->


        </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
    data() {
        return {

        }
    },

    computed: {
        ...mapGetters([
            'userInfo',
            'roles',
        ]),
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
        handleCommand(command){
            if(command=='updateUserInfo'){
                this.$router.push({path:'/updateUserInfo'})
            }
        },

        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.replace('/'+process.env.CONTEXT+'/'+process.env.VERSION+'/');
            })
        },

    },

    mounted() {

    }
}
</script>

<style lang="scss" scoped>

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

.dropdown {
    padding: 0 20px 0 20px;
    .topBox {
        height: 100px;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #f6f6f6;
        .topBox_logo {
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 52px;
                height: 52px;
            }
        }
        .topBox_desc {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            width: 100%;
            justify-content: center;
            .topBox_branch {
                font-size: 18px;
                margin-bottom: 8px;
            }
            .topBox_version {
                display: flex;
                flex-direction: row;
                margin-bottom: 8px;
                font-size: 14px;
                .version {
                    display: inline-block;
                    font-weight: normal;
                    color: rgb(69, 196, 186);
                    margin-top: 4px;
                }
                .level {
                    background: rgb(64, 158, 255);
                    margin-left: 10px;
                    padding: 4px 11px 4px 8px;
                    border-radius: 2px;
                    color: #fff;
                    cursor: pointer;
                }
            }
            .topBox_num {
                font-size: 14px;
            }
        }
    }

    .middleBox {
        min-height: 60px;
        border-bottom: 1px solid #f6f6f6;
        padding: 12px 0;
        .middleBox_username {
            margin-bottom: 6px;
            b {
                font-weight: normal;
                color: #606060;
            }
        }
        .middleBox_role {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            line-height: 28px;
            .middleBox_role_name {
                color: #606060;
            }
        }
    }

    .bottomBox2 {
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p {
            display: flex;
            cursor: pointer;
            width: 100%;
            height: 40px;
            text-align: left;
            align-items: center;
        }
        p:hover {
            background: rgb(243, 243, 243);
        }
    }
}





</style>