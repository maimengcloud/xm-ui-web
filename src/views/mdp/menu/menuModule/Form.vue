<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 MenuModule 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="模块编号" prop="id" v-if="currOpType==='add'">
					<el-input v-model="editForm.id" placeholder="模块编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="模块名称"> 
					<el-form-item label="" prop="name" label-width="1px">
						<el-input v-model="editForm.name" placeholder="模块名称" :maxlength="50">
							<template slot="prepend" >
								<span v-if="currOpType==='edit'"> {{editForm.id}}</span>
							</template>
						</el-input>
					</el-form-item>  
				</el-form-item> 
				
				<el-form-item label="模块分类" prop="mcate">  
					<mdp-select show-style="tag" item-code="mcate" v-model="editForm.mcate"/>
 				</el-form-item> 
				<el-form-item label="计费模式" prop="billMode">  
					<mdp-select show-style="tag" item-code="moduleBillMode" v-model="editForm.billMode"/>
 				</el-form-item>  
				<el-form-item label="人天费用" prop="uniFee" v-if="editForm.billMode=='1' ||editForm.billMode=='3'">
					<el-input v-model="editForm.uniFee" placeholder="人天费用" :maxlength="10">
						<template slot="append">元每人每天</template>
					</el-input>
				</el-form-item>  
				<el-form-item label="模块费用" prop="fee"  v-if="editForm.billMode=='2'">
					<el-input v-model="editForm.fee" placeholder="模块费用" :maxlength="10">
						<template slot="append">元</template>
					</el-input> 
				</el-form-item>  
				<el-form-item label="人数折扣"  v-if="editForm.billMode!=='0'">
					<el-input  type="textarea"  :rows="4" v-model="discount.userNum" placeholder="" :maxlength="255"></el-input> 
					<br><font  color="blue">请输入人数折扣规则： 格式 开始人数-结束人数&nbsp;:&nbsp;折扣率 &nbsp;折扣率1-100之间，100代表不打折</font>
					<br><font  color="blue">例子：一行代表一个规则</font>
					<br><font  color="blue">0-20:100</font> 
					<br><font  color="blue">20-50:95</font>
					<br><font  color="blue">50-100:90</font>
				</el-form-item> 
				
				<el-form-item label="天数折扣"  v-if="editForm.billMode!=='0'">
					<el-input  type="textarea"  :rows="4" v-model="discount.days" placeholder="" :maxlength="255"></el-input> 
					<br><font  color="blue">请输入天数折扣规则： 格式 购买开始天数-结束天数&nbsp;:&nbsp;折扣率 &nbsp;折扣率1-100之间，100代表不打折</font>
					<br><font  color="blue">例子：一行代表一个规则</font>
					<br><font  color="blue">0-90:100</font> 
					<br><font  color="blue">90-180:90</font>
					<br><font  color="blue">180-360:80</font>
				</el-form-item> 
				<!--
				<el-form-item label="匹配的url" prop="url">
					<el-input  type="textarea"  :rows="4" v-model="editForm.url" placeholder="匹配的url,如果匹配得到，则计费，以逗号分割多个" :maxlength="255"></el-input>
					<br><font  color="blue">比如 /mdp/xm/**  代表前缀为mdp/xm的所有请求都登记到本模块下。*代表一个字符，**代表多个任意字符包括多级路径</font>
				</el-form-item> 
				<el-form-item label="忽略url" prop="ignoreUrl">
					<el-input  type="textarea"  :rows="4" v-model="editForm.ignoreUrl" placeholder="匹配这个地址的不计费" :maxlength="255"></el-input>
					<br><font color="blue">比如 /mdp/xm/xxx/**  代表前缀为/mdp/xm/xxx 的所有请求都不进行登记. *代表一个字符，**代表多个任意字符包括多级路径</font>
				</el-form-item> 
				-->
				<el-form-item label="审核状态" prop="bizFlowState"> 
					<mdp-select show-style="tag" item-code="bizFlowState" v-model="editForm.bizFlowState" :disabled="true"/>  
				</el-form-item>  
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
            <el-button v-if="currOpType='detail'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as MenuModuleApi from '@/api/mdp/menu/menuModule';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'menuModuleForm',
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
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                id:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',url:'',ignoreUrl:'',bizFlowState:'',procInstId:'',status:'',mcate:'',logoUrl:'',feeDesc:'',udisRate:'',udis:'',saleDesc:'',ucheck:'',crowd:'',seq:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: MenuModuleApi.queryMenuModuleById,
                add: MenuModuleApi.addMenuModule,
                edit: MenuModuleApi.editMenuModule,
                editSomeFields: MenuModuleApi.editSomeFieldsMenuModule
            },
            discount:{
                days: "0-90:100\n90-180:90\n180-360:80",
                userNum: "0-10:100\n10-50:98\n50-100:95"
            },
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){ 
            if(this.subOpType!='add'){
                if(this.editForm.discount){
                    this.discount=JSON.parse(this.editForm.discount)
                }
            }
            
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){  
            params.discount = JSON.stringify(this.discount);
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