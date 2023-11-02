<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 FormData 表单数据表-->
        <el-form :model="editForm"  :label-width="labelWidth()" :rules="editFormRules" ref="editFormRef">
 
            <el-row> 
                <el-col :span="spanCalc()">
                <el-form-item label="标签" prop="tagIds">
                    <mdp-select-tag show-style="tag" v-model="editForm.tagIds" multiple split="," placeholder="标签" :maxlength="150" @change="editSomeFields(editForm,'tagIds',$event)" :disabled="disabledJudge('tagIds')"/>
                </el-form-item>
                </el-col>
                <el-col :span="spanCalc()">
                <el-form-item label="业务编号" prop="bizKey">
                    <el-input show-style="origin" v-model="editForm.bizKey" placeholder="业务编号" :maxlength="150" @change="editSomeFields(editForm,'bizKey',$event)" :disabled=" true || disabledJudge('bizKey')"/>
                </el-form-item>
                </el-col>
                <el-col :span="spanCalc()">
                <el-form-item label="审核状态" prop="flowState">
                    <mdp-select show-style="tag" item-code="bizFlowState" v-model="editForm.flowState" placeholder="审核状态" :maxlength="1" @change="editSomeFields(editForm,'flowState',$event)" :disabled=" true || disabledJudge('flowState')"/>
                </el-form-item>
                </el-col>
                <el-col :span="spanCalc()">
                <el-form-item label="创建人" prop="cusername">
                    <el-input show-style="tag" v-model="editForm.cusername" placeholder="创建人姓名" :maxlength="255" @change="editSomeFields(editForm,'cusername',$event)" :disabled=" true || disabledJudge('cusername')"/>
                </el-form-item>
                </el-col>
                <el-col :span="spanCalc()">
                <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled=" true || disabledJudge('createTime')"></el-date-picker>
                </el-form-item>
                </el-col>
            </el-row>
            <mdp-form-data ref="formDataRef" v-model="editForm" :formFields="formFields" :form-def="formDef" @submit="submitHandle"><div></div></mdp-form-data>
            <el-form-item label="更多信息">
                <el-checkbox v-model="showMore"/>
            </el-form-item>  
                <el-row v-if="showMore"> 
                    <el-col :span="spanCalc()">
                    <el-form-item label="数据编号" prop="id">
                        <el-input show-style="origin" v-model="editForm.id" placeholder="数据编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)" :disabled=" true || disabledJudge('id')"/>
                    </el-form-item> 
                    </el-col>
                    <el-col :span="spanCalc()">
                    <el-form-item label="更新日期" prop="lastTime">
                        <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.lastTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled=" true || disabledJudge('lastTime')"></el-date-picker>
                    </el-form-item> 
                    </el-col>
                    <el-col :span="spanCalc()">
                    <el-form-item label="更新人" prop="userid">
                        <el-input show-style="origin" v-model="editForm.userid" placeholder="最后更新人" :maxlength="50" @change="editSomeFields(editForm,'userid',$event)" :disabled=" true || disabledJudge('userid')"/>
                    </el-form-item> 
                    </el-col>
                    <el-col :span="spanCalc()">
                    <el-form-item label="创建部门" prop="deptName">
                        <el-input show-style="origin" v-model="editForm.deptName" placeholder="创建部门" :maxlength="255" @change="editSomeFields(editForm,'deptName',$event)" :disabled=" true || disabledJudge('deptName')"/>
                    </el-form-item>
                    </el-col>
                    <el-col :span="spanCalc()">
                    <el-form-item label="备注" prop="remark">
                        <el-input show-style="origin" v-model="editForm.remark" placeholder="备注" :maxlength="100" @change="editSomeFields(editForm,'remark',$event)" :disabled=" true || disabledJudge('remark')"/>
                    </el-form-item>
                    </el-col>
                    <el-col :span="spanCalc()">
                    <el-form-item label="表单编号" prop="formId">
                        <el-input show-style="origin" v-model="editForm.formId" placeholder="表单编号" :maxlength="50" @change="editSomeFields(editForm,'formId',$event)" :disabled=" true || disabledJudge('formId')"/>
                    </el-form-item>
                    </el-col> 
                </el-row> 
            <!--
            <el-form-item label="附件url" prop="attachmentUrls">
                <el-input show-style="origin" v-model="editForm.attachmentUrls" placeholder="附件url多个" :maxlength="65535" @change="editSomeFields(editForm,'attachmentUrls',$event)" :disabled=" true || disabledJudge('attachmentUrls')"/>
            </el-form-item>
            <el-form-item label="附件名称" prop="attachmentNames">
                <el-input show-style="origin" v-model="editForm.attachmentNames" placeholder="附件名称多个" :maxlength="65535" @change="editSomeFields(editForm,'attachmentNames',$event)" :disabled=" true || disabledJudge('attachmentNames')"/>
            </el-form-item>
            <el-form-item label="机构编号" prop="branchId">
                <el-input show-style="origin" v-model="editForm.branchId" placeholder="机构编号" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)" :disabled=" true || disabledJudge('branchId')"/>
            </el-form-item>
            <el-form-item label="创建部门" prop="deptid">
                <el-input show-style="origin" v-model="editForm.deptid" placeholder="创建部门" :maxlength="50" @change="editSomeFields(editForm,'deptid',$event)" :disabled=" true || disabledJudge('deptid')"/>
            </el-form-item>
            <el-form-item label="数据权限码" prop="dqxCode">
                <el-input show-style="origin" v-model="editForm.dqxCode" placeholder="数据权限码" :maxlength="255" @change="editSomeFields(editForm,'dqxCode',$event)" :disabled=" true || disabledJudge('dqxCode')"/>
            </el-form-item>
            <el-form-item label="创建人编号" prop="cuserid">
                <el-input show-style="origin" v-model="editForm.cuserid" placeholder="创建人编号" :maxlength="50" @change="editSomeFields(editForm,'cuserid',$event)" :disabled=" true || disabledJudge('cuserid')"/>
            </el-form-item>
            <el-form-item label="标签编号" prop="tagIds">
                <el-input show-style="origin" v-model="editForm.tagIds" placeholder="标签编号列表逗号分割" :maxlength="255" @change="editSomeFields(editForm,'tagIds',$event)" :disabled=" true || disabledJudge('tagIds')"/>
            </el-form-item>
            <el-form-item label="标签名" prop="tagNames">
                <el-input show-style="origin" v-model="editForm.tagNames" placeholder="标签名列表逗号分割" :maxlength="255" @change="editSomeFields(editForm,'tagNames',$event)" :disabled=" true || disabledJudge('tagNames')"/>
            </el-form-item>
            -->
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="$refs['formDataRef'].editSubmit()" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
import * as FormDataApi from '@/api/mdp/lcode/formData';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';
 
export default {
    name:'formDataForm',
    mixins:[MdpFormMixin],
    components: { 
    },
    computed: {
    },
    props:{
        formData:{
            type:Object,
            default:{}
        },
        formFields:{
            type: Array,
            default:[]
        },
        formDef:{
            type:Object,
            default:{}
        }
    },
    watch: {
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:'',branchId:'',bizKey:'',deptid:'',flowState:'',createTime:'',dqxCode:'',cuserid:'',tagIds:'',tagNames:'',cusername:'',deptName:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: FormDataApi.queryFormDataById,
                add: FormDataApi.addFormData,
                edit: FormDataApi.editFormData,
                editSomeFields: FormDataApi.editSomeFieldsFormData
            },
            editable:false,//是否可编辑模式
            showMore:false,
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
        submitHandle(data){
            Object.assign(this.editForm,data)
            this.saveSubmit();
        },
        labelWidth:function(){
				if (screen.width <=375){
					return "80px"
				}else  if (screen.width <= 500){
						return "80px"
				}else if (screen.width<=1024){
						return "100px"
				}else {
						return "120px"
				}
			} , 
			spanCalc:function(item){
				var span=screen.width>500?12:24 
				return span;
			}, 
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>