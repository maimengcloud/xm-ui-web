<template>
	<section class="border padding">
		<el-row> 
			 <mdp-select v-model="filters['item.categoryId']" item-code="categoryId" clearable/>
			<el-input v-model="filters['item.itemName']" style="width: 20%;" placeholder="字典名称模糊查询" clearable></el-input>
			<el-input v-model="filters['item.itemCode']" style="width: 20%;" placeholder="字典代码模糊查询" clearable></el-input>
			<el-input v-model="filters.name" style="width: 20%;" placeholder="选项名称模糊查询" clearable></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;">
			    <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || !this.itemCpd || !this.itemCpd.id" type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,item:itemCpd})" icon="el-icon-plus"> </el-button>
			    <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.batchDel" @click="batchDel" icon="el-icon-delete"></el-button>
		    </span>
		</el-row>
		<el-row> 
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
		</el-row>
		<el-row>
			<!--列表 ItemOption 字典选项值-->
			<el-table :ref="refId+'Table'" height="100px" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
                 <el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
                <el-table-column prop="itemName" label="字典名称" col-prefix="item." min-width="100" v-if="showCol('itemName')"></el-table-column>
				<el-table-column prop="itemCode" label="字典代码" col-prefix="item." min-width="100"  v-if="showCol('itemCode')"></el-table-column>
				<el-table-column prop="id" label="选项值" min-width="120" show-overflow-tooltip  col-prefix="res." col-type="VARCHAR" v-if="showCol('id')">
                    <template scope="scope">
                        <mdp-input show-style='tag' v-model="scope.row.id" :color="scope.row.color" :disabled="!scope.row.itemId">
                            <span slot="avater"></span>
                            <span slot="info">{{scope.row.id}}</span>
                            <el-input slot="oper" v-model="scope.row.nid" @change="editSomeFields(scope.row,'id',$event)"> </el-input> 
                        </mdp-input> 
                    </template>
                </el-table-column>				
				<el-table-column prop="name"  label="选项名称" min-width="120" show-overflow-tooltip col-type="VARCHAR" v-if="showCol('name')">
                    <template scope="scope">
                        <mdp-input show-style='tag' v-model="scope.row.name" :color="scope.row.color" :disabled="!scope.row.itemId" @change="editSomeFields(scope.row,'name',$event)"/>
 
                    </template>
                </el-table-column>
                <el-table-column prop="color"  label="显示颜色" min-width="120" show-overflow-tooltip col-type="VARCHAR" v-if="showCol('color')">
                    <template scope="scope"> 
                        <el-row type="flex" style="align-items: center">
                            <el-button v-if="scope.row.color" :style="{'background-color':scope.row.color}" circle size="big"></el-button> 
                            <el-color-picker @change="editSomeFields(scope.row,'color',$event)"
                                v-model="scope.row.color"
                                show-alpha
                                :predefine="predefineColors">
                            </el-color-picker>
                        </el-row>
                        
                    </template>
                </el-table-column>
				<el-table-column prop="seqOrder"  label="排位" min-width="120" show-overflow-tooltip col-type="INT" v-if="showCol('seqOrder')">
                    <template scope="scope">
                        <mdp-input show-style='tag' v-model="scope.row.seqOrder" :color="scope.row.color" :disabled="!scope.row.itemId" @change="editSomeFields(scope.row,'seqOrder',$event)"/>
 
                    </template>
                </el-table-column>

                <el-table-column prop="relyTypes"  label="关联类型" min-width="120" show-overflow-tooltip col-type="VARCHAR" v-if="showCol('relyTypes')">
                    <template scope="scope">
                        <mdp-input show-style='tag' v-model="scope.row.relyTypes" :color="scope.row.color" :disabled="!scope.row.itemId" @change="editSomeFields(scope.row,'relyTypes',$event)"/>
 
                    </template>
                </el-table-column>
				<el-table-column prop="relyIds"  label="类型编号" min-width="120" show-overflow-tooltip col-type="VARCHAR" v-if="showCol('relyIds')">
                    <template scope="scope">
                        <mdp-input show-style='tag' v-model="scope.row.relyIds" :color="scope.row.color" :disabled="!scope.row.itemId" @change="editSomeFields(scope.row,'relyIds',$event)"/>
 
                    </template>
                </el-table-column>
				<el-table-column prop="relySubTypes"  label="子类型" min-width="120" show-overflow-tooltip col-type="VARCHAR" v-if="showCol('relySubTypes')">
                    <template scope="scope">
                        <mdp-input show-style='tag' v-model="scope.row.relySubTypes" :color="scope.row.color" :disabled="!scope.row.itemId"  @change="editSomeFields(scope.row,'relySubTypes',$event)"/>
 
                    </template>
                </el-table-column>
				<el-table-column prop="relySubIds"  label="子类型编号" min-width="120" show-overflow-tooltip col-type="VARCHAR" v-if="showCol('relySubIds')">
                    <template scope="scope">
                        <mdp-input show-style='tag' v-model="scope.row.relySubIds" :color="scope.row.color" :disabled="!scope.row.itemId" @change="editSomeFields(scope.row,'relySubIds',$event)"/>
 
                    </template>
                </el-table-column>
				<el-table-column prop="unTargets"  label="禁止转至" min-width="120" show-overflow-tooltip col-type="VARCHAR" v-if="showCol('unTargets')">
                    <template scope="scope">
                        <mdp-input show-style='tag' v-model="scope.row.unTargets" :color="scope.row.color" :disabled="!scope.row.itemId" @change="editSomeFields(scope.row,'unTargets',$event)"/>
 
                    </template>
                </el-table-column>
				<el-table-column prop="itemId" label="字典编号" min-width="120" show-overflow-tooltip col-type="VARCHAR" v-if="showCol('itemId')"></el-table-column>
 
				<el-table-column label="操作" width="180">
                    <template slot="header" slot-scope="scope"> 
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope">
 				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="el-icon-edit" title="修改数据"></el-button>
                        <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="success" @click="copy(scope.row)" icon="el-icon-document-copy" title="拷贝并新增一条除了主键不一样其它都一样的数据"></el-button>
				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" title="删除一条数据"></el-button>
				    </template>
				</el-table-column>
			</el-table>
		</el-row>
		<el-row>
			<el-pagination
				layout="slot,total,sizes, prev, next,pager,jumper"
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
			<!--新增修改明细 ItemOption 字典选项值界面--> 
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data}">
 					<item-option-form :item="data.item" :ref="refId+'Form'" :sub-op-type="data.subOpType" :form-data="data.formData" :visible="visible" :parent-op-type="currOpType" @close="onFormClose" @submit="afterFormSubmit"  @fields-change="searchTableDatas"/>
				</template>
            </mdp-dialog>
        </el-row>
	</section>
