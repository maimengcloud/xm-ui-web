<template>
    	<section class="border padding">
		<el-row>
            <mdp-select v-model="filters['category']" clearable filterable placeholder="选择分类" :load-fun="listCategorys"/> 
 
			<el-input v-model="filters.id" style="width: 15%;" placeholder="编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.key" style="width: 15%;" placeholder="编码查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.name" style="width: 15%;" placeholder="名称查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

  			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
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
			<!--列表 Deployment act_re_deployment-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
 				<el-table-column prop="name"  label="模型名称" fixed="left" min-width="300" show-overflow-tooltip col-type="String" v-if="showCol('name')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.name"  :maxlength="255" @change="editSomeFields(scope.row,'name',$event)" :disabled="!editable || disabledJudge('name')"/>
				    </template>
				</el-table-column>
                <el-table-column prop="id" label="发布编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>

				<el-table-column prop="deployTime"  label="发布时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('deployTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.deployTime" @change="editSomeFields(scope.row,'deployTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('deployTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="category"  label="模型分类" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('category')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.category" :maxlength="255" @change="editSomeFields(scope.row,'category',$event)" :disabled="!editable || disabledJudge('category')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="key"  label="模型编码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('key')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.key" :maxlength="64" @change="editSomeFields(scope.row,'key',$event)" :disabled="!editable || disabledJudge('key')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tenantId"  label="机构号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tenantId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tenantId" :maxlength="64" @change="editSomeFields(scope.row,'tenantId',$event)" :disabled="!editable || disabledJudge('tenantId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="derivedFrom"  label="发布方" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('derivedFrom')&&false">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.derivedFrom" :maxlength="64" @change="editSomeFields(scope.row,'derivedFrom',$event)" :disabled="!editable || disabledJudge('derivedFrom')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="derivedFromRoot"  label="发布方根" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('derivedFromRoot')&&false">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.derivedFromRoot" :maxlength="64" @change="editSomeFields(scope.row,'derivedFromRoot',$event)" :disabled="!editable || disabledJudge('derivedFromRoot')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="parentDeploymentId"  label="上级发布编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('parentDeploymentId')&&false">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.parentDeploymentId" :maxlength="64" @change="editSomeFields(scope.row,'parentDeploymentId',$event)" :disabled="!editable || disabledJudge('parentDeploymentId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="engineVersion"  label="引擎版本号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('engineVersion')&&false">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.engineVersion" :maxlength="255" @change="editSomeFields(scope.row,'engineVersion',$event)" :disabled="!editable || disabledJudge('engineVersion')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?200:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
                        <el-button type="danger" @click="handleDel(scope.row,scope.$index)">下架当前版本</el-button> 
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
	</section>
</template>

<script>

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as DeploymentApi from '@/api/mdp/workflow/re/deployment';
 import { mapGetters } from 'vuex'
 import {  listCategorys  } from "@/api/mdp/workflow/re/procdef";

export default {
    name:'deploymentMng',
    mixins:[MdpTableMixin],
    props:{
        modelKey:{
            type:String
        }
    },
    components: {
     },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'act_re_deployment',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'deployment',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            editable:false,//是否可编辑模式

            //增删改查(含批量)接口
            apis:{
                list: DeploymentApi.listDeployment,
                add: DeploymentApi.addDeployment,
                del: DeploymentApi.delDeployment,
                edit: DeploymentApi.editDeployment,
                editSomeFields: DeploymentApi.editSomeFieldsDeployment,
                batchAdd: DeploymentApi.batchAddDeployment,
                batchDel: DeploymentApi.batchDelDeployment,
                batchEdit: DeploymentApi.batchEditDeployment,
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
            if(this.modelKey){
                params.key=this.modelKey
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
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>