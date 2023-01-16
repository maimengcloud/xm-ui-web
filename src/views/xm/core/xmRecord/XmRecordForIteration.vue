<template>
	<section>
		 <xm-record-mng  v-if="xmIteration && xmIteration.id" :xm-product="{id:xmIteration.productId,productName:xmIteration.productName}"></xm-record-mng>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex'; 
	import XmRecordMng from './XmRecordMng'

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
			XmRecordMng,
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