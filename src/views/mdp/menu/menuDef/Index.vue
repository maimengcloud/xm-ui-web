<template>
	<section class="border padding">
		<el-row>
			<mdp-select item-code="mcate" v-model="filters.mcate" placeholder="分类" class="hidden-md-and-down"/> 
			<mdp-select item-code="menuSupVers" v-model="filters.supVers" placeholder="版本"/>
			<mdp-select :load-fun="listMenuModule" v-model="filters.moduleId" placeholder="模块"/>
			<el-input v-model="filters.id" style="width: 10%;" placeholder="编号查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>
			<el-input v-model="filters.mname" style="width: 10%;" placeholder="名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm})" icon="el-icon-plus"/>
                <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
				<el-button   @click="showMenusToRolesSet(sels,true)" :disabled="this.sels.length===0" icon="el-icon-setting" type="warning">分配到角色</el-button> 

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
			<!--列表 MenuDef 前端功能菜单表-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="treeData" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;"
			:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          	row-key="id" 
			>
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				
				<el-table-column prop="mname"  label="菜单名称" min-width="220" show-overflow-tooltip col-type="String" v-if="showCol('mname')" fixed="left">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.mname" :maxlength="100" @change="editSomeFields(editForm,'mname',$event)" :disabled="disabledJudge('mname')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="id" label="菜单编号" min-width="120" show-overflow-tooltip   col-type="String" v-if="showCol('id')"></el-table-column>

				<el-table-column prop="accUrl"  label="访问路径" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('accUrl')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.accUrl" :maxlength="200" @change="editSomeFields(editForm,'accUrl',$event)" :disabled="disabledJudge('accUrl')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="msort"  label="菜单顺序" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('msort')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.msort" :maxlength="10" @change="editSomeFields(editForm,'msort',$event)" :disabled="disabledJudge('msort')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="mcate"  label="菜单大类" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('mcate')">
				    <template slot-scope="scope">
                            <mdp-select item-code="mcate" show-style="tag" v-model="scope.row.mcate" :maxlength="20" @change="editSomeFields(editForm,'mcate',$event)" :disabled="disabledJudge('mcate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="icon"  label="菜单图标" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('icon')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.icon" :maxlength="100" @change="editSomeFields(editForm,'icon',$event)" :disabled="disabledJudge('icon')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="rpath"  label="路由PATH" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('rpath')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.rpath" :maxlength="100" @change="editSomeFields(editForm,'rpath',$event)" :disabled="disabledJudge('rpath')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="isShow"  label="是否显示" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isShow')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.isShow" :maxlength="1" @change="editSomeFields(editForm,'isShow',$event)" :disabled="disabledJudge('isShow')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="menuType"  label="类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('menuType')">
				    <template slot-scope="scope">
                            <mdp-select :options="[{id:'1',name:'菜单'},{id:'2',name:'按钮'}]" show-style="tag" v-model="scope.row.menuType" :maxlength="1" @change="editSomeFields(editForm,'menuType',$event)" :disabled="disabledJudge('menuType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="operQxId"  label="api编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('operQxId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.operQxId" :maxlength="50" @change="editSomeFields(editForm,'operQxId',$event)" :disabled="disabledJudge('operQxId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="supVers"  label="支持版本" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('supVers')">
				    <template slot-scope="scope">
                            <mdp-select item-code="menuSupVers" show-style="tag" v-model="scope.row.supVers" :maxlength="255" @change="editSomeFields(editForm,'supVers',$event)" :disabled="disabledJudge('supVers')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="moduleId"  label="归属模块" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('moduleId')">
				    <template slot-scope="scope">
                            <mdp-select :load-fun="listMenuModule" show-style="tag" v-model="scope.row.moduleId" :maxlength="50" @change="editSomeFields(editForm,'moduleId',$event)" :disabled="disabledJudge('moduleId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="arole"  label="权限规则" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('arole')">
				    <template slot-scope="scope">
                            <mdp-select :options="[{id:'1',name:'开放'},{id:'0',name:'授权'}]" show-style="tag" v-model="scope.row.arole" :maxlength="1" @change="editSomeFields(editForm,'arole',$event)" :disabled="disabledJudge('arole')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="qxType"  label="权限类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('qxType')">
				    <template slot-scope="scope">
                            <mdp-select item-code="qxType" show-style="tag" v-model="scope.row.qxType" :maxlength="20" @change="editSomeFields(editForm,'qxType',$event)" :disabled="disabledJudge('qxType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="apiRules"  label="api路径" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('apiRules')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.apiRules" :maxlength="255" @change="editSomeFields(editForm,'apiRules',$event)" :disabled="disabledJudge('apiRules')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="pid"  label="上级编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.pid" :maxlength="50" @change="editSomeFields(editForm,'pid',$event)" :disabled="disabledJudge('pid')"/>
				    </template>
				</el-table-column>
				
				<el-table-column prop="rid"  label="路由编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('rid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.rid" :maxlength="50" @change="editSomeFields(editForm,'rid',$event)" :disabled="disabledJudge('rid')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?480:180" fixed="right">
				    <template slot="header" slot-scope="scope">
						
						<el-button   @click="$refs['importDialog'].open()"  icon="el-icon-upload">导入</el-button>
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="el-icon-edit" title="修改一条数据"/>
				        <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="success" @click="copy(scope.row)" icon="el-icon-document-copy" title="拷贝并新增一条除了主键不一样其它都一样的数据"/>
				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"/>
						<el-button  type="primary"  @click="showSubAdd(scope.row,scope.$index)" icon="el-icon-plus"></el-button> 
						<el-button  @click="showMenusToRolesSet([scope.row],false)" icon="el-icon-menu">分配到角色</el-button>  
						<el-button  v-if="scope.row.menuType=='1'"   @click="$refs['menuButtonsDialog'].open( {pmenu:scope.row})" icon="el-icon-right">按钮</el-button>
					
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
			<!--新增修改明细 MenuDef 前端功能菜单表界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data}">
                     <menu-def-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields" />
                </template> 
            </mdp-dialog>
			<!--新增 MenuDef 前端功能菜单表界面-->
			<mdp-dialog ref="menuButtonsDialog" title="按钮管理"  width="70%">
				<template v-slot="{visible,data,dialog}">
					<menu-buttons :pmenu="data.pmenu" :visible="visible" @close="dialog.close()" @submit="afterAddSubmit"></menu-buttons>
				</template> 
			</mdp-dialog> 
		   			<!--新增 菜单角色关系表界面-->
			<mdp-dialog ref="menusToRolesSetDialog" title="分配菜单到多个角色" width="60%"> 
				<template v-slot="{visible,data,dialog}">
					<menu-role-set ref="menusToRolesSet" :mids="data.mids" :batch="data.batch" :visible="visible" @close="dialog.close()"></menu-role-set>
				</template> 
			</mdp-dialog> 
			
			<!--导入界面-->
			<mdp-dialog ref="importDialog" title="导入菜单" width="70%" >
				<template v-slot="{visible,data,dialog}">
					<menu-def-import :pmenu="data.pmenu"   :visible="visible" @close="dialog.close()" @submit="afterAddSubmit"></menu-def-import>
				</template>
			</mdp-dialog> 
 	    </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as MenuDefApi from '@/api/mdp/menu/menuDef';
