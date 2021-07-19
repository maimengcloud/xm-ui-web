<template>
	<section>
		 <xm-iteration-info v-if="xmIteration" :xm-iteration="xmIteration" :visible="showInfo"></xm-iteration-info>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import { mapGetters } from 'vuex'; 
	import XmIterationInfo from './XmIterationInfo'

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
				 xmIteration:null,
				 showInfo:false,
			}
		},//end data
		methods: { 
			 
			 
			
		},//end methods
		components: {  
			XmIterationInfo,
			//在下面添加其它组件
		},
		activated(){
			if(this.$route.params && this.$route.params.id){
				  this.xmIteration=this.$route.params
				  this.showInfo=true;
				  localStorage.setItem('xm-iteration-info-route',JSON.stringify(this.xmIteration));
			}else{
				this.xmIteration=JSON.parse(localStorage.getItem("xm-iteration-info-route"))
				this.showInfo=true;
			}
		},
		mounted() {  
			  if(this.$route.params && this.$route.params.id){
				  this.xmIteration=this.$route.params
				  this.showInfo=true;
				  localStorage.setItem('xm-iteration-info-route',JSON.stringify(this.xmIteration));
			  }else{
				this.xmIteration=JSON.parse(localStorage.getItem("xm-iteration-info-route"))
				this.showInfo=true;
			}
		}
	}
</script>

<style scoped> 
</style>