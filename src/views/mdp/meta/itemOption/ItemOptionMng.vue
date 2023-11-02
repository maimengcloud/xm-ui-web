<template>
	<section> 
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库  
	import { mapGetters } from 'vuex' 
	
	export default {
		name:'ItemOptionMng',

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
		},
		mounted() { 
		}
	}

</script>

<style scoped>

</style>