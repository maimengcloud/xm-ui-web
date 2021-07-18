<template>
	<section>
		 <xm-product-info v-if="xmProduct" :xm-product="xmProduct" :visible="showInfo"></xm-product-info>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import { mapGetters } from 'vuex'; 
	import XmProductInfo from './XmProductInfo'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			 
		},
		data() {
			return { 
				 xmProduct:null,
				 showInfo:false,
			}
		},//end data
		methods: { 
			 
			 
			
		},//end methods
		components: {  
			XmProductInfo,
			//在下面添加其它组件
		},
		activated(){
			if(this.$route.params && this.$route.params.id){
				  this.xmProduct=this.$route.params
				  this.showInfo=true;
				  localStorage.setItem('xm-product-info-route',JSON.stringify(this.xmProduct));
			}else{
				this.xmProduct=JSON.parse(localStorage.getItem("xm-product-info-route"))
				this.showInfo=true;
			}
		},
		mounted() {  
			  if(this.$route.params && this.$route.params.id){
				  this.xmProduct=this.$route.params
				  this.showInfo=true;
				  localStorage.setItem('xm-product-info-route',JSON.stringify(this.xmProduct));
			  }else{
				this.xmProduct=JSON.parse(localStorage.getItem("xm-product-info-route"))
				this.showInfo=true;
			}
		}
	}
</script>

<style scoped> 
</style>