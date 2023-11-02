<template>
<el-row>
    <el-row class="main">
    <!--新增/编辑界面 MenuDef 前端功能菜单表-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            
            <el-form-item :label="(editForm.menuType=='1'?'菜单':'按钮')+'名称'" prop="mname">
                <el-input show-style="origin" v-model="editForm.mname" placeholder="名称" :maxlength="100" @change="editSomeFields(editForm,'mname',$event)" :disabled="disabledJudge('mname')"/>
            </el-form-item>
            <el-form-item :label="(editForm.menuType=='1'?'菜单':'按钮')+'编号'" prop="id">
                <el-input show-style="origin" v-model="editForm.id" placeholder="编号，空则后台自动生成" :maxlength="60" @change="editSomeFields(editForm,'id',$event)" :disabled="disabledJudge('id')"/>
            </el-form-item>
            <el-form-item label="上级编号" prop="pid">
                <el-input show-style="origin" v-model="editForm.pid" placeholder="上级菜单编号" :maxlength="50" @change="editSomeFields(editForm,'pid',$event)" :disabled="disabledJudge('pid')||true"/>
            </el-form-item>
            <el-form-item label="路由PATH" prop="rpath">
                <el-input show-style="origin" v-model="editForm.rpath" placeholder="路由PATH" :maxlength="100" @change="editSomeFields(editForm,'rpath',$event)" :disabled="disabledJudge('rpath')"/>
            </el-form-item> 
            <el-form-item label="访问路径" prop="accUrl">
                <el-input show-style="origin" v-model="editForm.accUrl" placeholder="访问路径" :maxlength="200" @change="editSomeFields(editForm,'accUrl',$event)" :disabled="disabledJudge('accUrl')"/>
            </el-form-item>
            <el-form-item label="菜单顺序" prop="msort">
                <el-input show-style="origin" v-model="editForm.msort" placeholder="菜单顺序" :maxlength="10" @change="editSomeFields(editForm,'msort',$event)" :disabled="disabledJudge('msort')"/>
            </el-form-item> 
            <el-form-item label="菜单图标" prop="icon">
                <el-input show-style="origin" v-model="editForm.icon" placeholder="菜单图标" :maxlength="100" @change="editSomeFields(editForm,'icon',$event)" :disabled="disabledJudge('icon')"/>
            </el-form-item>
            <el-form-item label="是否显示" prop="isShow"> 
                <el-switch @change="editSomeFields(editForm,'isShow',$event)" :disabled="disabledJudge('isShow')"
                    v-model="editForm.isShow"
                    active-text="显示"
                    inactive-text="隐藏"
                    active-value="1"
                    inactive-value="0">
                </el-switch>
            </el-form-item> 
            <el-form-item label="归属类型" prop="menuType">
                
                <el-switch @change="editSomeFields(editForm,'menuType',$event)" :disabled="disabledJudge('menuType')"
                    v-model="editForm.menuType"
                    active-text="按钮"
                    inactive-text="菜单"
                    active-value="2"
                    inactive-value="1">
                </el-switch>
             </el-form-item>
             
            <el-form-item label="api路径" prop="apiRules">
                <el-input show-style="origin" v-model="editForm.apiRules" placeholder="对应后台的url地址，支持ant表达式匹配，用于后台接口调用时权限控制,多个逗号分隔,多个为or关系" :maxlength="255" @change="editSomeFields(editForm,'apiRules',$event)" :disabled="disabledJudge('apiRules')"/>
            </el-form-item>
            <el-form-item label="api编号" prop="operQxId">
                <el-input show-style="origin" v-model="editForm.operQxId" placeholder="后台api编号" :maxlength="50" @change="editSomeFields(editForm,'operQxId',$event)" :disabled="disabledJudge('operQxId')"/>
            </el-form-item>
            <el-form-item label="支持版本" prop="supVers">
                <mdp-select item-code="menuSupVers" show-style="origin" v-model="editForm.supVers" placeholder="支持版本" :maxlength="255" @change="editSomeFields(editForm,'supVers',$event)" :disabled="disabledJudge('supVers')"/>
            </el-form-item>
            <el-form-item label="归属模块" prop="moduleId"> 
                <mdp-select :load-fun="listMenuModule" show-style="origin" v-model="editForm.moduleId" placeholder="归属模块" :maxlength="50" @change2="editSomeFields(editForm,'moduleId',$event)" :disabled="disabledJudge('moduleId')"/>
            </el-form-item>
            <el-form-item label="权限规则" prop="arole">
                <el-switch @change="editSomeFields(editForm,'arole',$event)" :disabled="disabledJudge('arole')"
                    v-model="editForm.arole"
                    active-text="对所有角色开放，免费使用"
                    inactive-text="需要授权给角色方可用"
                    active-value="1"
                    inactive-value="0">
                </el-switch>
             </el-form-item>
            <el-form-item label="权限类型" prop="qxType" v-if="editForm.menuType=='2'">
                <mdp-select item-code="qxType" show-style="origin" v-model="editForm.qxType" placeholder="一般按钮才需要区分权限类型" :maxlength="20" @change="editSomeFields(editForm,'qxType',$event)" :disabled="disabledJudge('qxType')"/>
            </el-form-item>
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" class="footer">
            <el-button @click.native="handleCancel">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as MenuDefApi from '@/api/mdp/menu/menuDef';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

import { listMenuModule } from '@/api/mdp/menu/menuModule';
export default {
    name:'menuDefForm',
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
                id:'',pid:'',accUrl:'',msort:'',mcate:'',icon:'',mname:'',rpath:'',rid:'',isShow:'',menuType:'',operQxId:'',supVers:'',moduleId:'',arole:'',qxType:'',apiRules:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: MenuDefApi.queryMenuDefById,
                add: MenuDefApi.addMenuDef,
                edit: MenuDefApi.editMenuDef,
                editSomeFields: MenuDefApi.editSomeFieldsMenuDef
            }
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
            if(fieldName=='moduleId'){
                params[fieldName]=$event.id
                params['mcate']=$event.mcate
            }else{
                params[fieldName]=$event
            }
            
            return true;
        },
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>