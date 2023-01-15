<template>
	<section>
		 <xm-record v-if="selProject"  :visible="true" :project-id="selProject.id"></xm-record>
		 <xm-record v-else-if="xmProduct"  :visible="true" :product-id="xmProduct.id"></xm-record>
		<xm-record v-else :visible="true"></xm-record>
	</section>
</template>

<script> 
	import Vue from 'vue'
	 
	import { mapGetters } from 'vuex' 
	import XmRecord from './XmRecord' 
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['selProject','xmProduct'],
		data() {
			return {
				 
			}
		},//end data
		methods: { 
			 
		},//end methods
		components: {  
		    XmRecord
		},
		mounted() { 
			 
		}
	}

</script>

<style scoped>
   
</style>