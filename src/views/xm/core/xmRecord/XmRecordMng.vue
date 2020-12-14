<template>
	<section>
		 <xm-record v-if="selProject"  :visible="true" :project-id="selProject.id" obj-type='all'></xm-record>
		<xm-record v-else :visible="true"></xm-record>
	</section>
</template>

<script> 
	import Vue from 'vue'
	 
	import { mapGetters } from 'vuex' 
	import XmRecord from './XmRecord'
	if(!Vue.component("xm-record")){
		
		Vue.component('xm-record',XmRecord)
		Vue.use(XmRecord);
	}
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['selProject'],
		data() {
			return {
				 
			}
		},//end data
		methods: { 
			 
		},//end methods
		components: {  
		    
		},
		mounted() { 
			 
		}
	}

</script>

<style scoped>
   
</style>