<template>
 	<xm-test-case-edit v-if="xmTestCaseDb&&xmTestCaseDb.id && showInfo" :xm-test-case="xmTestCaseDb"  :visible="showInfo"></xm-test-case-edit>
 </template>

<script> 
	 
	import {  listXmTestCase } from '@/api/xm/core/xmTestCase';
	import { mapGetters } from 'vuex';  

	export default {  
		props:['xmTestCase','reload','visible'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			 'visible':function(){
				if(this.visible){
					if(this.reload){ 
						this.getXmTestCase(this.xmTestCase.id)
					}else{
						this.xmTestCaseDb=this.xmTestCase
						this.showInfo=true
					}
				}else{
					this.showInfo=false
				}
				
				
			 }
		},
		data() {
			return { 
				 xmTestCaseDb:null, 
				 showInfo:false,
			}
		},//end data
		methods: { 
			  
			 getXmTestCase(id){
				if(!id){
					this.xmTestCaseDb=null
					return;
				}
				 listXmTestCase({id:id}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmTestCaseDb=res.data.data[0] 
						 this.showInfo=true
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmTestCaseEdit:()=>import("./XmTestCaseEdit"),
			//在下面添加其它组件
		},  
		mounted() {  
			  if(this.reload){

					this.getXmTestCase(this.xmTestCase.id)
				}else{
					this.xmTestCaseDb=this.xmTestCase
				}
		}
	}
</script>

<style scoped> 
</style>