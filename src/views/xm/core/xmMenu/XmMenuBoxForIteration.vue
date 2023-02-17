<template>
	<section class="padding">  
		<xm-menu-box v-if="xmProduct&&xmProduct.id" :xm-iteration="xmIteration" :xm-product="xmProduct"></xm-menu-box>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import XmMenuBox from './XmMenuBox.vue'
	import { mapGetters } from 'vuex'	  
	export default {  
		components: {    
			XmMenuBox
		}, 
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
		watch: {   
	    },
		data() {
			return { 
				 

			}//end return
		},//end data
		methods: {  
			  
		},//end method
		mounted() { 
			
		}//end mounted
	}

</script>

<style lang="less" scoped> 

</style>