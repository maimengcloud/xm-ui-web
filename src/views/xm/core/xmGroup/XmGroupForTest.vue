<template>
	<section class="padding">
		 <xm-group-mng :xm-product="xmProduct"  :visible="xmProduct && xmProduct.id"></xm-group-mng>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import {  listXmProject } from '@/api/xm/core/xmProject';
	import { mapGetters } from 'vuex'; 
	import XmGroupMng from './XmGroupMng'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles','testCasedb'
				]), 
			xmProduct(){
				if(this.testCasedb && this.testCasedb.id){
					return {id:this.testCasedb.productId,productName:this.testCasedb.productName}
				}else{
					return null;
				}
			}
		}, 
		watch:{
			 
		},
		data() {
			return {  
			}
		},//end data
		methods: {  
			
		},//end methods
		components: {  
			XmGroupMng,
			//在下面添加其它组件
		}, 
		activated(){ 
		},
		mounted() {   
		}
	}
</script>

<style scoped> 
</style>