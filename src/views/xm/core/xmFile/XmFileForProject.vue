<template>
	<section>
		<mdp-select-att archive-type="0" crely-type="xm-project" :crely-id="projectInfo.id"></mdp-select-att>
	</section>
</template>

<script> 
	  
	import { mapGetters } from 'vuex';  

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