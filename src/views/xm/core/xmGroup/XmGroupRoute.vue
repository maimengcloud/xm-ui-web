<template>
	<section class="padding">
		 <xm-group-mng v-if="selProject" :sel-project="selProject"  :visible="showInfo"></xm-group-mng>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import {  listXmProject } from '@/api/xm/core/xmProject';
	import { mapGetters } from 'vuex'; 
	import XmGroupMng from './XmGroupMng'

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
				 selProject:null,
				 showInfo:false,
			}
		},//end data
		methods: { 
			 
			 
			 initByQueryId(){
				 if(this.$route.query && this.$route.query.projectId){ 
					this.getXmProject(this.$route.query.projectId); 
				} 
			 },
			 getXmProject(projectId){
				 listXmProject({id:projectId}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.selProject=res.data.data[0]
 						this.showInfo=true;
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmGroupMng,
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