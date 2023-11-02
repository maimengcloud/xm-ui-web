<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 UserTpa 第三方系统向我方开放的用户列表-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            
            <el-form-item label="用户名称" prop="username">
                <el-input show-style="origin" v-model="editForm.username" placeholder="用户名称" :maxlength="128" @change="editSomeFields(editForm,'username',$event)" :disabled="  disabledJudge('username')"/>
            </el-form-item> 
            <el-form-item label="昵称" prop="nickname">
                <el-input show-style="origin" v-model="editForm.nickname" placeholder="昵称" :maxlength="128" @change="editSomeFields(editForm,'nickname',$event)" :disabled="  disabledJudge('nickname')"/>
            </el-form-item> 
            <el-form-item label="性别" prop="gender">
                <el-switch active-text="男" inactive-text="女" active-value="1" inactive-value="1" show-style="origin" v-model="editForm.gender" placeholder="性别" :maxlength="255" @change="editSomeFields(editForm,'gender',$event)" :disabled="  disabledJudge('gender')"/>
            </el-form-item>
            <el-form-item label="第三方应用类型" prop="appType">
                <el-select item-code="app_type" show-style="tag" v-model="editForm.appType" placeholder="第三方应用类型" :maxlength="10" @change="editSomeFields(editForm,'appType',$event)" :disabled="  disabledJudge('appType')"/>
            </el-form-item>
            <el-form-item label="全局唯一编号" prop="unionid">
                <el-input show-style="origin" v-model="editForm.unionid" placeholder="全局唯一编号" :maxlength="64" @change="editSomeFields(editForm,'unionid',$event)" :disabled="  disabledJudge('unionid')"/>
            </el-form-item>
            <el-form-item label="openid" prop="openid">
                <el-input show-style="origin" v-model="editForm.openid" placeholder="帐户加密后的编号，用于对第三方系统进行开放" :maxlength="64" @change="editSomeFields(editForm,'openid',$event)" :disabled="  disabledJudge('openid')"/>
            </el-form-item>
            <el-form-item label="是否锁定" prop="locked">
                <el-checkbox  v-model="editForm.locked" placeholder="是否锁定" true-label="1" false-label="1" :maxlength="6" @change="editSomeFields(editForm,'locked',$event)" :disabled="  disabledJudge('locked')"/>
            </el-form-item>
            <el-form-item label="启用日期" prop="startdate">
                <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.startdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="  disabledJudge('startdate')"></el-date-picker>
            </el-form-item>
            <el-form-item label="移动电话号码" prop="phoneno">
                <el-input show-style="origin" v-model="editForm.phoneno" placeholder="移动电话号码" :maxlength="20" @change="editSomeFields(editForm,'phoneno',$event)" :disabled="  disabledJudge('phoneno')"/>
            </el-form-item>
            <el-form-item label="国家" prop="country">
                <el-input show-style="origin" v-model="editForm.country" placeholder="国家" :maxlength="30" @change="editSomeFields(editForm,'country',$event)" :disabled="  disabledJudge('country')"/>
            </el-form-item>
            <el-form-item label="省份" prop="province">
                <el-input show-style="origin" v-model="editForm.province" placeholder="省份" :maxlength="30" @change="editSomeFields(editForm,'province',$event)" :disabled="  disabledJudge('province')"/>
            </el-form-item> 
            <el-form-item label="城市" prop="city">
                <el-input show-style="origin" v-model="editForm.city" placeholder="城市" :maxlength="30" @change="editSomeFields(editForm,'city',$event)" :disabled="  disabledJudge('city')"/>
            </el-form-item>
            <el-form-item label="头像地址" prop="headimgurl">
                <el-input show-style="origin" v-model="editForm.headimgurl" placeholder="头像地址" :maxlength="500" @change="editSomeFields(editForm,'headimgurl',$event)" :disabled="  disabledJudge('headimgurl')"/>
            </el-form-item>
            <el-form-item label="appid" prop="appid">
                <el-input show-style="origin" v-model="editForm.appid" placeholder="第三方登录应用系统编号" :maxlength="50" @change="editSomeFields(editForm,'appid',$event)" :disabled="  disabledJudge('appid')"/>
            </el-form-item> 
            <el-form-item label="业务分类" prop="bizType">
                <mdp-select item-code="biz_type" show-style="origin" v-model="editForm.bizType" placeholder="biz_type" :maxlength="10" @change="editSomeFields(editForm,'bizType',$event)" :disabled="  disabledJudge('bizType')"/>
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
import * as UserTpaApi from '@/api/mdp/sys/userTpa';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'userTpaForm',
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
            pkNames:["openid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                openid:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                unionid:'',openid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',country:'',city:'',headimgurl:'',province:'',mdpAppid:'',appid:'',authId:'',bizType:'',gender:'',appType:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: UserTpaApi.queryUserTpaById,
                add: UserTpaApi.addUserTpa,
                edit: UserTpaApi.editUserTpa,
                editSomeFields: UserTpaApi.editSomeFieldsUserTpa
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