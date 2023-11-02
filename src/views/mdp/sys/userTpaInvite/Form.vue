<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 UserTpaInvite 第三方邀请加入流水表，send_branch_id+join_userid唯一索引-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="被邀请的用户编号，对应sys_user.userid" prop="joinUserid">
                <el-input show-style="origin" v-model="editForm.joinUserid" placeholder="被邀请的用户编号，对应sys_user.userid" :maxlength="50" @change="editSomeFields(editForm,'joinUserid',$event)" :disabled="  disabledJudge('joinUserid')"/>
            </el-form-item>
            <el-form-item label="邀请加入的企业编号" prop="sendBranchId">
                <el-input show-style="origin" v-model="editForm.sendBranchId" placeholder="邀请加入的企业编号" :maxlength="50" @change="editSomeFields(editForm,'sendBranchId',$event)" :disabled="  disabledJudge('sendBranchId')"/>
            </el-form-item>
            <el-form-item label="发起邀请的用户编号" prop="sendUserid">
                <el-input show-style="origin" v-model="editForm.sendUserid" placeholder="发起邀请的用户编号" :maxlength="50" @change="editSomeFields(editForm,'sendUserid',$event)" :disabled="  disabledJudge('sendUserid')"/>
            </el-form-item>
            <el-form-item label="邀请编号，带到邀请链接中的state字段，通过该邀请码反查邀请信息" prop="inviteId">
                <el-input show-style="origin" v-model="editForm.inviteId" placeholder="邀请编号，带到邀请链接中的state字段，通过该邀请码反查邀请信息" :maxlength="50" @change="editSomeFields(editForm,'inviteId',$event)" :disabled="  disabledJudge('inviteId')"/>
            </el-form-item>
            <el-form-item label="邀请加入的企业编号" prop="sendBranchName">
                <el-input show-style="origin" v-model="editForm.sendBranchName" placeholder="邀请加入的企业编号" :maxlength="255" @change="editSomeFields(editForm,'sendBranchName',$event)" :disabled="  disabledJudge('sendBranchName')"/>
            </el-form-item>
            <el-form-item label="发起邀请的用户名" prop="sendUsername">
                <el-input show-style="origin" v-model="editForm.sendUsername" placeholder="发起邀请的用户名" :maxlength="255" @change="editSomeFields(editForm,'sendUsername',$event)" :disabled="  disabledJudge('sendUsername')"/>
            </el-form-item>
            <el-form-item label="邀请时间" prop="sendTime">
                <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.sendTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="  disabledJudge('sendTime')"></el-date-picker>
            </el-form-item>
            <el-form-item label="邀请状态，字典invite_state，0-发起，1-待客户扫码确认，2-已加入" prop="inviteState">
                <el-input show-style="origin" v-model="editForm.inviteState" placeholder="邀请状态，字典invite_state，0-发起，1-待客户扫码确认，2-已加入" :maxlength="255" @change="editSomeFields(editForm,'inviteState',$event)" :disabled="  disabledJudge('inviteState')"/>
            </el-form-item>
            <el-form-item label="邀请场景，1-裸邦，创建个人虚拟企业及账户" prop="inviteScene">
                <el-input show-style="origin" v-model="editForm.inviteScene" placeholder="邀请场景，1-裸邦，创建个人虚拟企业及账户" :maxlength="255" @change="editSomeFields(editForm,'inviteScene',$event)" :disabled="  disabledJudge('inviteScene')"/>
            </el-form-item>
            <el-form-item label="邀请类型，1-微信-扫码，2-手机号码+短信验证码，3-邮件+验证码，4-小程序" prop="inviteType">
                <el-input show-style="origin" v-model="editForm.inviteType" placeholder="邀请类型，1-微信-扫码，2-手机号码+短信验证码，3-邮件+验证码，4-小程序" :maxlength="255" @change="editSomeFields(editForm,'inviteType',$event)" :disabled="  disabledJudge('inviteType')"/>
            </el-form-item>
            <el-form-item label="邀请对象类型，1-指定用户编号，0-不指定用户编号" prop="objType">
                <el-input show-style="origin" v-model="editForm.objType" placeholder="邀请对象类型，1-指定用户编号，0-不指定用户编号" :maxlength="1" @change="editSomeFields(editForm,'objType',$event)" :disabled="  disabledJudge('objType')"/>
            </el-form-item>
            <el-form-item label="被邀请的用户名称" prop="joinUsername">
                <el-input show-style="origin" v-model="editForm.joinUsername" placeholder="被邀请的用户名称" :maxlength="255" @change="editSomeFields(editForm,'joinUsername',$event)" :disabled="  disabledJudge('joinUsername')"/>
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
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

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
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>