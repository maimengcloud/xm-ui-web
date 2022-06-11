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
				 if(this.$route.query && this.$route.query.id){
					var localStorageXmMenu=localStorage.getItem("xm-menu-info-route")
					var menu=null;
					if(localStorageXmMenu){
						menu=JSON.parse(localStorageXmMenu)
						if(menu && menu.id==this.$route.query.id){
							this.xmMenu=menu
							this.showInfo=true;
						}else{
							this.getXmMenu(this.$route.query.id);
						}
					}else{
						this.getXmMenu(this.$route.query.id);
					} 
				} 
			 },
			 getXmMenu(id){
				 listXmMenu({id:id}).then(res=>{
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