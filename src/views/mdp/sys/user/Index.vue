<template>
	<section class="border padding"> 
		<el-row>
			<mdp-select item-code="cpaType" width="8em" v-model="filters.cpaType"  placeholder="协作类型"></mdp-select>  
            <mdp-select-table placeholder="协作组织" width="8em" :props="{id:'id',name:'branchName'}" v-model="filters.cpaBranchId" :load-fun="$mdp.listBranch"></mdp-select-table>

			<mdp-select-dept v-model="filters.deptid" placeholder="部门" width="10em"></mdp-select-dept>
			<mdp-select item-code="ustatus" v-model="filters.ustatus" placeholder="状态" width="5em"/>
			<mdp-select item-code="locked" v-model="filters.locked" placeholder="锁定" width="5em"/>

			<el-input v-model="filters.userid" style="width: 10em;" placeholder="用户编号查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>

			<el-input v-model="filters.displayUserid" style="width: 10em;" placeholder="登陆编号查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>

			<el-input v-model="filters.username" style="width: 10em;" placeholder="名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>

		</el-row>
		<el-row> 
			<mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
			<el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
			<span style="float:right;"> 
				<el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="text" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm})" icon="el-icon-plus" titile="新增一条数据">添加 </el-button>
				<el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="text" @click="showInvite" icon="el-icon-plus" titile="邀请新成员">邀请 </el-button>
				<el-button     @click="$refs['sendMsgDialog'].open({multiple:true})"  type="text" >发信</el-button>

				<el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) ||this.sels.length!==1" type="text" v-loading="load.edit" icon="el-icon-setting"  @click="handleResetPassword" >重置密码</el-button>
				<el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.batchDel==true" type="text" v-loading="load.batchDel" @click="batchDel" icon="el-icon-delete" title="批量删除，请先选中数据">删除</el-button>
			</span>
		</el-row>
		<el-row>
			<!--列表 User 用户表-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column> 						
				<el-table-column prop="username"  label="用户名称" min-width="220" fixed="left" col-type="String" v-if="showCol('username')">
					
					<template slot-scope="scope">
						<div class="avatar-container" @click="openForm({formData:scope.row,subOpType:'edit'})">
						<div class="avatar-wrapper">
							<img v-if=" scope.row.headimgurl " class="user-avatar" :src="scope.row.headimgurl">
							<img v-else class="user-avatar" src="../../../../assets/image/user_img.gif">
							<span class="username"><i v-if="scope.row.sex=='0'" class="el-icon-female"></i><i v-else class="el-icon-male"></i> {{scope.row.username}}</span> 
						</div>    
					</div> 
					</template>
				</el-table-column>
				<el-table-column prop="userid" label="用户编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('userid')"></el-table-column>
				<el-table-column prop="displayUserid"  label="登录编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('displayUserid')"></el-table-column>

				<el-table-column prop="ustatus" item-code="ustatus"  label="状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ustatus')">
					<template v-slot="scope">
						<mdp-select show-style="tag" item-code="ustatus" v-model="scope.row.ustatus" placeholder="用户账户状态" :maxlength="1" :disabled="true"/>
					</template>
				</el-table-column>

				<el-table-column prop="branchId"  label="机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')"></el-table-column>

				
				<el-table-column prop="locked"  label="锁定" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('locked')">
					<template v-slot="scope">
						<mdp-select show-style="tag" item-code="locked" v-model="scope.row.ustatus" placeholder="锁定状态" :maxlength="1" :disabled="true"/>
					</template>
				</el-table-column>
				<el-table-column prop="startdate"  label="启用日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('startdate')"></el-table-column>
				<el-table-column prop="enddate"  label="到期日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('enddate')"></el-table-column>
				<el-table-column prop="profeName"  label="职业名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('profeName')"></el-table-column>
				<el-table-column prop="memType"  label="会员类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('memType')"></el-table-column>
				<el-table-column prop="gradeName"  label="会员等级" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('gradeName')"></el-table-column>
				<el-table-column prop="ilvlName"  label="权益等级名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ilvlName')"></el-table-column>
				<el-table-column prop="istatus"  label="权益状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('istatus')"></el-table-column>
				<el-table-column prop="istime"  label="权益开始时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('istime')"></el-table-column>
				<el-table-column prop="ietime"  label="权益结束时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ietime')"></el-table-column>
				
				<el-table-column prop="phoneno"  label="电话" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('phoneno')"></el-table-column>
				<el-table-column prop="continent"  label="洲别" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('continent')"></el-table-column>
				<el-table-column prop="country"  label="国家" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('country')"></el-table-column>
				<el-table-column prop="province"  label="省份" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('province')"></el-table-column>
				<el-table-column prop="city"  label="城市" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('city')"></el-table-column>
				<el-table-column prop="districtId"  label="区县编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('districtId')"></el-table-column>

				<el-table-column prop="address"  label="详细地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('address')"></el-table-column>
				<el-table-column prop="idCardNo"  label="身份证号码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('idCardNo')"></el-table-column>

				<el-table-column prop="email"  label="邮箱" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('email')"></el-table-column>
				<el-table-column prop="emailBak"  label="备用邮箱" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('emailBak')"></el-table-column>

				<el-table-column prop="officePhoneno"  label="办公室电话" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('officePhoneno')"></el-table-column>
				<el-table-column prop="orgId"  label="归属机构" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('orgId')"></el-table-column>
				<el-table-column prop="pwdStrong"  label="密码强度" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pwdStrong')"></el-table-column>
				<el-table-column prop="lockType"  label="锁定类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lockType')"></el-table-column>
				<el-table-column prop="lockRemark"  label="锁定原因" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lockRemark')"></el-table-column>
				<el-table-column prop="ltime"  label="更新日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ltime')"></el-table-column>
				<el-table-column prop="atype"  label="账户类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('atype')"></el-table-column>
				<el-table-column prop="cpaType"  label="协作类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cpaType')"></el-table-column>
				<el-table-column prop="cpaOrg"  label="协作组织" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cpaOrg')"></el-table-column>
				<el-table-column prop="roleids"  label="拥有的角色" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('roleids')"></el-table-column>
				<el-table-column prop="birthday"  label="生日" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('birthday')"></el-table-column>
				<el-table-column prop="profeId"  label="职业编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('profeId')"></el-table-column>
				<el-table-column prop="validLvls"  label="人工验证结果" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('validLvls')"></el-table-column>
				<el-table-column prop="profeType"  label="职业" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('profeType')"></el-table-column>
				<el-table-column prop="creditId"  label="信用等级编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('creditId')"></el-table-column>
				<el-table-column prop="creditScore"  label="信用等级分数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('creditScore')"></el-table-column>
				<el-table-column prop="guardId"  label="服务保障等级" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('guardId')"></el-table-column>
				<el-table-column prop="open"  label="开放" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('open')"></el-table-column>
				<el-table-column prop="remark"  label="简介备注" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('remark')"></el-table-column>
				<el-table-column prop="bizHours"  label="营业时间说明09:00-12:00" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizHours')"></el-table-column>
				<el-table-column prop="skillIds"  label="技能编号列表" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('skillIds')"></el-table-column>
				<el-table-column prop="skillNames"  label="技能名称列表" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('skillNames')"></el-table-column>
				<el-table-column prop="unionid"  label="全局唯一编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('unionid')"></el-table-column>
				<el-table-column prop="nickname"  label="昵称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('nickname')"></el-table-column>
				<el-table-column prop="features"  label="个性化签名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('features')"></el-table-column>
				<el-table-column prop="sex"  label="性别" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sex')"></el-table-column>
				<el-table-column prop="bizProcInstId"  label="当前流程实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizProcInstId')"></el-table-column>
				<el-table-column prop="bizFlowState"  label="当前流程状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizFlowState')"></el-table-column>
				<el-table-column prop="gradeId"  label="等级会员" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('gradeId')"></el-table-column>
				<el-table-column prop="ilvlId"  label="权益等级" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ilvlId')"></el-table-column>
				
				<el-table-column label="操作" width="280" fixed="right">
					<template slot="header" slot-scope="scope">
						<el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
						<mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
					</template>
					<template scope="scope">
						
						<el-button     @click="showUserDeptEdit(scope.$index,scope.row)"  type="text" >部门/岗位</el-button>
						<el-button     @click="showInvite({joinUserid:scope.row.userid,joinUsername:scope.row.username,inviteType:'ewCode'})"  type="text" >微信</el-button>
						<el-button     @click="$refs['sendMsgDialog'].open({users:[scope.row],multiple:false})"  type="text" >发信</el-button>

						<el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="text" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="el-icon-edit" title="修改一条数据"></el-button>
						<el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="text" @click="copy(scope.row)" icon="el-icon-document-copy" title="拷贝并新增一条除了主键不一样其它都一样的数据"></el-button>
						<el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="text" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"></el-button>
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
			<!--新增修改明细 User 用户表界面-->
			<mdp-dialog :ref="refId+'FormDialog'">
				<template v-slot="{visible,data}">
					<user-form :ref="refId+'Form'" :show-btn="false" :sub-op-type="data.subOpType" :form-data="data.formData" :visible="visible" :parent-op-type="currOpType" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
				</template>
				<template v-slot:footer="{data}"> 
					<el-button @click="$refs[refId+'FormDialog'].close()">关闭</el-button>
					<el-button v-if="data.subOpType=='add'" :disabled=" disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="$refs[refId+'Form'].saveSubmit()">提交</el-button>
				</template>
			</mdp-dialog>
			
			<mdp-dialog :ref="'userDeptFormDialog'">
				<template v-slot="{visible,data}">
					<user-dept-form ref="userDeptForm" :user="data.user" :show-btn="false" :sub-op-type="data.subOpType" :form-data="data.formData" :visible="visible" :parent-op-type="currOpType" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
				</template>
				<template v-slot:footer="{data}"> 
					<el-button @click="$refs['userDeptFormDialog'].close()">关闭</el-button>
					<el-button v-if="data.subOpType=='edit'" :disabled=" disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="$refs['userDeptForm'].editSubmit()">提交</el-button>
				</template>
			</mdp-dialog> 
				
			<user-invite ref="userInvite"/>
					
			
			<mdp-dialog :ref="'sendMsgDialog'">
				<template v-slot="{visible,data,dialog}">
					<send-msg :users="data.users" :visible="visible" :multiple="data.multiple" sub-op-type="add" @close="dialog.close()" />
				</template> 
			</mdp-dialog> 
		</el-row>   
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as UserApi from '@/api/mdp/sys/user';
import  UserForm from './Form';//新增修改明细界面
import UserInvite from "./UserInvite"; //新增界面 
import SendMsg from "../notifyMsg/Send"; //新增界面 
import UserDeptForm from "../userDept/Form"; //修改界面
import DeptTree from "../dept/DeptTree.vue";
import md5 from "js-md5";

