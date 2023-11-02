<template>
	<section class="border padding">
		<el-row>
            <mdp-select item-code="mcate" v-model="filters.mcate" placeholder="分类" class="hidden-md-and-down"/>  
			<el-input v-model="filters.id" style="width: 20%;" placeholder="编号查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>
            <el-input v-model="filters.name" style="width: 20%;" placeholder="名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>

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
			<!--列表 MenuModule 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="id" label="编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>
				<el-table-column prop="name"  label="模块名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('name')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.name" :maxlength="255" @change="editSomeFields(editForm,'name',$event)" :disabled="disabledJudge('name')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="status"  label="状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('status')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="module_status" v-model="scope.row.status" :maxlength="1" @change="editSomeFields(editForm,'status',$event)" :disabled="disabledJudge('status')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="fee"  label="总包费用" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('fee')">
				    <template slot-scope="scope">
                        <mdp-input show-style="tag" v-model="scope.row.fee" :maxlength="10" :disabled="disabledJudge('fee')"> 
                                <span slot="info">总包￥ {{scope.row.fee}}  </span>
                            </mdp-input>				    
                        </template>
				</el-table-column>
                <el-table-column prop="uniFee"  label="人均费用" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('uniFee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.uniFee" :maxlength="10" :disabled="disabledJudge('uniFee')">
                            <span slot="info">人天￥ {{scope.row.uniFee}} </span>
                        </mdp-input> 
				    </template>
				</el-table-column>
				<el-table-column prop="billMode"  label="计费模式" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('billMode')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="moduleBillMode" v-model="scope.row.billMode" :maxlength="1" @change="editSomeFields(editForm,'billMode',$event)" :disabled="disabledJudge('billMode')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="url"  label="计费地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('url')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.url" :maxlength="255" @change="editSomeFields(editForm,'url',$event)" :disabled="disabledJudge('url')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ignoreUrl"  label="忽略地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ignoreUrl')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.ignoreUrl" :maxlength="255" @change="editSomeFields(editForm,'ignoreUrl',$event)" :disabled="disabledJudge('ignoreUrl')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="bizFlowState"  label="审核状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizFlowState')">
				    <template slot-scope="scope"> 
                        <mdp-select show-style="tag" item-code="bizFlowState" v-model="scope.row.bizFlowState" :maxlength="255" @change="editSomeFields(editForm,'bizFlowState',$event)" :disabled="disabledJudge('bizFlowState')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="mcate"  label="分类" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('mcate')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="mcate" v-model="scope.row.mcate" :maxlength="50" @change="editSomeFields(editForm,'mcate',$event)" :disabled="disabledJudge('mcate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="feeDesc"  label="费用解释" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('feeDesc')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.feeDesc" :maxlength="255" @change="editSomeFields(editForm,'feeDesc',$event)" :disabled="disabledJudge('feeDesc')"/>
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
				<el-table-column prop="saleDesc"  label="营销文案" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('saleDesc')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.saleDesc" :maxlength="255" @change="editSomeFields(editForm,'saleDesc',$event)" :disabled="disabledJudge('saleDesc')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ucheck"  label="是否控制总人数" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ucheck')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.ucheck" :maxlength="1" @change="editSomeFields(editForm,'ucheck',$event)" :disabled="disabledJudge('ucheck')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="crowd"  label="是否为众包" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('crowd')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.crowd" :maxlength="1" @change="editSomeFields(editForm,'crowd',$event)" :disabled="disabledJudge('crowd')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="seq"  label="序号" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('seq')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.seq" :precision="0" :disabled="disabledJudge('seq')"/>
				    </template>
				</el-table-column> 

				<el-table-column prop="logoUrl"  label="logo地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('logoUrl')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.logoUrl" :maxlength="255" @change="editSomeFields(editForm,'logoUrl',$event)" :disabled="disabledJudge('logoUrl')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="discount"  label="折扣比率" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('discount')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.discount"  @change="editSomeFields(editForm,'discount',$event)" :disabled="disabledJudge('discount')"/>
				    </template>
				</el-table-column>
                
				<el-table-column prop="procInstId"  label="审核流程实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('procInstId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.procInstId" :maxlength="50" @change="editSomeFields(editForm,'procInstId',$event)" :disabled="disabledJudge('procInstId')"/>
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
			<!--新增修改明细 MenuModule 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <menu-module-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as MenuModuleApi from '@/api/mdp/menu/menuModule';
import  MenuModuleForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

export default {
    name:'menuModuleMng',
    mixins:[MdpTableMixin],
    components: {
        MenuModuleForm,
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'menuModule',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: MenuModuleApi.listMenuModule,
                add: MenuModuleApi.addMenuModule,
                del: MenuModuleApi.delMenuModule,
                edit: MenuModuleApi.editMenuModule,
                editSomeFields: MenuModuleApi.editSomeFieldsMenuModule,
                batchAdd: MenuModuleApi.batchAddMenuModule,
                batchDel: MenuModuleApi.batchDelMenuModule,
                batchEdit: MenuModuleApi.batchEditMenuModule,
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
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>