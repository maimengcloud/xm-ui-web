<template>
    	<section class="border padding">
		<el-row>
            <mdp-select-cate v-model="filters['categoryId']" width="8em" clearable filterable placeholder="分类" />  
            <mdp-select-tag v-model="filters['tagIds']" width="8em" clearable filterable placeholder="标签" />  
			<el-input v-model="filters.id" style="width: 20%;" placeholder="编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.formName" style="width: 20%;" placeholder="名称查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.username" style="width: 20%;" placeholder="创建人查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

            <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="toDesignAdd()" icon="el-icon-plus"/>
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
			<!--列表 FormDef 表单定义-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				
				<el-table-column prop="formName"  label="表单名称" min-width="220" fixed="left" show-overflow-tooltip col-type="String" v-if="showCol('formName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.formName" :maxlength="40" @change="editSomeFields(scope.row,'formName',$event)" :disabled="!editable || disabledJudge('formName')"/>
				    </template>
				</el-table-column>
                <el-table-column prop="id" label="编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>
				
				
				<el-table-column prop="tagIds"  label="标签" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tagIds')">
				    <template slot-scope="scope">
                            <mdp-select-tag show-style="tag" v-model="scope.row.tagIds" multiple split="," :maxlength="255" @change="editSomeFields(scope.row,'tagIds',$event)" :disabled="disabledJudge('tagIds')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="username"  label="创建人姓名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('username')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.username" :maxlength="255" @change="editSomeFields(scope.row,'username',$event)" :disabled="!editable || disabledJudge('username')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="deptName"  label="创建部门" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deptName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deptName" :maxlength="255" @change="editSomeFields(scope.row,'deptName',$event)" :disabled="!editable || disabledJudge('deptName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="dataType"  label="存储方式" min-width="150" item-code="form_data_type" show-overflow-tooltip col-type="String" v-if="showCol('dataType')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="form_data_type" v-model="scope.row.dataType" :maxlength="255" @change="editSomeFields(scope.row,'dataType',$event)" :disabled="true||disabledJudge('dataType')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="branchId"  label="机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.branchId" :maxlength="40" @change="editSomeFields(scope.row,'branchId',$event)" :disabled="!editable || disabledJudge('branchId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="formType"  label="表单类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('formType')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.formType" :maxlength="1" @change="editSomeFields(scope.row,'formType',$event)" :disabled="!editable || disabledJudge('formType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="isTemplate"  label="是否为模板" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isTemplate')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.isTemplate" :maxlength="1" @change="editSomeFields(scope.row,'isTemplate',$event)" :disabled="!editable || disabledJudge('isTemplate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="bizType"  label="业务分类" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizType')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.bizType" :maxlength="20" @change="editSomeFields(scope.row,'bizType',$event)" :disabled="!editable || disabledJudge('bizType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ctime"  label="创建日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ctime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.ctime" @change="editSomeFields(scope.row,'ctime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('ctime')"/>
				    </template>
				</el-table-column>
                <el-table-column prop="userid"  label="创建人" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('userid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.userid" :maxlength="40" @change="editSomeFields(scope.row,'userid',$event)" :disabled="!editable || disabledJudge('userid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="deptid"  label="创建部门" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deptid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deptid" :maxlength="40" @change="editSomeFields(scope.row,'deptid',$event)" :disabled="!editable || disabledJudge('deptid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="categoryId"  label="分类编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('categoryId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.categoryId" :maxlength="50" @change="editSomeFields(scope.row,'categoryId',$event)" :disabled="!editable || disabledJudge('categoryId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tagIds"  label="标签编号列表" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tagIds')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tagIds" :maxlength="255" @change="editSomeFields(scope.row,'tagIds',$event)" :disabled="!editable || disabledJudge('tagIds')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tagNames"  label="标签名字列表" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tagNames')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tagNames" :maxlength="255" @change="editSomeFields(scope.row,'tagNames',$event)" :disabled="!editable || disabledJudge('tagNames')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="groupsJson"  label="表单元素分组" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('groupsJson')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.groupsJson" :maxlength="2147483647" @change="editSomeFields(scope.row,'groupsJson',$event)" :disabled="!editable || disabledJudge('groupsJson')"/>
				    </template>
				</el-table-column><el-table-column prop="tableName"  label="表名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tableName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tableName" :maxlength="40" @change="editSomeFields(scope.row,'tableName',$event)" :disabled="!editable || disabledJudge('tableName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tableOwner"  label="表名拥有者" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tableOwner')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tableOwner" :maxlength="20" @change="editSomeFields(scope.row,'tableOwner',$event)" :disabled="!editable || disabledJudge('tableOwner')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="pks"  label="主键列表" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pks')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.pks" :maxlength="255" @change="editSomeFields(scope.row,'pks',$event)" :disabled="!editable || disabledJudge('pks')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?300:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" :form-def-id="expandId"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId)  || !checkFormDefQx(scope.row,'editBtn') " type="primary" @click="toDesign(scope.row)" icon="el-icon-edit" title="修改一条数据">设计</el-button>
 				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId)  || !checkFormDefQx(scope.row,'editBtn') " type="danger" @click="handleDel2(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"/>
                        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) || !checkFormDefQx(scope.row,'editBtn') " @click="$refs['formQxDialog'].open({formData:scope.row})">权限</el-button>
                        <el-button @click="openRoute({formId:scope.row.id,dataType:scope.row.dataType,dataField:scope.row.dataField,title:scope.row.formName})">数据</el-button>
                            
                    </template>

				    <template scope="scope" v-else-if="currOpType=='list'" >
				        <el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-view"/>
 				    </template>

				    <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true" >
				        <el-button   type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check"/>
 				    </template>
				</el-table-column>
                
                
                <template v-for="(field,idx) in formFields">
                    <el-table-column  :key="idx" :prop="expandFieldName+'.'+field.fieldIdCamel" :label="field.fieldTitle">
                        <template v-slot="scope">
                            <div v-if="scope.row[expandFieldName]">{{ scope.row[expandFieldName][field.fieldIdCamel] }}</div>
                        </template>
                    </el-table-column>
                 </template>
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
            
            <mdp-dialog ref="formQxDialog" title="表单权限设置" width="60%" >
                <template v-slot="{visible,data,dialog}">
                    <form-qx-set :form-def="data.formData" :visible="visible" @cancel="dialog.close()" ></form-qx-set>
                </template>
            </mdp-dialog> 
            
            <mdp-dialog ref="formDataDialog" title="表单数据" width="90%" >
                <template v-slot="{visible,data,dialog}">
                    <form-data-index :form-id="data.formId" :visible="visible" @cancel="dialog.close()" ></form-data-index>
                </template>
            </mdp-dialog> 
 	    </el-row>
	</section>
</template>

<script>

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as FormDefApi from '@/api/mdp/lcode/formDef';
import { mapGetters } from 'vuex'
import  FormQxSet from '../formQx/FormQxSet';//新增界面
import  FormDataIndex from '../formData/Index';//新增界面

export default {
    name:'formDefMng',
    mixins:[MdpTableMixin],
    components: {
        FormQxSet,FormDataIndex
    },
    computed: {
    },
    watch:{
        $route(to){
            this.initCurrData();
        }
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'表单定义',//menu_def.name 功能名称，用于导出excel等文件名
            expandId:'form_def',
            refId:'formDef',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
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
                list: FormDefApi.listFormDef,
                add: FormDefApi.addFormDef,
                del: FormDefApi.delFormDef,
                edit: FormDefApi.editFormDef,
                editSomeFields: FormDefApi.editSomeFieldsFormDef,
                batchAdd: FormDefApi.batchAddFormDef,
                batchDel: FormDefApi.batchDelFormDef,
                batchEdit: FormDefApi.batchEditFormDef,
            }
        }
    },
    methods: {
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
            if(this.$route.params.expandId){ 
                this.addForm.id=this.$route.params.expandId
            }else{
                this.addForm.id=''
            }
             this.searchTableDatas();
          },

          /**
           * 检查参数是否满足调用后台接口的条件
           *
           * @param params 提交给后台的参数池,map类型
           * @returns true / false
           */
          preQueryParamCheck(params){
            if(this.$route.params.expandId){
                params.id=this.$route.params.expandId
            }
              return true;
          },

          //页面数据加载完后需要对数据进行加工处理的
          afterList(datas,isOk,apiName){ 
          
            var extInfos={id:'',two:'5',three:'4',four:'3',five:'11',six:'',seven:'5',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:'',branchId:'',bizKey:'',deptid:'',flowState:'',createTime:'',dqxCode:'',cuserid:'',tagIds:'',tagNames:'',cusername:'',deptName:''}

             datas.forEach(d=>{ 
                d.extInfos=extInfos
             })
             
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
          checkFormDefQx(formDef,btnId){
            if(formDef.userid==this.userInfo.userid){
                return true;
            }else{
                return false;
            }
          }, 
        openRoute(data){
            this.$router.push({path:`/mdp/lcode/data/index/${data.formId}/${data.dataType}/${data.dataField}`})
        },
        
        toDesignAdd(){ 
            if(!this.$route.params.expandId){
                this.$router.push({path:'/mdp/lcode/create'})
            }else{
                this.$router.push({path:'/mdp/lcode/design/'+this.$route.params.expandId})
            }
           
        },
        toDesign(formDef){ 
            this.$router.push({path:'/mdp/lcode/design/'+formDef.id})
        },
        handleDel2(row,index){
            this.$mdp.removeFormFieldsCache(row.id)
            this.handleDel(row,index)
        }
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>