<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 MoOrderModule 订单与模块关系表-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="订单编号" prop="orderId">
                <el-input show-style="origin" v-model="editForm.orderId" placeholder="订单编号" :maxlength="50" @change="editSomeFields(editForm,'orderId',$event)" :disabled="disabledJudge('orderId')"/>
            </el-form-item>
            <el-form-item label="模块编号" prop="moduleId">
                <el-input show-style="origin" v-model="editForm.moduleId" placeholder="模块编号" :maxlength="50" @change="editSomeFields(editForm,'moduleId',$event)" :disabled="disabledJudge('moduleId')"/>
            </el-form-item>
            <el-form-item label="模块名称" prop="name">
                <el-input show-style="origin" v-model="editForm.name" placeholder="模块名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)" :disabled="disabledJudge('name')"/>
            </el-form-item>
            <el-form-item label="模块费用" prop="fee">
                <el-input show-style="origin" v-model="editForm.fee" placeholder="模块费用" :maxlength="10" :disabled="disabledJudge('fee')"/>
            </el-form-item>
            <el-form-item label="计费模式：0-不计费，1-按购买人数计费，2-总包费用,3-按实际使用人数每月计费" prop="billMode">
                <el-input show-style="origin" v-model="editForm.billMode" placeholder="计费模式：0-不计费，1-按购买人数计费，2-总包费用,3-按实际使用人数每月计费" :maxlength="1" @change="editSomeFields(editForm,'billMode',$event)" :disabled="disabledJudge('billMode')"/>
            </el-form-item>
            <el-form-item label="人均费用,单位人天" prop="uniFee">
                <el-input show-style="origin" v-model="editForm.uniFee" placeholder="人均费用,单位人天" :maxlength="10" :disabled="disabledJudge('uniFee')"/>
            </el-form-item>
            <el-form-item label="折扣比率，可折上折，叠加折扣。-按最大人数、按月数优惠" prop="discount">
                <el-input show-style="origin" v-model="editForm.discount" placeholder="折扣比率，可折上折，叠加折扣。-按最大人数、按月数优惠" :maxlength="200" @change="editSomeFields(editForm,'discount',$event)" :disabled="disabledJudge('discount')"/>
            </el-form-item>
            <el-form-item label="分类(关联mo_cate)" prop="mcate">
                <el-input show-style="origin" v-model="editForm.mcate" placeholder="分类(关联mo_cate)" :maxlength="50" @change="editSomeFields(editForm,'mcate',$event)" :disabled="disabledJudge('mcate')"/>
            </el-form-item>
            <el-form-item label="logo地址" prop="logoUrl">
                <el-input show-style="origin" v-model="editForm.logoUrl" placeholder="logo地址" :maxlength="255" @change="editSomeFields(editForm,'logoUrl',$event)" :disabled="disabledJudge('logoUrl')"/>
            </el-form-item>
            <el-form-item label="费用解释" prop="feeDesc">
                <el-input show-style="origin" v-model="editForm.feeDesc" placeholder="费用解释" :maxlength="255" @change="editSomeFields(editForm,'feeDesc',$event)" :disabled="disabledJudge('feeDesc')"/>
            </el-form-item>
            <el-form-item label="人数折算比例。购买总人数*折扣率为当前模块购买人数" prop="udisRate">
                <el-input-number show-style="origin" v-model="editForm.udisRate" :min="0" :max="200" :precision="0" :disabled="disabledJudge('udisRate')"></el-input-number>
            </el-form-item>
            <el-form-item label="是否折算人数0否1是" prop="udis">
                <el-input show-style="origin" v-model="editForm.udis" placeholder="是否折算人数0否1是" :maxlength="1" @change="editSomeFields(editForm,'udis',$event)" :disabled="disabledJudge('udis')"/>
            </el-form-item>
            <el-form-item label="购买人数=订单表中购买总人数*人数折扣" prop="musers">
                <el-input-number show-style="origin" v-model="editForm.musers" :min="0" :max="200" :precision="0" :disabled="disabledJudge('musers')"></el-input-number>
            </el-form-item>
            <el-form-item label="最终总费用=orgin_fee*dis_rate" prop="finalFee">
                <el-input show-style="origin" v-model="editForm.finalFee" placeholder="最终总费用=orgin_fee*dis_rate" :maxlength="10" :disabled="disabledJudge('finalFee')"/>
            </el-form-item>
            <el-form-item label="购买天数" prop="days">
                <el-input-number show-style="origin" v-model="editForm.days" :min="0" :max="200" :precision="0" :disabled="disabledJudge('days')"></el-input-number>
            </el-form-item>
            <el-form-item label="原始总费用，未进行折扣方案前的总费用如果计费模式为1，则为uni_fee*musers*days单价*折扣方案天数折扣*折扣方案中人数折扣，如果计费模式为2，则为fee" prop="orginFee">
                <el-input show-style="origin" v-model="editForm.orginFee" placeholder="原始总费用，未进行折扣方案前的总费用如果计费模式为1，则为uni_fee*musers*days单价*折扣方案天数折扣*折扣方案中人数折扣，如果计费模式为2，则为fee" :maxlength="10" :disabled="disabledJudge('orginFee')"/>
            </el-form-item>
            <el-form-item label="订单折扣率（可能会根据客户类型后台改订单折扣，从新计算订单价格）" prop="disRate">
                <el-input-number show-style="origin" v-model="editForm.disRate" :min="0" :max="200" :precision="0" :disabled="disabledJudge('disRate')"></el-input-number>
            </el-form-item>
            <el-form-item label="是否控制总人数0-否1-是" prop="ucheck">
                <el-input show-style="origin" v-model="editForm.ucheck" placeholder="是否控制总人数0-否1-是" :maxlength="1" @change="editSomeFields(editForm,'ucheck',$event)" :disabled="disabledJudge('ucheck')"/>
            </el-form-item>
            <el-form-item label="企业总人数=订单表中ousers" prop="ousers">
                <el-input-number show-style="origin" v-model="editForm.ousers" :min="0" :max="200" :precision="0" :disabled="disabledJudge('ousers')"></el-input-number>
            </el-form-item>
            <el-form-item label="购买的版本0免费版，1企业版" prop="ver">
                <el-input show-style="origin" v-model="editForm.ver" placeholder="购买的版本0免费版，1企业版" :maxlength="1" @change="editSomeFields(editForm,'ver',$event)" :disabled="disabledJudge('ver')"/>
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
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as MoOrderModuleApi from '@/api/mdp/mo/moOrderModule';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'moOrderModuleForm',
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
            pkNames:["orderId", "moduleId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                orderId:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ],
                moduleId:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                orderId:'',moduleId:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',mcate:'',logoUrl:'',feeDesc:'',udisRate:'',udis:'',musers:'',finalFee:'',days:'',orginFee:'',disRate:'',ucheck:'',ousers:'',ver:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: MoOrderModuleApi.queryMoOrderModuleById,
                add: MoOrderModuleApi.addMoOrderModule,
                edit: MoOrderModuleApi.editMoOrderModule,
                editSomeFields: MoOrderModuleApi.editSomeFieldsMoOrderModule
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