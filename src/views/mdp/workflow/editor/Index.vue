<template>
	<section>
		<el-row>
			<el-col :span="24">
			 
			 <iframe :src="workFlowEditorUrl" frameborder="0" scrolling="no" id="external-frame" style=""></iframe>
			</el-col>
		</el-row>
	</section>
</template>

<script>
import config from '@/api/mdp_pub/mdp_config';//

	export default {
		
		data() {
			return {
				
				/**begin **/
				workFlowEditorUrl:config.getWorkFlowEditorUrl()
				/**end **/
			}//end return
		},//end data
		methods: {
		
		},//end method
		components: {  
		    //'form-view-edit':FormViewEdit
		},
		mounted() {
			const oIframe = document.getElementById('external-frame');
		    const deviceWidth = document.documentElement.clientWidth;
		    const deviceHeight = document.documentElement.clientHeight;
		    oIframe.style.width = deviceWidth*0.8 + 'px';
		    oIframe.style.height = deviceHeight*0.80 + 'px'; 
		    console.log(oIframe);
		    console.log(document);
		    console.log(document.documentElement);
		}//end mounted
	}
	

</script>

<style scoped>

</style>