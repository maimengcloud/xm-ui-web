<template>
  <div>
    <el-dropdown class="avatar-container right-menu-item hidden-sm-and-down" trigger="click"  @command="handleCommand">
        <div class="avatar-wrapper">
            <img v-if="userInfo && userInfo.headimgurl" class="user-avatar" :src="userInfo.headimgurl">
            <img v-else class="user-avatar" src="../../../assets/image/user_img.gif">
            <span class="username">{{getTimeStatus}}，<b>{{userInfo.username}}</b></span>
            <i class="el-icon-caret-bottom"></i>
        </div>  
        <el-dropdown-menu  slot="dropdown" style="width:460px;">
            <div class="dropdown">
                <div class="topBox">
                    <div class="topBox_logo" v-if="userInfo.memType!=='0'">
                        <img v-if="!branchUsersCount || branchUsersCount.default || !branchUsersCount.imgUrl" src="../../../assets/image/qqlogo_yuan.png" alt="">
                        <img v-else  :src="branchUsersCount.imgUrl" alt="">

                    </div>
                    <div class="topBox_logo" v-else>
                        <img v-if="userInfo && userInfo.headimgurl" class="user-avatar" :src="userInfo.headimgurl">
                        <img v-else class="user-avatar" src="../../../assets/image/user_img.gif">
                    </div>
                    <div class="topBox_desc">
                        <p class="topBox_branch">{{userInfo.branchName?userInfo.branchName:''}}</p>
                        <div class="topBox_version">
                            <span>账户类型 / 
                                <b class="version" v-if="userInfo.memType==='0' && userInfo.atype==='1'"> 个人主账户 </b>
                                <b class="version" v-else-if="userInfo.memType==='0' && userInfo.atype==='0'"> 个人子账户 </b>
                                <b class="version" v-else-if="userInfo.memType==='1'"> 企业管理员账户 </b>
                                <b class="version" v-else-if="userInfo.memType==='2'"> 企业员工账户 </b>
                            </span>
                            <span class="level" v-if="userInfo.memType==='0'"  @click="upgradeToBranchAccount">
                                <i class="el-icon-upload2"></i>
                                <span  @click="upgradeToBranchAccount">升级</span> 
                            </span>
                        </div>    
                        <div class="topBox_num">
                            <span @click="calcBranchUsers">账号数量（ {{branchUsersCount.currUsers }} / {{branchUsersCount.maxUsers}} ）个 <i class="el-icon-refresh-right"></i></span>    
                        </div>                    
                    </div>
                </div>

                <div class="middleBox">
                    <p class="middleBox_username">用户名称：<b>{{userInfo.username}}</b> </p> 
                    <div class="middleBox_role">
                        <span>我的角色：</span>
                        <span class="middleBox_role_name">
                            <a> {{getMyRoleNames()}} </a>
                        </span>
                    </div>
                    <div class="middleBox_role">
                        <span>会员等级：</span>
                        <span class="middleBox_role_name">
                            <a> {{userInfo.ilvlName?userInfo.ilvlName:'普通会员'}} </a>
                        </span>
                    </div>
                </div>

                <div class="bottomBox2">
                    <!--<p class="el-icon-menu" @click="handleCommand('myWork')">我的工作台</p> -->
                    <p class="el-icon-user" @click="switchUser">切换账户</p> 
                    <p class="el-icon-edit" @click="handleCommand('updateUserInfo')">账户明细</p>
                    <p class="el-icon-user-solid">团队管理</p>
                    <p @click="logout" class="el-icon-switch-button">退出登录</p>
                </div>

            </div> 


        </el-dropdown-menu>
    </el-dropdown>
    
        
        <el-dialog
          title="请选择一个账户进行登录"
          :visible.sync="phonenoUsersVisible"
          width="600" append-to-body> 
          <el-table :data="phonenoUsers"> 
            <el-table-column prop="displayUserid" label="登录账号">
            </el-table-column>
            <el-table-column prop="username" label="姓名">
            </el-table-column> 
            <el-table-column prop="branchName" label="企业">
            </el-table-column>
            <el-table-column  label="操作">
					<template slot-scope="scope"> 
						<el-button type="primary" @click="toLogin(scope.row)">登录</el-button> 
					</template>
            </el-table-column>
          </el-table>
        </el-dialog> 
        <el-dialog
            title="新增机构"
            :visible.sync="branchAddVisible"
            width="60%"
            append-to-body
            top="20px"
            :close-on-click-modal="false"
        >
            <branch-add 
            :branch="{id:userInfo.branchId,branchName:'',admUserid:userInfo.branchId,admUsername:userInfo.username,luserid:userInfo.userid,lusername:userInfo.username}"
            op-type="add"
            :visible="branchAddVisible"
            @cancel="branchAddVisible=false"
            @submit="afterAddSubmit"
            ></branch-add>
        </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

