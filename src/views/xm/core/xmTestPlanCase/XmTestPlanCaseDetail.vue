<template>
 	<xm-test-plan-case-edit v-loading="load.list" v-if="xmTestPlanCaseDb&&xmTestPlanCaseDb.caseId && showInfo" :xm-test-case="xmTestPlanCaseDb"  :visible="showInfo"></xm-test-plan-case-edit>
 </template>

<script> 
	 
	import {  listXmTestPlanCase } from '@/api/xm/core/xmTestPlanCase';
	import { mapGetters } from 'vuex';  

	export default {  
		props:['xmTestPlanCase','reload','visible'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			 'visible':function(){
				if(this.visible){
					if(this.reload){ 
						this.getXmTestPlanCase(this.xmTestPlanCase.planId,this.xmTestPlanCase.caseId)
					}else{
						this.xmTestPlanCaseDb=this.xmTestPlanCase
						this.showInfo=true
					}
				}else{
					this.showInfo=false
				}
				
				
			 }
		},
		data() {
			return { 
				load:{list:false},
				 xmTestPlanCaseDb:null, 
				 showInfo:false,
			}
		},//end data
		methods: { 
			  
			 getXmTestPlanCase(planId,caseId){
				if(!planId){
					this.xmTestPlanCaseDb=null
					return;
				}
				
					this.load.list=true;
				 listXmTestPlanCase({planId:planId,caseId:caseId}).then(res=>{
					
					this.load.list=false;
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmTestPlanCaseDb=res.data.data[0] 
						 this.showInfo=true
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmTestPlanCaseEdit:()=>import("./XmTestPlanCaseEdit"),
			//在下面添加其它组件
		},  
		mounted() {  
			  if(this.reload){

					this.getXmTestPlanCase(this.xmTestPlanCase.planId,this.xmTestPlanCase.caseId)
				}else{
					this.xmTestPlanCaseDb=this.xmTestPlanCase
				}
		}
	}
</script>

<style scoped> 
</style>