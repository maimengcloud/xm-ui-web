<template>
<el-row>
    <el-row>
        <form-field  ref="formFields" :form-def.sync="editForm" :form-fields="formFields" :visible="formFieldsVisible">
            <span  slot="setBtn">
                <el-button type="success" @click="goToFormDefIndex()" icon="el-icon-search">表单中心</el-button>
                <el-button type="primary" icon="el-icon-setting" @click="$refs['formSetDialog'].open({pkOptions:getPkOptions()})">表单配置</el-button>
            </span>
            <el-input slot="formName" label="标题" v-model="editForm.formName" required  width="100%">  </el-input>
        </form-field>  
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button> 
            <el-button type="success" @click="$refs['sourceDialog'].open()">显示源代码</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
            <el-button v-if="currOpType=='edit'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) || load.edit">提交</el-button>

        </el-row>
    </slot>
    <mdp-dialog ref="formSetDialog">
        <template v-slot="{visible,data,dialog}">
            <el-form :model="editForm" label-width="120px" label-position="right" ref="editFormRef">
                <el-form-item label="表单名称">
                    <el-input v-model="editForm.formName"></el-input>
                </el-form-item>  
                <el-form-item label="分类"  prop="categoryId">
                    <mdp-select-cate show-style="tag" v-model="editForm.categoryId" split=","></mdp-select-cate> 
                </el-form-item>
                <el-form-item label="标签"  prop="tagIds">
                    <mdp-select-tag show-style="tag" v-model="editForm.tagIds" multiple split=","></mdp-select-tag> 
                </el-form-item>
                <el-form-item label="存储方式" prop="dataType">
                    <mdp-select item-code="form_data_type" show-style="tag" v-model="editForm.dataType"></mdp-select>
                </el-form-item>
                <el-form-item label="主键" prop="pks" :rules="[{required:true,message:'此项必填',trigger:'change'}]" v-if="editForm.dataType=='1'||editForm.dataType=='3'">
                    <el-input v-model="editForm.pks" v-if="editForm.dataType=='2'" placeholder="宿主表主键将由后台自动获取" readonly></el-input>
                    <mdp-select v-else show-style="tag" :multiple="true" v-model="editForm.pks" :plus-options="pkOptions" :props="{id:'id',name:'title'}" split="," @change2="onPksChange"></mdp-select>
                </el-form-item>
                <span v-if="['2'].some(k=>k==editForm.dataType)">
                    
                    <el-form-item label="数据源名称" :rules="{required:true,message:'此项必填',trigger:'change'}">
                        <mdp-select v-model="editForm.tableOwner" :load-fun="dataSourceList" ></mdp-select>
                    </el-form-item>  
                    <el-form-item label="表名"  prop="tableName" :rules="{required:true,message:'此项必填',trigger:'change'}">
                        <el-input v-model="editForm.tableName" placeholder="请保持与数据库表名一致"></el-input>
                    </el-form-item> 
                    <el-form-item label="数据存储字段">
                        <el-input v-model="editForm.dataField"  placeholder="非驼峰命名，默认ext_infos对应数据库字段ext_infos"></el-input>
                    </el-form-item>  
                </span> 
                
                <span v-if="['3'].some(k=>k==editForm.dataType)">
                    
                    <el-form-item label="数据源名称" :rules="{required:true,message:'此项必填',trigger:'change'}">
                        <mdp-select v-model="editForm.tableOwner" :load-fun="dataSourceList" ></mdp-select>
                    </el-form-item>  
                    <el-form-item label="表名" prop="tableName"  :rules="{required:true,message:'此项必填',trigger:'change'}">
                        <el-input v-model="editForm.tableName" placeholder="请保持与数据库表名一致"></el-input>
                    </el-form-item>  
                    <el-form-item label="建表方式" :rules="{required:true,message:'此项必填',trigger:'change'}">
                        <mdp-select v-model="editForm.ctType" item-code="lcode_create_table_type"></mdp-select>
                    </el-form-item> 
                </span> 
                <mdp-form-expand v-if="showExpand" label-width="120px" label-position="right" v-model="editForm.extInfos" :expand-id="expandId"></mdp-form-expand> 
            </el-form>
        </template>
        <template #footer="{visible,data,dialog}">
        <el-row slot="footer" class="footer">
            <el-button @click="dialog.close()">关闭</el-button>
            <el-button type="primary" @click="saveSubmitDialog">确认</el-button>
        </el-row>
        </template>
    </mdp-dialog>
    <mdp-dialog ref="sourceDialog">
        <template v-slot="{visible,data,dialog}">
            <mdp-source :visible="visible" :form-def="editForm" :form-fields="$refs.formFields.getFieldList()"></mdp-source>
        </template>
    </mdp-dialog>
