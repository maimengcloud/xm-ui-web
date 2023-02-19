<template>
	<section class="padding">
		 <xm-test-casedb-env v-if="testCasedb&&testCasedb.id" :xmTestCasedb="testCasedb" @edit-fields="onEditFields"></xm-test-casedb-env>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	  
	import { mapGetters } from 'vuex'; 
	import XmTestCasedbEnv from './XmTestCasedbEnv'
	import store from '@/store'  

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
			onEditFields(row){
				store.dispatch('setTestCasedb',row)
			}
		},//end methods
		components: {  
			XmTestCasedbEnv, 
		},  
		mounted() {   
		}
	}
</script>

<style scoped> 
</style>