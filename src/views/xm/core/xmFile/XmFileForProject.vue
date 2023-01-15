<template>
	<section>
		 <xm-file-mng :sel-project="projectInfo"></xm-file-mng>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex'; 
	import XmFileMng from './XmFileMng'

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
			XmFileMng,
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