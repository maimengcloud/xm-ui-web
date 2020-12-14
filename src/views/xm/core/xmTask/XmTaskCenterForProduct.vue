<template>
	<section>
		<el-row class="xm-task">
			 <xm-task-list-for-product :xm-product="filters.xmProduct"></xm-task-list-for-product>
		</el-row>
	</section>
</template>

<script>
 
	
	import { mapGetters } from 'vuex';
	import XmTaskListForProduct from './XmTaskListForProduct';
	
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
				filters:{
					xmProduct:null,
				}
				 
			}
		},//end data
		methods: {
			  
			
		},//end methods
		components: { 
		   XmTaskListForProduct
		    //在下面添加其它组件
		},
		mounted() {
			if(this.$route.params){
				this.filters.xmProduct={
					id:this.$route.params.productId,
					productName:this.$route.params.productName
				} 
			}
		}
	}

</script>

<style scoped>
 
</style>