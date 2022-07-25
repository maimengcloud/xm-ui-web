<template> 
	<xm-menu-edit v-if="xmMenu" :xm-menu="xmMenu" :reload="reload" :visible="xmMenu&&xmMenu.menuId"></xm-menu-edit> 
</template>

<script>    
	export default {  
		props:['xmMenu','reload'],  
		data() {
			 return {
				
			 }
		},//end data
		methods: { 
			  
			
		},//end methods
		components: {  
			XmMenuEdit:()=>import('./XmMenuEdit')
			//在下面添加其它组件
		},  
		mounted() {  
			 
		}
	}
</script>

<style scoped> 
</style>