<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 Qx 权限定义-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="权限编号" prop="qxId">
                <el-input v-model="editForm.qxId" placeholder="权限编号" :maxlength="100" @change="editSomeFields(editForm,'qxId',$event)" :disabled="disabledJudge('qxId')"></el-input>
            </el-form-item>
            <el-form-item label="权限名称" prop="qxName">
                <el-input v-model="editForm.qxName" placeholder="权限名称" :maxlength="250" @change="editSomeFields(editForm,'qxName',$event)" :disabled="disabledJudge('qxName')"></el-input>
            </el-form-item>
            <el-form-item label="权限归属模块" prop="moduleId">
                <mdp-select show-style="tag" :load-fun="listMenuModule" v-model="editForm.moduleId" placeholder="权限归属模块编号" :maxlength="50" @change="editSomeFields(editForm,'moduleId',$event)" :disabled="disabledJudge('moduleId')"/>
					 
            </el-form-item> 
        </el-form>
    </el-row>

    <el-row v-if="showBtn!==false">
        <el-button @click.native="handleCancel">关闭</el-button>
        <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
    </el-row>
</el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as QxApi from '@/api/mdp/sys/qx';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

import { listMenuModule } from '@/api/mdp/menu/menuModule';

export default {
    name:'qxForm',
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
            pkNames:["qxId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                qxId:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                qxId:'',qxName:'',moduleId:'',qxSql:'',qxType:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: QxApi.queryQxById,
                add: QxApi.addQx,
                edit: QxApi.editQx,
                editSomeFields: QxApi.editSomeFieldsQx
            },
            
			menuModules:[],
        }
    },
    methods: {
        listMenuModule,
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
            params[fieldName]=$event
            return true;
        },
    },
    mounted() {
        listMenuModule({}).then(res=>{ 
            this.menuModules=res.data.data
        })
    }
}

</script>

<style scoped>

</style>