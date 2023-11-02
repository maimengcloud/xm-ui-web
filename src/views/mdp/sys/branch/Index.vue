<template>
	<section class="border padding">
		<el-row>
			<el-input v-model="filters.branchId" style="width: 20%;" placeholder="编号查询 输入 *陈* >10 <9 等" clearable  title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
			<el-input v-model="filters.branchName" style="width: 20%;" placeholder="名称查询 输入 *陈* >10 <9 等" clearable  title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
            <el-input v-model="filters.bcode" style="width: 20%;" placeholder="统一信用识别号查询 输入 *陈* >10 <9 等" clearable  title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
                    
            <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
			    <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm})" icon="el-icon-plus"> </el-button>
			    <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"></el-button>
		    </span>
            <span style="float:right;" v-else-if="currOpType=='select' &&  this.multiple==true">
 			    <el-button :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="el-icon-check"></el-button>
		    </span>
		</el-row>
		<el-row> 
                <mdp-hi-query type="text" :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
                <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button> 
		</el-row>
		<el-row>
			<!--列表 Branch 管理端机构表（机构下面若干部门）-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: 50}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="id" label="机构编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>
				<el-table-column prop="branchName"  label="机构名称" min-width="120" show-overflow-tooltip fixed="left" col-type="String" v-if="showCol('branchName')"></el-table-column>
                <el-table-column prop="bcode"  label="统一信用识别号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bcode')"></el-table-column>
                <el-table-column prop="enabled"  label="可用" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('enabled')">
                    <template slot-scope="scope">
                        <mdp-select show-style="tag" item-code="enabled" v-model="scope.row.enabled" @change="editSomeFields(scope.row,'enabled',$event)"/> 
                    </template>
                </el-table-column>
				<el-table-column prop="industryCategory"  label="行业分类" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('industryCategory')" >
                   
                    <template slot-scope="scope"> 
                        <mdp-select show-style="tag" :disabled="false" item-code="industryCategory" v-model="scope.row.industryCategory" @change="editSomeFields(scope.row,'industryCategory',$event)"/>
                    </template>

                </el-table-column>
				<el-table-column prop="lphoneNo"  label="联系电话" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lphoneNo')"></el-table-column>
				<el-table-column prop="emaill"  label="邮件" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('emaill')"></el-table-column>
				<el-table-column prop="bizFlowState"  label="审批状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizFlowState')"></el-table-column>
				<el-table-column prop="legalPerson"  label="法人名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('legalPerson')"></el-table-column>
				<el-table-column prop="regCapital"  label="注册资本" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('regCapital')"></el-table-column>
				<el-table-column prop="remark"  label="企业简介" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('remark')"></el-table-column>
                <el-table-column prop="admUserid"  label="管理员编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('admUserid')"></el-table-column>
				<el-table-column prop="admUsername"  label="管理员名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('admUsername')"></el-table-column>
				<el-table-column prop="lusername"  label="联系人姓名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lusername')"></el-table-column>
				<el-table-column prop="luserid"  label="联系人编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('luserid')"></el-table-column>
				<el-table-column prop="address"  label="公司地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('address')"></el-table-column>
				<el-table-column prop="imgUrl"  label="企业头像" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('imgUrl')"></el-table-column>
				<el-table-column prop="blicense"  label="营业执照图片" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('blicense')"></el-table-column>
				<el-table-column prop="validLvls"  label="人工验证结果" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('validLvls')"></el-table-column>
				<el-table-column prop="cuserid"  label="创建人编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cuserid')"></el-table-column>
				<el-table-column prop="cdate" :is-common="true" label="创建日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('cdate')"></el-table-column>
				<el-table-column prop="cusername"  label="创建人姓名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cusername')"></el-table-column>
                <el-table-column prop="bizProcInstId"  label="当前流程实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizProcInstId')"></el-table-column>
				<el-table-column prop="pbranchId"  label="上级机构" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pbranchId')"></el-table-column>
				<el-table-column prop="btype"  label="机构类别" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('btype')"></el-table-column>
				<el-table-column prop="claimStatus"  label="认领状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('claimStatus')"></el-table-column>

                <el-table-column label="操作" width="280" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'">
                        <el-button v-if=" scope.row.claimStatus!='1' " :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="success" @click="branchClaim(scope.row)" icon="el-icon-s-check">认领</el-button>

				        <el-button v-if="userInfo.branchId==scope.row.id || userInfo.isSuperAdmin " :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="el-icon-edit"></el-button>
				        <el-button v-if="userInfo.branchId==scope.row.id || userInfo.isSuperAdmin "  :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
                        <el-button v-if="userInfo.branchId!=scope.row.id && !userInfo.isSuperAdmin " :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-edit"></el-button>

				    </template>
				    <template scope="scope" v-else-if="currOpType=='mng' && userInfo.branchId!=scope.row.id"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-edit"></el-button>
 				    </template>
				    <template scope="scope" v-else-if="currOpType=='list'" >
				        <el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-view"></el-button>
 				    </template>
				    <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true" >
				        <el-button   type="primary" @click="selectConfirm(scope.row)" icon="el-icon-view"></el-button>
 				    </template>
				</el-table-column>
			</el-table>
		</el-row>
        
		<el-row> 
			<el-pagination
				layout="slot,total, sizes, prev, next,pager,jumper"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-sizes="[10,20, 50, 100, 500]"
				:current-page="pageInfo.pageNum"
				:page-size="pageInfo.pageSize"
				:total="pageInfo.total"
				style="float:right;"
			> 
			</el-pagination>
		</el-row>
		<el-row>
			<!--新增修改明细 Branch 管理端机构表（机构下面若干部门）界面--> 
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data}">
			        <branch-form :ref="refId+'Form'" :show-btn="false" :sub-op-type="data.subOpType" :form-data="data.formData" :visible="visible" :parent-op-type="currOpType" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
                <template v-slot:footer="{data}"> 
                    <el-button @click="$refs[refId+'FormDialog'].close()">关闭</el-button>
                    <el-button v-if="data.subOpType=='add'" :disabled=" disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="$refs[refId+'Form'].saveSubmit()">提交</el-button>
                 </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as BranchApi from '@/api/mdp/sys/branch';