export default {
    name:'userMng',
    mixins:[MdpTableMixin],
    components: {
        UserForm,
		DeptTree, 
		UserDeptForm,
		UserInvite,
		SendMsg,
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'用户表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'user',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["userid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列
			userInviteVisible:false,

            //增删改查(含批量)接口
            apis:{
                list: UserApi.listUser,
                add: UserApi.addUser,
                del: UserApi.delUser,
                edit: UserApi.editUser,
                editSomeFields: UserApi.editSomeFieldsUser,
                batchAdd: UserApi.batchAddUser,
                batchDel: UserApi.batchDelUser,
                batchEdit: UserApi.batchEditUser,
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
		deptTreeCheckChange(data, isSelect, leafSelect) { 
			if(isSelect==false){
				this.dept=null;
				this.filters.deptid=''
			}else{
				this.dept = data;
				this.filters.deptid=this.dept.deptid
			} 
			this.searchTableDatas(); 
		}, 
		//显示编辑用户角色界面
		showUserDeptEdit: function(index, row) {
			if(row.flowState=='1'){
				this.$notify.error("审核中，不允许操作");
				return;
			}
			this.editForm = row; 
			this.$refs['userDeptFormDialog'].open({user:row,formData:{userid:row.userid,deptid:row.deptid},subOpType:'edit'});
		}, 
		//重置密码
		handleResetPassword: function() {
			if (this.sels.length > 1) {
				this.$notify({
				message: "为安全起见、一次只能重置一个用户的密码",
				type: "error"
				});
			}
			this.load.edit = true;
			this.$prompt("请输入六位以上密码", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				inputPattern: /[A-Za-z0-9]{6,}/,
				inputErrorMessage: "密码必须六位以上"
			})
			.then(({ value }) => {
				
			UserApi.resetPasswordByAdmin({
				userid: this.sels[0].userid,
				password: md5(value)
			}).then(res => {
				var tips = res.data.tips;
				this.load.edit = false;
				if (tips.isOk) {
				this.$notify({
					message: "密码已重置为" + value,
					type: "success"
				});
				} else {
				this.$notify({
					message: tips.msg,
					type: tips.isOk ? "success" : "error"
				});
				}
			});
			})
			.catch(() => {
			this.$notify({
				type: "info",
				message: "取消输入"
			});
			this.load.edit = false;
			});
		},
		
		branchRowClick: function(row, event, column) {
			if (this.branch == null || row.id != this.branch.id) {
				this.branch = row;
				this.dept = {};
				this.filters.deptid=''
				this.filters.branchId=''
				this.searchTableDatas();
			}else{
				this.branch = row;
				this.dept = {};
				this.filters.deptid=''
				this.filters.branchId=this.branch.id
				this.searchTableDatas();
			}
		},
		sendMsg(row){

		},
		showInvite(params){
			this.$refs['userInvite'].show(params)
		}
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>