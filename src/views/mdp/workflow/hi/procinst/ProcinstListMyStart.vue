<template>
	<section>
		<procinst-mng isMyStart="true"></procinst-mng>
	</section>
</template>

<script>
	 
	import  ProcinstMng from './ProcinstMng';//
	
	export default {
		name:'ProcinstListMyStart',
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
		    'procinst-mng':ProcinstMng
		    //在下面添加其它组件
		},
		mounted() {
			 
		}
	}

</script>

<style scoped>

</style>