<template>
	<section class="border padding">
		<el-row>
            <mdp-select v-model="filters.moduleId" :load-fun="listMenuModule" placeholder="模块"/> 
            <mdp-select item-code="qxType" v-model="filters.qxType" placeholder="权限类型"/>

			<el-input v-model="filters.key" style="width: 20%;" placeholder="名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
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
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
		</el-row>
		<el-row>
			<!--列表 Qx 权限定义-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="qxId" label="权限编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('qxId')"></el-table-column>
				<el-table-column prop="qxName"  label="权限名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('qxName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.qxName" :maxlength="250" @change="editSomeFields(editForm,'qxName',$event)" :disabled="disabledJudge('qxName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="qxType"  label="权限类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('qxType')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="qxType" v-model="scope.row.qxType" :maxlength="10" @change="editSomeFields(editForm,'qxType',$event)" :disabled="disabledJudge('qxType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="moduleId"  label="权限归属模块编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('moduleId')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" v-model="scope.row.moduleId" :load-fun="listMenuModule" :maxlength="50" @change="editSomeFields(editForm,'moduleId',$event)" :disabled="disabledJudge('moduleId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="qxSql"  label="权限sql片段" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('qxSql')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.qxSql" :maxlength="200" @change="editSomeFields(editForm,'qxSql',$event)" :disabled="disabledJudge('qxSql')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="el-icon-edit" title="修改一条数据"></el-button>
				        <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="success" @click="copy(scope.row)" icon="el-icon-document-copy" title="拷贝并新增一条除了主键不一样其它都一样的数据"></el-button>
				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"></el-button>
				    </template>

				    <template scope="scope" v-else-if="currOpType=='list'" >
				        <el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-view"></el-button>
 				    </template>

				    <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true" >
				        <el-button   type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check"></el-button>
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
			<!--新增修改明细 Qx 权限定义界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data}">
                    <qx-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields" :show-btn="false"/>
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
import * as QxApi from '@/api/mdp/sys/qx';
import  QxForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

import { listMenuModule } from '@/api/mdp/menu/menuModule';
export default {
    name:'qxMng',
    mixins:[MdpTableMixin],
    components: {
        QxForm,
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'权限定义',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'qx',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["qxId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: QxApi.listQx,
                add: QxApi.addQx,
                del: QxApi.delQx,
                edit: QxApi.editQx,
                editSomeFields: QxApi.editSomeFieldsQx,
                batchAdd: QxApi.batchAddQx,
                batchDel: QxApi.batchDelQx,
                batchEdit: QxApi.batchEditQx,
            }
        }
    },
    methods: {
        listMenuModule,
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
    },
    mounted() { 
    }
}

</script>

<style scoped>
</style>