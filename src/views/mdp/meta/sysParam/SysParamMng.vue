<template>
	 <section>
		 <item-mng :category-id="'sysParam'"> 
		 </item-mng>
	 </section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { mapGetters } from 'vuex' 
	import ItemMng from '../item/ItemMng.vue';
	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				 
			}
		},//end data
		methods: { 
			  
			
		},//end methods
		components: {  
			ItemMng,
		},
		mounted() {   
		}
	}

</script>

<style scoped>
</style>