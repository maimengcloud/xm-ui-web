<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 DeptPostUser 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            
            <el-form-item label="用户" prop="userid">
                {{ editForm.username }}{{ "( "+editForm.userid +" )"}}
             </el-form-item>
            <el-form-item label="归属岗位" prop="username">
                {{ editForm.postName }}{{ "( "+editForm.postId +" )"}}
            </el-form-item> 
            <el-form-item label="归属部门" prop="deptid"> 
                {{ editForm.deptName }}{{ "( "+editForm.deptid +" )"}}
             </el-form-item>
            <el-form-item label="是否为主岗位" prop="master">
                <el-checkbox true-label="1" false-label="0">是否为主岗位</el-checkbox>
            </el-form-item>
            <el-form-item label="开始任职时间" prop="startDate">
                <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.startDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('startDate')"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束任职时间" prop="endDate">
                <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.endDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('endDate')"></el-date-picker>
            </el-form-item>
            <el-form-item label="实际结束时间" prop="actEndDate">
                <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.actEndDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('actEndDate')"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="enabled">
                <mdp-select item-code="enabled" show-style="origin" v-model="editForm.enabled" placeholder="状态" :maxlength="1" @change="editSomeFields(editForm,'enabled',$event)" :disabled="disabledJudge('enabled')"/>
            </el-form-item>
            <el-form-item label="最后更新时间" prop="lastDate">
                <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.lastDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('lastDate')||true"></el-date-picker>
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
import * as DeptPostUserApi from '@/api/mdp/sys/deptPostUser';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'deptPostUserForm',
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
                postId:'',deptid:'',userid:'',startDate:'',endDate:'',actEndDate:'',enabled:'',lastDate:'',master:'',id:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: DeptPostUserApi.queryDeptPostUserById,
                add: DeptPostUserApi.addDeptPostUser,
                edit: DeptPostUserApi.editDeptPostUser,
                editSomeFields: DeptPostUserApi.editSomeFieldsDeptPostUser
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