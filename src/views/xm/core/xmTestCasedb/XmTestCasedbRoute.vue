<template>
	<section>
		 <xm-test-casedb-info v-if="xmTestCasedb" :xm-test-casedb="xmTestCasedb" :visible="showInfo" @edit-fields="onEditFields"></xm-test-casedb-info>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	 
	import {  listXmTestCasedb } from '@/api/xm/core/xmTestCasedb';
	import { mapGetters } from 'vuex'; 
	import XmTestCasedbInfo from './XmTestCasedbInfo'

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
				 xmTestCasedb:null,
				 showInfo:false,
			}
		},//end data
		methods: { 
			 
			 
			 initByQueryId(){
				 if(this.$route.query && this.$route.query.id){
					var localStorageXmTestCasedb=localStorage.getItem("xm-test-casedb-info")
					var xmTestCasedb=null;
					if(localStorageXmTestCasedb  && localStorageXmTestCasedb!='undefined'){
						xmTestCasedb=JSON.parse(localStorageXmTestCasedb)
						if(xmTestCasedb && xmTestCasedb.id==this.$route.query.id){
							this.xmTestCasedb=xmTestCasedb
							this.showInfo=true;
						}else{
							this.getXmTestCasedb(this.$route.query.id);
						}
					}else{
						this.getXmTestCasedb(this.$route.query.id);
					} 
				} 
			 },
			 getXmTestCasedb(id){
				 listXmTestCasedb({id:id}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){
						 this.xmTestCasedb=res.data.data[0]
						 localStorage.setItem("xm-test-casedb-info",JSON.stringify(this.xmTestCasedb)) 
						this.showInfo=true;
					 }else{

					 }
				 })
			 },
			 

			onEditFields(row) {
				Object.assign(this.xmTestCasedb, row);
				localStorage.setItem("xm-test-casedb-info",JSON.stringify(this.xmTestCasedb)) 
				this.$emit("edit-fields", row);
			},
			
		},//end methods
		components: {  
			XmTestCasedbInfo,
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