</template>

<script>

 import { MdpTableMixin } from '../../mdp-ui/mixin/MdpTableMixin.js';
 import  ItemOptionForm from './Form';//新增修改明细界面
import { mapGetters } from 'vuex'

export default {
    name:'itemOptionMng',
    mixins:[MdpTableMixin],
    props:{
        item:{
            type:Object,
            default:null,
        }
    },
    components: {
        ItemOptionForm,
    },
    computed: {
        itemCpd(){
            if(this.item && this.item.id){ 
                return this.item
            }else if(this.itemDb && this.itemDb.id){
                return this.itemDb
            }else{
                return {}
            }
        }
    },
    watch:{
        "itemCpd.id":function(){
            this.initCurrData();
        }
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'字典选项值',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'itemOption',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id", "itemId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到
                'item.categoryId':'all',
                'res.id':'$IS NOT NULL',
            },
            editabled:false,
            //增删改查(含批量)接口
            apis:{
                list: this.$mdp.listItemOption,
                add: this.$mdp.addItemOption,
                del: this.$mdp.delItemOption,
                edit: this.$mdp.editItemOption,
                editSomeFields: this.$mdp.editSomeFieldsItemOption,
                batchAdd: this.$mdp.batchAddItemOption,
                batchDel: this.$mdp.batchDelItemOption,
                batchEdit: this.$mdp.batchEditItemOption,
            },
            predefineColors:this.$mdp.getDefaultColors(),
            itemDb:null,
        }
    },
    methods: { 
        /**
         * 该函数由组件自行扩展，添加一些需要的其它逻辑判断
         */
         initCurrData(){  
            
            this.initDefaultFilters();
            Object.assign(this.filters,this.defaultFilters)
            this.disabledRulesInit(this.disabledRules)  
            if(this.item && this.item.id){
                this.filters['itemId']=this.item.id
                this.searchTableDatas();
            }else{
                var itemCode=this.$route.params.itemCode
                if(itemCode){
                    this.$mdp.listItem({itemCode:itemCode,categoryId:'all'}).then(res=>{
                        var tips = res.data.tips
                        if(tips.isOk ){
                            var datas= res.data.data
                            this.itemDb=datas&&datas.length>0?datas[0]:null 
                            this.searchTableDatas();
                        }
                    })
                }else{
                    this.searchTableDatas();
                }
            }
            
         },
         /**
          * 检查参数是否满足调用后台接口的条件
          *
          * @param params 提交给后台的参数池,map类型
          * @returns true / false
          */
         preQueryParamCheck(params){
            if(this.item && this.item.id){
                params.itemId=this.item.id
            }else if(this.$route.params.itemCode){
                if(this.itemDb && this.itemDb.id){
                    params.itemId=this.itemDb.id
                }else{
                    return false;
                }
                
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
              
             params[fieldName]=$event
             return true;
         },
         copy(row){ 
            var params=Object.assign({},row)
            var func=this.apis.add
            params.id=row.id+"_1"
            func(params).then(res=>{
                var tips = res.data.tips
                if(tips.isOk){
                    this.searchTableDatas();
                }else{
                    this.$message.error(tips.msg)
                }
            })
         }
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>