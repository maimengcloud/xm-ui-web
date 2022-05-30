<template>
	<section>
		 <xm-product-info v-if="xmProduct" :xm-product="xmProduct" :visible="showInfo"></xm-product-info>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import {  listXmProductWithState } from '@/api/xm/core/xmProduct';
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
			 
			 
			 initByQueryId(){
				 if(this.$route.query && this.$route.query.id){
					var localStorageProduct=localStorage.getItem("xm-product-info-route")
					var product=null;
					if(localStorageProduct){
						product=JSON.parse(localStorageProduct)
						if(product && product.id==this.$route.query.id){
							this.xmProduct=product
							this.showInfo=true;
						}else{
							this.getProduct(this.$route.query.id);
						}
					}else{
						this.getProduct(this.$route.query.id);
					} 
				} 
			 },
			 getProduct(id){
				 listXmProductWithState({id:id}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmProduct=res.data.data[0]
						 localStorage.setItem("xm-product-info-route",JSON.stringify(this.xmProduct)) 
						this.showInfo=true;
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmProductInfo,
			//在下面添加其它组件
		}, 
		activated(){
			this.initByQueryId();
		},
		mounted() {  
			  this.initByQueryId();
		}
	}
</script>

<style scoped> 
</style>