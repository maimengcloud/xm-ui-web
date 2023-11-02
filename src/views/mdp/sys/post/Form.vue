<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 Post 岗位管理-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="主键" prop="id">
                <el-input v-model="editForm.id" placeholder="主键" :maxlength="50" @change="editSomeFields(editForm,'id',$event)" :disabled="disabledJudge('id')"/>
            </el-form-item>
            <el-form-item label="岗位名称" prop="postName">
                <el-input v-model="editForm.postName" placeholder="岗位名称" :maxlength="50" @change="editSomeFields(editForm,'postName',$event)" :disabled="disabledJudge('postName')"/>
            </el-form-item>
            <el-form-item label="岗位级别" prop="postLvl">
                <mdp-select item-code="postLvl"  v-model="editForm.postLvl" :min="0" :max="200" :precision="0" :disabled="disabledJudge('postLvl')"/>
            </el-form-item>
            <el-form-item label="岗位类型" prop="postType">
                <mdp-select item-code="postType" v-model="editForm.postType" placeholder="岗位类型引用字典" :maxlength="20" @change="editSomeFields(editForm,'postType',$event)" :disabled="disabledJudge('postType')"/>
            </el-form-item>
            
            <el-form-item label="备注" prop="remark">
                <el-input v-model="editForm.remark" placeholder="备注" :maxlength="50" @change="editSomeFields(editForm,'remark',$event)" :disabled="disabledJudge('remark')"/>
            </el-form-item>
            <el-form-item label="归属机构号" prop="branchId">
                <el-input v-model="editForm.branchId" placeholder="归属机构号" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)" :disabled="disabledJudge('branchId')"/>
            </el-form-item>
            <el-form-item label="创建日期" prop="cdate">
                <el-date-picker type="date" placeholder="选择日期" v-model="editForm.cdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('cdate')"></el-date-picker>
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
import * as PostApi from '@/api/mdp/sys/post';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'postForm',
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
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                id:'',postName:'',remark:'',branchId:'',cdate:'',postLvl:'',postType:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: PostApi.queryPostById,
                add: PostApi.addPost,
                edit: PostApi.editPost,
                editSomeFields: PostApi.editSomeFieldsPost
            }
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