</el-row>
</template>

<script>
import * as FormDefApi from '@/api/mdp/lcode/formDef';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import FormField from '../formField/Index'  
import MdpSource from '../source/Index'  
import {dataSourceList} from '@/api/mdp/lcode/dev'
export default {
    name:'formDefForm',
    mixins:[MdpFormMixin],
    components: {
        FormField,MdpSource
    },
    computed: {
        pkOptions(){ 
            return this.getPkOptions()
        }
    },
    props:{
        formId:{
            type:String,
            default:null,
        },
        showExpand:{
            type:Boolean,
            default:true,
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
                ],
                
                dataType:[
                    { required: true, message: '此项必填', trigger: 'change' }, 
                ]
            },
            editForm: {
                id:'',tableName:'',tableOwner:'',isCreateTable:'0',formName:'',userid:'',deptid:'',formType:'',isTemplate:'',bizType:'',ctime:'',branchId:'',categoryId:'',tagIds:'',tagNames:'',username:'',deptName:'',groupsJson:'',pks:'',dataType:'1',dataField:'ext_infos',ctType:'2'
            },
            //增删改查(含批量)接口
            apis:{
                queryById: this.$mdp.listFormFieldCacheFirst,
                add: FormDefApi.addFormDefAndFields,
                edit: FormDefApi.editFormDefAndFields,
                editSomeFields: ''
            },
            formFields:[],
            editable:false,//是否可编辑模式 
            formFieldsVisible:false,
        }
    },
    methods: {
        dataSourceList,
        getPkOptions(){
            var formFields=this.$refs.formFields.getFieldList();
            var pkOptions=[...formFields.filter(k=>k.extType!='row' && k.extType!='card' && k.extType!='tabs')];
            if(this.editForm.dataType=='1'){
                pkOptions.push({id:'cuserid',title:'创建用户编号'})
                pkOptions.push({id:'deptid',title:'创建部门编号'})
                pkOptions.push({id:'ctime:1',title:'创建日期(yyy)'})
                pkOptions.push({id:'ctime:2',title:'创建日期(yyy-MM)'})
                pkOptions.push({id:'ctime:3',title:'创建日期(yyy-MM-dd)'})
                pkOptions.push({id:'ctime:4',title:'创建日期(yyy-MM-dd HH)'})
                pkOptions.push({id:'ctime:5',title:'创建日期(yyy-MM-dd HH:mm)'})
                pkOptions.push({id:'ctime:6',title:'创建日期(yyy-MM-dd HH:mm:ss)'}) 
            }
            return pkOptions;
        },
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){   
            if(!this.formId){
                this.currOpType='add'
                this.editForm.dataField='extInfos'
            }else{
                this.editForm.id=this.formId
                this.apis.queryById({formId:this.formId}).then(res=>{
                    var tips = res.data.tips;
                    var data=res.data.data; 
                    if(tips.isOk){
                        if(data){ 
                            this.editForm=data.formDef
                            this.formFields=data.formFields
                            this.currOpType='edit'
                            this.formFieldsVisible=true;
                            this.dataBak={...this.editForm}
                        }else{
                            this.editForm.id=this.formId
                            this.formFields=[]
                            this.currOpType='add' 
                            this.formFieldsVisible=true; 
                            this.editForm.dataField='extInfos' 
                            this.dataBak={...this.editForm}
                        }
                    }else{
                        this.$notify.error(tips.msg)
                    }
                })
            } 
            if(this.subOpType=='detail'){
                this.currOpType='detail'
            }
            
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
        saveSubmit: function () {
 
            if(this.editForm.formName==''){
                this.$notify({position:'bottom-left',showClose:true,message: '表单名称不能为空', type: 'error' });
                return;
            } 
            var formFields=this.$refs.formFields.getFieldList();
            if(formFields.length==0  ){
                this.$notify({position:'bottom-left',showClose:true,message: '最少需要定义一个字段', type: 'error' });
                return;
            }
            
            if(this.editForm.dataType=='1'||this.editForm.dataType=='3'){
                if(!this.editForm.pks){
                    this.$notify({position:'bottom-left',showClose:true,message: '请设置表单主键', type: 'error' });
                    return;
                } 
                
            }
            this.$confirm('确认提交吗？', '提示', {}).then(() => { 
                this.load.edit=true
                let formDef = Object.assign({}, this.editForm); 
                if(this.currOpType=='add'){
                    formDef.deptid=this.userInfo.deptid
                    formDef.branchId=this.userInfo.branchId
                }
                
                this.$refs.formFields.setPrimaryKeys();
            
                formFields.forEach((i,index)=>{i.seq=index});
                var params={formDef:formDef,formFields:formFields};
                if(!this.preParamCheck(params)){
                    this.load.edit=false
                    return;
                } 
                var func=this.apis.add
                if(this.currOpType=='edit'){
                    func=this.apis.edit
                }
                func(params).then((res) => { 
                    this.load.edit=false
                    var tips=res.data.tips;
                    if(tips.isOk){  
                        var data=res.data.data
                        Object.assign(this.editForm,data.formDef)
                        this.formFields=data.formFields
                        this.$mdp.removeFormFieldsCache(this.editForm.id)
                        this.currOpType='edit'  
                        this.afterSubmit(res,tips.isOk,this.currOpType);
                    }
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err =>this.load.edit=false);
            }).catch(()=>{});  
            
        }, 
        
        saveSubmitDialog: function () {
            
            this.$refs['editFormRef'].validate(valid=>{
                if(valid==false){
                    this.$notify({position:'bottom-left',showClose:true,message: '表单验证不通过', type: 'error' });
                    return;
                }
                if(this.editForm.formName==''){
                    this.$notify({position:'bottom-left',showClose:true,message: '表单名称不能为空', type: 'error' });
                    return;
                } 
                var formFields=this.$refs.formFields.getFieldList();
                if(formFields.length==0  ){
                    this.$notify({position:'bottom-left',showClose:true,message: '最少需要定义一个字段', type: 'error' });
                    return;
                } 
                this.$confirm('确认提交吗？', '提示', {}).then(() => { 
                    this.load.edit=true
                    let formDef = Object.assign({}, this.editForm); 
                    if(this.currOpType=='add'){
                        formDef.deptid=this.userInfo.deptid
                        formDef.branchId=this.userInfo.branchId
                    }
                    
                    this.$refs.formFields.setPrimaryKeys();
                
                    formFields.forEach((i,index)=>{i.seq=index});
                    var params={formDef:formDef,formFields:formFields};
                    if(!this.preParamCheck(params)){
                        this.load.edit=false
                        return;
                    } 
                    var func=this.apis.add
                    if(this.currOpType=='edit'){
                        func=this.apis.edit
                    }
                    func(params).then((res) => { 
                        this.load.edit=false
                        var tips=res.data.tips;
                        if(tips.isOk){  
                            
                            var data=res.data.data
                            Object.assign(this.editForm,data.formDef)
                            this.formFields=data.formFields
                            this.$mdp.removeFormFieldsCache(this.editForm.id)
                            this.currOpType='edit'   
                            this.afterSubmit(res,tips.isOk,this.currOpType);
                        }
                        this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                    }).catch( err =>this.load.edit=false);
                }).catch(()=>{}); 

            })
            
        }, 
        goToFormDefIndex(){
            this.$router.push({path:'/mdp/lcode/index'})
            this.close();
        },
        onPksChange(pks){ 
            var pksCtimeList=pks.filter(k=>k.id.indexOf('ctime')>=0)
            if(pksCtimeList && pksCtimeList.length>1){ 
                this.editForm.pks=this.dataBak.pks; 
                this.$notify.error("创建日期最多只能选一个作为主键")
            }
        }
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>