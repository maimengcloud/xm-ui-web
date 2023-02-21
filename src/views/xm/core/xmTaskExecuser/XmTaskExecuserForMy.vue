<template>
	<section> 
			 <xm-task-execuser-mng :is-my="1"></xm-task-execuser-mng> 
	</section>
</template>

<script>
	import { mapGetters } from 'vuex';
	import XmTaskExecuserMng from './XmTaskExecuserMng';
	
	export default { 
		props: [],
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),
			 
		}, 
		watch: {
			 
		},
		data() {
			return {
				 
			}
		},//end data
		methods: {
			  
			
		},//end methods
		components: { 
		   XmTaskExecuserMng
		    //在下面添加其它组件
		},
		mounted() {
		}
	}

</script>

<style scoped>
 
</style>