<template>
    	<section class="border padding">
		<el-row>
 			<mdp-select v-model="filters.fstate" width="8em" item-code="bizFlowState" placeholder="审批状态"/>
			<mdp-select-tag v-model="filters['tagIds']" width="8em" clearable filterable placeholder="标签" />  

			<el-input v-model="filters.bizKey" style="width: 15em;" placeholder="业务编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
			<el-input v-model="filters.cusername" style="width: 15em;" placeholder="创建人查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
			<el-input v-model="filters.deptName" style="width: 15em;" placeholder="创建部门查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
				<el-button   type="primary" @click="$refs['addDataAddressDialog'].open({})" icon="el-icon-plus">填单地址</el-button>

                <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,formDef:myFormDef,formFields:fields,title:'新增'+myFormDef.formName})" icon="el-icon-plus"/>
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
			<!--列表 FormData 表单数据表-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				
				<el-table-column prop="bizKey"  label="业务编号" min-width="220" show-overflow-tooltip col-type="String" v-if="showCol('bizKey')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.bizKey" :maxlength="150" @change="editSomeFields(scope.row,'bizKey',$event)" :disabled="!editable || disabledJudge('bizKey')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="cusername"  label="创建人姓名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cusername')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.cusername" :maxlength="255" @change="editSomeFields(scope.row,'cusername',$event)" :disabled="!editable || disabledJudge('cusername')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="ctime"  label="创建时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ctime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.ctime" @change="editSomeFields(scope.row,'ctime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('ctime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="fstate"  label="审批状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('fstate')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" v-model="scope.row.fstate" item-code="bizFlowState" :maxlength="1" @change="editSomeFields(scope.row,'fstate',$event)" :disabled="!editable || disabledJudge('fstate')"/>
				    </template>
				</el-table-column> 
				
				<el-table-column prop="tagIds"  label="标签" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tagIds')">
				    <template slot-scope="scope">
                            <mdp-select-tag show-style="tag" v-model="scope.row.tagIds" multiple split="," :maxlength="255" @change="editSomeFields(scope.row,'tagIds',$event)" :disabled="disabledJudge('tagIds')"/>
				    </template>
				</el-table-column>
					<el-table-column v-for="c,idx in fields.filter(k=>k.extType!='row' && k.extType!='card' && k.extType!='tabs')" :key="idx"  :label="c.title" min-width="120" show-overflow-tooltip  col-type="String" v-show="showCol(c.idCamel)">
						<template slot-scope="scope"> 
							<div v-if="isExtInfosCpd"> 
								<mdp-select v-if="c.dict" :item-code="c.dict" show-style="tag" v-model="scope.row[camelDataField][c.idCamel]" :multiple="c.mul=='1'" split="," :maxlength="255"  :disabled="true||disabledJudge(c.idCamel)"/>
								<div v-else>{{scope.row[camelDataField][c.idCamel]}}</div>
							</div> 
							<div v-else> 
								<mdp-select v-if="c.dict" :item-code="c.dict" show-style="tag" v-model="scope.row[c.idCamel]" :multiple="c.mul=='1'" split="," :maxlength="255"  :disabled="true||disabledJudge(c.idCamel)"/>
								<div v-else>{{scope.row[c.idCamel]}}</div>
							</div>
						</template>
					</el-table-column> 
				
				
				<el-table-column prop="deptName"  label="创建部门" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deptName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deptName" :maxlength="255" @change="editSomeFields(scope.row,'deptName',$event)" :disabled="!editable || disabledJudge('deptName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="deptid"  label="部门编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deptid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deptid" :maxlength="50" @change="editSomeFields(scope.row,'deptid',$event)" :disabled="!editable || disabledJudge('deptid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="branchId"  label="机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.branchId" :maxlength="50" @change="editSomeFields(scope.row,'branchId',$event)" :disabled="!editable || disabledJudge('branchId')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="dqxCode"  label="数据权限码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('dqxCode')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.dqxCode" :maxlength="255" @change="editSomeFields(scope.row,'dqxCode',$event)" :disabled="!editable || disabledJudge('dqxCode')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="cuserid"  label="创建人编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cuserid')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.cuserid" :maxlength="50" @change="editSomeFields(scope.row,'cuserid',$event)" :disabled="!editable || disabledJudge('cuserid')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tagNames"  label="标签名列表逗号分割" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tagNames')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tagNames" :maxlength="255" @change="editSomeFields(scope.row,'tagNames',$event)" :disabled="!editable || disabledJudge('tagNames')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?250:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,formDef:myFormDef,formFields:fields,title:'修改'+myFormDef.formName})" icon="el-icon-edit" title="修改一条数据"/>
						<el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="$refs['editDataAddressDialog'].open(scope.row)" icon="el-icon-edit" title="请人修改数据">填单地址</el-button>

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
			<!--新增修改明细 FormData 表单数据表界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <form-data-form :ref="refId+'Form'" :form-fields="data.formFields" :form-def="data.formDef" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
			<mdp-dialog ref="addDataAddressDialog">
				<el-row>请点击以下连接，填写单据【{{myFormDef.formName}}】&nbsp;&nbsp;{{myFormDef.tagNames?" 标签："+myFormDef.tagNames+"":''}}
					填单地址：{{ getAddDataAddress() }}
				</el-row>
			</mdp-dialog>
			
			<mdp-dialog ref="editDataAddressDialog">
				<template v-slot="{data}">
					<el-row>{{data.cusername}},您好！请点击以下连接，修改单据【{{myFormDef.formName}}】&nbsp;&nbsp;{{data.tagNames?" 标签："+data.tagNames+"":''}}
					填单地址：{{ getEditDataAddress(data) }}
				</el-row>
			</template>
				
			</mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as FormDataApi from '@/api/mdp/lcode/formData';
import  FormDataForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

import { listFormField } from '@/api/mdp/lcode/formField';

export default {
    name:'formDataMng',
    mixins:[MdpTableMixin],
	props:{
		formId:{
			type:String,
			default:null,
		}
	},
    components: {
        FormDataForm,
    },
    computed: {
		isExtInfosCpd(){ 
			return this.myFormDef.dataType=='2'
		},
		camelDataField(){
			return this.$mdp.toCamel(this.myFormDef.dataField)+"2"
		}
    },
    watch:{
		$route(to){
			initCurrData();
		}
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'表单数据表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'formData',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
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
                list: FormDataApi.listFormData,
                add: FormDataApi.addFormData,
                del: FormDataApi.delFormData,
                edit: FormDataApi.editFormData,
                editSomeFields: FormDataApi.editSomeFieldsFormData,
                batchAdd: FormDataApi.batchAddFormData,
                batchDel: FormDataApi.batchDelFormData,
                batchEdit: FormDataApi.batchEditFormData,
            },
			primaryKeys:[],
			fields:[],
			myFormDef:{},
        }
    },
    methods: {
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
             this.searchTableDatas();
			 this.getFormFields();
          },

          /**
           * 检查参数是否满足调用后台接口的条件
           *
           * @param params 提交给后台的参数池,map类型
           * @returns true / false
           */
          preQueryParamCheck(params){
			var formId=this.formId
			if(!formId){
				if(!this.$route.params.formId){
					return false;
				}else{
					formId=this.$route.params.formId
				}
				
			} 
			if(formId){
				params.formId=formId
				return true;
			}else{
				return false;
			}
            if(params.tagIds){
				params.tagIds="*"+params.tagIds+"*"
			}
          },

          //页面数据加载完后需要对数据进行加工处理的
          afterList(datas,isOk,apiName){
			if(datas){
				debugger;
				var dataType=this.$route.params.dataType
				var dataField=this.$route.params.dataField
				var camelDf=this.$mdp.toCamel(dataField)
				datas.forEach(d=>{
					if(d[camelDf]){ 
						var extInfosStr=d[camelDf]
						if(extInfosStr){
							var extInfos=typeof(extInfosStr)=='string'?JSON.parse(extInfosStr):extInfosStr
							var extInfos2={}
							extInfos.forEach(e=>{
								extInfos2[e.id]=e.value
							})
							d[camelDf]=extInfos
							d[camelDf+'2']=extInfos2
						}else{ 
							d[camelDf]=[]
							d[camelDf+'2']={}
						}
						
					}
				})

			}  
			
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
		//获取列表 FormField 表单字段定义
		getFormFields() { 
				 
			var formId=this.formId
			if(!formId){
				if(!this.$route.params.formId){
					return;
				}else{
					formId=this.$route.params.formId
				}
				
			}
			let params = {
				formId:formId
			};
			this.load.list=true;
			listFormField(params).then((res) => {
				var tips=res.data.tips;
				if(tips.isOk){   
					this.fields = res.data.data.formFields; 
					this.myFormDef=res.data.data.formDef
 					if(this.myFormDef.pks && this.myFormDef.pks.length>0){
						this.primaryKeys=this.myFormDef.pks.split(",")
					}else{
						this.primaryKeys=[]
					}
					
				}else{
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
				}
				this.load.list=false;
			}).catch(() => {
				this.load.list=false;
			});
		},
		getAddDataAddress(){
			return window.location.protocol + '//' + window.location.host + '/' + process.env.CONTEXT + '/'+process.env.VERSION+'/#/mdp/lcode/data/add/'+this.myFormDef.id

		},
		getEditDataAddress(data){
			return window.location.protocol + '//' + window.location.host + '/' + process.env.CONTEXT + '/'+process.env.VERSION+'/#/mdp/lcode/data/edit/'+this.myFormDef.id+'/'+data.id

		}
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>