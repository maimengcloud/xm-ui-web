<template>
	<section> 
		<el-row>
			<el-col :span="8">
				<xm-epic-features :xm-product="xmProduct" :sel-project="selProject" queryScope="plan" @row-click="onEpicFeaturesRowClick"></xm-epic-features>
			</el-col> 
			<el-col :span="16">
				<xm-menu-mng :xm-product="xmProduct" :sel-project="selProject" queryScope="task" :parent-menu="parentMenu"></xm-menu-mng>
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
	export default { 
        
		components: {   
			XmEpicFeatures,XmMenuMng
		},
        props:['xmProduct','selProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
            
			
        }, 
		watch: {  
			 
	    },
		data() {
			return { 
				parentMenu:null, 
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...  

			}//end return
		},//end data
		methods: {  
			 onEpicFeaturesRowClick(menu){
				 this.parentMenu=menu
			 }
		},//end method
		mounted() {
			 
			
		}//end mounted
	}

</script>

<style scoped>
 
</style>