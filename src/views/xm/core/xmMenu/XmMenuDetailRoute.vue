<template>
	<section class="padding">
		 <xm-menu-edit v-if="xmMenu" :xm-menu="xmMenu"  :visible="showInfo"></xm-menu-edit>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import {  listXmMenu } from '@/api/xm/core/xmMenu';
	import { mapGetters } from 'vuex'; 
	import XmMenuEdit from './XmMenuEdit'

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
				 xmMenu:null,
				 showInfo:false,
			}
		},//end data
		methods: { 
			 
			 
			 initByQueryId(){
				 if(this.$route.query && this.$route.query.menuId){
					var localStorageXmMenu=localStorage.getItem("xm-menu-info-route")
					var menu=null;
					if(localStorageXmMenu){
						menu=JSON.parse(localStorageXmMenu)
						if(menu && menu.menuId==this.$route.query.menuId){
							this.xmMenu=menu
							this.showInfo=true;
						}else{
							this.getXmMenu(this.$route.query.menuId);
						}
					}else{
						this.getXmMenu(this.$route.query.menuId);
					} 
				} 
			 },
			 getXmMenu(menuId){
				 listXmMenu({menuId:menuId}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmMenu=res.data.data[0]
						 localStorage.setItem("xm-menu-info-route",JSON.stringify(this.xmMenu)) 
						this.showInfo=true;
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmMenuEdit,
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