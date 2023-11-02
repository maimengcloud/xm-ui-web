<template> 
  <section> 
    <mo-order-mng :is-my-branch="true"></mo-order-mng>
	</section>
</template>

<script> 
	import { mapGetters } from 'vuex'
  import MoOrderMng from './Index.vue';
	
	export default {
	    name:'myMoOrderMng',
		components: {
		    MoOrderMng ,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            
		},
		data() {
			return {
				 
			}
		},//end data
		methods: {
 
			
		},//end methods
		mounted() { 
		}
	}

</script>

<style scoped>
</style>