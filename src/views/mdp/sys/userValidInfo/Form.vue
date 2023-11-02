<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 UserValidInfo 用户实名验证资料库-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="用户编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="用户编号" :maxlength="50"   :disabled="true"></el-input>
				</el-form-item>   
				<el-form-item label="身份证信息">
					<el-form-item label="身份证正面" prop="idFront">  
						<div v-if="editForm.idFront"><img width="240" height="151" :src="editForm.idFront"/> </div>
							
					</el-form-item> 
					<el-form-item label="身份证反面" prop="idBack">
						<div v-if="editForm.idBack"> <img width="240" height="151" :src="editForm.idBack"/></div>
					</el-form-item> 
					<el-form-item label="手持身份证" prop="idHold">
						<div v-if="editForm.idHold"> <img width="480" :src="editForm.idHold"/></div>
					</el-form-item> 
					
					<el-form-item label="用户名称" prop="actUname">
						<el-input v-model="editForm.actUname" placeholder="实名用户名称或者法人名称" :maxlength="255"  ></el-input>
					</el-form-item> 
					
					<el-form-item label="身份证号码" prop="idNo">
						<el-input v-model="editForm.idNo" placeholder="身份证号" :maxlength="50"  ></el-input>
					</el-form-item> 
					
					<el-form-item label="到期日期" prop="idEtime">
						<el-input v-model="editForm.idEtime" placeholder="身份证到期日期" :maxlength="20"  ></el-input>
					</el-form-item>  
				</el-form-item>
				
				
				<el-form-item label="企业认证"  v-if="editForm.isOrg=='1'">
					<el-form-item label="营业执照" prop="bizLicense">
						<div v-if="editForm.bizLicense"><img   width="480" :src="editForm.bizLicense"/></div>
						<el-input v-model="editForm.uscc" placeholder="统一信用代码号税号营业执照号等" :maxlength="255"  ></el-input>
					</el-form-item>    
					<el-form-item label="机构实名名称" prop="actBname">
						<el-input v-model="editForm.actBname" placeholder="机构实名名称" :maxlength="255" ></el-input>
					</el-form-item>  
				</el-form-item>
				<el-form-item label="新增时间" prop="ctime">
					 {{editForm.ctime}}
				</el-form-item> 
				<el-form-item label="修改时间" prop="ltime">
					 {{editForm.ltime}}
				</el-form-item>  
				<el-form-item label="审核状态" prop="flowState">  
					<mdp-select item-code="bizFlowState" v-model="editForm.flowState"/>
 				</el-form-item>  
				<el-form-item label="审核原因说明" prop="validRemarks">
					<el-input type="textarea" rows="6" v-model="editForm.validRemarks" placeholder="审核原因说明" :maxlength="255" ></el-input>
				</el-form-item>  
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as UserValidInfoApi from '@/api/mdp/sys/userValidInfo';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'userValidInfoForm',
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
            pkNames:["userid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                userid:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                userid:'',idFront:'',idBack:'',idHold:'',bizLicense:'',oths:'',idNo:'',idEtime:'',uscc:'',actBname:'',actUname:'',ctime:'',ltime:'',flowState:'',isOrg:'',validRemarks:'',branchId:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: UserValidInfoApi.queryUserValidInfoById,
                add: UserValidInfoApi.addUserValidInfo,
                edit: UserValidInfoApi.editUserValidInfo,
                editSomeFields: UserValidInfoApi.editSomeFieldsUserValidInfo
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