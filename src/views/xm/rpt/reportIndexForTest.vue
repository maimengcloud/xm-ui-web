<template>
	<section>
		 <report-index :xm-product="xmProduct" :xm-test-casedb="testCasedb"></report-index>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex'; 
	import reportIndex from './reportIndex'

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
			reportIndex,
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