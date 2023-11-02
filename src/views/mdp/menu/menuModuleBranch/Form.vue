<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 MenuModuleBranch 机构开通模块对应关系表-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="机构编号" prop="branchId">
                <mdp-select-table placeholder="机构选择" :props="{id:'id',name:'branchName'}" v-model="editForm.branchId" :load-fun="$mdp.listBranch"></mdp-select-table>
             </el-form-item>
            <el-form-item label="模块名称" prop="moduleName">
                <mdp-select :load-fun="listMenuModule" show-style="origin" v-model="editForm.moduleId" placeholder="模块名称" :maxlength="255" @change2="(o)=>{editForm.moduleName=o.name}" :disabled="disabledJudge('moduleName')"/>
            </el-form-item> 
            <template v-if="currOpType!='add'">
                <el-form-item label="状态" prop="status">
                    <mdp-select item-code="branchModuleStatus" show-style="origin" v-model="editForm.status" placeholder="状态" :maxlength="1" @change="editSomeFields(editForm,'status',$event)" :disabled="disabledJudge('status')"/>
                </el-form-item>
                
                <el-form-item label="分类" prop="mcate">
                    <mdp-select item-code="mcate" show-style="origin" v-model="editForm.mcate" placeholder="分类1-协同、2-研发、3-电商" :maxlength="1" @change="editSomeFields(editForm,'mcate',$event)" :disabled="disabledJudge('mcate')"/>
                </el-form-item>
                
                <el-form-item label="购买版本" prop="ver">
                    <mdp-select item-code="menuSupVers" show-style="origin" v-model="editForm.ver" placeholder="购买版本" :maxlength="50" @change="editSomeFields(editForm,'ver',$event)" :disabled="disabledJudge('ver')"/>
                </el-form-item>
                <el-form-item label="购买用户数" prop="musers">
                    <el-input-number show-style="origin" v-model="editForm.musers" :min="0" :max="200" :precision="0" :disabled="disabledJudge('musers')"></el-input-number>
                </el-form-item>
                <el-form-item label="可投标次数" prop="mbidNum">
                    <el-input-number show-style="origin" v-model="editForm.mbidNum" :min="0" :max="200" :precision="0" :disabled="disabledJudge('mbidNum')"></el-input-number>
                </el-form-item>
                <el-form-item label="服务费率" prop="sfeeRate">
                    <el-input-number show-style="origin" v-model="editForm.sfeeRate" :min="0" :max="200" :precision="0" :disabled="disabledJudge('sfeeRate')"></el-input-number>
                </el-form-item>
                
                <el-form-item label="启用日期" prop="startTime">
                    <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('startTime')"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" prop="endTime">
                    <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('endTime')"></el-date-picker>
                </el-form-item>
                <el-form-item label="创建日期" prop="ctime">
                    <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('ctime')"></el-date-picker>
                </el-form-item>
                <el-form-item label="开始计费日期" prop="feeDate">
                    <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.feeDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('feeDate')"></el-date-picker>
                </el-form-item>
                <el-form-item label="是否为众包" prop="crowd">
                    <el-input show-style="origin" v-model="editForm.crowd" placeholder="是否为众包" :maxlength="1" @change="editSomeFields(editForm,'crowd',$event)" :disabled="disabledJudge('crowd')"/>
                </el-form-item>
                <el-form-item label="企业总人数" prop="ousers">
                    <el-input-number show-style="origin" v-model="editForm.ousers" :min="0" :max="200" :precision="0" :disabled="disabledJudge('ousers')"></el-input-number>
                </el-form-item>
                <el-form-item label="人数折算比例" prop="udisRate">
                    <el-input-number show-style="origin" v-model="editForm.udisRate" :min="0" :max="200" :precision="0" :disabled="disabledJudge('udisRate')"></el-input-number>
                </el-form-item>
                <el-form-item label="是否折算人数" prop="udis">
                    <el-input show-style="origin" v-model="editForm.udis" placeholder="是否折算人数按企业总人数*人数折算比例计算" :maxlength="1" @change="editSomeFields(editForm,'udis',$event)" :disabled="disabledJudge('udis')"/>
                </el-form-item>
                
                <el-form-item label="更新日期" prop="ltime">
                    <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('ltime')"></el-date-picker>
                </el-form-item>
                <el-form-item label="创建人编号" prop="cuserid">
                    <el-input show-style="origin" v-model="editForm.cuserid" placeholder="创建人编号" :maxlength="50" @change="editSomeFields(editForm,'cuserid',$event)" :disabled="disabledJudge('cuserid')"/>
                </el-form-item>
                <el-form-item label="创建人姓名" prop="cusername">
                    <el-input show-style="origin" v-model="editForm.cusername" placeholder="创建人姓名" :maxlength="255" @change="editSomeFields(editForm,'cusername',$event)" :disabled="disabledJudge('cusername')"/>
                </el-form-item>
                <el-form-item label="修改人编号" prop="luserid">
                    <el-input show-style="origin" v-model="editForm.luserid" placeholder="修改人编号" :maxlength="50" @change="editSomeFields(editForm,'luserid',$event)" :disabled="disabledJudge('luserid')"/>
                </el-form-item>
                <el-form-item label="修改人姓名" prop="lusername">
                    <el-input show-style="origin" v-model="editForm.lusername" placeholder="修改人姓名" :maxlength="255" @change="editSomeFields(editForm,'lusername',$event)" :disabled="disabledJudge('lusername')"/>
                </el-form-item>
            </template>
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
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as MenuModuleBranchApi from '@/api/mdp/menu/menuModuleBranch';

import { listBranch } from '@/api/mdp/sys/branch';
import { listMenuModule } from '@/api/mdp/menu/menuModule';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'menuModuleBranchForm',
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
            pkNames:["branchId", "moduleId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                branchId:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ],
                moduleId:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                branchId:'',moduleName:'',moduleId:'',startTime:'',endTime:'',ctime:'',ltime:'',cuserid:'',cusername:'',luserid:'',lusername:'',status:'',musers:'',mbidNum:'',sfeeRate:'',ver:'',feeDate:'',crowd:'',ousers:'',udisRate:'',udis:'',mcate:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: MenuModuleBranchApi.queryMenuModuleBranchById,
                add: MenuModuleBranchApi.addMenuModuleBranch,
                edit: MenuModuleBranchApi.editMenuModuleBranch,
                editSomeFields: MenuModuleBranchApi.editSomeFieldsMenuModuleBranch
            }
        }
    },
    methods: {
        listMenuModule,listBranch,
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