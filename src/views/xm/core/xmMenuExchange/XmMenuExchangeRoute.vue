<template>
	<section class="padding">  
		
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import { mapGetters } from 'vuex'
	import {sn} from '@/common/js/sequence';  

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
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
			 
		},
		mounted() { 
			 
		}
	}

</script>

<style scoped>
 
</style>