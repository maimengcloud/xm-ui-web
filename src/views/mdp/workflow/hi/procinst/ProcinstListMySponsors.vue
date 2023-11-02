<template>
	<section>
		<procinst-mng isMySponsors="true"></procinst-mng>
	</section>
</template>

<script>
	 
	import  ProcinstMng from './Index';//
	
	export default {
		name:'ProcinstListMySponsors',
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