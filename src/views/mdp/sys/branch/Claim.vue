<template>
<section>
 	    <el-row>
		<!--新增/编辑界面 Branch 管理端机构表（机构下面若干部门）-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="机构编号" prop="id">
					<el-input v-model="editForm.id" placeholder="机构编号" :maxlength="50" :disabled="disabledJudge('id')" v-if="currOpType=='add'"></el-input>
 					<br/><font color="red">机构号  {{editForm.id}}  将作为该机构的管理员登录账号</font>
				</el-form-item> 
				<el-form-item label="机构名称" prop="branchName">
					<el-input v-model="editForm.branchName" placeholder="机构名称" :maxlength="50" @change="editSomeFields(editForm,'branchName',$event)" :disabled="disabledJudge('branchName')"></el-input>
				</el-form-item> 
				<el-form-item label="是否可用" prop="enabled">
					<mdp-select item-code="enabled" v-model="editForm.enabled" @change="editSomeFields(editForm,'enabled',$event)" :disabled="disabledJudge('enabled')"/>
 				</el-form-item> 
				<el-form-item label="行业分类" prop="industryCategory" >
 					<mdp-select item-code="industryCategory" v-model="editForm.industryCategory" @change="editSomeFields(editForm,'industryCategory',$event)" :disabled="disabledJudge('industryCategory')"/>

				</el-form-item> 
				
				<el-form-item label="联系人姓名" prop="lusername">
					<el-input v-model="editForm.lusername" placeholder="联系人姓名" :maxlength="255" @change="editSomeFields(editForm,'lusername',$event)" :disabled="disabledJudge('lusername')"></el-input>
				</el-form-item> 
				<el-form-item label="联系人编号" prop="luserid">
					<el-input v-model="editForm.luserid" placeholder="联系人编号" :maxlength="50" @change="editSomeFields(editForm,'luserid',$event)" :disabled="disabledJudge('luserid')"></el-input>
				</el-form-item> 
				<el-form-item label="联系电话" prop="lphoneNo">
					<el-input v-model="editForm.lphoneNo" placeholder="联系电话" :maxlength="50" @change="editSomeFields(editForm,'lphoneNo',$event)" :disabled="disabledJudge('lphoneNo')"></el-input>
				</el-form-item> 
				<el-form-item label="邮件" prop="emaill">
					<el-input v-model="editForm.emaill" placeholder="邮件" :maxlength="50" @change="editSomeFields(editForm,'emaill',$event)" :disabled="disabledJudge('emaill')"></el-input>
				</el-form-item>  
				<el-form-item label="公司地址" prop="address">
					<el-input v-model="editForm.address" placeholder="公司地址" :maxlength="255" @change="editSomeFields(editForm,'address',$event)" :disabled="disabledJudge('address')"></el-input>
				</el-form-item>  
				<el-form-item label="税号" prop="bcode">
					<el-input v-model="editForm.bcode" placeholder="税号-统一信用识别号" :maxlength="255" @change="editSomeFields(editForm,'bcode',$event)" :disabled="disabledJudge('bcode')"></el-input>
				</el-form-item> 
				<el-form-item label="法人名称" prop="legalPerson">
					<el-input v-model="editForm.legalPerson" placeholder="法人名称" :maxlength="255" @change="editSomeFields(editForm,'legalPerson',$event)" :disabled="disabledJudge('legalPerson')"></el-input>
				</el-form-item> 
				<el-form-item label="注册资本" prop="regCapital">
					<el-input-number v-model="editForm.regCapital" placeholder="注册资本" :maxlength="20" :disabled="disabledJudge('regCapital')"></el-input-number>
				</el-form-item> 
				<el-form-item label="企业简介" prop="remark">
					<el-input v-model="editForm.remark" placeholder="企业简介"  @change="editSomeFields(editForm,'remark',$event)" :disabled="disabledJudge('remark')"></el-input>
				</el-form-item> 
				<el-form-item label="审核状态" prop="bizFlowState">
					<mdp-select show-style="tag" v-model="editForm.bizFlowState" item-code="bizFlowState" :disabled="disabledJudge('bizFlowState')||true"/>
 				</el-form-item>  
				<el-form-item label="管理员编号" prop="admUserid">
 					账号:&nbsp;<font style="font-size:10px;">{{editForm.admUserid}}</font> &nbsp; &nbsp;名称：&nbsp; <font style="font-size:10px;">{{editForm.admUsername}} </font>&nbsp;登录密码：<font style="font-size:10px;">{{currOpType==='add'?'888888':'*****'}}</font>
					<br/><font color="blue">管理员账户具有最高权限，仅作为内部管理权限使用，账户编号与机构号相同，不可修改</font>
				</el-form-item> 
				<el-form-item label="管理员名称" prop="admUsername">
					<el-input v-model="editForm.admUsername" placeholder="管理员名称" :maxlength="255" @change="editSomeFields(editForm,'admUsername',$event)" :disabled="disabledJudge('admUsername')"></el-input>
				</el-form-item> 
				<template v-if="currOpType!='add'">
					<el-form-item label="创建人编号" prop="cuserid">
						<el-input v-model="editForm.cuserid" placeholder="创建人编号" :maxlength="50" @change="editSomeFields(editForm,'cuserid',$event)" :disabled="disabledJudge('cuserid')"></el-input>
					</el-form-item> 
					<el-form-item label="创建人姓名" prop="cusername">
						<el-input v-model="editForm.cusername" placeholder="创建人姓名" :maxlength="50" @change="editSomeFields(editForm,'cusername',$event)" :disabled="disabledJudge('cusername')"></el-input>
					</el-form-item> 
					
					<el-form-item label="创建日期" prop="cdate">
						<el-date-picker type="date" placeholder="选择日期" v-model="editForm.cdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('cdate')"></el-date-picker>
					</el-form-item> 
				</template>
			</el-form>
		</el-row>

		<el-row  slot="footer"  v-if="showBtn!==false">
            <el-button @click.native="handleCancel">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>

		</el-row> 
</section>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as BranchApi from '@/api/mdp/sys/branch';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'branchForm',
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
                id:'',branchName:'',enabled:'',industryCategory:'',cuserid:'',cdate:'',cusername:'',lphoneNo:'',emaill:'',bizProcInstId:'',bizFlowState:'',pbranchId:'',admUserid:'',admUsername:'',lusername:'',luserid:'',address:'',btype:'',imgUrl:'',bcode:'',blicense:'',legalPerson:'',regCapital:'',remark:'',validLvls:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: BranchApi.queryBranchById,
                add: BranchApi.addBranch,
                edit: BranchApi.editBranch,
                editSomeFields: BranchApi.editSomeFieldsBranch
            }
        }
    },
    methods: {
        //页面初始化需要配置的特殊逻辑写这里
        initCurrData(){

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
             if(this.currOpType=='detail'){
                 return false;
             }
            params[fieldName]=$event
            return true;
        }, 
        /**
          * 设置某个关键词、按钮、输入框禁用 disabledRules['addBtn']=false
          * 判断某个对象是否可编辑 this.disabledJudge('addBtn')==false
          */
         disabledRulesInit(disabledRules){

         }
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>