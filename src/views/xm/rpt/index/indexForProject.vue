<template>
	<section class="padding">
		 <rpt-index :xm-project="projectInfo"  category="项目级"></rpt-index>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex'; 
	import rptIndex from './index'

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