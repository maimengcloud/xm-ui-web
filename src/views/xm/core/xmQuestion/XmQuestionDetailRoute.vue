<template>
	<section class="padding">
		 <xm-question-edit v-if="xmQuestion" :xm-question="xmQuestion"  :visible="showInfo"></xm-question-edit>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import {  listXmQuestion } from '@/api/xm/core/xmQuestion';
	import { mapGetters } from 'vuex'; 
	import XmQuestionEdit from './XmQuestionEdit'

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
				 xmQuestion:null,
				 showInfo:false,
			}
		},//end data
		methods: { 
			 
			 
			 initByQueryId(){
				 if(this.$route.query && this.$route.query.id){
					var localStorageXmQuestion=localStorage.getItem("xm-question-info-route")
					var question=null;
					if(localStorageXmQuestion){
						question=JSON.parse(localStorageXmQuestion)
						if(question && question.id==this.$route.query.id){
							this.xmQuestion=question
							this.showInfo=true;
						}else{
							this.getXmQuestion(this.$route.query.id);
						}
					}else{
						this.getXmQuestion(this.$route.query.id);
					} 
				} 
			 },
			 getXmQuestion(id){
				 listXmQuestion({id:id}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmQuestion=res.data.data[0]
						 localStorage.setItem("xm-question-info-route",JSON.stringify(this.xmQuestion)) 
						this.showInfo=true;
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmQuestionEdit,
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