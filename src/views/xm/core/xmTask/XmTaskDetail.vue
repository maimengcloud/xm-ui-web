<template>
 	<xm-task-edit v-if="xmTaskDb&&xmTaskDb.id && showInfo" :xm-task="xmTaskDb"  :visible="showInfo"></xm-task-edit>
 </template>

<script> 
	 
	import {  listXmTask } from '@/api/xm/core/xmTask';
	import { mapGetters } from 'vuex';  

	export default {  
		props:['xmTask','reload','visible'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			 'visible':function(){
				if(this.visible){
					if(this.reload&&this.xmTask && this.xmTask.id){ 
						this.getTask(this.xmTask.id)
					}else{
						this.xmTaskDb=this.xmTask
						this.showInfo=true
					}
				}else{
					this.showInfo=false
				}
				
				
			 }
		},
		data() {
			return { 
				 xmTaskDb:null, 
				 showInfo:false,
			}
		},//end data
		methods: { 
			  
			 getTask(id){
				debugger;
				if(!id){
					this.xmTaskDb=null
					return;
				}
				 listXmTask({id:id}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmTaskDb=res.data.data[0] 
						 this.showInfo=true
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmTaskEdit:()=>import("./XmTaskEdit"),
			//在下面添加其它组件
		},  
		mounted() {  
			  if(this.reload&&this.visible&&this.xmTask && this.xmTask.id){
					this.getTask(this.xmTask.id)
				} 
		}
	}
</script>

<style scoped> 
</style>