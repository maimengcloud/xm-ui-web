<template>
	<section>
		 <xm-task-mng :xm-product="xmProduct"></xm-task-mng>
	</section>
</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	import { mapGetters } from 'vuex'
	import XmTaskMng from './XmTaskMng.vue';

	export default { 
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),   
		},
		props: ["xmProduct",'isMultiSelect'],
		watch: {
			"selkey": function(val) {
				// console.log("任务类型");
			},
			"xmProduct": function(xmProduct) {  
				  
			}, 
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
			  XmTaskMng
			 
		    //在下面添加其它组件
		},
		mounted() { 
			 	
		}
	}

</script>

<style scoped> 
</style>