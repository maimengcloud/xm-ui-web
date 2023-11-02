<template>
    	<section class="padding">
			<el-row>
				<el-col :span="4" class="page-height-90 border padding">
					<mdp-cate-tree :category-type="archiveType" :category-id="categoryId" :crely-type="crelyType" :crely-id="crelyId" :crely-stype="crelyStype" :crely-sid="crelySid" show-checkbox :expand-on-click-node="false"   @check-change="handleLeftCategoryNodeClick"></mdp-cate-tree> 
				</el-col>
				<el-col :span="20" class="page-height-90 border padding"> 
					<el-row>
						<mdp-select v-model="filters.archiveType"  placeholder="主题" clearable item-code="categoryType"  width="100px" :disabled="!!filters.categoryId"/>   
						<el-input v-model="filters.id" style="width: 10%;" placeholder="编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
						<el-input v-model="filters.name" style="width: 10%;" placeholder="名称查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
						<el-input v-model="filters.relativePath" style="width: 10%;" placeholder="存储路径查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
						<el-input v-model="filters.url" style="width: 10%;" placeholder="访问路径查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

						<el-input v-if="currOpType!='select'" v-model="filters.archiveId" style="width: 10%;" placeholder="文章编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
						<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
						<span style="float:right;" v-if="currOpType=='mng'">
							<el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})" icon="el-icon-plus"/>
							<el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>

						</span>
						<span style="float:right;" v-else-if="currOpType=='select'">
 							
							<el-button :disabled="!checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})" icon="el-icon-plus"/>
							<el-button :disabled="!checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
              				<el-button v-if="multiple==true" :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="el-icon-check">确认选择</el-button>
						</span>
					</el-row>
					<el-row> 
						<mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
						<el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
					</el-row>
					<el-row>
						<!--列表 Attachment 档案附件表-->
						<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
							<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
 							<el-table-column prop="id" label="编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>
							<el-table-column prop="name"  label="附件名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('name')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.name" :maxlength="100" @change="editSomeFields(scope.row,'name',$event)" :disabled="disabledJudge('name')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="url"  label="访问路径" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('url')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.url" :maxlength="250" @change="editSomeFields(scope.row,'url',$event)" :disabled="disabledJudge('url')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="relativePath"  label="硬盘存放路径" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('relativePath')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.relativePath" :maxlength="1000" @change="editSomeFields(scope.row,'relativePath',$event)" :disabled="disabledJudge('relativePath')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="fileSuffix"  label="后缀名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('fileSuffix')||true">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.fileSuffix" :maxlength="10" @change="editSomeFields(scope.row,'fileSuffix',$event)" :disabled="disabledJudge('fileSuffix')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="cdnUrl"  label="内容加速器访问路径" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cdnUrl')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.cdnUrl" :maxlength="250" @change="editSomeFields(scope.row,'cdnUrl',$event)" :disabled="disabledJudge('cdnUrl')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="isImg"  label="是否图片" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isImg')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.isImg" :maxlength="1" @change="editSomeFields(scope.row,'isImg',$event)" :disabled="disabledJudge('isImg')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="archiveId"  label="档案主编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('archiveId')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.archiveId" :maxlength="150" @change="editSomeFields(scope.row,'archiveId',$event)" :disabled="disabledJudge('archiveId')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="isCdn"  label="是否使用CDN" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isCdn')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.isCdn" :maxlength="1" @change="editSomeFields(scope.row,'isCdn',$event)" :disabled="disabledJudge('isCdn')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="rootPath"  label="根目录" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('rootPath')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.rootPath" :maxlength="250" @change="editSomeFields(scope.row,'rootPath',$event)" :disabled="disabledJudge('rootPath')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="createDate"  label="存入时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('createDate')">
								<template slot-scope="scope">
										<mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.createDate" @change="editSomeFields(scope.row,'createDate',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('createDate')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="canDown"  label="是否可下载" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('canDown')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.canDown" :maxlength="1" @change="editSomeFields(scope.row,'canDown',$event)" :disabled="disabledJudge('canDown')"/>
								</template>
							</el-table-column>
							<el-table-column prop="canDel"  label="是否可删除" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('canDel')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.canDel" :maxlength="1" @change="editSomeFields(scope.row,'canDel',$event)" :disabled="disabledJudge('canDel')"/>
								</template>
							</el-table-column>
							<el-table-column prop="canRead"  label="是否可读" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('canRead')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.canRead" :maxlength="1" @change="editSomeFields(scope.row,'canRead',$event)" :disabled="disabledJudge('canRead')"/>
								</template>
							</el-table-column>
							<el-table-column prop="bizId"  label="业务编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizId')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.bizId" :maxlength="150" @change="editSomeFields(scope.row,'bizId',$event)" :disabled="disabledJudge('bizId')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="remark"  label="业务名称等" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('remark')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.remark" :maxlength="1000" @change="editSomeFields(scope.row,'remark',$event)" :disabled="disabledJudge('remark')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="storeName"  label="存储名字" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('storeName')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.storeName" :maxlength="50" @change="editSomeFields(scope.row,'storeName',$event)" :disabled="disabledJudge('storeName')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="fileSize"  label="文件大小" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('fileSize')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.fileSize" @change="editSomeFields(scope.row,'fileSize',$event)" :maxlength="8" :disabled="disabledJudge('fileSize')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="branchId"  label="云用户机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.branchId" :maxlength="50" @change="editSomeFields(scope.row,'branchId',$event)" :disabled="disabledJudge('branchId')||true"/>
								</template>
							</el-table-column>
              
							<el-table-column prop="deptid"  label="部门编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deptid')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.deptid" :maxlength="50" @change="editSomeFields(scope.row,'deptid',$event)" :disabled="disabledJudge('deptid')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="archiveType"  label="主题" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('archiveType')">
								<template slot-scope="scope">
										<mdp-select item-code="categoryType" show-style="tag" v-model="scope.row.archiveType" :maxlength="1" @change="editSomeFields(scope.row,'archiveType',$event)" :disabled="disabledJudge('archiveType')||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="categoryId"  label="分类编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('categoryId')">
								<template slot-scope="scope">
										<mdp-input show-style="tag" v-model="scope.row.categoryId" :maxlength="50" @change="editSomeFields(scope.row,'categoryId',$event)" :disabled="disabledJudge('categoryId')||true"/>
								</template>
							</el-table-column>
							<el-table-column label="操作" :width="currOpType=='mng'?200:180" fixed="right">
								<template slot="header" slot-scope="scope">
									<el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
									<mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
								</template>
								<template scope="scope" v-if="currOpType=='mng'"  > 
									<el-button  type="text" @click="handlePreview ( scope.row,scope.$index)">下载</el-button>
									<el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})" icon="el-icon-edit" title="修改一条数据"/>
									<el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"/>
 
								</template>

								<template scope="scope" v-else-if="currOpType=='list'" >
									<el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-view"/>
								</template>

								<template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true" >
									<el-button :disabled="!checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})" icon="el-icon-edit" title="修改一条数据"/> 
									<el-button   type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check"/>
								</template>
							</el-table-column>
						</el-table>
					</el-row>
				</el-col>
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
			<!--新增修改明细 Attachment 档案附件表界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <attachment-form :ref="refId+'Form'" :visible="visible" 
					 :rely-type="crelyType" :rely-id="crelyId" :rely-stype="crelyStype" :rely-sid="crelySid"
					 :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
 	    </el-row>
	</section>
