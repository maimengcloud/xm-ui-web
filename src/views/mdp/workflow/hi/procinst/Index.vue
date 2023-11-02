<template>
    	<section class="border padding">
		<el-row>
            <mdp-select-cate v-model="filters['categoryId']" width="8em" clearable filterable placeholder="选择归档" />  

            <mdp-select v-model="filters['pd.category_']" clearable filterable placeholder="选择分类" class="hidden-sm-and-down" :load-fun="listCategorys"/> 
            <mdp-select-tag v-model="filters['tagIds']" clearable filterable placeholder="标签" />  
            <el-input v-model="filters['res.name']" style="width: 10%;" placeholder="名字查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

            <el-input v-model="filters['p.startUsername']" style="width: 10%;" placeholder="发起人查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

            <el-input v-model="filters['p.startDeptName']" style="width: 10%;" placeholder="发起部门查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
 			<el-button v-loading="load.list" :disabled="  load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
                 <el-button :disabled="   disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
            </span>
            <span style="float:right;" v-else-if="currOpType=='select' &&  this.multiple==true">
                <el-button :disabled=" disabledJudge('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="el-icon-check"/>
            </span>
		</el-row>
		<el-row> 
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
		</el-row>
		<el-row>
			<!--列表 Procinst act_hi_procinst-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				
				<el-table-column prop="name"  label="流程名称" min-width="300" show-overflow-tooltip col-type="String" v-if="showCol('name')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.name" :maxlength="255" @change="editSomeFields(scope.row,'name',$event)" :disabled=" !editable || disabledJudge('name')"/>
				    </template>
				</el-table-column>
                <el-table-column sortable prop="startDeptName" label="发起部门" min-width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column sortable prop="startUsername" label="发起人" min-width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column  prop="tagNames" label="标签" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <mdp-select-tag show-style="tag" v-model="scope.row.tagIds" clearable filterable placeholder="标签" multiple split="," :disabled="true"/>   
                    </template>
                </el-table-column>
				<el-table-column prop="startTime"  label="开始时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('startTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.startTime" @change="editSomeFields(scope.row,'startTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled=" !editable || disabledJudge('startTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="endTime"  label="结束时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('endTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.endTime" @change="editSomeFields(scope.row,'endTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled=" !editable || disabledJudge('endTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="duration"  label="耗时" min-width="120" show-overflow-tooltip col-type="Long" v-if="showCol('duration')" :formatter="formatterDuration">
 
				</el-table-column>            
                <el-table-column sortable prop="sponsors" label="主办" min-width="80" show-overflow-tooltip></el-table-column>
                 <el-table-column sortable prop="monitors" label="监控" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="startUserId"  label="发起人" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('startUserId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.startUserId" :maxlength="64" @change="editSomeFields(scope.row,'startUserId',$event)" :disabled=" !editable || disabledJudge('startUserId')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="tenantId"  label="归属机构" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tenantId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tenantId" :maxlength="64" @change="editSomeFields(scope.row,'tenantId',$event)" :disabled=" !editable || disabledJudge('tenantId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="procInstId"  label="实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('procInstId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.procInstId" :maxlength="64" @change="editSomeFields(scope.row,'procInstId',$event)" :disabled=" !editable || disabledJudge('procInstId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="procDefId"  label="流程编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('procDefId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.procDefId" :maxlength="64" @change="editSomeFields(scope.row,'procDefId',$event)" :disabled=" !editable || disabledJudge('procDefId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="callbackId"  label="回调编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('callbackId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.callbackId" :maxlength="64" @change="editSomeFields(scope.row,'callbackId',$event)" :disabled=" !editable || disabledJudge('callbackId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="callbackType"  label="回调类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('callbackType')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.callbackType" :maxlength="255" @change="editSomeFields(scope.row,'callbackType',$event)" :disabled=" !editable || disabledJudge('callbackType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="startActId"  label="发起节点编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('startActId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.startActId" :maxlength="64" @change="editSomeFields(scope.row,'startActId',$event)" :disabled=" !editable || disabledJudge('startActId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="businessKey"  label="业务编码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('businessKey')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.businessKey" :maxlength="64" @change="editSomeFields(scope.row,'businessKey',$event)" :disabled=" !editable || disabledJudge('businessKey')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="superProcessInstanceId"  label="上级实例" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('superProcessInstanceId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.superProcessInstanceId" :maxlength="64" @change="editSomeFields(scope.row,'superProcessInstanceId',$event)" :disabled=" !editable || disabledJudge('superProcessInstanceId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="deleteReason"  label="删除原因" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deleteReason')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deleteReason" :maxlength="4000" @change="editSomeFields(scope.row,'deleteReason',$event)" :disabled=" !editable || disabledJudge('deleteReason')"/>
				    </template>
				</el-table-column>
                <el-table-column prop="rev"  label="版本" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('rev')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.rev" @change="editSomeFields(scope.row,'rev',$event)" :precision="0" :disabled=" !editable || disabledJudge('rev')"/>
				    </template>
				</el-table-column>
                <el-table-column prop="id" label="编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>

				<el-table-column label="操作" :width="currOpType=='mng'?200:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="  disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'任务详情'})" icon="el-icon-edit" title="修改一条数据"/>
 				        <el-button :disabled="  disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"/>
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
			<!--新增修改明细 Procinst act_hi_procinst界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                    <procinst-parames-execution-set v-if="data.formData"
                        :taskInfo="data.formData" :procDefId="data.formData.procDefId" :procInstId="data.formData.procInstId"
                        :visible="visible" @cancel="dialog.close()" @submit="afterEditSubmit"/> 
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>
import ProcinstParamesExecutionSet from "../../ru/procinstParames/ProcinstParamesExecutionSet"; //流程参数加载

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as ProcinstApi from '@/api/mdp/workflow/hi/procinst';
 import { mapGetters } from 'vuex'
 import {
    listCategorys
  } from "@/api/mdp/workflow/re/procdef";
export default {
    name:'procinstMng',
    mixins:[MdpTableMixin],
    components: {
        ProcinstParamesExecutionSet
    }, 
    props: ["isMyMonitors", "isMyStart", "isMySponsors", "isMyPartake", "isAll",'bizParentPkid','bizPkid','procInstIds'], 
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'act_hi_procinst',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'procinst',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            editable:false,

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: ProcinstApi.listProcinst,
                add: ProcinstApi.addProcinst,
                del: ProcinstApi.delProcinst,
                edit: ProcinstApi.editProcinst,
                editSomeFields: ProcinstApi.editSomeFieldsProcinst,
                batchAdd: ProcinstApi.batchAddProcinst,
                batchDel: ProcinstApi.batchDelProcinst,
                batchEdit: ProcinstApi.batchEditProcinst,
            }
        }
    },
    methods: {
            listCategorys,
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
             

            if ( this.isMyStart ) {
                params.startUserId = this.userInfo.userid
            }
            if (this.isMyPartake) {
                params.partake = this.userInfo.userid
            }
            if (this.isMySponsors) {
                params.sponsors = '*' + this.userInfo.userid + '*'
            }
            if (this.isMyMonitors ) {
                params.monitors = '*' + this.userInfo.userid + '*'
            } 
            
            if(this.bizParentPkid){
                params.bizParentPkid=this.bizParentPkid
            }
            if(this.bizPkid){
                params.bizPkid=this.bizPkid
            } 
            if(this.procInstIds){
                params.procInstId="$IN"+this.procInstIds
            }
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
        formatterDuration(row, column, cellValue) {
        if (cellValue != null && cellValue != "") {
          if (cellValue < 1000 * 60) {
            return (cellValue / 1000).toFixed(0) + "秒";
          } else if (cellValue < 1000 * 60 * 60) {
            return (cellValue / 1000 / 60).toFixed(2) + "分";
          } else if (cellValue < 1000 * 60 * 60 * 24) {
            return (cellValue / 1000 / 60 / 60).toFixed(2) + "小时";
          } else if (cellValue < 1000 * 60 * 60 * 24 * 30) {
            return (cellValue / 1000 / 60 / 60 / 24).toFixed(2) + "天";
          } else {
            return (cellValue / 1000 / 60 / 60 / 24 / 30).toFixed(2) + "月";
          }
        } else {
          return cellValue;
        }
      },
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>