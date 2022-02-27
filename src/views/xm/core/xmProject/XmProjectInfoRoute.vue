<template>
	<section>
		 <xm-project-info v-if="selProject" :sel-project="selProject" :visible="showInfo" @submit="afterEditSubmit"></xm-project-info>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import { mapGetters } from 'vuex'; 
	import XmProjectInfo from './XmProjectInfo'

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
			 afterEditSubmit(project){
				this.selProject=project;
				localStorage.setItem('xm-project-info-route',JSON.stringify(this.selProject));
				this.$emit('submit',project)
			 }
			 
			
		},//end methods
		components: {  
			XmProjectInfo,
			//在下面添加其它组件
		},
		activated(){
			if(this.$route.params && this.$route.params.id){
				  this.selProject=this.$route.params
				  this.showInfo=true;
				  localStorage.setItem('xm-project-info-route',JSON.stringify(this.selProject));
			}else{
				this.selProject=JSON.parse(localStorage.getItem("xm-project-info-route"))
				this.showInfo=true;
			}
		},
		mounted() {  
			  if(this.$route.params && this.$route.params.id){
				  this.selProject=this.$route.params
				  this.showInfo=true;
				  localStorage.setItem('xm-project-info-route',JSON.stringify(this.selProject));
			  }else{
				this.selProject=JSON.parse(localStorage.getItem("xm-project-info-route"))
				this.showInfo=true;
			}
		}
	}
</script>

<style scoped> 
</style>