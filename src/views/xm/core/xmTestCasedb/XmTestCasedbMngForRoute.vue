<template>
	<section class="padding">
		 <xm-test-casedb-mng></xm-test-casedb-mng>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	  
	import { mapGetters } from 'vuex'; 
	import XmTestCasedbMng from './XmTestCasedbMng'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
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
			XmTestCasedbMng, 
		},  
		mounted() {   
		}
	}
</script>

<style scoped> 
</style>