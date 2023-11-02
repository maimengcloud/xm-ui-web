<template>
	<section class="border padding">
		<el-row>
            <mdp-select show-style="origin" v-model="filters.dataLvl" item-code="dataLvl" placeholder="数据等级"/>
            <mdp-select-table placeholder="机构编码" width="8em" :props="{id:'id',name:'branchName'}" v-model="filters.branchId" :load-fun="$mdp.listBranch"></mdp-select-table>

			<el-input v-model="filters.rolename" style="width: 20%;" placeholder="名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
            <el-input v-model="filters.roleid" style="width: 20%;" placeholder="编号查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
            <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm})" icon="el-icon-plus"> </el-button>
                <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) || this.sels.length===0 " icon="el-icon-menu" @click="showRoleMenuBatch(sels,true)"  >设置菜单</el-button>
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
			<!--列表 Role 角色管理-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
                <el-table-column prop="rolename"  label="角色名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('rolename')"></el-table-column>
                <el-table-column prop="roleid" label="角色编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('roleid')"></el-table-column>
				<el-table-column prop="remark"  label="备注" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('remark')"></el-table-column>
                <el-table-column prop="dataLvl"  label="数据访问等级" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('dataLvl')">
                    <template slot-scope="scope">
                        <mdp-select show-style="tag" v-model="scope.row.dataLvl" item-code="dataLvl" @change="editSomeFields(scope.row,'dataLvl',$event)"/>
                    </template>
                </el-table-column>
				<el-table-column prop="enabled"  label="是否启用" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('enabled')">
                    <template slot-scope="scope">
                        <mdp-select show-style="tag" v-model="scope.row.enabled" item-code="enabled" @change="editSomeFields(scope.row,'enabled',$event)"/>
                    </template>
                </el-table-column>
				<el-table-column prop="sortOrder"  label="角色排序" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('sortOrder')">
                    <template slot-scope="scope">
                        <mdp-number show-style="tag" v-model="scope.row.sortOrder" :precision="0" @change="editSomeFields(scope.row,'sortOrder',$event)"/>
                    </template>
                </el-table-column>
                <el-table-column prop="roletype"  label="角色类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('roletype')">
                    <template slot-scope="scope">
                        <mdp-select show-style="tag" v-model="scope.row.roletype" item-code="roletype"  @change="editSomeFields(scope.row,'roletype',$event)"/> 
                    </template>
                </el-table-column>
 				<el-table-column prop="crdate"  label="创建日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('crdate')"> 
                </el-table-column>
				<el-table-column label="操作" width="380" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
                        
                        <el-button  @click="showRoleMenuBatch([scope.row],false)" icon="el-icon-menu">菜单</el-button> 
                        <el-button  @click="showRoleQx(scope.row)" icon="el-icon-s-operation">权限</el-button>
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="el-icon-edit" title="修改一条数据"></el-button>
				        <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="success" @click="copy(scope.row)" icon="el-icon-document-copy" title="拷贝并新增一条除了主键不一样其它都一样的数据"></el-button>
				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"></el-button>
				    </template>

				    <template scope="scope" v-else-if="currOpType=='list'" >
				        <el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-view"></el-button>
 				    </template>

				    <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true" >
				        <el-button   type="primary" @click="selectConfirm(scope.row)" icon="el-icon-view"></el-button>
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
			<!--新增修改明细 Role 角色管理界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data}">
			        <role-form :ref="refId+'Form'" :show-btn="false" :sub-op-type="data.subOpType" :form-data="data.formData" :visible="visible" :parent-op-type="currOpType" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
                <template v-slot:footer="{data}"> 
                    <el-button @click="$refs[refId+'FormDialog'].close()">关闭</el-button>
                    <el-button v-if="data.subOpType=='add'" :disabled=" disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="$refs[refId+'Form'].saveSubmit()">提交</el-button>
                 </template>
            </mdp-dialog>
            
            <mdp-dialog ref="roleToMenusSetDialog" width="70%" title="给角色选择菜单和按钮">
                <template v-slot="{visible,data,dialog}">  
                    <role-to-menus-set ref="roleToMenusSet" :batch="data.batch" :visible="visible" :roleids="data.roleids" @close="dialog.close()"/> 
                </template>
            </mdp-dialog>
           
            <mdp-dialog ref="roleQxMngDialog" width="70%" title="给角色选择权限列表">
                <template v-slot="{visible,data,dialog}"> 
                    <role-qx-mng :visible="visible" ref="roleQxMng" :role="data.role" @close="dialog.close()"/> 
                </template>
            </mdp-dialog>
        </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as RoleApi from '@/api/mdp/sys/role';
import  RoleForm from './Form';//新增修改明细界面
import  RoleToMenusSet from '@/views/mdp/menu/menuRole/RoleToMenusSet/';//新增修改明细界面
import  RoleQxMng from '../roleQx/RoleQxMng';//新增修改明细界面
import { mapGetters } from 'vuex'

import {listBranch} from '@/api/mdp/sys/branch';

export default {
    name:'roleMng',
    mixins:[MdpTableMixin],
    components: {
        RoleForm,RoleQxMng,RoleToMenusSet
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'角色管理',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'role',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["roleid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: RoleApi.listRole,
                add: RoleApi.addRole,
                del: RoleApi.delRole,
                edit: RoleApi.editRole,
                editSomeFields: RoleApi.editSomeFieldsRole,
                batchAdd: RoleApi.batchAddRole,
                batchDel: RoleApi.batchDelRole,
                batchEdit: RoleApi.batchEditRole,
            },
        }
    },
    methods: {
        listBranch,
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
        openForm(data){ 
            let {parentOpType,formRefId,subOpType,formData} = data
            if(!formRefId){
                formRefId=this.getRefId()+"FormDialog"
            }
            if(!parentOpType){
                parentOpType=this.currOpType
            }
            var form=this.$refs[formRefId]
            if(form){
                data.parentOpType=parentOpType
                data.formRefId=formRefId
                form.open(data);
            }else{

            }

        },
        showRoleMenuBatch: function(roles,batch) { 
          
            var roleids = roles.map(i => i.roleid); 
            this.$refs['roleToMenusSetDialog'].open({roleids:roleids,batch:batch})
        }, 
        //显示设置权限界面
        showRoleQx: function(row) {  
            this.$refs['roleQxMngDialog'].open({role:row})
        }, 
        onRoleSelect(v){
            this.$refs['queryDialog'].close(); 
        }
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>