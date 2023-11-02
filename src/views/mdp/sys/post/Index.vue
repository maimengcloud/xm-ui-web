<template>
	<section class="border padding">
		<el-row>
            <mdp-select item-code="postLvl" show-style="origin"  v-model="filters.postLvl" placeholder="等级" />
            <mdp-select item-code="postType" show-style="origin"  v-model="filters.postType" placeholder="类型"/>

			<el-input v-model="filters.id" style="width: 15%;" placeholder="编号查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>
            <el-input v-model="filters.postName" style="width: 15%;" placeholder="名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>

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
            <mdp-hi-query :column-configs="columnConfigs" show-style="tag"  v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
		</el-row>
		<el-row>
			<!--列表 Post 岗位管理-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="id" label="编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>
				<el-table-column prop="postName"  label="名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('postName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag"  v-model="scope.row.postName" :maxlength="50" @change="editSomeFields(editForm,'postName',$event)" :disabled="disabledJudge('postName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="remark"  label="备注" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('remark')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag"  v-model="scope.row.remark" :maxlength="50" @change="editSomeFields(editForm,'remark',$event)" :disabled="disabledJudge('remark')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="postLvl"  label="岗位级别" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('postLvl')">
				    <template slot-scope="scope">
                            <mdp-select item-code="postLvl" show-style="tag"  v-model="scope.row.postLvl" :precision="0" :disabled="disabledJudge('postLvl')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="postType"  label="岗位类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('postType')">
				    <template slot-scope="scope">
                            <mdp-select item-code="postType" show-style="tag"  v-model="scope.row.postType" :maxlength="20" @change="editSomeFields(editForm,'postType',$event)" :disabled="disabledJudge('postType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="cdate"  label="创建日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('cdate')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag"  v-model="scope.row.cdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('cdate') ||true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="branchId"  label="归属机构号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag"  v-model="scope.row.branchId" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)" :disabled="disabledJudge('branchId')||true"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?380:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" show-style="tag"  v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
                        
                        <el-button type="primary" size="mini" @click="$refs['SetRolesToPost'].open( {postId:scope.row.id})" icon="el-icon-setting">角色</el-button>
                        <el-button size="mini" @click="$refs['postUserListDialog'].open({ filters:{postId:scope.row.id},subOpType:'postUserMng'})" icon="el-icon-user">用户</el-button>
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
			<!--新增修改明细 Post 岗位管理界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data}">
                     <post-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields" :show-btn="false"/>
                </template>
                <template v-slot:footer="{data}">
                    <el-button @click="$refs[refId+'FormDialog'].close()">关闭</el-button>
                    <el-button v-if="data.subOpType=='add'" :disabled=" disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="$refs[refId+'Form'].saveSubmit()">提交</el-button>
                 </template>
            </mdp-dialog>
            <SetRolesToPost ref="SetRolesToPost"></SetRolesToPost>
            <mdp-dialog ref="postUserListDialog">
                <template v-slot="{visible,data}">
                    <DeptPostUserIndex :visible="visible" :params="data"></DeptPostUserIndex>
                </template> 
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as PostApi from '@/api/mdp/sys/post';
import  PostForm from './Form';//新增修改明细界面
import  SetRolesToPost from '../postRole/SetRolesToPost';//设置岗位的角色
import  DeptPostUserIndex from '../deptPostUser/Index';//设置岗位的角色
import { mapGetters } from 'vuex'

export default {
    name:'postMng',
    mixins:[MdpTableMixin],
    components: {
        PostForm,SetRolesToPost,DeptPostUserIndex
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'岗位管理',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'post',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: PostApi.listPost,
                add: PostApi.addPost,
                del: PostApi.delPost,
                edit: PostApi.editPost,
                editSomeFields: PostApi.editSomeFieldsPost,
                batchAdd: PostApi.batchAddPost,
                batchDel: PostApi.batchDelPost,
                batchEdit: PostApi.batchEditPost,
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
            params.branchId=this.userInfo.branchId
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
        showDeptPostUserMng(row){

        }
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>