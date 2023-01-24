<template>
	<section class="padding" style="width:800px;">
		 <xm-func-select v-if="xmProduct && xmProduct.id" :xm-product="xmProduct"></xm-func-select>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	  
	import { mapGetters } from 'vuex'; 
	import XmFuncSelect from './XmFuncSelect'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles','xmProduct'
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
			XmFuncSelect, 
		},  
		mounted() {   
		}
	}
</script>

<style scoped> 
</style>