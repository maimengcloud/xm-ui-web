<template>
	<section>
		 <xm-test-plan-info  v-if="xmTestPlan && xmTestPlan.id" :xm-test-casedb="testCasedb" :xm-test-plan="xmTestPlan"></xm-test-plan-info>
	</section>
</template>

<script>  
	import { mapGetters } from 'vuex'; 
	import XmTestPlanInfo from './XmTestPlanInfo'

	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo','roles','testCasedb'
				]), 
		}, 
		watch:{
			 
		},
		data() {
			return {  
				xmTestPlan:null,
			}
		},//end data
		methods: {  
			  
		},//end methods
		components: {  
			XmTestPlanInfo,
			//在下面添加其它组件
		},  
		mounted() {   
			var planId=this.$route.query.id
			if(planId){ 
				var key="xm-test-plan-info-"+planId
				var str=sessionStorage.getItem(key)
				if(str && str!='null' && str!='undefined'){
					this.xmTestPlan=JSON.parse(str)
				}
			}
		}
	}
</script>

<style scoped> 
</style>