import {  queryMyUsers,switchUser } from '@/api/login';

import {  calcBranchUsers } from '@/api/branch';
import BranchAdd from "@/views/mdp/sys/branch/BranchEdit";

export default {
    data() {
        return {
            branchAddVisible:false,
            phonenoUsers:[],
            phonenoUsersVisible:false,
            branchUsersCount:{
                currUsers:1,
                maxUsers:100,
                imgUrl:'',
                defalut:1,
            }

        }
    },

    computed: {
        ...mapGetters([
            'userInfo',
            'roles',
            'myPosts'
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
        calcBranchUsers(){
            calcBranchUsers().then(res=>this.branchUsersCount=res.data.data)
        },
        getMyRoleNames(){
            if(this.roles && this.roles.length>0){
                var myRoles=this.roles.filter(i=>i.roleid.indexOf('SCOPE')<0);
                return myRoles.map(i=>i.rolename).join(",")
            }
        },
        switchUser(){   
            queryMyUsers().then(res0=>{  
                if(res0.data.tips.isOk){
                    this.phonenoUsers=res0.data.data; 
                    if(res0.data.data.length<=1){
                        this.$message.warning("当前没有关联的账户，无须切换");
                    }else{
                        this.phonenoUsersVisible=true;
                    }
                }else{
                    this.$message.error(res0.data.tips.msg);
                }
            })
        },
        handleCommand(command){
            if(command=='updateUserInfo'){
                this.$router.push({path:'/my/work/updateUserInfo'})
            }
            if(command=='myWork'){
                this.$router.push({path:'/my/work/index'})
            }
        },  
        upgradeToBranchAccount(){
            //跳转到购买模块页面
            this.branchAddVisible=true;
        },
        
        afterAddSubmit(){

        },
        toLogin(user) {
                this.$prompt('请输入密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',  
                }).then(({ value }) => { 
                        let params={ 
                        password:md5(value),  
                        userloginid:user.userid,
                        authType:'password_display_userid' ,
                        grantType:"password"
                    } 
                    //userloginid, password,grantType,authType,deptid,userid
                    switchUser(params.userloginid,params.password,params.grantType,params.authType,'',params.userloginid).then(res => {
                        this.phonenoUsersVisible=false;
                        if(res.data.tips.isOk==true){  
                            setToken( res.data.data.accessToken.tokenValue)
                            removeCacheUserInfo();
                            this.$store.dispatch('GetUserInfo').then((res2)=>{  
                                this.$router.push({ path: '/' });
                            }).catch(err=>{
                                    
                            }); 
                        }else{
                            this.$message.error(res.data.tips.msg);
                        } 
                    }).catch((e) => {
                            
                    })
                }).catch(() => {
                        this.phonenoUsersVisible=false;
                });  	 
        },
        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.replace('/'+process.env.CONTEXT+'/'+process.env.VERSION+'/');
            })
        },

    },
    components:{
        BranchAdd
    },
    mounted() {
        //this.calcBranchUsers();
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
                cursor: pointer;
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