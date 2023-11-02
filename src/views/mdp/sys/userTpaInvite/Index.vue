<template>
    	<section class="border padding">
		<el-row>
            <mdp-select show-style="origin" placeholder="状态" item-code="invite_state" v-model="filters.inviteState"/>
            <mdp-select show-style="origin" placeholder="场景"  item-code="invite_scene" v-model="filters.inviteScene"/>
            <mdp-select show-style="origin" placeholder="渠道" item-code="invite_type" v-model="filters.inviteType"/>

			<el-input v-model="filters.inviteId" style="width: 20%;" placeholder="邀请码 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
 			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="showInvite({inviteType:'ewCode'})" icon="el-icon-plus">邀请新用户</el-button>
                <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
            </span>
            <span style="float:right;" v-else-if="currOpType=='select' &&  this.multiple==true">
                <el-button :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="el-icon-check"/>
            </span>
		</el-row>
		<el-row> 
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
		</el-row>
		<el-row>
			<!--列表 UserTpaInvite 第三方邀请加入流水表，send_branch_id+join_userid唯一索引-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="inviteId" label="邀请码" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('inviteId')"></el-table-column>

				<el-table-column prop="sendBranchName"  label="发起企业名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sendBranchName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.sendBranchName" :maxlength="255" @change="editSomeFields(scope.row,'sendBranchName',$event)" :disabled="!editable || disabledJudge('sendBranchName')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="sendUsername"  label="发起用户名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sendUsername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.sendUsername" :maxlength="255" @change="editSomeFields(scope.row,'sendUsername',$event)" :disabled="!editable || disabledJudge('sendUsername')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="joinUsername"  label="邀请的用户" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('joinUsername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.joinUsername" :maxlength="255" @change="editSomeFields(scope.row,'joinUsername',$event)" :disabled="!editable || disabledJudge('joinUsername')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="sendTime"  label="邀请时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('sendTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.sendTime" @change="editSomeFields(scope.row,'sendTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('sendTime')"/>
				    </template>
				</el-table-column>
                
				<el-table-column prop="inviteState"  label="邀请状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('inviteState')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="invite_state" v-model="scope.row.inviteState" :maxlength="255" @change="editSomeFields(scope.row,'inviteState',$event)" :disabled="disabledJudge('inviteState')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="inviteScene"  label="邀请场景" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('inviteScene')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="invite_scene" v-model="scope.row.inviteScene" :maxlength="255" @change="editSomeFields(scope.row,'inviteScene',$event)" :disabled="!editable || disabledJudge('inviteScene')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="inviteType"  label="邀请渠道" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('inviteType')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="invite_type" v-model="scope.row.inviteType" :maxlength="255" @change="editSomeFields(scope.row,'inviteType',$event)" :disabled="!editable || disabledJudge('inviteType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="joinTime"  label="加入时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('joinTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.joinTime" @change="editSomeFields(scope.row,'joinTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('joinTime')"/>
				    </template>
				</el-table-column><el-table-column prop="sendBranchId"  label="发起企业编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sendBranchId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.sendBranchId" :maxlength="50" @change="editSomeFields(scope.row,'sendBranchId',$event)" :disabled="!editable || disabledJudge('sendBranchId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="sendUserid"  label="发起用户" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sendUserid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.sendUserid" :maxlength="50" @change="editSomeFields(scope.row,'sendUserid',$event)" :disabled="!editable || disabledJudge('sendUserid')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?380:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
                        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="$router.push({path:'/mdp/tpa/user/index/'+scope.row.inviteId})" icon="el-icon-user" title="已响应用户查询"/>
                        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="showInvite({inviteType:'ewCode',joinUserid:scope.row.joinUserid,joinUsername:scope.row.joinUsername})" icon="el-icon-share" title="分享链接"/>

                        
  				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"/>
				    </template>

				    <template scope="scope" v-else-if="currOpType=='list'" >
				        <el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-view"/>
 				    </template>

				    <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true" >
				        <el-button   type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check"/>
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
			<!--新增修改明细 UserTpaInvite 第三方邀请加入流水表，send_branch_id+join_userid唯一索引界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <user-tpa-invite-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog> 
 	    </el-row>
         <user-invite ref="userInvite"/>
	</section>
</template>

<script>

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as UserTpaInviteApi from '@/api/mdp/sys/userTpaInvite';
import  UserTpaInviteForm from './Form';//新增修改明细界面 
import  UserTpaIndex from '../userTpa/Index';//第三方用户查询
import { mapGetters } from 'vuex'

import UserInvite from "../user/UserInvite"; //新增界面 
export default {
    name:'userTpaInviteMng',
    mixins:[MdpTableMixin],
    components: {
        UserTpaInviteForm,UserTpaIndex,UserInvite
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'第三方邀请加入流水表，send_branch_id+join_userid唯一索引',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'userTpaInvite',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["inviteId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            editable:false,//是否可编辑模式

            //增删改查(含批量)接口
            apis:{
                list: UserTpaInviteApi.listUserTpaInvite,
                add: UserTpaInviteApi.addUserTpaInvite,
                del: UserTpaInviteApi.delUserTpaInvite,
                edit: UserTpaInviteApi.editUserTpaInvite,
                editSomeFields: UserTpaInviteApi.editSomeFieldsUserTpaInvite,
                batchAdd: UserTpaInviteApi.batchAddUserTpaInvite,
                batchDel: UserTpaInviteApi.batchDelUserTpaInvite,
                batchEdit: UserTpaInviteApi.batchEditUserTpaInvite,
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
        
		
		showInvite(params){
			this.$refs['userInvite'].show(params)
		}
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>