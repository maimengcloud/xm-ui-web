<template>
    	<section class="border padding">
		<el-row>
			<el-input v-model="filters.id" style="width: 20%;" placeholder="消息编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
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
			<!--列表 NotifyMsg 个人消息通知-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="id" label="消息编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>
				<el-table-column prop="sendUserid"  label="操作人id" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sendUserid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.sendUserid" :maxlength="50" @change="editSomeFields(scope.row,'sendUserid',$event)" :disabled="!editable || disabledJudge('sendUserid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="sendUsername"  label="操作人名字" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sendUsername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.sendUsername" :maxlength="150" @change="editSomeFields(scope.row,'sendUsername',$event)" :disabled="!editable || disabledJudge('sendUsername')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="operTime"  label="操作时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('operTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.operTime" @change="editSomeFields(scope.row,'operTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('operTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="objType"  label="对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7/关注用户-8/点赞文章-9/评论文章-10/收藏文章-11/12-用户注销/13-商务合作" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('objType')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.objType" :maxlength="50" @change="editSomeFields(scope.row,'objType',$event)" :disabled="!editable || disabledJudge('objType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="msg"  label="备注-完整描述" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('msg')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.msg" :maxlength="65535" @change="editSomeFields(scope.row,'msg',$event)" :disabled="!editable || disabledJudge('msg')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="gloNo"  label="全局根踪号，用于跟踪日志" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('gloNo')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.gloNo" :maxlength="50" @change="editSomeFields(scope.row,'gloNo',$event)" :disabled="!editable || disabledJudge('gloNo')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="branchId"  label="机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.branchId" :maxlength="50" @change="editSomeFields(scope.row,'branchId',$event)" :disabled="!editable || disabledJudge('branchId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ip"  label="ip地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ip')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.ip" :maxlength="255" @change="editSomeFields(scope.row,'ip',$event)" :disabled="!editable || disabledJudge('ip')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="bizId"  label="业务主键编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.bizId" :maxlength="50" @change="editSomeFields(scope.row,'bizId',$event)" :disabled="!editable || disabledJudge('bizId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="pbizId"  label="对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pbizId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.pbizId" :maxlength="50" @change="editSomeFields(scope.row,'pbizId',$event)" :disabled="!editable || disabledJudge('pbizId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="bizName"  label="对象名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.bizName" :maxlength="255" @change="editSomeFields(scope.row,'bizName',$event)" :disabled="!editable || disabledJudge('bizName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="toUserid"  label="接收用户编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('toUserid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.toUserid" :maxlength="50" @change="editSomeFields(scope.row,'toUserid',$event)" :disabled="!editable || disabledJudge('toUserid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="toUsername"  label="接收用户名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('toUsername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.toUsername" :maxlength="150" @change="editSomeFields(scope.row,'toUsername',$event)" :disabled="!editable || disabledJudge('toUsername')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="hadRead"  label="是否已读" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('hadRead')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.hadRead" :maxlength="1" @change="editSomeFields(scope.row,'hadRead',$event)" :disabled="!editable || disabledJudge('hadRead')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="url"  label="跳转地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('url')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.url" :maxlength="255" @change="editSomeFields(scope.row,'url',$event)" :disabled="!editable || disabledJudge('url')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?280:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})" icon="el-icon-edit" title="修改一条数据"/>
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
			<!--新增修改明细 NotifyMsg 个人消息通知界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <notify-msg-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as NotifyMsgApi from '@/api/mdp/sys/notifyMsg';
import  NotifyMsgForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

export default {
    name:'notifyMsgMng',
    mixins:[MdpTableMixin],
    components: {
        NotifyMsgForm,
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'个人消息通知',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'notifyMsg',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            editable:true,//是否可编辑模式

            //增删改查(含批量)接口
            apis:{
                list: NotifyMsgApi.listNotifyMsg,
                add: NotifyMsgApi.addNotifyMsg,
                del: NotifyMsgApi.delNotifyMsg,
                edit: NotifyMsgApi.editNotifyMsg,
                editSomeFields: NotifyMsgApi.editSomeFieldsNotifyMsg,
                batchAdd: NotifyMsgApi.batchAddNotifyMsg,
                batchDel: NotifyMsgApi.batchDelNotifyMsg,
                batchEdit: NotifyMsgApi.batchEditNotifyMsg,
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
          afterList(tableDatas,isOk,apiName){

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
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>