<template>
	<section>
		 <xm-test-case-mng v-if="testCasedb&&testCasedb.id" :xm-test-casedb="testCasedb"></xm-test-case-mng>
	</section>
</template>

<script>  
	import { mapGetters } from 'vuex'; 
	import XmTestCaseMng from './XmTestCaseMng'

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
			XmTestCaseMng,
			//在下面添加其它组件
		},  
		mounted() {   
		}
	}
</script>

<style scoped> 
</style>