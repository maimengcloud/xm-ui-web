<template>
	<section class="border padding">
		<el-row>
            <mdp-select item-code="cpaType" width="8em" v-model="filters.cpaType"  placeholder="协作类型"></mdp-select>  
            <mdp-select-table placeholder="协作组织" width="8em" :props="{id:'id',name:'branchName'}" v-model="filters.cpaBranchId" :load-fun="$mdp.listBranch"></mdp-select-table>

            <mdp-select item-code="orgType" width="8em" v-model="filters.orgType"  placeholder="类型"></mdp-select>   
            <mdp-select item-code="deptLvl" width="5em" v-model="filters.levelType" placeholder="等级"/>
            <mdp-select item-code="dept_state" width="5em" v-model="filters.state" placeholder="状态"></mdp-select>  

            <el-input v-model="filters.deptid" style="width: 10em;" placeholder="编号查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
			<el-input v-model="filters.deptName" style="width: 10em;" placeholder="名称查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
            <el-input v-model="filters.managerName" style="width: 10em;" placeholder="负责人查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
            <el-input v-model="filters.leaderName" style="width: 10em;" placeholder="上级领导查询 输入 *陈* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"></el-input>
 
            <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>

            <span style="float:right;"  v-if="currOpType=='select' && this.multiple==true">
			    <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="$emit('select',sels)" icon="el-icon-check" titile="确认选择"> 确认选择</el-button>
 		    </span>
           
		</el-row> 
		<el-row>
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp;   
            <span v-for="(item ,index) in parentDeptList" :key="index">
                <el-tag   @close="clearParentDept(item,index)" closable @click="clickParentDept(item,index)">{{item.deptName}}</el-tag>/
            </span>
            <span style="float:right;">
			    <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="text" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm})" icon="el-icon-plus" titile="新增一条数据"> 添加一级部门</el-button>
			    <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.batchDel==true" type="text" v-loading="load.batchDel" @click="batchDel" icon="el-icon-delete" title="批量删除，请先选中数据">删除</el-button>
		    </span>
		</el-row>
		<el-row>
			<!--列表 Dept sys_dept-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="deptid" label="部门编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('deptid')"></el-table-column>
				<el-table-column prop="deptName"  label="部门全称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deptName')">
                    <template slot-scope="scope">
 							<el-link  @click.stop="openForm({subOpType:'edit',formData:scope.row})"  type="primary">{{scope.row.deptName}}</el-link>
							</template>
                </el-table-column>
                <el-table-column prop="levelType" item-code="deptLvl"  label="层级" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('levelType')">
                    <template scope="scope"> 
                    <mdp-select show-style="tag" :disabled="true" item-code="deptLvl" v-model="scope.row.levelType"></mdp-select>
                    </template>
                </el-table-column>

                <el-table-column prop="managerName"  label="负责人名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('managerName')"></el-table-column>

				<el-table-column prop="pdeptid"  label="上级部门" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pdeptid')"></el-table-column>
                <el-table-column prop="leaderName"  label="上级领导" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('leaderName')"></el-table-column>

				<el-table-column prop="orgType" item-code="orgType" label="机构类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('orgType')">
                    <template scope="scope"> 
                        <mdp-select show-style="tag" :disabled="true" item-code="orgType" v-model="scope.row.orgType"></mdp-select>  
                    </template>
                </el-table-column>
                <el-table-column prop="deptType" item-code="deptType" label="性质" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deptType')">
                
                    <template scope="scope"> 
                    <mdp-select show-style="tag" :disabled="true" item-code="deptType" v-model="scope.row.deptType"></mdp-select>
                    </template>
                </el-table-column>
                <el-table-column prop="cpaType" item-code="orgType" label="协作类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cpaType')">
                    <template scope="scope"> 
                        <mdp-select show-style="tag" :disabled="true" item-code="cpaType" v-model="scope.row.cpaType"></mdp-select>  
                    </template>
                </el-table-column>
				<el-table-column prop="state" item-code="dept_state" label="状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('state')">
                    <template scope="scope"> 
                        <mdp-select show-style="tag" :disabled="true" item-code="dept_state" v-model="scope.row.state"></mdp-select>  
                    </template>
                    
                </el-table-column>

				<el-table-column prop="manager"  label="负责人编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('manager')"></el-table-column>
				<el-table-column prop="leader"  label="上级领导编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('leader')"></el-table-column>
				<el-table-column prop="displayDeptid"  label="部门编码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('displayDeptid')"></el-table-column>
 				<el-table-column prop="branchId"  label="云用户机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')"></el-table-column>
 				<el-table-column prop="idPath"  label="部门编号路径" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('idPath')"></el-table-column>
				<el-table-column prop="bizProcInstId"  label="当前流程实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizProcInstId')"></el-table-column>
				<el-table-column prop="bizFlowState"  label="当前流程状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizFlowState')"></el-table-column>
				<el-table-column prop="ltime"  label="最后更新时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ltime')"></el-table-column>
				<el-table-column prop="isCbCenter"  label="成本中心" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isCbCenter')"></el-table-column>
                <el-table-column prop="shortName"  label="简称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('shortName')"></el-table-column>
                <el-table-column prop="cpaBranchId"  label="协作组织编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cpaBranchId')"></el-table-column>

                <el-table-column label="操作" :width="currOpType=='mng'?380:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='select' && this.multiple!=true">
                        <el-button  type="text" @click="$emit('select',scope.row)">选择</el-button> 
				    </template>
				    <template scope="scope" v-else>
                        <el-button  type="text" @click="openForm({formData:addForm,subOpType:'subAdd',parentDept:scope.row})">添加下级</el-button>
                        <el-button type="text" @click="showSubDept(scope.row,scope.$index)" >下级部门</el-button>
                        <el-button  type="text"  @click="showDeptPost(scope.row,scope.$index)">岗位</el-button>
                        <el-button  type="text" icon="el-icon-user"  @click="showUserDept(scope.row,scope.$index,)">用户</el-button>
				        <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="text" @click="copy(scope.row)" icon="el-icon-document-copy" title="拷贝并新增一条除了主键不一样其它都一样的数据">拷贝</el-button>
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
			<!--新增修改明细 Dept sys_dept界面--> 
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data}">
			        <dept-form :ref="refId+'Form'" :sub-op-type="data.subOpType" :form-data="data.formData" :visible="visible" :parent-op-type="currOpType" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
            <mdp-dialog title="部门用户管理" ref="userDeptIndexDialog">
                <template v-slot="{visible,data,dialog}">
                    <user-dept-index :visible="visible" :deptid="data.deptid" :branch-id="data.branchId" ref="userDeptIndex" sub-op-type="mng"></user-dept-index>
                </template>
            </mdp-dialog>
           
            <mdp-dialog title="部门岗位设置" ref="deptPostMngDialog">
                <template v-slot="{visible,data,dialog}">
                    <dept-post-mng :visible="visible" :deptid="data.deptid" :branch-id="data.branchId" ref="deptPostMng" @close="dialog.close()"></dept-post-mng>
                </template>
            </mdp-dialog>
        </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as DeptApi from '@/api/mdp/sys/dept';