import  MenuDefForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex' 
import MenuRoleSet from '../menuRole/MenusToRolesSet';//修改界面 
import MenuButtons from './MenuButtons'
import MenuDefImport from './MenuDefImport' 
import { listMenuModule } from '@/api/mdp/menu/menuModule';
export default {
    name:'menuDefMng',
    mixins:[MdpTableMixin],
    components: {
        MenuDefForm,MenuRoleSet,MenuButtons,MenuDefImport
    },
    computed: {
		
		treeData(){
			return this.translateDataToTree(this.tableDatas)
		}
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'前端功能菜单表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'menuDef',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: MenuDefApi.listMenuDef,
                add: MenuDefApi.addMenuDef,
                del: MenuDefApi.delMenuDef,
                edit: MenuDefApi.editMenuDef,
                editSomeFields: MenuDefApi.editSomeFieldsMenuDef,
                batchAdd: MenuDefApi.batchAddMenuDef,
                batchDel: MenuDefApi.batchDelMenuDef,
                batchEdit: MenuDefApi.batchEditMenuDef,
            },
			menuModules:[],//{id,name}
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
		 
		showSubAdd(row){
			var formData=Object.assign({},this.addForm)
			formData.pid=row.id
			formData.pMname=row.mname
			this.$refs[this.refId+"FormDialog"].open({subOpType:'add',formData:formData})
		}, 
		showMenusToRolesSet(sels,batch){
			this.$refs['menusToRolesSetDialog'].open({mids:sels.map(k=>k.id),batch:batch})
		},
		translateDataToTree(data) {   
			let parents = data.filter(value =>{ 
				//如果我的上级为空，则我是最上级
				if(value.pid == 'undefined' || value.pid == null  || value.pid == ''){
					return true;

					//如果我的上级不在列表中，我作为最上级
				}else if(data.some(i=>value.pid==i.id)){
					return false;
				}else {
					return true
				}
			
			}) 
			let children = data.filter(value =>{
				if(data.some(i=>value.pid==i.id)){
					return true;
				}else{
					return false;
				} 
			})  
			let translator = (parents, children) => {
				parents.forEach((parent) => {
					children.forEach((current, index) => {
						if (current.pid === parent.id) {
							let temp = JSON.parse(JSON.stringify(children))
							temp.splice(index, 1)
							translator([current], temp)
							typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
						}
					}
					)
				}
				)
			}

			translator(parents, children)

			return parents
		},
    },
    mounted() {
    }
}

</script>

<style scoped>
</style>