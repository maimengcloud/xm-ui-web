<template> 
	<section class="padding-left padding-right">
		<el-row :gutter="10"> 
			<el-col :span="7">
				<!--
				<el-row class="padding-left padding-right" v-if="!xmProduct||!xmProduct.id" > 
						<xm-product-select ref="xmProductSelect1" style="display:inline;"  :auto-select="true" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected" @clear="onProductClearSelect" ></xm-product-select>
				</el-row>
				-->
				<xm-epic-features :xm-product="xmProductCpd" :sel-project="selProject"  @row-click="onEpicFeaturesRowClick"  @product-selected="onProductSelected" @product-clear="onProductClearSelect"></xm-epic-features>
			</el-col> 
			<el-col :span="17" v-if="xmProductCpd && xmProductCpd.id" >
				<xm-menu-mng :xm-product="xmProductCpd" :sel-project="selProject"  :parent-menu="parentMenu" :xm-iteration="xmIteration" ></xm-menu-mng>
 
			</el-col>
			
			<el-col :span="17" v-else-if="filters.xmProduct && filters.xmProduct.id" >
				<xm-menu-mng :xm-product="filters.xmProduct" :sel-project="selProject" :parent-menu="parentMenu" :xm-iteration="xmIteration" ></xm-menu-mng>
 
			</el-col>
		</el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	
  	import  XmEpicFeatures from '@/views/xm/core/xmMenu/XmEpicFeatures';//新增界面
 	import  XmMenuMng from '@/views/xm/core/xmMenu/XmMenuMng';//新增界面
 	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面
	export default { 
        props:['xmProduct','xmIteration','selProject'],
		components: {   
			XmEpicFeatures,XmMenuMng,XmProductSelect
		}, 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
            xmProductCpd(){
				if(this.xmProduct && this.xmProduct.id){
					return this.xmProduct
				}
				if(this.xmIteration && this.xmIteration.id && this.xmIteration.productId){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
				return null;
			}
			
        }, 
		watch: {  
			
	    },
		data() {
			return { 
				filters:{
					xmProduct:null,
				},
				parentMenu:null, 
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...  

			}//end return
		},//end data
		methods: {  
			 onEpicFeaturesRowClick(menu){
				 this.parentMenu=menu
			 },
			 onProductSelected(product){
				this.filters.xmProduct=product 
				this.parentMenu=null
			 },
			 onProductClearSelect(){
				this.filters.xmProduct=null;
				this.parentMenu=null
			 }
		},//end method
		mounted() {
			 this.filters.xmProduct={...this.xmProduct}
			 if(this.xmIteration && this.xmIteration.id){
				if(!this.xmProduct || !this.xmProduct.id){
					this.filters.xmProduct={id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
			 }
			
		}//end mounted
	}

</script>

<style lang="less" scoped>  
</style>