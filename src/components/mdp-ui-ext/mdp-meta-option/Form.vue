<template>
    <section>
    
                <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
                    
                    <el-form-item label="选项名称" prop="name">
                        <el-input v-model="editForm.name" placeholder="名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)" :disabled="disabledJudge('name')"></el-input>
                    </el-form-item>  
                    <el-form-item label="选项取值" prop="id">  
                        <el-input v-model="editForm.id" @change="editSomeFields(editForm,'id',$event)" clearable> </el-input>  
                     </el-form-item> 
                    <el-form-item label="显示颜色" prop="color"> 
                        <el-row type="flex" style="align-items: center">
                        <el-button v-for="color,idx in predefineColors" :key="idx" :style="{'background-color':color}" circle size="big" @click="editSomeFields(editForm,'color',color)"></el-button>
                        <el-color-picker @change="editSomeFields(editForm,'color',$event)" 
                            v-model="editForm.color"
                            show-alpha
                            :predefine="predefineColors">
                        </el-color-picker>
                    </el-row>
                     </el-form-item> 
                    <el-form-item label="选项排序" prop="seqOrder">
                        <el-input-number v-model="editForm.seqOrder" placeholder="0-9999值越小越靠前" :min="0" :max="200" :disabled="disabledJudge('seqOrder')"></el-input-number>
                    </el-form-item> 
                    
                    <el-card v-if="currOpType!='add'">
                        <div slot="header" class="clearfix">
                            <span>状态切换配置 可由 {{editForm.name}} 切换(禁止切换)至目标状态</span>
                         </div>
                        <el-form-item label="目标状态" prop="targets">
                            <mdp-select  show-style="tag" placeholder="可以切换至目标状态" :item-code="editForm.itemCode" v-model="editForm.targets" @change="editSomeFields(editForm,'targets',$event)"></mdp-select>
                        </el-form-item>  
                        <el-form-item label="禁用状态" prop="unTargets">
                            <mdp-select multiple show-style="tag" split="," placeholder="禁止切换至目标状态" :item-code="editForm.itemCode" v-model="editForm.unTargets" @change="editSomeFields(editForm,'unTargets',$event)"></mdp-select>
                        </el-form-item>   
                    </el-card>
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span>取值条件</span>
                         </div>
                        <el-form-item label="字典代码" prop="relyType">
                            <el-input  v-model="editForm.relyType" placeholder="字典代码" clearable :maxlength="255" @change="editSomeFields(editForm,'relyType',$event)" :disabled="disabledJudge('relyType')">
                                <span slot="append"> 
                                     <el-button @click="$refs['itemDialog'].open(editForm)" >选字典</el-button>
                                </span>
                            </el-input>
                        </el-form-item> 
                        <el-form-item label="字典值" prop="relyId" v-if="editForm.relyType">
                            {{ editForm.relyId }} &nbsp;&nbsp;<mdp-select show-style="tag" :item-code="editForm.relyType" v-model="editForm.relyId" placeholder="字典值" :maxlength="255" @change="editSomeFields(editForm,'relyId',$event)" :disabled="disabledJudge('relyId')"></mdp-select>
                        </el-form-item>    
                    </el-card>
                    
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span>扩展条件</span>
                         </div> 
                        <el-form-item label="扩展代码" prop="relyStype">
                            <el-input v-model="editForm.relyStype" placeholder="扩展代码" :maxlength="255" @change="editSomeFields(editForm,'relyStype',$event)" :disabled="disabledJudge('relyStype')"></el-input>
                        </el-form-item> 
                        <el-form-item label="扩展值" prop="relySid">
                            <el-input v-model="editForm.relySid" placeholder="扩展值" :maxlength="255" @change="editSomeFields(editForm,'relySid',$event)" :disabled="disabledJudge('relySid')"></el-input>
                        </el-form-item> 
                    </el-card>
                </el-form>
    
            <el-row  slot="footer" class="footer">
                <el-button @click.native="handleCancel">关闭</el-button>
                <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
            </el-row>  
            <!--基础数据查询 CodeDetail sys_code_detail界面-->
            <mdp-dialog ref="itemDialog" title="选择数据组" width="80%" :modal="false">
                <template v-slot="{visible,data,dialog}">
                    <mdp-meta-item  :visible="visible" sub-op-type="select" @select="(item)=>{
                        data.relyType=item.itemCode; 
                        dialog.close()
                    }"></mdp-meta-item>
                </template> 
            </mdp-dialog>  
    </section>
    </template>
    
    <script>
    import { mapGetters } from 'vuex'
import { MdpFormMixin } from '../../mdp-ui/mixin/MdpFormMixin.js';
    
    export default {
        name:'itemOptionForm',
        mixins:[MdpFormMixin],
        components: {
        },
        computed: {
        },
        props:{
            item:{
                type:Object,
                default:null,
            }
        },
        watch: {
        },
        data() {
            return {
                menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
                pkNames:["id", "itemId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
                currOpType:'mng',//表单 add、edit，所有按钮可动、detail-只看不能操作
                editFormRules: {
                    id:[
                    { required: true, message: '此项必填', trigger: 'change' },
                    //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                    ],
                    itemId:[
                    { required: true, message: '此项必填', trigger: 'change' },
                    //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                    ],
                    name:[
                    { required: true, message: '此项必填', trigger: 'change' }, 
                    ]
                }, 
                editForm: {
                    id:'',name:'',relyType:'',relyId:'',relyStype:'',relySid:'',color:'',targets:'',disabled:'',itemId:'',seqOrder:'',unTargets:''
                },
                //增删改查(含批量)接口
                apis:{
                queryById: this.$mdp.queryItemOptionById,
                add: this.$mdp.addItemOption,
                edit: this.$mdp.editItemOption,
                editSomeFields: this.$mdp.editSomeFieldsItemOption
                },
                predefineColors:this.$mdp.getDefaultColors(), 
            }
        },
        methods: {
            //页面初始化需要配置的特殊逻辑写这里
            initCurrData(){ 
                
                if(this.item && this.item.id){
                    if(this.currOpType=='add'){
                        this.editForm.itemId=this.item.id
                    }
                }  
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
            setPks(rows,params){  
                params.$pks=[{itemId:this.dataBak.itemId,id:this.dataBak.id}]
            }
        },
        mounted() {
    
        }
    }
    
    </script>
    
    <style>
    
    
    </style>