<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 UserTpaInvite 第三方邀请加入流水表，send_branch_id+join_userid唯一索引-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef" v-loading="load.list">
            <el-form-item label="二维码">
                <div style="text-align:center;">
                    <div>  
                        <div id="login_container"></div> 
                    </div>
                     <p v-if="editForm.inviteScene=='2'"> {{editForm.joinUsername}} 您好,【{{editForm.sendBranchName+'-'+editForm.sendUsername}}】邀请您扫码登录</p>
					<p v-else-if="editForm.inviteScene=='3'"> 【{{editForm.sendBranchName}}-{{editForm.sendUsername}}】邀请您扫码登录</p>
                    <p v-else-if="editForm.inviteScene=='4'"> {{editForm.joinUsername}} 您好,请您扫码申领企业【{{editForm.sendBranchName}}】</p>

                </div>
            </el-form-item>
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
import * as UserTpaInviteApi from '@/api/mdp/sys/userTpaInvite';
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

import {  removeToken} from '@/utils/auth'
export default {
    name:'userTpaInviteForm',
    mixins:[MdpFormMixin],
    components: {
    },
    computed: {
    },
    props:{
    },
    watch: {
        $route(to){
            if(to.params.inviteId){
               this.initCurrData();
            }
        }
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["inviteId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                inviteId:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                joinUserid:'',sendBranchId:'',sendUserid:'',inviteId:'',sendBranchName:'',sendUsername:'',sendTime:'',inviteState:'',inviteScene:'',inviteType:'',objType:'',joinUsername:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: UserTpaInviteApi.queryUserTpaInviteById,
                add: UserTpaInviteApi.addUserTpaInvite,
                edit: UserTpaInviteApi.editUserTpaInvite,
                editSomeFields: UserTpaInviteApi.editSomeFieldsUserTpaInvite
            },
            editable:true,//是否可编辑模式
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){
            var inviteId=this.$route.params.inviteId
            this.load.list=true
            UserTpaInviteApi.checkInviteId({inviteId:inviteId}).then(res=>{
                this.load.list=false
                var tips = res.data.tips
                if(tips.isOk){
                    this.editForm=Object.assign({},res.data.data)
                    this.weixinLogin();
                }else{
                    this.$notify.error(tips.msg);
                }
                
            })
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
            return true;
        },

        /**
          * 设置某个关键词、按钮、输入框禁用 disabledRules['addBtn']=false
          * 判断某个对象是否可编辑 this.disabledJudge('addBtn')==false
          */
        disabledRulesInit(disabledRules){

        },
        /**
         * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
         * @param {*} row 当前选中的行
         * @param {*} fieldName 修改的字段名
         * @param {*} $event 修改后的值
         * @param {*} params 将要提交服务器的参数
         * @returns true/false 返回false ,将取消更新数据库
         */
        editSomeFieldsCheck(row,fieldName,$event,params){
            if(this.editable==false){
                return false;
            }
            params[fieldName]=$event
            return true;
        },
        weixinLogin(){
            var curlDomain=window.location.protocol+"//"+window.location.host; //  
             var mdpRedirectUri=	`${curlDomain}/${process.env.CONTEXT}/${process.env.VERSION}/`
            var tpaContext=this.$mdp.getTpaContext();
            var domain=this.$mdp.getFixedDomain();
            var appType=this.$mdp.getWxpubConfig().appType;
            var scope=this.$mdp.getWxpubConfig().scope
            var state=this.editForm.inviteId
            var obj = new WxLogin({
                self_redirect:false,
                id:"login_container", 
                appid: this.$mdp.getWxpubConfig().appid, 
                scope: scope, 
                redirect_uri: encodeURIComponent(`${domain}/api/${process.env.VERSION}/${tpaContext}/login/token?authType=wechat_wxpub&appType=${appType}&redirectUri=${mdpRedirectUri}`),
                state: state,
                style: "",
                href: ""
            });  
        },
    },
    mounted() {
        removeToken()
        var s1 = document.createElement('script');
        s1.type = 'text/javascript';
        s1.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
        document.body.appendChild(s1); 
    }
}

</script>

<style scoped>

</style>