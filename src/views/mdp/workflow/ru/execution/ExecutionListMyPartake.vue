<template>
	<section>
		<execution-mng isMyPartake="true"></execution-mng>
	</section>
</template>

<script>
	 
	import  ExecutionMng from './ExecutionMng';//
	
	export default {
		name:'ExecutionListMyPartake',
		data() {
			return {
				filters: {
					key: '', 
				},
				 
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 
			
		},//end methods
		components: { 
		    'execution-mng':ExecutionMng
		    //在下面添加其它组件
		},
		mounted() {
			 
		}
	}

</script>

<style scoped>

</style>