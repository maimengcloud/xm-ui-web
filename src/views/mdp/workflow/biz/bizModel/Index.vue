<template>
    	<section class="border padding">
		<el-row>
            <mdp-select-cate v-model="filters['categoryId']" width="8em" clearable filterable placeholder="选择归档" />  
            <mdp-select v-model="filters['category']" width="8em" clearable filterable placeholder="选择分类" :load-fun="listCategorys"/>  
            <mdp-select-tag v-model="filters['tagIds']" width="8em" clearable filterable placeholder="标签" /> 

            <el-input v-model="filters.bizKey" style="width: 10%;" placeholder="业务编码查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.bizName" style="width: 10%;" placeholder="业务名称查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.modelKey" style="width: 10%;" placeholder="模型编码查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.modelName" style="width: 10%;" placeholder="模型名称查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

  			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			
            <span style="float:right;" v-if="currOpType=='select' &&  this.multiple==true">
                <el-button :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="el-icon-check"/>
            </span>
		</el-row>
		<el-row> 
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
            <span v-if="bizKey && tableDatas.length==0"> 
                <el-tag type="info" >如果没有找到流程，请通过 <el-button  type="text" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})" icon="el-icon-plus">增加</el-button> 将业务编码【{{bizKey}}】与流程模型进行关联</el-tag>
                
            </span>
            
            <span style="float:right;" v-if="currOpType=='mng'">
                    <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})" icon="el-icon-plus"/>
                    <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
            </span>
		</el-row>
		<el-row>
			<!--列表 BizModel 业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="bizName"  label="业务名称" min-width="300" show-overflow-tooltip col-type="String" v-if="showCol('bizName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.bizName" :maxlength="255" @change="editSomeFields(scope.row,'bizName',$event)" :disabled="!editable || disabledJudge('bizName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tagNames"  label="标签" min-width="220" show-overflow-tooltip col-type="String">
				    <template slot-scope="scope">
                        <mdp-select-tag show-style="tag" v-model="scope.row.tagIds" clearable filterable placeholder="标签" multiple split="," :disabled="true"/>   
 				    </template>
				</el-table-column>
				<el-table-column prop="bizKey"  label="业务编码" min-width="220" show-overflow-tooltip col-type="String" v-if="showCol('bizKey')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.bizKey" :maxlength="255" @change="editSomeFields(scope.row,'bizKey',$event)" :disabled="!editable || disabledJudge('bizKey')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="modelName"  label="模型名称" min-width="220" show-overflow-tooltip col-type="String" v-if="showCol('modelName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.modelName" :maxlength="255" @change="editSomeFields(scope.row,'modelName',$event)" :disabled="!editable || disabledJudge('modelName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="modelKey"  label="模型编码" min-width="220" show-overflow-tooltip col-type="String" v-if="showCol('modelKey')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.modelKey" :maxlength="255" @change="editSomeFields(scope.row,'modelKey',$event)" :disabled="!editable || disabledJudge('modelKey')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="branchId"  label="机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.branchId" :maxlength="50" @change="editSomeFields(scope.row,'branchId',$event)" :disabled="!editable || disabledJudge('branchId')"/>
				    </template>
				</el-table-column>
                <el-table-column prop="id" label="编号" min-width="120" show-overflow-tooltip    col-type="String" v-if="showCol('id')"></el-table-column>

				<el-table-column label="操作" :width="currOpType=='mng'?200:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})" icon="el-icon-edit" title="修改一条数据"/>
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
			<!--新增修改明细 BizModel 业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <biz-model-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as BizModelApi from '@/api/mdp/workflow/biz/bizModel';
import  BizModelForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

import {  listCategorys  } from "@/api/mdp/workflow/re/procdef";
export default {
    name:'bizModelMng',
    mixins:[MdpTableMixin],
    props:{
        bizKey:String,
        modelKey:String,
        modelName:String,
        includeProcdef:String,//是否查询procdef表数据一并返回 1 是 0 否
        fp:String,//是否只查询能够直接无参数启动的流程，1 是，0否
    },
    components: {
        BizModelForm,
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'bizModel',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
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
                list: BizModelApi.listBizModel,
                add: BizModelApi.addBizModel,
                del: BizModelApi.delBizModel,
                edit: BizModelApi.editBizModel,
                editSomeFields: BizModelApi.editSomeFieldsBizModel,
                batchAdd: BizModelApi.batchAddBizModel,
                batchDel: BizModelApi.batchDelBizModel,
                batchEdit: BizModelApi.batchEditBizModel,
            }
        }
    },
    methods: {
        listCategorys,
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
             this.searchTableDatas();
             this.addForm.bizKey=this.bizKey
             this.addForm.modelKey=this.modelKey
             this.addForm.modelName=this.modelName
          },

          /**
           * 检查参数是否满足调用后台接口的条件
           *
           * @param params 提交给后台的参数池,map类型
           * @returns true / false
           */
          preQueryParamCheck(params){
            if(this.bizKey){
                params.bizKey=this.bizKey
            }
            if(this.modelKey){
                params.modelKey=this.modelKey
            }  
            if(this.fp){
                params.fp=this.fp
            }
            if(this.includeProcdef){
                params.includeProcdef=this.includeProcdef
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