</template>

<script>

import { MdpTableMixin } from '../../mdp-ui/mixin/MdpTableMixin.js';
 import  AttachmentForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex' 

 
export default {
    name:'attachmentMng',
    mixins:[MdpTableMixin],
    components: {
        AttachmentForm
    },
	props:{
		/**
		 * 主题
		 */
		archiveType:{
			type:String,
			default:'',
		},
		/**
		 * 分类
		 */
		categoryId:{
			type:String,
			default:''
		},
		crelyType:{
			type:String,
			default:''
		},
		crelyId:{
			type:String,
			default:''
		},
		crelyStype:{
			type:String,
			default:'',
		},
		crelySid:{
			type:String,
			default:''
		} 
	},
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'档案附件表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'attachment',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'select',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            editable:false,

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: this.$mdp.listAttachment,
                add: this.$mdp.addAttachment,
                del: this.$mdp.delAttachment,
                edit: this.$mdp.editAttachment,
                editSomeFields: this.$mdp.editSomeFieldsAttachment,
                batchAdd: this.$mdp.batchAddAttachment,
                batchDel: this.$mdp.batchDelAttachment,
                batchEdit: this.$mdp.batchEditAttachment,
            }
        }
    },
    methods: {
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
			if(!this.subOpType){
				this.currOpType='select'
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
			if(this.archiveType){
				params.archiveType=this.archiveType
			}
			if(this.crelyType){
				params.crelyType=this.crelyType
			}
			
			if(this.crelyStype){
				params.crelyStype=this.crelyStype
			}
			
			if(this.crelyId){
				params.crelyId=this.crelyId
			}
			
			if(this.crelySid){
				params.crelySid=this.crelySid
			}
			 
			if(this.crelyType){
				params.relyType=this.crelyType
			}
			
			if(this.crelyStype){
				params.relyStype=this.crelyStype
			}
			
			if(this.crelyId){
				params.relyId=this.crelyId
			}
			
			if(this.crelySid){
				params.relySid=this.crelySid
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
            if(subOpType=='add'){
              if(!this.filters.categoryId){
                this.$message.error("请先选择一个分类");
                return ;
              }
              formData.categoryId=this.filters.categoryId
              formData.archiveType=this.filters.archiveType
              formData.storeName=""
              formData.id=null;
            }
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
		handleLeftCategoryNodeClick(data, checked, indeterminate){ 
			this.tableDatas=[]
			if(data.id=='C0' || checked==false){//选择了根节点，默认不按分类查询
				this.filters.categoryId=null 
				this.filters.archiveType=null
			}else{
				this.filters.categoryId=data.id;  
				this.filters.archiveType=data.categoryType;  
			} 
			this.searchTableDatas();
		},
		handlePreview(row,index) { 
		        let relativePath=row.relativePath; 
		        let name=row.name;
		        var attachmentPreviewUrl=this.$mdp.getArcImagePreviewBasePath()+"/"+row.url+"?name="+name;
		        window.open(attachmentPreviewUrl,'_blank');
		  },
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>