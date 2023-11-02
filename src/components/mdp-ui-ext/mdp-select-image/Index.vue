<template>
    	<section>
			<el-row>
			<el-col :span="6" class="border padding-top">
			<!-- 	<image-category-tree @row-click="categoryRowClick"></image-category-tree> -->
				<image-category-tree    show-checkbox ref="categoryTree"
				v-on:check-change="handleLeftCategoryNodeClick">
				</image-category-tree> 
			</el-col>
			<el-col :span="18" class="padding border">
				<el-row>
					<el-input v-model="filters.id" style="width: 20%;" placeholder="编号查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
					<el-input v-model="filters.name" style="width: 20%;" placeholder="名称查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
					<el-input v-model="filters.url" style="width: 20%;" placeholder="url查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

					<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
					<span style="float:right;" v-if="currOpType=='mng'">
						<el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'上传图片'})" icon="el-icon-plus"/>
						<el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
 
					</span>
					<span style="float:right;" v-else-if="currOpType=='select' ">
            <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'上传图片'})" icon="el-icon-plus"/>
						<el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
						<el-button :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="el-icon-check">确认选择</el-button>
					</span>
				</el-row>
				<el-row> 
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
				</el-row>
				<el-row :gutter="5"> 
					<el-col :span="4" v-for="(o, index) in tableDatas " :key="index" >
						<el-card :body-style="{ padding: '0px' }">
							<div style="height:150px;width:100%;display: block;"  class="avatar-uploader"  v-on:click="selectImg(o)">
								<div class="blank" v-show="o.show">
									<div class="black_blank"></div>
									<div class="select_blank"></div>
								</div>
								<el-tooltip class="item" :open-delay="20" effect="light" :content="(o.tag==null?'':o.tag +' ')+o.name+(o.remark==null?'':' '+o.remark )+' 上传时间 '+ o.createDate  " placement="left-start">
									<img :src="converUrl(o)" class="image">
								</el-tooltip>
							
							</div>
							<div style="height:80px;padding:5px;">
							<span>{{o.name}}</span>  
							<div class="bottom clearfix"> 
								<el-button type="text" class="button" @click="openForm({formData:o,subOpType:'edit'})">修改 </el-button>
 							</div>
							</div>
						</el-card>
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
			</el-col>
		</el-row>
		<el-row>
			<!--新增修改明细 Image 图片素材库界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                     <image-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog> 
 	    </el-row>
	</section>
</template>

<script>

import { MdpTableMixin } from '../../mdp-ui/mixin/MdpTableMixin.js'; 
import  ImageForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'  
import  ImageCategoryTree from './Tree';//树

export default {
    name:'imageMng',
    mixins:[MdpTableMixin],
    components: {
        ImageForm,ImageCategoryTree
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'图片素材库',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'image',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格编号的java属性名称，驼峰命名，默认为id,支持多编号
            currOpType:'select',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: this.$mdp.listImage,
                add: this.$mdp.addImage,
                del: this.$mdp.delImage,
                edit: this.$mdp.editImage,
                editSomeFields: this.$mdp.editSomeFieldsImage,
                batchAdd: this.$mdp.batchAddImage,
                batchDel: this.$mdp.batchDelImage,
                batchEdit: this.$mdp.batchEditImage,
            }
        }
    },
    methods: {
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
            this.currOpType='select'
            if(this.tableDatas.length>0){
              return;
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
			 
              return true;
          },

          //页面数据加载完后需要对数据进行加工处理的
          afterList(res,isOk,apiName){
            if(isOk==false|| !res){
              return;
            }
            let temps=res;
            temps.forEach(i=>i.show=false);
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
			if(subOpType=='add'){
				if(!this.filters.categoryId){
					this.$message.error("请先选择一个分类");
					return ;
				}
				formData.categoryId=this.filters.categoryId
				formData.archiveType=this.filters.archiveType
				formData.storageName=""
				formData.id=null;
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
		handleLeftCategoryNodeClick(data,checked, indeterminate) {    
			if(checked){  
				this.filters.categoryId=data.id 
			} else{  
				this.filters.categoryId='' 
			} 
			this.searchTableDatas();
		},
		
		converUrl(image){
			if("1"==image.isOutUrl){
				return image.outUrl;
			}
			if(image.url!=null  && !image.url.indexOf('http')==0 && !image.url.indexOf('www')==0){
				return this.$mdp.getArcImagePreviewBasePath()+"/"+image.url;
			}
			return image.url;
		},
		
		selectImg(image){ 
			if(image.show==true){
				image.show=false;
				let index=this.sels.indexOf(image);
				this.sels.splice(index,1);
			}else{
				//this.images.forEach(i=>i.show=false);
				image.show=true;
				this.sels.push(image);
			}  
		},
    },
    mounted() {

    }
}

</script>

<style scoped>
 
  
  .bottom { 
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  
   .imgBox{
  	margin-bottom:5px;
  	padding:5px;
  	margin:5px; 
  }
  
  	.blank{
		position:relative;
	}
  .black_blank{
  	position: absolute;
    top: 0;
    left: 0;
	background:rgba(0,0,0,.6);
    width: 100%;
    height: 145px;
    vertical-align: middle;
    display: inline-block;
  } 
  .select_blank{
  	position: absolute;
    top: 0;
    left: 0;
    background: transparent url(./selected_image.png) no-repeat 0 0;
    width: 100%;
    height: 120px;
    vertical-align: middle;
    display: inline-block;
    background-position: 50% 70%;
  }
  
  .avatar-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
</style>