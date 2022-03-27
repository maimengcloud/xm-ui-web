<template>
	<section>
		<el-row class="xm-task">
			 <xm-task-mng :source="source" :is-task-center="1" :is-my="1"></xm-task-mng>
		</el-row>
	</section>
</template>

<script>
	import { mapGetters } from 'vuex';
	import xmTaskMng from './XmTaskMng';
	
	export default { 
		props: ['source'],
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
		   xmTaskMng
		    //在下面添加其它组件
		},
		mounted() {
		}
	}

</script>

<style scoped>
 
</style>