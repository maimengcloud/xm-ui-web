<template>
	<section>
		<el-row class="execution-set">
		<procinst-parames-start-set :procdef="procdef" :visible="flowStartVisible" :params="filters.params"    @cancel="handleCancel" @submit="afterEditSubmit"></procinst-parames-start-set>
		</el-row>
	</section>
</template>

<script>
	 
	import  ProcinstParamesStartSet from './ProcinstParamesStartSet';//
	
	export default {
		name:'ProcinstParamesStartSetRoute',
		data() {
			return {
				filters: {
					key: '', 
					params:null,
				},
				 procdef:{},
				 flowStartVisible:false,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 afterEditSubmit:function(){
				  this.$router.back(-1)
				 this.$store.dispatch('delVisitedViews', {path:'/mdp/workflow/ru/procinstParames/ProcinstParamesStartSetRoute',name:'ProcinstParamesStartSetRoute'})
				
			 },
			 handleCancel:function(){
				 this.$router.back(-1)
				this.$store.dispatch('delVisitedViews', {path:'/mdp/workflow/ru/procinstParames/ProcinstParamesStartSetRoute',name:'ProcinstParamesStartSetRoute'})
			 	
			 }
			
		},//end methods
		components: { 
		   ProcinstParamesStartSet
		    //在下面添加其它组件
		},
		mounted() {
			var key="ProcinstParamesStartSetRoute"
			if(this.$route.params.procdef){
				this.flowStartVisible=true;
				 this.procdef=this.$route.params.procdef
				 if(this.$route.params.params){
					 this.filters.params=this.$route.params.params
				 }
				 localStorage.setItem(key,JSON.stringify(this.$route.params));
			}else{
				var paramsStr= localStorage.getItem(key);
				var params=JSON.parse(paramsStr);
				this.procdef=params.procdef
				if(params.params){
					this.filters.params=params.params
				} 

			}
			
			 
		}
	}

</script>

<style scoped>
	.execution-set {
		margin-left: 20px;
		margin-top:20px;
	}
</style>