import  BranchForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'
import * as UserTpaInviteApi from '@/api/mdp/sys/userTpaInvite';

export default {
    name:'branchMng',
    mixins:[MdpTableMixin],
    components: {
        BranchForm,
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'管理端机构表（机构下面若干部门）',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'branch',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },
            //增删改查(含批量)接口
            apis:{
                list: BranchApi.listBranch,
                add: BranchApi.addBranch,
                del: BranchApi.delBranch,
                edit: BranchApi.editBranch,
                editSomeFields: BranchApi.editSomeFieldsBranch,
                batchAdd: BranchApi.batchAddBranch,
                batchDel: BranchApi.batchDelBranch,
                batchEdit: BranchApi.batchEditBranch,
            }
        }
    },
    methods: {
         //页面初始化需要配置的特殊逻辑写这里
         initCurrData(){
            this.searchTableDatas();
         },

         /**
          * 检查参数是否满足调用后台接口的条件
          *
          * @param params 提交给后台的参数池,map类型
          * @returns true / false
          */
         preQueryParamCheck(params){
             return true;
         },

         //页面数据加载完后需要对数据进行加工处理的
         afterList(res,isOk,apiName){

         },

         /**
          * 对修改的字段进行判断，返回false ,将取消更新数据库
          * @param {*} row 当前选中的行
          * @param {*} fieldName 修改的字段名
          * @param {*} $event 修改后的值
          * @param {*} params 将要提交服务器的参数
          * @returns true/false 返回false ,将取消更新数据库
          */
         editSomeFieldsCheck(row,fieldName,$event,params){
             if(this.currOpType=='add'||this.currOpType=='detail'){
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
            if(this.currOpType=='list'){
                disabledRules.addBtn=true
                disabledRules.delBtn=true
            }
         },
         /**
          * 打开某个子页面
          */
        openForm(res){
            let {parentOpType,formRefId,subOpType,formData} = res
            if(!formRefId){
                formRefId=this.getRefId()+"FormDialog"
            }
            if(!parentOpType){
                parentOpType=this.currOpType
            }
            var form=this.$refs[formRefId]
            if(form){
                res.parentOpType=parentOpType
                res.formRefId=formRefId
                form.open(res);
            }else{

            }

        },
        branchClaim(branch){
            this.$confirm('请确保该企业确实属于您的企业，一旦成功，别人无法再次认领，确认认领企业【'+branch.branchName+'】吗？', '提示', {}).then(() => { 
                var params={sendBranchId:branch.id,sendBranchName:branch.sendBranchName,joinUserid:this.userInfo.userid,joinUsername:this.userInfo.username,inviteScene:'4',inviteType:'1'}
                UserTpaInviteApi.createInviteId(params).then(res=>{
 					var tips = res.data.tips;
					if(tips.isOk){ 
                        this.$router.push({path:"/mdp/tpa/invite/code/"+res.data.data.inviteId})
                    }else{
                        this.$notify.error(tips.msg)
                    }
                })
                
            })
        }
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>