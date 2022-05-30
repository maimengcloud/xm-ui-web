<template>
	<section>
		 <xm-iteration-info v-if="xmIteration" :xm-iteration="xmIteration" :visible="showInfo"></xm-iteration-info>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import { mapGetters } from 'vuex'; 
	import XmIterationInfo from './XmIterationInfo'
	import { listXmIterationWithState } from '@/api/xm/core/xmIteration';

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
			 initByQueryId(){
				 if(this.$route.query && this.$route.query.id){
					var localStorageIteration=localStorage.getItem("xm-iteration-info-route")
					var iteration=null;
					if(localStorageIteration){
						iteration=JSON.parse(localStorageIteration)
						if(iteration && iteration.id==this.$route.query.id){
							this.xmIteration=iteration
							this.showInfo=true;
						}else{
							this.getIteration(this.$route.query.id);
						}
					}else{
						this.getIteration(this.$route.query.id);
					} 
				} 
			 },
			 getIteration(id){
				 listXmIterationWithState({id:id}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmIteration=res.data.data[0]
						 localStorage.setItem("xm-iteration-info-route",JSON.stringify(this.xmIteration)) 
						this.showInfo=true;
					 }else{

					 }
				 })
			 }
			 
			
		},//end methods
		components: {  
			XmIterationInfo,
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