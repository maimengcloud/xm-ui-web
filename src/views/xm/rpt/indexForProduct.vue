<template>
	<section>
		 <rpt-index :xm-product="xmProduct"  category="产品级"></rpt-index>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex'; 
	import rptIndex from './index'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles','xmProduct'
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