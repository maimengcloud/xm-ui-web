<template>
	<section>
		 <xm-project-info v-if="selProject" :sel-project="selProject" :visible="showInfo" @submit="afterEditSubmit"></xm-project-info>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import { mapGetters } from 'vuex'; 
	import XmProjectInfo from './XmProjectInfo'
	import { listXmProject} from '@/api/xm/core/xmProject'; 

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
			 },
			 initByQueryId(){
				 if(this.$route.query && this.$route.query.id){
					var localStorageProject=localStorage.getItem("xm-project-info-route")
					var project=null;
					if(localStorageProject && localStorageProject!='undefined'){
						project=JSON.parse(localStorageProject)
						if(project && project.id==this.$route.query.id){
							this.selProject=project
							this.showInfo=true;
						}else{
							this.getProject(this.$route.query.id);
						}
					}else{
						this.getProject(this.$route.query.id);
					} 
				} 
			 },
			 getProject(id){
				 listXmProject({id:id}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.selProject=res.data.data[0]
						 localStorage.setItem("xm-project-info-route",JSON.stringify(this.selProject)) 
						this.showInfo=true;
					 }else{

					 }
				 })
			 }
			 
			
		},//end methods
		components: {  
			XmProjectInfo,
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