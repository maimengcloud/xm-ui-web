<template>
	<section>
		 <report-index :xm-iteration="xmIteration" :xm-product="{id:xmIteration.productId,productName:xmIteration.productName}"></report-index>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex'; 
	import reportIndex from './reportIndex'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles','xmIteration'
				]), 
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