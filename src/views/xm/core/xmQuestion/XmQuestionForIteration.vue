<template>
	<xm-question-mng v-if="xmIteration && xmIteration.id" class="padding-top" :xm-product="xmProduct" :xm-iteration="xmIteration"></xm-question-mng>
</template>

<script>
	import util from '@/common/js/util';//全局公共库

	import config from '@/common/config';//全局公共库
	 
	import  XmQuestionMng from './XmQuestionMng';//修改界面
	import { mapGetters } from 'vuex' 

	export default {
		computed: {
			...mapGetters([
				'userInfo','roles','xmIteration'
			]),
			xmProduct(){
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}else{
					return null;
				}
				
			}
		}, 
		 
		data() {
			 
			return {
				 

			}

		},//end data
		methods: {
			 

		},//end methods
		components: {
			 XmQuestionMng
		},
		mounted() {
			 
		}
	}

</script>

<style lang="scss" scoped>
 
</style>
