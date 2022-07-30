<template>
	<section>
		 <xm-question-edit v-load="load.list" v-if="xmQuestionDb" :xm-question="xmQuestionDb"  :visible="showInfo"></xm-question-edit>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import {  listXmQuestion } from '@/api/xm/core/xmQuestion';
	import { mapGetters } from 'vuex'; 
	import XmQuestionEdit from './XmQuestionEdit'

	export default {  
		props:['xmQuestion','reload','visible'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			 visible:function(){
				if(this.visible==true){
					if(this.reload==true){
						if(this.xmQuestion && this.xmQuestion.id){
							this.getXmQuestion(this.xmQuestion.id)
						}else{
							this.xmQuestionDb=true
						}
					}
				}
			 }
		},
		data() {
			return { 
				load:{list:false},
				 xmQuestionDb:null,
				 showInfo:false,
			}
		},//end data
		methods: { 
			  
			 getXmQuestion(id){
				
					this.load.list=true;
				 listXmQuestion({id:id}).then(res=>{
					
					this.load.list=false;
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmQuestionDb=res.data.data[0]
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
		mounted() {  
			if(this.xmQuestion && this.xmQuestion.id && this.reload==true){
				this.getXmQuestion(this.xmQuestion.id)
			}else if(( !this.xmQuestion ||! this.xmQuestion.id )&& this.reload==true){
				this.xmQuestionDb=null;
			}
		}
	}
</script>

<style scoped> 
</style>