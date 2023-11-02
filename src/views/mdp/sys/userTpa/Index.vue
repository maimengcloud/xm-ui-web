<template>
    	<section class="border padding">
		<el-row>
            <mdp-select show-style="origin" item-code="app_type" v-model="filters.appType" placeholder="应用类型"/>

            <el-input v-model="filters.openid" style="width: 12em;" placeholder="openid 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.inviteId" style="width: 10em;" placeholder="邀请码 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.nickname" style="width: 8em;" placeholder="用户昵称 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <el-input v-model="filters.phoneno" style="width: 8em;" placeholder="手机号 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
             <el-input v-model="filters.city" style="width: 8em;" placeholder="城市 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

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
			<!--列表 UserTpa 第三方系统向我方开放的用户列表-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
 
               
                    <el-table-column prop="nickname"  label="微信昵称" min-width="120" show-overflow-tooltip fixed="left" col-type="String" v-if="showCol('nickname')">
    
                        <template slot-scope="scope">
                            <div class="avatar-container">
                                <div class="avatar-wrapper">
                                    <img v-if=" scope.row.headimgurl " class="user-avatar" :src="scope.row.headimgurl">
                                    <img v-else class="user-avatar" src="../../../../assets/image/user_img.gif">
                                    <span class="username"><i v-if="scope.row.sex=='0'" class="el-icon-female"></i><i v-else class="el-icon-male"></i> {{scope.row.nickname}}</span> 
                                </div>    
                            </div> 
                        </template>
                    </el-table-column>
                    <el-table-column prop="openid" label="微信openid" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('openid')"></el-table-column>

                    <el-table-column prop="unionid"  label="微信全局统一编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('unionid')">
                        <template slot-scope="scope">
                                <mdp-input show-style="tag" v-model="scope.row.unionid" :maxlength="64" @change="editSomeFields(scope.row,'unionid',$event)" :disabled="!editable || disabledJudge('unionid')"/>
                        </template>
                    </el-table-column> 
				<el-table-column prop="uusername"  label="账户名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('uusername')">
 
				</el-table-column>
                
				<el-table-column prop="userid"  label="账户编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('userid')">
                
                </el-table-column>
				<el-table-column prop="gender"  label="性别" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('gender')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.gender" :maxlength="255" @change="editSomeFields(scope.row,'gender',$event)" :disabled="!editable || disabledJudge('gender')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="startdate"  label="加入日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('startdate')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="加入日期" show-style="tag" v-model="scope.row.startdate" @change="editSomeFields(scope.row,'startdate',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('startdate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="phoneno"  label="移动电话号码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('phoneno')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.phoneno" :maxlength="20" @change="editSomeFields(scope.row,'phoneno',$event)" :disabled="!editable || disabledJudge('phoneno')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="country"  label="国家" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('country')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.country" :maxlength="30" @change="editSomeFields(scope.row,'country',$event)" :disabled="!editable || disabledJudge('country')"/>
				    </template>
				</el-table-column>
                
				<el-table-column prop="province"  label="省份" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('province')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.province" :maxlength="30" @change="editSomeFields(scope.row,'province',$event)" :disabled="!editable || disabledJudge('province')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="city"  label="城市" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('city')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.city" :maxlength="30" @change="editSomeFields(scope.row,'city',$event)" :disabled="!editable || disabledJudge('city')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="appid"  label="appid" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('appid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.appid" :maxlength="50" @change="editSomeFields(scope.row,'appid',$event)" :disabled="!editable || disabledJudge('appid')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="bizType"  label="业务类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizType')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.bizType" :maxlength="10" @change="editSomeFields(scope.row,'bizType',$event)" :disabled="!editable || disabledJudge('bizType')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="appType"  label="应用类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('appType')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="app_type" v-model="scope.row.appType" :maxlength="10" @change="editSomeFields(scope.row,'appType',$event)" :disabled="!editable || disabledJudge('appType')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="headimgurl"  label="头像地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('headimgurl')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.headimgurl" :maxlength="500" @change="editSomeFields(scope.row,'headimgurl',$event)" :disabled="!editable || disabledJudge('headimgurl')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?180:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})" icon="el-icon-edit" title="修改一条数据"/>
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
			<!--新增修改明细 UserTpa 第三方系统向我方开放的用户列表界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <user-tpa-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as UserTpaApi from '@/api/mdp/sys/userTpa';
import  UserTpaForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

export default {
    name:'userTpaMng',
    mixins:[MdpTableMixin],
    components: {
        UserTpaForm,
    },
    computed: {
    },
    watch:{
        $route(to){
            if(to.params.inviteId){
                this.initCurrData();
            }
        }
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'第三方系统向我方开放的用户列表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'userTpa',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["openid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:12,//默认展示的表格列数，前8列

            editable:false,//是否可编辑模式

            //增删改查(含批量)接口
            apis:{
                list: UserTpaApi.listUserTpa,
                add: UserTpaApi.addUserTpa,
                del: UserTpaApi.delUserTpa,
                edit: UserTpaApi.editUserTpa,
                editSomeFields: UserTpaApi.editSomeFieldsUserTpa,
                batchAdd: UserTpaApi.batchAddUserTpa,
                batchDel: UserTpaApi.batchDelUserTpa,
                batchEdit: UserTpaApi.batchEditUserTpa,
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
            var inviteId=this.$route.params.inviteId
            if(inviteId){
                inviteId=this.inviteId
            }
            if(inviteId){
                params.inviteId=inviteId
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