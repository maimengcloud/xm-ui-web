<template>
	<section class="padding">
		 <xm-task-edit v-if="xmTask" :xm-task="xmTask"  :visible="showInfo"></xm-task-edit>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import {  listXmTask } from '@/api/xm/core/xmTask';
	import { mapGetters } from 'vuex'; 
	import XmTaskEdit from './XmTaskEdit'

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
				 xmTask:null,
				 showInfo:false,
			}
		},//end data
		methods: { 
			 
			 
			 initByQueryId(){
				 if(this.$route.query && this.$route.query.id){
					var localStorageTask=localStorage.getItem("xm-task-info-route")
					var task=null;
					if(localStorageTask){
						task=JSON.parse(localStorageTask)
						if(task && task.id==this.$route.query.id){
							this.xmTask=task
							this.showInfo=true;
						}else{
							this.getTask(this.$route.query.id);
						}
					}else{
						this.getTask(this.$route.query.id);
					} 
				} 
			 },
			 getTask(id){
				 listXmTask({id:id}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmTask=res.data.data[0]
						 localStorage.setItem("xm-task-info-route",JSON.stringify(this.xmTask)) 
						this.showInfo=true;
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmTaskEdit,
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