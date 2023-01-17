<template>
	<section>
		 <xm-test-casedb-edit v-if="testCasedb&&testCasedb.id" :xm-test-casedb="testCasedb"></xm-test-casedb-edit>
	</section>
</template>

<script>  
	import { mapGetters } from 'vuex'; 
	import XmTestCasedbEdit from './XmTestCasedbEdit'

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
			XmTestCasedbEdit,
			//在下面添加其它组件
		},  
		mounted() {   
		}
	}
</script>

<style scoped> 
</style>