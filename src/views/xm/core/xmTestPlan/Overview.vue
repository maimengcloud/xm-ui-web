<template>
	<section>
		 <xm-test-plan-mng v-if="testCasedb&&testCasedb.id" :xm-test-casedb="testCasedb"></xm-test-plan-mng>
	</section>
</template>

<script>  
	import { mapGetters } from 'vuex'; 
	import XmTestPlanMng from './XmTestPlanMng'

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
			XmTestPlanMng,
			//在下面添加其它组件
		},  
		mounted() {   
		}
	}
</script>

<style scoped> 
</style>