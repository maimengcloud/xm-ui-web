<template>
	<section>
		<xm-contract-mng :sel-project="projectInfo"></xm-contract-mng>
	</section>
</template>

<script> 
	 
	import { mapGetters } from 'vuex';   
	import XmContractMng from './XmContractMng.vue'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles','projectInfo'
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
			XmContractMng,
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