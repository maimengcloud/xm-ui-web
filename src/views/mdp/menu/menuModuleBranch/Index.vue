<template>
	<section class="border padding">
		<el-row>
			<mdp-select show-style="origin" placeholder="状态" item-code="branchModuleStatus" v-model="filters.status"/>
			<mdp-select-table placeholder="机构选择" :props="{id:'id',name:'branchName'}" v-model="filters.branchId" :load-fun="$mdp.listBranch"></mdp-select-table>

			<el-input v-model="filters.moduleId" style="width: 20%;" placeholder="模块编号查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>

			<el-input v-model="filters.moduleName" style="width: 20%;" placeholder="模块名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm})" icon="el-icon-plus"/>
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
			<!--列表 MenuModuleBranch 机构开通模块对应关系表-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="branchId" label="机构编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('branchId')"></el-table-column>
				<el-table-column prop="moduleId" label="模块编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('moduleId')"></el-table-column>
				<el-table-column prop="moduleName"  label="模块名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('moduleName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.moduleName" :maxlength="255" @change="editSomeFields(editForm,'moduleName',$event)" :disabled="disabledJudge('moduleName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="startTime"  label="启用日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('startTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('startTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="endTime"  label="结束日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('endTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('endTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="status"  label="状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('status')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="branchModuleStatus" v-model="scope.row.status" :maxlength="1" @change="editSomeFields(editForm,'status',$event)" :disabled="disabledJudge('status')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="musers"  label="购买用户数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('musers')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.musers" :precision="0" :disabled="disabledJudge('musers')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="mbidNum"  label="可投标次数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('mbidNum')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.mbidNum" :precision="0" :disabled="disabledJudge('mbidNum')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="sfeeRate"  label="服务费率" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('sfeeRate')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.sfeeRate" :precision="0" :disabled="disabledJudge('sfeeRate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ver"  label="购买版本" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ver')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="menuSupVers" v-model="scope.row.ver" :maxlength="50" @change="editSomeFields(editForm,'ver',$event)" :disabled="disabledJudge('ver')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="feeDate"  label="开始计费日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('feeDate')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.feeDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('feeDate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="crowd"  label="是否为众包" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('crowd')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.crowd" :maxlength="1" @change="editSomeFields(editForm,'crowd',$event)" :disabled="disabledJudge('crowd')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ousers"  label="企业总人数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('ousers')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.ousers" :precision="0" :disabled="disabledJudge('ousers')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="udisRate"  label="人数折算比例" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('udisRate')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.udisRate" :precision="0" :disabled="disabledJudge('udisRate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="udis"  label="是否折算人数" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('udis')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.udis" :maxlength="1" @change="editSomeFields(editForm,'udis',$event)" :disabled="disabledJudge('udis')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="mcate"  label="分类" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('mcate')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="mcate" v-model="scope.row.mcate" :maxlength="1" @change="editSomeFields(editForm,'mcate',$event)" :disabled="disabledJudge('mcate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ctime"  label="创建日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ctime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('ctime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ltime"  label="更新日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ltime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('ltime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="cuserid"  label="创建人编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cuserid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.cuserid" :maxlength="50" @change="editSomeFields(editForm,'cuserid',$event)" :disabled="disabledJudge('cuserid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="cusername"  label="创建人姓名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cusername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.cusername" :maxlength="255" @change="editSomeFields(editForm,'cusername',$event)" :disabled="disabledJudge('cusername')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="luserid"  label="修改人编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('luserid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.luserid" :maxlength="50" @change="editSomeFields(editForm,'luserid',$event)" :disabled="disabledJudge('luserid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="lusername"  label="修改人姓名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lusername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.lusername" :maxlength="255" @change="editSomeFields(editForm,'lusername',$event)" :disabled="disabledJudge('lusername')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?380:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="el-icon-edit" title="修改一条数据"/>
				        <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="success" @click="copy(scope.row)" icon="el-icon-document-copy" title="拷贝并新增一条除了主键不一样其它都一样的数据"/>
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
			<!--新增修改明细 MenuModuleBranch 机构开通模块对应关系表界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <menu-module-branch-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as MenuModuleBranchApi from '@/api/mdp/menu/menuModuleBranch';
import  MenuModuleBranchForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

export default {
    name:'menuModuleBranchMng',
    mixins:[MdpTableMixin],
    components: {
        MenuModuleBranchForm,
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'机构开通模块对应关系表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'menuModuleBranch',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["branchId", "moduleId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: MenuModuleBranchApi.listMenuModuleBranch,
                add: MenuModuleBranchApi.addMenuModuleBranch,
                del: MenuModuleBranchApi.delMenuModuleBranch,
                edit: MenuModuleBranchApi.editMenuModuleBranch,
                editSomeFields: MenuModuleBranchApi.editSomeFieldsMenuModuleBranch,
                batchAdd: MenuModuleBranchApi.batchAddMenuModuleBranch,
                batchDel: MenuModuleBranchApi.batchDelMenuModuleBranch,
                batchEdit: MenuModuleBranchApi.batchEditMenuModuleBranch,
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
			if(!this.userInfo.isSuperAdmin){
				params.branchId=this.userInfo.branchId
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