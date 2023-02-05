<template>
	<section>
		 <rpt-index :xm-iteration="xmIteration" :xm-product="xmProduct" category="迭代级"></rpt-index>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex'; 
	import rptIndex from './index'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles','xmIteration'
				]), 
			xmProduct:function(){
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
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