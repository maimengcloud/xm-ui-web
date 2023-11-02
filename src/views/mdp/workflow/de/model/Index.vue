<template>
    	<section class="border padding">
		<el-row>

            <mdp-select v-model="filters['category']" clearable filterable placeholder="选择分类" :load-fun="listCategorys"/>  
			<el-input v-model="filters.id" style="width: 15%;" placeholder="编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.modelKey" style="width: 15%;" placeholder="编码查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.name" style="width: 15%;" placeholder="名称查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

  			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
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
			<!--列表 Model act_de_model-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="name"  label="模型名称" min-width="300" fixed="left" show-overflow-tooltip col-type="String" v-if="showCol('name')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.name" :maxlength="400" @change="editSomeFields(scope.row,'name',$event)" :disabled="!editable || disabledJudge('name')"/>
				    </template>
				</el-table-column>
                <el-table-column prop="id" label="模型编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>

				<el-table-column prop="modelKey"  label="模型编码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('modelKey')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.modelKey" :maxlength="400" @change="editSomeFields(scope.row,'modelKey',$event)" :disabled="!editable || disabledJudge('modelKey')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="description"  label="描述" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('description')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.description" :maxlength="4000" @change="editSomeFields(scope.row,'description',$event)" :disabled="!editable || disabledJudge('description')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="modelComment"  label="备注" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('modelComment')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.modelComment" :maxlength="4000" @change="editSomeFields(scope.row,'modelComment',$event)" :disabled="!editable || disabledJudge('modelComment')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="created"  label="创建时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('created')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.created" @change="editSomeFields(scope.row,'created',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('created')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="createdBy"  label="创建者" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('createdBy')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.createdBy" :maxlength="64" @change="editSomeFields(scope.row,'createdBy',$event)" :disabled="!editable || disabledJudge('createdBy')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="lastUpdated"  label="最后更新时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('lastUpdated')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.lastUpdated" @change="editSomeFields(scope.row,'lastUpdated',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('lastUpdated')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="lastUpdatedBy"  label="最后更新人" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lastUpdatedBy')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.lastUpdatedBy" :maxlength="255" @change="editSomeFields(scope.row,'lastUpdatedBy',$event)" :disabled="!editable || disabledJudge('lastUpdatedBy')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="version"  label="模型版本" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('version')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.version" @change="editSomeFields(scope.row,'version',$event)" :precision="0" :disabled="!editable || disabledJudge('version')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="modelType"  label="模型类型" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('modelType')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.modelType" @change="editSomeFields(scope.row,'modelType',$event)" :precision="0" :disabled="!editable || disabledJudge('modelType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tenantId"  label="机构号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tenantId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tenantId" :maxlength="64" @change="editSomeFields(scope.row,'tenantId',$event)" :disabled="!editable || disabledJudge('tenantId')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?380:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
                        <el-button   @click="showDiagram( scope.row,scope.$index)">流程图</el-button> 
  				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"/>
                         <el-button   @click="deploy( scope.row,scope.$index)" type="primary" icon="el-icon-position"></el-button>
                         <el-button   @click="$refs['deploymentDialog'].open({modelKey:scope.row.modelKey})" type="primary" icon="el-icon-position">已发布列表</el-button>

                         
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
			<!--新增修改明细 Model act_de_model界面-->
            <mdp-dialog ref="deploymentDialog" width="80%">
                <template v-slot="{visible,data,dialog}">
                    <deployment-mng :visible="visible" :modelKey="data.modelKey"></deployment-mng>
                 </template>
            </mdp-dialog>
            
            <mdp-dialog ref="diagramDialog">
                <template v-slot="{visible,data,dialog}">
                    <el-image v-if="visible" :fit="'contain'" :src="data.diagramUrl">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                    <div slot="placeholder" class="image-slot">
                        正在全力加载中。。。。。。。。。。
                        <i class="el-icon-loading"></i>
                    </div>
                    </el-image>
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>
import config from "@/api/mdp_pub/mdp_config"; //全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as ModelApi from '@/api/mdp/workflow/de/model';
 import { mapGetters } from 'vuex'

 import {  listCategorys  } from "@/api/mdp/workflow/re/procdef";
import DeploymentMng from '@/views/mdp/workflow/re/deployment/Index'
export default {
    name:'modelMng',
    mixins:[MdpTableMixin],
    components: {
        DeploymentMng
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'act_de_model',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'model',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
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
                list: ModelApi.listModel,
                add: ModelApi.addModel,
                del: ModelApi.delModel,
                edit: ModelApi.editModel,
                editSomeFields: ModelApi.editSomeFieldsModel,
                batchAdd: ModelApi.batchAddModel,
                batchDel: ModelApi.batchDelModel,
                batchEdit: ModelApi.batchEditModel,
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
        showDiagram: function(row, index) {
            var diagramUrl="/"+process.env.BASE_API+"/"+process.env.VERSION+"/"+config.getWorkflowContext()+"/mdp/workflow/de/model/diagram/"+row.id

            this.$refs['diagramDialog'].open({diagramUrl:diagramUrl})
        },
        deploy: function(row, index){
            this.$confirm('将产生新版本的流程，原流程及任务不受影响，是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                ModelApi.deployModel(row).then(res=>{
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchTableDatas();
                    }else{
                        this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
                    }

                    });
            }).catch(() => {
                this.load.list = false;

            });
        },
        unDeploy: function(row, index){
            this.$confirm('【不可逆操作】取消发布后，将不能再使用该版本发起新的流程，已发起的不受影响，是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                ModelApi.unDeployModel(row).then(res=>{
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchTableDatas();
                    }else{
                        this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
                    }

                    });
            }).catch(() => {
                this.load.list = false;

            });
        },
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>