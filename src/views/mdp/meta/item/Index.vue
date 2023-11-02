<template>
	<section class="border padding">
		<el-row>
			 <mdp-select v-model="filters.categoryId" item-code="categoryId" :disabled="!!categoryId" @change="(v)=>addForm.categoryId=v"/>
  			<el-input v-model="filters.itemCode" style="width: 20%;" placeholder="代码模糊查询" clearable></el-input>
			<el-input v-model="filters.itemName" style="width: 20%;" placeholder="名称模糊查询" clearable></el-input>
			 <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas" icon="el-icon-search" type="primary">查询</el-button>
			 <span style="float:right;">
				<el-button type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm})" icon="el-icon-plus" circle> </el-button>
 			</span>
		</el-row>
		<el-row>   
			<mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/> 
			<el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>   
		</el-row>
		<el-row>
			<!--列表 Item 数据项定义-->
			<el-table :ref="getRefId()+'Table'" height="100px" :data="tableDatas" v-adaptive="{bottomOffset: 50}"  @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column sortable type="index" width="40"></el-table-column> 
				<el-table-column prop="itemName" label="字典名称" min-width="100" v-if="showCol('itemName')"></el-table-column>
				<el-table-column prop="itemCode" label="字典代码" min-width="100"  v-if="showCol('itemCode')"></el-table-column>
 				<el-table-column prop="itemType" label="输入类型" min-width="80"  v-if="showCol('itemType')">
					<template scope="scope"> 
					 <mdp-select show-style="tag" label="输入类型" v-model="scope.row.itemType" item-code="item_type"></mdp-select>
					</template>
				</el-table-column>  
				<el-table-column prop="dvalues" label="值" min-width="80" v-if="showCol('dvalues')" show-overflow-tooltip></el-table-column>  
				<!--
				<el-table-column prop="dnames" label="默认值" min-width="80" ></el-table-column>
				
 				<el-table-column prop="required" label="必须" min-width="80" ></el-table-column>
				<el-table-column prop="seq" label="顺序" min-width="80" ></el-table-column>
 				<el-table-column prop="show" label="显示" min-width="80" ></el-table-column>
				<el-table-column prop="qx" label="权限" min-width="80" ></el-table-column> 
				-->
				<el-table-column prop="remark" label="备注" min-width="80"  show-overflow-tooltip  v-if="showCol('remark')"></el-table-column> 
				<el-table-column label="操作" width="180" fixed="right"> 
                    <template slot="header" slot-scope="scope"> 
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
					<template scope="scope">
						<el-button v-if="['4','5','14','15'].some(k=>k==scope.row.itemType)" type="warning" @click="showOptionIndex(scope.row)" icon="el-icon-s-operation" circle></el-button>
						<el-button type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="el-icon-edit" circle></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" circle></el-button>
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
		<mdp-dialog :ref="refId+'FormDialog'">
			<template v-slot="{visible,data}">
				<item-form :ref="refId+'Form'" :sub-op-type="data.subOpType" :form-data="data.formData" :visible="visible" :parent-op-type="currOpType" @close="onFormClose" @submit="afterFormSubmit"></item-form>
			</template>
		</mdp-dialog>

		<mdp-dialog width="90%" title="列表明细" ref="itemOptionDialog">
			<template v-slot="{visible,data,dialog}">
				<item-option :visible="visible" :item="data.item" :bottomOffset="100"></item-option>
			</template>
		</mdp-dialog>
	</section>
</template>

<script>

	import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from '@/api/mdp_pub/mdp_config';//全局公共库  
	
	import * as ItemApi from '@/api/mdp/meta/item'; 
	import  ItemForm from './Form';//修改界面 
	import  ItemOption from '../itemOption/Index';//修改界面 
	export default {  

		mixins:[MdpTableMixin],
		props:['categoryId'], 
		watch:{
			categoryId(){
				this.initCurrData();
			}
		},
		data() {
			return {
				filters: {
					key: '',
					categoryId:'all',
					targetId:'',
				},  
				 //增删改查(含批量)接口
				 apis:{
					list:ItemApi.listItem,
					add:ItemApi.addItem,
					del:ItemApi.delItem,
					edit:ItemApi.editItem,
					editSomeFields:ItemApi.editSomeFieldsItem,
					batchAdd:null,
					batchDel:ItemApi.batchDelItem,
					batchEdit:null,
				},
				refId:'item',
				itemOptionIndexVisible:false,
			}
		},//end data
		methods: {  
			/**end 自定义函数请在上面加**/
			showOptionIndex(row){ 
				this.$refs['itemOptionDialog'].open({item:row})
			}, 
			/**
         * 页面初始话进行数据初始处理。该函数由组件自行扩展，添加一些需要的其它逻辑判断
         */
         initCurrData(){ 
            this.initDefaultFilters();
            Object.assign(this.filters,this.defaultFilters)
            this.disabledRulesInit(this.disabledRules)
			if(this.categoryId){
				this.filters.categoryId=this.categoryId
				this.addForm.categoryId=this.categoryId
			}else{
				this.filters.categoryId='all'
				this.addForm.categoryId='all'
			}
            this.searchTableDatas();
         },

         /**
          * 此函数由组件扩展,给defaultFilters添加其它的额外默认参数
          */
         initDefaultFilters(){ 
			this.defaultFilters['categoryId']='all'
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * 
         * @param params 提交给后台的参数池,map类型
         * @returns true / false
         */
        preQueryParamCheck(params){
			if(this.categoryId){
				params.categoryId=this.categoryId
			}
            return true;
        },
        /**
         * 此函数由组件自行扩展，增加一些规则到disabledRules
         */
        disabledRulesInit(disabledRules){

        },
		},//end methods
		components: {  
		    'item-form':ItemForm,
			ItemOption,
		},
		mounted() {   
		}
	}

</script>

<style scoped>
</style>