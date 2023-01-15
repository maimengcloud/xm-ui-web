<template>
	<section>
		 <xm-record-mng :sel-project="projectInfo"></xm-record-mng>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex'; 
	import XmRecordMng from './XmRecordMng'

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