import  DeptForm from './Form';//新增修改明细界面
import  UserDeptIndex from '../userDept/Index';//新增修改明细界面
import DeptPostMng from "../deptPost/DeptPostMng"; //部门岗位关系维护
import { mapGetters } from 'vuex'

export default {
    name:'deptMng',
    mixins:[MdpTableMixin],
    components: {
        DeptForm,UserDeptIndex,DeptPostMng
    },
    computed: {
        
        ...mapGetters([
            'userInfo'
        ]),
        treeData(){
            return this.translateDataToTree(this.depts)
        }
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'sys_dept',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'dept',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["deptid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:12,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: DeptApi.listDept,
                add: DeptApi.addDept,
                del: DeptApi.delDept,
                edit: DeptApi.editDept,
                editSomeFields: DeptApi.editSomeFieldsDept,
                batchAdd: DeptApi.batchAddDept,
                batchDel: DeptApi.batchDelDept,
                batchEdit: DeptApi.batchEditDept,
            },
            parentDeptList:[], 
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
        
		translateDataToTree(data) {

            let parents = data.filter(value =>{
                //如果我的上级为空，则我是最上级
                if(value.pdeptid == 'undefined' || value.pdeptid == null  || value.pdeptid == '' || value.pdeptid == 'A0'){
                    return true;

                    //如果我的上级不在列表中，我作为最上级
                }else if(data.some(i=>value.pdeptid==i.deptid)){
                    return false;
                }else {
                    return true
                }

            })
            let children = data.filter(value =>{
                if(data.some(i=>value.pdeptid==i.deptid)){
                    return true;
                }else{
                    return false;
                }
            })
            let translator = (parents, children) => {
                parents.forEach((parent) => {
                    children.forEach((current, index) => {
                        if (current.pdeptid === parent.deptid) {
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
        
        showSubAdd(row){
            this.parentDept=row;
            this.editForm=row; 
            this.filters.pdeptid=row.deptid
            this.searchTableDatas()
        },
        
        showSubDept(row){
            this.editForm = Object.assign({}, row);
            this.parentDept=row 
            this.filters.pdeptid=row.deptid
            this.parentDeptList.push(row); 
            this.searchTableDatas()

        },
        
        clearParentDept(parentDept,index){
            if(index==0){
                this.parentDept=null;
                this.filters.pdeptid=''
                this.parentDeptList=[]
            }else{
                this.parentDept=this.parentDeptList[index-1];
                this.parentDeptList.splice(index,this.parentDeptList.length-index) 
                this.filters.pdeptid=this.parentDept.deptid
            } 
            this.searchTableDatas()
        }, 
        clickParentDept(parentDept,index){
            this.parentDept=parentDept;
            this.parentDeptList.splice(index+1,this.parentDeptList.length-index-1) 
            this.searchTableDatas()
        }, 
        showUserDept(row,idx){
            this.$refs['userDeptIndexDialog'].open({deptid:row.deptid,branchId:row.branchId})
        },
        showDeptPost(row,idx){
            this.$refs['deptPostMngDialog'].open({deptid:row.deptid,branchId:row.branchId})
        }
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>