<template>
	<section>
		 <rpt-index :xm-product="xmProduct" :xm-test-casedb="testCasedb"  category="测试库级"></rpt-index>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex'; 
	import rptIndex from './index'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles','testCasedb'
				]), 
			xmProduct:function(){
				if(this.testCasedb&&this.testCasedb.id){
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
			rptIndex,
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