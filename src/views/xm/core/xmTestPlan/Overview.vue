<template>
	<section>
		 <xm-test-plan-info v-if="testCasedb&&testCasedb.id" :xm-test-casedb="testCasedb"></xm-test-plan-info>
	</section>
</template>

<script>  
	import { mapGetters } from 'vuex'; 
	import XmTestPlanInfo from './XmTestPlanInfo'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles','testCasedb'
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
			XmTestPlanInfo,
			//在下面添加其它组件
		},  
		mounted() {   
		}
	}
</script>

<style scoped> 
</style>