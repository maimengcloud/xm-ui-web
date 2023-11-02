<template>
    	<section class="border padding">
		<el-row>
        <mdp-select-cate v-model="filters['categoryId']" width="8em" clearable filterable placeholder="选择归档" />  

          <mdp-select v-model="filters['category']" width="8em" clearable filterable placeholder="选择分类" :load-fun="listCategorys"/> 
          <mdp-select v-model="filters['suspensionState']" width="5em" item-code="suspensionState" clearable filterable placeholder="状态" /> 
          <mdp-select-tag v-model="filters['tagIds']" width="8em" clearable filterable placeholder="标签" /> 
			<el-input v-model="filters.id" style="width: 10em;" placeholder="编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.key" style="width: 10em;" placeholder="编码查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.name" style="width: 10em;" placeholder="名称查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

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
			<!--列表 Procdef act_re_procdef-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
 				
				<el-table-column prop="name"  label="模型名称" min-width="300" fixed="left"  show-overflow-tooltip col-type="String" v-if="showCol('name')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.name" :maxlength="255" @change="editSomeFields(scope.row,'name',$event)" :disabled="!editable || disabledJudge('name')"/>
				    </template>
				</el-table-column>
        
        <el-table-column  prop="tagNames" label="标签" min-width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                  <mdp-select-tag show-style="tag" v-model="scope.row.tagIds" clearable filterable placeholder="标签" multiple split="," :disabled="true"/>   
              </template>
          </el-table-column>
				<el-table-column prop="category"  label="分类" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('category')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.category" :maxlength="255" @change="editSomeFields(scope.row,'category',$event)" :disabled="!editable || disabledJudge('category')"/>
				    </template>
				</el-table-column>
                <el-table-column prop="id" label="模型编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>

				<el-table-column prop="key"  label="模型编码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('key')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.key" :maxlength="64" @change="editSomeFields(scope.row,'key',$event)" :disabled="!editable || disabledJudge('key')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="suspensionState"  label="状态" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('suspensionState')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="suspensionState"  v-model="scope.row.suspensionState" @change="editSomeFields(scope.row,'suspensionState',$event)" :precision="0" :disabled="!editable || disabledJudge('suspensionState')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="version"  label="版本" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('version')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.version" @change="editSomeFields(scope.row,'version',$event)" :precision="0" :disabled="!editable || disabledJudge('version')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="deploymentId"  label="部署编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deploymentId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deploymentId" :maxlength="64" @change="editSomeFields(scope.row,'deploymentId',$event)" :disabled="!editable || disabledJudge('deploymentId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="resourceName"  label="资源名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('resourceName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.resourceName" :maxlength="4000" @change="editSomeFields(scope.row,'resourceName',$event)" :disabled="!editable || disabledJudge('resourceName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="dgrmResourceName"  label="图像资源" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('dgrmResourceName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.dgrmResourceName" :maxlength="4000" @change="editSomeFields(scope.row,'dgrmResourceName',$event)" :disabled="!editable || disabledJudge('dgrmResourceName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="description"  label="描述" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('description')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.description" :maxlength="4000" @change="editSomeFields(scope.row,'description',$event)" :disabled="!editable || disabledJudge('description')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="hasStartFormKey"  label="是否表单" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('hasStartFormKey')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.hasStartFormKey" :maxlength="3" @change="editSomeFields(scope.row,'hasStartFormKey',$event)" :disabled="!editable || disabledJudge('hasStartFormKey')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="hasGraphicalNotation"  label="是否通知" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('hasGraphicalNotation')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.hasGraphicalNotation" :maxlength="3" @change="editSomeFields(scope.row,'hasGraphicalNotation',$event)" :disabled="!editable || disabledJudge('hasGraphicalNotation')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tenantId"  label="机构号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tenantId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tenantId" :maxlength="64" @change="editSomeFields(scope.row,'tenantId',$event)" :disabled="!editable || disabledJudge('tenantId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="engineVersion"  label="引擎版本" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('engineVersion')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.engineVersion" :maxlength="255" @change="editSomeFields(scope.row,'engineVersion',$event)" :disabled="!editable || disabledJudge('engineVersion')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="derivedFrom"  label="发布方" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('derivedFrom')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.derivedFrom" :maxlength="64" @change="editSomeFields(scope.row,'derivedFrom',$event)" :disabled="!editable || disabledJudge('derivedFrom')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="derivedFromRoot"  label="发布方根" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('derivedFromRoot')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.derivedFromRoot" :maxlength="64" @change="editSomeFields(scope.row,'derivedFromRoot',$event)" :disabled="!editable || disabledJudge('derivedFromRoot')"/>
				    </template>
				</el-table-column>				
                <el-table-column prop="rev"  label="基础版本号" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('rev')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.rev" @change="editSomeFields(scope.row,'rev',$event)" :precision="0" :disabled="!editable || disabledJudge('rev')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="derivedVersion"  label="发布方版本" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('derivedVersion')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.derivedVersion" @change="editSomeFields(scope.row,'derivedVersion',$event)" :precision="0" :disabled="!editable || disabledJudge('derivedVersion')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?380:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
                        <el-button @click="showDiagram( scope.row,scope.$index)">流程图</el-button>
                        <el-button
                        v-if="scope.row.suspensionState=='1' "
                        type="danger"
                        @click="handleSuspend(scope.row,scope.$index)"
                        >挂起</el-button>
                        <el-button type="primary"
                        v-if="scope.row.suspensionState!='1' "
                        @click="handleActivate(scope.row,scope.$index)"
                        >激活</el-button>
                        
                        <el-button type="primary" @click="$refs['bizModelDialog'].open(scope.row)">绑定业务</el-button>                        
                        <el-button type="success" @click="$refs['procdefParamesDialog'].open({formData:scope.row})">参数设置</el-button>

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
			<!--新增修改明细 Procdef act_re_procdef界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <procdef-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
            <!--流程图界面-->
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
          <mdp-dialog ref="procdefParamesDialog"
              title="流程参数设置" fullscreen 
            >
            <template v-slot="{visible,data,dialog}">
              <procdef-parames-set
                :visible="visible"
                :procdef="data.formData"
                @cancel="dialog.close()" 
              ></procdef-parames-set>
            </template>
            </mdp-dialog>
            <mdp-dialog ref="bizModelDialog"
              title="业务关联设置"
              width="80%"
            >
            <template v-slot="{visible,data,dialog}">
              <biz-model-mng
                :model-key="data.key"
                :model-name="data.name"
                :visible="visible"
                @cancel="dialog.close()"
                @submit="dialog.close()"
              ></biz-model-mng>
            </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>
import config from "@/api/mdp_pub/mdp_config"; //全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as ProcdefApi from '@/api/mdp/workflow/re/procdef'; 
import { mapGetters } from 'vuex' 
import {  listCategorys  } from "@/api/mdp/workflow/re/procdef";

import ProcdefParamesSet from "../procdefParames/ProcdefParamesSet";
import BizModelMng from "@/views/mdp/workflow/biz/bizModel/Index";

export default {
    name:'procdefMng',
    mixins:[MdpTableMixin],
    components: {   ProcdefParamesSet,         BizModelMng
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'act_re_procdef',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'procdef',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
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
                list: ProcdefApi.listProcdef,
                add: ProcdefApi.addProcdef,
                del: ProcdefApi.delProcdef,
                edit: ProcdefApi.editProcdef,
                editSomeFields: ProcdefApi.editSomeFieldsProcdef,
                batchAdd: ProcdefApi.batchAddProcdef,
                batchDel: ProcdefApi.batchDelProcdef,
                batchEdit: ProcdefApi.batchEditProcdef,
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
             var diagramUrl =
                "/" +
                process.env.BASE_API +
                "/" +
                process.env.VERSION +
                "/" +
                config.getWorkflowContext() +
                "/mdp/workflow/re/procdef/diagram/" +
                row.id;
            this.$refs['diagramDialog'].open({diagramUrl:diagramUrl})
        },
        //激活procdef
    handleActivate: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.list = true;
          let params = { id: row.id };
          ProcdefApi.activateProcdef(params).then(res => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.pageInfo.count = true;
              this.searchTableDatas();
            }
            this.$notify({position:'bottom-left',showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          });
        })
        .catch(() => {
          this.load.list = false;
        });
    },
    //激活挂起
    handleSuspend: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.list = true;
          let params = { id: row.id };
          ProcdefApi.suspendProcdef(params).then(res => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.pageInfo.count = true;
              this.searchTableDatas();
            }
            this.$notify({position:'bottom-left',showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          });
        })
        .catch(() => {
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