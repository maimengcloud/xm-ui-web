<template>
	<section>
		 <el-row>
			 <procdef-index :visible="true" ref="procdefListForStart" sub-op-type="select" fp="1" include-procdef="1" @select="onSelect"/>
		</el-row>
		<el-row>
			<mdp-dialog ref="startDialog" title="发起流程" width="80%">
				<template v-slot="{visible,data,dialog}">
				<procinst-parames-start-set :procdef="data.procdef" :visible="visible"
					@cancel="dialog.close()"></procinst-parames-start-set>
				</template>
          </mdp-dialog>
		</el-row>
	</section>
</template>

<script> 
	import ProcinstParamesStartSet from "../../ru/procinstParames/ProcinstParamesStartSet";
	import ProcdefIndex from '@/views/mdp/workflow/biz/bizModel/Index';//全局公共库  
	import { mapGetters } from 'vuex'  

	export default {
		name:'ProcdefListForStart',
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ]), 
		},
		watch:{ 
		},
		data() {
			return { 
				 
			}
		},//end data
		methods: { 
			  dataInit(){  
			  },
			  onSelect(procdef){
				  this.$refs['startDialog'].open({procdef:procdef})
			  }
			
		},//end methods
		components: {  
			ProcdefIndex,ProcinstParamesStartSet
		},
		activated:function(){   
		},
		mounted() { 
			 this.dataInit(); 
		}
	}

</script>

<style scoped> 
</style>