<template>
	 <section>
		 <item-mng :category-id="'sysParams'"> 
		 </item-mng>
	 </section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from '@/api/mdp_pub/mdp_config';//全局公共库 
	import { mapGetters } from 'vuex' 
	import ItemMng from '../item/Index.vue';
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