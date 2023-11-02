<template>
	<section class="border padding">
		<el-row>
            <el-input v-model="filters.deptName" style="width: 20%;" placeholder="部门名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
            <el-input v-model="filters.userid" style="width: 20%;" placeholder="用户编号查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
			<el-input v-model="filters.username" style="width: 20%;" placeholder="用户名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;">
 			    <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.batchDel==true" type="danger" v-loading="load.batchDel" @click="batchDel" icon="el-icon-delete" title="将用户移出部门，将同步取消该用户在该部门上拥有的岗位，进而取消该用户在该岗位上拥有的角色、菜单权限,请慎重处理">移出部门</el-button>
		    </span>
		</el-row>
		<el-row> 
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
		</el-row>
		<el-row>
			<!--列表 UserDept 用户部门关系表-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="userid" label="用户编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('userid')"></el-table-column>				
                <el-table-column prop="username" label="用户名称" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('username')"></el-table-column>				
                <el-table-column prop="deptid" label="部门编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('deptid')"></el-table-column>
                <el-table-column prop="deptName" label="部门名称" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('deptName')"></el-table-column>

                <el-table-column prop="enabled"  label="是否启用" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('enabled')">
                    <template slot-scope="scope">
                        <mdp-select show-style="tag" item-code="enabled" v-model="scope.row.enabled"></mdp-select>
                    </template>
                </el-table-column>
 				<el-table-column label="操作" width="180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope">
  				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据">移出部门</el-button>
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
			<!--新增修改明细 UserDept 用户部门关系表界面--> 
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data}">
			        <user-dept-form :ref="refId+'Form'" :show-btn="false" :sub-op-type="data.subOpType" :form-data="data.formData" :visible="visible" :parent-op-type="currOpType" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
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
import * as UserDeptApi from '@/api/mdp/sys/userDept';
import  UserDeptForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

export default {
    name:'userDeptMng',
    mixins:[MdpTableMixin],
    props:{
        deptid:String,//部门编号
        branchId:String,//机构编号
    },
    components: {
        UserDeptForm,
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'用户部门关系表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'userDept',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["userid", "deptid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: UserDeptApi.listUserDept,
                add: UserDeptApi.addUserDept,
                del: UserDeptApi.delUserDept,
                edit: UserDeptApi.editUserDept,
                editSomeFields: UserDeptApi.editSomeFieldsUserDept,
                batchAdd: UserDeptApi.batchAddUserDept,
                batchDel: UserDeptApi.batchDelUserDept,
                batchEdit: UserDeptApi.batchEditUserDept,
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
            
            if(this.deptid){
                params.deptid=this.deptid
            }
            if(this.branchId){
                params.branchId=this.branchId
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