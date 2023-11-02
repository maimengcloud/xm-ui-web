<template>
	<section class="border padding">
		<el-row>
            			<el-input v-model="filters.orderId" style="width: 20%;" placeholder="订单编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
			<el-input v-model="filters.moduleId" style="width: 20%;" placeholder="模块编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
 			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})" icon="el-icon-plus"/>
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
			<!--列表 MoOrderModule 订单与模块关系表-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="orderId" label="订单编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('orderId')"></el-table-column>
				<el-table-column prop="moduleId" label="模块编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('moduleId')"></el-table-column>
				<el-table-column prop="name"  label="模块名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('name')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.name" :maxlength="255" @change="editSomeFields(editForm,'name',$event)" :disabled="disabledJudge('name')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="fee"  label="模块费用" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('fee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.fee" :maxlength="10" :disabled="disabledJudge('fee')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="billMode"  label="计费模式" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('billMode')">
				    <template slot-scope="scope">
                            <mdp-select item-code="moduleBillMode" show-style="tag" v-model="scope.row.billMode" :maxlength="1" @change="editSomeFields(editForm,'billMode',$event)" :disabled="disabledJudge('billMode')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="uniFee"  label="人均费用" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('uniFee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.uniFee" :maxlength="10" :disabled="disabledJudge('uniFee')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="discount"  label="折扣比率" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('discount')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.discount" :maxlength="200" @change="editSomeFields(editForm,'discount',$event)" :disabled="disabledJudge('discount')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="mcate"  label="分类" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('mcate')">
				    <template slot-scope="scope">
                            <mdp-select item-code="mcate" show-style="tag" v-model="scope.row.mcate" :maxlength="50" @change="editSomeFields(editForm,'mcate',$event)" :disabled="disabledJudge('mcate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="logoUrl"  label="logo地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('logoUrl')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.logoUrl" :maxlength="255" @change="editSomeFields(editForm,'logoUrl',$event)" :disabled="disabledJudge('logoUrl')"/>
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
				<el-table-column prop="musers"  label="购买人数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('musers')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.musers" :precision="0" :disabled="disabledJudge('musers')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="finalFee"  label="最终总费用" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('finalFee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.finalFee" :maxlength="10" :disabled="disabledJudge('finalFee')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="days"  label="购买天数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('days')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.days" :precision="0" :disabled="disabledJudge('days')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="orginFee"  label="原始总费用" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('orginFee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.orginFee" :maxlength="10" :disabled="disabledJudge('orginFee')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="disRate"  label="订单折扣率" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('disRate')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.disRate" :precision="0" :disabled="disabledJudge('disRate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ucheck"  label="是否控制总人数" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ucheck')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.ucheck" :maxlength="1" @change="editSomeFields(editForm,'ucheck',$event)" :disabled="disabledJudge('ucheck')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ousers"  label="企业总人数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('ousers')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.ousers" :precision="0" :disabled="disabledJudge('ousers')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ver"  label="购买的版本" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ver')">
				    <template slot-scope="scope">
                            <mdp-select item-code="menuSupVers" show-style="tag" v-model="scope.row.ver" :maxlength="1" @change="editSomeFields(editForm,'ver',$event)" :disabled="disabledJudge('ver')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?180:180" fixed="right">
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
			<!--新增修改明细 MoOrderModule 订单与模块关系表界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <mo-order-module-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as MoOrderModuleApi from '@/api/mdp/mo/moOrderModule';
import  MoOrderModuleForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

export default {
    name:'moOrderModuleMng',
    mixins:[MdpTableMixin],
    components: {
        MoOrderModuleForm,
    },
    props:{
        moOrder:{
            type:Object,
            default:null,
        }
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'订单与模块关系表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'moOrderModule',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["orderId", "moduleId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: MoOrderModuleApi.listMoOrderModule,
                add: MoOrderModuleApi.addMoOrderModule,
                del: MoOrderModuleApi.delMoOrderModule,
                edit: MoOrderModuleApi.editMoOrderModule,
                editSomeFields: MoOrderModuleApi.editSomeFieldsMoOrderModule,
                batchAdd: MoOrderModuleApi.batchAddMoOrderModule,
                batchDel: MoOrderModuleApi.batchDelMoOrderModule,
                batchEdit: MoOrderModuleApi.batchEditMoOrderModule,
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
            if(this.moOrder){
                params.orderId=this.moOrder.id
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