<template>
	<section>
		 <xm-project-mng :data-scope="'all'"></xm-project-mng>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件 
	import { mapGetters } from 'vuex'
	import xmProjectMng from './XmProjectMng';
	
	export default { 
		computed: {
			...mapGetters([
				'userInfo'
			]), 
		},
		watch: {
			 
		},
		data() {
			return {
				 
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    xmProjectMng
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				  
      		}); 
		}
	}

</script>

<style scoped> 
</style>